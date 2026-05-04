/**
 * capture_slide_drafts.js
 *
 * Screenshot HTML slide drafts so image models can inspect the whole slide
 * composition before generating text-free selectable design layers.
 *
 * USAGE:
 *   node capture_slide_drafts.js
 *   node capture_slide_drafts.js slide01.html
 *
 * INPUT:
 *   ../slides/*.html
 *
 * OUTPUT:
 *   ../drafts/[slide_name]_draft.png
 *   ../drafts/[slide_name]_objects.json
 *
 * OBJECT MANIFEST:
 *   Add data-object-id="object-name" to visual placeholders that should be
 *   decomposed later from an IMAGE-2 master visual layer.
 *
 *   <div class="orbit-zone" data-object-id="orbit-field" data-object-kind="decor"></div>
 *   <div class="flow-panel" data-object-id="flow-panel" data-object-kind="panel"></div>
 *   <div class="node" data-object-id="node-html" data-object-kind="node"></div>
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.resolve(__dirname, '../slides');
const DRAFT_DIR = path.resolve(__dirname, '../drafts');

async function captureDraft(browser, slidePath) {
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  try {
    await page.goto(`file://${slidePath}`);
    const bodyDimensions = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return {
        width: Math.round(parseFloat(style.width)),
        height: Math.round(parseFloat(style.height)),
      };
    });

    await page.setViewportSize(bodyDimensions);
    const name = `${path.basename(slidePath, '.html')}_draft.png`;
    const outputPath = path.join(DRAFT_DIR, name);
    await page.screenshot({ path: outputPath, fullPage: false });

    const objectManifest = await page.evaluate(() => {
      const slideRect = document.body.getBoundingClientRect();
      const scaleX = window.devicePixelRatio || 1;
      const scaleY = window.devicePixelRatio || 1;
      return Array.from(document.querySelectorAll('[data-object-id]')).map((el, index) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          id: el.getAttribute('data-object-id') || `object-${String(index + 1).padStart(2, '0')}`,
          kind: el.getAttribute('data-object-kind') || el.getAttribute('data-pptx-layer') || 'design',
          prompt: el.getAttribute('data-object-prompt') || '',
          refine: el.getAttribute('data-object-refine') || 'auto',
          pptxLayer: el.getAttribute('data-pptx-layer') || 'design',
          bboxCssPx: {
            x: rect.left - slideRect.left,
            y: rect.top - slideRect.top,
            width: rect.width,
            height: rect.height,
          },
          bboxScreenshotPx: {
            x: Math.round((rect.left - slideRect.left) * scaleX),
            y: Math.round((rect.top - slideRect.top) * scaleY),
            width: Math.round(rect.width * scaleX),
            height: Math.round(rect.height * scaleY),
          },
          zIndex: style.zIndex === 'auto' ? null : style.zIndex,
        };
      }).filter(item => item.bboxScreenshotPx.width > 0 && item.bboxScreenshotPx.height > 0);
    });

    const manifestName = `${path.basename(slidePath, '.html')}_objects.json`;
    const manifestPath = path.join(DRAFT_DIR, manifestName);
    fs.writeFileSync(manifestPath, JSON.stringify({
      slide: path.basename(slidePath),
      draftImage: name,
      screenshotScale: 2,
      slideSizeCssPx: bodyDimensions,
      objects: objectManifest,
    }, null, 2), 'utf8');

    console.log(`  captured ${name}`);
    console.log(`  wrote ${manifestName} (${objectManifest.length} object(s))`);
  } finally {
    await page.close();
  }
}

async function main() {
  if (!fs.existsSync(SLIDES_DIR)) {
    console.error(`Slides directory not found: ${SLIDES_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(DRAFT_DIR, { recursive: true });

  const target = process.argv[2];
  const slidePaths = target
    ? [path.resolve(SLIDES_DIR, target)]
    : fs.readdirSync(SLIDES_DIR)
      .filter(file => file.toLowerCase().endsWith('.html'))
      .sort()
      .map(file => path.join(SLIDES_DIR, file));

  for (const slidePath of slidePaths) {
    if (!fs.existsSync(slidePath)) {
      console.error(`Slide not found: ${slidePath}`);
      process.exit(1);
    }
  }

  const browser = await chromium.launch();
  try {
    console.log(`Capturing ${slidePaths.length} draft(s) -> ${DRAFT_DIR}`);
    for (const slidePath of slidePaths) {
      await captureDraft(browser, slidePath);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

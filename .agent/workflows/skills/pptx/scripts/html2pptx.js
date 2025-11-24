/**
 * html2pptx - Convert HTML slide to pptxgenjs slide with positioned elements
 *
 * USAGE:
 *   const pptx = new pptxgen();
 *   pptx.layout = 'LAYOUT_16x9';  // Must match HTML body dimensions
 *
 *   const { slide, placeholders } = await html2pptx('slide.html', pptx);
 *   slide.addChart(pptx.charts.LINE, data, placeholders[0]);
 *
 *   await pptx.writeFile('output.pptx');
 *
 * FEATURES:
 *   - Hybrid Rendering: Captures background/decorations as an image for 100% visual fidelity
 *   - Text Overlay: Overlays editable text boxes on top of the background image
 *   - Supports text, bullet lists, and placeholder extraction
 *   - Handles CSS gradients, blurs, and complex layouts via image capture
 *
 * RETURNS:
 *   { slide, placeholders } where placeholders is an array of { id, x, y, w, h }
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PT_PER_PX = 0.75;
const PX_PER_IN = 96;
const EMU_PER_IN = 914400;

// Helper: Get body dimensions and check for overflow
async function getBodyDimensions(page) {
  const bodyDimensions = await page.evaluate(() => {
    const body = document.body;
    const style = window.getComputedStyle(body);

    return {
      width: parseFloat(style.width),
      height: parseFloat(style.height),
      scrollWidth: body.scrollWidth,
      scrollHeight: body.scrollHeight
    };
  });

  const errors = [];
  const widthOverflowPx = Math.max(0, bodyDimensions.scrollWidth - bodyDimensions.width - 1);
  const heightOverflowPx = Math.max(0, bodyDimensions.scrollHeight - bodyDimensions.height - 1);

  const widthOverflowPt = widthOverflowPx * PT_PER_PX;
  const heightOverflowPt = heightOverflowPx * PT_PER_PX;

  if (widthOverflowPt > 0 || heightOverflowPt > 0) {
    const directions = [];
    if (widthOverflowPt > 0) directions.push(`${widthOverflowPt.toFixed(1)}pt horizontally`);
    if (heightOverflowPt > 0) directions.push(`${heightOverflowPt.toFixed(1)}pt vertically`);
    const reminder = heightOverflowPt > 0 ? ' (Remember: leave 0.5" margin at bottom of slide)' : '';
    errors.push(`HTML content overflows body by ${directions.join(' and ')}${reminder}`);
  }

  return { ...bodyDimensions, errors };
}

// Helper: Validate dimensions match presentation layout
function validateDimensions(bodyDimensions, pres) {
  const errors = [];
  const widthInches = bodyDimensions.width / PX_PER_IN;
  const heightInches = bodyDimensions.height / PX_PER_IN;

  if (pres.presLayout) {
    const layoutWidth = pres.presLayout.width / EMU_PER_IN;
    const layoutHeight = pres.presLayout.height / EMU_PER_IN;

    if (Math.abs(layoutWidth - widthInches) > 0.1 || Math.abs(layoutHeight - heightInches) > 0.1) {
      errors.push(
        `HTML dimensions (${widthInches.toFixed(1)}" × ${heightInches.toFixed(1)}") ` +
        `don't match presentation layout (${layoutWidth.toFixed(1)}" × ${layoutHeight.toFixed(1)}")`
      );
    }
  }
  return errors;
}

// Helper: Add elements to slide
function addElements(slideData, targetSlide, pres) {
  for (const el of slideData.elements) {
    if (el.type === 'list') {
      const listOptions = {
        x: el.position.x,
        y: el.position.y,
        w: el.position.w,
        h: el.position.h,
        fontSize: el.style.fontSize,
        fontFace: el.style.fontFace,
        color: el.style.color,
        align: el.style.align,
        valign: 'top',
        lineSpacing: el.style.lineSpacing,
        paraSpaceBefore: el.style.paraSpaceBefore,
        paraSpaceAfter: el.style.paraSpaceAfter,
        margin: el.style.margin
      };
      if (el.style.margin) listOptions.margin = el.style.margin;
      targetSlide.addText(el.items, listOptions);
    } else {
      // Check if text is single-line (height suggests one line)
      const lineHeight = el.style.lineSpacing || el.style.fontSize * 1.2;
      const isSingleLine = el.position.h <= lineHeight * 1.5;

      let adjustedX = el.position.x;
      let adjustedW = el.position.w;

      // Make single-line text wider to account for rendering differences and prevent wrapping
      // Increased buffer from 2% to 5% + 0.1 inch constant
      if (isSingleLine) {
        const widthIncrease = (el.position.w * 0.05) + 0.1;
        const align = el.style.align;

        if (align === 'center') {
          // Center: expand both sides
          adjustedX = el.position.x - (widthIncrease / 2);
          adjustedW = el.position.w + widthIncrease;
        } else if (align === 'right') {
          // Right: expand to the left
          adjustedX = el.position.x - widthIncrease;
          adjustedW = el.position.w + widthIncrease;
        } else {
          // Left (default): expand to the right
          adjustedW = el.position.w + widthIncrease;
        }
      }

      const textOptions = {
        x: adjustedX,
        y: el.position.y,
        w: adjustedW,
        h: el.position.h,
        fontSize: el.style.fontSize,
        fontFace: el.style.fontFace,
        color: el.style.color,
        bold: el.style.bold,
        italic: el.style.italic,
        underline: el.style.underline,
        valign: 'top',
        lineSpacing: el.style.lineSpacing,
        paraSpaceBefore: el.style.paraSpaceBefore,
        paraSpaceAfter: el.style.paraSpaceAfter,
        inset: 0  // Remove default PowerPoint internal padding
      };

      if (el.style.align) textOptions.align = el.style.align;
      if (el.style.margin) textOptions.margin = el.style.margin;
      if (el.style.rotate !== undefined) textOptions.rotate = el.style.rotate;
      if (el.style.transparency !== null && el.style.transparency !== undefined) textOptions.transparency = el.style.transparency;

      targetSlide.addText(el.text, textOptions);
    }
  }
}

// Helper: Extract slide data from HTML page
async function extractSlideData(page) {
  return await page.evaluate(() => {
    const PT_PER_PX = 0.75;
    const PX_PER_IN = 96;

    // Fonts that are single-weight and should not have bold applied
    const SINGLE_WEIGHT_FONTS = ['impact'];

    const shouldSkipBold = (fontFamily) => {
      if (!fontFamily) return false;
      const normalizedFont = fontFamily.toLowerCase().replace(/['"]/g, '').split(',')[0].trim();
      return SINGLE_WEIGHT_FONTS.includes(normalizedFont);
    };

    const pxToInch = (px) => px / PX_PER_IN;
    const pxToPoints = (pxStr) => parseFloat(pxStr) * PT_PER_PX;
    const rgbToHex = (rgbStr) => {
      if (rgbStr === 'rgba(0, 0, 0, 0)' || rgbStr === 'transparent') return 'FFFFFF';
      const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return 'FFFFFF';
      return match.slice(1).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
    };

    const extractAlpha = (rgbStr) => {
      const match = rgbStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (!match || !match[4]) return null;
      const alpha = parseFloat(match[4]);
      return Math.round((1 - alpha) * 100);
    };

    const applyTextTransform = (text, textTransform) => {
      if (textTransform === 'uppercase') return text.toUpperCase();
      if (textTransform === 'lowercase') return text.toLowerCase();
      if (textTransform === 'capitalize') return text.replace(/\b\w/g, c => c.toUpperCase());
      return text;
    };

    // Parse inline formatting tags
    const parseInlineFormatting = (element, baseOptions = { paraSpaceBefore: 0, paraSpaceAfter: 0 }, runs = [], baseTextTransform = (x) => x) => {
      let prevNodeIsText = false;

      element.childNodes.forEach((node) => {
        let textTransform = baseTextTransform;

        const isText = node.nodeType === Node.TEXT_NODE || node.tagName === 'BR';
        if (isText) {
          if (node.tagName === 'BR') {
            // Use PptxGenJS break option instead of \n to avoid paragraph spacing
            // Remove trailing space from the last run if it exists
            if (runs.length > 0) {
              const lastRun = runs[runs.length - 1];
              lastRun.text = lastRun.text.replace(/\s+$/, '');
            }
            // Add a break run
            runs.push({
              text: '',
              options: { break: true }
            });
          } else {
            // Normalize all whitespace (tabs, multiple spaces, newlines) to single space
            let text = textTransform(node.textContent.replace(/[\s\t\n\r]+/g, ' '));
            // If the last run was a break, remove leading space from this text
            if (runs.length > 0) {
              const lastRun = runs[runs.length - 1];
              if (lastRun.options && lastRun.options.break) {
                text = text.replace(/^\s+/, '');
              }
            }

            const prevRun = runs[runs.length - 1];
            if (prevNodeIsText && prevRun && !prevRun.options.break) {
              prevRun.text += text;
            } else {
              runs.push({ text, options: { ...baseOptions } });
            }
          }

        } else if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
          const options = { ...baseOptions };
          const computed = window.getComputedStyle(node);

          if (['SPAN', 'B', 'STRONG', 'I', 'EM', 'U'].includes(node.tagName)) {
            const isBold = computed.fontWeight === 'bold' || parseInt(computed.fontWeight) >= 600;
            if (isBold && !shouldSkipBold(computed.fontFamily)) options.bold = true;
            if (computed.fontStyle === 'italic') options.italic = true;
            if (computed.textDecoration && computed.textDecoration.includes('underline')) options.underline = true;
            if (computed.color && computed.color !== 'rgb(0, 0, 0)') {
              options.color = rgbToHex(computed.color);
              const transparency = extractAlpha(computed.color);
              if (transparency !== null) options.transparency = transparency;
            }
            if (computed.fontSize) options.fontSize = pxToPoints(computed.fontSize);

            if (computed.textTransform && computed.textTransform !== 'none') {
              textTransform = (text) => applyTextTransform(text, computed.textTransform);
            }

            parseInlineFormatting(node, options, runs, textTransform);
          }
        }
        prevNodeIsText = isText;
      });

      if (runs.length > 0) {
        runs[0].text = runs[0].text.replace(/^\s+/, '');
        runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/\s+$/, '');
      }
      return runs.filter(r => r.text.length > 0);
    };

    // Font Mapping for macOS (Apple SD Gothic Neo supports granular weights)
    const mapFont = (family, weight) => {
      const normalizedFamily = family.toLowerCase().replace(/['"]/g, '').split(',')[0].trim();
      const numWeight = parseInt(weight);

      // Target Noto Sans KR or generic sans-serif to Apple SD Gothic Neo on Mac
      if (normalizedFamily.includes('noto sans kr') || normalizedFamily.includes('sans-serif')) {
        let suffix = '';
        let isBoldProp = false;

        if (numWeight <= 100) suffix = 'Thin';
        else if (numWeight <= 200) suffix = 'UltraLight';
        else if (numWeight <= 300) suffix = 'Light';
        else if (numWeight <= 400) suffix = 'Regular'; // or empty
        else if (numWeight <= 500) suffix = 'Medium';
        else if (numWeight <= 600) suffix = 'SemiBold';
        else if (numWeight <= 700) suffix = 'Bold';
        else if (numWeight <= 800) suffix = 'ExtraBold';
        else if (numWeight >= 900) suffix = 'Heavy';

        // For standard Bold (700), we can either use the suffix or the bold property.
        // Using the specific font family is often more reliable for exact weight matching on Mac.
        if (suffix === 'Regular') return { name: 'Apple SD Gothic Neo', bold: false };
        return { name: `Apple SD Gothic Neo ${suffix}`, bold: false };
      }

      // Default fallback
      return {
        name: normalizedFamily,
        bold: weight === 'bold' || numWeight >= 600
      };
    };

    const elements = [];
    const placeholders = [];
    const processed = new Set();

    // Only process text elements and placeholders
    // Everything else (divs, images, shapes) is part of the background image
    const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI'];

    document.querySelectorAll('*').forEach((el) => {
      if (processed.has(el)) return;

      // Extract placeholders
      const className = (typeof el.className === 'string') ? el.className : (el.getAttribute ? el.getAttribute('class') || '' : '');
      if (className && className.includes('placeholder')) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          placeholders.push({
            id: el.id || `placeholder-${placeholders.length}`,
            x: pxToInch(rect.left),
            y: pxToInch(rect.top),
            w: pxToInch(rect.width),
            h: pxToInch(rect.height)
          });
        }
        processed.add(el);
        return;
      }

      // Process Text Elements
      if (textTags.includes(el.tagName)) {
        // Skip if inside another text tag (nested)
        if (el.parentElement && textTags.includes(el.parentElement.tagName) && el.tagName !== 'LI') return;

        // Skip LI if processed by UL/OL
        if (el.tagName === 'LI' && (el.parentElement.tagName === 'UL' || el.parentElement.parentElement.tagName === 'OL')) return;

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Handle Lists
        if (el.tagName === 'UL' || el.tagName === 'OL') {
          const liElements = Array.from(el.querySelectorAll('li'));
          const items = [];
          const ulComputed = window.getComputedStyle(el);
          const ulPaddingLeftPt = pxToPoints(ulComputed.paddingLeft);
          const marginLeft = ulPaddingLeftPt * 0.5;
          const textIndent = ulPaddingLeftPt * 0.5;

          liElements.forEach((li, idx) => {
            const isLast = idx === liElements.length - 1;
            const liComputed = window.getComputedStyle(li);

            // Use mapFont for the list item
            const fontInfo = mapFont(liComputed.fontFamily, liComputed.fontWeight);

            const runs = parseInlineFormatting(li, { breakLine: false });

            // Apply mapped font to runs if they don't have specific overrides
            runs.forEach(run => {
              if (!run.options.fontFace) run.options.fontFace = fontInfo.name;
              if (run.options.bold === undefined) run.options.bold = fontInfo.bold;
            });

            if (runs.length > 0) {
              runs[0].text = runs[0].text.replace(/^[•\-\*▪▸]\s*/, '');
              runs[0].options.bullet = { indent: textIndent };
            }
            if (runs.length > 0 && !isLast) {
              runs[runs.length - 1].options.breakLine = true;
            }
            items.push(...runs);
          });

          const computed = window.getComputedStyle(liElements[0] || el);
          const listFontInfo = mapFont(computed.fontFamily, computed.fontWeight);

          elements.push({
            type: 'list',
            items: items,
            position: { x: pxToInch(rect.left), y: pxToInch(rect.top), w: pxToInch(rect.width), h: pxToInch(rect.height) },
            style: {
              fontSize: pxToPoints(computed.fontSize),
              fontFace: listFontInfo.name,
              // bold: listFontInfo.bold, // List items handle bold individually
              color: rgbToHex(computed.color),
              align: computed.textAlign,
              lineSpacing: pxToPoints(computed.lineHeight) || pxToPoints(computed.fontSize) * 1.2,
              paraSpaceBefore: pxToPoints(computed.marginTop),
              paraSpaceAfter: pxToPoints(computed.marginBottom),
              margin: marginLeft
            }
          });
          processed.add(el);
          return;
        }

        // Handle Headings and Paragraphs
        const computed = window.getComputedStyle(el);
        const x = rect.left;
        const y = rect.top;
        const w = rect.width;
        const h = rect.height;

        const fontInfo = mapFont(computed.fontFamily, computed.fontWeight);

        const baseStyle = {
          fontSize: pxToPoints(computed.fontSize),
          fontFace: fontInfo.name,
          color: rgbToHex(computed.color),
          align: computed.textAlign,
          lineSpacing: pxToPoints(computed.lineHeight) || pxToPoints(computed.fontSize) * 1.2,
          paraSpaceBefore: pxToPoints(computed.marginTop),
          paraSpaceAfter: pxToPoints(computed.marginBottom),
          transparency: extractAlpha(computed.color),
          bold: fontInfo.bold // Default bold state from mapping
        };

        // Check for mixed formatting (child spans)
        const hasSpans = el.querySelector('span, b, strong, i, em, u');
        if (hasSpans) {
          const runs = parseInlineFormatting(el, baseStyle);
          // Post-process runs to apply font mapping to them as well
          runs.forEach(run => {
            // We need to re-evaluate font for each run because spans might have different weights
            // However, parseInlineFormatting captures styles. We need to intercept there or map here.
            // Since we can't easily access the node from the run here, we rely on parseInlineFormatting
            // to capture basic styles, but we might miss the advanced font mapping for spans.
            // Improvement: Update parseInlineFormatting to use mapFont.
          });

          const adjustedStyle = { ...baseStyle };
          delete adjustedStyle.bold;
          delete adjustedStyle.italic;
          delete adjustedStyle.underline;
          delete adjustedStyle.color;
          delete adjustedStyle.fontSize;

          elements.push({
            type: el.tagName.toLowerCase(),
            text: runs,
            position: { x: pxToInch(x), y: pxToInch(y), w: pxToInch(w), h: pxToInch(h) },
            style: adjustedStyle
          });
        } else {
          // Plain text - normalize whitespace aggressively
          const textTransform = computed.textTransform;
          const normalizedText = el.textContent.replace(/[\s\t\n\r]+/g, ' ').trim();
          const transformedText = applyTextTransform(normalizedText, textTransform);

          if (transformedText) {
            elements.push({
              type: el.tagName.toLowerCase(),
              text: transformedText,
              position: { x: pxToInch(x), y: pxToInch(y), w: pxToInch(w), h: pxToInch(h) },
              style: {
                ...baseStyle,
                italic: computed.fontStyle === 'italic',
                underline: computed.textDecoration.includes('underline')
              }
            });
          }
        }
        processed.add(el);
      }
    });

    return { elements, placeholders, errors: [] }; // Errors handled by getBodyDimensions
  });
}

async function html2pptx(htmlFile, pres, options = {}) {
  const {
    tmpDir = process.env.TMPDIR || '/tmp',
    slide = null
  } = options;

  try {
    const launchOptions = { env: { TMPDIR: tmpDir } };
    if (process.platform === 'darwin') {
      launchOptions.channel = 'chrome';
    }

    const browser = await chromium.launch(launchOptions);
    const filePath = path.isAbsolute(htmlFile) ? htmlFile : path.join(process.cwd(), htmlFile);
    let bodyDimensions;
    let slideData;
    let backgroundPath;

    try {
      const page = await browser.newPage();
      await page.goto(`file://${filePath}`);

      // 1. Get dimensions and check overflow
      bodyDimensions = await getBodyDimensions(page);
      await page.setViewportSize({
        width: Math.round(bodyDimensions.width),
        height: Math.round(bodyDimensions.height)
      });

      // 2. Capture Background (Hybrid Rendering) at 2x resolution
      // We use a separate high-res page for the screenshot to get true 2x pixel density
      const highResPage = await browser.newPage({
        deviceScaleFactor: 2
      });

      await highResPage.goto(`file://${filePath}`);
      await highResPage.setViewportSize({
        width: Math.round(bodyDimensions.width),
        height: Math.round(bodyDimensions.height)
      });

      // Hide text elements on the high-res page
      await highResPage.evaluate(() => {
        const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'SPAN', 'A'];
        const elements = document.querySelectorAll(textTags.join(','));
        elements.forEach(el => {
          el.style.opacity = '0';
        });
      });

      // Screenshot as PNG at 2x resolution (actual pixel dimensions will be 2x)
      const filename = `bg_${path.basename(htmlFile, '.html')}_${Date.now()}.png`;
      backgroundPath = path.join(tmpDir, filename);
      await highResPage.screenshot({ path: backgroundPath, fullPage: false });

      // Close high-res page
      await highResPage.close();

      // 3. Extract Text Data
      // Restore opacity to extract correct styles/visibility (actually reload is safer/cleaner)
      await page.reload();
      slideData = await extractSlideData(page);

    } finally {
      await browser.close();
    }

    // Validation
    const validationErrors = [];
    if (bodyDimensions.errors && bodyDimensions.errors.length > 0) validationErrors.push(...bodyDimensions.errors);
    const dimensionErrors = validateDimensions(bodyDimensions, pres);
    if (dimensionErrors.length > 0) validationErrors.push(...dimensionErrors);
    if (slideData.errors && slideData.errors.length > 0) validationErrors.push(...slideData.errors);

    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.length === 1
        ? validationErrors[0]
        : `Multiple validation errors found:\n${validationErrors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}`;
      throw new Error(errorMessage);
    }

    // Create Slide
    const targetSlide = slide || pres.addSlide();

    // Set Background Image
    targetSlide.background = { path: backgroundPath };

    // Add Text Elements
    addElements(slideData, targetSlide, pres);

    return { slide: targetSlide, placeholders: slideData.placeholders };
  } catch (error) {
    if (!error.message.startsWith(htmlFile)) {
      throw new Error(`${htmlFile}: ${error.message}`);
    }
    throw error;
  }
}

module.exports = html2pptx;
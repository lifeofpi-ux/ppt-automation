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
    if (el.type === 'image') {
      let imagePath = el.src;
      if (imagePath.startsWith('file://')) {
        imagePath = imagePath.replace('file://', '');
        imagePath = decodeURIComponent(imagePath);
      }

      targetSlide.addImage({
        path: imagePath,
        x: el.position.x,
        y: el.position.y,
        w: el.position.w,
        h: el.position.h
      });
    } else if (el.type === 'list') {
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
      const padL = el.style.paddingLeft || 0;
      const padR = el.style.paddingRight || 0;
      const hasCssPadding = (padL > 0 || padR > 0);

      // Pill-like = shrink-wrapped box (inline-flex/inline-block/inline) whose
      // visual centering comes from symmetric L/R padding. Only these may be
      // force-centered: centering absorbs small font-metric differences between
      // the browser and PowerPoint on both sides equally.
      // Stretched padded boxes (table cells, padded rows) must keep their CSS
      // alignment — force-centering them shifts text that is left-aligned in
      // HTML to the middle of the box.
      const isPillLike = hasCssPadding && el.style.shrinkWrapped && Math.abs(padL - padR) <= 1;

      const textOptions = {
        x: el.position.x,
        y: el.position.y,
        w: el.position.w,
        h: el.position.h,
        fontSize: el.style.fontSize,
        fontFace: el.style.fontFace,
        color: el.style.color,
        bold: el.style.bold,
        italic: el.style.italic,
        underline: el.style.underline,
        valign: 'top',
        // CSS letter-spacing must reach PPTX (spc) or tracked text renders at
        // a different width than the HTML layout and wraps/centers differently.
        charSpacing: el.style.charSpacing || undefined,
        // Pills: force native PPTX 1.0 line spacing multiple.
        // All other elements: use absolute pt value derived from CSS line-height.
        ...(isPillLike
          ? { lineSpacingMultiple: 1 }
          : { lineSpacing: el.style.lineSpacing }),
        // Use CSS padding as text body margin so pill/card text sits
        // at the same inset as the HTML layout. Falls back to 0 (removes
        // PowerPoint's default 0.1" body margin) when there is no padding.
        // pptxgenjs margin array order: [L, R, B, T] in POINTS.
        margin: (el.style.paddingLeft > 0 || el.style.paddingTop > 0)
          ? [el.style.paddingLeft, el.style.paddingRight, el.style.paddingBottom, el.style.paddingTop]
          : 0,
        align: isPillLike ? 'center' : (el.style.align || undefined),
        // Pills are single-line by design; PowerPoint's slightly wider font
        // metrics must not wrap their text onto a second line.
        wrap: !isPillLike,
        autoFit: false
      };

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
    const processed = new Set(); // Defined at the top to be accessible everywhere

    const PT_PER_PX = 0.75;
    const PX_PER_IN = 96;

    // Fonts that are single-weight and should not have bold applied
    const SINGLE_WEIGHT_FONTS = ['impact', 'pretendard semibold', 'pretendard variable', 'pretendard'];

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

    // Font Mapping — supports modern web fonts (Wanted Sans, Plus Jakarta Sans, SUIT, Inter) with fallback to Pretendard
    const mapFont = (family, weight) => {
      const numWeight = parseInt(weight) || 400;
      const cleanFamily = (family || '').toLowerCase().replace(/['"]/g, '');

      if (cleanFamily.includes('wanted sans')) {
        return { name: 'Wanted Sans', bold: numWeight >= 700 };
      }
      if (cleanFamily.includes('plus jakarta sans')) {
        return { name: 'Plus Jakarta Sans', bold: numWeight >= 700 };
      }
      if (cleanFamily.includes('suit')) {
        return { name: 'SUIT', bold: numWeight >= 700 };
      }
      if (cleanFamily.includes('inter')) {
        return { name: 'Inter', bold: numWeight >= 700 };
      }

      if (numWeight >= 900) return { name: 'Pretendard Black',      bold: false };
      if (numWeight >= 800) return { name: 'Pretendard ExtraBold',  bold: false };
      if (numWeight >= 700) return { name: 'Pretendard Bold',       bold: false };
      if (numWeight >= 600) return { name: 'Pretendard SemiBold',   bold: false };
      if (numWeight >= 500) return { name: 'Pretendard Medium',     bold: false };
      if (numWeight >= 400) return { name: 'Pretendard',            bold: false };
      if (numWeight >= 300) return { name: 'Pretendard Light',      bold: false };
      if (numWeight >= 200) return { name: 'Pretendard ExtraLight', bold: false };
      return                       { name: 'Pretendard Thin',       bold: false };
    };

    // Check if an element is visible
    const isVisible = (el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    };

    // Check if an element is block-level (conceptually, for our skipping logic)
    const isBlock = (el) => {
      const style = window.getComputedStyle(el);
      return ['block', 'flex', 'grid', 'table', 'table-row', 'list-item'].includes(style.display) ||
        ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'TABLE', 'TR', 'TD', 'TH', 'BLOCKQUOTE'].includes(el.tagName);
    };

    // Parse inline formatting, but SKIP block children (they will be processed as separate elements)
    const parseInlineContent = (element, baseOptions, runs = [], baseTextTransform = (x) => x) => {
      let prevNodeIsText = false;

      element.childNodes.forEach((node) => {
        // Skip comment nodes
        if (node.nodeType === Node.COMMENT_NODE) return;

        // 1. Text Nodes
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.textContent.replace(/[\s\t\n\r]+/g, ' '); // Normalize spaces
          // Apply transform
          text = baseTextTransform(text);

          if (text.length > 0) {
            runs.push({ text, options: { ...baseOptions } });
          }
        }
        // 2. Element Nodes
        else if (node.nodeType === Node.ELEMENT_NODE) {
          // If it's a BR, add a break
          if (node.tagName === 'BR') {
            // Use breakLine: true for pptxgenjs
            // Explicitly set spacing to 0 to avoid gaps
            runs.push({ text: '', options: { breakLine: true, paraSpaceBefore: 0, paraSpaceAfter: 0 } });
            return;
          }

          // If it's a BLOCK element, SKIP IT (it will be handled by the main loop)
          if (isBlock(node)) {
            return;
          }

          // It's an INLINE element (SPAN, STRONG, EM, etc.) -> Recurse
          // Mark as processed so the main loop doesn't pick it up as a standalone text container
          processed.add(node);

          const computed = window.getComputedStyle(node);
          const options = { ...baseOptions };
          let textTransform = baseTextTransform;

          // Update styles
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

          parseInlineContent(node, options, runs, textTransform);
        }
      });

      return runs;
    };


    const elements = [];
    const placeholders = [];
    // processed is defined at top

    document.querySelectorAll('*').forEach((el) => {
      if (processed.has(el)) return;
      if (!isVisible(el)) return;

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

      // Process Images - SKIPPED (Handled by captureStandaloneImages)
      // if (el.tagName === 'IMG') { ... }

      // Skip SVG and IMG elements (they are handled by captureStandaloneImages)
      if (el.tagName === 'SVG' || el.tagName === 'IMG' || el.closest('svg')) return;

      // Process Text: Check if this element has ANY direct text content
      let hasDirectText = false;
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
          hasDirectText = true;
        }
      });

      // Special case for empty UL/OL (they don't have text but contain LIs)
      // We process UL/OL specifically to handle bullets
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        // ... (List processing logic same as before) ...
        const liElements = Array.from(el.querySelectorAll(':scope > li')); // Only direct children
        if (liElements.length === 0) return;

        const items = [];
        const ulComputed = window.getComputedStyle(el);
        const ulPaddingLeftPt = pxToPoints(ulComputed.paddingLeft);
        const marginLeft = ulPaddingLeftPt * 0.5;
        const textIndent = ulPaddingLeftPt * 0.5;
        const rect = el.getBoundingClientRect();

        liElements.forEach((li, idx) => {
          // Mark LI as processed so it's not picked up by main loop
          processed.add(li);

          const isLast = idx === liElements.length - 1;
          const liComputed = window.getComputedStyle(li);
          const fontInfo = mapFont(liComputed.fontFamily, liComputed.fontWeight);

          // Parse content of LI
          const runs = parseInlineContent(li, { breakLine: false });

          runs.forEach(run => {
            if (!run.options.fontFace) run.options.fontFace = fontInfo.name;
            if (run.options.bold === undefined) run.options.bold = fontInfo.bold;
          });

          if (runs.length > 0) {
            // Clean leading bullets if they exist in text
            runs[0].text = runs[0].text.replace(/^[•\-\*▪▸]\s*/, '');
            runs[0].options.bullet = { indent: textIndent };
          }
          if (runs.length > 0 && !isLast) {
            runs[runs.length - 1].options.breakLine = true;
          }
          items.push(...runs);
        });

        if (items.length > 0) {
          const computed = window.getComputedStyle(liElements[0] || el);
          const listFontInfo = mapFont(computed.fontFamily, computed.fontWeight);

          elements.push({
            type: 'list',
            items: items,
            position: { x: pxToInch(rect.left), y: pxToInch(rect.top), w: pxToInch(rect.width), h: pxToInch(rect.height) },
            style: {
              fontSize: pxToPoints(computed.fontSize),
              fontFace: listFontInfo.name,
              color: rgbToHex(computed.color),
              align: computed.textAlign,
              lineSpacing: pxToPoints(computed.lineHeight) || pxToPoints(computed.fontSize) * 1.2,
              paraSpaceBefore: pxToPoints(computed.marginTop),
              paraSpaceAfter: pxToPoints(computed.marginBottom),
              margin: marginLeft
            }
          });
        }
        processed.add(el);
        // Don't mark children as processed, because LIs might have block children?
        // Actually for lists, we usually treat LI as the block.
        // If LI has block children, our parseInlineContent will skip them,
        // and they will be picked up by the main loop as independent elements.
        // This is tricky for lists. But standard lists usually just have text.
        // Let's assume standard lists for now.
        return;
      }


      // If it has direct text, it's a text container candidate
      if (hasDirectText) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const computed = window.getComputedStyle(el);
        const x = rect.left;
        const y = rect.top;
        const w = rect.width;
        const h = rect.height;

        const fontInfo = mapFont(computed.fontFamily, computed.fontWeight);

        // pptxgenjs only understands left/right/center/justify — CSS logical
        // values ('start'/'end') silently fall back to left, which flips
        // right-aligned text in RTL-agnostic markup. Map them explicitly.
        const mapAlign = (a) => {
          if (a === 'start') return 'left';
          if (a === 'end') return 'right';
          return ['left', 'right', 'center', 'justify'].includes(a) ? a : undefined;
        };

        const baseStyle = {
          fontSize: pxToPoints(computed.fontSize),
          fontFace: fontInfo.name,
          color: rgbToHex(computed.color),
          align: mapAlign(computed.textAlign),
          // Shrink-to-fit boxes (pills, buttons, tags) size themselves to their
          // text; stretched boxes (table cells, card rows) fill their parent.
          // addElements needs this to decide whether symmetric padding means
          // "visually centered" (pill) or "inset left-aligned text" (cell).
          shrinkWrapped: ['inline-flex', 'inline-block', 'inline'].includes(computed.display),
          // Store absolute pt line spacing from CSS for non-pill elements.
          // Pills override this with lineSpacingMultiple: 1 in addElements.
          lineSpacing: (parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2) * PT_PER_PX,
          // CSS letter-spacing → pptxgenjs charSpacing (pt). "normal" parses as NaN → 0.
          charSpacing: parseFloat(computed.letterSpacing) * PT_PER_PX || 0,
          transparency: extractAlpha(computed.color),
          bold: fontInfo.bold,
          paddingLeft:   pxToPoints(computed.paddingLeft)   || 0,
          paddingTop:    pxToPoints(computed.paddingTop)    || 0,
          paddingRight:  pxToPoints(computed.paddingRight)  || 0,
          paddingBottom: pxToPoints(computed.paddingBottom) || 0
        };

        // Apply the block element's own text-transform as the base transform
        // so direct text nodes (not just inline children) get uppercased etc.
        const baseTextTransform = computed.textTransform && computed.textTransform !== 'none'
          ? (text) => applyTextTransform(text, computed.textTransform)
          : (x) => x;

        // Collect all inline text runs
        const runs = parseInlineContent(el, baseStyle, [], baseTextTransform);

        // Fold empty break-line runs into the PREVIOUS run so pptxgenjs
        // starts a new paragraph AFTER that run. pptxgenjs breakLine means
        // "new line begins after this run", so the flag must go on the run
        // that PRECEDES the break, not the one that follows it.
        const merged = [];
        for (const run of runs) {
          if (run.text === '' && run.options.breakLine) {
            if (merged.length > 0) {
              const prev = merged[merged.length - 1];
              merged[merged.length - 1] = { ...prev, options: { ...prev.options, breakLine: true } };
            }
            continue;
          }
          merged.push(run);
        }

        const validRuns = merged.filter(r => r.text.trim().length > 0 || r.options.breakLine);

        if (validRuns.length > 0) {
          elements.push({
            type: 'text',
            text: validRuns,
            position: { x: pxToInch(x), y: pxToInch(y), w: pxToInch(w), h: pxToInch(h) },
            style: baseStyle
          });
        }

        // Mark this element as processed
        processed.add(el);
      }
    });

    return { elements, placeholders, errors: [] };
  });
}

// Helper: Capture specific UI components as images (Skeleton Strategy)
async function captureComponents(page, tmpDir, htmlFile) {
  const components = [];

  const componentElements = await page.evaluate(() => {
    const els = [];

    const hasVisualStyling = (el, computed) => {
      if (el.tagName === 'BODY' || el.tagName === 'HTML') return false;
      const hasBackground = computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent';
      const hasBackgroundImage = computed.backgroundImage !== 'none';
      const hasBorder = computed.borderWidth !== '0px' || computed.borderTopWidth !== '0px' ||
        computed.borderRightWidth !== '0px' || computed.borderBottomWidth !== '0px' || computed.borderLeftWidth !== '0px';
      const hasBoxShadow = computed.boxShadow !== 'none';
      const hasBorderRadius = computed.borderRadius !== '0px';
      // NOTE: dot access (computed.webkitBackdropFilter) returns undefined in
      // Chromium, and `undefined !== 'none'` is true — which classified EVERY
      // element as a visual component and rasterized the whole page as dozens
      // of overlapping PNG layers. Use getPropertyValue with a 'none' default.
      const backdropFilter = computed.backdropFilter || 'none';
      const webkitBackdropFilter = computed.getPropertyValue('-webkit-backdrop-filter') || 'none';
      const hasBackdropFilter = backdropFilter !== 'none' || webkitBackdropFilter !== 'none';
      return hasBackground || hasBackgroundImage || hasBorder || hasBoxShadow ||
        (hasBorderRadius && (hasBackground || hasBackgroundImage)) || hasBackdropFilter;
    };

    const isDecorativeElement = (el, computed) => {
      const position = computed.position;
      if (position !== 'absolute' && position !== 'fixed') return false;
      return hasVisualStyling(el, computed);
    };

    const isSignificantSize = (rect) => rect.width >= 1 && rect.height >= 1;

    // Body background color and slide bounds for redundancy check.
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const bodyRect = document.body.getBoundingClientRect();

    // A full-slide container whose background matches the body adds an identical
    // layer on top of the global background capture — skip it.
    // Containers with a background-image (e.g. dot-grid texture) are NOT
    // redundant even when their color matches the body: skipping them drops
    // the texture entirely because the global background hides all content.
    const isRedundantFullSlide = (computed, rect) => {
      if (computed.backgroundColor !== bodyBg) return false;
      if (computed.backgroundImage !== 'none') return false;
      const margin = 4; // px tolerance for sub-pixel layout
      return rect.width >= bodyRect.width - margin && rect.height >= bodyRect.height - margin;
    };

    // First pass: collect all elements that should be captured.
    const capturedSet = new Set();

    document.querySelectorAll('*').forEach((el, index) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      if (computed.display === 'none' || computed.visibility === 'hidden' ||
        computed.opacity === '0' || rect.width === 0 || rect.height === 0) return;

      const explicitLayer = (el.getAttribute('data-pptx-layer') || '').toLowerCase();
      const explicitCapture = (el.getAttribute('data-pptx-capture') || '').toLowerCase();
      const forceCapture = ['design', 'component', 'image', 'visual', 'asset', 'overlay'].includes(explicitLayer) ||
        ['true', 'component', 'image', 'visual', 'asset', 'overlay'].includes(explicitCapture);
      const skipCapture = ['none', 'text', 'ignore', 'background'].includes(explicitLayer) ||
        ['false', 'none', 'ignore'].includes(explicitCapture);

      if (skipCapture) return;

      const isTextElement = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'STRONG', 'EM', 'B', 'I'].includes(el.tagName);
      if (isTextElement && !hasVisualStyling(el, computed) && !forceCapture) return;

      // In border-collapse tables Chrome reports the collapsed cell borders as
      // computed border-width on TABLE/TBODY/TR too, so all three would be
      // captured as components stacked on the exact same box as the TD/TH
      // captures — duplicate layers. Row containers never own visuals; tables
      // only when they have a background or shadow of their own.
      if (!forceCapture) {
        if (['TBODY', 'THEAD', 'TFOOT', 'TR'].includes(el.tagName)) return;
        if (el.tagName === 'TABLE') {
          const hasOwnVisual = (computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') ||
            computed.backgroundImage !== 'none' || computed.boxShadow !== 'none';
          if (!hasOwnVisual) return;
        }
      }

      const shouldCapture = forceCapture ||
        (hasVisualStyling(el, computed) && isSignificantSize(rect)) ||
        isDecorativeElement(el, computed);

      if (!shouldCapture) return;

      // Drop non-forced elements whose background duplicates the global background.
      if (!forceCapture && isRedundantFullSlide(computed, rect)) return;

      if (!el.id) el.id = `pptx-comp-${index}`;
      capturedSet.add(el.id);
      // Single source of truth: mark the element so the standalone-image pass
      // and the global-background pass can consult this exact set instead of
      // re-running (and drifting from) the heuristics above. Any element
      // captured here must appear in the PPTX exactly once — as its own PNG.
      el.dataset.pptxCaptured = '1';
      els.push({
        id: el.id,
        width: rect.width,
        height: rect.height,
        className: el.className || '',
        tagName: el.tagName,
        layer: explicitLayer || explicitCapture || 'auto',
        capturedDescendants: []
      });
    });

    // Second pass: for each captured element, record which of its descendants are
    // also being captured so they can be hidden during skeleton capture.
    // This prevents a child component's visual from appearing in its parent's
    // skeleton PNG (which would cause it to render twice in the final PPTX).
    els.forEach(comp => {
      const el = document.getElementById(comp.id);
      if (!el) return;
      el.querySelectorAll('*').forEach(child => {
        if (child.id && capturedSet.has(child.id)) {
          comp.capturedDescendants.push(child.id);
        }
      });
    });

    return els;
  });

  for (const comp of componentElements) {
    // 1. ISOLATE the component, then hide its text and captured descendants.
    //
    //    Isolation is essential: Playwright's element screenshot captures the
    //    element's bounding-box region of the page, INCLUDING everything
    //    painted behind/around it (body background, background images,
    //    overlapping siblings) — omitBackground only clears the page canvas.
    //    Without isolation every component PNG bakes in a slice of the
    //    background, so semi-transparent cards double-composite and
    //    overlapping decorations get duplicated across multiple layers.
    //
    //    A `* { visibility: hidden }` stylesheet hides everything (lower
    //    specificity than inline styles), then the component subtree is
    //    re-shown via inline visibility. Original inline values are saved to
    //    data attributes so the restore step puts back exactly what the
    //    author wrote.
    await page.evaluate((comp) => {
      const save = (node, prop, datasetKey, value) => {
        if (node.dataset[datasetKey] === undefined) node.dataset[datasetKey] = node.style[prop];
        node.style[prop] = value;
      };

      const el = document.getElementById(comp.id);
      if (!el) return;

      // (a) Hide the whole page; make the canvas transparent.
      const iso = document.createElement('style');
      iso.id = 'pptx-isolation-style';
      iso.textContent = '* { visibility: hidden; }';
      document.head.appendChild(iso);
      save(document.documentElement, 'background', 'pptxPrevBg', 'transparent');
      save(document.body, 'background', 'pptxPrevBg', 'transparent');

      // (b) Re-show this component's subtree (inline beats the stylesheet).
      save(el, 'visibility', 'pptxPrevVisibility', 'visible');
      el.querySelectorAll('*').forEach(child => {
        save(child, 'visibility', 'pptxPrevVisibility', 'visible');
      });

      // (c) Hide text so only the skeleton (fills, borders, shadows) remains.
      save(el, 'color', 'pptxPrevColor', 'transparent');
      save(el, 'webkitTextFillColor', 'pptxPrevFill', 'transparent');

      const contentTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'SPAN', 'A', 'STRONG', 'EM', 'B', 'I', 'DIV', 'TD', 'TH', 'BUTTON', 'LABEL', 'DT', 'DD', 'BLOCKQUOTE', 'FIGCAPTION', 'IMG', 'SVG'];
      el.querySelectorAll(contentTags.join(',')).forEach(child => {
        if (child.tagName !== 'DIV') {
          // save() keeps the FIRST saved value, so the original inline
          // visibility (saved in step b) survives this second write.
          save(child, 'visibility', 'pptxPrevVisibility', 'hidden');
          child.style.visibility = 'hidden';
        }
        save(child, 'color', 'pptxPrevColor', 'transparent');
        save(child, 'webkitTextFillColor', 'pptxPrevFill', 'transparent');
      });

      // (d) Hide descendant components that will be captured in their own
      //     pass so they don't appear inside this element's skeleton PNG.
      comp.capturedDescendants.forEach(childId => {
        const child = document.getElementById(childId);
        if (child) save(child, 'opacity', 'pptxPrevOpacity', '0');
      });
    }, comp);

    // 2. Screenshot the component (isolated, on a transparent canvas).
    const elementHandle = await page.$(`#${comp.id}`);
    if (elementHandle) {
      const filename = `comp_${comp.id}_${Date.now()}.png`;
      const savePath = path.join(tmpDir, filename);
      await elementHandle.screenshot({ path: savePath, omitBackground: true });

      const position = await page.evaluate((id) => {
        const rect = document.getElementById(id).getBoundingClientRect();
        const PX_PER_IN = 96;
        return {
          x: rect.left / PX_PER_IN,
          y: rect.top / PX_PER_IN,
          w: rect.width / PX_PER_IN,
          h: rect.height / PX_PER_IN
        };
      }, comp.id);

      components.push({ type: 'image', path: savePath, ...position });
    }

    // 3. Restore everything to the original inline values saved in step 1.
    await page.evaluate((comp) => {
      const restore = (node, prop, datasetKey) => {
        if (node.dataset[datasetKey] !== undefined) {
          node.style[prop] = node.dataset[datasetKey];
          delete node.dataset[datasetKey];
        }
      };

      const iso = document.getElementById('pptx-isolation-style');
      if (iso) iso.remove();
      restore(document.documentElement, 'background', 'pptxPrevBg');
      restore(document.body, 'background', 'pptxPrevBg');

      const el = document.getElementById(comp.id);
      if (!el) return;
      restore(el, 'visibility', 'pptxPrevVisibility');
      restore(el, 'color', 'pptxPrevColor');
      restore(el, 'webkitTextFillColor', 'pptxPrevFill');

      el.querySelectorAll('*').forEach(child => {
        restore(child, 'visibility', 'pptxPrevVisibility');
        restore(child, 'color', 'pptxPrevColor');
        restore(child, 'webkitTextFillColor', 'pptxPrevFill');
        restore(child, 'opacity', 'pptxPrevOpacity');
      });

      comp.capturedDescendants.forEach(childId => {
        const child = document.getElementById(childId);
        if (child) restore(child, 'opacity', 'pptxPrevOpacity');
      });
    }, comp);
  }

  return components;
}

// Helper: Capture stand-alone SVGs and Images as transparent PNGs
async function captureStandaloneImages(page, tmpDir) {
  const images = [];

  // Find all SVGs and IMGs that are NOT hidden (part of the visible slide)
  const imageElements = await page.evaluate(() => {
    const els = [];
    document.querySelectorAll('svg, img').forEach((el, index) => {
      // Skip if hidden
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      const explicitLayer = (el.getAttribute('data-pptx-layer') || '').toLowerCase();
      const explicitCapture = (el.getAttribute('data-pptx-capture') || '').toLowerCase();
      const handledByComponentCapture = ['design', 'component', 'image', 'visual', 'asset', 'overlay'].includes(explicitLayer) ||
        ['true', 'component', 'image', 'visual', 'asset', 'overlay'].includes(explicitCapture);
      if (handledByComponentCapture) return;

      // Background-layer images live in the global background screenshot —
      // capturing them here too would stack a duplicate copy on top of it.
      const isBackgroundLayer = ['background', 'bg'].includes(explicitLayer) ||
        ['background', 'bg'].includes(explicitCapture);
      if (isBackgroundLayer) return;

      // Skip images already captured as styled components (border-radius,
      // border, shadow, etc.) by captureComponents — capturing them again
      // here would produce two stacked copies of the same image.
      if (el.dataset.pptxCaptured === '1') return;

      // DO NOT skip images inside components - they need to be captured separately
      // The component skeleton capture hides these images, so they won't be duplicated

      if (!el.id) el.id = `pptx-img-${index}`;

      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        els.push({
          id: el.id,
          width: rect.width,
          height: rect.height
        });
      }
    });
    return els;
  });

  for (const img of imageElements) {
    const elementHandle = await page.$(`#${img.id}`);
    if (elementHandle) {
      const filename = `img_${img.id}_${Date.now()}.png`;
      const savePath = path.join(tmpDir, filename);

      // Isolate the image before capturing: element screenshots include
      // whatever is painted behind the element, so without isolation a
      // transparent icon PNG bakes in a slice of the page background.
      await page.evaluate((id) => {
        const save = (node, prop, datasetKey, value) => {
          if (node.dataset[datasetKey] === undefined) node.dataset[datasetKey] = node.style[prop];
          node.style[prop] = value;
        };
        const el = document.getElementById(id);
        if (!el) return;
        const iso = document.createElement('style');
        iso.id = 'pptx-isolation-style';
        iso.textContent = '* { visibility: hidden; }';
        document.head.appendChild(iso);
        save(document.documentElement, 'background', 'pptxPrevBg', 'transparent');
        save(document.body, 'background', 'pptxPrevBg', 'transparent');
        save(el, 'visibility', 'pptxPrevVisibility', 'visible');
        el.querySelectorAll('*').forEach(child => save(child, 'visibility', 'pptxPrevVisibility', 'visible'));
      }, img.id);

      // Capture with transparency
      await elementHandle.screenshot({ path: savePath, omitBackground: true });

      await page.evaluate((id) => {
        const restore = (node, prop, datasetKey) => {
          if (node.dataset[datasetKey] !== undefined) {
            node.style[prop] = node.dataset[datasetKey];
            delete node.dataset[datasetKey];
          }
        };
        const iso = document.getElementById('pptx-isolation-style');
        if (iso) iso.remove();
        restore(document.documentElement, 'background', 'pptxPrevBg');
        restore(document.body, 'background', 'pptxPrevBg');
        const el = document.getElementById(id);
        if (!el) return;
        restore(el, 'visibility', 'pptxPrevVisibility');
        el.querySelectorAll('*').forEach(child => restore(child, 'visibility', 'pptxPrevVisibility'));
      }, img.id);

      const position = await page.evaluate((id) => {
        const rect = document.getElementById(id).getBoundingClientRect();
        const PT_PER_PX = 0.75;
        const PX_PER_IN = 96;
        return {
          x: rect.left / PX_PER_IN,
          y: rect.top / PX_PER_IN,
          w: rect.width / PX_PER_IN,
          h: rect.height / PX_PER_IN
        };
      }, img.id);

      images.push({
        type: 'image',
        path: savePath,
        ...position
      });
    }
  }
  return images;
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
    let componentImages = [];
    let standaloneImages = [];

    try {
      const page = await browser.newPage({ deviceScaleFactor: 2 });
      await page.goto(`file://${filePath}`);

      // 1. Get dimensions and check overflow
      bodyDimensions = await getBodyDimensions(page);
      await page.setViewportSize({
        width: Math.round(bodyDimensions.width),
        height: Math.round(bodyDimensions.height)
      });

      // 2. Capture Components (Skeleton Strategy)
      // We capture specific UI elements as images (with text hidden)
      componentImages = await captureComponents(page, tmpDir, htmlFile);

      // 3. Capture Standalone Images (SVG & IMG)
      standaloneImages = await captureStandaloneImages(page, tmpDir);

      // 4. Capture Global Background
      // Hide everything that lives on another layer, leaving only the true
      // background. Instead of re-running the component heuristics (which
      // historically drifted from captureComponents and caused elements to be
      // captured as a component PNG AND remain in this screenshot — i.e.
      // duplicated layers), consult the data-pptx-captured marks set by
      // captureComponents: exactly what was captured gets hidden here.
      //
      // visibility (not opacity) is used so that background-layer elements
      // nested inside hidden containers can be re-shown — a descendant's
      // visibility:visible overrides a hidden ancestor, which opacity can't do.
      await page.evaluate(() => {
        const contentTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'SPAN', 'A', 'IMG', 'SVG', 'DIV', 'TD', 'TH', 'BUTTON', 'LABEL', 'DT', 'DD', 'BLOCKQUOTE', 'FIGCAPTION'];
        const isBgLayer = (el) => {
          const layer = (el.getAttribute('data-pptx-layer') || '').toLowerCase();
          const capture = (el.getAttribute('data-pptx-capture') || '').toLowerCase();
          return ['background', 'bg'].includes(layer) || ['background', 'bg'].includes(capture);
        };

        // Hide content elements (text, images, containers).
        document.querySelectorAll(contentTags.join(',')).forEach(el => {
          if (isBgLayer(el)) return;
          el.style.visibility = 'hidden';
        });

        // Hide everything captureComponents captured — single source of truth.
        document.querySelectorAll('[data-pptx-captured="1"]').forEach(el => {
          el.style.visibility = 'hidden';
        });

        // Re-show background-layer elements even when an ancestor was hidden.
        document.querySelectorAll('[data-pptx-layer], [data-pptx-capture]').forEach(el => {
          if (isBgLayer(el)) el.style.visibility = 'visible';
        });
      });

      const filename = `bg_${path.basename(htmlFile, '.html')}_${Date.now()}.png`;
      backgroundPath = path.join(tmpDir, filename);
      await page.screenshot({ path: backgroundPath, fullPage: false });

      // 5. Extract Text Data
      // Reload to get a clean state for text extraction
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

    // Layer 1: Global Background
    targetSlide.background = { path: backgroundPath };

    // Layer 2: Components (Skeletons)
    for (const comp of componentImages) {
      targetSlide.addImage({
        path: comp.path,
        x: comp.x,
        y: comp.y,
        w: comp.w,
        h: comp.h
      });
    }

    // Layer 3: Standalone Images (SVG & IMG)
    for (const img of standaloneImages) {
      targetSlide.addImage({
        path: img.path,
        x: img.x,
        y: img.y,
        w: img.w,
        h: img.h
      });
    }

    // Layer 4: Text and Standalone Images
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

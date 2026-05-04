# AI Image Generation for PPTX Presentations

How to generate slide backgrounds, section dividers, bento card textures, and draft-aware selectable design layers using OpenAI image models.

---

## Setup

```bash
npm install openai sharp

# Windows
set OPENAI_API_KEY=sk-...

# macOS / Linux
export OPENAI_API_KEY="sk-..."
```

---

## Quick Start

1. Copy the template to your project:
   ```bash
   cp .agent/workflows/skills/pptx/scripts/generate_design_assets.template.js \
      workspace/[project]/assets/scripts/generate_design_assets.js
   ```

2. Edit the `DESIGN` block and `ASSETS` array for your project's visual identity.

3. Run:
   ```bash
   node workspace/[project]/assets/scripts/generate_design_assets.js
   ```

4. Reference in HTML slides:
   ```css
   .bg { background: #000 url('../images/bg_cover.png') center/cover no-repeat; }
   ```

For premium editable decks, also create a wireframe HTML draft and screenshot it to:

```text
workspace/[project]/assets/drafts/slideNN_draft.png
```

Use the helper template:

```bash
cp .agent/workflows/skills/pptx/scripts/capture_slide_drafts.template.js \
   workspace/[project]/assets/scripts/capture_slide_drafts.js
node workspace/[project]/assets/scripts/capture_slide_drafts.js
```

Then add `ASSETS` entries with `inputImage: 'slideNN_draft.png'` so the image model can inspect the whole slide composition and generate text-free visual layers.

---

## SAM2 Object Decomposition

Use this when IMAGE-2 should create a detailed text-free slide structure, but the final PPTX must contain separate selectable design objects.

### Concept

```text
HTML object placeholders
-> slideNN_objects.json bbox manifest
-> IMAGE-2 slideNN_visual_master.png
-> bbox crop / optional SAM2 box mask refinement
-> assets/objects/slideNN/*.png
-> final HTML layers
-> editable PPTX
```

SAM2 is not the planner. The HTML object manifest is the planner. SAM2 only refines the pixel mask for planned objects.

### Mark Objects In HTML

```html
<div class="flow-panel"
     data-object-id="flow-panel"
     data-object-kind="panel"
     data-object-refine="bbox"></div>

<div class="orbit-field"
     data-object-id="orbit-field"
     data-object-kind="decor"
     data-object-refine="sam2"></div>

<div class="glow-node"
     data-object-id="glow-node-01"
     data-object-kind="glow"
     data-object-refine="sam2"></div>
```

Use `data-object-refine="bbox"` for rectangular cards/panels. Use `sam2` or `auto` for curved, glowing, irregular, or overlapping visuals.

### Generate Draft Manifest

```bash
cp .agent/workflows/skills/pptx/scripts/capture_slide_drafts.template.js \
   workspace/[project]/assets/scripts/capture_slide_drafts.js
node workspace/[project]/assets/scripts/capture_slide_drafts.js slide03.html
```

Outputs:

```text
workspace/[project]/assets/drafts/slide03_draft.png
workspace/[project]/assets/drafts/slide03_objects.json
```

### Generate IMAGE-2 Master Visual

Create an asset named:

```text
workspace/[project]/assets/images/slide03_visual_master.png
```

Prompt rule:

```text
NO text, NO words, NO letters, NO numbers, NO labels.
Use the attached slide wireframe as exact layout reference.
Create the complete text-free visual design structure for all marked object zones.
Keep text zones empty. Do not render logos or pseudo-text.
```

### Decompose Objects

Copy the template:

```bash
cp .agent/workflows/skills/pptx/scripts/decompose_visual_objects.template.py \
   workspace/[project]/assets/scripts/decompose_visual_objects.py
```

Run bbox-only:

```bash
python workspace/[project]/assets/scripts/decompose_visual_objects.py --slide slide03
```

Run with SAM2 refinement when installed:

```bash
set SAM2_CHECKPOINT=C:\models\sam2.1_hiera_small.pt
set SAM2_MODEL_CFG=configs/sam2.1/sam2.1_hiera_s.yaml
python workspace/[project]/assets/scripts/decompose_visual_objects.py --slide slide03 --sam2
```

By default, object PNGs preserve the source bbox canvas size so they can be reinserted at the original coordinates without losing offset. Use `--trim-alpha` only when you also handle the resulting offset or when exact original positioning is not needed.

Outputs:

```text
workspace/[project]/assets/objects/slide03/01_flow-panel.png
workspace/[project]/assets/objects/slide03/02_orbit-field.png
workspace/[project]/assets/objects/slide03/slide03_decomposition.json
```

### Reinsert In Final HTML

```html
<img class="object-layer flow-panel-layer"
     data-pptx-layer="design"
     src="../objects/slide03/01_flow-panel.png" />
<img class="object-layer orbit-layer"
     data-pptx-layer="design"
     src="../objects/slide03/02_orbit-field.png" />
```

Keep editable text above these layers.

---

## Asset Types Reference

| Asset Name | Size | Purpose | Slide Type |
|---|---|---|---|
| `bg_cover.png` | 1920×1080 | Title slide background | Cover / opener |
| `bg_section_[n].png` | 1920×1080 | Chapter divider background | Interstitial divider |
| `bg_content_light.png` | 1920×1080 | Subtle light slide texture | Light content slides |
| `bg_content_dark.png` | 1920×1080 | Subtle dark slide texture | Dark content slides |
| `bg_card_glass.png` | 1024×1024 | Frosted glass card texture | Light bento items |
| `bg_card_dark.png` | 1024×1024 | Dark glass card texture | Dark bento items |
| `bg_card_accent.png` | 1024×1024 | Accent card background | Highlighted items |
| `slideNN_visual_master.png` | 1920×1080 | Text-free full-slide detailed visual for SAM2/bbox decomposition | Structured premium slides |
| `slideNN_[object]_layer.png` | 1920×1080 transparent PNG | Selectable draft-aware visual overlay | Any slide |

---

## HTML Integration Patterns

### Draft-Aware Selectable Layer

Use this for high-end visuals that should remain independently selectable in PowerPoint:

```javascript
{
  name: 'slide02_hero_layer',
  inputImage: 'slide02_draft.png',
  background: 'transparent',
  prompt: `${DESIGN.noText}. Use the attached full-slide wireframe as layout reference only.
    Create the premium hero visual for the empty right-side skeleton region.
    Keep all text areas completely empty and transparent. Do not draw labels,
    captions, fake interface text, letters, or numbers. Preserve the draft layout.
    Output a full-slide transparent PNG overlay with transparent empty space outside
    the target visual region. ${DESIGN.palette}. ${DESIGN.mood}.`
}
```

```html
<img class="design-layer"
     data-pptx-layer="design"
     src="../images/slide02_hero_layer.png" />
```

```css
.design-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
```

The generated image becomes its own selectable PNG object in PowerPoint. Put editable slide text in normal `<h1>`, `<p>`, `<ul>`, or `<ol>` elements above the design layer.

### Title / Cover Slide

```html
<body>
<div class="bg"></div>   <!-- AI image layer -->
<div class="overlay"></div>  <!-- Gradient overlay for contrast -->
<div class="content">...</div>
</body>
```

```css
body { position: relative; }
.bg {
  position: absolute; inset: 0;
  /* CSS color fallback + AI image */
  background: #000 url('../images/bg_cover.png') center/cover no-repeat;
}
.overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    105deg,
    rgba(0,0,0,0.92) 0%,
    rgba(0,0,0,0.80) 40%,
    rgba(0,0,0,0.42) 65%,
    rgba(0,0,0,0.18) 100%
  );
}
.content { position: relative; z-index: 1; ... }
```

**Rule**: Left 55–65% must stay dark for text. Right portion can show the AI imagery.

### Section Divider Slide

Same structure as cover, but use `bg_section_[n].png`. Each chapter gets its own divider with:
- `class="chapter-eyebrow"`: "Chapter 01", "Chapter 02" etc.
- `<div class="rule">`: A thin horizontal line (color can match chapter accent)
- Large `<h1>` chapter name
- One-line `<p class="desc">` descriptor
- Bottom `<div class="timeline-tag">` with date range

See `workspace/frontend-history/assets/slides/slide_sec01.html` for a working example.

### Bento Grid Card Texture

```css
/* Light card: AI frosted glass over white tint */
.bento-item {
  background: rgba(255,255,255,0.92) url('../images/bg_card_glass.png') center/cover no-repeat;
  border-radius: 8pt;
  box-shadow: 0 1pt 6pt rgba(0,0,0,0.07), 0 0 0 0.5pt rgba(0,0,0,0.06);
}

/* Dark card: AI dark glass over dark tint */
.bento-item.dark {
  background: rgba(17,17,17,0.95) url('../images/bg_card_dark.png') center/cover no-repeat;
  box-shadow: 0 1pt 6pt rgba(0,0,0,0.3);
}
```

The `rgba(...)` tint over the AI texture ensures:
- Text remains readable
- Subtle material depth effect shows through
- Fallback to flat color if image not generated

---

## Prompt Writing Guide

### Structure

```
[NO TEXT CLAUSE]. [STYLE]. [COMPOSITION RULE]. [LEFT ZONE]. [COLORS]. [MOOD]. [TECHNICAL SPEC].
```

### No Text Clause (ALWAYS FIRST)

```
NO text, NO words, NO letters, NO numbers, NO typography, NO labels, NO UI elements
```

### Draft Reference Clause

Use when `inputImage` is provided:

```
Use the attached full-slide wireframe only as layout reference. Keep every text zone empty and transparent. Create visual design only for the indicated empty/skeleton regions.
```

### Selectable Layer Clause

Use when the result will be placed with `data-pptx-layer="design"`:

```
Output a transparent PNG layer. Keep all areas outside the target object transparent so the object can be selected as a separate PowerPoint layer.
```

### Left Zone Rule (for 16:9 slides with text overlay)

```
Left 60% near-black for text placement. Right 40%: [visual content].
```

### Style Keywords by Presentation Type

| Type | Keywords |
|---|---|
| Tech / SaaS | dark, minimal, architectural, electric blue, geometric |
| Editorial / Cultural | monochrome, cinematic, documentary, film grain |
| Corporate / Finance | navy, white space, subtle gradient, clean |
| Educational | warm tones, structured, clean lines, amber |
| Creative / Brand | vibrant, textured, painterly, expressive |

### Card Texture Prompts

For card backgrounds, always include:
- `Square 1:1 composition`
- `material texture only, no shapes or objects`
- `[target opacity range, e.g., "95% white, 5% texture"]`
- `product render quality`

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Bad API key | Check `OPENAI_API_KEY` env var |
| `400 Bad Request` | Content policy | Simplify prompt, remove specific imagery |
| `429 Rate Limited` | Too many requests | Wait 60s, use single-asset mode |
| Image not loading in slide | File not generated yet | Run script first |
| Dark overlay too strong | Gradient values too high | Reduce overlay opacity |
| Card texture not visible | Tint opacity too high | Lower `rgba` alpha (e.g., 0.85 → 0.75) |
| Generated layer contains words | Prompt did not emphasize no-text enough | Regenerate with the no-text, draft-reference, and selectable-layer clauses |
| Design layer flattened with background | Missing explicit layer hint | Add `data-pptx-layer="design"` to the `<img>` or container |

---

## Model Reference

| Parameter | `gpt-image-2` | `gpt-image-1.5` / `gpt-image-1` | `dall-e-3` |
|---|---|---|---|
| `model` | `'gpt-image-2'` | `'gpt-image-1.5'` or `'gpt-image-1'` | `'dall-e-3'` |
| Landscape size | `'1536x1024'` | `'1536x1024'` | `'1792x1024'` |
| Square size | `'1024x1024'` | `'1024x1024'` | `'1024x1024'` |
| `quality` | `'low'` / `'medium'` / `'high'` / `'auto'` | `'low'` / `'medium'` / `'high'` / `'auto'` | `'standard'` / `'hd'` |
| Response format | `b64_json` only (auto) | `b64_json` only (auto) | `'b64_json'` or `'url'` |
| Text rendering | Best | Excellent | Good |
| Cost | Highest | Higher | Lower |

**Default**: Use `gpt-image-2` with `quality: 'high'` for text-to-image production output. For draft-aware image-to-image layers, use the script's `IMAGE_EDIT_MODEL` setting. The local OpenAI SDK may expose image editing support through `gpt-image-1.5` / `gpt-image-1`; if `gpt-image-2` accepts image inputs in the current environment, set `IMAGE_EDIT_MODEL = 'gpt-image-2'`.

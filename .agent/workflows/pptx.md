---
name: pptx
description: "Presentation creation, editing, and analysis. When Claude needs to work with presentations (.pptx files) for: (1) Creating new presentations, (2) Modifying or editing content, (3) Working with layouts, (4) Adding comments or speaker notes, or any other presentation tasks"
license: Proprietary. LICENSE.txt has complete terms
---

# PPTX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of a .pptx file. A .pptx file is essentially a ZIP archive containing XML files and other resources that you can read or edit. You have different tools and workflows available for different tasks.

## Reading and analyzing content

### Text extraction
If you just need to read the text contents of a presentation, you should convert the document to markdown:

```bash
# Convert document to markdown
python -m markitdown path-to-file.pptx
```

### Raw XML access
You need raw XML access for: comments, speaker notes, slide layouts, animations, design elements, and complex formatting. For any of these features, you'll need to unpack a presentation and read its raw XML contents.

#### Unpacking a file
`python ooxml/scripts/unpack.py <office_file> <output_dir>`

**Note**: The unpack.py script is located at `.agent/workflows/skills/pptx/ooxml/scripts/unpack.py` relative to the project root. If the script doesn't exist at this path, use `find . -name "unpack.py"` to locate it.

#### Key file structures
* `ppt/presentation.xml` - Main presentation metadata and slide references
* `ppt/slides/slide{N}.xml` - Individual slide contents (slide1.xml, slide2.xml, etc.)
* `ppt/notesSlides/notesSlide{N}.xml` - Speaker notes for each slide
* `ppt/comments/modernComment_*.xml` - Comments for specific slides
* `ppt/slideLayouts/` - Layout templates for slides
* `ppt/slideMasters/` - Master slide templates
* `ppt/theme/` - Theme and styling information
* `ppt/media/` - Images and other media files

#### Typography and color extraction
**When given an example design to emulate**: Always analyze the presentation's typography and colors first using the methods below:
1. **Read theme file**: Check `ppt/theme/theme1.xml` for colors (`<a:clrScheme>`) and fonts (`<a:fontScheme>`)
2. **Sample slide content**: Examine `ppt/slides/slide1.xml` for actual font usage (`<a:rPr>`) and colors
3. **Search for patterns**: Use grep to find color (`<a:solidFill>`, `<a:srgbClr>`) and font references across all XML files

## Creating a new PowerPoint presentation **without a template**

When creating a new PowerPoint presentation from scratch, use the **html2pptx** workflow to convert HTML slides to PowerPoint with accurate positioning.

### Typography Rule (MANDATORY — ALL PROJECTS)

> **EVERY font in every HTML slide MUST be `'Pretendard', sans-serif`. No other font family is permitted.**

Control weight via `font-weight` only:

| Weight | Pretendard Subfont | Typical Use |
|---|---|---|
| 900 | Pretendard Black | Hero display headlines |
| 800 | Pretendard ExtraBold | Large callouts |
| 700 | Pretendard Bold | Section titles, card headlines |
| 600 | Pretendard SemiBold | Kickers, labels, UPPERCASE tags |
| 500 | Pretendard Medium | Emphasized body |
| 400 | Pretendard Regular | Body copy |
| 300 | Pretendard Light | Eyebrows, pull quotes |
| 200 | Pretendard ExtraLight | Decorative thin text |
| 100 | Pretendard Thin | Ultra-light accents |

The `html2pptx` converter maps `font-weight` to the exact Pretendard subfont automatically. **Never use Impact, Helvetica, Courier New, Georgia, or any other font — they will not render correctly in the PPTX output.**

### Project Structure (Mandatory)

To keep the workspace clean, you **MUST** create and use a dedicated asset folder for each project. All generated files (scripts, images, HTML slides) should be contained within this folder.

**Structure**:
```
workspace/
└── [project_name]/
    ├── assets/
    │   ├── scripts/
    │   │   └── generate_icons.js  <-- Copied from template and customized
    │   ├── images/                <-- All generated images (icons, backgrounds)
    │   ├── drafts/                <-- HTML draft screenshots for image-model reference
    │   ├── objects/               <-- Decomposed visual object PNGs from IMAGE-2
    │   ├── svg/                   <-- Phosphor SVG icons and vector motifs
    │   └── slides/                <-- HTML slide files
    └── [project_name].pptx        <-- Final output file
```

### Cross-Platform Compatibility (Windows/macOS)

To ensure this workflow operates seamlessly on both macOS and Windows:
1.  **Path Handling**: ALWAYS use `path.join()` and `path.resolve()` in Node.js scripts. NEVER concatenate strings with forward slashes (`/`) or backslashes (`\`) manually.
    *   *Bad*: `const p = dir + "/" + file;`
    *   *Good*: `const p = path.join(dir, file);`
2.  **Shell Commands**: When using `run_command`, prefer standard commands available in both environments or use Node.js `fs` module for file operations (copy, move, delete) instead of shell commands (`cp`, `mv`, `rm`) to avoid syntax errors on Windows Command Prompt/PowerShell.
3.  **Encoding**: Ensure all text files are read/written with `utf8` encoding to handle Korean characters correctly on Windows.

### Step 0: Design Selection Interaction (MANDATORY)

**Before starting ANY work**, you MUST ask the user to select a design style. Present the following options clearly:

> "어떤 디자인 스타일로 프레젠테이션을 생성할까요?"
>
> 1. **The Verge Editorial** (Dark canvas, acid-mint/ultraviolet accents, Pretendard Black headlines, StoryStream cards) — *Best for tech media, news, trend reports*
> 2. **Figma Editorial** (White canvas, oversized Light-weight headlines, signature pastel color blocks — lime/lilac/mint/coral/navy) — *Best for product launches, tool docs, clean modern decks*
> 3. **getdesign Import** — 템플릿 이름을 입력하면 자동으로 다운로드하여 새 스타일로 등록합니다 (`npx getdesign@latest add [name]`)
> 4. **Custom Design** (Tell me your preference!)

**Action based on selection**:
- If **1 (Verge Editorial) selected**: Run the Verge CSS setup below, then read `.agent/workflows/skills/pptx/templates/the_verge_editorial.md` before writing any HTML.
- If **2 (Figma Editorial) selected**: Run the Figma CSS setup below, then read `.agent/workflows/skills/pptx/templates/figma_editorial.md` before writing any HTML.
- If **3 (getdesign Import) selected**: Follow the **getdesign Template Import** workflow below to download, convert, and register a new style.
- If **4 (Custom) selected**: Ask for specific requirements (color, vibe, font) and proceed with custom art direction.

> **Note — Adding new styles**: Each registered style follows the same pattern: a shared CSS file in `.agent/workflows/skills/pptx/themes/` and a design spec in `.agent/workflows/skills/pptx/templates/`. Add a numbered option above and a CSS setup block below when registering a new style.

#### The Verge Editorial — CSS Setup (Run ONCE per project)


When the user selects **The Verge Editorial** style, copy the shared CSS file into the project before writing any slide HTML:

```bash
mkdir -p workspace/[project_name]/assets/css
cp .agent/workflows/skills/pptx/themes/verge.css workspace/[project_name]/assets/css/verge.css
```

Then every slide HTML file starts with:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/verge.css">
  <style>
    /* Slide-specific overrides only — do NOT repeat verge.css rules here */
  </style>
</head>
<body>
  <!-- use .v-* BEM classes from verge.css -->
</body>
</html>
```

**Reuse contract**:
- All Verge design tokens (colors, fonts, radii, spacing) live in `verge.css` custom properties.
- Slide HTML files use only `.v-*` utility classes from `verge.css`; per-slide `<style>` blocks contain layout overrides only (grid dimensions, specific heights, image paths).
- To update the visual system across all slides in a project, edit only `verge.css`.
- To share the theme across multiple projects, copy `verge.css` into each project's `assets/css/` folder.

#### Figma Editorial — CSS Setup (Run ONCE per project)

When the user selects **Figma Editorial** style, copy the shared CSS file into the project:

```bash
mkdir -p workspace/[project_name]/assets/css
cp .agent/workflows/skills/pptx/themes/figma.css workspace/[project_name]/assets/css/figma.css
```

Then every slide HTML file starts with:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/figma.css">
  <style>
    /* Slide-specific overrides only — do NOT repeat figma.css rules here */
  </style>
</head>
<body>
  <!-- use .fig-* BEM classes from figma.css -->
</body>
</html>
```

### Registered Style Systems

Each registered style is a pair: a **design spec** (`.md`) that defines the visual language, and a **shared CSS file** that implements it with CSS custom properties and BEM utility classes.

| Style | Design Spec | Shared CSS | Source |
|---|---|---|---|
| **The Verge Editorial** | `templates/the_verge_editorial.md` | `themes/verge.css` | Hand-crafted |
| **Figma Editorial** | `templates/figma_editorial.md` | `themes/figma.css` | getdesign (figma) |

**Adding a new style**: Create `templates/[style_name].md` (color palette, typography, component classes, layout examples, quality checklist) and `themes/[style_name].css` (CSS custom properties + BEM utility classes). Add a row to the table above, a numbered option in Step 0, and a CSS setup block following the Verge pattern below.

---

### getdesign Template Import (Style 3 — Automated)

`getdesign` is an npm tool that downloads design-system specification files (`DESIGN.md`) reverse-engineered from major product websites. Each `DESIGN.md` contains structured frontmatter (colors, typography, rounded, spacing, components) and a detailed prose description of the visual system.

**When the user selects option 3**, follow this workflow to convert a getdesign template into a registered PPTX style:

#### Step A — Check if already registered

Check the Registered Style Systems table above. If `themes/[name].css` already exists, skip to Step F (CSS setup + HTML).

#### Step B — Download the template

```bash
npx getdesign@latest add [template-name]
```

This writes `DESIGN.md` to the project root. Read the full file immediately after download.

**Available templates** (non-exhaustive — run `npx getdesign@latest list` to see current registry):
`figma`, `linear`, `notion`, `vercel`, `stripe`, `tailwind`, `shadcn`, `github`, `framer`, `loom`, `resend`, `supabase` …

#### Step C — Extract design tokens from DESIGN.md

Parse the YAML frontmatter to extract:

1. **Colors** → CSS custom properties with `--[name]-` prefix
   - Map each color key directly: `primary` → `--[name]-primary`, `canvas` → `--[name]-canvas`, etc.
   - Identify the "ink" (dark text) color and "canvas" (background) color
   - Identify accent / block colors for cards, dividers, pills

2. **Typography** → Map `fontWeight` to Pretendard (ALL fonts become Pretendard — mandatory):
   | DESIGN.md weight | Pretendard |
   |---|---|
   | ≤ 100 | Thin (100) |
   | ≤ 200 | ExtraLight (200) |
   | ≤ 300 | Light (300) |
   | ≤ 340 | Light (300) |
   | ≤ 400 | Regular (400) |
   | ≤ 480 | Medium (500) |
   | ≤ 540 | SemiBold (600) |
   | ≤ 700 | Bold (700) |
   | ≤ 800 | ExtraBold (800) |
   | ≤ 900 | Black (900) |

   Map `fontSize` from px to pt: multiply by **0.75** (e.g., 86px → 64.5pt → round to 65pt).
   Clamp display sizes to the slide canvas max: hero ≤ 52pt, section title ≤ 28pt, body ≤ 11pt.

3. **Rounded** → CSS custom properties scaled px → pt (`rounded.lg: 24px` → `--[name]-r-lg: 18pt`)

4. **Spacing** → Reference values for padding/gap; scale px → pt

5. **Components** → Identify the key component patterns (hero, color-block, card, pill, divider, insight bar) from the component list and prose description

#### Step D — Generate `themes/[name].css`

Create `.agent/workflows/skills/pptx/themes/[name].css` following this structure (use `figma.css` as a reference):

```css
/* [TemplateName] — Shared PPTX Slide Theme
 * Source: npx getdesign@latest add [name]
 * Font: Pretendard (all weights mapped from DESIGN.md)
 * Slide canvas: 720pt × 405pt */

@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 720pt; height: 405pt; overflow: hidden;
  background: [canvas-color]; color: [ink-color];
  font-family: 'Pretendard Variable', 'Pretendard', sans-serif; }

:root {
  /* Extracted from DESIGN.md colors: */
  --[name]-ink: [ink];
  --[name]-canvas: [canvas];
  /* ... all color tokens ... */
  /* Radius tokens (px → pt): */
  --[name]-r-md: [Xpt];
  /* ... */
}

/* Layout, Typography, Cover, Color Blocks, Cards, Grid, Pills,
   Insight Bar, Divider, Brand Strip — all following figma.css pattern */
```

**BEM prefix rule**: Use `.[initial]-*` where `[initial]` is a 2-4 character prefix derived from the template name (`fig-`, `lin-`, `str-`, `not-`, etc.). If there's a collision with an existing prefix, extend it.

#### Step E — Generate `templates/[name]_editorial.md`

Create `.agent/workflows/skills/pptx/templates/[name]_editorial.md` describing:
- Design philosophy (derived from DESIGN.md overview prose)
- Color palette table (all tokens with roles)
- Typography table (mapped to Pretendard)
- CSS class reference (all `.xxx-*` classes)
- 4–5 slide pattern code examples (cover, divider, content grid, two-column, closing)
- Slide rhythm recommendations
- Quality checklist

Follow `figma_editorial.md` as the canonical reference format.

#### Step F — Register in pptx.md

After creating the CSS and spec files, **update this file** (`pptx.md`):
1. Add a row to the **Registered Style Systems** table
2. Add a numbered option to the **Step 0** dialog
3. Add a **CSS Setup block** (following the Figma Editorial pattern above)

#### Step G — Delete DESIGN.md

The `DESIGN.md` file in the project root is a source document, not a workspace artifact. Delete it after conversion:

```bash
rm DESIGN.md
```

#### Step H — Begin slide creation

Copy the new CSS to the project and proceed with HTML authoring using the new `.[prefix]-*` classes.

---

### Optimization: Parallel Asset Generation (HIGH PRIORITY)

To maximize efficiency, you **MUST** execute asset generation tasks in parallel whenever possible, using the `waitForPreviousTools: false` option.

**Parallel Workflow Strategy**:
1.  **Initial Setup**: Create project folders and scripts (Sequential).
2.  **Asset Generation (PARALLEL)**:
    *   Run `node workspace/[project]/assets/scripts/generate_icons.js` (Phosphor icons)
    *   Run `node workspace/[project]/assets/scripts/generate_design_assets.js` (OpenAI backgrounds + card textures)
    *   *Note*: These two scripts are independent — run in parallel. The design assets script generates all backgrounds and card textures in one call.
3.  **HTML Creation (PARALLEL)**:
    *   Once assets are triggered, you can start writing `slide1.html`, `slide2.html`, etc., assuming the assets will be ready by the time the user renders them.
    *   *Note*: If you need to check the generated image path, you may need to wait, but generally, standard naming conventions allow you to write HTML blindly.

#### Hybrid Rendering & Styling Mechanism (3-Layer Strategy)

The `html2pptx` workflow uses an advanced **3-Layer Hybrid Rendering** approach to achieve 100% visual fidelity while maintaining text editability:

#### Draft-Aware IMAGE Layer Workflow (MANDATORY for premium new decks)

When creating a polished deck from scratch, treat the first HTML pass as a **semantic draft**, not the final design. The final PPTX should prioritize high-end visuals while keeping every major visual element individually selectable in PowerPoint.

#### Structured Editorial Slide Workflow (MANDATORY for reference-quality decks)

When the user asks for slides like a polished consulting, strategy, education, platform, or brand proposal deck, do **not** start from generic "title + body + image" layouts. Build a deck-wide style system from the full text first, then choose a slide-specific design strategy for each slide based on that slide's content structure.

**Target style**:
- Slides should look like authored presentation pages: strong header system, clear slide number, compact brand marks, one dominant diagram or framework, supporting cards, and a final insight bar where useful.
- Text must remain editable in PowerPoint.
- Complex decorative visuals may be selectable PNG/SVG layers, but they should support the layout rather than replace it.
- IMAGE-2 is used for premium backgrounds, abstract orbit/mesh/texture fields, hero objects, and text-free visual layers. It should not be asked to render final slide text.
- Icons should come from an icon library or generated SVG/PNG icon set, not from freeform image generation, unless the icon is purely decorative.

#### Phosphor SVG Native Workflow (MANDATORY when user asks for no images)

When the user asks for "이미지 없이", "SVG 기반", "Phosphor 기반", or complains that image-generated quality is poor, switch to a **vector-native deck**. In this mode, do not use IMAGE-2, raster backgrounds, or photographic/illustrative images. Build the entire deck from editable PowerPoint text, PPT-native shapes/connectors, tables, and Phosphor-derived SVG icons.

**Output contract**:
- No AI-generated bitmap backgrounds or visual masters.
- No full-slide screenshots as design layers.
- Use Phosphor icons as SVG/vector assets for semantic pictograms.
- Use PPT-native shapes for panels, cards, rails, matrices, architecture layers, arrows, dividers, badges, and insight bars.
- Keep all meaningful text editable.
- Prefer direct `pptxgenjs` construction over html2pptx when precise native shapes/connectors are more important than CSS fidelity.
- If SVG insertion becomes rasterized by the export library, keep icons simple and separately selectable; never flatten an entire slide.
- Visible slide copy must be audience-facing. Never show internal production/tool terms such as `PHOSPHOR`, `SVG`, `IMAGE-2`, `PPTXGenJS`, `workflow`, `automation`, or `Codex` unless the user explicitly asks for a process/tooling deck.
- Do not add a right-side panel, hero icon, orbit, rail, or diagram only because there is empty space. Every visual zone must have a clear `content_function`: process, comparison, hierarchy, loop, system boundary, data flow, decision, or synthesis.
- Each content slide should use multiple semantic icons when density allows: one icon per concept card, process node, layer, row, or callout. Avoid repeating the same icon across unrelated items.
- If a slide truly needs a complex visual that is hard to author as native shapes, IMAGE-2 may be used only for a text-free **diagrammatic** layer: lines, routes, system topology, abstract data flow, or structured 도식. It must not become decorative artwork, a photo, a raster background, or a container for final text.

**Required vector-first loop**:
1. Read all source text and define a deck-wide vector design system: palette roles, typography scale, stroke width, icon style, connector style, grid, and density rules.
2. Classify each slide by content relationship: cover, sequence, process, system, comparison, loop, anatomy, decision, summary.
3. Assign a slide-specific vector diagram with a named content function: timeline rail, process nodes, architecture stack, comparison matrix, flywheel, anatomy callouts, decision tree, or synthesis board.
4. Render Phosphor icons to SVG strings with `react-icons/pi` or `@phosphor-icons`.
5. Build the PPTX with native text boxes, shapes, connectors, and icon SVGs. Use cards only when they organize real content; do not create filler sections.
6. Generate HTML or PNG previews for QA, but do not use those previews as slide content.
7. Validate slide count, editable text count, picture/icon count, banned visible tool terms, and overflow/preview readability.

**Vector visual grammar**:
- `cover`: monumental typography, orbital SVG line system, metadata strip, icon constellation.
- `sequence`: date/stage rail with numbered nodes and Phosphor icons.
- `process`: circular icon nodes connected by arrows.
- `system`: stacked layers, boundary boxes, protocol/data connectors.
- `comparison`: columns or matrix with decision highlight.
- `loop`: circular arrows/flywheel around a central icon.
- `anatomy`: central icon/object with editable callout labels.
- `decision`: branching tree with condition chips.
- `summary`: principle board plus compact map recap.

**Acceptance checks**:
- The deck still looks premium without bitmap imagery.
- At least 80% of visual elements are PPT-native shapes/connectors/text or SVG icons.
- No slide uses a raster image as its main visual.
- Adjacent slides vary their diagram grammar according to the content.
- Korean text remains readable and does not collide.

**Required structure-first loop**:
1. **Full-source digest**: Read all available source text before designing. Extract thesis, audience, recurring vocabulary, timeline, actors, systems, contrasts, examples, metaphors, technical terms, emotional tone, and density.
2. **Deck-wide style system**: Define the common visual language from the full source, not from a single reference slide:
   - `visual_metaphor`: the deck's central metaphor, e.g. universe, map, factory, network, operating system.
   - `palette_roles`: which colors mean history, interaction, data, backend, tradeoff, warning, or synthesis.
   - `typography_scale`: title, lead, diagram label, body, metadata, footer.
   - `icon_taxonomy`: icon families for people, document, browser, code, package, server, database, security, scale, deployment.
   - `layout_rhythm`: where the deck should feel cinematic, dense, analytical, or explanatory.
   - `shared_components`: header, slide number, brand marks, section markers, insight bars, badges, connector styles.
3. **Slide content classification**: For every slide, classify the actual content relationship before choosing a design:
   - `sequence`: historical/evolutionary steps.
   - `process`: actions that happen in order.
   - `system`: architecture or layered components.
   - `comparison`: two or more options/tradeoffs.
   - `loop`: feedback, lock-in, flywheel, state persistence.
   - `anatomy`: parts of one concept.
   - `decision`: when to choose what.
   - `summary`: principles, checklist, or final synthesis.
4. **Slide-specific design strategy**: For every slide, write a compact spec with:
   - `slide_role`: cover, section opener, process, comparison, timeline, architecture map, ecosystem loop, matrix, summary.
   - `main_claim`: the one sentence the slide must land.
   - `editable_text`: title, lead sentence, labels, bullets, captions, footer insight.
   - `content_relationship`: sequence, process, system, comparison, loop, anatomy, decision, or summary.
   - `best_visual_form`: timeline, process flow, architecture map, comparison matrix, flywheel, anatomy diagram, decision tree, evidence cards, or synthesis board.
   - `required_elements`: only the header/cards/arrows/icons/insight bar/image layers that help this slide.
   - `omit_elements`: explicitly name template elements that should not appear on this slide.
   - `image2_layers`: only the text-free support layers needed.
5. **Adaptive template selection**: Choose a template family member only after the slide-specific strategy is written. Templates are starting grammars, not mandatory element bundles.
6. **Wireframe HTML**: Build the slide with real text, icon placeholders, arrows, cards, dividers, and empty visual zones. Use stable absolute/flex/grid dimensions.
7. **Draft screenshot**: Capture the wireframe into `assets/drafts/slideNN_draft.png`.
8. **IMAGE-2 master visual generation**: For slides that need high-detail design, generate a text-free full-slide or zone-level master visual. The prompt must reference the draft composition and explicitly say that all labels/text remain empty.
9. **Object decomposition**: When the master visual contains multiple logical design objects, decompose it into object PNGs using `slideNN_objects.json` bbox prompts. Use Sharp/Pillow bbox crops.
10. **Layered HTML final**: Place decomposed object PNGs or generated zone layers with `data-pptx-layer="design"` or `data-pptx-capture="asset"` beneath editable text.
11. **PPTX build and QA**: Convert with `html2pptx`, verify slide count, editable text count, selectable image layers, overflow, and previews.

**Adaptive visual grammar**:
- `cover/editorial statement`: dark cover, monumental type, sparse metadata, one atmospheric IMAGE-2 field.
- `sequence/history`: timeline rail, date badges, problem -> solution -> new problem rhythm.
- `process/workflow`: icon nodes, arrows, step captions, optional final outcome badge.
- `system/architecture`: stacked layers, zones, connectors, protocol/data labels, boundary lines.
- `comparison/tradeoff`: columns, balance scales, decision rows, highlighted recommended path.
- `loop/flywheel`: circular or orbital structure, dotted feedback connector, central lock-in/infrastructure node.
- `anatomy/concept`: central object with labeled callouts, magnified subparts, definition blocks.
- `decision/playbook`: decision tree, checklist rows, conditions, recommended prompts/actions.
- `summary/synthesis`: principle grid, compact map, memory hooks, final thesis.

**Object decomposition contract**:
- Add `data-object-id` to every visual placeholder that should become a separate PPT object after IMAGE-2 detailing.
- Capture draft screenshots with `.agent/workflows/skills/pptx/scripts/capture_slide_drafts.template.js`; it writes both `slideNN_draft.png` and `slideNN_objects.json`.
- Generate `slideNN_visual_master.png` with IMAGE-2 when one high-detail slide-level visual should be cut into pieces.
- Copy `.agent/workflows/skills/pptx/scripts/decompose_visual_objects.template.py` to `workspace/[project]/assets/scripts/decompose_visual_objects.py`.
- Run bbox decomposition:
  ```bash
  python workspace/[project]/assets/scripts/decompose_visual_objects.py --slide slide03
  ```
- Decomposed PNGs preserve their source bbox canvas size by default for reliable PPTX positioning. Use `--trim-alpha` only when offset handling is implemented.
- Reinsert output PNGs from `assets/objects/slideNN/` into final HTML as separate absolutely positioned image layers.

**Template family**:
- `structured_dark_cover`: dark navy/purple cover with monumental typography, orbital visual field, and optional bottom metadata strip.
- `structured_process_flow`: white slide with slide-number pill, top brand line, large title, adaptive 3-5 step flow, optional feedback loop, optional bottom analysis cards, optional insight bar.
- `structured_architecture_map`: layered system diagram with client/browser/server/database/cache/deployment zones.
- `structured_comparison_matrix`: side-by-side or 3-column comparison with explicit tradeoffs and highlighted decision.
- `structured_timeline_evolution`: chronological flow where each stage is a problem -> solution -> new problem transition.
- `structured_loop_flywheel`: circular/orbital flywheel for network effects, lock-in, session/state, cache refresh, or ecosystem dynamics.
- `structured_anatomy_callout`: central concept/object with 4-6 labeled editable callouts.
- `structured_decision_tree`: conditional path or "when to use what" guidance.
- `structured_summary_playbook`: dense but readable closing slide with principles, checklist, or operating model.

**Composition rules**:
- Each slide needs one dominant read within 3 seconds: a title claim plus one diagram/table/map.
- Use cards only when they organize real structure: roles, effects, risks, decisions, or examples. Avoid generic empty cards.
- Use bottom insight bars only when the slide has a meaningful "so what" synthesis. If the slide is already self-evident, omit the bar.
- Use icon nodes for concepts, arrows for causality, dotted lines for feedback loops, badges for metadata, and layer bands for systems.
- Do not force the same component set onto every slide. The common style should come from palette, typography, spacing, header behavior, icon family, and connector language; the visual elements should change according to content.
- Do not put paragraphs inside large decorative boxes. Convert long text into labels, short bullets, callouts, speaker notes, or additional slides.
- Keep diagram text editable; keep generated visuals text-free.

**Reference-quality acceptance checks**:
- Thumbnail reads as a designed proposal/education deck, not a generic AI slide.
- Cover has a distinct visual identity and is not a normal content slide.
- At least 70% of content slides use a structured visual object: process, map, timeline, matrix, loop, or architecture diagram.
- Adjacent slides do not repeat the same layout unless the content relationship genuinely repeats.
- Every slide has an explicit slide-specific design strategy derived from the content.
- Every slide has editable title and body text.
- Major decorative/visual objects are separate selectable layers where practical.
- If a slide uses a full-slide IMAGE-2 master visual, it is decomposed into object PNGs before PPTX assembly unless it is a pure background texture.
- No IMAGE-2 asset contains real slide copy.
- No slide depends on a single flattened screenshot of the whole slide.

**Target output contract**:
- Complex design elements may be PNG layers. They do **not** need to be native PowerPoint shapes.
- Prefer SVG/PNG icon assets from the icon library for icons; do not ask the image model to invent iconography.
- Text must remain editable PowerPoint text boxes.
- Major visual objects must be separate layers where practical: background, hero illustration/photo, card skin, diagram ornament, chart/table placeholder skin, icons, badges, and text.
- Avoid one flattened full-slide artwork except for true background texture. If a full-slide transparent overlay is used, it must contain only one logical design layer and transparent empty space elsewhere.

**Required loop**:
1. Create a wireframe HTML slide first. Include all real text in semantic tags, and mark visual zones with empty `div`s, icon-library placeholders, or skeleton frames.
2. Add `data-object-id` and `data-object-kind` to any visual placeholder that should become a selectable object after decomposition.
3. Render/screenshot the draft slide to `workspace/[project]/assets/drafts/slideNN_draft.png` and write `slideNN_objects.json`. Copy `.agent/workflows/skills/pptx/scripts/capture_slide_drafts.template.js` to `workspace/[project]/assets/scripts/capture_slide_drafts.js` and run `node workspace/[project]/assets/scripts/capture_slide_drafts.js`.
4. Use the draft screenshot as an image reference for the image-generation script. The image model should read the full slide composition and generate **text-free visual master layers** or transparent zone layers.
5. If a master layer contains multiple objects, run `decompose_visual_objects.py` to crop object PNGs using the HTML bbox manifest.
6. Place generated/decomposed PNG/SVG assets back into the HTML as absolutely positioned layers using `data-pptx-layer="design"` or `data-pptx-capture="asset"`.
7. Run `html2pptx`. The converter will capture marked design layers as individual selectable image objects, then place editable text above them. If a design object conflicts with text, regenerate or decompose only that object and keep the text objects unchanged.

**HTML layer hints**:
```html
<div class="bg" data-pptx-layer="background"></div>
<div class="orbit-zone"
     data-object-id="orbit-field"
     data-object-kind="decor"></div>
<img class="decomposed-object"
     data-pptx-layer="design"
     src="../objects/slide01/01_orbit-field.png" />
<div class="card-skin" data-pptx-layer="design"></div>
<img class="icon" data-pptx-capture="asset" src="../images/icon_target.png" />
<h1>Editable slide title</h1>
```

Use CSS absolute positioning for generated design layers so their bounding boxes are stable. For full-slide transparent overlays, use `position:absolute; inset:0; width:100%; height:100%; object-fit:cover;`.

**Layer 1: Global Background**
- Captures the pure slide background (gradients, patterns, textures)
- All content (text, images, UI components) is hidden during this capture
- Becomes the slide's background image in PPTX

**Layer 2: Component Skeletons**
- Identifies UI components (`.card`, `.box`, `.bento-item`, etc.)
- Captures each component with text hidden but structure preserved
- Creates transparent PNG "skeleton" images that maintain complex CSS styling
- Inserted as images on top of the background layer
- Explicitly marked elements with `data-pptx-layer="design"` or `data-pptx-capture="asset"` are always captured as separate selectable image layers, even when auto-detection would miss them.

**Layer 3: Editable Content**
- All text elements extracted and inserted as editable PowerPoint text boxes
- Standalone images (icons, photos) captured and positioned accurately
- Layered on top of skeleton images to maintain visual hierarchy

**High-Resolution Image Capture**:
- All images (backgrounds, components, standalone) captured at **2x resolution** (`deviceScaleFactor: 2`)
- Ensures crisp, Retina-quality visuals in the final PPTX

**Advanced Text Extraction**:
- **Leaf Node Detection**: Accurately identifies the deepest text-containing elements to avoid duplication
- **Inline Formatting Preservation**: Maintains `<strong>`, `<em>`, `<span>` styling within text runs
- **Line Break Handling**: `<br>` tags converted to proper line breaks without extra spacing
- **Line Spacing Accuracy**: CSS `line-height` (including `normal` and multiplier values) precisely converted to PowerPoint points
- **No Paragraph Spacing**: Text boxes positioned using absolute coordinates; internal spacing removed to match HTML layout exactly

**Implications for Styling**:
- **Complex CSS (Blur, Gradients, Shadows)**: Apply these to component containers (`.card`, `.box`). They will be baked into skeleton images.
- **Text Styling**: Use standard HTML tags (`<p>`, `<h1>`, `<strong>`) with CSS. Text will be extracted with formatting intact.
- **Images & Icons**: Use `<img>` tags with SVG or PNG sources. They will be captured as transparent PNGs at their rendered size.
- **No Borders on Text Containers**: Borders should be on parent components, not on `<p>` or `<h1>` tags directly.
- **Component-Based Design**: Wrap complex styled elements (cards, badges, boxes) in divs with specific classes to trigger skeleton capture.

#### Overflow Prevention Strategy: Design from the Start (MANDATORY)

**CRITICAL**: Building HTML slides with proper constraints from the beginning is far more efficient than fixing overflow errors later. Follow these rules:

**Core Constraints:**
| Item | Value |
|------|-------|
| Slide Size (16:9) | **720pt × 405pt** (= 960px × 540px @ 96 DPI) |
| Recommended Bottom Margin | 0.5" (36pt) |
| Actual Usable Height | ~**369pt** (~492px) |

**1. Mandatory CSS Reset:**
```css
* { 
  box-sizing: border-box; 
  margin: 0; 
  padding: 0;
}

html, body {
  width: 720pt;
  height: 405pt;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Visual check for overflow */
}
```

**2. Container Height Specification:**
```css
.container {
  width: 100%;
  height: 100%; /* MUST specify */
  padding: 40pt;
  display: flex;
  flex-direction: column;
}
```

**3. Content Area Constraint:**
```css
.content {
  flex: 1;
  overflow: hidden; /* Content beyond this will be clipped */
  display: flex;
  flex-direction: column;
  gap: 16pt;
}
```

**4. Conservative Font Sizing:**
```css
h1 { font-size: 28pt; margin-bottom: 16pt; }  /* Max 32pt */
h2 { font-size: 20pt; margin-bottom: 12pt; }
p { font-size: 11pt; line-height: 1.5; }       /* Body max 12pt */
```

**5. Optimized Bento Grid (2 Columns Preferred):**
```css
/* 2-column grid recommended (3 columns risk height overflow) */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12pt;
  height: 100%;
}

.card {
  padding: 14pt;
  flex-direction: row; /* Horizontal layout (icon left, text right) */
  align-items: flex-start;
  gap: 12pt;
}

.icon {
  width: 32pt;
  height: 32pt;
  flex-shrink: 0;
}
```

**Recommended Workflow (Overflow Prevention):**
```
1. Write HTML
     ↓
2. IMMEDIATELY run check_overflow.js
     ↓
3. If overflow detected:
   - Reduce font size (1-2pt)
   - Reduce gap/margin (20%)
   - Reduce icon size (48pt → 40pt → 32pt)
   - Reduce line-height (1.6 → 1.5 → 1.4)
     ↓
4. Only proceed to next slide AFTER ✅ OK
```

#### Managing Overflow: Critical Strategy (Fixing Existing Issues)

**When `html2pptx` reports overflow errors**, follow this systematic approach to fix them:

**Priority 1: Aggressive Font & Layout Scaling (Automated)**
1. **Global Scaling**: Immediately reduce the base font size (e.g., in `body` or `.container`) from 100% to 95%, then 90%.
2. **Granular Adjustment**: Reduce specific text elements:
   - Headings (`h1`): Reduce by 2-4pt.
   - Body text (`p`, `li`): Reduce by 1-2pt (minimum 8pt).
   - **Algorithm**: `while (overflow > 0) { fontSize -= 0.5pt; gap -= 2pt; margin -= 2pt; }`
3. **Vertical Compression**: Reduce `margin-bottom` of headings and `gap` in flex/grid containers by 20-30%.

**Priority 2: Reduce Icon/Image Sizes**
1. **Icons**: Reduce from 48pt → 40pt → 32pt → 28pt as needed
2. **Product Images**: Scale down width/height by 10-15%
3. **Decorative Elements**: Remove or significantly reduce blur effects that expand element boundaries

**Priority 3: Optimize Bento Grid Layout**
- **Switch Grid Orientation**: Change `3x2` (3 columns, 2 rows) → `2x3` (2 columns, 3 rows) to reduce vertical height
- **Horizontal Layout**: For cards, switch from vertical `flex-direction: column` to horizontal `flex-direction: row` with icon on the left
- **Compact Grid Gaps**: Reduce `gap: 20pt` → `16pt` → `12pt` → `10pt`

**Priority 3: Reduce Text Density**
- **Shorten Descriptions**: Trim verbose text to essential keywords
- **Font Sizes**: Reduce body text from `11pt` → `10pt` → `9pt` → `8.5pt`
- **Line Height**: Tighten from `1.6` → `1.5` → `1.4`
- **Margins/Padding**: Reduce spacing between elements

**Priority 4: Restructure Layout**
- **Remove Elements**: Drop the least important card/section
- **Split Into Multiple Slides**: If content is genuinely dense, create 2 slides instead of 1
- **Alternative Layouts**: Use asymmetric layouts (e.g., 1 large + 2 small cards) instead of uniform grids

**Example: Fixing a 3x2 Grid Overflow**
```css
/* BEFORE (Overflows by 80pt vertically) */
.grid {
  grid-template-columns: 1fr 1fr 1fr;  /* 3 columns */
  gap: 18pt;
}
.card {
  padding: 20pt;
}
.icon {
  width: 48pt;
  height: 48pt;
  margin-bottom: 16pt;
}

/* AFTER (Fits perfectly - Horizontal First Strategy) */
.grid {
  grid-template-columns: 1fr 1fr;  /* 2 columns */
  gap: 12pt;
}
.card {
  padding: 14pt;
  flex-direction: row;  /* Horizontal layout (Icon Left + Text Right) */
  align-items: flex-start;
  gap: 12pt;
}
.icon {
  width: 32pt;  /* Reduced */
  height: 32pt;
  flex-shrink: 0; /* Prevent icon shrinking */
}
```

**Remember**: The html2pptx script requires content to fit within `720pt x 405pt` (with a 0.5" bottom margin). Always leave headroom for slight browser rendering variations.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`html2pptx.md`](skills/pptx/docs/html2pptx.md) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for detailed syntax, critical formatting rules, and best practices before proceeding with presentation creation.

2. **Art Direction & Asset Generation (Crucial Step)**:
   - **Design Direction**: For registered styles (e.g., Verge Editorial), color palette, typography, spacing, and component classes are fully defined in the style's spec and shared CSS. Read the spec before writing any HTML. For custom designs, define a Key Color and visual style based on content and purpose.

   - **Slide Structure**: For registered styles, slide layout patterns (cover, section divider, content grid, timeline, stat callout, etc.) are fully specified in the style's design spec file. Read the spec before writing any HTML. For custom designs, define slide types based on content purpose.
   
   - **Generate Assets FIRST (MANDATORY)**: Before writing ANY HTML, you **MUST** generate a comprehensive set of custom assets. **Generic placeholders or CSS-only visuals are FORBIDDEN.**

   - **1. Generate Icons (Phosphor Duotone - Text Prefixes ONLY)**:
     - **Library**: Use `react-icons/pi` (Phosphor Icons) with the **Duotone** variant (e.g., `PiTargetDuotone`).
     - **Style**: Match the icon color to the presentation's primary theme color.
     - **Usage**: Use icons **ONLY as text prefixes** (e.g., bullet points, section headers, small indicators).
     - **Workflow**:
       - **Setup**: Create the project folder structure: `mkdir -p workspace/[project_name]/assets/scripts`
       - **Copy Template**: Copy the icon generation template to your project:
         ```bash
         cp .agent/workflows/skills/pptx/scripts/generate_icons.template.js workspace/[project_name]/assets/scripts/generate_icons.js
         ```
       - **Customize**: Edit `workspace/[project_name]/assets/scripts/generate_icons.js` to include the specific icons and colors needed for your project.
       - **Run**: Execute the script to generate icons into `workspace/[project_name]/assets/images/`:
         ```bash
         node workspace/[project_name]/assets/scripts/generate_icons.js
         ```

   - **2. Generate AI Backgrounds & Visuals (OpenAI `gpt-image-2` — Image 2)**:
      - **API Key — Ask Before Running (MANDATORY)**:
        Before running any image generation script, check whether the user has set `OPENAI_API_KEY`. If it is not already set in the environment, say exactly this:
        > "AI 배경 이미지를 생성하려면 OpenAI API 키가 필요합니다.
        > 키를 아래 두 가지 방법 중 하나로 입력해 주세요.
        >
        > **방법 1 — 터미널에서 즉시 설정 (세션 한정)**
        > ```bash
        > # macOS/Linux
        > export OPENAI_API_KEY="sk-..."
        > # Windows
        > set OPENAI_API_KEY=sk-...
        > ```
        >
        > **방법 2 — `.env` 파일에 저장 (영구, 권장)**
        > 프로젝트 루트에 `.env` 파일을 만들고 아래 내용을 입력하세요:
        > ```
        > OPENAI_API_KEY=sk-...
        > ```
        > `.env` 파일은 `.gitignore`에 등록되어 있어 절대 커밋되지 않습니다.
        >
        > 키를 입력하셨으면 알려주세요. 그러면 이미지 생성을 시작하겠습니다."

        Do not proceed with image generation until the user confirms the key is set.
      - **Rule**: For EVERY background, texture, illustration, and premium design layer, use the `generate_design_assets.js` script powered by OpenAI image models. **Do NOT use CSS gradients as the primary visual.**
      - **Draft-aware requirement**: For important slides, first screenshot the wireframe HTML draft into `workspace/[project_name]/assets/drafts/slideNN_draft.png`, then configure `ASSETS` entries with `inputImage: 'slideNN_draft.png'` so the image model can read the full slide composition before generating the final text-free visual layer.
      - **Layering requirement**: Generate separate assets for separate logical objects whenever practical (`slide03_hero_visual.png`, `slide03_card_skin_1.png`, `slide03_diagram_glow.png`). Place each asset back in HTML with `data-pptx-layer="design"` so it becomes an individually selectable PNG layer in the PPTX.
      - **Background Insertion Rule**: If the user wants an image as a selectable design object *ON* the slide itself (슬라이드 내부 디자인 레이어), you MUST place the `<img>` tag inside the slide container (e.g. `<div class="fig-cover">`) and use `data-pptx-layer="design"`. If you use `data-pptx-layer="background"`, the `html2pptx` engine will lock it as the PPTX slide's global background fill, making it unselectable.
      - **Icon rule**: Icons come from `react-icons`/Phosphor and are rasterized as PNG/SVG assets. Do not ask the image model to create icons unless a decorative illustration is needed.
      - **Setup** (once per machine):
        ```bash
        npm install openai sharp
        # Windows:
        set OPENAI_API_KEY=sk-...
        # macOS/Linux:
        export OPENAI_API_KEY="sk-..."
        ```
      - **Workflow**:
        1. Copy the template script to the project:
           ```bash
           cp .agent/workflows/skills/pptx/scripts/generate_design_assets.template.js workspace/[project_name]/assets/scripts/generate_design_assets.js
           ```
        2. For draft-aware layers, copy and run the draft screenshot helper:
           ```bash
           cp .agent/workflows/skills/pptx/scripts/capture_slide_drafts.template.js workspace/[project_name]/assets/scripts/capture_slide_drafts.js
           node workspace/[project_name]/assets/scripts/capture_slide_drafts.js
           ```
        3. Customize `generate_design_assets.js`: edit `DESIGN` (style, palette, mood) and `ASSETS` array (names, prompts, sizes). For draft-aware layers, set `inputImage` to a screenshot in `assets/drafts/`.
        4. Run to generate all assets:
           ```bash
           node workspace/[project_name]/assets/scripts/generate_design_assets.js
           ```
        5. Re-run a single asset if needed:
           ```bash
           node workspace/[project_name]/assets/scripts/generate_design_assets.js bg_cover
           ```
      - **Typical Asset Types** (exact set is defined in the style's spec file):
        - **`bg_cover.png`** (1920×1080): Full-bleed title slide background
        - **`bg_section_[n].png`** (1920×1080): One per major chapter/section — used in interstitial divider slides
        - **`slideNN_visual_master.png`** (1920×1080): Text-free full-slide detailed visual structure to decompose into object PNGs
        - **`slideNN_[object]_layer.png`** (1920×1080 transparent overlay or object-sized PNG): Text-free draft-aware layer for one slide object or visual zone
      - **Prompt Writing Rules** (CRITICAL for quality):
        - **ALWAYS** start with: `NO text, NO words, NO letters, NO numbers, NO typography, NO labels`
        - When using `inputImage`, say: "Use the attached full-slide wireframe only as layout reference. Keep text zones empty/transparent."
        - For selectable layers, request either "transparent background" or "full-slide transparent PNG overlay with transparent empty space outside the target object."
        - Specify the slide's left zone: "Left 60% near-black for text placement"
        - Match the project's visual identity (colors, mood, style)
        - Use photography/art terms: "cinematic", "volumetric light", "depth of field", "16:9"
        - For card textures: "square 1:1", "material texture", "no shapes or objects"
      - **Hero & Section Backgrounds (MANDATORY style rule)**:
        - **Cover (hero) slide background**: Generate a **subtle, sophisticated** dark ambient field — deep near-black base with a soft gradient bloom (acid-mint `#3cffd0` or ultraviolet `#5200ff`), faint particle scatter, or quiet noise texture. The mood is editorial restraint, not neon spectacle. Avoid loud color fills, busy patterns, or high-saturation explosions. Prompt keywords: `"subtle ambient glow"`, `"deep space gradient"`, `"quiet cinematic mood"`, `"muted luminescence"`, `"editorial calm"`.
        - **Section divider (간지) backgrounds**: Use an even softer treatment than the cover — near-monochrome dark surface with a barely-visible tonal shift or micro-texture. Section slides separate chapters and must not compete with content slides for visual weight. Prompt keywords: `"minimal dark texture"`, `"whisper gradient"`, `"low-contrast tonal surface"`, `"typographic atmosphere"`.
        - **Shared constraint**: Both cover and section backgrounds must keep the left 55–65% of the canvas **dark and uncluttered** so Pretendard headline text remains legible at high contrast without a scrim overlay.
      - **CSS Integration Pattern** (after images are generated):
        > Style-specific CSS integration (background class names, color overlays, image sizing) is defined in the style's design spec and shared CSS. Refer to the spec. The following shows the universal pattern for marking a separately selectable design layer:
        ```html
        <img class="design-layer" data-pptx-layer="design" src="../images/slide03_hero_layer.png" />
        ```
        ```css
        /* Universal: separately selectable design layer */
        .design-layer { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none; }
        ```
      - **Save**: All generated assets go to `workspace/[project_name]/assets/images/`.

   - **3. Decompose IMAGE-2 Master Visuals (Optional but preferred for editable premium slides)**:
      - **Rule**: If `slideNN_visual_master.png` contains multiple logical design objects, do not place it into the PPTX as one flattened slide layer. Cut it into object PNGs first.
      - **Manifest source**: `capture_slide_drafts.js` writes `workspace/[project_name]/assets/drafts/slideNN_objects.json` from HTML elements marked with `data-object-id`.
      - **Script**:
        ```bash
        cp .agent/workflows/skills/pptx/scripts/decompose_visual_objects.template.py workspace/[project_name]/assets/scripts/decompose_visual_objects.py
        python workspace/[project_name]/assets/scripts/decompose_visual_objects.py --slide slide03
        ```
      - **Output**: `workspace/[project_name]/assets/objects/slideNN/*.png` plus `slideNN_decomposition.json`.
      - **Integration**: Place each object PNG back in HTML with `data-pptx-layer="design"` so it becomes separately selectable in PowerPoint.

   - **Save**: Store all generated assets in `workspace/[project_name]/assets/images/`.

3. Create an HTML file for each slide in `workspace/[project_name]/assets/slides/`
   - **Global Reset**: Include `* { box-sizing: border-box; }` in your CSS.
   - **Reference Assets**: Use relative paths to your generated images (e.g., `background-image: url('../images/aurora_bg.png')`).
   - **Consistent Padding**: Ensure all slides have a consistent internal padding (e.g., `padding: 40px` or `5%`) on the main container to prevent content from touching the edges.
   - **Iterative Validation Workflow (MANDATORY)**:
     - **Step 1**: Write HTML for a single slide (e.g., `slide1.html`).
     - **Step 2**: IMMEDIATELY run `node check_overflow.js` to validate dimensions.
     - **Step 3**: If overflow detected:
       - Apply **Priority 1 fixes** (Font/Layout Scaling).
       - Re-run `node check_overflow.js`.
       - Repeat until `✅ OK`.
     - **Step 4**: Only AFTER validation passes, proceed to write the next slide (`slide2.html`).
     - **Rationale**: Fixing issues one by one is much more efficient than fixing 10 slides at the end.
   - Use `<p>`, `<h1>`-`<h6>`, `<ul>`, `<ol>` for all text content
   - Use `class="placeholder"` for areas where charts/tables will be added (render with gray background for visibility)
   - **CRITICAL**: Rasterize icons as PNG images FIRST using Sharp, then reference in HTML
   - **LAYOUT**: Use CSS Grid (`display: grid`) for Bento Box layouts or Flexbox for alignment.

4. Create and run a JavaScript file using the [`html2pptx.js`](skills/pptx/scripts/html2pptx.js) library to convert HTML slides to PowerPoint and save the presentation
   - Use the `html2pptx()` function to process each HTML file
   - **CRITICAL**: Do NOT call `pres.addSlide()` manually before `html2pptx()`. Let `html2pptx` create the slide for you. This prevents blank slides from being added if validation fails.
     ```javascript
     // CORRECT
     await html2pptx(fullPath, pres);

     // INCORRECT (Causes blank slides on error)
     // const slide = pres.addSlide();
     // await html2pptx(fullPath, pres, slide);
     ```
   - Add charts and tables to placeholder areas using PptxGenJS API
   - Save the presentation using `pptx.writeFile()`

## Editing an existing PowerPoint presentation

When edit slides in an existing PowerPoint presentation, you need to work with the raw Office Open XML (OOXML) format. This involves unpacking the .pptx file, editing the XML content, and repacking it.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`ooxml.md`](skills/pptx/docs/ooxml.md) (~500 lines) completely from start to finish.  **NEVER set any range limits when reading this file.**  Read the full file content for detailed guidance on OOXML structure and editing workflows before any presentation editing.
2. Unpack the presentation: `python .agent/workflows/skills/pptx/ooxml/scripts/unpack.py <office_file> <output_dir>`
3. Edit the XML files (primarily `ppt/slides/slide{N}.xml` and related files)
4. **CRITICAL**: Validate immediately after each edit and fix any validation errors before proceeding: `python .agent/workflows/skills/pptx/ooxml/scripts/validate.py <dir> --original <file>`
5. Pack the final presentation: `python .agent/workflows/skills/pptx/ooxml/scripts/pack.py <input_directory> <office_file>`

## Creating a new PowerPoint presentation **using a template**

When you need to create a presentation that follows an existing template's design, you'll need to duplicate and re-arrange template slides before then replacing placeholder context.

### Workflow
1. **Extract template text AND create visual thumbnail grid**:
   * Extract text: `python -m markitdown template.pptx > template-content.md`
   * Read `template-content.md`: Read the entire file to understand the contents of the template presentation. **NEVER set any range limits when reading this file.**
   * Create thumbnail grids: `python .agent/workflows/skills/pptx/scripts/thumbnail.py template.pptx`
   * See [Creating Thumbnail Grids](#creating-thumbnail-grids) section for more details

2. **Analyze template and save inventory to a file**:
   * **Visual Analysis**: Review thumbnail grid(s) to understand slide layouts, design patterns, and visual structure
   * Create and save a template inventory file at `template-inventory.md` containing:
     ```markdown
     # Template Inventory Analysis
     **Total Slides: [count]**
     **IMPORTANT: Slides are 0-indexed (first slide = 0, last slide = count-1)**

     ## [Category Name]
     - Slide 0: [Layout code if available] - Description/purpose
     - Slide 1: [Layout code] - Description/purpose
     - Slide 2: [Layout code] - Description/purpose
     [... EVERY slide must be listed individually with its index ...]
     ```
   * **Using the thumbnail grid**: Reference the visual thumbnails to identify:
     - Layout patterns (title slides, content layouts, section dividers)
     - Image placeholder locations and counts
     - Design consistency across slide groups
     - Visual hierarchy and structure
   * This inventory file is REQUIRED for selecting appropriate templates in the next step

3. **Create presentation outline based on template inventory**:
   * Review available templates from step 2.
   * Choose an intro or title template for the first slide. This should be one of the first templates.
   * Choose safe, text-based layouts for the other slides.
   * **CRITICAL: Match layout structure to actual content**:
     - Single-column layouts: Use for unified narrative or single topic
     - Two-column layouts: Use ONLY when you have exactly 2 distinct items/concepts
     - Three-column layouts: Use ONLY when you have exactly 3 distinct items/concepts
     - Image + text layouts: Use ONLY when you have actual images to insert
     - Quote layouts: Use ONLY for actual quotes from people (with attribution), never for emphasis
     - Never use layouts with more placeholders than you have content
     - If you have 2 items, don't force them into a 3-column layout
     - If you have 4+ items, consider breaking into multiple slides or using a list format
   * Count your actual content pieces BEFORE selecting the layout
   * Verify each placeholder in the chosen layout will be filled with meaningful content
   * Select one option representing the **best** layout for each content section.
   * Save `outline.md` with content AND template mapping that leverages available designs
   * Example template mapping:
      ```
      # Template slides to use (0-based indexing)
      # WARNING: Verify indices are within range! Template with 73 slides has indices 0-72
      # Mapping: slide numbers from outline -> template slide indices
      template_mapping = [
          0,   # Use slide 0 (Title/Cover)
          34,  # Use slide 34 (B1: Title and body)
          34,  # Use slide 34 again (duplicate for second B1)
          50,  # Use slide 50 (E1: Quote)
          54,  # Use slide 54 (F2: Closing + Text)
      ]
      ```

4. **Duplicate, reorder, and delete slides using `rearrange.py`**:
   * Use the `scripts/rearrange.py` script to create a new presentation with slides in the desired order:
     ```bash
     python .agent/workflows/skills/pptx/scripts/rearrange.py template.pptx working.pptx 0,34,34,50,52
     ```
   * The script handles duplicating repeated slides, deleting unused slides, and reordering automatically
   * Slide indices are 0-based (first slide is 0, second is 1, etc.)
   * The same slide index can appear multiple times to duplicate that slide

5. **Extract ALL text using the `inventory.py` script**:
   * **Run inventory extraction**:
     ```bash
     python .agent/workflows/skills/pptx/scripts/inventory.py working.pptx text-inventory.json
     ```
   * **Read text-inventory.json**: Read the entire text-inventory.json file to understand all shapes and their properties. **NEVER set any range limits when reading this file.**

   * The inventory JSON structure:
      ```json
        {
          "slide-0": {
            "shape-0": {
              "placeholder_type": "TITLE",  // or null for non-placeholders
              "left": 1.5,                  // position in inches
              "top": 2.0,
              "width": 7.5,
              "height": 1.2,
              "paragraphs": [
                {
                  "text": "Paragraph text",
                  // Optional properties (only included when non-default):
                  "bullet": true,           // explicit bullet detected
                  "level": 0,               // only included when bullet is true
                  "alignment": "CENTER",    // CENTER, RIGHT (not LEFT)
                  "space_before": 10.0,     // space before paragraph in points
                  "space_after": 6.0,       // space after paragraph in points
                  "line_spacing": 22.4,     // line spacing in points
                  "font_name": "Arial",     // from first run
                  "font_size": 14.0,        // in points
                  "bold": true,
                  "italic": false,
                  "underline": false,
                  "color": "FF0000"         // RGB color
                }
              ]
            }
          }
        }
      ```

   * Key features:
     - **Slides**: Named as "slide-0", "slide-1", etc.
     - **Shapes**: Ordered by visual position (top-to-bottom, left-to-right) as "shape-0", "shape-1", etc.
     - **Placeholder types**: TITLE, CENTER_TITLE, SUBTITLE, BODY, OBJECT, or null
     - **Default font size**: `default_font_size` in points extracted from layout placeholders (when available)
     - **Slide numbers are filtered**: Shapes with SLIDE_NUMBER placeholder type are automatically excluded from inventory
     - **Bullets**: When `bullet: true`, `level` is always included (even if 0)
     - **Spacing**: `space_before`, `space_after`, and `line_spacing` in points (only included when set)
     - **Colors**: `color` for RGB (e.g., "FF0000"), `theme_color` for theme colors (e.g., "DARK_1")
     - **Properties**: Only non-default values are included in the output

6. **Generate replacement text and save the data to a JSON file**
   Based on the text inventory from the previous step:
   - **CRITICAL**: First verify which shapes exist in the inventory - only reference shapes that are actually present
   - **VALIDATION**: The replace.py script will validate that all shapes in your replacement JSON exist in the inventory
     - If you reference a non-existent shape, you'll get an error showing available shapes
     - If you reference a non-existent slide, you'll get an error indicating the slide doesn't exist
     - All validation errors are shown at once before the script exits
   - **IMPORTANT**: The replace.py script uses inventory.py internally to identify ALL text shapes
   - **AUTOMATIC CLEARING**: ALL text shapes from the inventory will be cleared unless you provide "paragraphs" for them
   - Add a "paragraphs" field to shapes that need content (not "replacement_paragraphs")
   - Shapes without "paragraphs" in the replacement JSON will have their text cleared automatically
   - Paragraphs with bullets will be automatically left aligned. Don't set the `alignment` property on when `"bullet": true`
   - Generate appropriate replacement content for placeholder text
   - Use shape size to determine appropriate content length
   - **CRITICAL**: Include paragraph properties from the original inventory - don't just provide text
   - **IMPORTANT**: When bullet: true, do NOT include bullet symbols (•, -, *) in text - they're added automatically
   - **ESSENTIAL FORMATTING RULES**:
     - Headers/titles should typically have `"bold": true`
     - List items should have `"bullet": true, "level": 0` (level is required when bullet is true)
     - Preserve any alignment properties (e.g., `"alignment": "CENTER"` for centered text)
     - Include font properties when different from default (e.g., `"font_size": 14.0`, `"font_name": "Lora"`)
     - Colors: Use `"color": "FF0000"` for RGB or `"theme_color": "DARK_1"` for theme colors
     - The replacement script expects **properly formatted paragraphs**, not just text strings
     - **Overlapping shapes**: Prefer shapes with larger default_font_size or more appropriate placeholder_type
   - Save the updated inventory with replacements to `replacement-text.json`
   - **WARNING**: Different template layouts have different shape counts - always check the actual inventory before creating replacements

   Example paragraphs field showing proper formatting:
   ```json
   "paragraphs": [
     {
       "text": "New presentation title text",
       "alignment": "CENTER",
       "bold": true
     },
     {
       "text": "Section Header",
       "bold": true
     },
     {
       "text": "First bullet point without bullet symbol",
       "bullet": true,
       "level": 0
     },
     {
       "text": "Red colored text",
       "color": "FF0000"
     },
     {
       "text": "Theme colored text",
       "theme_color": "DARK_1"
     },
     {
       "text": "Regular paragraph text without special formatting"
     }
   ]
   ```

   **Shapes not listed in the replacement JSON are automatically cleared**:
   ```json
   {
     "slide-0": {
       "shape-0": {
         "paragraphs": [...] // This shape gets new text
       }
       // shape-1 and shape-2 from inventory will be cleared automatically
     }
   }
   ```

   **Common formatting patterns for presentations**:
   - Title slides: Bold text, sometimes centered
   - Section headers within slides: Bold text
   - Bullet lists: Each item needs `"bullet": true, "level": 0`
   - Body text: Usually no special properties needed
   - Quotes: May have special alignment or font properties

7. **Apply replacements using the `replace.py` script**
   ```bash
   python .agent/workflows/skills/pptx/scripts/replace.py working.pptx replacement-text.json output.pptx
   ```

   The script will:
   - First extract the inventory of ALL text shapes using functions from inventory.py
   - Validate that all shapes in the replacement JSON exist in the inventory
   - Clear text from ALL shapes identified in the inventory
   - Apply new text only to shapes with "paragraphs" defined in the replacement JSON
   - Preserve formatting by applying paragraph properties from the JSON
   - Handle bullets, alignment, font properties, and colors automatically
   - Save the updated presentation

   Example validation errors:
   ```
   ERROR: Invalid shapes in replacement JSON:
     - Shape 'shape-99' not found on 'slide-0'. Available shapes: shape-0, shape-1, shape-4
     - Slide 'slide-999' not found in inventory
   ```

   ```
   ERROR: Replacement text made overflow worse in these shapes:
     - slide-0/shape-2: overflow worsened by 1.25" (was 0.00", now 1.25")
   ```


## Converting Slides to Images

To visually analyze PowerPoint slides, convert them to images using a two-step process:

1. **Convert PPTX to PDF**:
   ```bash
   soffice --headless --convert-to pdf template.pptx
   ```

2. **Convert PDF pages to JPEG images**:
   ```bash
   pdftoppm -jpeg -r 150 template.pdf slide
   ```
   This creates files like `slide-1.jpg`, `slide-2.jpg`, etc.

Options:
- `-r 150`: Sets resolution to 150 DPI (adjust for quality/size balance)
- `-jpeg`: Output JPEG format (use `-png` for PNG if preferred)
- `-f N`: First page to convert (e.g., `-f 2` starts from page 2)
- `-l N`: Last page to convert (e.g., `-l 5` stops at page 5)
- `slide`: Prefix for output files

Example for specific range:
```bash
pdftoppm -jpeg -r 150 -f 2 -l 5 template.pdf slide  # Converts only pages 2-5
```

## Code Style Guidelines
**IMPORTANT**: When generating code for PPTX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

Required dependencies (should already be installed):

### Python Packages
- **markitdown**: `pip install "markitdown[pptx]"` (for text extraction from presentations)
- **python-pptx**: `pip install python-pptx` (for template manipulation and thumbnail generation)
- **defusedxml**: `pip install defusedxml` (for secure XML parsing)

### Node.js Packages
- **pptxgenjs**: `npm install -g pptxgenjs` (for creating presentations via html2pptx)
- **playwright**: `npm install -g playwright` (for HTML rendering in html2pptx)
- **react-icons**: `npm install -g react-icons react react-dom` (for icons)
- **sharp**: `npm install -g sharp` (for SVG rasterization and image processing)

### System Packages

#### Linux (Ubuntu/Debian)
- **LibreOffice**: `sudo apt-get install libreoffice` (for PDF conversion)
- **Poppler**: `sudo apt-get install poppler-utils` (for pdftoppm to convert PDF to images)

#### macOS
- **LibreOffice**: `brew install --cask libreoffice` (for PDF conversion)
- **Poppler**: `brew install poppler` (for pdftoppm to convert PDF to images)

## Appendix: Helper Scripts

### `check_overflow.js` Template
Use this script to pre-validate HTML slides before conversion.

```javascript
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function checkOverflow(directory) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // PPTX 16:9 Slide Size: 10" x 5.625"
    // At 96 DPI: 960px x 540px
    await page.setViewportSize({ width: 960, height: 540 });

    const files = fs.readdirSync(directory).filter(f => f.endsWith('.html')).sort();
    
    console.log('=== Checking for overflow ===\n');
    
    let hasOverflow = false;
    const results = [];
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const fileUrl = `file://${filePath}`;
        
        await page.goto(fileUrl);
        await page.waitForLoadState('networkidle');

        const dimensions = await page.evaluate(() => {
            return {
                scrollHeight: document.body.scrollHeight,
                offsetHeight: document.body.offsetHeight,
                clientHeight: document.body.clientHeight
            };
        });

        const targetHeight = 540;
        const isOverflowing = dimensions.scrollHeight > targetHeight;
        
        if (isOverflowing) {
            const overflowAmount = dimensions.scrollHeight - targetHeight;
            const overflowPt = (overflowAmount * 72 / 96).toFixed(1); // Convert px to pt
            console.error(`❌ OVERFLOW: ${file}`);
            console.error(`   Height: ${dimensions.scrollHeight}px (Limit: ${targetHeight}px)`);
            console.error(`   Excess: ${overflowAmount}px (${overflowPt}pt)`);
            console.error(`   → Reduce font-size, padding, or margins\n`);
            hasOverflow = true;
            results.push({ file, overflow: overflowPt });
        } else {
            const headroom = targetHeight - dimensions.scrollHeight;
            console.log(`✅ OK: ${file} (${dimensions.scrollHeight}px, headroom: ${headroom}px)`);
        }
    }

    await browser.close();
    
    console.log('\n=== Summary ===');
    if (hasOverflow) {
        console.error(`\n⚠️  ${results.length} slide(s) have overflow issues:`);
        results.forEach(r => console.error(`   - ${r.file}: ${r.overflow}pt overflow`));
        console.error('\nPlease fix these before generating PPTX.\n');
        process.exit(1);
    } else {
        console.log('\n✅ All slides fit within bounds!\n');
    }
}

// Usage: node check_overflow.js ./assets/slides
const slidesDir = process.argv[2] || path.join(__dirname, 'assets/slides');
checkOverflow(slidesDir).catch(console.error);
```

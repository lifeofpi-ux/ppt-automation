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
    │   ├── thumbnails/            <-- Validation thumbnails
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

### Design Principles for Sophisticated Presentations

**CRITICAL**: To achieve a "very beautiful and sophisticated" look, follow these advanced design principles:

1.  **High Information Density & Professional Polish**:
    *   **Avoid Empty Slides**: While whitespace is important, slides must feel "rich" and "informative".
    *   **Maximize Text Content**: Do not just use keywords. Use full sentences, detailed descriptions, and explanatory subtext. Provide context, specs, and data.
    *   **Visual Texture**: Actively use **Badges, Tags, Status Pills, and Metadata** (e.g., "v2.0", "New", "High Priority") to add credibility and a professional "dashboard" feel.
    *   **Complex Layouts**: Prefer multi-column layouts and **Bento Grids** over simple centered text.

2.  **Typography-Driven Design**:
    *   **Font Selection (Cross-Platform)**:
        *   **Standard / Modern**: **Pretendard**, `Noto Sans KR`, `Malgun Gothic` (Windows), or `Apple SD Gothic Neo` (macOS).
        *   **Emotional / Storytelling**: **Noto Serif KR**, **Gowun Batang**, or `Batang` (Windows).
        *   *Instruction*: Always define a robust font stack in CSS: `font-family: 'Pretendard', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;`.
    *   **Contrast**: Pair a heavy weight (Bold/ExtraBold) header with a light/regular body.
    *   **Contrast**: Pair a heavy weight (Bold/ExtraBold) header with a light/regular body.
    *   **Tight Headings**: Use `letter-spacing: -0.02em` or `-0.03em` for large headings to make them look tighter and more professional.
    *   **Relaxed Body**: Use `line-height: 1.6` for body text to improve readability and elegance.
    *   **Font Weight**: Explicitly use `font-weight: 700` (or `bold`) in your CSS for headers to ensure they are rendered as **Bold** in PowerPoint.

3.  **Visual Hierarchy & Asymmetry**:
    *   Avoid boring center-aligned text for everything.
    *   Use **Asymmetric Layouts**: 1/3 text + 2/3 image, or vice versa.
    *   **Bento Grid**: Organize content in modular, card-based grids.

4.  **Micro-Details & Badges**:
    *   **Faithful Reproduction**: Small UI elements like badges, tags, pills, and status indicators add significant polish. Ensure these are faithfully implemented in HTML/CSS with precise padding, border-radius, and font sizes.
    *   **Visual Interest**: These small objects break up text density and add a layer of "designed" feel.

5.  **Key Color Strategy**:
    *   **Define Early**: Set a primary "Key Color" (Brand Color) at the start of the design process.
    *   **Consistent Application**: Use this color for primary actions, active states, key data points, and badges.
    *   **Harmony**: Ensure the key color contrasts well with the background and is used sparingly (10-20% of the slide) to maintain impact.

6.  **Art Direction with Generated Assets**:
    *   **Do NOT rely on CSS gradients** (they fail in conversion).
    *   **Do NOT use generic stock photos**.
    *   **STRATEGY**: Use `generate_image` to create bespoke backgrounds, textures, and illustrations.
    *   **Image Styling (MANDATORY)**: ALWAYS apply `border-radius: 12pt` (or 16px) to all content images (screenshots, photos) to ensure a modern, premium look. Sharp corners look outdated.

### Step 0: Design Selection Interaction (MANDATORY)

**Before starting ANY work**, you MUST ask the user to select a design style. Present the following options clearly:

> "어떤 디자인 스타일로 프레젠테이션을 생성할까요?"
> 
> 1. **Tech Showcase** (Modern, Glassmorphism, Bento Grid) - *Best for Apps/SaaS*
> 2. **Minimalist Corporate** (Clean, White/Navy, Trustworthy) - *Best for Business/Reports*
> 3. **Creative Storytelling** (Warm, Serif Fonts, Emotional) - *Best for Essays/Stories*
> 4. **Dark Mode Neon** (Black, Glowing, High Contrast) - *Best for Trends/Gaming*
> 5. **Custom Design** (Tell me your preference!)

**Action based on selection**:
- If **1-4 selected**: Read the corresponding template file from `.agent/workflows/skills/pptx/templates/`.
- If **5 selected**: Ask for specific requirements (color, vibe, font) and proceed with custom art direction.

### Using Design Templates

You can use pre-defined design templates to quickly achieve high-quality results.

#### Available Templates
- **Tech Showcase Style**: Modern, glassmorphic design for tech products.
  - **Reference**: `.agent/workflows/skills/pptx/templates/tech_showcase_style.md`
- **Minimalist Corporate**: Clean, professional business design.
  - **Reference**: `.agent/workflows/skills/pptx/templates/minimalist_corporate.md`
- **Creative Storytelling**: Emotional, narrative-driven design.
  - **Reference**: `.agent/workflows/skills/pptx/templates/creative_storytelling.md`
- **Dark Mode Neon**: Futuristic, high-contrast dark design.
  - **Reference**: `.agent/workflows/skills/pptx/templates/dark_mode_neon.md`
- **Academic Structured**: High-density, typography-driven design for education.
  - **Reference**: `.agent/workflows/skills/pptx/templates/academic_structured.md`

### Optimization: Parallel Asset Generation (HIGH PRIORITY)

To maximize efficiency, you **MUST** execute asset generation tasks in parallel whenever possible, using the `waitForPreviousTools: false` option.

**Parallel Workflow Strategy**:
1.  **Initial Setup**: Create project folders and scripts (Sequential).
2.  **Asset Generation (PARALLEL)**:
    *   Call `run_command` to execute the icon generation script.
    *   Call `generate_image` for Background 1.
    *   Call `generate_image` for Background 2.
    *   Call `generate_image` for Infographics.
    *   *Note*: Do NOT wait for one image to finish before starting the next.
3.  **HTML Creation (PARALLEL)**:
    *   Once assets are triggered, you can start writing `slide1.html`, `slide2.html`, etc., assuming the assets will be ready by the time the user renders them.
    *   *Note*: If you need to check the generated image path, you may need to wait, but generally, standard naming conventions allow you to write HTML blindly.

#### Hybrid Rendering & Styling Mechanism (3-Layer Strategy)

The `html2pptx` workflow uses an advanced **3-Layer Hybrid Rendering** approach to achieve 100% visual fidelity while maintaining text editability:

**Layer 1: Global Background**
- Captures the pure slide background (gradients, patterns, textures)
- All content (text, images, UI components) is hidden during this capture
- Becomes the slide's background image in PPTX

**Layer 2: Component Skeletons**
- Identifies UI components (`.card`, `.box`, `.bento-item`, etc.)
- Captures each component with text hidden but structure preserved
- Creates transparent PNG "skeleton" images that maintain complex CSS styling
- Inserted as images on top of the background layer

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

#### Modern Design Aesthetics & CSS Snippets

**1. Sophisticated Minimalist Aesthetic**
Achieve a premium look through **subtle textures**, **perfect typography**, and **generous whitespace**. Avoid harsh contrasts; use soft, harmonious color palettes.

**CRITICAL: modernized Card Design (The "Sample" Style)**
Instead of outdated "thick colored borders" (e.g., `border-left: 5px solid color`), use **Soft Shadow Cards**.
- **PROHIBITED**: `border-left: 4pt solid ...`, `border-bottom: 5px solid ...`, or any thick, crude borders.
- **Concept**: A "floating" white card on a soft gray/colored background.
- **Reference**: High rounded corners, soft diffused shadow, no visible border lines.
- **Accents**: Use text color or small, subtle indicators (e.g., icons, tags) for color accents, NOT thick lines.

```css
/* Sophisticated Theme Variables */
:root {
  --bg-color: #F5F5F7;      /* Soft Off-White / Light Gray */
  --text-primary: #1D1D1F;  /* Soft Black (Apple Style) */
  --text-secondary: #86868B;
  --accent-color: #0066CC;  /* Refined Blue */
  --card-bg: #FFFFFF;
}

/* Premium Feature Card (Replaces Thick Border Styles) */
.feature-card {
  background: var(--card-bg);
  border-radius: 18pt;      /* Highly rounded corners (24px) */
  padding: 24pt;            /* Generous padding */
  /* Premium Shadow: Soft ambient + crisp directional */
  box-shadow: 0 12pt 36pt rgba(0,0,0,0.06), 0 4pt 12pt rgba(0,0,0,0.03);
  border: none;             /* NO BORDERS */
  display: flex;
  flex-direction: column;
  gap: 12pt;
  transition: transform 0.2s ease;
}

/* Optional: Icon container within card */
.card-icon-box {
  width: 40pt;
  height: 40pt;
  background: #F2F2F7;
  border-radius: 50%;       /* Circular icon backing */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8pt;
}
```

**2. Detailed Bento Grid (Horizontal First)**
Use highly detailed, dashboard-style layouts. Prioritize **Horizontal Layouts** (Left-to-Right) over vertical stacks to save vertical space and improve readability.

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 Columns for high density */
  gap: 16pt;
  height: 100%;
}
.bento-item {
  background: rgba(255, 255, 255, 0.7); /* Glass-like opacity */
  border-radius: 16pt;
  padding: 20pt;
  display: flex;
  flex-direction: row; /* HORIZONTAL PREFERENCE */
  align-items: flex-start;
  gap: 16pt;
  box-shadow: 0 4pt 16pt rgba(0,0,0,0.04);
  border: 1px solid rgba(255, 255, 255, 0.6); /* Subtle border details, NOT thick */
}
/* Detailed content structure inside bento item */
.item-content {
  display: flex;
  flex-direction: column;
  gap: 4pt;
}
```

**3. Sophisticated Typography**
```css
h1 {
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  font-weight: 800;
  font-size: 40pt;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 20pt;
}
p {
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 16pt;
  line-height: 1.6;
  color: var(--text-secondary);
}
```

#### Visual Details Options

**Layout Innovations**:
- **Asymmetric Split**: 40% text column (left) + 60% full-bleed image/visual (right).
- **Floating Cards**: Content floats on top of a subtle, abstract background.
- **Overlap**: Allow an image to slightly overlap a text box (using negative margins or absolute positioning - *test carefully*).

**Background Treatments**:
- **Darkening Overlay**: When using image backgrounds, ALWAYS apply a dark gradient overlay to ensure text readability.
  ```css
  .slide-container {
      background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('../images/bg.png');
  }
  ```
- **Abstract Shapes**: Use large, soft blobs or geometric shapes in the background (generated image) to guide the eye.

**Icon & Data Visualization**:
- **Minimalist Icons**: Use `react-icons` (Feather or Heroicons) converted to PNG. Keep them small and framed in a circle.
- **Big Numbers**: For stats, make the number HUGE (e.g., 60pt+) and the label small.
- **Clean Charts**: Remove gridlines, remove axis lines, direct label data points.

**Image Styling Guidelines**:
- **Width Limit (CRITICAL)**: Images should generally **NOT exceed 1/3 (33%)** of the slide's total width. This ensures sufficient space for detailed text and prevents layout imbalance.
  - *Exception*: Full-bleed background images or specific "Visual Only" slides.
- **Rounded Corners**: Apply `border-radius: 12px` (approx. 9pt) to images for a modern, friendly look.
- **Aspect Ratio**: Always use `object-fit: cover` for content images to ensure they fill their container without distortion. **NEVER use `object-fit: contain` for content images** as it leaves empty space.
- **Icon Reset**: Explicitly set `object-fit: contain` for icons to prevent them from being cropped.
- **No Borders**: Do NOT add borders to images. Let them blend or stand out via shadow/contrast.
- **Shadows**: Use `box-shadow` to add depth. Example: `box-shadow: 0 8px 24px rgba(0,0,0,0.2);`.

#### Color Palette Selection (Sophisticated)

**Sophisticated Combinations**:
1.  **Midnight & Neon**: Deep Blue/Black background + Neon Purple/Blue accents (Tech/Future).
2.  **Earth & Stone**: Warm Beige/Sand background + Charcoal text + Sage Green accents (Natural/Calm).
3.  **Editorial**: Off-white background + Sharp Black text + One bold accent color (Red or Electric Blue).
4.  **Monochrome Layering**: Different shades of a single color (e.g., 5 shades of Blue) for depth.

**Rule of Thumb**:
-   **60%** Neutral (White, Beige, Soft Gray, or Dark Navy)
-   **30%** Secondary (Brand color or complementary tone)
-   **10%** Accent (Pop color for buttons, highlights, key numbers)

### Layout Tips
**When creating slides with charts or tables:**
- **Horizontal Layout (MANDATORY)**: Always prioritize a Left-to-Right flow.
  - **Left (60-70%)**: Detailed Text, Bullet Points, Explanations.
  - **Right (30-40%)**: Image, Chart, or Visual (Max 1/3 width preferred).
- **Two-column layout (PREFERRED)**: Use a header spanning the full width, then two columns below.
- **Full-slide layout**: Let the featured content (chart/table) take up the entire slide for maximum impact and readability
- **NEVER vertically stack**: Do not place charts/tables below text in a single column - this causes poor readability and layout issues

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`html2pptx.md`](skills/pptx/docs/html2pptx.md) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for detailed syntax, critical formatting rules, and best practices before proceeding with presentation creation.

2. **Art Direction & Asset Generation (Crucial Step)**:
   - **Define the Vibe & Key Color**: Decide on the color palette and visual style based on the presentation's content and purpose. **Explicitly define a Key Color** to be used throughout.
     - **Corporate/Business**: Clean, professional, data-driven (Blues, Grays, White space)
     - **Creative/Storytelling**: Emotional, artistic, narrative-driven (Warm tones, Illustrations, Textures)
     - **Tech/Innovation**: Modern, futuristic, dynamic (Neon accents, Dark backgrounds, Geometric shapes)
     - **Educational/Academic**: Clear, structured, informative (Earth tones, Serif fonts, Diagrams)
   
   - **Creative Slide Structures**: Design each slide with a structure that matches its content purpose:
     - **Title Slides**: Full-bleed background image with centered or asymmetric text overlay
     - **Story/Narrative**: Large visual (60-70%) + minimal text, or split-screen with image and quote
     - **Concept Explanation**: Bento grid with cards, or asymmetric 1/3 text + 2/3 illustration
     - **Process/Timeline**: Horizontal flow with icons/numbers, or vertical stepped layout
     - **Comparison**: Side-by-side split, or overlapping cards with different colors
     - **Key Message/Quote**: Centered text with decorative elements, or text on colored background block
     - **Data/Statistics**: Big number + context, or chart with minimal supporting text
     - **List/Points**: Icon-prefixed items in grid or vertical stack with glassmorphism cards
   
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

   - **2. Generate AI Images (Nanobanana - ALL Visualizations)**:
      - **Rule**: For EVERY visual element that is NOT a text prefix, you **MUST** use `generate_image` (Nanobanana).
      - **Request Structure**: Use the following JSON structure for image generation requests:
        ```json
        {
            "contents": [{
              "parts": [{"text": " 요청내용 "}]
            }],
            "tools": [{"googleSearch": {}}],
            "generationConfig": {
                "imageConfig": {
                  "aspectRatio": "16:9",
                  "imageSize": "4K"
              }
            }
        }
        ```
     - **Required Assets**:
       - **Backgrounds**: Generate unique, high-resolution backgrounds (e.g., "soft aurora gradient", "abstract geometric mesh", "paper texture"). **Do NOT use CSS gradients.**
       - **Infographics**: Generate specific diagrams or charts (e.g., "minimalist pie chart illustration", "process flow diagram").
       - **Illustrations**: Generate thematic illustrations for title slides and section dividers.
       - **Textures**: Generate subtle textures for card backgrounds or overlays.
     - **Prompts**: Write detailed, artistic prompts. Use keywords like "minimalist", "abstract", "high resolution", "soft lighting", "corporate memphis", "glassmorphism", "infographic style".
     - **Context**: Ensure the image style matches the presentation's "Vibe" (defined in step 2).
     - **Save**: Store generated images in `workspace/[project_name]/assets/images/` with descriptive names.

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

5. **Visual validation**: Generate thumbnails and inspect for layout issues
   - Create thumbnail grid: `python .agent/workflows/skills/pptx/scripts/thumbnail.py workspace/[project_name]/[project_name].pptx workspace/[project_name]/assets/thumbnails --cols 4`
   - Read and carefully examine the thumbnail image for:
     - **Text cutoff**: Text being cut off by header bars, shapes, or slide edges
     - **Text overlap**: Text overlapping with other text or shapes
     - **Positioning issues**: Content too close to slide boundaries or other elements
     - **Contrast issues**: Insufficient contrast between text and backgrounds
   - If issues found, adjust HTML margins/spacing/colors and regenerate the presentation
   - Repeat until all slides are visually correct

### Step 6: (Essential) Create Web Viewer

**MANDATORY**: To provide immediate verification and a premium delivery experience, you **MUST** create a web-based viewer for every presentation project.

**Use the Web Viewer Template:**
- **Template Location**: `.agent/workflows/skills/pptx/templates/web_viewer_template.html`
- **Action**: Copy this template to `workspace/[project_name]/index.html` and customize it.

**Key Features**:
- **Premium Dark Theme**: Sleek, dark background with subtle gradients and glassmorphism effects
- **Floating Navigation**: Semi-transparent bottom-center navigation bar with blur backdrop
- **Smooth Animations**: Fade transitions, hover effects, and micro-interactions
- **Progress Indicator**: Bottom progress bar showing current position
- **Keyboard Support**: Arrow keys and Space for navigation
- **Fullscreen Mode**: Toggle fullscreen with button or F key
- **Responsive Scaling**: Automatically fits 16:9 slides to any screen size
- **Touch Gestures**: Swipe left/right on touch devices

**Template Variables to Replace:**
- `{{PROJECT_NAME}}`: Replace with your project title
- `{{SLIDES_LIST}}`: Replace with JavaScript array of slide HTML content (inline)

**Alternative (Iframe Approach)**: 
If simple integration is preferred, use the Iframe approach (as demonstrated in previous steps):
1. Create `index.html`
2. Use an `<iframe>` to load `assets/slides/slide1.html`
3. Implement JavaScript logic to switch the `src` attribute of the iframe to navigate between slides.

**Alternative**: If generating a standalone viewer, inline all slide HTML content using:
```javascript
const slides = [
  `<!DOCTYPE html>...slide1 content...`,
  `<!DOCTYPE html>...slide2 content...`,
  // ...
];
```

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

## Creating Thumbnail Grids

To create visual thumbnail grids of PowerPoint slides for quick analysis and reference:

```bash
python .agent/workflows/skills/pptx/scripts/thumbnail.py template.pptx [output_prefix]
```

**Features**:
- Creates: `thumbnails.jpg` (or `thumbnails-1.jpg`, `thumbnails-2.jpg`, etc. for large decks)
- Default: 5 columns, max 30 slides per grid (5×6)
- Custom prefix: `python .agent/workflows/skills/pptx/scripts/thumbnail.py template.pptx my-grid`
  - Note: The output prefix should include the path if you want output in a specific directory (e.g., `workspace/my-grid`)
- Adjust columns: `--cols 4` (range: 3-6, affects slides per grid)
- Grid limits: 3 cols = 12 slides/grid, 4 cols = 20, 5 cols = 30, 6 cols = 42
- Slides are zero-indexed (Slide 0, Slide 1, etc.)

**Use cases**:
- Template analysis: Quickly understand slide layouts and design patterns
- Content review: Visual overview of entire presentation
- Navigation reference: Find specific slides by their visual appearance
- Quality check: Verify all slides are properly formatted

**Examples**:
```bash
# Basic usage
python .agent/workflows/skills/pptx/scripts/thumbnail.py presentation.pptx

# Combine options: custom name, columns
python .agent/workflows/skills/pptx/scripts/thumbnail.py template.pptx analysis --cols 4
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
- **LibreOffice**: `brew install --cask libreoffice` (for PDF conversion)
  - Provides `soffice` command for PPTX to PDF conversion
- **Poppler**: `brew install poppler` (for pdftoppm to convert PDF to images)
  - Provides `pdftoppm` command for PDF to image conversion
  - Required for thumbnail generation

**Note**: On macOS, both LibreOffice and Poppler are required for the thumbnail generation workflow to work properly.
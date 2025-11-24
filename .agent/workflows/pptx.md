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

### Design Principles for Sophisticated Presentations

**CRITICAL**: To achieve a "very beautiful and sophisticated" look, follow these advanced design principles:

1.  **Less is More (Negative Space)**:
    *   Don't fill every corner. White space (or negative space) is luxury.
    *   Give content room to breathe. Increase margins and padding beyond the minimum.
    *   **Rule**: If in doubt, remove it. If it's not essential, delete it.

2.  **Typography-Driven Design**:
    *   **Font Selection (Korean)**:
        *   **Standard / Modern**: **Pretendard** (or `Noto Sans KR`). Best for business, tech, and general use. Clean and legible.
        *   **Emotional / Storytelling**: **Noto Serif KR** (Elegant) or **Gowun Batang** (Lyrical). Best for quotes, literature, or luxury brands.
        *   **Friendly / Soft**: **Gowun Dodum** or **Nanum Gothic**.
        *   *Instruction*: Always include the Google Fonts `<link>` or `@import` in your HTML to ensure proper rendering.
    *   **Contrast**: Pair a heavy weight (Bold/ExtraBold) header with a light/regular body.
    *   **Tight Headings**: Use `letter-spacing: -0.02em` or `-0.03em` for large headings to make them look tighter and more professional.
    *   **Relaxed Body**: Use `line-height: 1.6` for body text to improve readability and elegance.
    *   **Font Weight**: Explicitly use `font-weight: 700` (or `bold`) in your CSS for headers to ensure they are rendered as **Bold** in PowerPoint.

3.  **Visual Hierarchy & Asymmetry**:
    *   Avoid boring center-aligned text for everything.
    *   Use **Asymmetric Layouts**: 1/3 text + 2/3 image, or vice versa.
    *   **Bento Grid**: Organize content in modular, card-based grids.

4.  **Art Direction with Generated Assets**:
    *   **Do NOT rely on CSS gradients** (they fail in conversion).
    *   **Do NOT use generic stock photos**.
    *   **STRATEGY**: Use `generate_image` to create bespoke backgrounds, textures, and illustrations.

#### Hybrid Rendering & Styling Mechanism
The `html2pptx` workflow uses a **Hybrid Rendering** approach to ensure 100% visual fidelity:
1.  **Background Capture**: The script hides all text elements and captures the entire slide (background images, CSS decorations, shapes) as a single high-resolution PNG image. This becomes the slide background.
2.  **Text Overlay**: It then extracts text elements (p, h1-h6, li) and overlays them as editable PowerPoint text boxes on top of the background image.

**Implications for Styling**:
*   **Complex CSS (Blur, Gradients, Shadows)**: Apply these to background containers (divs). They will be baked into the background image and look perfect.
*   **Text Containers**: Text containers themselves should generally be transparent. Do NOT apply borders or backgrounds to the specific `<p>` or `<h1>` tags if you want them editable, as the background capture handles the visual container.
*   **No Borders**: Do NOT use borders on tables or content divs unless explicitly required for a specific chart style. The default should be borderless for a clean look.

#### Modern Design Aesthetics & CSS Snippets

**1. Sophisticated Minimalist Aesthetic**
Achieve a premium look through **subtle textures**, **perfect typography**, and **generous whitespace**. Avoid harsh contrasts; use soft, harmonious color palettes.

```css
/* Sophisticated Theme Variables */
:root {
  --bg-color: #F5F5F7;      /* Soft Off-White / Light Gray */
  --text-primary: #1D1D1F;  /* Soft Black (Apple Style) */
  --text-secondary: #86868B;
  --accent-color: #0066CC;  /* Refined Blue */
}

/* Clean, Borderless Containers */
.content-card {
  background: transparent;
  border: none;            /* NO BORDERS */
  padding: 0;
  box-shadow: none;
}
```

**2. The "Bento Box" Grid Layout**
Use CSS Grid to create sophisticated, dashboard-style layouts.

```css
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24pt;
  height: 100%;
}
.bento-item {
  /* Very subtle background for structure without visual weight */
  background: rgba(255, 255, 255, 0.5); 
  border-radius: 20pt;
  padding: 30pt;
  display: flex;
  flex-direction: column;
  border: none;
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
- **Rounded Corners**: Apply `border-radius: 12px` (approx. 9pt) to images for a modern, friendly look.
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
- **Two-column layout (PREFERRED)**: Use a header spanning the full width, then two columns below - text/bullets in one column and the featured content in the other. This provides better balance and makes charts/tables more readable. Use flexbox with unequal column widths (e.g., 40%/60% split) to optimize space for each content type.
- **Full-slide layout**: Let the featured content (chart/table) take up the entire slide for maximum impact and readability
- **NEVER vertically stack**: Do not place charts/tables below text in a single column - this causes poor readability and layout issues

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`html2pptx.md`](skills/pptx/docs/html2pptx.md) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for detailed syntax, critical formatting rules, and best practices before proceeding with presentation creation.

2. **Art Direction & Asset Generation (Crucial Step)**:
   - **Define the Vibe**: Decide on the color palette and visual style based on the presentation's content and purpose:
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
  - Provides `soffice` command for PPTX to PDF conversion
- **Poppler**: `brew install poppler` (for pdftoppm to convert PDF to images)
  - Provides `pdftoppm` command for PDF to image conversion
  - Required for thumbnail generation

**Note**: On macOS, both LibreOffice and Poppler are required for the thumbnail generation workflow to work properly.
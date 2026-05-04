# The Verge Editorial Design Template

A dark, brutalist editorial design inspired by The Verge's 2024 redesign. Combines near-black canvas, acid-mint and ultraviolet hazard accents, heavy display typography, and saturated color-block cards arranged like a rave flyer timeline. The mood is "developer console meets club night meets tech tabloid."

> **Shared CSS**: All design tokens and components are defined in `.agent/workflows/skills/pptx/themes/verge.css`.
> Copy it to `workspace/[project]/assets/css/verge.css` and link it in every slide HTML.
> Use `.v-*` BEM classes directly — do NOT duplicate styles in per-slide `<style>` blocks.
> Per-slide `<style>` blocks should contain layout-only overrides (specific grid column widths, image `src` paths, unique one-off positions).

## Design System

### Color Palette

| Token | Value | Role |
|---|---|---|
| Canvas Black | `#131313` | Default surface — the entire slide background. No light mode. |
| Jelly Mint | `#3cffd0` | Primary CTA, active borders, kicker labels, saturated tile fill |
| Verge Ultraviolet | `#5200ff` | Secondary hazard, color-block accents, alternate tile fill |
| Console Mint Border | `#309875` | Card outlines when pure mint would over-saturate |
| Deep Link Blue | `#3860be` | Hover/accent link color |
| Surface Slate | `#2d2d2d` | Secondary card background |
| Image Frame | `#313131` | 1px border wrapping images |
| Hazard White | `#ffffff` | Primary text + card borders on dark canvas |
| Absolute Black | `#000000` | Text on mint/yellow/white tiles only |
| Secondary Text | `#949494` | Bylines, timestamps, metadata |
| Muted Text | `#e9e9e9` | Button text on slate buttons |
| Accent Yellow | `#ffe000` | Saturated tile fill (use sparingly) |
| Accent Pink | `#ff3d9a` | Saturated tile fill (use sparingly) |
| Accent Orange | `#ff6b1a` | Saturated tile fill (use sparingly) |

**Critical rules**:
- **No gradients, no glow, no box-shadow for elevation**. Use `1px solid` borders or saturated fills instead.
- Mint and Ultraviolet are **hazard accents**, never background washes.
- Dark canvas (`#131313`) is mandatory — never invert to light.
- All category tags, timestamps, kickers → **UPPERCASE** with `1.5–1.9px letter-spacing`.

### Typography

| Role | Font Stack | Size (pt) | Weight | Letter-Spacing | Notes |
|---|---|---|---|---|---|
| Hero Display | `Impact, 'Arial Narrow', Arial` | 52–72pt | 900 | 0.8px | Manuka substitute — always ≥45pt |
| Large Headline | `'Helvetica Neue', Arial, sans-serif` | 22–26pt | 700 | 0px | Section and module headlines |
| Heading Medium | `'Helvetica Neue', Arial, sans-serif` | 16–18pt | 700 | 0px | Card and tile headlines |
| Heading Small | `'Helvetica Neue', Arial, sans-serif` | 13–14pt | 700 | 0px | Compact tile headlines |
| Eyebrow / Kicker | `'Helvetica Neue', Arial, sans-serif` | 9–10pt | 300 | 1.43px | Thin-weight UPPERCASE before hero headline |
| All-Caps Label | `'Courier New', Courier, monospace` | 7–9pt | 600 | 1.35px | UPPERCASE timestamps, category tags, button text |
| Body Relaxed | `'Helvetica Neue', Arial, sans-serif` | 10–11pt | 400 | 0px | Body, deck copy — `line-height: 1.6` |
| Body Compact | `'Helvetica Neue', Arial, sans-serif` | 8–9pt | 400 | 0px | Secondary captions, metadata |
| Serif Pull | `Georgia, 'Times New Roman', serif` | 11–12pt | 400 | -0.12px | Review excerpts, magazine pull quotes |

**Substitution notes**: Impact renders at tighter line-height than Manuka. Use `line-height: 0.90–0.95` on hero text. `Courier New` covers all PolySans Mono use cases.

### Border Radius Scale (pt)
- **1.5pt** — inputs, micro badges (typewriter tag feel)
- **2.25pt** — nested card images
- **15pt** — standard pill cards and color-block tiles ← most common
- **18pt** — feature tile, primary CTA button
- **22.5pt** — large promotional buttons
- **30pt** — outlined CTA pill (largest pill)
- **50%** — avatar circles, round icon badges

### Elevation / Depth
**No `box-shadow` for elevation.** Hierarchy is conveyed by:
1. `1px solid #ffffff` hairline → quiet card outline on dark canvas
2. `1px solid #3cffd0` mint hairline → active / featured element
3. `1px solid #5200ff` ultraviolet hairline → promotional / alternate state
4. Saturated accent fill (mint, ultraviolet, yellow, pink, orange) → elevation via color block
5. `rgba(0,0,0,0.33) 0 0 0 1px` → subtle atmospheric ring on stacked cards

---

## CSS Class Reference

All styles come from `verge.css`. Do **not** re-declare these in per-slide `<style>` blocks.

| Class | Purpose |
|---|---|
| `.v-container` | Base slide container (column layout, 30/36/28pt padding) |
| `.v-container--row` | Row variant for split-column slides |
| `.v-hero` | Impact display title (60pt default). Modifiers: `--xl` 68pt, `--lg` 52pt, `--sm` 40pt |
| `.v-title` | PolySans section title (24pt 700). Modifier: `--sm` 20pt |
| `.v-eyebrow` | Thin-weight (300) UPPERCASE label, 1.9px tracking |
| `.v-kicker` | Mono UPPERCASE accent label (mint), 1.35px tracking |
| `.v-body` | Body copy 10pt, line-height 1.6. Modifier: `--compact` 8.5pt |
| `.v-card-title` | Card headline 13pt 700 |
| `.v-timestamp` | Mono UPPERCASE 7pt for StoryStream rail |
| `.v-stat` | Impact big number (mint). Modifiers: `--sm`, `--violet`, `--white` |
| `.v-header` | Slide header wrapper (eyebrow + title, gap 5pt, mb 16pt) |
| `.v-card` | Story card (dark + 1px white border, 15pt radius). Modifiers: `--mint`, `--violet`, `--yellow`, `--pink`, `--orange`, `--slate`, `--feature`, `--active` |
| `.v-grid` | CSS Grid wrapper. Modifiers: `--3col`, `--2col`, `--feature` (2fr 1fr), `--sidebar` (1fr 2fr) |
| `.v-stream` | StoryStream timeline rail (purple left border) |
| `.v-stream-item` | Single stream entry. Modifier: `--current` (mint accent) |
| `.v-stream-time` | Mono UPPERCASE timestamp on rail left |
| `.v-stream-body` | Stream entry text column |
| `.v-pill` | Inline pill tag (mono UPPERCASE). Modifiers: `--mint`, `--violet`, `--yellow`, `--outline`, `--ghost`, `--slate` |
| `.v-btn` | Pill button. Modifiers: `--primary` (mint), `--slate`, `--outline`, `--violet` |
| `.v-insight` | Bottom insight bar wrapper |
| `.v-insight-label` | UPPERCASE mono label in mint |
| `.v-insight-text` | Secondary-text insight sentence |
| `.v-cover` | Cover slide wrapper (bottom-pinned flex column) |
| `.v-divider` | Section divider wrapper. Modifiers: `--mint`, `--violet`, `--yellow`, `--slate` |
| `.v-divider__chapter` | Mono chapter number/label |
| `.v-divider__title` | Impact divider headline |
| `.v-divider__sub` | Thin uppercase descriptor |
| `.v-image` | Image with card border-radius + frame border |
| `.v-brand` | Slide number / brand strip (bottom-right absolute) |
| Utilities | `.v-mint`, `.v-violet`, `.v-muted`, `.v-mono`, `.v-upper`, `.v-tight`, `.v-flex-col`, `.v-flex-row`, `.v-stretch`, `.v-center` |

---

## Slide Layout Gallery

All examples assume `<link rel="stylesheet" href="../css/verge.css">` is in `<head>`.
Per-slide `<style>` blocks contain **layout overrides only** — no color or font declarations.

### Cover Slide
```html
<body>
<div class="v-cover">
  <p class="v-kicker" style="margin-bottom: 8pt; letter-spacing: 1.8px;">THE CATEGORY · ISSUE 01</p>
  <h1 class="v-hero v-hero--xl" style="margin-bottom: 14pt;">THE TITLE<br>GOES HERE</h1>
  <p class="v-body" style="max-width: 360pt; font-weight: 300; margin-bottom: 20pt;">
    A concise deck sentence that sets the editorial context. One or two lines maximum.
  </p>
  <span class="v-btn v-btn--primary">Read More</span>
</div>
</body>
```

### Section Divider (Mint)
```html
<body>
<div class="v-divider v-divider--mint">
  <p class="v-divider__chapter">01 — SECTION NAME</p>
  <h2 class="v-divider__title">CHAPTER<br>HEADING</h2>
  <p class="v-divider__sub">One-line descriptor in thin uppercase</p>
</div>
</body>
```

### Section Divider (Ultraviolet)
```html
<body>
<div class="v-divider v-divider--violet">
  <p class="v-divider__chapter">02 — SECTION NAME</p>
  <h2 class="v-divider__title">SECOND<br>CHAPTER</h2>
  <p class="v-divider__sub">Ultraviolet fill breaks the dark rhythm</p>
</div>
</body>
```

### 3-Column StoryStream Bento
```html
<body>
<div class="v-container">
  <div class="v-header">
    <p class="v-eyebrow">CATEGORY · SUBCATEGORY</p>
    <h2 class="v-title">Section Heading</h2>
  </div>
  <div class="v-grid v-grid--3col v-stretch">
    <div class="v-card v-flex-col">
      <p class="v-kicker">TOPIC A</p>
      <h3 class="v-card-title">Card headline goes here in two lines</h3>
      <p class="v-body--compact">Supporting body copy. One to two concise sentences that add editorial context.</p>
    </div>
    <div class="v-card v-card--mint v-flex-col">
      <p class="v-kicker">TOPIC B</p>
      <h3 class="v-card-title">Mint accent tile stands out</h3>
      <p class="v-body--compact">This tile uses mint fill — the hazard accent. Black text only here.</p>
    </div>
    <div class="v-card v-card--slate v-flex-col">
      <p class="v-kicker">TOPIC C</p>
      <h3 class="v-card-title">Slate secondary tile is quieter</h3>
      <p class="v-body--compact">Secondary context, supporting data, or a related concept goes here.</p>
    </div>
  </div>
  <div class="v-insight">
    <span class="v-insight-label">KEY TAKEAWAY</span>
    <p class="v-insight-text">One crisp synthesis sentence. This bar is used only when the slide has a meaningful "so what."</p>
  </div>
</div>
</body>
```

### 2-Column Feature Split (Image Left, Content Right)
```html
<body>
<div class="v-container v-container--row">
  <!-- Left: Image block (override width in per-slide style) -->
  <div class="v-card v-card--slate" style="width: 280pt; flex-shrink: 0; overflow: hidden; padding: 0;">
    <img class="v-image v-image--full" src="../images/hero.png" />
  </div>
  <!-- Right: Text content -->
  <div class="v-flex-col v-stretch" style="justify-content: center; gap: 10pt;">
    <p class="v-eyebrow">EYEBROW LABEL</p>
    <h2 class="v-title">Main Headline in Two Lines</h2>
    <p class="v-body">Body copy explaining the concept. Two to three sentences, light weight, relaxed line-height.</p>
    <div class="v-flex-row" style="flex-wrap: wrap; gap: 8pt; margin-top: 4pt;">
      <span class="v-pill v-pill--mint">FACT ONE</span>
      <span class="v-pill v-pill--outline">FACT TWO</span>
      <span class="v-pill v-pill--ghost">FACT THREE</span>
    </div>
  </div>
</div>
</body>
```

### StoryStream Timeline Slide
```html
<body>
<div class="v-container">
  <div class="v-header">
    <p class="v-eyebrow">TIMELINE</p>
    <h2 class="v-title">How We Got Here</h2>
  </div>
  <div class="v-stream">
    <div class="v-stream-item">
      <span class="v-stream-time">2020</span>
      <div class="v-stream-body">
        <p class="v-kicker">MILESTONE A</p>
        <p class="v-card-title">Event headline</p>
        <p class="v-body--compact">Short descriptor sentence. One to two lines.</p>
      </div>
    </div>
    <div class="v-stream-item">
      <span class="v-stream-time">2022</span>
      <div class="v-stream-body">
        <p class="v-kicker">MILESTONE B</p>
        <p class="v-card-title">Second event headline</p>
        <p class="v-body--compact">Short descriptor sentence. One to two lines.</p>
      </div>
    </div>
    <div class="v-stream-item v-stream-item--current">
      <span class="v-stream-time">NOW</span>
      <div class="v-stream-body">
        <p class="v-kicker">PRESENT</p>
        <p class="v-card-title">Current state headline</p>
        <p class="v-body--compact">Mint accent on current item signals "you are here."</p>
      </div>
    </div>
  </div>
  <div class="v-insight">
    <span class="v-insight-label">SYNTHESIS</span>
    <p class="v-insight-text">The bottom rail delivers the editorial "so what" for the timeline sequence.</p>
  </div>
</div>
</body>
```

### Big Stat / Data Callout Slide
```html
<body>
<div class="v-container">
  <div class="v-header">
    <p class="v-eyebrow">BY THE NUMBERS</p>
    <h2 class="v-title">Key Metrics</h2>
  </div>
  <div class="v-grid v-grid--2col v-stretch">
    <!-- Large Stat Card -->
    <div class="v-card v-flex-col" style="justify-content: center;">
      <p class="v-kicker">METRIC NAME</p>
      <p class="v-stat">84%</p>
      <p class="v-body--compact" style="max-width: 180pt;">Context sentence explaining what this stat means and why it matters.</p>
    </div>
    <!-- Secondary Cards stacked right -->
    <div class="v-flex-col" style="gap: 10pt;">
      <div class="v-card v-card--slate v-flex-col v-stretch">
        <p class="v-kicker">SECONDARY METRIC</p>
        <p class="v-stat v-stat--sm v-stat--white">2.4×</p>
        <p class="v-body--compact">Supporting context for the secondary number.</p>
      </div>
      <div class="v-card v-card--active v-flex-col v-stretch" style="border-color: var(--violet);">
        <p class="v-kicker v-violet">TERTIARY METRIC</p>
        <p class="v-stat v-stat--sm v-stat--violet">$12M</p>
        <p class="v-body--compact">Supporting context for the third number.</p>
      </div>
    </div>
  </div>
  <div class="v-insight">
    <span class="v-insight-label">SOURCE</span>
    <p class="v-insight-text">Data source or synthesis note goes in this insight rail.</p>
  </div>
</div>
</body>
```

---

## AI Image Generation Notes

When generating assets for this template using the `generate_design_assets.js` script:

**`bg_cover.png`** (1920×1080):
> "NO text, NO words, NO letters. Near-black editorial canvas #131313. Abstract particle field or digital noise texture — think encrypted data streams or circuit ghost lines in acid-mint #3cffd0 fading to near-invisible on the right side. Left 70% must be near-black for white text legibility. Cinematic depth of field. Flat, no glow, no gradients — raw signal aesthetic."

**`bg_section_mint.png`** (1920×1080):
> "NO text, NO words. Solid acid-mint #3cffd0 canvas with ultra-subtle halftone dot texture or fine grid lines. Completely flat depth — no gradient, no shadow. The texture should be barely perceptible at normal reading distance, like a newsprint raster."

**`bg_section_violet.png`** (1920×1080):
> "NO text, NO words. Solid ultraviolet #5200ff canvas with ultra-subtle noise grain. Completely flat — no gradient. Like a risograph print in one color with slight texture."

**`bg_card_verge.png`** (512×512):
> "NO text, NO words. Near-black #131313 square. Ultra-subtle encrypted-signal noise or fine mesh texture — 1% opacity visual grain only. Flat depth, no gradient, no glow."

---

## Quality Checklist (The Verge Acceptance Criteria)

- [ ] Canvas is `#131313` everywhere — no light backgrounds, no gray washes
- [ ] Zero `box-shadow` properties for elevation — use `1px solid` borders or accent fills
- [ ] Zero gradient `backgrounds` — solid color blocks only
- [ ] All category tags, kickers, timestamps, button text → UPPERCASE with `≥1.35px letter-spacing`
- [ ] Hero/display text uses Impact or equivalent condensed heavy face at ≥45pt
- [ ] Every card/container has a border-radius on the scale (15pt standard, 18pt feature)
- [ ] Mint (`#3cffd0`) and Ultraviolet (`#5200ff`) appear only as accents — never as background washes
- [ ] At least one saturated color-block tile per content slide to "break the rhythm"
- [ ] Insight bar used only when a meaningful "so what" synthesis exists
- [ ] No decorative shadows, no glow, no blur effects

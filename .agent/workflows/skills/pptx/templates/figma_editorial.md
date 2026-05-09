# Figma Editorial Design Template

A confident black-and-white editorial frame interrupted by oversized pastel color blocks. The slide canvas is rigorously monochrome — pure white surfaces, pure black ink, ultra-light Pretendard weight for headlines — while section dividers and feature panels drop into saturated lime, lavender, cream, mint, pink, or coral panels that read like sticky notes placed on a clean desk. The mood is both technical and joyful: a tool for serious work, made by people who like color.

> **Shared CSS**: All design tokens and components are defined in `.agent/workflows/skills/pptx/themes/figma.css`.
> Copy it to `workspace/[project]/assets/css/figma.css` and link it in every slide HTML.
> Use `.fig-*` BEM classes directly — do NOT duplicate styles in per-slide `<style>` blocks.
> Per-slide `<style>` blocks should contain layout-only overrides (grid dimensions, image paths, unique positions).

---

## Design System

### Color Palette

| Token | Value | Role |
|---|---|---|
| Ink | `#000000` | All text, primary CTA, every headline |
| Canvas | `#ffffff` | Default slide background — the editorial paper |
| Surface Soft | `#f7f7f5` | Off-white tile backgrounds, feature illustration tiles |
| Hairline | `#e6e6e6` | 1px card borders, table dividers |
| Hairline Soft | `#f1f1f1` | Subtler row separators |
| Block Lime | `#dceeb1` | Systems/FAQ/contact panels — most recurring block |
| Block Lilac | `#c5b0f4` | Design hero panels, highlight sections |
| Block Cream | `#f4ecd6` | Warm feature sections |
| Block Mint | `#c8e6cd` | Fresh content sections |
| Block Pink | `#efd4d4` | Soft story sections |
| Block Coral | `#f3c9b6` | Product / ship-it story blocks |
| Block Navy | `#1f1d3d` | Dark inverse block — the only dark surface above footer |
| Accent Magenta | `#ff3d8b` | Single-use promo CTA — one per deck maximum |
| Success Green | `#1ea64a` | Comparison table checkmarks only |

**Critical rules**:
- The canvas is **always white** (`#ffffff`). No dark mode.
- Text hierarchy comes from **weight, not color**. Body is always black at weight 200–300; weight carries the emphasis.
- Color blocks are **full slides or full panels** — not accent borders or small chips.
- Between any two color-block slides, always return to a white-canvas content slide.
- Never combine two color-block slides back-to-back.
- `--fig-magenta` is a single-shot color: one promo pill per deck, never two.

### Typography

All fonts: `'Pretendard Variable', 'Pretendard', sans-serif`

figmaSans variable weight axis → Pretendard mapping:

| Role | CSS Class | Weight | Size (pt) | Letter-Spacing | Notes |
|---|---|---|---|---|---|
| Display XL | `.fig-display-xl` | 300 (Light) | 48pt | −1.2pt | Hero headline, cover |
| Display LG | `.fig-display-lg` | 300 (Light) | 36pt | −0.7pt | Section opener |
| Headline | `.fig-headline` | 600 (SemiBold) | 15pt | −0.15pt | Inside color blocks |
| Subhead | `.fig-subhead` | 300 (Light) | 15pt | −0.15pt | Long-form intro para |
| Card Title | `.fig-card-title` | 700 (Bold) | 13pt | 0 | Pricing tiers, feature cards |
| Body LG | `.fig-body-lg` | 300 (Light) | 12pt | −0.05pt | Lead/hero body copy |
| Body | `.fig-body` | 200 (ExtraLight) | 10pt | 0 | Default body |
| Body SM | `.fig-body-sm` | 300 (Light) | 8.5pt | 0 | Card body, secondary text |
| Eyebrow | `.fig-eyebrow` | 400 (Regular) | 7.5pt | 2.5pt | UPPERCASE mono-feel section markers |
| Caption | `.fig-caption` | 400 (Regular) | 7pt | 2pt | UPPERCASE footnotes, brand strip |

**Weight philosophy**: A 12pt paragraph at weight 300 sits next to a 12pt card title at weight 700 — emphasis is weight, not size.
**Negative tracking scales with size**: Large display pulls −1.2pt; subhead pulls −0.15pt; body is near-zero.

### Border Radius Scale

| Token | Value (pt) | Use |
|---|---|---|
| `--fig-r-xs` | 1.5pt | Micro badges, anchor tags |
| `--fig-r-sm` | 4.5pt | Small chips, sub-nav tabs |
| `--fig-r-md` | 6pt | Feature illustration tiles, surface cards |
| `--fig-r-lg` | 18pt | Pricing cards, color-block cards — most common |
| `--fig-r-xl` | 24pt | Hero callout panels |
| `--fig-r-pill` | 37.5pt | All CTA pills |
| `--fig-r-full` | 999pt | Circular icon buttons, comparison checkmarks |

### Elevation & Depth

No `box-shadow` for elevation. Depth is created by:
1. **1px `var(--fig-hairline)` border** on white cards — quiet, editorial
2. **Color-block section background** — the primary depth device; a block lime section reads as elevated by contrast with surrounding white canvas
3. **`var(--fig-surface-soft)` tile** — subtle off-white lift for feature tiles on white canvas
4. Never add drop shadows to color-block panels.

---

## CSS Class Reference

All styles come from `figma.css`. Do **not** re-declare these in per-slide `<style>` blocks.

| Class | Purpose |
|---|---|
| `.fig-container` | Base slide container (column, 32/40/28pt padding, white bg) |
| `.fig-container--row` | Row variant for split-column slides |
| `.fig-header` | Section header wrapper (column, 5pt gap, 18pt margin-bottom) |
| `.fig-cover` | Cover slide (white, flex-end column, 44/52/40pt padding) |
| `.fig-block` | Full-slide color block container |
| `.fig-block--lime/lilac/cream/mint/pink/coral/navy` | Color block variants |
| `.fig-block-inner` | Inner content column (max-width 500pt, centered text column) |
| `.fig-card` | White hairline-bordered card (18pt radius) |
| `.fig-card--surface` | Soft-white tile card (6pt radius, no border) |
| `.fig-card--lime/lilac/cream/mint/pink/coral/navy` | Pastel card fill variants |
| `.fig-grid` | Grid container (flex: 1) |
| `.fig-grid--2col/3col/4col` | Column layout variants |
| `.fig-pill` | Pill badge (37.5pt radius, uppercase, spaced) |
| `.fig-pill--primary/outline/surface/lime/lilac/magenta/inv` | Pill color variants |
| `.fig-insight` | Bottom takeaway bar (hairline top border, flex row) |
| `.fig-insight-label` | Insight label (6pt, 600, uppercase, spaced) |
| `.fig-insight-text` | Insight body (8.5pt, 300, 65% black) |
| `.fig-divider` | Section divider slide (white canvas, centered column) |
| `.fig-divider--lime/lilac/navy` | Color block divider variants |
| `.fig-divider__chapter` | Chapter marker (7.5pt, uppercase, 2.5pt spaced, 45% opacity) |
| `.fig-divider__title` | Divider headline (44pt, 300, -1pt tracking) |
| `.fig-divider__sub` | Divider subtitle (10pt, 300, 50% opacity) |
| `.fig-brand` | Bottom-right brand strip (6.5pt, uppercase, 30% opacity) |
| `.fig-display-xl/lg` | Hero display type (48pt / 36pt, weight 300) |
| `.fig-headline` | Block headline (15pt, weight 600) |
| `.fig-subhead` | Block subhead (15pt, weight 300) |
| `.fig-card-title` | Card title (13pt, weight 700) |
| `.fig-body-lg/body/body-sm` | Body copy at 12/10/8.5pt |
| `.fig-eyebrow` | Section eyebrow (7.5pt, uppercase, 2.5pt tracking, 50% opacity) |
| `.fig-caption` | Caption / footer text (7pt, uppercase, 2pt tracking) |

---

## Slide Patterns

### 1. Cover — White Canvas Hero

```html
<body>
<div class="fig-cover">
  <p class="fig-eyebrow">DECK CATEGORY · 부제목</p>
  <h1 class="fig-display-xl">Headline<br>Spanning<br>Three Lines</h1>
  <p class="fig-body-lg" style="max-width:420pt; margin-top:8pt;">
    Lead sentence describing what this presentation covers.
    Short and confident.
  </p>
  <div style="display:flex; gap:8pt; margin-top:12pt; flex-wrap:wrap;">
    <span class="fig-pill fig-pill--primary">TAG ONE</span>
    <span class="fig-pill fig-pill--outline">TAG TWO</span>
    <span class="fig-pill fig-pill--lime">TAG THREE</span>
  </div>
</div>
<div class="fig-brand">DECK TITLE · YOUR BRAND</div>
</body>
```

**Rules**: White background only. Display-xl weight 300 in black. Eyebrow in monospace-feel uppercase. Pills at bottom. Never add an image to the cover — white space is the design.

---

### 2. Color Block — Section Feature (Signature Pattern)

```html
<body>
<div class="fig-block fig-block--lime">   <!-- or --lilac, --cream, --mint, --pink, --coral, --navy -->
  <div class="fig-block-inner">
    <p class="fig-eyebrow">SECTION LABEL · 섹션 이름</p>
    <h2 class="fig-display-lg">Main Point<br>of This Section</h2>
    <p class="fig-body-lg" style="max-width:420pt;">
      Supporting paragraph that elaborates the main point.
      Weight 300, max ~2 sentences on a block slide.
    </p>
    <div style="display:flex; gap:8pt; margin-top:8pt;">
      <span class="fig-pill fig-pill--primary">CTA ACTION</span>
    </div>
  </div>
</div>
<div class="fig-brand">DECK TITLE · YOUR BRAND</div>
</body>
```

**Rules**: One color block per slide. Centered column of text, max-width ~500pt, left-aligned inside the column. Navy block uses white text — all other blocks use black text. Never add card components inside a block slide; the block IS the card.

---

### 3. Content — White Slide with Card Grid

```html
<body>
<div class="fig-container">
  <div class="fig-header">
    <p class="fig-eyebrow">FEATURE SET · 기능 그룹</p>
    <h2 class="fig-headline" style="font-size:20pt; font-weight:300;">Section Headline</h2>
  </div>

  <div class="fig-grid fig-grid--3col">
    <div class="fig-card fig-card--lime">
      <p class="fig-eyebrow">01</p>
      <p class="fig-card-title">Feature Name</p>
      <p class="fig-body-sm">Short description. Max 2–3 sentences. Weight carries hierarchy.</p>
    </div>
    <div class="fig-card">
      <p class="fig-eyebrow">02</p>
      <p class="fig-card-title">Feature Name</p>
      <p class="fig-body-sm">Short description here.</p>
    </div>
    <div class="fig-card fig-card--surface">
      <p class="fig-eyebrow">03</p>
      <p class="fig-card-title">Feature Name</p>
      <p class="fig-body-sm">Short description here.</p>
    </div>
  </div>

  <div class="fig-insight">
    <span class="fig-insight-label">KEY TAKEAWAY</span>
    <p class="fig-insight-text">One concise synthesis sentence that anchors the slide.</p>
  </div>
</div>
<div class="fig-brand">DECK TITLE · YOUR BRAND</div>
</body>
```

---

### 4. Divider — Section Break

```html
<body>
<div class="fig-divider fig-divider--lime">   <!-- or --lilac, --navy, or default white -->
  <p class="fig-divider__chapter">CHAPTER 02</p>
  <h2 class="fig-divider__title">Section<br>Title Here</h2>
  <p class="fig-divider__sub">Brief description of what this chapter covers</p>
</div>
<div class="fig-brand">DECK TITLE · YOUR BRAND</div>
</body>
```

**Rules**: No card grid, no insight bar. The block color IS the message. Navy variant for climax/closing chapters.

---

### 5. Two-Column — Content + Visual

```html
<body>
<div class="fig-container fig-container--row">
  <div class="fig-flex-col fig-stretch">
    <p class="fig-eyebrow">LEFT PANEL · 왼쪽</p>
    <h2 class="fig-headline" style="font-size:18pt; font-weight:300; margin-bottom:10pt;">Column Headline</h2>
    <p class="fig-body">Body copy for the left column.</p>
    <p class="fig-body" style="margin-top:6pt;">Second paragraph of body copy.</p>
  </div>

  <div class="fig-flex-col fig-stretch">
    <p class="fig-eyebrow">RIGHT PANEL · 오른쪽</p>
    <div class="fig-card fig-card--lilac" style="flex:1;">
      <p class="fig-card-title">Right Panel Headline</p>
      <p class="fig-body-sm">Right column content, shorter copy.</p>
    </div>
  </div>
</div>
<div class="fig-brand">DECK TITLE · YOUR BRAND</div>
</body>
```

---

## Slide Rhythm (Recommended Deck Structure)

The Figma system alternates white canvas with pastel panels. Stick to this pacing:

```
Cover (white)
→ Divider: chapter 1 (lime or lilac)
→ Content slide: card grid (white)
→ Content slide: two-column (white)
→ Color block: key message (coral or mint)
→ Content slide: list or timeline (white)
→ Divider: chapter 2 (lilac or cream)
→ Content slide (white)
→ Color block: climax message (navy)
→ Cover-style closing (white, "Start today" CTA)
```

Never place two color-block slides (fig-block or fig-divider with color) adjacent to each other.

---

## Quality Checklist

- [ ] Canvas is white (`#ffffff`) on all non-block slides
- [ ] No two color-block slides are adjacent
- [ ] Display text (`fig-display-xl`, `fig-display-lg`) uses weight 300 only
- [ ] Card titles use weight 700; body copy uses weight 200–300
- [ ] Eyebrows and captions are UPPERCASE with tracking ≥ 2pt
- [ ] Pills use `fig-r-pill` (37.5pt radius) — no square buttons
- [ ] No drop shadows anywhere; hairline borders and color blocks carry depth
- [ ] `fig-magenta` used at most once per deck
- [ ] Navy block (`fig-block--navy`) uses white text — all `fig-eyebrow` inside are overridden
- [ ] Brand strip (`fig-brand`) present on every slide at bottom-right
- [ ] Insight bar only when the slide has a genuine "so what" synthesis

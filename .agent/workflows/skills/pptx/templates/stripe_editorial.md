# Stripe Editorial — PPTX Design Spec

> Source: `npx getdesign@latest add stripe` → `DESIGN.md`
> Shared CSS: `themes/stripe.css` · BEM prefix: `.str-*`
> Canvas: 720pt × 405pt (16:9) · Font: Pretendard (Sohne thin-300 signature)

## 1. Design Philosophy

Stripe's marketing language is **financial-infrastructure calm**: a deep-navy ink that is never pure black, a single electric indigo reserved for one decisive accent per surface, and a signature **gradient mesh** — cream → sherbet orange → lavender → indigo → ruby — washed across the upper third of every hero. Type is **Sohne thin (weight 300) with negative letter-spacing**: editorial air, generous whitespace, and tabular figures wherever a number means money or scale.

For slides this translates to:
- **Restraint over spectacle.** White/soft-cool canvas, one indigo CTA-colour accent, hairline-bordered cards. The mesh does the decorating; everything else stays quiet.
- **Thin display, legible body.** Headlines render at weight 300 with negative tracking (the brand's air). Body and small labels bump to 400–600 only for projector legibility.
- **Tabular numerics.** KPIs, budget figures, adoption rates and table number-cells use `tnum` + negative tracking — Stripe's quiet financial-data tell.
- **Dark featured surfaces.** Section dividers and "featured"/insight panels flip to deep navy `#1c1e54`, mirroring Stripe's inverted featured-pricing tier and dashboard chrome.

## 2. Color Palette

| Token | Hex | Role |
|---|---|---|
| `--str-primary` | `#533afd` | Signature indigo — one accent per surface, KPI numerals, rails |
| `--str-primary-deep` | `#4434d4` | Eyebrow text, pressed/deep accent |
| `--str-primary-soft` | `#665efd` | Chart highlight, secondary accent |
| `--str-primary-subdued` | `#b9b9f9` | Soft pill background, dark-surface eyebrow |
| `--str-brand-dark` | `#1c1e54` | Section dividers, insight bars, featured cards, dashboard chrome |
| `--str-ruby` | `#ea2261` | Gradient accent / warning rail — never a button |
| `--str-magenta` | `#f96bee` | Brighter gradient stop (mesh art only) |
| `--str-ink` | `#0d253d` | Default heading text — deep navy, never black |
| `--str-ink-secondary` | `#273951` | Body text |
| `--str-ink-mute` | `#64748d` | Captions, table labels, page numbers |
| `--str-canvas` | `#ffffff` | Default background |
| `--str-canvas-soft` | `#f6f9fc` | Feature-band / soft-card fill |
| `--str-canvas-cream` | `#f5e9d4` | Warm interlude card — chromatic break |
| `--str-hairline` | `#e3e8ee` | 1px card & table borders |

**Rules:** indigo is a CTA/accent colour, never body text. No accent colours outside the documented gradient stops. Money/numeric cells always use tabular figures.

## 3. Typography (Pretendard, mapped from Sohne)

| Class | Size / Weight | Tracking | Use |
|---|---|---|---|
| `.str-display-xl` | 40pt / 300 | -1.2pt | Cover & divider hero |
| `.str-display-lg` | 30pt / 300 | -0.8pt | Slide title |
| `.str-display-md` | 23pt / 300 | -0.45pt | Compact title / big stat label |
| `.str-heading` | 16pt / 300 | -0.3pt | Lead sentence / sub-section |
| `.str-subhead` | 13pt / 300 | -0.15pt | Supporting lead |
| `.str-card-title` | 12pt / 600 | -0.1pt | Card headline (legibility bump) |
| `.str-body-lg` | 11pt / 400 | — | Marketing body lead |
| `.str-body` | 9.5pt / 400 | — | Default body |
| `.str-body-sm` | 8.5pt / 400 | — | Dense body / captions |
| `.str-tabular` | 9pt / 400 `tnum` | -0.3pt | Inline numerics |
| `.str-kpi` | 32pt / 300 `tnum` | -1pt | Big metric numeral |
| `.str-eyebrow` | 7.5pt / 600 caps | 2pt | Kicker above title |
| `.str-caption` | 7pt / 500 caps | 1.5pt | Micro label |

Keep display tiers at weight 300 — bumping to 400+ collapses the brand's air.

## 4. CSS Class Reference

- **Layout:** `.str-container` (white), `.str-container--soft` (cool off-white), `.str-container--row`. Header: `.str-header`, `.str-header__bar`, `.str-rule`.
- **Cover:** `.str-cover` + `.str-cover__meta`; mesh image as `.str-mesh.str-mesh--top` (selectable design layer).
- **Divider:** `.str-divider` (deep navy) + `.str-divider__index` (giant ghost numeral) + optional `.str-mesh`.
- **Cards:** `.str-card` (white+hairline+shadow), `--soft`, `--cream`, `--primary` (indigo), `--dark` (navy), `--rail` / `--rail-ruby` (accent left edge).
- **Grid:** `.str-grid` + `--2col … --5col`.
- **Index token:** `.str-num` (filled indigo circle) / `.str-num--soft`.
- **Pills:** `.str-pill` (soft) + `--primary --dark --ruby --outline`.
- **Insight bar:** `.str-insight` + `.str-insight__label` + `.str-insight__text` (navy "so-what" footer).
- **Tables:** `.str-table` with `th`/`td`, `td.num` (tabular right-aligned), `tr.hl` (indigo-tinted highlight row).
- **Chrome:** `.str-pagenum` (bottom-left), `.str-brand` (bottom-right).
- **Utility:** `.str-flex-col/.str-flex-row/.str-row-center/.str-stretch/.str-between/.str-muted/.str-accent/.str-ruby/.str-kpi`.

## 5. Slide Patterns

### Cover
```html
<div class="str-cover">
  <img class="str-mesh str-mesh--top" data-pptx-layer="design" src="../images/bg_cover_mesh.png">
  <span class="str-pill str-pill--primary">VIVASAM STRATEGY</span>
  <h1 class="str-display-xl">변화의 시대,<br>현장 변화와 전략</h1>
  <p class="str-heading str-muted">Just 2 Steps before</p>
  <div class="str-cover__meta">
    <p class="str-caption">2026 · 콘텐츠 컴퍼니 전략 분석</p>
  </div>
</div>
```

### Section Divider (간지)
```html
<div class="str-divider">
  <img class="str-mesh str-mesh--top" data-pptx-layer="design" src="../images/bg_section_mesh.png">
  <p class="str-eyebrow">PART 1</p>
  <h2 class="str-display-xl">공교육의 변화 양상</h2>
  <p class="str-body-lg">핵심 질문 한 줄.</p>
  <p class="str-divider__index">01</p>
</div>
```

### Content Grid (cards)
```html
<div class="str-container">
  <div class="str-header">
    <p class="str-eyebrow">EXECUTIVE SUMMARY</p>
    <h2 class="str-display-lg">슬라이드 제목</h2>
  </div>
  <div class="str-grid str-grid--2col">
    <div class="str-card str-card--rail">
      <p class="str-card-title">카드 제목</p>
      <p class="str-body-sm">카드 본문.</p>
    </div>
    <!-- … -->
  </div>
  <div class="str-pagenum"><p>02 / 29</p></div>
  <div class="str-brand"><p>VIVASAM</p></div>
</div>
```

### Two-column lead + KPI
```html
<div class="str-container str-container--row">
  <div class="str-stretch str-flex-col">…lead + insight…</div>
  <div class="str-card str-card--dark" style="width:230pt">
    <p class="str-kpi">8.1%</p>
    <p class="str-body-sm">10일 이상 활용 학생 비율</p>
  </div>
</div>
```

### Data table
Use `.str-table` for comparison/budget matrices; wrap money/percent in `td.num`; highlight the decisive row with `tr.hl`.

### Closing / synthesis
Principle cards on `--soft` + a final `.str-insight` navy bar carrying the one-sentence thesis.

## 6. Slide Rhythm
- Cover (mesh) → divider (navy) → 3–5 content slides → divider → … → closing.
- Alternate white `.str-container` and cool `.str-container--soft` between adjacent content slides to create chapters.
- One mesh image on cover + one per section divider; content slides stay mesh-free (restraint).
- Max **one** indigo filled element per slide; everything else hairline/navy/ink.

## 7. Quality Checklist
- [ ] Every slide title at weight 300 with negative tracking.
- [ ] Exactly one indigo accent per content slide.
- [ ] All money/percent/scale figures use `tnum` (`.str-tabular`/`.str-kpi`/`td.num`).
- [ ] Section dividers are deep-navy with a ghost numeral; cover & dividers carry the mesh.
- [ ] Cards carry hairline borders + subtle Level-1 shadow; featured = navy.
- [ ] No CSS gradients (mesh is a generated PNG design layer); no emojis; text in `<p>/<h*>/<ul>` only.
- [ ] Page number + VIVASAM brand strip on every content slide.
- [ ] No overflow at 720×405pt (run `check_overflow.js`).

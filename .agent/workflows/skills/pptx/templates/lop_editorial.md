# LOP Editorial Design Template

A Korean EdTech SaaS aesthetic: off-white dot-grid canvas, clean white card panels, emerald/teal primary accent, pastel feature cards, and a strong dark-navy CTA style. The mood is educational, interactive, and data-forward — like a polished classroom dashboard built by a product team that genuinely cares about delight. Key visual signatures are the subtle dot-grid background texture, the rounded-pill navigation bar, and the pastel card quartet (blue, teal, yellow, pink) used to showcase feature categories.

> **Shared CSS**: All design tokens and components are defined in `.agent/workflows/skills/pptx/themes/lop.css`.
> Copy it to `workspace/[project]/assets/css/lop.css` and link it in every slide HTML.
> Use `.lop-*` BEM classes directly — do NOT duplicate styles in per-slide `<style>` blocks.
> Per-slide `<style>` blocks should contain layout-only overrides (grid dimensions, specific widths, image paths).

---

## Design System

### Color Palette

| Token | Value | Role |
|---|---|---|
| Ink | `#0f172a` | All headlines, primary text — near-black navy |
| Ink Soft | `#475569` | Body copy — slate |
| Ink Muted | `#94a3b8` | Captions, metadata, placeholder text |
| Canvas | `#f6f8fa` | Default slide background — off-white with dot texture |
| Canvas White | `#ffffff` | Card and panel surfaces |
| Surface | `#f1f5f9` | Slightly deeper tile / alternate row |
| Emerald | `#10b981` | Primary CTA, progress bars, eyebrows, active accents |
| Emerald Dark | `#059669` | Hover/pressed variant |
| Emerald Pale | `#d1fae5` | Icon badge backgrounds, ghost button fill |
| Navy | `#1e293b` | Strong CTA button, dark card surface, active nav pill |
| Violet | `#8b5cf6` | Secondary accent, chart color 3 |
| Violet Pale | `#ede9fe` | Violet badge background |
| Cyan | `#06b6d4` | Tertiary data accent |
| Hairline | `#e2e8f0` | 1px card borders, table dividers |
| Hairline Soft | `#f1f5f9` | Subtle row separators |
| Card Blue | `#dbeafe` | Interactive / engagement feature card |
| Card Teal | `#ccfbf1` | Real-time survey feature card |
| Card Yellow | `#fef9c3` | Draw / gamification feature card |
| Card Pink | `#fce7f3` | Chat / social feature card |
| Card Coral | `#ffedd5` | Warm alternate feature card |

**Data chart palette** (in order of priority):
`#10b981` → `#3b82f6` → `#8b5cf6` → `#f59e0b` → `#ef4444` → `#06b6d4`

**Critical rules**:
- The canvas is always `#f6f8fa` with dot-grid texture. Cards and panels sit above on `#ffffff`.
- Emerald is the only accent color for eyebrows, active states, and insight labels. It is never used as a background wash — only as a solid fill for CTAs, progress bars, or icon badges.
- The navy `#1e293b` is reserved for strong CTAs and dark surfaces. Never use it as a body text color.
- Pastel cards (blue, teal, yellow, pink) are interchangeable in feature grids but should not repeat the same hue on adjacent cards.
- No heavy drop shadows. Use `--lop-shadow-sm` (barely-visible 1px atmospheric ring) for cards.

### Typography

All fonts: `'Pretendard Variable', 'Pretendard', sans-serif`

| Role | CSS Class | Weight | Size (pt) | Letter-Spacing | Notes |
|---|---|---|---|---|---|
| Display XL | `.lop-display-xl` | 900 (Black) | 42pt | −1pt | Cover hero headline |
| Display LG | `.lop-display-lg` | 800 (ExtraBold) | 30pt | −0.6pt | Section opener, divider |
| Headline | `.lop-headline` | 700 (Bold) | 20pt | −0.3pt | Slide title |
| Subhead | `.lop-subhead` | 600 (SemiBold) | 14pt | −0.1pt | Panel header, column title |
| Card Title | `.lop-card-title` | 700 (Bold) | 11pt | 0 | Card headline |
| Body LG | `.lop-body-lg` | 500 (Medium) | 11pt | 0 | Hero lead paragraph |
| Body | `.lop-body` | 400 (Regular) | 9.5pt | 0 | Default body copy |
| Body SM | `.lop-body-sm` | 400 (Regular) | 8pt | 0 | Card body, secondary text |
| Eyebrow | `.lop-eyebrow` | 600 (SemiBold) | 7pt | 2pt | UPPERCASE emerald section markers |
| Caption | `.lop-caption` | 400 (Regular) | 6.5pt | 1.5pt | UPPERCASE footnotes, brand strip |
| Stat Number | `.lop-stat-number` | 800 (ExtraBold) | 28pt | −0.5pt | Large data callout |

**Weight philosophy**: Hero display uses 900 (Black) to create the bold Korean headline effect seen in MUNE. Cards use 700 (Bold) titles beside 400 (Regular) body — weight carries hierarchy, not size.

**Negative tracking**: Display/headline sizes pull −0.5pt to −1pt. Body is near-zero.

### Border Radius Scale

| Token | Value (pt) | Use |
|---|---|---|
| `--lop-r-xs` | 2pt | Micro rule chips |
| `--lop-r-sm` | 4pt | Category tags, small badge backgrounds |
| `--lop-r-md` | 8pt | Ranked list items, small cards |
| `--lop-r-lg` | 12pt | Standard cards, stat cards — most common |
| `--lop-r-xl` | 16pt | Dashboard panels, large cards |
| `--lop-r-2xl` | 24pt | Feature showcase cards (MUNE-style) |
| `--lop-r-pill` | 999pt | Navigation pills, CTA buttons, filter tabs, progress bars |

### Elevation & Depth

No `box-shadow` for dramatic elevation. Depth is created by:
1. **`--lop-shadow-sm`** — `0 1px 3px rgba(15,23,42,0.08)` on white cards (barely visible, editorial restraint)
2. **Dot-grid canvas contrast** — White panels read as elevated by contrast with the off-white dot texture
3. **`--lop-surface`** (`#f1f5f9`) tile — subtle off-white lift for alternate rows or nested panels
4. **Color contrast** — Emerald CTA / dark navy CTA elevated by pure color against the pale canvas

Never use `box-shadow: 0 8px 32px ...` — it breaks the clean dashboard aesthetic.

---

## CSS Class Reference

All styles come from `lop.css`. Do **not** re-declare these in per-slide `<style>` blocks.

### Layout
| Class | Purpose |
|---|---|
| `.lop-container` | Base slide (column, 28/36/24pt padding, dot-grid bg) |
| `.lop-container--white` | White canvas variant (no dot texture) |
| `.lop-container--row` | Row variant for split-column slides |
| `.lop-container--navy` | Dark navy canvas with faint dot texture |
| `.lop-cover` | Cover: horizontal split, dot-grid bg, emerald glow |
| `.lop-cover__content` | Left text column (flex-end column) |
| `.lop-cover__visual` | Right visual panel (centered) |
| `.lop-cover__btns` | CTA button row |
| `.lop-block` | Full-slide color feature panel |
| `.lop-block--navy/emerald/violet` | Dark block variants |
| `.lop-block-inner` | Inner text column (max-width 480pt) |
| `.lop-divider` | Section divider (centered column, dot-grid) |
| `.lop-divider--navy/emerald/violet` | Color divider variants |

### Navigation & Filter
| Class | Purpose |
|---|---|
| `.lop-topnav` | Top navigation wrapper (space-between) |
| `.lop-topnav__brand` | Brand/product name (700, 10pt) |
| `.lop-topnav__links` | Nav link row |
| `.lop-topnav__link` | Inactive nav link (8pt, 500) |
| `.lop-topnav__link--active` | Active nav pill (navy bg, white text) |
| `.lop-filter-bar` | Filter tab row (전체/초등/중등/고등 style) |
| `.lop-filter-bar__item` | Inactive filter tab (outline, 8pt) |
| `.lop-filter-bar__item--active` | Active filter (navy bg) |
| `.lop-filter-bar__item--emerald` | Emerald-pale filter highlight |

### Buttons
| Class | Purpose |
|---|---|
| `.lop-btn` | Base pill button (9pt, 600, pill radius) |
| `.lop-btn--primary` | Emerald fill + white text |
| `.lop-btn--dark` | Navy fill + white text |
| `.lop-btn--outline` | Transparent + hairline border |
| `.lop-btn--ghost` | Emerald-pale bg + emerald-dark text |
| `.lop-btn--sm` | Compact variant (4.5/12pt padding) |

### Cards & Panels
| Class | Purpose |
|---|---|
| `.lop-panel` | White dashboard panel (16pt radius, shadow-sm) |
| `.lop-panel__title` | Panel header row (9pt, 600) |
| `.lop-panel__icon` | Small square icon badge (14pt, emerald-pale) |
| `.lop-panel__badge` | Right-aligned count badge |
| `.lop-card` | Standard white card (12pt radius, hairline border, shadow-sm) |
| `.lop-card--surface` | Soft-white card (no border/shadow) |
| `.lop-card--elevated` | Heavier shadow variant |
| `.lop-card--blue/teal/yellow/pink/coral` | Pastel fill variants |
| `.lop-card--navy` | Dark navy card (white text) |
| `.lop-card--feature` | Feature card (24pt radius, 16pt padding) |
| `.lop-card__icon` | Feature card icon container (36pt square) |
| `.lop-stat-card` | Metric callout (number + label + progress) |
| `.lop-stat-card__number` | Large metric (24pt, 800) |
| `.lop-stat-card__label` | Metric label (7.5pt, 500) |
| `.lop-stat-card__pct` | Percentage line (7pt, 600, muted) |
| `.lop-stat-card__icon` | Stat icon badge (22pt, emerald-pale) |
| `.lop-stat-card__icon--blue/violet/cyan` | Icon badge color variants |

### Data Visualization
| Class | Purpose |
|---|---|
| `.lop-progress` | Progress bar track (4.5pt, pill) |
| `.lop-progress__fill` | Emerald fill (set width inline) |
| `.lop-progress__fill--blue/violet/cyan/amber` | Alternate fill colors |
| `.lop-bar-row` | Horizontal bar chart row |
| `.lop-bar-row__label` | Left label (8pt, 50pt wide) |
| `.lop-bar-row__track` | Bar track (flex: 1) |
| `.lop-bar-row__fill` | Emerald bar fill |
| `.lop-bar-row__fill--2/3/4/5/6` | Alternate chart colors |
| `.lop-bar-row__pct` | Percentage text |
| `.lop-bar-row__count` | Count text (muted) |
| `.lop-table` | Data table |
| `.lop-table th` | Column header (7pt, uppercase, muted) |
| `.lop-table td` | Data cell (8.5pt) |
| `.lop-table__row--alt` | Alternate row tint |
| `.lop-rank-item` | Ranked list row (num circle + text + count) |
| `.lop-rank-item__num` | Rank circle (18pt, emerald) |
| `.lop-rank-item__num--2/3/4/5` | Alternate rank colors |
| `.lop-rank-item__text` | Item text (8.5pt, 500) |
| `.lop-rank-item__count` | Count (8.5pt, 700, emerald) |

### Grids
| Class | Purpose |
|---|---|
| `.lop-grid` | Grid container (flex: 1, 10pt gap) |
| `.lop-grid--2col/3col/4col` | Equal column layouts |
| `.lop-grid--6040/4060/5050` | Asymmetric splits |

### Pills, Badges, Tags
| Class | Purpose |
|---|---|
| `.lop-pill` | Pill badge (7pt, 600, pill radius) |
| `.lop-pill--primary/dark/outline/surface` | Base variants |
| `.lop-pill--emerald/violet/cyan/blue/pink/amber` | Color variants |
| `.lop-pill--elementary/middle/high` | School grade variants |
| `.lop-tag` | Small inline category tag (7pt, 4pt radius) |
| `.lop-tag--naver/indie/other/cafe/tistory` | URL source color variants |

### Typography
| Class | Purpose |
|---|---|
| `.lop-display-xl` | 42pt, 900, −1pt tracking |
| `.lop-display-lg` | 30pt, 800, −0.6pt tracking |
| `.lop-headline` | 20pt, 700, −0.3pt tracking |
| `.lop-subhead` | 14pt, 600, −0.1pt tracking |
| `.lop-card-title` | 11pt, 700 |
| `.lop-body-lg` | 11pt, 500, slate |
| `.lop-body` | 9.5pt, 400, slate |
| `.lop-body-sm` | 8pt, 400, slate |
| `.lop-eyebrow` | 7pt, 600, UPPERCASE, 2pt tracking, emerald |
| `.lop-caption` | 6.5pt, 400, UPPERCASE, 1.5pt tracking, muted |
| `.lop-stat-number` | 28pt, 800, −0.5pt |
| `.lop-accent` | Emerald text |
| `.lop-accent-violet` | Violet text |
| `.lop-accent-cyan` | Cyan text |

### Structural
| Class | Purpose |
|---|---|
| `.lop-insight` | Bottom takeaway bar (hairline top, flex row) |
| `.lop-insight-label` | Label (6.5pt, 700, uppercase, emerald) |
| `.lop-insight-text` | Body (8.5pt, 400, soft) |
| `.lop-divider__chapter` | Chapter marker (7.5pt, uppercase, 2.5pt tracking) |
| `.lop-divider__title` | Divider headline (38pt, 900) |
| `.lop-divider__sub` | Divider subtitle (10pt, 400, soft) |
| `.lop-header` | Section header wrapper (column, 4pt gap, 16pt margin-bottom) |
| `.lop-rule` | 1px hairline horizontal rule |
| `.lop-rule--emerald` | Short emerald accent bar (2pt × 28pt) |
| `.lop-brand` | Bottom-right brand strip (6pt, uppercase, muted) |
| `.lop-slide-num` | Bottom-left slide number (7pt, muted) |

### Utility
| Class | Purpose |
|---|---|
| `.lop-dot-bg` | Apply dot-grid texture to any element |
| `.lop-flex-col/row/center/between` | Flex layout helpers |
| `.lop-stretch` | `flex: 1` |
| `.lop-muted/soft/white` | Text color shortcuts |
| `.lop-upper/bold/semibold` | Type modifier shortcuts |

---

## Slide Patterns

### 1. Cover — Hero Split Layout

```html
<body>
<div class="lop-cover">
  <div class="lop-cover__content">
    <p class="lop-eyebrow">PRODUCT NAME · 서비스 소개</p>
    <h1 class="lop-display-xl">
      강의가 더더더!<br>
      <span class="lop-accent">즐거워지는</span> 순간
    </h1>
    <p class="lop-body-lg" style="max-width:320pt; margin-top:4pt;">
      간단하지만 강력한 상호작용 도구로 참여자와 인터랙티브한 강의를 진행하세요.
    </p>
    <div class="lop-cover__btns">
      <span class="lop-btn lop-btn--dark">강의 시작하기 →</span>
      <span class="lop-btn lop-btn--outline">강의 참여하기 ↵</span>
    </div>
  </div>
  <div class="lop-cover__visual">
    <!-- Right panel: feature card grid or illustrative image -->
    <div class="lop-grid lop-grid--2col" style="gap:8pt; width:200pt;">
      <div class="lop-card lop-card--feature lop-card--blue">
        <p class="lop-card-title" style="font-size:9pt;">인터랙티브</p>
        <p class="lop-body-sm">실시간 소통으로 생동감 넘치는 수업</p>
      </div>
      <div class="lop-card lop-card--feature lop-card--teal">
        <p class="lop-card-title" style="font-size:9pt;">실시간 설문</p>
        <p class="lop-body-sm">모든 학생이 참여하는 투표와 설문</p>
      </div>
      <div class="lop-card lop-card--feature lop-card--yellow">
        <p class="lop-card-title" style="font-size:9pt;">추첨 기능</p>
        <p class="lop-body-sm">자동화된 참여자 랜덤 추첨</p>
      </div>
      <div class="lop-card lop-card--feature lop-card--pink">
        <p class="lop-card-title" style="font-size:9pt;">간편한 채팅</p>
        <p class="lop-body-sm">귀여운 아바타로 나누는 대화</p>
      </div>
    </div>
  </div>
</div>
<div class="lop-brand">DECK TITLE · LOP</div>
</body>
```

**Rules**: Dot-grid canvas with soft emerald glow at top-right (CSS `::after`). Black 900-weight headline with emerald accent on a key word. Left column never exceeds 460pt. Right visual is the feature grid or an asset image. Brand strip always bottom-right.

---

### 2. Dashboard Panel — Stats + Chart

```html
<body>
<div class="lop-container">
  <div class="lop-topnav">
    <span class="lop-topnav__brand">현황 분석</span>
    <div class="lop-topnav__links">
      <span class="lop-topnav__link">현황 대시보드</span>
      <span class="lop-topnav__link">일간 분석</span>
      <span class="lop-topnav__link lop-topnav__link--active">현황 분석</span>
    </div>
  </div>

  <div class="lop-grid lop-grid--6040" style="flex:1; gap:12pt;">
    <!-- Left: stat cards + bar chart -->
    <div class="lop-flex-col" style="gap:10pt;">
      <div class="lop-panel">
        <p class="lop-panel__title">참여 분포</p>
        <div class="lop-grid lop-grid--3col" style="gap:8pt;">
          <div class="lop-stat-card">
            <div class="lop-stat-card__icon"></div>
            <p class="lop-stat-card__number">170<span style="font-size:12pt; font-weight:600;">명</span></p>
            <p class="lop-stat-card__label">초등</p>
            <div class="lop-progress"><div class="lop-progress__fill" style="width:75%;"></div></div>
            <p class="lop-stat-card__pct">75%</p>
          </div>
          <div class="lop-stat-card">
            <div class="lop-stat-card__icon lop-stat-card__icon--blue"></div>
            <p class="lop-stat-card__number">32<span style="font-size:12pt; font-weight:600;">명</span></p>
            <p class="lop-stat-card__label">중등</p>
            <div class="lop-progress"><div class="lop-progress__fill lop-progress__fill--blue" style="width:14%;"></div></div>
            <p class="lop-stat-card__pct">14%</p>
          </div>
          <div class="lop-stat-card">
            <div class="lop-stat-card__icon lop-stat-card__icon--violet"></div>
            <p class="lop-stat-card__number">24<span style="font-size:12pt; font-weight:600;">명</span></p>
            <p class="lop-stat-card__label">고등</p>
            <div class="lop-progress"><div class="lop-progress__fill lop-progress__fill--violet" style="width:11%;"></div></div>
            <p class="lop-stat-card__pct">11%</p>
          </div>
        </div>
      </div>

      <div class="lop-panel" style="flex:1;">
        <p class="lop-panel__title">수업 탐재 공간 출처 분포 <span class="lop-panel__badge">337개 URL</span></p>
        <div class="lop-flex-col" style="gap:5pt;">
          <div class="lop-bar-row">
            <span class="lop-bar-row__label">네이버 블로그</span>
            <div class="lop-bar-row__track"><div class="lop-bar-row__fill" style="width:39.2%;"></div></div>
            <span class="lop-bar-row__pct">39.2%</span>
            <span class="lop-bar-row__count">132개</span>
          </div>
          <div class="lop-bar-row">
            <span class="lop-bar-row__label">기타</span>
            <div class="lop-bar-row__track"><div class="lop-bar-row__fill lop-bar-row__fill--2" style="width:32.6%;"></div></div>
            <span class="lop-bar-row__pct">32.6%</span>
            <span class="lop-bar-row__count">110개</span>
          </div>
          <div class="lop-bar-row">
            <span class="lop-bar-row__label">인디스쿨</span>
            <div class="lop-bar-row__track"><div class="lop-bar-row__fill lop-bar-row__fill--3" style="width:23.7%;"></div></div>
            <span class="lop-bar-row__pct">23.7%</span>
            <span class="lop-bar-row__count">80개</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: ranked list -->
    <div class="lop-panel">
      <p class="lop-panel__title">참여 상위 소속 단체</p>
      <div class="lop-flex-col" style="gap:5pt;">
        <div class="lop-rank-item">
          <span class="lop-rank-item__num">1</span>
          <span class="lop-rank-item__text">비바샘 연구대회 테스트</span>
          <span class="lop-rank-item__count">1명</span>
        </div>
        <div class="lop-rank-item">
          <span class="lop-rank-item__num lop-rank-item__num--2">2</span>
          <span class="lop-rank-item__text">청호초등학교</span>
          <span class="lop-rank-item__count">1명</span>
        </div>
        <div class="lop-rank-item">
          <span class="lop-rank-item__num lop-rank-item__num--3">3</span>
          <span class="lop-rank-item__text">남성초</span>
          <span class="lop-rank-item__count">1명</span>
        </div>
        <div class="lop-rank-item">
          <span class="lop-rank-item__num lop-rank-item__num--4">4</span>
          <span class="lop-rank-item__text">인천답방초등학교</span>
          <span class="lop-rank-item__count">1명</span>
        </div>
        <div class="lop-rank-item">
          <span class="lop-rank-item__num lop-rank-item__num--5">5</span>
          <span class="lop-rank-item__text">현암초등학교</span>
          <span class="lop-rank-item__count">1명</span>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="lop-brand">DECK TITLE · LOP</div>
</body>
```

---

### 3. Feature Cards — Pastel Grid

```html
<body>
<div class="lop-container">
  <div class="lop-header">
    <p class="lop-eyebrow">CORE FEATURES · 핵심 기능</p>
    <h2 class="lop-headline">강의를 더 풍성하게 만드는 4가지 도구</h2>
    <p class="lop-body" style="margin-top:2pt;">참여자와 실시간으로 소통하고, 데이터를 수집하며, 강의를 즐겁게 만들어보세요.</p>
  </div>

  <div class="lop-grid lop-grid--4col" style="flex:1;">
    <div class="lop-card lop-card--feature lop-card--blue">
      <div class="lop-card__icon" style="background:#bfdbfe;">
        <img src="../images/icon_interactive.png" alt="">
      </div>
      <p class="lop-card-title">인터랙티브</p>
      <p class="lop-body-sm">실시간 소통으로 생동감 넘치는 수업</p>
    </div>
    <div class="lop-card lop-card--feature lop-card--teal">
      <div class="lop-card__icon" style="background:#99f6e4;">
        <img src="../images/icon_survey.png" alt="">
      </div>
      <p class="lop-card-title">실시간 설문</p>
      <p class="lop-body-sm">모든 학생이 참여하는 투표와 설문</p>
    </div>
    <div class="lop-card lop-card--feature lop-card--yellow">
      <div class="lop-card__icon" style="background:#fde047;">
        <img src="../images/icon_lottery.png" alt="">
      </div>
      <p class="lop-card-title">추첨 기능</p>
      <p class="lop-body-sm">자동화된 참여자 랜덤 추첨</p>
    </div>
    <div class="lop-card lop-card--feature lop-card--pink">
      <div class="lop-card__icon" style="background:#f9a8d4;">
        <img src="../images/icon_chat.png" alt="">
      </div>
      <p class="lop-card-title">간편한 채팅</p>
      <p class="lop-body-sm">귀여운 아바타로 나누는 즐거운 대화</p>
    </div>
  </div>

  <div class="lop-insight">
    <span class="lop-insight-label">KEY TAKEAWAY</span>
    <p class="lop-insight-text">4가지 도구가 유기적으로 연결되어 강의 몰입도를 높입니다.</p>
  </div>
</div>
<div class="lop-brand">DECK TITLE · LOP</div>
</body>
```

---

### 4. Data Table — Participant List

```html
<body>
<div class="lop-container">
  <div class="lop-header" style="margin-bottom:10pt;">
    <p class="lop-eyebrow">PARTICIPANT DATA · 참가자 현황</p>
    <h2 class="lop-headline">참가자별 URL 출처</h2>
  </div>

  <!-- Filter tab bars -->
  <div class="lop-filter-bar" style="margin-bottom:4pt;">
    <span class="lop-filter-bar__item lop-filter-bar__item--active">전체 226</span>
    <span class="lop-filter-bar__item">초등 170</span>
    <span class="lop-filter-bar__item">중등 32</span>
    <span class="lop-filter-bar__item">고등 24</span>
  </div>
  <div class="lop-filter-bar" style="margin-bottom:8pt;">
    <span class="lop-filter-bar__item lop-filter-bar__item--active">전체 226</span>
    <span class="lop-filter-bar__item">네이버 블로그 105</span>
    <span class="lop-filter-bar__item">기타 61</span>
    <span class="lop-filter-bar__item">인디스쿨 59</span>
    <span class="lop-filter-bar__item">다음 카페 4</span>
  </div>

  <div class="lop-panel" style="flex:1; overflow:hidden;">
    <table class="lop-table">
      <thead>
        <tr>
          <th>#</th><th>아이디</th><th>이름</th><th>학교급</th><th>스탬프</th><th>URL 출처</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td><td>irrelplace</td><td>강홍빈</td>
          <td><span class="lop-pill lop-pill--elementary">초등</span></td>
          <td>1</td>
          <td><span class="lop-tag lop-tag--naver">1. 네이버 블로그</span></td>
        </tr>
        <tr class="lop-table__row--alt">
          <td>2</td><td>rpsha82</td><td>강효진</td>
          <td><span class="lop-pill lop-pill--elementary">초등</span></td>
          <td>1</td>
          <td><span class="lop-tag lop-tag--indie">1. 인디스쿨</span></td>
        </tr>
        <tr>
          <td>3</td><td>rhtkddus11</td><td>고상연</td>
          <td><span class="lop-pill lop-pill--elementary">초등</span></td>
          <td>1</td>
          <td><span class="lop-tag lop-tag--indie">1. 인디스쿨</span></td>
        </tr>
        <tr class="lop-table__row--alt">
          <td>4</td><td>sk7212</td><td>권선경</td>
          <td><span class="lop-pill lop-pill--elementary">초등</span></td>
          <td>9</td>
          <td>
            <span class="lop-tag lop-tag--other">1. 기타</span>
            <span class="lop-tag lop-tag--other" style="margin-left:3pt;">2. 기타</span>
            <span class="lop-tag lop-tag--naver" style="margin-left:3pt;">11. 네이버</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="lop-brand">DECK TITLE · LOP</div>
</body>
```

---

### 5. Section Divider

```html
<body>
<div class="lop-divider lop-divider--navy">  <!-- or --emerald, --violet, or default -->
  <p class="lop-divider__chapter">CHAPTER 02 · 데이터 분석</p>
  <h2 class="lop-divider__title">현황 분석<br>결과 요약</h2>
  <p class="lop-divider__sub">URL 출처와 참여자 분포를 기반으로 도출한 인사이트입니다.</p>
  <div style="display:flex; gap:8pt; margin-top:12pt;">
    <span class="lop-pill lop-pill--primary">226명 참가</span>
    <span class="lop-pill lop-pill--outline lop-white" style="border-color:rgba(255,255,255,0.3);">337개 URL</span>
  </div>
</div>
<div class="lop-brand" style="color:rgba(255,255,255,0.40);">DECK TITLE · LOP</div>
</body>
```

**Rules**: Navy divider for major chapter breaks. Emerald divider for climax/CTA moments. Default dot-grid divider for intermediate chapter breaks. The `::after` glow is automatic.

---

### 6. Two-Column — Content + Ranked List

```html
<body>
<div class="lop-container lop-container--row">

  <!-- Left: text + insight -->
  <div class="lop-flex-col lop-stretch">
    <p class="lop-eyebrow">ANALYSIS · 현황 분석</p>
    <h2 class="lop-headline" style="margin-top:4pt; margin-bottom:8pt;">주요 지표 요약</h2>
    <div class="lop-flex-col" style="gap:8pt; flex:1;">
      <div class="lop-card">
        <p class="lop-card-title">총 참가자 수</p>
        <p class="lop-stat-number" style="font-size:22pt;">226명</p>
        <div class="lop-progress" style="margin-top:4pt;"><div class="lop-progress__fill" style="width:100%;"></div></div>
      </div>
      <div class="lop-card">
        <p class="lop-card-title">URL 총합</p>
        <p class="lop-stat-number" style="font-size:22pt;">337<span style="font-size:11pt; font-weight:600;">개</span></p>
        <div class="lop-progress" style="margin-top:4pt;"><div class="lop-progress__fill lop-progress__fill--blue" style="width:68%;"></div></div>
      </div>
    </div>
    <div class="lop-insight">
      <span class="lop-insight-label">KEY POINT</span>
      <p class="lop-insight-text">초등 교사 비율이 75%로 가장 높으며 네이버 블로그가 주요 탐재 경로입니다.</p>
    </div>
  </div>

  <!-- Right: ranked organization panel -->
  <div class="lop-panel lop-stretch">
    <p class="lop-panel__title">상위 소속 단체 순위</p>
    <div class="lop-flex-col" style="gap:5pt; flex:1;">
      <div class="lop-rank-item">
        <span class="lop-rank-item__num">1</span>
        <span class="lop-rank-item__text">비바샘 연구대회 테스트</span>
        <span class="lop-rank-item__count">1명</span>
      </div>
      <div class="lop-rank-item">
        <span class="lop-rank-item__num lop-rank-item__num--2">2</span>
        <span class="lop-rank-item__text">청호초등학교</span>
        <span class="lop-rank-item__count">1명</span>
      </div>
      <div class="lop-rank-item">
        <span class="lop-rank-item__num lop-rank-item__num--3">3</span>
        <span class="lop-rank-item__text">남성초</span>
        <span class="lop-rank-item__count">1명</span>
      </div>
      <div class="lop-rank-item">
        <span class="lop-rank-item__num lop-rank-item__num--4">4</span>
        <span class="lop-rank-item__text">인천답방초등학교</span>
        <span class="lop-rank-item__count">1명</span>
      </div>
      <div class="lop-rank-item">
        <span class="lop-rank-item__num lop-rank-item__num--5">5</span>
        <span class="lop-rank-item__text">현암초등학교</span>
        <span class="lop-rank-item__count">1명</span>
      </div>
    </div>
  </div>

</div>
<div class="lop-brand">DECK TITLE · LOP</div>
</body>
```

---

## Slide Rhythm (Recommended Deck Structure)

The LOP system alternates dot-grid data slides with strong navy or emerald section breaks:

```
Cover (split hero — dot-grid + glow)
→ Divider: chapter 1 (navy)
→ Dashboard: stats + chart + ranked list
→ Content: feature card grid (4 pastel cards)
→ Content: two-column analysis
→ Divider: chapter 2 (emerald or default)
→ Dashboard: table with filter tabs
→ Content: ranked list + bar chart
→ Divider: conclusion (violet)
→ Cover-style closing (same as cover, "시작하기" CTA)
```

**Pacing rules**:
- Never place two navy/emerald dividers back-to-back.
- Always return to a dot-grid container slide between dividers.
- Use the pastel card grid for feature introduction; use panels for data.
- Maximum 4 stat cards per row (overflow risk beyond 4 columns).
- The insight bar is optional — only when the slide has a genuine "so what."

---

## Quality Checklist

- [ ] Canvas uses `lop-container` (dot-grid) or `lop-container--white` — never a plain `<div>` with a raw background color
- [ ] All card components use `.lop-card` or `.lop-panel` — no raw inline `background` on block-level elements
- [ ] Eyebrows are UPPERCASE emerald with 2pt tracking — never lowercase, never black
- [ ] Progress bars always specify `width` inline on `.lop-progress__fill`
- [ ] Ranked items use `.lop-rank-item__num` with the correct color variant (`--2`, `--3`…)
- [ ] Filter tab rows use `.lop-filter-bar` — not raw flex divs
- [ ] Pills use `lop-pill--elementary/middle/high` for school grade badges — not custom colors
- [ ] Category tags use `.lop-tag--naver/indie/other/cafe/tistory` — not raw inline styles
- [ ] Brand strip (`.lop-brand`) and slide number (`.lop-slide-num`) present on every slide
- [ ] Insight bar (`.lop-insight`) only when the slide has a genuine synthesis sentence
- [ ] No `box-shadow` heavier than `--lop-shadow` on any element
- [ ] Divider slides do not contain card grids or insight bars — the block color is the message
- [ ] Adjacent pastel cards in a grid do not repeat the same color variant
- [ ] `lop-display-xl` (42pt, 900) reserved for cover and closing slides only
- [ ] Body copy color is `var(--lop-ink-soft)` (#475569) — never pure black on a canvas slide

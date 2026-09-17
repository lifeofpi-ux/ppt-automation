# Patch Editorial Design Template

A bold, electric Neo-Brutalist editorial aesthetic reverse-engineered from [The Patch System](http://thepatchsystem.com/). High-voltage electric royal blue canvas (`#1F00FF`), subtle structural grid line pattern, crisp off-white contrast cards (`#F4F4F4`), vibrant coral orange primary CTA (`#FF622B`), and soft lavender secondary badges (`#AFA9DC`). The mood is confident, high-energy, modern, and structured — ideal for cutting-edge SaaS platforms, marketing systems, developer tools, modern agency pitches, and tech education keynotes.

> **Shared CSS**: All design tokens and components are defined in `.agent/workflows/skills/pptx/themes/patch.css`.  
> Copy it to `workspace/[project]/assets/css/patch.css` and link it in every slide HTML:  
> `<link rel="stylesheet" href="../css/patch.css">`  
> Use `.pat-*` BEM classes directly — do NOT duplicate styles in per-slide `<style>` blocks.  
> Per-slide `<style>` blocks should contain layout-only overrides (specific heights, custom column widths).

---

## Design System

### Color Palette

| Token | Hex Value | Role |
|---|---|---|
| **Electric Blue** | `#1F00FF` | Primary brand canvas, card borders, key headings on light cards |
| **Deep Blue** | `#1500B8` | Dark variant, active states |
| **Off-White Card** | `#F4F4F4` | High-contrast card panel background on blue canvas |
| **White** | `#FFFFFF` | Headlines on blue canvas, pure white card fills |
| **Electric Yellow** | `#FFE500` | Primary CTA buttons, alert badges, key highlights |
| **Soft Lavender** | `#AFA9DC` | Secondary pill tags, category chips, balanced pastel tone |
| **Ink Black** | `#111111` | Primary text and headlines inside light cards |
| **Ink Soft** | `#475569` | Body text on light cards |
| **Ink Muted** | `#94A3B8` | Metadata, captions, subtle footnotes |
| **Grid Blue** | `rgba(255, 255, 255, 0.12)` | Subtle 24pt grid line on electric blue canvas |
| **Grid Light** | `rgba(31, 0, 255, 0.06)` | Subtle grid line on light off-white canvas |

**Critical Aesthetic Rules**:
- **Electric Blue + Off-White Contrast**: The core visual signature is placing off-white `#F4F4F4` cards on the `#1F00FF` grid canvas, bordered with `1px solid #1F00FF` or subtle borders.
- **Vibrant Orange as High-Voltage Accent**: Orange is reserved for high-impact CTA buttons, key metrics, and primary eyebrows. Never use it as a full-slide background.
- **Lavender for Soft Harmony**: Use `#AFA9DC` pill badges to soften the tension between electric blue and bright orange.
- **Grid lines**: The 24pt grid line background is automatic on `.pat-container` and `.pat-cover` — do not re-declare it per-slide.

---

### Typography (Pretendard Mandatory)

All fonts: `'Pretendard Variable', 'Pretendard', sans-serif`

| Role | CSS Class | Weight | Size (pt) | Letter-Spacing | Line-Height | Notes |
|---|---|---|---|---|---|---|
| **Display XL** | `.pat-display-xl` | 900 (Black) | 38pt | −0.5pt | 1.05 | Cover hero, monumental title |
| **Display LG** | `.pat-display-lg` | 900 (Black) | 28pt | −0.3pt | 1.10 | Chapter divider headline |
| **Headline** | `.pat-headline` | 800 (ExtraBold) | 20pt | −0.2pt | 1.20 | Standard slide title |
| **Subhead** | `.pat-subhead` | 700 (Bold) | 13pt | 0 | 1.35 | Section subtitle, column lead |
| **Card Title** | `.pat-card-title` | 800 (ExtraBold) | 11pt | 0 | 1.30 | Card heading (UPPERCASE) |
| **Body LG** | `.pat-body-lg` | 500 (Medium) | 10.5pt | 0 | 1.45 | Hero description copy |
| **Body** | `.pat-body` | 400 (Regular) | 9pt | 0 | 1.45 | Default slide body copy |
| **Body SM** | `.pat-body-sm` | 400 (Regular) | 8pt | 0 | 1.40 | Card text, explanations |
| **Eyebrow** | `.pat-eyebrow` | 700 (Bold) | 7.5pt | 2pt | 1.20 | UPPERCASE orange category tag |
| **Stat Big** | `.pat-stat-number` | 900 (Black) | 44pt | −1pt | 0.95 | Monumental KPI metrics |

---

### Border Radius Scale

| Token | Value (pt) | Use |
|---|---|---|
| `--pat-r-xs` | 3pt | Number index boxes `[01]` |
| `--pat-r-sm` | 6pt | CTA buttons (`.pat-btn`), small badges |
| `--pat-r-md` | 8pt | Standard cards (`.pat-card`) — signature radius |
| `--pat-r-lg` | 12pt | Large showcase panels |
| `--pat-r-pill` | 999pt | Category pills (`.pat-pill`) |

---

## CSS Class Reference

### Layout Containers
- `.pat-container` : Full-bleed 720pt × 405pt slide, electric blue background with white grid lines.
- `.pat-container--light` : Light off-white background with subtle blue grid lines.
- `.pat-container--white` : Pure white clean canvas.
- `.pat-cover` : Hero split cover container with left text + right visual panel.
- `.pat-divider` : Chapter divider slide (electric blue).
- `.pat-divider--light` : Chapter divider slide (light mode).

### Cards & Components
- `.pat-card` : Off-white `#F4F4F4` card with 8pt radius, 1px solid blue border, black text.
- `.pat-card--white` : Crisp white card for nested content.
- `.pat-card--blue` : Royal blue card with white text for emphasized highlights.
- `.pat-card--orange` : Soft orange tint card for warnings/key milestones.
- `.pat-card--lavender` : Soft lavender tint card for auxiliary info.
- `.pat-index-box` : 24pt × 24pt square number badge (`01`, `02`) with blue border.

### Buttons & Pills
- `.pat-btn--orange` : Solid vibrant orange CTA button with white bold text.
- `.pat-btn--blue` : Solid electric blue button.
- `.pat-btn--outline` : Transparent outline button with crisp border.
- `.pat-pill--lavender` : Signature soft lavender rounded pill tag.
- `.pat-pill--orange` : Vibrant orange rounded pill tag.
- `.pat-pill--blue` : Electric blue rounded pill tag.

### Data & Insights
- `.pat-stat-number` : Huge 44pt display number for KPI stats.
- `.pat-insight` : Bottom dashed border insight/takeaway bar.
- `.pat-insight-label` : UPPERCASE orange 7pt bold label.
- `.pat-insight-text` : 8.5pt medium takeaway sentence.
- `.pat-brand` : Bottom-right subtle brand watermark.
- `.pat-slide-num` : Bottom-left bold slide number.

---

## Slide Patterns

### 1. Cover — Hero Split Layout

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/patch.css">
</head>
<body>
<div class="pat-cover">
  <div class="pat-cover__left">
    <p class="pat-eyebrow">AUTOMATION PLATFORM · 2026</p>
    <h1 class="pat-display-xl">
      GET MORE DONE<br>
      <span class="pat-accent-orange">100% HANDS OFF</span>
    </h1>
    <p class="pat-body-lg" style="max-width: 320pt; margin-top: 6pt;">
      우리의 검증된 자동화 시스템으로 고객 유입과 수익 창출을 한 번에 해결하세요. 당신은 비즈니스에만 집중하면 됩니다.
    </p>
    <div class="pat-cover__btns">
      <span class="pat-btn pat-btn--orange">무료 데모 신청하기 →</span>
      <span class="pat-btn pat-btn--outline">시스템 소개서</span>
    </div>
  </div>

  <div class="pat-cover__right">
    <div class="pat-card" style="width: 210pt;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="pat-index-box">01</span>
        <span class="pat-pill pat-pill--lavender">FEATURED</span>
      </div>
      <p class="pat-card-title" style="margin-top: 8pt;">MARKETING CRM</p>
      <p class="pat-body-sm">
        분기별 캠페인 기획, 이메일 육성 시퀀스, 로컬 퍼널까지 완전 자동화 구축
      </p>
      <div style="margin-top: 10pt; padding-top: 6pt; border-top: 1px dashed var(--pat-border-light);">
        <p class="pat-stat-number" style="font-size: 28pt;">10X<span style="font-size: 11pt;"> ROI</span></p>
      </div>
    </div>
  </div>
</div>
<div class="pat-slide-num">01</div>
<div class="pat-brand">THE PATCH SYSTEM · EDITORIAL</div>
</body>
</html>
```

---

### 2. Feature Cards — 3-Column Off-White Grid

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/patch.css">
</head>
<body>
<div class="pat-container">
  <div class="pat-header">
    <p class="pat-eyebrow">CORE PROCESS · 핵심 프로세스</p>
    <h2 class="pat-headline">결과로 증명하는 3단계 성장 로드맵</h2>
    <p class="pat-body">체계적인 CRM 시스템과 맞춤형 자동화로 병원과 클리닉의 잠재 고객을 실시간 유치합니다.</p>
  </div>

  <div class="pat-grid pat-grid--3col">
    <div class="pat-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="pat-index-box">01</span>
        <span class="pat-pill pat-pill--lavender">CAMPAIGN</span>
      </div>
      <h3 class="pat-card-title">분기별 마케팅 캠페인</h3>
      <p class="pat-body-sm">
        지역 이벤트 퍼널과 타겟팅 광고를 결합하여 고효율 신규 리드를 선점합니다.
      </p>
    </div>

    <div class="pat-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="pat-index-box">02</span>
        <span class="pat-pill pat-pill--orange">NURTURE</span>
      </div>
      <h3 class="pat-card-title">이메일 육성 시퀀스</h3>
      <p class="pat-body-sm">
        유입된 환자가 이탈하지 않고 정기 내원으로 이어지도록 자동화된 메시지 발송.
      </p>
    </div>

    <div class="pat-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="pat-index-box">03</span>
        <span class="pat-pill pat-pill--blue">REPORTING</span>
      </div>
      <h3 class="pat-card-title">매출 및 성과 리포트</h3>
      <p class="pat-body-sm">
        실시간 대시보드와 슬랙 채널 연동으로 병원의 핵심 경영 지표를 매일 확인.
      </p>
    </div>
  </div>

  <div class="pat-insight">
    <span class="pat-insight-label">KEY TAKEAWAY</span>
    <p class="pat-insight-text">선생님과 원장님은 진료에만 집중하세요. 복잡한 시스템 구축은 100% 자동화로 해결됩니다.</p>
  </div>
</div>
<div class="pat-slide-num">02</div>
<div class="pat-brand">THE PATCH SYSTEM · EDITORIAL</div>
</body>
</html>
```

---

### 3. Proof & Metrics — Split Stat Layout

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/patch.css">
</head>
<body>
<div class="pat-container pat-container--light">
  <div class="pat-header">
    <p class="pat-eyebrow" style="color: var(--pat-blue);">PROOF IS IN THE PROFIT · 실전 성과</p>
    <h2 class="pat-headline">숫자로 증명하는 압도적인 투자 대비 효과</h2>
  </div>

  <div class="pat-grid pat-grid--5050">
    <div class="pat-card" style="background: var(--pat-blue); color: #ffffff; border: none;">
      <p class="pat-eyebrow pat-eyebrow--white">AVERAGE RETURN</p>
      <p class="pat-stat-number" style="color: var(--pat-orange); font-size: 56pt; margin: 8pt 0;">10X</p>
      <h3 class="pat-subhead" style="color: #ffffff;">구글 광고 지출 대비 평균 ROI</h3>
      <p class="pat-body-sm" style="color: rgba(255,255,255,0.8); margin-top: 6pt;">
        기존 마케팅 방식 대비 10배 이상의 환자 전환율을 기록하며 첫 달부터 흑자 구조 전환을 달성했습니다.
      </p>
    </div>

    <div class="pat-flex-col" style="gap: 8pt;">
      <div class="pat-card" style="flex: 1;">
        <p class="pat-eyebrow">MONTHLY REVENUE</p>
        <p class="pat-stat-number" style="font-size: 32pt;">$100K+</p>
        <p class="pat-body-sm">패치 시스템 도입 후 6개월 만에 달성한 단일 클리닉 최고 월 매출액</p>
      </div>

      <div class="pat-card" style="flex: 1;">
        <p class="pat-eyebrow" style="color: var(--pat-lavender);">EXPANSION</p>
        <p class="pat-stat-number" style="font-size: 32pt; color: #7c3aed;">2ND BRANCH</p>
        <p class="pat-body-sm">자동화된 환자 유입 파이프라인으로 여유를 확보하여 제2호점 개원 성공</p>
      </div>
    </div>
  </div>

  <div class="pat-insight">
    <span class="pat-insight-label">CASE STUDY</span>
    <p class="pat-insight-text">단순 광고 대행이 아닌, 시스템 전체를 인계하는 풀-퍼널 자동화 솔루션의 결과입니다.</p>
  </div>
</div>
<div class="pat-slide-num">03</div>
<div class="pat-brand">THE PATCH SYSTEM · EDITORIAL</div>
</body>
</html>
```

---

### 4. Section Divider Slide

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/patch.css">
</head>
<body>
<div class="pat-divider">
  <p class="pat-divider__chapter">STAGE 02 · SYSTEM ARCHITECTURE</p>
  <h2 class="pat-divider__title">
    자동화 엔진의<br>
    <span class="pat-accent-orange">핵심 작동 원리</span>
  </h2>
  <p class="pat-divider__sub">
    어떻게 수백 명의 잠재 고객 데이터를 실시간으로 수집하고, 적재적소의 채널로 연결하는지 시스템의 내부 구조를 공개합니다.
  </p>
  <div style="display: flex; gap: 8pt; margin-top: 14pt;">
    <span class="pat-pill pat-pill--orange">CRM 연동</span>
    <span class="pat-pill pat-pill--lavender">실시간 트리거</span>
    <span class="pat-pill pat-pill--outline-white">무중단 파이프라인</span>
  </div>
</div>
<div class="pat-slide-num">04</div>
<div class="pat-brand">THE PATCH SYSTEM · EDITORIAL</div>
</body>
</html>
```

---

## Slide Rhythm & Pacing

The Patch Editorial system uses bold high-voltage contrast to keep audiences fully engaged:

```
Cover (Electric Blue Grid + Monumental Type)
→ Overview Grid (Electric Blue + Off-White Cards)
→ Stat Highlight (Light Off-White Canvas + Blue Hero Card)
→ Section Divider (Electric Blue Full-Bleed)
→ Comparison / Architecture (Electric Blue Canvas + Dual Cards)
→ Closing / CTA (Electric Blue Canvas + Orange Button)
```

**Pacing rules**:
- Alternate between the default **Electric Blue canvas** and the **Light Off-White canvas** (`.pat-container--light`) to provide visual breathing room.
- Every content slide should feature at least one off-white `#F4F4F4` card container for pristine readability.
- The orange accent (`#FF622B`) should appear on every slide as a focused spark (button, eyebrow, or key metric).

---

## Quality Checklist

- [ ] Canvas uses `.pat-container` or `.pat-container--light` with automatic 24pt grid pattern.
- [ ] Font is exclusively `'Pretendard Variable', 'Pretendard', sans-serif` across all elements.
- [ ] Headline uses 800/900 weight, UPPERCASE, and compact line-height (`1.0~1.2`).
- [ ] Cards use `.pat-card` with `border: 1px solid var(--pat-blue)` and 8pt radius.
- [ ] Primary CTA buttons use `.pat-btn--orange` with white bold text.
- [ ] Category badges use `.pat-pill--lavender` or `.pat-pill--orange`.
- [ ] Bottom brand strip (`.pat-brand`) and slide number (`.pat-slide-num`) are present on all slides.
- [ ] Horizontal and vertical overflows are strictly 0pt.

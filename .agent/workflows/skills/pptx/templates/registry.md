# PPTX Style Registry

This file is the **single source of truth** for all registered PPTX slide styles.
`pptx.md` reads this file at Step 0 to present design options and retrieve CSS setup instructions.

**To add a new style**: Add a row to the table below, a numbered block in the Style Options section, and a CSS Setup entry. Do **not** modify `pptx.md` for style additions.

---

## Registered Styles

| # | Style Name | BEM Prefix | Design Spec | Shared CSS | Source | Best For |
|---|---|---|---|---|---|---|
| 1 | **The Verge Editorial** | `.v-*` | `templates/the_verge_editorial.md` | `themes/verge.css` | Hand-crafted | Tech media, news, trend reports, developer presentations |
| 2 | **Figma Editorial** | `.fig-*` | `templates/figma_editorial.md` | `themes/figma.css` | getdesign (figma) | Product launches, tool docs, clean modern decks |
| 3 | **LOP Editorial** | `.lop-*` | `templates/lop_editorial.md` | `themes/lop.css` | Hand-crafted | Korean EdTech, SaaS dashboards, data reports, classroom tools |
| 4 | **Patch Editorial** | `.pat-*` | `templates/patch_editorial.md` | `themes/patch.css` | thepatchsystem.com | Bold SaaS, marketing CRM, agency pitches, high-energy product decks |

---

## Step 0 — Style Selection Dialog

Present this dialog to the user **before starting any work**:

> "어떤 디자인 스타일로 프레젠테이션을 생성할까요?"
>
> 1. **The Verge Editorial** — 다크 캔버스, 산성 민트/울트라바이올렛 액센트, Pretendard Black 헤드라인, StoryStream 카드  
>    *추천: 기술 미디어, 뉴스, 트렌드 리포트, 개발자 발표*
>
> 2. **Figma Editorial** — 흰색 캔버스, 초대형 Light 헤드라인, 시그니처 파스텔 컬러 블록 (라임/라일락/민트/코랄/네이비)  
>    *추천: 제품 런칭, 도구 소개, 클린 모던 덱*
>
> 3. **LOP Editorial** — 오프화이트 도트 그리드 캔버스, 에메랄드 그린 액센트, 다크 네이비 CTA, 파스텔 기능 카드 (블루/틸/옐로/핑크)  
>    *추천: 한국 EdTech, SaaS 대시보드, 데이터 리포트, 교실 도구*
>
> 4. **Patch Editorial** — 일렉트릭 로얄 블루 캔버스, 24pt 그리드 패턴, 오프화이트 콘트라스트 카드, 일렉트릭 옐로우 CTA, 라벤더 태그  
>    *추천: 볼드 SaaS, 마케팅/CRM 시스템, 에이전시 제안서, 하이엔드 테크 발표*
>
> 5. **getdesign Import** — 템플릿 이름을 입력하면 자동으로 다운로드하여 새 스타일로 등록합니다 (`npx getdesign@latest add [name]`)
>
> 6. **Custom Design** — 원하는 색상, 분위기, 폰트를 알려주세요!

**Action based on selection**:
- **1 (Verge Editorial)**: See [CSS Setup — The Verge Editorial](#css-setup--the-verge-editorial) below, then read `templates/the_verge_editorial.md`.
- **2 (Figma Editorial)**: See [CSS Setup — Figma Editorial](#css-setup--figma-editorial) below, then read `templates/figma_editorial.md`.
- **3 (LOP Editorial)**: See [CSS Setup — LOP Editorial](#css-setup--lop-editorial) below, then read `templates/lop_editorial.md`.
- **4 (Patch Editorial)**: See [CSS Setup — Patch Editorial](#css-setup--patch-editorial) below, then read `templates/patch_editorial.md`.
- **5 (getdesign Import)**: Follow the **getdesign Template Import** workflow in `pptx.md`.
- **6 (Custom)**: Ask for specific requirements (color, vibe, font) and proceed with custom art direction.

---

## CSS Setup — The Verge Editorial

Run **once per project** before writing any slide HTML:

```bash
mkdir -p workspace/[project_name]/assets/css
cp .agent/workflows/skills/pptx/themes/verge.css workspace/[project_name]/assets/css/verge.css
```

Every slide HTML starts with:

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
- All Verge tokens (colors, fonts, radii, spacing) live in `verge.css` custom properties.
- Per-slide `<style>` blocks contain layout overrides only (grid dimensions, specific heights, image paths).
- To update the visual system across all slides, edit only `verge.css`.

---

## CSS Setup — Figma Editorial

Run **once per project** before writing any slide HTML:

```bash
mkdir -p workspace/[project_name]/assets/css
cp .agent/workflows/skills/pptx/themes/figma.css workspace/[project_name]/assets/css/figma.css
```

Every slide HTML starts with:

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

**Reuse contract**:
- All Figma tokens live in `figma.css` custom properties.
- Per-slide `<style>` blocks contain layout overrides only.

---

## CSS Setup — LOP Editorial

Run **once per project** before writing any slide HTML:

```bash
mkdir -p workspace/[project_name]/assets/css
cp .agent/workflows/skills/pptx/themes/lop.css workspace/[project_name]/assets/css/lop.css
```

Every slide HTML starts with:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/lop.css">
  <style>
    /* Slide-specific overrides only — do NOT repeat lop.css rules here */
  </style>
</head>
<body>
  <!-- use .lop-* BEM classes from lop.css -->
</body>
</html>
```

**Reuse contract**:
- All LOP tokens (colors, dot-grid, radii, shadows) live in `lop.css` custom properties.
- Per-slide `<style>` blocks contain layout overrides only (grid dimensions, specific widths, image paths, progress bar fill widths).
- The dot-grid background texture is automatic on `.lop-container` — do not re-implement it per-slide.

---

## CSS Setup — Patch Editorial

Run **once per project** before writing any slide HTML:

```bash
mkdir -p workspace/[project_name]/assets/css
cp .agent/workflows/skills/pptx/themes/patch.css workspace/[project_name]/assets/css/patch.css
```

Every slide HTML starts with:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../css/patch.css">
  <style>
    /* Slide-specific overrides only — do NOT repeat patch.css rules here */
  </style>
</head>
<body>
  <!-- use .pat-* BEM classes from patch.css -->
</body>
</html>
```

**Reuse contract**:
- All Patch tokens (electric blue, grid, orange CTA, lavender pills, radii) live in `patch.css` custom properties.
- Per-slide `<style>` blocks contain layout overrides only.
- The 24pt grid line background is automatic on `.pat-container`, `.pat-cover`, and `.pat-divider` — do not re-declare it per-slide.

---

## Adding a New Style

1. Create `themes/[name].css` (CSS custom properties + BEM utility classes following the lop.css pattern).
2. Create `templates/[name]_editorial.md` (color palette, typography, class reference, 4–5 slide patterns, quality checklist following `lop_editorial.md` format).
3. Add a row to the **Registered Styles** table above.
4. Add a numbered option to the **Step 0 dialog** above.
5. Add a **CSS Setup** section above following the LOP pattern.
6. Do **not** modify `pptx.md` — all style content lives here.

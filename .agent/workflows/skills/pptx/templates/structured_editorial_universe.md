# Structured Editorial Universe Template

Use this template when the desired deck resembles a polished strategy or education proposal: branded header, strong slide number, structured diagrams, icon nodes, bottom insight bars, and premium dark/light contrast. It is optimized for Korean technical education decks and platform strategy decks.

This is not a fixed slide layout. It is an adaptive design system. Build a common visual language from the full source text first, then choose different elements for each slide according to the slide's content relationship.

## Design Intent

The deck should feel like a high-end authored proposal, not a generic generated presentation. Build the content as editable text and editable/replaceable visual layers. IMAGE-2 should add atmospheric polish and abstract support visuals only.

The deck should not repeat the same "header + process + 3 cards + insight bar" structure on every slide. Those elements are available parts. Each slide uses only the parts that serve its own claim.

## Full-Text Style Derivation

Before slide design, read the entire source and create a deck-wide style contract:

```yaml
deck_style_contract:
  thesis: "The central idea the deck must make memorable"
  audience: "Who needs to understand or decide"
  central_metaphor: "universe | map | factory | network | operating system | pipeline"
  tone: "premium educational | strategic | technical but accessible"
  palette_roles:
    origin/history: "#3BA7FF"
    interaction/frontend: "#5A35D6"
    data/backend: "#1E7C58"
    risk/tradeoff: "#E15B64"
    synthesis: "#4226B8"
  typography_roles:
    cover_title: "monumental"
    content_title: "assertive"
    lead: "claim-like"
    diagram_label: "compact and editable"
    body: "short explanatory"
  icon_taxonomy:
    people: "users, teachers, operators, communities"
    document: "HTML, pages, files, content"
    browser: "rendering, DOM, events"
    code: "JavaScript, React, build tools"
    server: "backend, API, runtime"
    data: "database, cache, transaction"
    security: "auth, session, JWT"
    scale: "load balancer, microservices, CI/CD"
  shared_components:
    - "top header and slide number when useful"
    - "consistent icon stroke style"
    - "connector language: arrows, dotted feedback, layer boundaries"
    - "optional insight bar only for synthesized takeaways"
```

Use this contract to keep the deck coherent even when each slide has a different structure.

## Slide-Specific Design Strategy

For every slide, create a strategy object before HTML:

```yaml
slide_strategy:
  slide_no: 07
  main_claim: "CSS separated document meaning from visual presentation."
  content_relationship: "before_after | process | system | comparison | loop | anatomy | decision | summary"
  best_visual_form: "before/after split with shared stylesheet hub"
  dominant_object: "two HTML document stacks connected to one CSS control layer"
  supporting_elements:
    - "small year badge"
    - "one cause arrow"
    - "two concise implication cards"
  omitted_elements:
    - "bottom insight bar if the title already states the takeaway"
    - "3-card row if the slide has only two implications"
  image2_layers:
    - "subtle light paper texture"
    - "transparent stylesheet glow layer behind the hub"
  editable_text:
    - "title"
    - "lead"
    - "node labels"
    - "two implication cards"
```

The strategy must drive the layout. Do not pick a template first and squeeze the content into it.

## Content Relationship To Visual Form

| Content relationship | Best visual forms | Typical elements | Usually omit |
|---|---|---|---|
| Origin or historical sequence | timeline, stage rail, museum wall | year badges, problem/solution/new-problem chips | bottom 3 cards unless needed |
| Linear process | process flow, pipeline, ladder | icon nodes, arrows, outcome badge | large comparison columns |
| System architecture | layer map, zone diagram, protocol bridge | bands, boundaries, connectors, labels | decorative orbit visuals |
| Tradeoff or alternatives | comparison matrix, decision table | columns, pros/cons, highlighted choice | process arrows |
| Feedback or lock-in | flywheel, orbital loop, circular map | dotted loop, central node, recurring value labels | linear step numbering |
| Concept anatomy | central object with callouts | callout lines, magnified detail, definition chip | multi-card summaries |
| Practical guidance | decision tree, checklist, prompt recipe | condition branches, check rows, action chips | cinematic background |
| Final synthesis | principle board, map recap, playbook | numbered principles, compact memory hooks | detailed timelines |

## Visual System

### Palette

- Deep navy: `#06122B`
- Ink text: `#101833`
- Muted text: `#5C667A`
- Electric blue: `#3BA7FF`
- Platform purple: `#5A35D6`
- Soft violet: `#8B6DFF`
- Growth green: `#1E7C58`
- Panel line: `#E5E9F2`
- Light background: `#F7F9FC`
- White: `#FFFFFF`

Use navy/purple for cover and section slides. Use white/light gray for dense explanatory slides so Korean body text stays readable.

### Typography

```css
font-family: 'Pretendard', 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', Arial, sans-serif;
```

- Cover title: 56-76pt, 800-900 weight.
- Content title: 24-32pt, 800 weight.
- Lead sentence: 13-16pt, 700 weight.
- Diagram labels: 10-14pt, 700 weight.
- Body bullets: 8.5-11pt, 400-600 weight.
- Metadata: 7.5-9pt, 600-700 weight.

## Template Family

### 1. `structured_dark_cover`

Use for title slide and major chapter openers.

Required zones:
- Top-left text/logo group.
- Top-right text/logo group.
- Left-aligned monumental title.
- Korean subtitle and optional English subtitle.
- One short promise sentence.
- Bottom metadata strip with 4-6 icon blocks.
- Right-side orbital/planet/mesh visual field, preferably an IMAGE-2 text-free layer.

HTML skeleton:

```html
<body class="cover">
  <img class="cover-orbit" data-pptx-layer="design" src="../images/cover_orbit.png" />
  <header class="brand-row">
    <div class="brand-left"><p>WEB-ARCH</p><p>Root Lecture</p></div>
    <div class="brand-right"><p>VIBE CODING</p></div>
  </header>
  <main class="cover-copy">
    <h1><span>WEB</span>-ARCH</h1>
    <h2>바이브 코딩을 위한 웹 아키텍처 지도</h2>
    <p class="en">How the web evolved from linked documents to modern applications</p>
    <p class="promise">기술 이름을 외우는 대신, 문제가 생기고 해결된 흐름으로 이해합니다.</p>
  </main>
  <footer class="meta-strip">
    <div class="meta-item"><img data-pptx-capture="asset" src="../icons/icon_target.png" /><h3>대상</h3><p>입문자·바이브 코더</p></div>
    <div class="meta-item"><img data-pptx-capture="asset" src="../icons/icon_layers.png" /><h3>범위</h3><p>HTML부터 SSR까지</p></div>
  </footer>
</body>
```

### 2. `structured_process_flow`

Use for philosophy, evolution, workflows, lock-in loops, and concept chains.

Required zones:
- Top header with slide number pill, deck section label, compact brand marks.
- Big title and one bold lead sentence.
- Large central rounded panel containing 3-5 icon nodes connected by arrows.
- Dotted feedback or infrastructure line when the concept loops back.
- 2-3 bottom cards for role, effect, goal, risk, or implication.
- Bottom insight bar with one synthesized sentence.

HTML skeleton:

```html
<body class="process">
  <header class="topbar">
    <div class="num"><p>03</p></div>
    <div class="section"><p>WEB-ARCH 웹 기술 진화 지도</p></div>
    <div class="marks"><p>ROOT LECTURE</p><p>VIBE CODING</p></div>
  </header>
  <section class="title-block">
    <h1>핵심 철학: 문제 해결의 연쇄</h1>
    <p>웹 기술은 유행어가 아니라, 이전 단계의 한계를 해결하며 등장한 선택지입니다.</p>
  </section>
  <section class="flow-panel" data-pptx-layer="component">
    <div class="node"><img data-pptx-capture="asset" src="../icons/icon_document.png" /><h2>문서 공유</h2><p>HTML·URL·HTTP</p></div>
    <div class="arrow"></div>
    <div class="node"><img data-pptx-capture="asset" src="../icons/icon_paint.png" /><h2>표현 분리</h2><p>CSS</p></div>
  </section>
  <section class="card-row">
    <div class="info-card"><h2>문제</h2><ul><li>문서가 예쁘지 않음</li><li>유지보수가 어려움</li></ul></div>
    <div class="info-card"><h2>해결</h2><ul><li>구조와 표현 분리</li><li>공통 스타일 재사용</li></ul></div>
    <div class="info-card"><h2>관점</h2><ul><li>AI에게도 목적과 제약을 같이 전달</li></ul></div>
  </section>
  <footer class="insight"><p>기술을 잘 쓰는 사람은 도구 이름보다 도구가 해결한 문제를 먼저 봅니다.</p></footer>
</body>
```

### 3. `structured_architecture_map`

Use for browser rendering, frontend/backend split, API, database, deployment, and scaling.

Required zones:
- Header and title block.
- Horizontal or vertical layer map.
- Distinct zones: user/browser, frontend runtime, network/API, backend service, data/cache, ops/deploy.
- Connectors with direction labels.
- Right or bottom implication notes.

### 4. `structured_comparison_matrix`

Use for Internet vs Web, CSR vs SSR, MPA vs SPA, session vs JWT, monolith vs microservices.

Required zones:
- Header and title block.
- 2-3 large comparison columns or rows.
- Each column must include: definition, why it appeared, tradeoff, when to use.
- Highlight decision sentence or "AI prompt implication" in the insight bar.

### 5. `structured_timeline_evolution`

Use for historical sequences.

Required zones:
- Date rail or stage rail.
- Each stage follows `problem -> solution -> new problem`.
- Use small badges for years and technologies.
- Add one emphasized inflection point.

### 6. `structured_summary_playbook`

Use for final synthesis and checklists.

Required zones:
- Large final thesis.
- 4-6 principle blocks or checklist rows.
- Optional mini-map showing how the deck's concepts connect.
- Closing insight bar.

### 7. `structured_loop_flywheel`

Use for network effects, lock-in, session/cookie state, cache refresh, ecosystem growth, and repeated request/response cycles.

Required zones:
- Central concept badge or infrastructure node.
- 3-5 orbiting nodes around it.
- Dotted or curved feedback connector.
- One clear value accumulation statement.
- Optional right-side implication callout.

### 8. `structured_anatomy_callout`

Use when one concept has internal parts: URL, HTTP request, DOM, JWT, package.json, transaction, CI/CD pipeline.

Required zones:
- Central object or symbolic artifact.
- 4-6 callouts with leader lines.
- Compact definition row or note.
- Optional mini example.

### 9. `structured_decision_tree`

Use for "when to choose what" slides: CSR vs SSR, MPA vs SPA, session vs JWT, monolith vs microservices, SQL vs cache.

Required zones:
- Question at top.
- Branches with conditions.
- Outcome chips.
- Bottom recommendation sentence or prompt implication.

## Element Selection Rules

- Top header: use on content slides; simplify or omit on cinematic section slides.
- Slide number pill: use when deck navigation matters; omit on full cinematic divider slides.
- Large title + lead sentence: use on almost every content slide, but keep lead short.
- Central process flow: only for sequential actions or evolution.
- Bottom card row: only when there are 2-3 real supporting lenses such as `문제 / 해결 / 바이브 코딩 관점`.
- Purple insight bar: only when the slide needs a synthesized takeaway. Do not use it as decoration.
- Orbital/platform IMAGE-2 layer: use for cover, loops, ecosystems, network effects, or platform metaphors. Do not use it for every slide.
- Architecture layer bands: use for systems, runtimes, client/server/database/deployment relationships.
- Comparison matrix: use for tradeoffs and choices.
- Timeline rail: use for history and evolution.
- Anatomy callouts: use for one concept with internal structure.

## CSS Base

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 720pt; height: 405pt; overflow: hidden; }
body {
  position: relative;
  font-family: 'Pretendard', 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', Arial, sans-serif;
  color: #101833;
  background: #F7F9FC;
}
.topbar {
  position: absolute;
  left: 18pt; right: 18pt; top: 0;
  height: 30pt;
  display: flex; align-items: center;
  border-bottom: 1pt solid #E5E9F2;
}
.num {
  width: 40pt; height: 30pt;
  background: #4B2CC9;
  border-radius: 0 0 6pt 6pt;
  display: flex; align-items: center; justify-content: center;
}
.num p { color: #fff; font-size: 14pt; font-weight: 800; }
.section { margin-left: 14pt; flex: 1; }
.section p { font-size: 8.5pt; font-weight: 700; color: #475066; }
.marks { display: flex; gap: 12pt; align-items: center; }
.marks p { font-size: 8pt; font-weight: 800; color: #233154; }
.title-block {
  position: absolute;
  left: 22pt; right: 22pt; top: 48pt;
}
.title-block h1 {
  font-size: 28pt;
  line-height: 1.12;
  font-weight: 900;
  color: #081532;
}
.title-block p {
  margin-top: 8pt;
  font-size: 13pt;
  line-height: 1.45;
  font-weight: 700;
  color: #17213B;
}
.flow-panel {
  position: absolute;
  left: 22pt; right: 22pt; top: 118pt; height: 172pt;
  background: #FFFFFF;
  border: 1pt solid #E5E9F2;
  border-radius: 10pt;
}
.card-row {
  position: absolute;
  left: 22pt; right: 22pt; bottom: 42pt; height: 74pt;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8pt;
}
.info-card {
  background: #FFFFFF;
  border: 1pt solid #E5E9F2;
  border-radius: 8pt;
  padding: 12pt 14pt;
}
.info-card h2 { font-size: 13pt; font-weight: 900; margin-bottom: 6pt; color: #24357A; }
.info-card li { font-size: 8.5pt; line-height: 1.45; color: #252E43; margin-left: 12pt; }
.insight {
  position: absolute;
  left: 22pt; right: 22pt; bottom: 14pt; height: 22pt;
  background: #4226B8;
  border-radius: 6pt;
  display: flex; align-items: center; justify-content: center;
  padding: 0 18pt;
}
.insight p { color: #FFFFFF; font-size: 11pt; font-weight: 800; text-align: center; }
```

## IMAGE-2 Prompt Rules

Use IMAGE-2 only after the wireframe exists.

Good prompt shape:

```text
Create a text-free transparent PNG design layer for this slide draft.
Preserve the composition and empty text areas from the reference.
Add premium navy/purple orbital lines, soft glow nodes, abstract platform sphere, and subtle depth.
Do not render letters, numbers, words, logos, labels, UI text, or pseudo-text.
Return only the visual layer with transparent background where text will sit.
```

For light content slides, generate only:
- subtle panel texture,
- abstract background mesh,
- diagram ornament,
- hero illustration without text.

Do not generate:
- final slide screenshots,
- paragraphs,
- fake Korean text,
- icon labels,
- logos not supplied by the user.

## SAM2 Object Decomposition Rules

When IMAGE-2 creates a detailed text-free slide design, preserve editability by cutting the master visual into object PNGs before PPTX assembly.

Use this only when a slide has multiple logical visual objects in one master design:
- orbital field plus planet/sphere,
- process panel plus node skins,
- architecture layer bands plus glow connectors,
- flywheel ring plus center hub,
- callout object plus background ornament.

Required HTML markers:

```html
<div class="node-skin"
     data-object-id="node-browser"
     data-object-kind="node"
     data-object-refine="bbox"></div>

<div class="orbit-ring"
     data-object-id="orbit-ring"
     data-object-kind="decor"
     data-object-refine="sam2"></div>
```

Recommended refinement:
- `bbox`: rectangular cards, panels, layer bands, badges.
- `sam2`: curved rings, glows, spheres, irregular illustrations, overlapping ornaments.
- `none`: elements that should stay in the background.

Pipeline:

```text
capture_slide_drafts.js
-> slideNN_draft.png + slideNN_objects.json
-> IMAGE-2 slideNN_visual_master.png
-> decompose_visual_objects.py --slide slideNN
-> optional --sam2 for irregular objects
-> objects/slideNN/*.png
-> final HTML with each PNG as data-pptx-layer="design"
```

## QA Checklist

- Slide title, lead, diagram labels, card copy, and insight bar are editable text.
- Header, number pill, cards, arrows, and connectors align consistently across slides.
- Generated images are text-free.
- Major generated visual layers are selectable PNG/SVG objects.
- IMAGE-2 master visuals with multiple logical objects are decomposed before PPTX assembly.
- SAM2 is used only for mask refinement, not as the source of slide structure.
- No body text is smaller than 8pt.
- Korean text does not collide or wrap awkwardly.
- The deck alternates dark premium slides and bright structured slides deliberately.
- At least one slide preview is inspected at full size, not only montage size.

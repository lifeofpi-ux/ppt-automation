# PPT Automation Workflow
> **AI 에이전트 기반 자동 파워포인트 생성 시스템**  
> *Created by LifeOfPi (LOF)*

AI 에이전트를 활용하여 고품질 파워포인트 프레젠테이션(`.pptx`)을 자동 생성하는 워크플로우입니다. HTML로 슬라이드를 작성하면 Playwright 기반 3-레이어 하이브리드 렌더링으로 정밀하게 PPTX로 변환합니다. 등록된 디자인 테마를 선택하거나, `getdesign`으로 새 테마를 즉시 추가할 수 있습니다.

---

## 주요 기능

- **3-레이어 하이브리드 렌더링** — Playwright로 배경·컴포넌트·텍스트를 분리 캡처하여 배경은 고화질 PNG로, 텍스트는 PowerPoint에서 완전 편집 가능한 상태로 저장
- **등록된 디자인 테마** — The Verge Editorial(다크), Figma Editorial(화이트 파스텔) 즉시 사용 가능
- **getdesign 테마 확장** — `npx getdesign@latest add [name]`으로 다운로드한 DESIGN.md를 자동 분석하여 CSS 테마 + 슬라이드 스펙 파일을 생성하고 워크플로우에 영구 등록
- **Pretendard 전용 폰트** — 모든 슬라이드에 Pretendard 패밀리(Thin/ExtraLight/Light/Regular/Medium/SemiBold/Bold/ExtraBold/Black) 강제 적용, PPTX 출력 시 weight별 서브폰트로 자동 매핑
- **Phosphor 아이콘** — Phosphor Duotone 아이콘을 PNG로 래스터라이즈하여 슬라이드에 삽입
- **AI 배경 이미지** — OpenAI gpt-image-2로 히어로·섹션 배경을 은은하고 세련되게 생성
- **병렬 에셋 생성** — 아이콘 생성과 AI 이미지 생성을 독립 실행으로 병렬 처리
- **오버플로우 검증** — `check_overflow.js`로 슬라이드별 즉시 치수 검증 (720pt × 405pt)
- **크로스 플랫폼** — macOS · Windows 완벽 지원 (경로·인코딩 자동 처리)

---

## 필수 요구사항

| 항목 | 버전 | 용도 |
|---|---|---|
| Node.js | v18 이상 | 슬라이드 생성 엔진 전체 |
| Python | 3.8 이상 | 기존 PPTX 편집 도구 |
| Git | 최신 | 저장소 관리 |
| OpenAI API Key | — | AI 배경 이미지 생성 (선택) |

---

## 설치

```bash
# 1. 저장소 복제
git clone https://github.com/indend007/ppt-automation.git
cd ppt-automation

# 2. Node.js 패키지 설치
npm install

# 3. Playwright 브라우저 설치 (html2pptx 렌더링 엔진)
npx playwright install chromium

# 4. Python 패키지 설치 (기존 PPTX 편집 기능용, 선택)
pip install python-pptx defusedxml
```

### OpenAI API Key 설정 (AI 이미지 생성 시)

```bash
# macOS / Linux
export OPENAI_API_KEY="sk-..."

# Windows
set OPENAI_API_KEY=sk-...
```

또는 프로젝트 루트에 `.env` 파일을 생성합니다 (`.gitignore`에 등록되어 있어 커밋되지 않음):

```
OPENAI_API_KEY=sk-...
```

---

## 사용 방법

이 워크플로우는 `.agent/workflows/` 디렉토리를 참조하는 AI 에이전트(Claude Code 등)와 함께 사용합니다.

### 시작

에이전트에게 아래와 같이 요청합니다:

```
"/pptx 워크플로우를 사용하여 [주제]에 대한 프레젠테이션을 만들어줘."
```

### 디자인 테마 선택

에이전트가 아래 옵션을 제시합니다:

| 번호 | 테마 | 특징 | 적합한 용도 |
|---|---|---|---|
| 1 | **The Verge Editorial** | 다크 캔버스, 민트/바이올렛 액센트, Pretendard Black 헤드라인 | 테크 미디어, 트렌드 리포트, 개발자 발표 |
| 2 | **Figma Editorial** | 흰 캔버스, 파스텔 컬러 블록(라임·라일락·민트·코랄·네이비) | 제품 런칭, 툴 소개, 클린 모던 덱 |
| 3 | **getdesign Import** | 템플릿 이름 입력 시 자동 다운로드 후 새 테마로 등록 | 새로운 디자인 시스템 추가 |
| 4 | **Custom Design** | 색상·분위기·폰트 요구사항 직접 지정 | 완전 커스텀 |

### 자동화 파이프라인

에이전트가 아래 단계를 순서대로 실행합니다:

```
1. 프로젝트 폴더 생성  workspace/[project_name]/
2. 에셋 병렬 생성      아이콘(Phosphor) + AI 배경 이미지 동시 실행
3. HTML 슬라이드 작성  선택한 테마 CSS + .v-* / .fig-* BEM 클래스 사용
4. 오버플로우 검증     check_overflow.js 슬라이드별 즉시 검증
5. PPTX 변환          html2pptx() → [project].pptx 저장
```

### getdesign 테마 추가

새 디자인 시스템을 테마로 등록하려면 에이전트에게 "getdesign Import"를 선택하고 템플릿 이름을 입력합니다. 에이전트가 아래를 자동 처리합니다:

```
npx getdesign@latest add [name]    # DESIGN.md 다운로드
→ 토큰 추출 (colors, typography, rounded, spacing, components)
→ themes/[name].css 생성          (Pretendard 매핑 + BEM 클래스)
→ templates/[name]_editorial.md 생성  (슬라이드 스펙 + 패턴 예시)
→ pptx.md 워크플로우에 영구 등록
→ DESIGN.md 삭제
```

사용 가능한 getdesign 템플릿 예시: `linear`, `notion`, `vercel`, `stripe`, `tailwind`, `shadcn`, `github`, `framer`, `loom`, `resend`, `supabase` …

---

## 폰트 시스템

모든 슬라이드는 **Pretendard** 패밀리만 사용합니다. HTML의 `font-weight`가 PPTX 변환 시 자동으로 해당 서브폰트에 매핑됩니다.

| font-weight | Pretendard 서브폰트 | 주요 용도 |
|---|---|---|
| 900 | Pretendard Black | 히어로 디스플레이 헤드라인 |
| 800 | Pretendard ExtraBold | 대형 콜아웃 |
| 700 | Pretendard Bold | 섹션 제목, 카드 헤드라인 |
| 600 | Pretendard SemiBold | 킥커, 레이블, UPPERCASE 태그 |
| 500 | Pretendard Medium | 강조 본문 |
| 400 | Pretendard Regular | 본문 |
| 300 | Pretendard Light | 아이브로우, 풀 쿼트 |
| 200 | Pretendard ExtraLight | 장식적 얇은 텍스트 |
| 100 | Pretendard Thin | 초경량 액센트 |

---

## 프로젝트 구조

```
ppt-automation/
├── .agent/
│   └── workflows/
│       ├── pptx.md                          # 메인 워크플로우 정의
│       └── skills/pptx/
│           ├── docs/
│           │   ├── html2pptx.md             # 렌더링 엔진 레퍼런스
│           │   ├── image_generation.md      # AI 이미지 생성 가이드
│           │   └── ooxml.md                 # 기존 PPTX 편집 가이드
│           ├── ooxml/scripts/               # 기존 PPTX 편집 도구
│           │   ├── unpack.py
│           │   ├── validate.py
│           │   └── pack.py
│           ├── scripts/
│           │   ├── html2pptx.js             # 핵심 변환 엔진 (Playwright)
│           │   ├── generate_icons.template.js
│           │   ├── generate_design_assets.template.js
│           │   ├── capture_slide_drafts.template.js
│           │   ├── decompose_visual_objects.template.py
│           │   ├── inventory.py             # PPTX 텍스트 인벤토리 추출
│           │   ├── rearrange.py             # 슬라이드 재배치
│           │   ├── replace.py               # 텍스트 교체
│           │   └── thumbnail.py             # 썸네일 그리드 생성
│           ├── templates/
│           │   ├── the_verge_editorial.md   # Verge 디자인 스펙
│           │   └── figma_editorial.md       # Figma 디자인 스펙
│           └── themes/
│               ├── verge.css                # The Verge Editorial 테마
│               └── figma.css                # Figma Editorial 테마
├── workspace/                               # 생성된 프로젝트 (.gitignore)
│   └── [project_name]/
│       ├── assets/
│       │   ├── css/                         # 프로젝트 복사본 CSS
│       │   ├── images/                      # 아이콘 · AI 배경
│       │   ├── scripts/                     # 프로젝트별 생성 스크립트
│       │   └── slides/                      # HTML 슬라이드
│       └── [project_name].pptx              # 최종 결과물
├── package.json
└── README.md
```

---

## 3-레이어 하이브리드 렌더링

`html2pptx.js`는 Playwright Chromium으로 각 HTML 슬라이드를 3단계로 분리 캡처합니다:

```
Layer 1  전체 배경      모든 콘텐츠를 숨긴 상태로 슬라이드 배경 PNG 캡처
Layer 2  컴포넌트       카드·박스·pill 등 시각 스타일 요소를 개별 PNG로 캡처
Layer 3  편집 텍스트    모든 텍스트를 추출하여 완전 편집 가능한 텍스트 박스로 삽입
```

- 2× Retina 해상도 캡처 (`deviceScaleFactor: 2`)
- `data-pptx-layer="design"` / `data-pptx-capture="asset"` 속성으로 강제 캡처 가능
- CSS의 `font-weight`가 PPTX 텍스트 박스의 Pretendard 서브폰트로 자동 변환

---

## 크로스 플랫폼 호환성

| 항목 | 처리 방식 |
|---|---|
| 경로 구분자 | 모든 스크립트에서 `path.join()` / `path.resolve()` 사용 |
| 한글 인코딩 | 모든 파일 읽기·쓰기에 UTF-8 명시 |
| 폰트 | Pretendard Variable CDN 자동 로드 (시스템 폰트 의존 없음) |

---

*Created by LifeOfPi (LOF)*

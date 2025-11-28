# PPT 자동화 워크플로우 (PPT Automation Workflow)
> **AI 에이전트 기반 자동 파워포인트 생성 시스템**  
> *작성자: LifeOfPi (LOF)*

이 프로젝트는 AI 에이전트를 활용하여 고품질의 세련된 파워포인트 프레젠테이션(`.pptx`)을 자동으로 생성하는 강력한 워크플로우를 제공합니다. HTML-to-PPTX 변환 방식을 사용하여 픽셀 단위의 정밀한 디자인 제어가 가능하며, 다양한 미적 템플릿을 지원합니다.

## 🌟 주요 기능 (Key Features)

*   **AI 기반 디자인**: 사용자의 요청에 따라 콘텐츠, 레이아웃, 에셋을 자동으로 생성합니다.
*   **전문 템플릿**: *Tech Showcase(테크 쇼케이스)*, *Minimalist Corporate(미니멀 기업용)*, *Creative Storytelling(감성 스토리텔링)*, *Academic Structured(학술/교육용)* 등 다양한 내장 스타일을 제공합니다.
*   **크로스 플랫폼**: **macOS**와 **Windows** 운영체제 모두에서 완벽하게 동작합니다.
*   **병렬 처리**: 아이콘과 이미지를 동시에 생성하여 작업 속도를 극대화합니다.
*   **웹 뷰어**: 파워포인트 없이도 브라우저에서 바로 발표할 수 있는 웹 기반 슬라이드 뷰어를 생성합니다.
*   **하이브리드 렌더링**: 고해상도 배경 캡처와 편집 가능한 텍스트 박스를 결합하여 최상의 품질을 보장합니다.

## 🛠 필수 요구사항 (Prerequisites)

시스템에 다음 소프트웨어가 설치되어 있어야 합니다:

*   **Node.js** (v14 이상)
*   **Python** (3.8 이상, 텍스트 추출/분석 도구용)
*   **Git**

## 📦 설치 방법 (Installation)

1.  **저장소 복제 (Clone)**:
    ```bash
    git clone https://github.com/your-repo/ppt-automation.git
    cd ppt-automation
    ```

2.  **의존성 설치**:
    ```bash
    npm install pptxgenjs sharp react-icons puppeteer
    ```
    *(참고: `puppeteer`는 HTML 렌더링 캡처에 사용됩니다)*

## 🚀 사용 방법 (Usage)

이 워크플로우는 `.agent/workflows` 디렉토리에 접근할 수 있는 AI 에이전트(Claude 등)와 함께 사용하도록 설계되었습니다.

### 1. 워크플로우 시작
슬래시 커맨드를 사용하거나 에이전트에게 다음과 같이 요청하세요:
> "/pptx 워크플로우를 사용하여 [주제]에 대한 프레젠테이션을 만들어줘."

### 2. 디자인 선택
에이전트가 디자인 스타일을 선택하라고 요청할 것입니다:
1.  **Tech Showcase** (현대적, 글래스모피즘)
2.  **Minimalist Corporate** (깔끔함, 신뢰감)
3.  **Creative Storytelling** (감성적, 세리프 폰트)
4.  **Academic Structured** (정보 중심, 교육용)

### 3. 자동화 프로세스
에이전트가 다음 단계를 자동으로 수행합니다:
1.  **설정**: 프로젝트 폴더 생성 (`workspace/[project_name]`).
2.  **에셋 생성**: 아이콘과 배경 이미지를 병렬로 생성.
3.  **HTML 작성**: 선택한 템플릿을 기반으로 HTML 슬라이드 작성.
4.  **PPTX 생성**: HTML 슬라이드를 `.pptx` 파일로 변환.
5.  **웹 뷰어 (옵션)**: 웹 기반 뷰어 생성.

### 4. 수동 명령어 (개발자용)

필요한 경우 스크립트를 직접 실행할 수 있습니다:

**웹 뷰어 생성**:
```bash
node .agent/workflows/skills/pptx/scripts/generate_web_viewer.js workspace/[project_name]
```

**HTML을 PPTX로 변환**:
```bash
node workspace/[project_name]/assets/scripts/create_ppt.js
```

## 💻 크로스 플랫폼 호환성 (Windows/macOS)

이 워크플로우는 두 운영체제 모두에 최적화되어 있습니다.

*   **경로 처리**: 모든 스크립트는 `path.join()`을 사용하여 Windows(`\`)와 macOS(`/`)의 경로 차이를 자동으로 처리합니다.
*   **폰트**: CSS 템플릿은 Windows 표준 폰트(`맑은 고딕`, `Segoe UI`)와 macOS 폰트(`Apple SD 산돌고딕 Neo`, `San Francisco`)를 모두 지원하는 폰트 스택을 포함합니다.
*   **인코딩**: 한글 깨짐 방지를 위해 모든 파일 작업은 UTF-8 인코딩을 사용합니다.

## 📂 프로젝트 구조

```
ppt-automation/
├── .agent/
│   └── workflows/
│       ├── pptx.md                 # 메인 워크플로우 정의
│       └── skills/
│           └── pptx/
│               ├── scripts/        # 핵심 스크립트 (html2pptx, 웹 뷰어)
│               └── templates/      # 디자인 템플릿 (Tech, Corporate 등)
├── workspace/                      # 생성된 프로젝트 폴더
│   └── [project_name]/
│       ├── assets/
│       │   ├── images/             # 생성된 이미지/아이콘
│       │   ├── scripts/            # 프로젝트별 스크립트
│       │   └── slides/             # HTML 소스 슬라이드
│       ├── index.html              # 웹 뷰어 파일
│       └── [project_name].pptx     # 최종 파워포인트 파일
└── README.md
```

---
*Created by LifeOfPi (LOF)*

# PPT Automation Workflow
> **Automated PowerPoint Generation System powered by AI Agent**  
> *Author: LifeOfPi (LOF)*

This project provides a robust workflow for generating high-quality, sophisticated PowerPoint presentations (`.pptx`) using AI agents. It leverages HTML-to-PPTX conversion for pixel-perfect design control and supports various aesthetic templates.

## 🌟 Key Features

*   **AI-Driven Design**: Automatically generates content, layouts, and assets based on user requests.
*   **Professional Templates**: Includes built-in styles like *Tech Showcase*, *Minimalist Corporate*, *Creative Storytelling*, and *Academic Structured*.
*   **Cross-Platform**: Fully compatible with **macOS** and **Windows**.
*   **Parallel Processing**: Generates icons and images concurrently for maximum speed.
*   **Web Viewer**: Instantly creates a browser-based slide viewer for easy sharing and presentation.
*   **Hybrid Rendering**: Combines high-res background captures with editable text boxes for the best of both worlds.

## 🛠 Prerequisites

Ensure you have the following installed on your system:

*   **Node.js** (v14 or higher)
*   **Python** (3.8 or higher, for text extraction/analysis tools)
*   **Git**

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/ppt-automation.git
    cd ppt-automation
    ```

2.  **Install Dependencies**:
    ```bash
    npm install pptxgenjs sharp react-icons puppeteer
    ```
    *(Note: `puppeteer` is used for HTML rendering capture)*

## 🚀 Usage

This workflow is designed to be used with an AI Agent (like Claude or similar) that has access to the `.agent/workflows` directory.

### 1. Start the Workflow
Trigger the workflow by using the slash command or asking the agent:
> "Create a presentation about [Topic] using the /pptx workflow."

### 2. Select a Design
The agent will prompt you to choose a design style:
1.  **Tech Showcase** (Modern, Glassmorphism)
2.  **Minimalist Corporate** (Clean, Professional)
3.  **Creative Storytelling** (Emotional, Serif)
4.  **Academic Structured** (Dense, Educational)

### 3. Automated Process
The agent will perform the following steps automatically:
1.  **Setup**: Create project folders (`workspace/[project_name]`).
2.  **Asset Generation**: Create icons and background images in parallel.
3.  **HTML Creation**: Write HTML slides based on the selected template.
4.  **PPTX Generation**: Convert HTML slides to a `.pptx` file.
5.  **Web Viewer (Optional)**: Generate a web-based viewer.

### 4. Manual Commands (for Developers)

You can also run the scripts manually if needed:

**Generate Web Viewer**:
```bash
node .agent/workflows/skills/pptx/scripts/generate_web_viewer.js workspace/[project_name]
```

**Convert HTML to PPTX**:
```bash
node workspace/[project_name]/assets/scripts/create_ppt.js
```

## 💻 Cross-Platform Compatibility (Windows/macOS)

This workflow is optimized for both operating systems.

*   **Paths**: All scripts use `path.join()` to handle file paths correctly on both Windows (`\`) and macOS (`/`).
*   **Fonts**: CSS templates include font stacks that support standard Windows fonts (e.g., `Malgun Gothic`, `Segoe UI`) and macOS fonts (`Apple SD Gothic Neo`, `San Francisco`).
*   **Encoding**: All file operations use UTF-8 to ensure proper handling of Korean characters.

## 📂 Project Structure

```
ppt-automation/
├── .agent/
│   └── workflows/
│       ├── pptx.md                 # Main Workflow Definition
│       └── skills/
│           └── pptx/
│               ├── scripts/        # Core scripts (html2pptx, web viewer)
│               └── templates/      # Design templates (Tech, Corporate, etc.)
├── workspace/                      # Generated Projects
│   └── [project_name]/
│       ├── assets/
│       │   ├── images/             # Generated assets
│       │   ├── scripts/            # Project-specific scripts
│       │   └── slides/             # HTML source slides
│       ├── index.html              # Web Viewer
│       └── [project_name].pptx     # Final PowerPoint file
└── README.md
```

---
*Created by LifeOfPi (LOF)*

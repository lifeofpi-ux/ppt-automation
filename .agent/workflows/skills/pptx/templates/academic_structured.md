# Academic Structured Design Template

A dense, typography-driven design optimized for lectures, research presentations, and educational materials. Focuses on information hierarchy, readability, and efficient space utilization.

## Design System

### Color Palette
- **Background**: Off-White (`#FAFAFA`) or Paper Texture
- **Text Primary**: Black (`#111111`)
- **Text Secondary**: Dark Gray (`#444444`)
- **Accent**: Academic Red (`#8B0000`) or Navy (`#000080`) or Forest Green (`#006400`)
- **Highlight**: Light Yellow (`#FFFACD`) for emphasis

### Typography
- **Headings**: Sans-serif (Pretendard, Arial, Helvetica) for clarity and impact. Bold weight.
- **Body**: Serif (Noto Serif KR, Times New Roman, Garamond) for long-form reading comfort.
- **Code/Data**: Monospace (Courier New, Consolas).

## CSS Snippets

### 1. Multi-Column Layout (High Density)
```css
body {
  background: #FAFAFA;
  font-family: 'Noto Serif KR', serif;
  color: #111;
  line-height: 1.5;
}

.container {
  padding: 30pt 40pt;
  display: flex;
  flex-direction: column;
}

.columns-2 {
  display: flex;
  gap: 24pt;
}

.columns-3 {
  display: flex;
  gap: 16pt;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10pt;
}
```

### 2. Hierarchical Typography
```css
h1 {
  font-family: 'Pretendard', sans-serif;
  font-size: 28pt;
  font-weight: 800;
  border-bottom: 2px solid #111;
  padding-bottom: 8pt;
  margin-bottom: 16pt;
}

h2 {
  font-family: 'Pretendard', sans-serif;
  font-size: 18pt;
  font-weight: 700;
  color: #000080; /* Accent Color */
  margin-top: 12pt;
  margin-bottom: 6pt;
}

h3 {
  font-family: 'Pretendard', sans-serif;
  font-size: 14pt;
  font-weight: 600;
  border-left: 3px solid #000080;
  padding-left: 8pt;
  margin-bottom: 4pt;
}

p {
  font-size: 10pt; /* Smaller font for higher density */
  text-align: justify;
}
```

### 3. Information Boxes
```css
.definition-box {
  background: #F0F4F8;
  border-left: 4pt solid #000080;
  padding: 10pt;
  margin: 8pt 0;
}

.definition-title {
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
  font-size: 10pt;
  color: #000080;
  margin-bottom: 4pt;
}

.key-point {
  background: #FFFACD; /* Highlighter effect */
  padding: 2pt 4pt;
  border-radius: 2pt;
}
```

### 4. Footnotes & References
```css
.footer {
  margin-top: auto;
  padding-top: 8pt;
  border-top: 1px solid #DDD;
  font-size: 8pt;
  color: #666;
  font-family: 'Pretendard', sans-serif;
}
```

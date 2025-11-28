# Creative Storytelling Design Template

An emotional, narrative-driven design optimized for essays, brand stories, and literature. Focuses on imagery, typography, and atmosphere.

## Design System

### Color Palette
- **Background**: Warm Beige (`#FDFBF7`) or Cream (`#FFFDD0`)
- **Text Primary**: Charcoal (`#2C2C2C`)
- **Text Secondary**: Warm Gray (`#5D5D5D`)
- **Accent**: Earthy Orange (`#E07A5F`) or Sage Green (`#81B29A`)

### Typography
- **Headings**: Serif fonts (Noto Serif KR, Georgia, Garamond) for emotional impact.
- **Body**: Sans-serif (Pretendard, Arial) for readability, or Serif for literary feel.

## CSS Snippets

### 1. Atmospheric Layout
```css
body {
  background: #FDFBF7;
  font-family: 'Noto Serif KR', Georgia, serif;
  color: #2C2C2C;
}

.container {
  padding: 40pt;
  display: flex;
  position: relative;
}
```

### 2. Asymmetric/Overlap Layout
```css
.image-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 55%;
  height: 100%;
  z-index: 0;
}

.text-card {
  position: relative;
  z-index: 1;
  width: 50%;
  background: rgba(253, 251, 247, 0.95);
  padding: 40pt 40pt 40pt 0;
  margin-top: 60pt;
}
```

### 3. Typography Details
```css
h1 {
  font-family: 'Noto Serif KR', serif;
  font-weight: 700;
  font-size: 36pt;
  line-height: 1.2;
  margin-bottom: 24pt;
  color: #1A1A1A;
}

.quote {
  font-style: italic;
  border-left: 3px solid #E07A5F;
  padding-left: 16pt;
  margin: 20pt 0;
  color: #5D5D5D;
}
```

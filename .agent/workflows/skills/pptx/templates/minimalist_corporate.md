# Minimalist Corporate Design Template

A clean, professional design optimized for business reports, proposals, and corporate introductions. Focuses on readability, trust, and structured data presentation.

## Design System

### Color Palette
- **Background**: Pure White (`#FFFFFF`) or Very Light Gray (`#F8F9FA`)
- **Text Primary**: Dark Navy (`#1A202C`)
- **Text Secondary**: Slate Gray (`#4A5568`)
- **Accent**: Professional Blue (`#2B6CB0`) or Teal (`#319795`)
- **Border/Divider**: Light Gray (`#E2E8F0`)

### Typography
- **Font**: Pretendard, Noto Sans KR, or Arial
- **Headings**: Bold, clean, standard tracking.
- **Body**: Regular weight, high legibility.

## CSS Snippets

### 1. Base Layout
```css
body {
  background: #FFFFFF;
  font-family: 'Pretendard', Arial, sans-serif;
  color: #1A202C;
}

.container {
  padding: 30pt 40pt;
  display: flex;
  flex-direction: column;
}
```

### 2. Clean Cards
```css
.card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8pt;
  padding: 20pt;
  box-shadow: 0 2pt 4pt rgba(0,0,0,0.05);
}
```

### 3. Professional Header
```css
.header-line {
  width: 40pt;
  height: 3pt;
  background: #2B6CB0;
  margin-bottom: 12pt;
}

h1 {
  font-size: 32pt;
  color: #2D3748;
  margin-bottom: 8pt;
}
```

### 4. Data Tables/Grids
```css
.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20pt;
  border-top: 2px solid #2B6CB0;
  padding-top: 20pt;
}
```

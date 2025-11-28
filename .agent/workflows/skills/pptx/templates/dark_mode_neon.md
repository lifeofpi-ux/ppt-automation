# Dark Mode Neon Design Template

A bold, futuristic design optimized for tech trends, gaming, and high-impact presentations. Focuses on contrast, glowing effects, and dark aesthetics.

## Design System

### Color Palette
- **Background**: Deep Black (`#050505`) or Dark Gunmetal (`#111111`)
- **Text Primary**: Pure White (`#FFFFFF`)
- **Text Secondary**: Light Gray (`#A0A0A0`)
- **Accents**: Neon Green (`#00FF94`), Cyber Purple (`#BC13FE`), Electric Blue (`#00F0FF`)

### Typography
- **Font**: Pretendard, Roboto, or Impact
- **Headings**: Bold, uppercase, wide tracking.
- **Body**: Light weight, clean sans-serif.

## CSS Snippets

### 1. Dark Layout
```css
body {
  background: #050505;
  font-family: 'Pretendard', sans-serif;
  color: #FFFFFF;
}

.container {
  padding: 30pt;
  background: radial-gradient(circle at top right, #1a1a1a 0%, #000000 100%);
}
```

### 2. Neon Glow Effects
```css
.neon-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 12pt;
  padding: 20pt;
  box-shadow: 0 0 15pt rgba(0, 240, 255, 0.1);
  backdrop-filter: blur(10px);
}

.neon-text {
  color: #00FF94;
  text-shadow: 0 0 10px rgba(0, 255, 148, 0.5);
}
```

### 3. Gradient Borders
```css
.gradient-border {
  position: relative;
  background: #111;
  border-radius: 8pt;
  z-index: 1;
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 10pt;
  background: linear-gradient(45deg, #BC13FE, #00F0FF);
  z-index: -1;
}
```

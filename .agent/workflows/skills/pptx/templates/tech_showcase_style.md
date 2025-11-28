# Tech Showcase Design Template

A sophisticated, modern design template optimized for tech product introductions, featuring a Bento Grid layout, glassmorphism effects, and vibrant gradient accents.

## Design System

### Color Palette
- **Primary Accent**: Hot Pink (`#FF1493`)
- **Secondary Accent**: Light Blue (`#87CEEB`)
- **Background**: Soft Pink/Blue Gradient (`#FFF8FA` or `linear-gradient(135deg, #FFF5F7 0%, #F0F8FF 100%)`)
- **Text**: Dark Grey (`#1D1D1F`, `#2D2D2F`) for headings, Medium Grey (`#6B6B6B`) for body.

### Typography
- **Font**: Arial (Web-safe) or Pretendard (if available)
- **Headings**: Bold/ExtraBold, tight letter spacing (`-0.02em`)
- **Body**: Regular, relaxed line height (`1.5`)

## CSS Snippets

### 1. Base Container & Layout
```css
body {
  width: 720pt;
  height: 405pt;
  margin: 0;
  padding: 0;
  background: #FFF8FA;
  font-family: Arial, sans-serif;
  display: flex;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100%;
  padding: 20pt 24pt;
  display: flex;
  flex-direction: column;
}

/* 2-Column Layout */
.content {
  display: flex;
  gap: 16pt;
  flex: 1;
}

.left-column { width: 240pt; display: flex; flex-direction: column; gap: 10pt; }
.right-column { flex: 1; display: flex; flex-direction: column; gap: 12pt; }
```

### 2. Glassmorphic Cards
```css
.card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 14pt;
  padding: 14pt;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2pt 8pt rgba(0, 0, 0, 0.04);
}
```

### 3. Gradient Badges & Tags
```css
.badge {
  display: inline-block;
  padding: 4pt 10pt;
  background: rgba(255, 20, 147, 0.1);
  border-radius: 12pt;
  border: 1px solid rgba(255, 20, 147, 0.2);
}

.badge p {
  font-size: 8pt;
  font-weight: 700;
  color: #FF1493;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 4. App Window Showcase
```css
.showcase {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 14pt;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4pt 16pt rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.showcase-header {
  background: #f5f5f7;
  padding: 6pt 10pt;
  display: flex;
  align-items: center;
  gap: 4pt;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.dot { width: 6pt; height: 6pt; border-radius: 50%; background: #ddd; }
.dot:nth-child(1) { background: #FF5F56; } /* Red */
.dot:nth-child(2) { background: #FFBD2E; } /* Yellow */
.dot:nth-child(3) { background: #27C93F; } /* Green */
```

## HTML Structure Example

```html
<div class="container">
  <div class="header">
    <div class="badge"><p>CATEGORY</p></div>
    <h1>Product Title</h1>
    <p class="subtitle">Subtitle description goes here</p>
  </div>
  
  <div class="content">
    <div class="left-column">
      <div class="card">
        <h2>Features</h2>
        <!-- Feature Items -->
      </div>
    </div>
    
    <div class="right-column">
      <div class="image-row">
        <div class="showcase">
          <!-- App Screenshot -->
        </div>
        <div class="logic-section">
          <!-- Infographic -->
        </div>
      </div>
    </div>
  </div>
</div>
```

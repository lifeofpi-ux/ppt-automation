const fs = require('fs');
const path = require('path');

// Get project path from command line argument
const projectPath = process.argv[2];

if (!projectPath) {
    console.error('❌ Usage: node generate_web_viewer.js <project_path>');
    process.exit(1);
}

const slidesDir = path.join(projectPath, 'assets/slides');
const templatePath = path.join(__dirname, '../templates/web_viewer_template.html');
const outputPath = path.join(projectPath, 'index.html');

// 1. Check if directories exist
if (!fs.existsSync(slidesDir)) {
    console.error(`❌ Slides directory not found: ${slidesDir}`);
    process.exit(1);
}

if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template file not found: ${templatePath}`);
    process.exit(1);
}

// 2. Scan for slide files
const files = fs.readdirSync(slidesDir);
const slideFiles = files
    .filter(file => file.match(/^slide\d+\.html$/)) // Match slide1.html, slide2.html...
    .sort((a, b) => {
        // Sort numerically (slide1, slide2, slide10...)
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

if (slideFiles.length === 0) {
    console.error('❌ No slide files found in assets/slides/');
    process.exit(1);
}

console.log(`🔍 Found ${slideFiles.length} slides:`, slideFiles);

// 3. Read slide contents and prepare for injection
const slidesContent = slideFiles.map(file => {
    const filePath = path.join(slidesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix image paths: "../images/" -> "assets/images/"
    // Because index.html is one level up from assets/slides/
    content = content.replace(/\.\.\/images\//g, 'assets/images/');

    // Escape backticks and backslashes for JS string literal
    content = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');

    return `\`${content}\``;
});

const slidesListString = `[${slidesContent.join(',\n')}]`;

// 4. Read template and replace placeholder
let template = fs.readFileSync(templatePath, 'utf8');
const projectName = path.basename(projectPath);

// Use Regex to handle optional spaces: {{SLIDES_LIST}} or {{ SLIDES_LIST }}
template = template.replace(/\{\{\s*PROJECT_NAME\s*\}\}/g, projectName);
template = template.replace(/\{\{\s*SLIDES_LIST\s*\}\}/g, slidesListString);

// Update template to use srcdoc instead of src (if not already updated in template)
template = template.replace('frame.src = slides[currentIndex];', 'frame.srcdoc = slides[currentIndex];');

// 5. Write output file
fs.writeFileSync(outputPath, template);

console.log(`\n✅ Web Viewer generated successfully! (Bundled Mode)`);
console.log(`🚀 Open this file in your browser to present:`);
console.log(`   ${outputPath}`);

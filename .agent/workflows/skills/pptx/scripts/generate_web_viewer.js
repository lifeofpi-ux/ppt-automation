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

// 3. Prepare slides list for JS injection (relative paths)
const slidesList = slideFiles.map(file => `'assets/slides/${file}'`);
const slidesListString = `[${slidesList.join(', ')}]`;

// 4. Read template and replace placeholder
let template = fs.readFileSync(templatePath, 'utf8');
const projectName = path.basename(projectPath);

template = template.replace('{{PROJECT_NAME}}', projectName);
template = template.replace('{{SLIDES_LIST}}', slidesListString);

// 5. Write output file
fs.writeFileSync(outputPath, template);

console.log(`\n✅ Web Viewer generated successfully!`);
console.log(`🚀 Open this file in your browser to present:`);
console.log(`   ${outputPath}`);

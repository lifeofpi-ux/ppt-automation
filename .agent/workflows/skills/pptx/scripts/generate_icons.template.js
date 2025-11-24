const fs = require('fs');
const path = require('path');
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const sharp = require('sharp');

// Import Phosphor Duotone icons
// See https://react-icons.github.io/react-icons/icons/pi/ for available icons
const {
    PiTargetDuotone,
    PiUsersDuotone,
    PiDatabaseDuotone,
    PiTrendUpDuotone,
    PiStackDuotone,
    PiCheckCircleDuotone,
    PiGlobeDuotone,
    PiBookDuotone,
    PiMedalDuotone,
    PiMonitorDuotone,
    PiPulseDuotone,
    PiStarDuotone,
    PiMapTrifoldDuotone,
    PiLightningDuotone,
    PiLayoutDuotone
} = require('react-icons/pi');

// Configuration for icons to generate
// Customize this list for your project
const ICONS = [
    // Example: Blue Theme Icons
    { name: 'icon_target_blue', component: PiTargetDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_users_blue', component: PiUsersDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_database_blue', component: PiDatabaseDuotone, color: '#3498DB', size: 128 },

    // Add your project specific icons here...
];

// Output directory - relative to this script
// This script is expected to be in [project_assets]/scripts/
// So images will go to [project_assets]/images/
const OUTPUT_DIR = path.resolve(__dirname, '../images');

async function generateIcons() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log(`Generating ${ICONS.length} icons to ${OUTPUT_DIR}...`);

    for (const iconConfig of ICONS) {
        try {
            // 1. Render React Icon to SVG string
            // Phosphor Duotone icons use opacity for the secondary layer.
            // Passing 'color' applies to both, but the secondary layer has opacity.
            const svgString = renderToStaticMarkup(
                React.createElement(iconConfig.component, {
                    size: iconConfig.size,
                    color: iconConfig.color,
                    style: { display: 'block' }
                })
            );

            // 2. Convert SVG to PNG using Sharp
            const outputPath = path.join(OUTPUT_DIR, `${iconConfig.name}.png`);

            await sharp(Buffer.from(svgString))
                .png()
                .toFile(outputPath);

            console.log(`✓ Generated: ${iconConfig.name}.png`);
        } catch (err) {
            console.error(`✗ Failed to generate ${iconConfig.name}:`, err);
        }
    }
}

generateIcons();

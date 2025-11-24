const fs = require('fs');
const path = require('path');
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const sharp = require('sharp');

// Import Phosphor Duotone icons
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
    PiLayoutDuotone,
    PiCpuDuotone,
    PiHeartDuotone,
    PiPlanetDuotone,
    PiUserDuotone,
    PiPlantDuotone,
    PiChatCircleDuotone,
    PiPawPrintDuotone,
    PiCrownDuotone,
    PiAnchorDuotone,
    PiBoatDuotone,
    PiFishDuotone,
    PiCompassDuotone,
    PiWavesDuotone,
    PiSkullDuotone,
    PiBookOpenDuotone,
    PiEyeDuotone
} = require('react-icons/pi');

// Configuration for icons to generate
// Using Phosphor Duotone icons with PPT theme colors
const ICONS = [
    // Visang Presentation Icons (Blue Theme)
    { name: 'icon_target_blue', component: PiTargetDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_users_blue', component: PiUsersDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_database_blue', component: PiDatabaseDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_trending_up_blue', component: PiTrendUpDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_layers_blue', component: PiStackDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_check_circle_blue', component: PiCheckCircleDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_globe_blue', component: PiGlobeDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_book_blue', component: PiBookDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_award_blue', component: PiMedalDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_monitor_blue', component: PiMonitorDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_activity_blue', component: PiPulseDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_star_blue', component: PiStarDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_map_blue', component: PiMapTrifoldDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_zap_blue', component: PiLightningDuotone, color: '#3498DB', size: 128 },
    { name: 'icon_layout_blue', component: PiLayoutDuotone, color: '#3498DB', size: 128 },

    // The Little Prince Icons (Gold/Warm Theme)
    { name: 'icon_lp_star', component: PiStarDuotone, color: '#F1C40F', size: 128 },
    { name: 'icon_lp_heart', component: PiHeartDuotone, color: '#E74C3C', size: 128 },
    { name: 'icon_lp_planet', component: PiPlanetDuotone, color: '#F1C40F', size: 128 },
    { name: 'icon_lp_user', component: PiUserDuotone, color: '#F1C40F', size: 128 },
    { name: 'icon_lp_flower', component: PiPlantDuotone, color: '#E74C3C', size: 128 },
    { name: 'icon_lp_quote', component: PiChatCircleDuotone, color: '#F1C40F', size: 128 },
    { name: 'icon_lp_fox', component: PiPawPrintDuotone, color: '#D35400', size: 128 },
    { name: 'icon_lp_crown', component: PiCrownDuotone, color: '#F1C40F', size: 128 },

    // 20,000 Leagues Under the Sea Icons (Steampunk Gold Theme)
    { name: 'icon_20k_anchor', component: PiAnchorDuotone, color: '#D4AF37', size: 128 },
    { name: 'icon_20k_boat', component: PiBoatDuotone, color: '#D4AF37', size: 128 }, // Nautilus
    { name: 'icon_20k_fish', component: PiFishDuotone, color: '#D4AF37', size: 128 },
    { name: 'icon_20k_compass', component: PiCompassDuotone, color: '#D4AF37', size: 128 },
    { name: 'icon_20k_waves', component: PiWavesDuotone, color: '#D4AF37', size: 128 },
    { name: 'icon_20k_skull', component: PiSkullDuotone, color: '#D4AF37', size: 128 },
    { name: 'icon_20k_book', component: PiBookOpenDuotone, color: '#D4AF37', size: 128 },
    { name: 'icon_20k_eye', component: PiEyeDuotone, color: '#D4AF37', size: 128 }, // Observation

    // Generic/Legacy Icons (White/Cyan/Pink) - Updated to Phosphor
    { name: 'icon_target_cyan', component: PiTargetDuotone, color: '#00F0FF', size: 256 },
    { name: 'icon_target_pink', component: PiTargetDuotone, color: '#FF0055', size: 256 },
    { name: 'icon_cpu_white', component: PiCpuDuotone, color: '#FFFFFF', size: 256 },
    { name: 'icon_activity_white', component: PiPulseDuotone, color: '#FFFFFF', size: 256 },
    { name: 'icon_globe_white', component: PiGlobeDuotone, color: '#FFFFFF', size: 256 },
    { name: 'icon_brain_white', component: PiCpuDuotone, color: '#FFFFFF', size: 256 }, // Metaphor
    { name: 'icon_body_white', component: PiPulseDuotone, color: '#FFFFFF', size: 256 }, // Metaphor
    { name: 'icon_interaction_white', component: PiTargetDuotone, color: '#FFFFFF', size: 256 }, // Metaphor
    { name: 'icon_book_white', component: PiBookDuotone, color: '#FFFFFF', size: 256 }
];

const OUTPUT_DIR = path.resolve(process.cwd(), 'workspace/images');

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

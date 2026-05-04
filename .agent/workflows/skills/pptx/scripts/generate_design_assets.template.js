/**
 * generate_design_assets.js — AI Background & Design Asset Generator
 *
 * Uses OpenAI image models to generate slide backgrounds, section dividers,
 * bento grid textures, and draft-aware design layers for PPTX presentations.
 *
 * SETUP (once per machine):
 *   npm install openai sharp
 *   프로젝트 루트의 .env 파일에 API 키 입력:
 *     OPENAI_API_KEY=sk-...
 *
 * USAGE:
 *   node generate_design_assets.js                       # Generate all assets
 *   node generate_design_assets.js bg_cover              # Generate single asset
 *   node generate_design_assets.js slide01_visual_layer   # Generate draft-aware layer
 *
 * OUTPUT:
 *   All assets saved to OUTPUT_DIR (default: ../images/)
 *   Use full-slide transparent PNG overlays for complex IMAGE-2 design layers.
 *   These remain individually selectable/movable/deletable in PowerPoint.
 */

const OpenAI = require('openai');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ── .env 자동 로딩 (외부 패키지 불필요) ──────────────────────────────
// 프로젝트 루트의 .env 파일에서 환경변수를 읽어옵니다.
// node를 실행하는 디렉토리(보통 프로젝트 루트)에서 .env를 찾습니다.
(function loadDotEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !process.env[key]) process.env[key] = val;
  }
})();

// ═══════════════════════════════════════════════════════════════════════
// PROJECT CONFIG — customize these for each new project
// ═══════════════════════════════════════════════════════════════════════

const OUTPUT_DIR = path.resolve(__dirname, '../images');
const DRAFT_DIR = path.resolve(__dirname, '../drafts');

// AI Model Selection:
//   'gpt-image-2'  → OpenAI Image 2 (latest, highest quality, b64_json only)
//   'gpt-image-1'  → OpenAI Image 1 (previous generation)
//   'dall-e-3'     → DALL-E 3 (stable, URL or b64_json)
const MODEL = 'gpt-image-2';
const IMAGE_EDIT_MODEL = 'gpt-image-1.5';

// Size options:
//   gpt-image-2: '1536x1024' (landscape 16:9-ish), '1024x1024' (square)
//   gpt-image-1: '1536x1024' (landscape 16:9-ish), '1024x1024' (square)
//   dall-e-3:    '1792x1024' (closest to 16:9),    '1024x1024' (square)
const DEFAULT_SIZE = '1536x1024';

// Quality:
//   gpt-image-1: 'low' | 'medium' | 'high' | 'auto'
//   dall-e-3:    'standard' | 'hd'
const DEFAULT_QUALITY = 'high';

// ── Design System ─────────────────────────────────────────────────────
// Define your presentation's visual language here.
// Used as a consistent base across all asset prompts.
const DESIGN = {
  style: 'minimalist editorial dark',
  palette: 'deep black, charcoal grey, silver, crisp white',
  mood: 'sophisticated, modern, technical',
  // CRITICAL: Always include this to prevent text in generated images
  noText: 'NO text, NO words, NO letters, NO numbers, NO typography, NO labels',
  editableLayerRule: 'Generate clean visual objects only. No text. No labels. Preserve the wireframe layout intent. Keep transparent empty space where the layer should not appear.',
};

// ── Asset Definitions ─────────────────────────────────────────────────
// Define EVERY asset your presentation needs.
// name:    Output filename (without extension)
// prompt:  Image generation prompt
// size:    Override default size (optional)
// quality: Override default quality (optional)
const ASSETS = [

  // ── Cover / Title Background ────────────────────────────────────────
  {
    name: 'bg_cover',
    prompt: `${DESIGN.noText}.
      ${DESIGN.style} background for a presentation title slide.
      Abstract dark tech landscape: deep obsidian surface with extremely subtle perspective grid
      fading into the distance, a soft volumetric light beam from upper-left, microscopic
      digital fabric texture. Left 60% kept very dark for text placement.
      ${DESIGN.palette}. ${DESIGN.mood}.
      16:9 aspect ratio, photorealistic render, cinematic lighting, ultra high resolution.`,
  },

  // ── Draft-aware full-slide design layers ───────────────────────────
  // Optional but preferred for premium decks:
  // 1. Create a wireframe HTML slide with text and empty visual regions.
  // 2. Screenshot it to assets/drafts/slide01_draft.png.
  // 3. Add one or more transparent full-slide overlays below.
  // 4. Reference the generated PNG in HTML with data-pptx-layer="design".
  //
  // Example HTML:
  //   <img src="../images/slide01_visual_layer.png"
  //        data-pptx-layer="design"
  //        class="full-slide-layer" />
  //
  // CSS:
  //   .full-slide-layer {
  //     position:absolute; inset:0; width:100%; height:100%;
  //     object-fit:cover; pointer-events:none;
  //   }
  //
  // Keep this commented example and duplicate it per slide/region.
  /*
  {
    name: 'slide01_visual_layer',
    inputImage: 'slide01_draft.png',
    editModel: IMAGE_EDIT_MODEL,
    background: 'transparent',
    prompt: `${DESIGN.noText}. Using the attached full-slide wireframe as layout reference,
      create only the premium visual design layer for the empty/skeleton visual regions.
      Keep all text areas completely empty and transparent. Do not draw letters, numbers,
      labels, captions, fake UI text, or typography. Preserve the positions implied by
      the wireframe. Add sophisticated lighting, material depth, subtle shadows, and
      polished editorial composition. ${DESIGN.palette}. ${DESIGN.mood}.
      Output a full-slide transparent PNG overlay. ${DESIGN.editableLayerRule}`,
  },
  */

  // ── Section / Chapter Divider Backgrounds ───────────────────────────
  // Add one per major chapter/section in your presentation.
  // Keep left 55-60% dark for the chapter title text.
  {
    name: 'bg_section_1',
    prompt: `${DESIGN.noText}.
      ${DESIGN.style} full-bleed background for a chapter title slide.
      Theme: "Chapter 1 — Origins". Dark atmospheric: deep space-like environment,
      ancient codex or manuscript texture dissolving into modern grid lines,
      subtle warm amber light source from far right suggesting discovery/dawn.
      Left half: near-black for text. Right half: slightly lighter abstract texture.
      ${DESIGN.palette} with warm amber tones. ${DESIGN.mood}.
      16:9, cinematic composition, soft vignette, photorealistic.`,
  },
  {
    name: 'bg_section_2',
    prompt: `${DESIGN.noText}.
      ${DESIGN.style} full-bleed background for a chapter title slide.
      Theme: "Chapter 2 — Growth". Dark environment with flowing data streams,
      golden light threads suggesting movement and energy, interconnected network nodes
      visible in mid-distance, sense of acceleration and expansion.
      Left half: very dark for text. Right half: dynamic golden-white streams.
      ${DESIGN.palette} with golden/amber accents. ${DESIGN.mood}.
      16:9, wide cinematic, depth of field.`,
  },
  {
    name: 'bg_section_3',
    prompt: `${DESIGN.noText}.
      ${DESIGN.style} full-bleed background for a chapter title slide.
      Theme: "Chapter 3 — Modern Era". Dark background with modular geometric
      component boxes arranged like a bento grid in the distance, glowing electric blue
      outlines, sense of structured architecture and systematic design.
      Left half: solid dark for text. Right half: architectural component grid.
      ${DESIGN.palette} with electric blue accents. ${DESIGN.mood}.
      16:9, geometric precision, soft blue glow.`,
  },

  // ── Content Slide Backgrounds ────────────────────────────────────────
  {
    name: 'bg_content_light',
    prompt: `${DESIGN.noText}.
      Ultra-subtle background texture for a presentation content slide.
      Near-white surface: extremely faint paper grain texture, barely perceptible
      (#F8F8F8 to #FFFFFF color range), soft geometric mesh at 2-3% opacity,
      clean and professional. Must not distract from text content.
      Purely abstract, no shapes or objects. 16:9, ultra clean.`,
  },
  {
    name: 'bg_content_dark',
    prompt: `${DESIGN.noText}.
      Ultra-subtle background texture for a dark presentation content slide.
      Deep charcoal to near-black surface (#0D0D0D to #1C1C1C), very faint
      noise grain at 2% visibility, barely perceptible crosshatch pattern in
      very dark charcoal. Purely abstract minimal texture. Must not distract.
      16:9, nearly solid dark.`,
  },

  // ── Bento Grid / Card Backgrounds ────────────────────────────────────
  {
    name: 'bg_card_glass',
    prompt: `${DESIGN.noText}.
      Frosted glass texture for a UI card background.
      Translucent white frosted glass surface, soft blur bokeh behind glass,
      subtle light refraction creating a prismatic edge highlight,
      clean minimalist premium material. Color range: pure white to very light
      grey (#FAFAFA to #F0F0F0). Soft specular highlight on upper edge.
      Square 1:1 composition. Ultra clean product render style.`,
    size: '1024x1024',
  },
  {
    name: 'bg_card_dark',
    prompt: `${DESIGN.noText}.
      Dark premium card background texture for a UI component.
      Deep dark glass surface (#1C1C1E to #2C2C2E), microscopic brushed metal
      texture, extremely subtle diagonal grain, soft inner glow on edges
      suggesting a backlit display panel. Premium material, anodized metal feel.
      Square 1:1 composition. Dark luxury aesthetic.`,
    size: '1024x1024',
  },
  {
    name: 'bg_card_accent',
    prompt: `${DESIGN.noText}.
      Subtle accent card background for a highlighted UI element.
      Very dark navy to midnight blue gradient (#0A0F1E to #0D1B2A),
      microscopic horizontal scan lines at 3% opacity, soft blue-white inner
      glow at top edge. Premium tech aesthetic, like an OLED display bezel.
      Square 1:1 composition.`,
    size: '1024x1024',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// GENERATION ENGINE — do not modify below this line
// ═══════════════════════════════════════════════════════════════════════

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function resolveOutputSize(size) {
  const [w, h] = size.split('x').map(Number);
  // Normalize to exact 1920x1080 for 16:9, or 1024x1024 for square cards
  if (w === h) return { width: 1024, height: 1024 };
  return { width: 1920, height: 1080 };
}

async function generateAsset(asset) {
  const size = asset.size || DEFAULT_SIZE;
  const quality = asset.quality || DEFAULT_QUALITY;
  const model = asset.model || MODEL;
  const { width, height } = resolveOutputSize(size);

  const inputImagePath = asset.inputImage
    ? path.resolve(DRAFT_DIR, asset.inputImage)
    : null;
  const mode = inputImagePath ? 'edit' : 'generate';
  console.log(`  ${mode === 'edit' ? 'Editing from draft' : 'Generating'}: ${asset.name}.png  (${model}, ${size}, ${quality})...`);

  try {
    let response;
    if (inputImagePath) {
      if (!fs.existsSync(inputImagePath)) {
        throw new Error(`Input draft not found: ${inputImagePath}`);
      }

      const editModel = asset.editModel || IMAGE_EDIT_MODEL;
      const params = {
        model: editModel,
        image: fs.createReadStream(inputImagePath),
        prompt: asset.prompt.trim().replace(/\n\s*/g, ' '),
        n: 1,
        size,
        quality,
        output_format: 'png',
        background: asset.background || 'transparent',
        input_fidelity: asset.inputFidelity || 'high',
      };

      response = await openai.images.edit(params);
    } else {
      const params = {
        model,
        prompt: asset.prompt.trim().replace(/\n\s*/g, ' '),
        n: 1,
        size,
      };

      if (model === 'gpt-image-2' || model === 'gpt-image-1' || model === 'gpt-image-1.5') {
        params.quality = quality;
        params.output_format = 'png';
        if (asset.background) params.background = asset.background;
      } else {
        // dall-e-3
        params.quality = quality === 'high' ? 'hd' : 'standard';
        params.response_format = 'b64_json';
      }

      response = await openai.images.generate(params);
    }

    const b64 = response.data[0].b64_json;
    if (!b64) throw new Error('No image data in response');

    const imageBuffer = Buffer.from(b64, 'base64');
    const outputPath = path.join(OUTPUT_DIR, `${asset.name}.png`);

    await sharp(imageBuffer)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .png({ quality: 95, compressionLevel: 8 })
      .toFile(outputPath);

    console.log(`  ✓ ${asset.name}.png  (${width}x${height}px)`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${asset.name} — ${err.message}`);
    if (err.status === 400) {
      console.error(`    Content policy issue. Simplify the prompt or remove specific imagery.`);
    } else if (err.status === 401) {
      console.error(`    Invalid API key. Check OPENAI_API_KEY environment variable.`);
    } else if (err.status === 429) {
      console.error(`    Rate limit hit. Wait 60s and retry: node generate_design_assets.js ${asset.name}`);
    }
    return false;
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('\nERROR: OPENAI_API_KEY is not set.');
    console.error('  Windows: set OPENAI_API_KEY=sk-...');
    console.error('  macOS:   export OPENAI_API_KEY="sk-..."\n');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Support single-asset mode: node generate_design_assets.js bg_cover
  const targetName = process.argv[2];
  const toGenerate = targetName
    ? ASSETS.filter(a => a.name === targetName)
    : ASSETS;

  if (targetName && toGenerate.length === 0) {
    const available = ASSETS.map(a => a.name).join(', ');
    console.error(`\nAsset "${targetName}" not found.\nAvailable: ${available}\n`);
    process.exit(1);
  }

  console.log(`\nGenerating ${toGenerate.length} asset(s) → ${OUTPUT_DIR}/\n`);

  let success = 0;
  for (let i = 0; i < toGenerate.length; i++) {
    const ok = await generateAsset(toGenerate[i]);
    if (ok) success++;
    // Brief pause between requests to respect rate limits
    if (i < toGenerate.length - 1) {
      await new Promise(r => setTimeout(r, 800));
    }
  }

  console.log(`\n${success}/${toGenerate.length} assets generated.`);
  if (success < toGenerate.length) {
    const failed = toGenerate.filter((_, i) => !success).map(a => a.name);
    console.log('Retry individual assets:');
    toGenerate.forEach(a => console.log(`  node generate_design_assets.js ${a.name}`));
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

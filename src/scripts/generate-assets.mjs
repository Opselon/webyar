import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';

const ICON_SIZES = [64, 128, 256, 512];
const SOURCE_LOGO_PATH = './src/templates/images/logo.svg';
const ICONS_OUTPUT_DIR = './assets/icons/';
const MANIFEST_OUTPUT_PATH = './assets/manifest.json';

/**
 * Generates various sizes of PNG icons from the source SVG logo.
 */
export async function generateImages() {
  if (!existsSync(SOURCE_LOGO_PATH)) {
    console.error(`❌ Error: Source logo not found at ${SOURCE_LOGO_PATH}`);
    process.exit(1);
  }

  // Ensure the output directory exists
  if (!existsSync(ICONS_OUTPUT_DIR)) {
    mkdirSync(ICONS_OUTPUT_DIR, { recursive: true });
  }

  try {
    for (const size of ICON_SIZES) {
      const outputPath = `${ICONS_OUTPUT_DIR}logo-${size}.png`;
      await sharp(SOURCE_LOGO_PATH)
        .resize(size, size)
        .toFile(outputPath);
      console.log(`✅ Generated icon: ${outputPath}`);
    }
    console.log('🎉 All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating images:', error);
    process.exit(1);
  }
}

/**
 * Generates the manifest.json file for PWA support.
 */
export async function generateManifest() {
  const manifest = {
    name: "Modern SEO Services",
    short_name: "SEO",
    description: "A modern, fast, and SEO-optimized website for SEO services.",
    start_url: "/",
    icons: ICON_SIZES.map((size) => ({
      src: `/assets/icons/logo-${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose: "any maskable"
    })),
    theme_color: "#4f46e5",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "portrait",
  };

  try {
    writeFileSync(MANIFEST_OUTPUT_PATH, JSON.stringify(manifest, null, 2));
    console.log(`✅ manifest.json generated at ${MANIFEST_OUTPUT_PATH}!`);
  } catch (error) {
    console.error('❌ Error generating manifest.json:', error);
    process.exit(1);
  }
}

// Self-execution block to run functions from the command line
if (process.argv.includes('--run')) {
  (async () => {
    console.log('🚀 Starting asset generation...');
    await generateImages();
    await generateManifest();
    console.log('✨ Asset generation complete.');
  })();
}

/**
 * One-shot generator for the default Open Graph share card.
 *
 *   npm run generate-og
 *
 * Composes /public/images/og-default.png at 1200×630 — the standard
 * Twitter / Facebook / WhatsApp share-card size — with the new AG
 * logo on the left and the brand wordmark + tagline on the right.
 *
 * Re-run whenever the logo or tagline changes.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const root = path.resolve(dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_BOX = 460;

const log = (...args: unknown[]) => console.log("[og]", ...args);

async function main() {
  const logoPath = path.join(root, "public/images/logo.png");
  const outPath = path.join(root, "public/images/og-default.png");

  const logoBuffer = await fs.readFile(logoPath);

  const logoLayer = await sharp(logoBuffer)
    .resize(LOGO_BOX, LOGO_BOX, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const backgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fdfaf6"/>
      <stop offset="100%" stop-color="#f5e9dc"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.5" r="0.6">
      <stop offset="0%" stop-color="#f4d4c2" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#fdfaf6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="20" y="20" width="${WIDTH - 40}" height="${HEIGHT - 40}" rx="28" ry="28"
        fill="none" stroke="#c89aa1" stroke-opacity="0.35" stroke-width="1.5"/>
</svg>`.trim();

  const textSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <style>
    .eyebrow {
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      fill: #b07e85;
    }
    .title {
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      font-size: 78px;
      font-weight: 700;
      letter-spacing: -2px;
      fill: #2b1f23;
    }
    .accent {
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      font-size: 78px;
      font-weight: 700;
      font-style: italic;
      letter-spacing: -2px;
      fill: #b07e85;
    }
    .lede {
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      font-size: 28px;
      font-weight: 500;
      fill: #5b4046;
    }
    .footer {
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      fill: #6b4f56;
    }
    .hairline { stroke: #c89aa1; stroke-width: 1.5; stroke-linecap: round; }
  </style>

  <text x="540" y="170" class="eyebrow">A blog for her</text>

  <text x="540" y="280" class="title">Faith.</text>
  <text x="540" y="370" class="title">Sport.</text>
  <text x="540" y="460" class="title">Medicine.</text>
  <text x="540" y="550" class="accent">Life in between.</text>

  <line x1="540" y1="590" x2="700" y2="590" class="hairline"/>
  <text x="720" y="597" class="footer">aboutagirl.blog</text>
</svg>`.trim();

  await sharp(Buffer.from(backgroundSvg))
    .composite([
      { input: logoLayer, top: Math.round((HEIGHT - LOGO_BOX) / 2), left: 60 },
      { input: Buffer.from(textSvg), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  log(`wrote ${path.relative(root, outPath)} (${WIDTH}×${HEIGHT})`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

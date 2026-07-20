#!/usr/bin/env node
// Menu Sadah — client demo generator.
// Clones the flagship demo into a tailored per-prospect demo in seconds:
//   node kit/new-client.mjs --id noor --wordmark "نور" --name-en "NOOR" \
//     --palette oasis --wa 966512345678
// Output: <id>.html + <id>.webmanifest at the repo root
// (deploys as menu-sadah.com/<id>.html). Then hand-edit MENU/T for the
// prospect's real items — see TEMPLATE.md for the 30-minute playbook.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
}
const id = args.id;
const wordmark = args.wordmark;
const nameEn = args['name-en'] || (id ? id.toUpperCase() : '');
const palette = args.palette || 'majlis';
const wa = args.wa || '966500000000';

if (!id || !/^[a-z0-9-]+$/.test(id) || !wordmark) {
  console.error('usage: node kit/new-client.mjs --id <slug> --wordmark "<Arabic mark>" [--name-en NAME] [--palette majlis|oasis|rose] [--wa 9665XXXXXXXX]');
  process.exit(1);
}

// Palette presets — token values only; everything else derives from them.
// "majlis" is the flagship default (espresso + brushed gold), untouched.
const PALETTES = {
  majlis: null,
  oasis: { // deep date-palm green + celadon
    bg: '#101713', bg2: '#141C16', card: '#18231B', card2: '#1F2B22',
    ink: '#E7EFE8', ink2: '#C3CFC4', muted: '#85937F',
    gold: '#8FBF9C', gold2: '#B5DCC0', sand: '#A9C4A6',
    hair: 'rgba(143,191,156,.18)', hair2: 'rgba(143,191,156,.34)',
    'on-accent': '#12201A',
    glass: 'rgba(16,23,19,.72)', glass2: 'rgba(24,34,27,.78)', glass3: 'rgba(24,34,27,.9)',
    scrimc: 'rgba(6,10,8,.6)',
    glow: 'rgba(181,220,192,.35)', glow2: 'rgba(181,220,192,.8)',
    watermark: 'rgba(143,191,156,.045)', tint: 'rgba(143,191,156,.10)', tint2: 'rgba(143,191,156,.08)',
  },
  rose: { // Taif-rose copper on dark plum
    bg: '#191114', bg2: '#1E1418', card: '#241820', card2: '#2C1E27',
    ink: '#F1E6E9', ink2: '#D4C0C7', muted: '#A08691',
    gold: '#D89AA6', gold2: '#ECB9C3', sand: '#C9A2AB',
    hair: 'rgba(216,154,166,.18)', hair2: 'rgba(216,154,166,.34)',
    'on-accent': '#22141A',
    glass: 'rgba(25,17,20,.72)', glass2: 'rgba(35,23,29,.78)', glass3: 'rgba(35,23,29,.9)',
    scrimc: 'rgba(10,6,8,.6)',
    glow: 'rgba(236,185,195,.35)', glow2: 'rgba(236,185,195,.8)',
    watermark: 'rgba(216,154,166,.045)', tint: 'rgba(216,154,166,.10)', tint2: 'rgba(216,154,166,.08)',
  },
};
if (!(palette in PALETTES)) {
  console.error(`unknown palette "${palette}" — choose: ${Object.keys(PALETTES).join(', ')}`);
  process.exit(1);
}

let html = readFileSync(join(root, 'demo.html'), 'utf8');
const plainMark = wordmark.replace(/[ً-ْ]/g, ''); // strip harakat for the watermark

// 1. identity — the bare watermark div FIRST and exactly (a global 'وسم'
// replace would corrupt words containing it, e.g. 'موسم' → 'منور')
html = html.replaceAll('>وسم</div>', '>' + plainMark + '</div>')
  .replaceAll('مقهى وَسْم', 'مقهى ' + wordmark)
  .replaceAll('وَسْم', wordmark)
  .replaceAll('WASM Specialty Café', nameEn + ' Specialty Café')
  .replaceAll('WASM Café', nameEn + ' Café')
  .replaceAll('WASM', nameEn);

// 2. WhatsApp number
html = html.replaceAll('966500000000', wa);

// 3. namespaced storage keys (client demos share the menu-sadah.com origin)
html = html.replaceAll('"wasm-', `"${id}-`);

// 4. per-client manifest
html = html.replaceAll('href="manifest.webmanifest"', `href="${id}.webmanifest"`);

// 5. palette
const p = PALETTES[palette];
if (p) {
  for (const [token, value] of Object.entries(p)) {
    const re = new RegExp(`(--${token}:)[^;]+;`);
    if (!re.test(html)) {
      console.error(`token --${token} not found — demo.html tokens changed? aborting.`);
      process.exit(1);
    }
    html = html.replace(re, `$1${value};`);
  }
  html = html.replaceAll('content="#171310"', `content="${p.bg}"`);
}

writeFileSync(join(root, `${id}.html`), html);

const manifest = JSON.parse(readFileSync(join(root, 'manifest.webmanifest'), 'utf8'));
manifest.name = `مقهى ${wordmark} — ${nameEn} Café`;
manifest.short_name = wordmark;
manifest.start_url = `./${id}.html`;
if (p) { manifest.background_color = p.bg; manifest.theme_color = p.bg; }
writeFileSync(join(root, `${id}.webmanifest`), JSON.stringify(manifest, null, 2) + '\n');

console.log(`✔ ${id}.html + ${id}.webmanifest generated (palette: ${palette}, wa: ${wa})`);
console.log(`  URL after deploy: menu-sadah.com/${id}.html`);
console.log('  Now personalize MENU items + T.cafeName/tagline/story — see TEMPLATE.md');

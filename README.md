# Menu Sadah — Flagship Demo: مقهى وَسْم / WASM Specialty Café

The client-closing weapon. A bilingual (Arabic-first RTL + English) luxury e-menu demo
built from a 14-dimension global research swarm — Tokyo ordering tech, luxury hotel
in-room dining, Michelin storytelling, award-winning web design, QR-SaaS teardowns,
Gulf market compliance, menu psychology, and more. See `research/` for the full dossier.

## What's here

| File | What it is |
|---|---|
| `index.html` | **The flagship demo** — WASM Specialty Café, 8 chapters, ordering loop, WhatsApp checkout, bottom-sheet item details with Ichiran-style customization, SFDA calories/caffeine, provenance bean cards, Reserve block, sets & flights. Zero dependencies, self-hosted fonts. |
| `owner.html` | **The closer page** — fear-first pitch for cafe owners: PDF-vs-demo split with the live demo embedded, market ROI stats with attributions, the offer (1 month free → $49/mo), WhatsApp support proof, Monday analytics mock, 4-column comparison, founder close. Every CTA is a prefilled wa.me link. |
| `assets/fonts/` | Noto Kufi Arabic (display) + IBM Plex Sans Arabic (body), subset woff2, self-hosted — loads instantly on cafe Wi-Fi, no CDN. |
| `research/DOSSIER.md` | 167 research insights across 14 dimensions, with sources. |
| `research/SPEC.md` | The synthesized build spec ("Majlis at night" design system). |
| `BRIEF.md` | The mission brief this branch executes. |
| `manifest.webmanifest` + `sw.js` | PWA: add-to-home-screen + offline menu (the "works when the Wi-Fi doesn't" party trick). |

## Deploy

Static files — GitHub Pages, Netlify, Vercel, or any host. No build step.
For GitHub Pages: Settings → Pages → deploy from branch, root folder. Done.

## Before pitching a real client

1. **Replace the WhatsApp number** — search for `966500000000` (in `index.html` and
   `owner.html`) and put your real number.
2. Re-skin per client in minutes: colors live in the `:root` tokens at the top of each
   file; menu content lives in the `MENU` array in `index.html` (every string is
   `{ar, en}`); the wordmark وَسْم appears in the header, hero, and manifest.
3. The demo uses illustrated ambience (CSS/SVG) instead of photos — swap in the
   client's real photos per item for tailored demos (`artHtml` is the hook).

## Design system — "Majlis at night"

Espresso near-black ground `#171310`, brushed gold `#C9A25C` used only for hairlines,
prices, and badges, Diriyah-tan washes for ambience. Two families: Noto Kufi Arabic
(display) + IBM Plex Sans Arabic (body), Arabic set larger with line-height 1.75 and
zero letter-spacing. Three motion moves only: MORPH (sheets), RISE (scroll entrances),
SQUISH (press feedback) — all compositor-tier, with a full `prefers-reduced-motion` path.
Mood: % Arabica's Kyoto restraint wearing a Najdi arch, photographed after Isha.

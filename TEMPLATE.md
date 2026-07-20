# The 30-Minute Tailored Demo — playbook

The sales machine: a prospect sends their cafe name on WhatsApp → you send back
`menu-sadah.com/their-cafe.html` within the hour, in their identity. This file is
the assembly line.

## Step 1 — Generate (2 min)

```bash
node kit/new-client.mjs --id noor --wordmark "نور" --name-en "NOOR" \
  --palette oasis --wa 966512345678
```

- `--id` — URL slug (`menu-sadah.com/noor.html`), lowercase `a-z0-9-`.
- `--wordmark` — the Arabic mark used in the header, hero, cinematic intro and
  watermark. Short works best (2–4 letters reads like a brand).
- `--palette` — `majlis` (espresso + gold, the flagship), `oasis` (date-palm
  green), `rose` (Taif-rose copper). Palettes only swap `:root` tokens — every
  component follows automatically.
- `--wa` — the WhatsApp number that receives orders (the prospect's, or yours
  during the pitch).

The generator also namespaces localStorage keys per client, so multiple demos
on menu-sadah.com never share carts.

## Step 2 — Personalize content (20 min)

Open `<id>.html`, everything lives in three JS blocks near `/* ============ MENU DATA */`:

0. **Config consts** — `GOOGLE_PLACE_ID` (the cafe's Google Place ID; powers the
   post-order 4–5★ review deep link — find it via Google's Place ID finder). Until
   set, the demo shows a "simulated" toast instead. The WhatsApp number was already
   set by the generator.
1. **`T` strings** — `cafeName` (neighborhood line), `tagline`, `story`
   (the 2-line founder vignette — ask the owner one question on WhatsApp:
   *"who started the cafe, and why?"* — and write these two lines from the answer;
   this is the moment they melt), `ftAddr`, `ftHours`.
2. **`MENU` array** — swap items for their top sellers. Every string is
   `{ar, en}`. Per item: `tier` ("hero" = big arch card — max 6-8 per menu,
   "thumb" = small side art, "row" = type-only, "prov" = bean provenance card),
   `price` (bare round numbers), `kcal` (SFDA), `caf` (mg, drinks only),
   `allergens`, optional `badge` ("best"/"chef" — ONE of each per chapter, never
   more), `pairs` (cross-sell id), `custom` + `addons` (the upsell machinery).
3. **`CHAPTERS`** — rename chapters to their menu's shape; keep 5-7 items per
   chapter. Keep the qahwa heritage chapter if they serve Saudi coffee — it's
   the national-pride moment.

Art washes: each item's `art` key maps to a gradient in `ART` — pick the
closest hue or add one line. Real photos come later (after the photo-styling
session): `artHtml()` is the hook.

## Step 3 — QA + ship (8 min)

```bash
python3 -m http.server 8321
cd qa && node shoot.js "http://127.0.0.1:8321/noor.html?intro=0" out/noor
node probe-features.js  # once per big change; probes run against demo.html
```

Check the screenshots (AR + EN), push, send the link with a styled QR
(the acrylic-stand moment). Done — under 30 minutes.

## Rules that keep it premium (from research/SPEC.md)

- Arabic first, always; never machine-translate.
- One "Bestseller" + one "Chef's pick" per chapter, maximum.
- Photos on heroes and desserts only — photo-on-everything reads delivery-app cheap.
- Bare round numerals; VAT-inclusive; never "SAR 24.00".
- "Saudi coffee", never "Arabic coffee"; never the word "mocktail".
- Every demo gets the prospect's real bestsellers in chapter 1 — anchor first.

# HANDOFF — read this first in any new session

*Complete state transfer from the Operation Godzilla build session (2026-07-19).
A new Claude Code session on this repo should read this file, then `BRIEF.md`,
then `research/SPEC.md` before touching anything.*

## Who this is for

Bero — solo founder of **Menu Sadah** (menu-sadah.com), a micro-SaaS selling premium
digital e-menus to Gulf cafes. Sales motion: build a tailored, insanely polished demo
menu → offer 1 month free with 24/7 WhatsApp live edits → card-on-file paywall →
$49/month. Target: 100 clients ≈ $4,900 MRR. Communication style: high energy,
wants honest expert pushback, watch his weekly Fable/usage limits and offer
budget-conscious options ("Smart Godzilla mode" = full research/build quality but
single review pass instead of review swarms).

## What exists on this branch (`claude/menu-sadah-upgrade-1nsjdf`)

| Path | What it is | State |
|---|---|---|
| `index.html` | Flagship demo e-menu: **مقهى وَسْم / WASM Specialty Café** — fictional Riyadh specialty cafe. Arabic RTL-first + EN toggle, 38 cards / 8 chapters + sets, cart with WhatsApp checkout, draggable bottom sheets with priced customization, SFDA calories/caffeine, provenance bean cards, Reserve anchor block, chef's parade marquee, scroll-spy chip nav, daypart breakfast, PWA + offline SW. | Shipped. Review-fixed. QA CLEAN. |
| `owner.html` | The closer/pitch page: fear-first hero (blurry PDF vs live iframe demo), attributed ROI stats, 3-step offer, WhatsApp support proof thread, Monday analytics mock, 4-column comparison table, founder close. All CTAs are prefilled wa.me links. Bilingual. | Shipped. QA CLEAN. |
| `assets/fonts/` | Self-hosted subset woff2: Noto Kufi Arabic (display 500/700) + IBM Plex Sans Arabic (body 400/600 AR+Latin). | Final. |
| `research/DOSSIER.md` | 167 insights from a 14-dimension research swarm (Tokyo, hotels, Michelin, award sites, QR SaaS, Gulf market, coffee, bars/spas, UX evidence, menu psychology, Arabic RTL, motion, closing owners, performance) with sources. | Reference gold — reuse for pitch scripts. |
| `research/SPEC.md` | The synthesized build spec: "Majlis at night" design system, wow-in-30-seconds ranking, must-haves, full menu content plan, pitch page plan, anti-patterns. | The design constitution. Follow it for any change. |
| `BRIEF.md` | The mission brief (the user's original prompt, rebuilt). | Context. |
| `qa/shoot.js`, `qa/sections.js` | Playwright QA harness: device-true screenshots (iPhone 13 + desktop), console/pageerror/request-fail capture, horizontal-overflow detection, per-section shots, `--js` hook (e.g. `--js="window.setLang && window.setLang('en')"`). | Working. See "How to QA" below. |
| `sw.js` + `manifest.webmanifest` | Offline PWA. HTML is **network-first** (menu edits must reach returning customers instantly — core product promise); fonts cache-first. | Review-fixed. Do not revert to cache-first HTML. |

## History in 8 lines

1. Repo started EMPTY — the live menu-sadah.com was never reachable from the build
   environment (egress policy blocks it + all general web fetching; only WebSearch works).
   Everything here is a fresh build from research, NOT an edit of the live site.
2. 15-agent research workflow (14 dimensions + synthesis) produced DOSSIER + SPEC.
   It stalled once mid-run (session disconnect) and was resumed from its journal.
3. Built `index.html` then `owner.html` per SPEC, QA-ing each section in Chromium.
4. Iterated on real bugs found via screenshots: RTL glider over-constraint, art tiering,
   bidi flips ("+54%" → "54%+"), mid-smooth-scroll screenshots.
5. Adversarial review agent found **14 verified defects** (3 high: chip-nav misjump from
   content-visibility, milk surcharge missing from sheet price, saved-cart crash on
   removed items). ALL fixed; 6/6 regression probes pass.
6. 3 commits pushed. Working tree clean at handoff.
7. Live tracker artifact (user's account): https://claude.ai/code/artifact/523d9309-1a79-4c64-9539-5557e56d2692
8. Self-contained demo artifact (fonts inlined, private to Bero, updatable from any
   conversation by passing its URL to the Artifact tool):
   https://claude.ai/code/artifact/b0d650f7-9095-42d7-ab1e-39eecfc1a611

## OPEN ITEMS (the real todo list)

1. **Replace `966500000000`** (placeholder WhatsApp number) in `index.html` + `owner.html`
   with Bero's real number. Blocks everything customer-facing.
2. **Deploy**: GitHub → Settings → Pages → deploy from `claude/menu-sadah-upgrade-1nsjdf`
   → root. Then optionally point menu-sadah.com (or a subdomain like demo.menu-sadah.com).
3. **Real photography**: the demo uses crafted CSS/SVG ambience (network policy blocked
   fetching photos). For real client demos, swap per-item photos in — `artHtml()` in
   `index.html` is the hook; SPEC's photo-tiering rules apply (heroes + desserts only).
4. Per-client templatization workflow (SPEC nice-to-have): clone, re-skin `:root` tokens,
   swap `MENU` array + wordmark → a tailored demo in <30 min at menu-sadah.com/<cafe>.
5. Possible next builds (from SPEC nice-to-haves): Ramadan mode, loyalty ribbon,
   seasonal collections, real analytics, PageSpeed screenshot generator.
6. `sw.js` `SHELL` list pre-caches `./owner.html` — fine, but update the `CACHE` version
   string on any deploy that must bust old caches.

## How to QA (the OCD loop)

```bash
# serve the repo
python3 -m http.server 8321 &
# install harness dep (once per container)
cd qa && npm init -y && npm i playwright-core
# full check: console errors + overflow + screenshots, mobile + desktop
node shoot.js http://127.0.0.1:8321/index.html out-ar
node shoot.js http://127.0.0.1:8321/index.html out-en "--js=window.setLang && window.setLang('en')"
node shoot.js http://127.0.0.1:8321/owner.html out-owner
# per-section design review shots (forces RISE animations visible)
node sections.js http://127.0.0.1:8321/index.html out/s        # Arabic
node sections.js http://127.0.0.1:8321/index.html out/s en     # English
```
Chromium: use `executablePath: '/opt/pw-browsers/chromium'` (already in the scripts).
Known trap: `file://` breaks font CORS — always test over HTTP. Old-headless Chromium
enforces a 500px minimum window width.

## Hard-won rules (don't relearn these)

- **Design constitution = `research/SPEC.md`**, especially the anti-patterns list
  (no badge spam, no photo-on-everything, no letter-spacing on Arabic, no flags on the
  language toggle, "Saudi coffee" never "Arabic coffee", no mocktail wording, bare round
  numerals for prices).
- All strings are `{ar, en}` objects; `t()` resolves; `applyLang()` re-renders everything
  atomically and flips `dir`/`lang` on `<html>`. Never hardcode single-language UI text.
- Wrap mixed-direction tokens in `<bdi>` (menu) or `direction:ltr; unicode-bidi:isolate`
  (owner stats) — "+54%" and "12–16" flip in RTL otherwise.
- The glider/chip bar positions via physical `left:0` + `translateX(offsetLeft)` —
  do NOT add `inset-inline-start` (over-constrains in RTL; that was a real bug).
- `content-visibility:auto` on chapters broke first-tap scroll accuracy — it was removed;
  don't add it back. `.chapter{scroll-margin-top:118px}` compensates for sticky bars.
- Cart lines are `{sig, id, qty, unit, mods:[{nm:{ar,en}, p}]}` in `localStorage["wasm-cart"]`,
  filtered on load against `byId` — keep that filter; it protects returning customers
  after menu edits remove items.
- Option surcharges live in `CUSTOM.*.opts[].p` (data), and `sheetUnit()` must equal the
  charged unit — the button price and cart price must never diverge.

## One-tap kickoff prompt for the next session

> Read HANDOFF.md on branch `claude/menu-sadah-upgrade-1nsjdf` first, then BRIEF.md and
> research/SPEC.md. You're continuing the Menu Sadah mission exactly where the last
> session shipped. Honor the SPEC anti-patterns and the hard-won rules in HANDOFF.md.
> My priorities today: (1) ______ (2) ______ (3) ______.

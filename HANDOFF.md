# HANDOFF — read this first in any new session

*Complete state transfer, updated after the Round 2 session (2026-07-20).
A new Claude Code session on this repo should read this file, then `BRIEF.md`,
then `research/SPEC.md` before touching anything.*

## Who this is for

Bero — solo founder of **Menu Sadah** (menu-sadah.com), a micro-SaaS selling premium
digital e-menus to Gulf cafes. Sales motion: build a tailored, insanely polished demo
menu free → card on file unlocks 1 month free with 24/7 WhatsApp live edits →
**SAR 199/month flat** (v2 pricing since 2026-07-20 — never reintroduce $49/SAR 184).
Target perception: a $10M premium innovative e-menu design studio. Communication
style: high energy, wants honest expert pushback, watch his weekly Fable/usage limits
("Smart Godzilla mode" = full quality, single review pass instead of review loops).

## What exists on this branch (`claude/menu-sadah-upgrade-8iko8o`)

| Path | What it is | State |
|---|---|---|
| `index.html` | **Brand landing** (root of menu-sadah.com): cinematic wordmark hero, craft grid, PDF-vs-live split with demo iframe (#demo), 6 attributed ROI stats, SAR 199 offer steps (card-unlock framing), WhatsApp proof, analytics mock + triple-tap hint, comparison table, trust cards, founder close. Bilingual. | Shipped. QA CLEAN. |
| `demo.html` | **Flagship demo** — مقهى وَسْم / WASM Specialty Café. Everything from Round 1 (38+ cards, sheets w/ priced customization, WhatsApp cart, SFDA, provenance, Reserve, PWA offline) PLUS Round 2: Ramadan mode (crescent header btn / `?ramadan=1`), Summer Season limited chapter, loyalty stamps, dietary filters, A+/A− text cycle, kinetic titles, **Owner Mode cockpit** (triple-tap wordmark / `?owner=1` — live tap instrumentation, viewed bars, star matrix, hour heat, Monday insights), smart cart upsell w/ real swap math, "your usual" reorder strip, abandoned-cart rescue, post-order 5★ Google/WhatsApp routing, sheet close buttons (WCAG 2.5.7). | Shipped. Probes 20/20. |
| `owner.html` | Redirect stub → index.html (old shared links). | Final. |
| `kit/new-client.mjs` | Per-client demo generator: `node kit/new-client.mjs --id noor --wordmark "نور" --name-en NOOR --palette oasis --wa 9665...` → `noor.html` + `noor.webmanifest`. Palettes: majlis/oasis/rose. Namespaces localStorage per client. | Tested (incl. the موسم-corruption regression). |
| `TEMPLATE.md` | The 30-minute tailored-demo playbook. | Current. |
| `research/DOSSIER.md` | Round 1: 167 insights, 14 dimensions. | Reference gold. |
| `research/ROUND2.json` | Round 2 swarm synthesis: 101 insights → 10 ranked features, copy gold, **pitch ammo (sourced stats for sales scripts)**, warnings. | Features R5-R10 = next-session backlog. |
| `research/SPEC.md` | The design constitution ("Majlis at night"). Follow it for any change. | Unchanged, still law. |
| `qa/` | `shoot.js` (console/overflow/screens), `sections.js` (per-section shots), `probe-features.js` + `probe-wave2.js` (20 functional assertions). `cd qa && npm i playwright-core` once per container. | Working. |
| `sw.js` + `manifest.webmanifest` | PWA, CACHE **wasm-v2**, HTML network-first (never revert), start_url demo.html. | Current. |

## History in 6 lines

1. Round 1 (2026-07-19): research swarm → SPEC → flagship + owner page + QA harness; 14 review findings fixed; 8 commits.
2. Round 2 (2026-07-20): pricing/positioning v2 from Bero (SAR 199, $10M-studio brand). Restructure: demo→demo.html, landing takes root.
3. 10-dimension research swarm round 2 (101 insights; one relaunch — a mid-turn user message killed the first run's in-flight agents).
4. Built: landing rebuild, demo wave 1 (SPEC backlog), wave 2 (swarm picks R1-R4 + a11y), templatization kit.
5. QA caught real bugs: RTL specificity clash hid Arabic chapter titles; generator corrupted "موسم"; owner-mode bars had zero width. All fixed + regression-tested.
6. Adversarial review swarm ran over the full diff; confirmed findings fixed (see git log).

## OPEN ITEMS (the real todo list)

1. **Replace `966500000000`** (placeholder WhatsApp) in `index.html` + `demo.html` — blocks everything customer-facing. Set `GOOGLE_PLACE_ID` in demo.html per client too.
2. **Deploy**: GitHub → Settings → Pages → deploy from this branch → root. Point menu-sadah.com at it.
3. **Real photography** per client — `artHtml()` is the hook; SPEC photo-tiering rules.
4. Next-session build backlog (specs in `research/ROUND2.json`): R5 live drink-assembly preview in sheet, R6 split-the-bill calculator, R7 3-tap taste match, R8 orderable parade, R9 evening zero-proof bar chapter, R10 9:16 story-card share.
5. A11y round 3 (from swarm warnings): lang-of-parts spans for screen readers, focus trap for ownerView/sheets, Android back-button closes sheets (history.pushState), Android font-scale "Largest" test.
6. Marketing: pitch-ammo stats in ROUND2.json are sourced — use them in WhatsApp scripts.

## Hard-won rules (don't relearn these)

All Round-1 rules still apply (bdi isolation, glider physical-left, no content-visibility on chapters, cart filter against byId, sheetUnit === charged unit). New this session:
- **RTL cascade trap**: any `html[dir="rtl"] X` start-state rule outranks a plain `.x.in` reveal rule — match specificity (`html X.in`) and rely on source order. This bit us once already.
- **Generator string swaps must be exact-match anchored** (`>وسم</div>`) — bare 'وسم' corrupts 'موسم'. Same class of bug awaits any new global replaceAll.
- Inline spans animated with scaleX need `display:block;width:100%` or they have zero width.
- Triple-tap on the wordmark is RESERVED for Owner Mode (swarm warning: don't add more secret gestures).
- Review routing must keep the Google link visible at every star level (gating violates Google policy).
- localStorage loyalty/analytics are hospitality gestures, not accounting — keep the "محاكاة" framing honest.
- Toast z-index must stay above ownerView (98 > 96).

## How to QA (the OCD loop)

```bash
python3 -m http.server 8321 &
cd qa && npm init -y && npm i playwright-core   # once per container
node shoot.js http://127.0.0.1:8321/demo.html out-ar
node shoot.js http://127.0.0.1:8321/demo.html out-en "--js=window.setLang && window.setLang('en')"
node shoot.js http://127.0.0.1:8321/index.html out-landing
node sections.js "http://127.0.0.1:8321/demo.html?intro=0" out/s        # + 'en' arg for English
node probe-features.js && node probe-wave2.js                            # 20 assertions
```
Chromium at `/opt/pw-browsers/chromium` (already in scripts). Test over HTTP, never file://.
Feature params: `?intro=0` (skip intro), `?ramadan=1`, `?owner=1`.

## Live artifacts (Bero's account)

- Tracker: https://claude.ai/code/artifact/523d9309-1a79-4c64-9539-5557e56d2692
- Self-contained demo (Round 1 vintage): https://claude.ai/code/artifact/b0d650f7-9095-42d7-ab1e-39eecfc1a611

## One-tap kickoff prompt for the next session

> Read HANDOFF.md on branch `claude/menu-sadah-upgrade-8iko8o` first, then BRIEF.md,
> research/SPEC.md and research/ROUND2.json. You're continuing the Menu Sadah mission
> exactly where the last session shipped. Honor the SPEC anti-patterns and the
> hard-won rules in HANDOFF.md. My priorities today: (1) ______ (2) ______ (3) ______.

# Menu Sadah — Operation Godzilla: The Brief

*The original rushed prompt, rebuilt to the max. This is the spec this branch executes.*

## Mission

Menu Sadah (menu-sadah.com) is a solo-run micro-SaaS selling premium digital e-menus to Gulf cafes and restaurants. This build's single purpose: **a demo so impressive a Gulf cafe owner says yes within 30 seconds of scanning it.**

## The sales machine it feeds

1. Owner sees a tailored, insanely polished demo menu — their world, their language, their prices.
2. Offer: the menu is **free for 1 month**, with **24/7 WhatsApp support and live edits** — anything they need.
3. They pass through the paywall (card on file) for the free month.
4. The menu is so personal and so good that $49/month feels silly to cancel.
5. 100 clients × $49 = $4,900 MRR. Even at 70% retention, the machine works.

## Phase 1 — Global research swarm

Fourteen parallel researchers mining the world's best digital menu experiences:

| # | Dimension | What it mines |
|---|-----------|---------------|
| 1 | Tokyo / Japan | Izakaya & sushi-chain ordering tech, Japanese menu minimalism |
| 2 | Luxury hotels | In-room dining e-menus: Burj Al Arab, Ritz, Four Seasons, guest-app platforms |
| 3 | Michelin fine dining | Tasting-menu storytelling, provenance, chef narrative |
| 4 | Award-winning web | Awwwards / FWA / CSSDA restaurant winners' visual techniques |
| 5 | Global QR SaaS | me&u, sunday, FineDine, MENU TIGER, MyDigiMenu teardowns |
| 6 | Gulf / MENA market | Qlub, Foodics, local expectations, SFDA calorie law, VAT, halal |
| 7 | Specialty coffee | Saudi coffee boom, origins, brew methods, qahwa tradition |
| 8 | Bars & spas | Storytelling menus, naming patterns, mocktail presentation |
| 9 | UX evidence | QR-menu usability research, navigation patterns, accessibility |
| 10 | Menu psychology | Menu engineering, anchoring, description science, upsell |
| 11 | Arabic RTL | Arabic-first typography, bilingual patterns, Gulf luxury identity |
| 12 | Premium motion | Micro-interactions that read as a native luxury app |
| 13 | Closing owners | Restaurant-SaaS demo psychology, WhatsApp-first Gulf sales |
| 14 | Performance | Instant load on weak cafe Wi-Fi, PWA, Arabic font strategy |

All findings synthesized into one ranked build spec (`research/SPEC.md`), full dossier in `research/DOSSIER.md`.

## Phase 2 — The build

- **`index.html`** — the flagship: a bilingual (Arabic RTL-first + English) e-menu for a
  fictional premium Gulf specialty cafe. Luxury visual identity, buttery motion,
  self-hosted Arabic fonts, SFDA calorie display, SAR pricing, WhatsApp CTA.
  Static, zero build step, instant load, GitHub-Pages deployable.
- **`owners.html`** — the closer: pitches the offer (tailored demo, 1 month free,
  24/7 WhatsApp live edits, $49/month) to cafe owners, engineered from the
  closing-owners research.

## Phase 3 — Verify like OCD

- Headless-Chromium screenshot QA: mobile + desktop, Arabic + English, light + dark.
- Adversarial multi-agent code review (bugs, RTL correctness, a11y, speed); verified findings fixed.

## Constraints honored

- Static HTML/CSS/vanilla JS only — nothing to break, nothing to maintain.
- All fonts self-hosted (no CDN dependency, loads on weak cafe Wi-Fi).
- The live menu-sadah.com site was unreachable from this build environment
  (network egress policy), so this is a fresh flagship built from research —
  designed to be re-skinned per client in minutes.

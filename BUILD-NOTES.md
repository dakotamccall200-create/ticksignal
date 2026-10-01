# TickSignal MVP — Build Notes
**Date:** 2026-10-01 · **Status:** local demo only — not deployed, not published, no fundraising
**Location:** `~/workspace/public-research-project/mvp/site/`

## What was built
Pure static HTML/CSS/JS. Zero build step, no frameworks, mobile-first. Open `index.html` in any browser (or serve the folder with any static server). The only external dependency is Leaflet via CDN on the map page, with an automatic offline fallback to a data table.

## Page inventory
| Page | File | What it does | Data source |
|---|---|---|---|
| Home | `index.html` | "Is this tick dangerous?" hero → submit CTA → live counters (photos ID'd, AI accuracy, counties covered) | counters from `data/data.json` |
| Submit | `submit.html` | Mobile-first 3-tap wizard: photo → location → done. EXIF-strip note; GPS rounded to 0.1° in-browser and matched to nearest county; only county stored. Posts to a clearly-labeled **DEMO handler** (localStorage only) and shows the "what happens next" flow with a stub AI result | none (browser-local) |
| Map | `map.html` | Leaflet + OpenStreetMap, species filter, time slider (May–Sep 2026), toggle baseline vs community, county-aggregated pins only | `data.json` → `mapCounties` |
| AI Dashboard | `dashboard.html` | "Watch the AI learn": weekly accuracy line chart (hand-drawn on canvas, no libs), per-species confusion matrix, retraining log, data-quality notes, expert reviewer credits | `data.json` |
| Field Report | `report.html` | Weekly field report archive — one sample report in auto-generated style | `data.json` → `fieldReport` |
| Results | `results.html` | Prediction-vs-outcome transparency table: AI suggestion vs expert verdict, match/miss | `data.json` → `resultsHistory` |
| Learn | `learn.html` | Species guides (blacklegged, lone star, dog tick, Culex/Aedes mosquitoes) + prevention checklist + "if bitten" info-only section | static educational content |
| Funding | `funding.html` | Transparent ledger template (**$0 received — launch pending approval**), tiers $3/$8/$25 mo, what money buys, grant lane | static |
| About | `about.html` | Mission, method (the loop), the people (Dakota McCall, founder — Hastings, MI) | static |
| FAQ + Roadmap | `faq.html` | FAQ + public 6-phase roadmap | static |

**Shared assets:** `assets/styles.css` (all styling), `assets/data.js` (auto-generated from `data.json`, used as a fallback when `fetch` can't read the JSON — e.g. opening pages via `file://`), `data/data.json` (canonical sample dataset).

## What's real vs. sample
- **REAL:** the design, layout, privacy architecture (EXIF-strip + coarse-location logic is implemented in `submit.html` JS), the offline fallback, the chart-drawing code, the original SVG wordmark (tick + signal-wave motif), all educational species content (CDC/MDHHS-sourced general knowledge), the funding-ledger template and tiers, the roadmap phases.
- **SAMPLE (labeled everywhere):** every number — counters, accuracy chart, confusion matrix, retraining log, results rows, map pins, field report, reviewer statuses. County coordinates are approximate county centers. The "AI suggestion" on the submit page is a random stub clearly labeled as such, not a classifier.

## Ethical guardrails implemented (Appendix C)
1. "This is not medical advice — see a clinician" + CDC/Michigan DHHS links on index, submit result, map, dashboard, report, results, learn.
2. Coarse location only: JS rounds GPS to 0.1° (~11 km), keeps only county, discards the point; map is county-aggregated; no names anywhere.
3. Honest accuracy: sample data is labeled SAMPLE/BASELINE/DEMO; dashboard format shows misses, not just wins.
4. Expert gating is described as the live-system workflow; the demo never pretends AI output is confirmed.
5. Nothing published, no donations: funding page has an explicit NOT-COLLECTING banner and **no payment button or link**; local-only build.
6. Nothing looks like a live production service: every page carries a PRE-LAUNCH DEMO banner.

## What a launch would still need (founder approval gates)
1. **Real classifier** (dossier Days 1–5): public tick/mosquito training set, Colab baseline, honest published accuracy.
2. **Real backend**: intake API (EXIF strip, county coarsening server-side), Supabase/D1 submissions DB, photo storage, expert review queue UI.
3. **Expert validation lane**: recruit volunteer entomologists + Extension/public-health partners; list them with credentials.
4. **Real baseline data**: licensed MDHHS/CDC county surveillance baselines to replace the sample pins.
5. **Hosting**: GitHub/Cloudflare Pages (free tier) + ticksignal.org domain (name clearance is still a Phase-2 step — collision check found no tick app using the name, only unrelated code libraries).
6. **Fundraising gate**: founder approval → Open Collective / GitHub Sponsors ledger goes live; grant applications prepared.
7. **Legal review**: disclaimer wording, photo-license consent flow (CC-BY), privacy audit before any real submission is accepted.
8. **Pilot**: Michigan groups (admin permission only), 200+ real submissions, first real retrain; kill bar = real-photo accuracy <60% or zero expert volunteers.

## Launch entry — 2026-10-01
- Repo created: https://github.com/dakotamccall200-create/ticksignal (public, main branch)
- GitHub Pages enabled → https://dakotamccall200-create.github.io/ticksignal/ (verified HTTP 200)
- Launch edits: PRE-LAUNCH DEMO banners → PILOT banners (all SAMPLE/BASELINE/DEMO labels retained); funding page now links https://ko-fi.com/dakotamccall9 with required disclosure; tiers marked OPENING SOON; ledger $0.00 template.
- Ko-fi page captured from his onboarding email: https://ko-fi.com/dakotamccall9 — account exists, page uncustomized, PayPal link unverified (his tap).
- Interim home is the github.io URL; ticksignal.org domain still a Phase-2 step (name clearance pending).

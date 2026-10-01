# TickSignal Baseline Data — Sources

Date compiled: 2026-10-01 · TickSignal MVP (local demo, NOT published)

The map's **baseline layer** now uses real public surveillance data. The
**community layer** remains clearly labeled SAMPLE demo data.

## 1. County Lyme disease case counts (the map baseline)

**Source:** U.S. Centers for Disease Control and Prevention (CDC),
National Notifiable Diseases Surveillance System (NNDSS), Lyme disease
county-level public-use datasets on data.cdc.gov.

- 2022–2023 dataset: `x5j9-wybp` (queried 2026-10-01 via the public Socrata API)
- 2008–2021 dataset: `qtbi-xd4i` (used for 2020 and 2021 county totals)
- **Year used for the map baseline: 2023** (latest year with county-level
  data; the CDC states that more recent case counts are not publicly
  available at county level)

**What the numbers are:** reported Lyme disease cases (confirmed + probable),
by county of residence, aggregated across the dataset's sex / age / case-status
strata. Cross-check: CDC public-use total for Michigan 2023 = **1,150**,
vs. MDHHS's published 2023 total of **1,146** confirmed and probable cases —
consistent (see source 2).

**License/terms:** CDC data are U.S. federal government works — public domain,
free to use without permission.

**Key caveats:**
- CDC suppresses any sex/age/case-status stratum with fewer than 10 cases
  ("Suppressed"). County totals are therefore sums of non-suppressed strata
  and may slightly undercount true totals. In 2023, 67 Michigan cases
  (63 confirmed + 4 probable) were in suppressed strata statewide.
- In 2022, ALL Michigan county records were suppressed (small counts), so no
  2022 county numbers are available from this source. CDC also notes the 2022
  surveillance case-definition revision makes post-2022 counts not directly
  comparable with earlier years (lab-evidence-only reporting in high-incidence
  states produced roughly 3× the reported count of 2021 nationally).
- Cases are reported by the patient's county of residence, not necessarily the
  county where the tick bite occurred.
- 2020 and 2021 Eaton and Ionia values are unavailable (all strata suppressed);
  shown as `null`, meaning "fewer than 10 per stratum," not zero.

## 2. County population estimates (for incidence per 100,000)

**Source:** U.S. Census Bureau, Vintage 2023 County Population Estimates,
`co-est2023-alldata.csv`
(`https://www2.census.gov/programs-surveys/popest/datasets/2020-2023/counties/totals/co-est2023-alldata.csv`),
field `POPESTIMATE2023`.

**License/terms:** U.S. federal government data — public domain, free to use.

**Caveat:** 2023 incidence = (2023 reported cases ÷ 2023 estimated population)
× 100,000. Incidence reflects *reported* cases only; CDC estimates the true
number of Lyme infections is substantially higher (surveillance undercounts).

## 3. Michigan state context (not per-county, used for framing)

**Source:** Michigan Department of Health and Human Services (MDHHS),
*Michigan Emerging and Zoonotic Disease Surveillance Summary 2023*,
published November 2024
(`https://www.michigan.gov/emergingdiseases/-/media/Project/Websites/emergingdiseases/EZID_Annual_Surveillance_Summary.pdf`).

Verified figures from the report:
- Michigan Lyme cases: 424 (2019), 473 (2020), 877 (2021), 567 (2022),
  **1,146 (2023)** confirmed and probable.
- Five-year average county incidence (2019–2023), highest per 100,000:
  Dickinson 203, Baraga 76, Menominee 71, Iron 70, Ontonagon 61.
  (All 12 TickSignal demo counties are in the Lower Peninsula, below the
  report's top-5 list.)
- Lone star tick (*Amblyomma americanum*) is established in **Berrien County**,
  the only Michigan county with an established population.
- Citizen-submitted tick program, 2023: 1,005 ticks total (383 blacklegged,
  607 American dog tick, 15 lone star) from photos + mail.

**License/terms:** Public state government health report. Facts and figures
from it are free to cite and reuse with attribution; no special license is
stated. Source URL is recorded in each baseline entry.

## 4. What is NOT used

- CDC's 2000–2015 county XLS public-use file: available but too stale to use
  as a baseline (last updated for 2015).
- Project Tycho (University of Pittsburgh): CC-BY licensed and open, but
  requires a free account/API key for access — skipped per the project's
  no-account rule.
- MDHHS's categorical "Lyme Disease Risk Map" (updated March 2026): per-county
  risk classes (known/potential risk) exist, but the map form was not
  machine-extractable as numeric values, so it is referenced only as context.
- Third-party GitHub mirrors of CDC data (e.g. thisticksmeoff's
  `CDC_Lyme_County_Cases_2001-2023.csv`): provenance/licensing unverified —
  data was pulled directly from CDC's Socrata endpoints instead.

## Display bins (demo use only)

The map colors counties High / Moderate / Low based on 2023 incidence:
- High: ≥ 30 reported cases per 100,000 residents
- Moderate: 10 – 29.9 per 100,000
- Low: < 10 per 100,000

These cutoffs were chosen for the demo display only and are **not** an
official MDHHS or CDC risk classification.

## Usage rules for this baseline

- This is surveillance *context* for a research dashboard, never medical
  advice. Any display must keep the "not medical advice — see a clinician"
  disclaimer and link CDC/MDHHS.
- Do not present case counts as "your personal risk." Residence ≠ exposure
  location, and reported cases undercount true infections.

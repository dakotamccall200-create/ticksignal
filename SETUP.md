# TickSignal county alerts — setup & operations

**Status: FREE pilot.** Weekly "N new sightings in {County}" emails. No payment,
no paywall. Sighting counts only — never medical/risk advice, ever.

## What this is

- `alerts.html` — public signup: Michigan county dropdown (all 83) + email +
  plain-language consent. Writes one row per (email, county) to Supabase.
- `unsubscribe.html` — one-click unsubscribe via token link in every email.
- `alerts-schema.sql` — the `subscribers` table, RLS, and the unsubscribe RPC.
  **Must be run once in the Supabase dashboard (human step 1).**
- Weekly digest job — a scheduled agent task (already created): reads active
  subscribers + approved sightings from the last 7 days, emails each county's
  subscribers **only if that county had new confirmed sightings**. Zero new
  sightings = zero emails, always.

## Email rail: Gmail (chosen)

Evaluated honestly:
- **Resend / Brevo / Mailgun free tiers** — genuinely free at this volume, but
  each needs a new account + domain verification + API key. Human signup work.
- **Supabase Auth emails** — not for bulk digests; wrong tool.
- **Gmail (connected skill), sent from dakotamccall200@gmail.com** — $0,
  zero new accounts, zero setup, already authorized for sends. Volume is tiny
  (niche pilot; Gmail allows ~500/day). **This is the rail.**

If the list ever outgrows Gmail comfort (~hundreds of subscribers), the swap
is one line in the digest job: switch the send step to a Resend/Brevo free-tier
key. That signup becomes the human step *then*, not now.

## HUMAN STEPS (Dakota — ~5 minutes total, then you're done)

### Step 1 — create the subscribers table (one paste)
1. Open https://supabase.com/dashboard → your TickSignal project
   (`dxkdpysvpicfjpawtyoo`).
2. Left sidebar → **SQL Editor** → **New query**.
3. Open `alerts-schema.sql` from this repo, copy the whole file, paste it in,
   click **Run**.
4. Success looks like: "Success. No rows returned." (It creates the table,
   RLS policies, and the unsubscribe function.)

### Step 2 — hand the digest job its key (one copy-paste, in chat)
1. Same Supabase dashboard → **Project Settings** (gear icon) → **API**.
2. Under "API Keys", click **Reveal** next to the `service_role` key
   (labeled *secret* — NOT the anon key) and copy it.
3. In chat, tell the main agent: *"store this in the Secure Vault as
   ticksignal-supabase-service-role"* and paste the key.
4. That's it — the weekly digest reads the key from the vault at runtime.
   It never goes into the repo, the site, or any email.

Nothing else needs you. Signup page, unsubscribe, and the weekly digest all
run themselves after these two steps.

## What runs autonomously after setup

**Cron: `ticksignal-alerts-digest`** — every Monday ~8:00 AM ET:
1. Read `ticksignal-supabase-service-role` from the Secure Vault.
2. `GET /rest/v1/subscribers?select=email,county,unsubscribe_token&active=eq.true`
   (service_role bypasses RLS — emails never touch the browser).
3. `GET /rest/v1/sightings?select=county,ai_prediction&status=eq.approved&created_at=gte.<7d ago>`.
4. Group by county. For each county with ≥1 new approved sighting AND ≥1
   active subscriber, send one email per subscriber via the Gmail skill:

   > **Subject:** TickSignal: 4 new tick/mosquito sightings in Barry County this week
   >
   > 4 newly confirmed sightings in Barry County in the last 7 days:
   > – Blacklegged tick (Ixodes scapularis): 3
   > – American dog tick (Dermacentor variabilis): 1
   >
   > See them on the public map: https://dakotamccall200-create.github.io/ticksignal/map.html
   >
   > This is a sighting-count notification only — not medical advice, and not
   > an assessment of your personal risk. Bitten? See a clinician: CDC
   > (cdc.gov/ticks) · Michigan DHHS.
   >
   > You're getting this because you signed up for free Barry County alerts.
   > Unsubscribe anytime (one click): <unsubscribe link with token>

5. Counties with no new sightings → no email. No exceptions.

## Privacy & safety rules (non-negotiable)

- Subscriber emails are readable ONLY with the service_role key, server-side.
  The anon key can insert a signup row and call the unsubscribe RPC — nothing else.
- Alerts contain county-level counts + species names + map link. No addresses,
  no GPS, no names, no "you are at risk" language, no medical advice.
- Every email carries the one-click unsubscribe link.

## Paid tier — later (NOT built now)

When the free list is big enough to monetize, the slot-in is:
1. Dakota creates a **Ko-fi Membership tier** ($3–5/mo) at ko-fi.com/dakotamccall9
   (only he can configure payouts — PayPal already connected).
2. Swap the signup flow: after Ko-fi checkout, subscriber confirms via the
   existing email field (match on email), or gate digests to
   `paid=true` rows (add the column then).
3. Free subscribers keep getting alerts until he says otherwise — no rug-pull.

Deliberately not built yet: zero subscribers → a paywall earns $0 and adds
friction. Build the list free first.

## End-to-end test (run after the two human steps)

1. Sign up a test address for a test county on the live alerts page.
2. Confirm the row appears in `subscribers` (via service_role read).
3. Trigger the digest logic manually for that county (or wait for Monday).
4. Confirm the email arrives with correct count, species, map link, and a
   working one-click unsubscribe.
5. Click unsubscribe, confirm `active=false`, then delete the test row.

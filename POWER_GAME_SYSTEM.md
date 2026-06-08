# The Power Game — signup, placement & booking system

Built locally on branch **`power-game-system`**. A player applies, the scoring engine
places them into the right ability×age squad, they pick a time and pay — spots fill in
real time and the bar protects each squad's standard.

## How it works (the funnel)

`/PGP2026/apply` → **pick centre → player & DOB → profile (skills) → playing history (7 Qs)
→ ✨ reveal → choose time (live spots) → pay → confirmed**

- **Placement is a router, not a gate.** Every applicant is placed at the right level
  (Performance / Pathway) — nobody "of standard" is turned away; only genuine below-floor
  cases go to a soft **coach-review** path (no payment taken).
- **Quality is automatic** — players only ever see their own stream's squads.
- **Safeguarding** — a younger gun may *play up* one age band, but is **never auto-mixed**
  into the open 17+ adult band; that routes to coach review.

## Architecture

| Layer | Files | Notes |
|---|---|---|
| **Scoring engine** | `src/lib/scoring/engine.ts`, `benchmarks.ts` | Vendored **verbatim** from the Elite Player Portal (`induction-1.0`). Pure, no I/O. Keep in sync via `engineVersion`. |
| **Competition ladder** | `src/lib/scoring/ladder.ts` | 95-comp CTI ladder, auto-generated from portal migration `032_v2_reference_ladder.sql`. |
| **Placement guardrail** | `src/lib/scoring/guardrail.ts` | Power Game bands (12-14 / 14-16 / 17+), tier→stream mapping, play-up + minor-safeguarding rule. |
| **Inventory / booking** | `src/lib/booking/squads.ts`, `inventory.ts` | 12-squad grid (2 centres, 128 spots). Atomic holds — no oversell. |
| **Applications / payment** | `src/lib/booking/applications.ts` | Records + `confirmPowerGameBooking` (store-agnostic). |
| **Funnel UI** | `src/components/power-game/apply/ApplyFlow.jsx`, `DnaRevealCard.jsx` | Multi-step, framer-motion, mobile-first. |
| **Dev/ops** | `PlacementPlayground.jsx`, `PowerGameSquads.jsx`, `PowerGameSuccess.jsx` | |
| **Server (Vercel)** | `api/power-game-checkout.js`, `api/power-game-webhook.js` | Stripe Checkout + confirm webhook. |
| **DB** | `supabase/migrations/20260608000000_power_game_booking.sql` | `pg_centres/squads/applications/bookings` + advisory-locked `pg_create_hold` RPC. |

## Routes

- `/PGP2026/apply` — the funnel (live `?demo=perf|review|soldout` QA deep-link)
- `/PGP2026/apply/success` — Stripe return page
- `/PGP2026/admin` — squad fills + coach review queue (local/dev; **secure before prod**)
- `/PGP2026/playground` — engine placement playground (dev)

## Run it

```bash
npm run dev        # http://localhost:5173/PGP2026/apply
npm test           # 111 tests across 11 files
npm run build
```

## Test coverage (111 tests)

- **Engine zero-drift** — the portal's own suites pass identically here.
- **Stress** — 15,200 synthetic applicants, 0 invariant violations (never demoted, no minor
  in the adult band, below-floor always → review, play-up ≤1 age-adjacent band).
- **Blind study** — 18 hand-reasoned Victorian profiles all place as expected (`blind-study-pg.test.ts`).
- **Booking** — 50 racing buyers → exactly 10 win, no oversell; holds expire/confirm/release.
- **Funnel e2e (jsdom)** — real journey + happy/review/sold-out paths.
- **Calibration report** — prints how gendered comps land (`calibration.test.ts`).

## Open decisions for Alex (flagged, not assumed)

1. **Gender CTI calibration** — the ladder rates **Women's Premier 1st = T5 Elite** and
   **Marg Jennings = T3**, both a notch *above* your verbal anchors ("W-Prem-1st ≈ M-Prem-3rd",
   "Marg Jennings ≈ boys U14 VMCU"). Confirm the ladder or lower P1F→~0.75 / P15F→~0.50.
2. **Adult `age_outlier`** — a 30yo in a lower grade trips the age-outlier review flag because
   the 17+ band is open-age. Decide whether to suppress age_outlier inside the 17+ band.
3. **Eligibility floor** — currently rep cricket (CTI ≥ 0.40) auto-places; club-only → review.
   Lower it if you want Pathway to sell to strong club players.
4. **Venue street addresses** — `squads.ts` / migration have placeholders for The Netz & Elite Cricket Centre.
5. **Tier→stream cut** — Performance = T4–5, Pathway = T2–3, T1/below-floor → review (tunable).
6. **Before production** — set `VITE_PG_LIVE_PAYMENTS=1` + Stripe/Supabase env, point a Stripe
   webhook at `/api/power-game-webhook`, apply the migration, secure `/PGP2026/admin`, and
   remove the `?demo=` deep-link.

*Mickleham was left out per the 2-centre assumption — re-add to `squads.ts` + the seed when ready.*

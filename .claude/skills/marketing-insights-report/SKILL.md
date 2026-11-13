---
name: marketing-insights-report
description: "Read-only Marketing Director reports for RRA Melbourne, in the style Andy approved (Elite T20 Purchase Timing, Nov 2026). Builds a dashboard of when families bought a program (spikes, payment type, weekday and hour), where they travelled from (map with drive-time rings to each centre) and which centre they would likely have chosen, plus contact lists for campaigns. Trigger on 'when did people buy', 'purchase timing', 'sales spikes', 'where do our families come from', 'catchment', 'would they join another centre', 'map of players', 'contact list for a campaign', 'who should we email about', or any marketing question about program sales, enquiries or participants."
---

# Marketing insights report (purchase timing + catchment)

Andy, 13 Nov 2026, on the Elite T20 Purchase Timing dashboard: *"I thought it was brilliant ... please make sure you store that style. I love the maps."*
This skill is that style. The worked example is https://claude.ai/artifact/VEogomfYhLZLCQ31KoueKW, and its code is in `reference/`.

## Role and rules

- **Read-only.** Only `SELECT` queries on Supabase and read calls on Stripe. Never insert, update, migrate, refund or send. If a record is wrong (a missing suburb, say), tell Andy who should fix it.
- **Don't keep asking Andy for access.** Use the Supabase and Stripe access this session has. Don't build a dashboard that makes every viewer approve a database connection: for a program that has finished, save the rows as fixed JSON files in the dashboard (no names, emails or phones). Only use live queries when the program is still selling and Andy wants it to update.
- **Reconcile with Stripe.** `program_registrations` lags Stripe (it stopped on 30 Oct 2026 when last checked). For anything recent, read Stripe Checkout Sessions directly and match by email, then name.
- **Consent.** Mark every contact list as *opted-in* (an `accept_marketing` / `marketing_opt_in` / `consent_contact` column) or *inferred* (an existing customer or enquirer). `accept_social_media` is photo consent, not marketing consent. Leave out test records, withdrawn players and anyone flagged internal (James Crook).

## Where the data is

| Need | Table |
|---|---|
| One row per child, all programs | `rra_players_master`, `rra_program_participation` (rebuilt 6 Aug 2026, so newer sign-ups are only in their own tables) |
| Paid programs, synced from Stripe | `program_registrations` (`program` = elite, holiday, junior_royals, female_kickstart, …; `paid_at`, `program_label`, `amount_total_cents`, `customer_email`) |
| Elite 2026 roster | `elite_program_2026_roster` (+ `rra_roster_overrides` for withdrawn/injured) |
| Elite applications | `applications` where `program` and `program_type` are both null |
| Leads and enquiries | `crm_leads`, `performance_squad_leads`, `general_enquiries`, `upcoming_program_interest`, the waitlist tables |

The Supabase MCP tool wraps rows in a text answer with `<untrusted-data-…>` tags, and the warning sentence above the rows mentions the same tag. Parse the rows from the **last** opening tag before the closing tag (see the loader in `reference/catchment.js`), never the first match.

## How a purchase is counted

- **One-time payment:** the day it was paid (Melbourne time, `paid_at at time zone 'Australia/Melbourne'`).
- **Subscription (e.g. Flexi 4-payment):** only the first payment, the day the subscription was taken out. Later instalments are left out. In `program_registrations` each subscription appears once, from its checkout session.
- **Payment plans and special deals** (deposit plans, tailored, subsidised, ambassador one-offs) are a third group, shown separately.
- Siblings paid for separately count as separate purchases. Say so.

## The dashboard (Data artifact type)

Build it with the Artifact tool from the Data type, and write it through its store. Keep this order and these parts:

1. **Title and one-sentence finding** under it, with each number drawn from the data (e.g. "32 of the 90 first purchases landed in the first three days, and 49% were made between 6pm and midnight").
2. **Tiles:** total first purchases, paid in full, subscriptions started, plans/deals, collected at first purchase.
3. **First purchases per day:** stacked bars (paid in full / subscription first payment / plan), every calendar day shown including zeros, a tooltip per day, and a label on the peak day. Name the busiest day above the chart.
4. **Applications per day on the same dates** underneath, in a muted colour, so spikes can be compared.
5. **By day of week** and **by hour of day** side by side, with values printed on the bars.
6. **Busiest days table.**
7. **Catchment section:**
   - A sentence giving how many players would have had another centre at least 10 minutes closer, and how many drove over 45 minutes.
   - A tile per centre (players, average drive there against the drive to the current centre).
   - A **map:** suburb dots sized by players, coloured by likely centre, centres as diamonds, dashed **30-minute rings**, "Port Phillip Bay" and "CBD" labels, and regional towns listed under it.
   - A **running-total line chart** of when each centre's group bought.
   - A **suburb table** with drive minutes to every centre.
8. **A closed "How purchases are counted" note** at the foot covering the sources, the payment groups, the location method and the drive-time formula.

Plain English, Melbourne dates (`Tue 3 Mar`), AUD, no jargon. Charts follow the type's theme tokens and `dash.colors` (0 = current centre / paid in full, 1 = Ravenhall / subscription, 2 = Hallam / plan).

## Locations and drive times

- Suburb comes from the roster, then `rra_players_master`, then the club's suburb. Clean messy values (postcodes, full addresses, typos) through the place → suburb list in `reference/suburb_coordinates.csv`, and add any new suburb to it.
- Coordinates are approximate suburb centres. Label that dataset "Sample: estimated …" and say so on the page.
- **Drive-time estimate** (routing services are blocked from cloud sessions): road km = 1.3 × straight-line km. Minutes = 6 + 1.2 per km for the first 25 road km + 0.75 per km after that.
- A family counts against another centre only if it is **at least 10 minutes closer** than the one they used.
- Centres currently placed at suburb centres: Bundoora (Cutting Edge), Ravenhall, Hallam. Mickleham and Williamstown also run programs, so add them when the question is about them. Swap in exact venue addresses when Andy supplies them.

## Ideas Andy wants next

- **Overlay the Indian diaspora:** ABS Census 2021 by suburb (SAL), using people born in India and Indian ancestry (tables G09 and G08), as a shaded layer under the player dots. abs.gov.au is blocked from cloud sessions, so ask for a CSV export from ABS TableBuilder or QuickStats, or for `www.abs.gov.au` / `data.api.abs.gov.au` to be added to the environment's network allowlist. Don't type census figures from memory.
- The same report for Junior Royals, Power Game and holiday programs, so launches can be compared.

## Hand-over

Give the link, the three or four findings that matter for marketing (timing, payment option effect, catchment), what is estimated, and anything only Andy can supply. Keep it short, and don't ask permission for routine reads.

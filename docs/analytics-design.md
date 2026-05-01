# Analytics — Design & Roadmap

Branch: `feature/admin-restructure`
Owner: Alex Lewis
Drafted: 2026-05-02

This doc lays out the analytics vision for the RRA Melbourne admin dashboard so a data analyst (or future build agent) can pick it up cleanly. It covers the questions analytics should answer, the visualisations that fit, the live-sync strategy, the data sources we already have, and a phased roadmap from today's state to the full vision.

---

## 1. Audience

Two readers, two different needs:

| Reader | What they need from analytics |
|---|---|
| **Academy leadership** (Alex, Andy, Director) | Strategic — where to invest, where demand is growing, which programs are converting. Decisions about *next* programs. |
| **Coaches / ops** | Tactical — who's coming, who's missed sessions, who's at risk of dropping out. Decisions about *this week*. |

Visualisations should be glanceable enough that leadership absorbs the picture in seconds; deep-dive panels for ops that want to act on a single name.

---

## 2. The questions analytics should answer

Tier 1 — answers leadership keeps coming back to:

1. **Where do our paying members live?** (Map, by suburb. Hot-spots = where to recruit harder; cold-spots = where to test new programs.)
2. **Where do inquiries come from but NOT convert?** (Map, suburb-level inquiry-to-paid %. The gap is where the funnel is leaking.)
3. **Which programs are growing?** (Time series — paid registrations per program per week.)
4. **What's our inquiry → paid conversion rate, by program?** (Funnel chart. If Holiday converts at 60% but Elite at 12%, that tells us where the messaging fits.)
5. **What's the demographic mix?** (Age, gender, club background — by program.)
6. **What's revenue per program, per month?** (Bar chart with payment-type stack — see how much is one-off vs Flexi.)
7. **Which marketing channels (UTM source/campaign) bring qualified leads?** (Bar chart: UTM source → conversion %.)

Tier 2 — useful but secondary:

8. **Repeat-customer rate** — % of paying members in 2+ programs (Junior → Elite pipeline)
9. **Time-from-inquiry-to-payment** — distribution per program
10. **Drop-out signals** — players who paid but haven't logged a session attendance recently (needs attendance data feeding in)
11. **Capacity utilisation** — paid registrations vs program capacity per cohort
12. **Coach allocation efficiency** — sessions per coach per week

---

## 3. Visual recommendations (per question)

| Question | Visualisation | Why |
|---|---|---|
| 1, 2 | **Choropleth or bubble map** of Melbourne suburbs | Geography is the most useful dimension here, and a map is recognisable in 1 second. |
| 3 | **Stacked area chart** — one stream per program, x = week | Shows growth + program mix simultaneously. |
| 4 | **Funnel chart** — Inquiries → Qualified → Paid → Repeat | The drop-off between stages is the actionable insight. |
| 5 | **Grouped bar chart** — age buckets × program | Easy comparison across programs. |
| 6 | **Stacked bar** per month — payment-type as stack segments | See revenue + payment plan adoption together. |
| 7 | **Sortable table + sparkline** per UTM source | Marketers want to compare sources side-by-side; a sparkline shows trend without crowding. |
| 8 | **Sankey diagram** — Junior → Elite, Holiday → Junior, etc. | Shows the *flow* between programs. |
| 9 | **Box-and-whisker** per program | Median + spread of conversion times. |
| 10 | **Risk-flag list** with last-attended days | Just a sortable list — no chart needed. |
| 11 | **Capacity gauge** per cohort | A semi-circle gauge with a fill bar. |
| 12 | **Heatmap** — coaches × weeks | Quick visual scan of imbalanced load. |

---

## 4. Tech stack

**Already installed:**
- [`recharts`](https://recharts.org/) for line / bar / area / pie charts
- [`react-leaflet`](https://react-leaflet.js.org/) + [`leaflet`](https://leafletjs.com/) for maps

**To add (when needed):**
- A small Melbourne suburb → lat/lng lookup, OR a Vic GeoJSON for choropleth (free from data.gov.au)
- For Sankey: `recharts` doesn't ship one — `@nivo/sankey` is the cleanest add when we need it

**No SaaS analytics tool needed** — Supabase is the warehouse, the dashboard reads it directly. PostHog stays for product analytics (page views, button clicks); Supabase analytics covers the business questions.

---

## 5. Live-sync strategy

Three patterns, picked per widget:

1. **One-shot fetch on mount** — fine for slow-changing data (revenue per month, demographic mix). Cheapest, simplest.
2. **`useRealtimeSync` hook (already exists)** — Supabase Realtime subscription that re-fetches on INSERT/UPDATE. Use for things that change during the day (new inquiries, payments). Already used by `AnalyticsPanel.jsx`.
3. **Polling every N minutes** — for aggregates that are too expensive to recompute on every change. Start at 5-min intervals; tune later.

For the Melbourne map specifically: refetch on Realtime updates to `crm_leads` and `program_registrations`. Bubble sizes update without a page reload.

---

## 6. Data sources we already have

| Source | What it gives us |
|---|---|
| `crm_leads` (584 rows) | Inquiries — name, email, suburb, club, source, stage, UTM, age |
| `program_registrations` (247 rows) | Paid Stripe payments — program, amount, payment_type, paid_at |
| `shop_orders_training` / `shop_orders_ipl` | Shop revenue + customers |
| `applications` (624 rows) | Elite-Program applicants (for the Selection / Pipeline workflow) |
| `pipeline_entries` (624 rows) | Selection pipeline state per applicant |
| `attendance` (currently empty) | Will become the source for engagement / drop-out analytics |
| `players` (98 rows), `sp_players` (85 rows) | Player roster (for engagement analytics) |
| `page_analytics` (155K rows) | Site behaviour — which pages drive inquiries |

---

## 7. Roadmap (phased)

**Phase 0 (this branch) — Foundations.** Done in this work:
- New top-level **Analytics** sidebar item already exists (`Funnel & Demographics`).
- Add a **Melbourne Inquiry Map** widget (Tier 1 Q1+Q2) — see `MelbourneInquiryMap.jsx` shipped on this branch.
- Existing `AnalyticsPanel` continues to render age / suburb / pipeline charts.

**Phase 1 — Tier 1 questions.** ~1 week of analyst work:
- Stacked area: paid registrations per program per week (Q3)
- Funnel chart: inquiry → paid % per program (Q4)
- Revenue stacked bar: by month, payment-type stacked (Q6)
- UTM sortable table + sparklines (Q7)

**Phase 2 — Cross-program flow.** ~3 days:
- Repeat-customer Sankey: which programs feed which (Q8)
- Time-from-inquiry distribution per program (Q9)

**Phase 3 — Engagement / risk.** Blocked on attendance data flowing in:
- Risk-flag list (Q10)
- Capacity gauges (Q11)
- Coach load heatmap (Q12)

**Phase 4 — Polish.** Print-friendly export of leadership dashboards, scheduled weekly email digest of headline metrics.

---

## 8. What good looks like

- **Leadership opens the dashboard in the morning.** They see four things at a glance: this week's new paying members, this week's revenue, the Melbourne map (any new hot spot?), and the inquiry → paid conversion trend.
- **They click into a map cluster.** The right-hand panel shows: 14 inquiries from this suburb in the last 90 days, 3 of them paid (21%), here's the list with stages.
- **They form a hypothesis.** "We get lots of Bundoora interest but only convert one in five — let's run a Bundoora-only Holiday Program in the next school break."
- **They schedule it.** Two weeks later, they look back at the same dashboard, filtered to Bundoora, and see whether the new program shifted the conversion rate.

That feedback loop — hypothesis → action → measurement — is what the analytics should enable. Everything in this doc is in service of it.

# Admin Restructure — Change Log

Branch: `feature/admin-restructure`
Owner: Alex Lewis
Started: 2026-05-02

This log captures every change made on this branch — code, schema, data, env vars, and Stripe/Supabase config — so any change can be reversed cleanly. Append to this file before each commit.

## Format

For each change, record:
- **Date/time** (Australia/Melbourne)
- **Scope:** code | schema | data | env | external
- **What changed:** specific file / table / endpoint / variable
- **Why:** the reason
- **Rollback:** the exact undo steps (separate code rollback from data rollback)
- **Commit:** SHA after the change is committed

---

## Discovery snapshot (pre-change baseline, 2026-05-02)

Captured before any change so we know the starting state.

### Database — RLS state

- Tables with RLS **disabled** (publicly readable via anon key):
  `assessment_domains` (7), `association_competitions` (345), `eligibility_rules` (6), `vccl_regions` (8), `vmcu_associations` (19), `sp_squad_players_backup_20260421` (168)
- Tables with RLS enabled but **zero policies** (silently invisible to non-service-role):
  `password_reset_tokens` (4), `recovery_attempts` (43), `sp_squad_players_backup_20260420` (2)

### API endpoints — auth state

| Endpoint | Auth check | Notes |
|---|---|---|
| `audit-stripe-sessions.js` | ✅ verifyAdmin | Bearer required |
| `sync-from-stripe.js` | ✅ verifyAdmin | Bearer required |
| `sync-programs-from-stripe.js` | ✅ verifyAdmin | Bearer required |
| `stripe-webhook.js` | ✅ Stripe signature | Public by necessity, signature verified |
| `create-checkout-session.js` | ❌ none | **Public by necessity** (shop checkout) |
| `get-stripe-payment.js` | ❌ none | **Needs lockdown** |
| `send-confirmation.js` | ❌ none | **Needs lockdown** |
| `fetch-playhq-stats.js` | ❌ none (has CORS) | Needs review |

### Admins (dashboard_users.active = true)

- alex.lewis@rramelbourne.com (super_admin)
- andy.crook@rramelbourne.com (admin)
- info@rramelbourne.com (admin)
- (steven.crook@rramelbourne.com — deactivated 2026-04-30, auth banned)

### Source of truth — pre-change counts

- `program_registrations`: 247 rows (Elite 90, Junior 87, Holiday 66, Kickstart 4)
- `official_cohort_2026`: 241 rows (130 master_landing_page source, 111 null source)
- `crm_leads`: 584 rows
- Active admin sessions: 0

### Recent commits on main before branching

- `9cf8d1c` [Audit Endpoint] Sync classifier with sync + webhook
- `101ba32` [Programs Classifier] Catch Elite $2,995 deposit plan
- `2eb6804` [Audit] Add /api/audit-stripe-sessions endpoint
- `1b2c5a8` [Admin Sidebar] Add per-program nav items + URL-driven filter

---

## Changes

### 2026-05-02 — Security: lock down 3 unauthed admin endpoints

**Scope:** code (api + frontend)
**What changed:**
- New shared `api/_lib/verifyAdmin.js` — admin Bearer-token verification (reads `Authorization: Bearer <jwt>`, validates against Supabase Auth + `dashboard_users.active=true`).
- `api/get-stripe-payment.js` — added `verifyAdmin` gate. Was unauth → could leak Stripe customer name/email/phone/address/card-last4 to anyone guessing session IDs.
- `api/send-confirmation.js` — added `verifyAdmin` gate. Was unauth → anyone could spam customers via Resend through our verified domain.
- `api/fetch-playhq-stats.js` — added `verifyAdmin` gate AND tightened CORS (was `*`, now restricted to `rramelbourne.com` / `www.rramelbourne.com` / `rrlandingpage1.vercel.app`). Was unauth → anyone could spawn headless Chrome instances on our Vercel bill.
- `src/components/admin/ShopOrdersDashboard.jsx` — both callers (`get-stripe-payment` for order detail, `send-confirmation` for manual email) now attach `Authorization: Bearer ${session.access_token}`.
- `src/components/admin/PlayerProfileDetail.jsx` — `fetch-playhq-stats` caller now attaches Bearer token.

**Why:** discovery surfaced these three endpoints as the only `/api/*` routes lacking auth that *should* have it. (`stripe-webhook` and `create-checkout-session` are intentionally public — webhook is signature-verified, checkout is the customer-facing payment trigger.)

**Rollback (code):** `git revert <commit-sha>` will undo both the API gates and the frontend Bearer headers atomically. No DB changes.

**Rollback (data):** N/A — no schema or data changes.

**Verification plan (on preview branch):**
1. Sign in as info@rramelbourne.com, open Shop Orders dashboard, click an order with a Stripe session → Stripe panel should populate.
2. Click "Send confirmation" on an order → email should send (check Resend logs).
3. Open a Player Profile in admin, click "Fetch PlayHQ stats" → endpoint should respond.
4. Hit each endpoint with `curl` (no Auth header) → should 401, not 200.

**Commit:** 60a0468

---

### 2026-05-02 — Track A continued: RLS hardening on reference tables + lock down exposed backup

**Scope:** schema (migrations applied to live DB)
**What changed:**
- Migration `enable_rls_reference_tables_2026_05_02` — enabled RLS + added explicit `Anon read` and `Authenticated read` SELECT policies on five reference-data tables (`assessment_domains`, `association_competitions`, `eligibility_rules`, `vccl_regions`, `vmcu_associations`). Effect: anon can still SELECT (preserves DNA Profile app behaviour), but anon-role INSERT/UPDATE/DELETE is now blocked (was previously allowed because RLS was off).
- Migration `lock_orphan_backup_table_2026_05_02` — enabled RLS (with no policies) on `sp_squad_players_backup_20260421` (168 rows). It was publicly readable via anon key with no code reading it. Now locked to service_role.
- New `docs/admin-restructure-pending-migrations.md` — captures the destructive migrations (drop backup tables, drop orphaned auth tables) for manual review before applying.

**Why:** discovery flagged 6 tables RLS-disabled and 3 tables RLS-enabled-with-zero-policies. Applied the safe additive changes; deferred destructive cleanups to a pending-review file.

**Rollback:**
```sql
-- Reference tables (each):
DROP POLICY "Anon read reference data" ON public.<tablename>;
DROP POLICY "Authenticated read reference data" ON public.<tablename>;
ALTER TABLE public.<tablename> DISABLE ROW LEVEL SECURITY;

-- Backup table:
ALTER TABLE public.sp_squad_players_backup_20260421 DISABLE ROW LEVEL SECURITY;
```

**Verification:** confirmed via curl with anon key — all 5 reference tables still return their full row counts, no behaviour change for SELECT.

**Commit:** (with the Members 2026 commit below)

---

### 2026-05-02 — Track B: Academy Members 2026

**Scope:** schema + code (api + frontend)
**What changed:**
- Migration `create_academy_member_subsidies_2026_05_02` — new `academy_member_subsidies` table for non-Stripe academy members (Ambassadors etc.). RLS enabled with admin-only read + manage policies. Seeded **Thomas Webb** as the only confirmed subsidy.
- New `api/academy-members.js` — admin-only endpoint that aggregates paid `program_registrations` + paid `shop_orders_*` + active subsidies into one row-per-person with programs[], payment_types[], totals, and first/last paid timestamps.
- New `src/components/admin/AcademyMembersDashboard.jsx` — full-featured list view (stats, per-program filter cards, search, payment-type filter, sortable columns, CSV export, detail drawer).
- Routing: `/rramadmin_26/academy-members` route added in `src/App.jsx`.
- Sidebar: PROGRAM section item renamed `Cohort 2026` → **Academy Members 2026**, repointed from `/lp3-acceptances` to `/academy-members`. (LP3Inquiries route still accessible via direct URL — not removed.)

**Why:** user wants a single source-of-truth view of "who is part of the Academy" — defined as paid in Stripe OR seeded as a subsidy. `official_cohort_2026` is contaminated (mix of paid + unpaid) and explicitly out-of-scope per user note.

**Rollback (code):** `git revert <commit>`
**Rollback (schema):**
```sql
DROP TABLE public.academy_member_subsidies;
```

---

### 2026-05-02 — Track C: Inquiries section

**Scope:** code (frontend only — reads existing `crm_leads`)
**What changed:**
- New `src/components/admin/InquiriesDashboard.jsx` — reads `crm_leads` (584 rows) via authenticated Supabase client (existing RLS policy already gates to dashboard users). Filterable by source, stage, archived flag; search across name / email / phone / suburb / club; per-source stat tiles; detail drawer with contact / player / location / pipeline / attribution / tags sections; CSV export.
- Routing: `/rramadmin_26/inquiries` route added.
- Sidebar: replaced the **HOMEPAGE** section (only contained Home Leads) with a new **INQUIRIES** section containing **All Inquiries** (new) + **Home Leads** (existing).

**Why:** user wants a consolidated inquiries view ("the applied but haven't paid pool"). `crm_leads` is the existing central hub.

**Rollback (code):** `git revert <commit>` — no schema changes.

---

### 2026-05-02 — Track D: Reclassification

**Scope:** schema + code (api + frontend)
**What changed:**
- Migration `create_reclassification_audit_2026_05_02` — new `reclassification_audit` table with admin-only SELECT policy. Captures performed_by, source_table, source_row_id, stripe_session_id, field_before, field_after, reason. Indexed on session ID + timestamp.
- New `api/reclassify-registration.js` — admin-auth endpoint. Updates `program_registrations.program` for a given row, then atomically writes an audit log entry. Rolls back the program update if the audit insert fails. Cross-table moves (program ↔ shop) intentionally out of scope for v1.
- `src/components/admin/ProgramRegistrationsDashboard.jsx` — new `ReclassifySection` rendered inside the registration detail drawer. Dropdown of allowed programs + optional reason field + Confirm button. Surfaces success / error inline.

**Why:** user wants admin to be able to manually correct misclassifications (e.g. an Elite payment that the classifier tagged as Junior). Audit log keeps changes traceable and reversible.

**Rollback (code):** `git revert <commit>`
**Rollback (schema):**
```sql
DROP TABLE public.reclassification_audit;
```

---

### 2026-05-02 — Track E: Analytics foundations + design doc

**Scope:** code (frontend) + documentation
**What changed:**
- New `docs/analytics-design.md` — comprehensive analytics plan: audience, the 12 questions admin needs answered, recommended visualisation per question, tech stack (recharts + react-leaflet — both already installed), live-sync strategy, data sources, 4-phase roadmap. Designed so a future analyst hire can pick it up cold.
- New `src/components/admin/melbourneSuburbs.js` — hardcoded approximate lat/lng lookup for 80+ Melbourne suburbs (covers all top suburbs in current `crm_leads`) + suburb normalisation helper.
- New `src/components/admin/MelbourneInquiryMap.jsx` — react-leaflet map widget. Bubbles per suburb sized by inquiry count, coloured by inquiry → paid conversion rate (red < 10%, violet < 25%, amber < 50%, emerald ≥ 50%). Tooltips + popups with per-suburb breakdown by source. Uses `useRealtimeSync` so updates land without page reload.
- `src/components/admin/AnalyticsPanel.jsx` — Melbourne map mounted at the top of the Funnel & Demographics page.

**Why:** user wants visual, live, geographic analytics — leadership-grade dashboards. The map answers "where are our hot spots and cold spots" in one glance and is the centrepiece for further analytics build-out.

**Rollback (code):** `git revert <commit>` — no schema changes.

---

## Pre-merge verification plan (do this on the Vercel preview URL)

Open the preview deployment for `feature/admin-restructure` (Vercel will spin one up automatically) and sign in as `info@rramelbourne.com`.

### Smoke tests for Track A (security)
- Open Shop Orders → click any order with a Stripe session → "Stripe Details" panel should populate.
- Click "Send confirmation email" on any shop order → email should send (check Resend logs).
- Open Player Profiles → pick a player → "Fetch PlayHQ stats" → endpoint should respond.
- `curl https://<preview-host>/api/get-stripe-payment?session_id=foo` (no Auth header) → expect HTTP 401, body `{"error":"Missing bearer token"}`.

### Smoke tests for Tracks B–E
- Sidebar shows new INQUIRIES section (All Inquiries + Home Leads under it) and PROGRAM section's first item is now **Academy Members 2026**.
- Click **Academy Members 2026** → list loads with stats, per-program filter cards, sortable table, CSV export. Search "thomas webb" → should appear flagged Subsidy.
- Click **All Inquiries** → 584 inquiries load, filter by source / stage works, detail drawer shows attribution + UTM.
- Open **Program Registrations** → click any row → in the detail drawer, "Reclassify" section is at the top. Pick a different program, save → check `reclassification_audit` table has a new row and the registration's program updated.
- Open **Funnel & Demographics** → Melbourne Inquiry Map renders at the top with bubbles. Hover any suburb → tooltip with count. Click → popup with breakdown by source.

### Acceptance gate
- All five smoke tests pass on the preview URL.
- No JavaScript errors in browser console.
- Existing pages (Dashboard, Pipeline, All Players, Shop Orders, Program Registrations w/o the new button) all still render.

Once the gate passes, merge `feature/admin-restructure` → `main` via PR.



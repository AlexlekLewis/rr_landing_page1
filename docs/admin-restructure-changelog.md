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

**Commit:** (pending push)


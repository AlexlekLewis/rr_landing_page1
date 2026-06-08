---
name: cost-security-audit
description: >-
  Run a cost, abuse, and data-exposure security audit of this Stripe + Supabase +
  Vercel app. Use when the user wants to check overspend risk, bot/abuse protection,
  exposed secrets or API keys, Supabase RLS gaps, unprotected serverless endpoints,
  or PII/credential exposure. Triggers: "security audit", "am I exposed", "can bots
  run up my bill", "is my user data protected", "check RLS / limiters / keys",
  "money safety". Produces a prioritized report; does not change anything unless asked.
---

# Cost & Security Audit

A repeatable audit for **this specific stack**: a Vite SPA + Vercel serverless
functions (`api/*.js`) + Supabase (Postgres/RLS, Auth, Storage) + Stripe + Resend +
Zapier + Google Sheets. It answers three questions the owner cares about:

1. **Can I overspend?** (billing caps, expensive functions, runaway external calls)
2. **Can bots spend my money for me?** (rate limiting, auth, honeypots on public endpoints)
3. **Is anything exposed / is user data protected?** (secrets in git/bundle, RLS, SECURITY
   DEFINER views, anon/authenticated grants, public storage buckets, plaintext credentials)

This is **read-only by default**. Never apply fixes (SQL, RLS changes, code edits,
dashboard changes) without explicit confirmation — RLS and endpoint changes on a live
site can break lead capture, the CRM dashboard, and the player portal.

---

## How to run it

Work top to bottom. Most of it is automated by the three scripts in `scripts/`; the
rest uses the **Supabase MCP** tools and (optionally) Vercel/Stripe dashboards.

```bash
SKILL=.claude/skills/cost-security-audit

# 1. Repo / bundle exposure (secrets in git, client bundle, endpoint posture)
bash $SKILL/scripts/repo-exposure-scan.sh

# 2. Live "can anyone download this?" test — uses the PUBLIC anon key from .env
bash $SKILL/scripts/anon-exposure-scan.sh
```

For the database layer, run the queries in `scripts/rls-audit.sql` via the Supabase
MCP (`mcp__Supabase*__execute_sql`, project ref is the subdomain in
`VITE_SUPABASE_URL`), and run the official linter:

- `mcp__Supabase*__get_advisors` with `type:"security"` — the gold-standard check.
  It is large; if the result overflows, save-and-slice it or hand it to a subagent.
- `mcp__Supabase*__get_advisors` with `type:"performance"` (egress/cost hints).

Then write up findings using the **Report format** below, sorted by the **Severity
model**. Offer remediation as a separate, confirmed step.

---

## Pillar 1 — Overspend protection ("I never overspend")

These are mostly **account-level caps** that no code change can replace. Check and
report on each; most require the dashboard or provider API.

- [ ] **Stripe**: live mode using fixed server-side Price IDs (never client-supplied
      amounts). Confirm `api/create-checkout-session.js` + `api/create-pgp-checkout.js`
      map product → server Price ID and never read an amount from `req.body`.
- [ ] **Stripe Radar**: fraud rules enabled; block-on-high-risk; card-testing
      protection on. (Dashboard → Radar.) Card-testing attacks = real $ in fees.
- [ ] **Vercel spend management**: a hard **spend cap / pause-on-limit** is set, and
      function concurrency/usage alerts exist. (Vercel → Settings → Billing.) This is
      the single most important overspend backstop because of the scraper below.
- [ ] **Supabase**: spend cap on (or usage alerts), especially egress. Run the
      performance advisor; large unindexed/`select *` reads from the SPA inflate egress.
- [ ] **Resend / email**: a sending cap or alert; confirm email-send endpoints are
      authed (see Pillar 2) so they can't be used to burn quota / wreck domain reputation.
- [ ] **Expensive functions inventory**: grep `vercel.json` + `api/` for high
      `maxDuration`/`memory` and headless browsers. On this repo:
      `api/fetch-playhq-stats.js` runs **headless Chromium for ~45–60s at 1024MB** —
      one abused endpoint can dominate the entire Vercel bill. It MUST be rate-limited
      and ideally authed/queued (see Pillar 2).

## Pillar 2 — Bot / abuse protection ("I can't get spent by bots")

For every file in `api/`, classify the protection posture. `repo-exposure-scan.sh`
prints this matrix; verify it and reason about cost-per-call.

- [ ] **Auth on privileged endpoints.** Good model already in repo:
      `verifyAdmin()` (Bearer JWT → `dashboard_users.active=true`) in
      `audit-stripe-sessions.js`, `sync-from-stripe.js`, `sync-programs-from-stripe.js`.
- [ ] **No fail-open auth.** Flag the `const expected = process.env.X; if (expected) {…}`
      pattern — if the env var is unset the check is skipped. Present in
      `sync-holiday-row.js`, `sync-power-game-row.js`, `refresh-unified-people.js`.
      Fix = require the secret (fail closed) and assert it at boot.
- [ ] **Rate limiting** on every public endpoint, especially:
      - `fetch-playhq-stats.js` (compute cost) — strict per-IP limit + timeout/budget.
      - `create-checkout-session.js` / `create-pgp-checkout.js` (Stripe API calls).
      - `india-tour-intake.js`, lead/RSVP inserts (storage + junk data).
      - `send-confirmation.js` (Resend cost + customer email-bombing) — and it is
        currently **unauthenticated** while using the service-role key; add admin auth.
      Vercel has no built-in limiter; use Upstash Redis ratelimit, `@vercel/firewall`,
      or Vercel WAF rules. A honeypot (see `india-tour-intake.js` `hp_website`) helps
      but is not a substitute for a rate limit.
- [ ] **Webhook signature verification.** `stripe-webhook.js` correctly verifies via
      `constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)` with `bodyParser:false`.
      Confirm any new webhook does the same (else bots forge "paid" events → free goods).
- [ ] **CORS.** `Access-Control-Allow-Origin: *` on `fetch-playhq-stats.js` and
      `india-tour-intake.js`. Lock to the production origin unless truly public.
- [ ] **Write-open RLS = bot-writable tables.** The DB advisor's `rls_policy_always_true`
      findings are abuse vectors: any `INSERT/UPDATE/DELETE/ALL ... USING/ WITH CHECK (true)`
      granted to `anon`/`public` lets bots inject or wipe rows (see `rls-audit.sql`).

## Pillar 3 — Exposure & data protection ("nothing exposed, user data protected")

### 3a. Secrets (`repo-exposure-scan.sh`)
- [ ] **No secret files tracked in git.** `.env` must NOT be tracked (it can be in
      `.gitignore` yet still tracked if it was committed before — check
      `git ls-files | grep .env` AND `git log --all -- .env`).
- [ ] **Only `VITE_`-public values** may live client-side. Anything in `.env` with a
      `VITE_` prefix ships to the browser bundle — so the anon key, Zapier webhook URLs,
      PostHog key are *public by design*. Server secrets (`STRIPE_SECRET_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `GOOGLE_SERVICE_ACCOUNT_JSON`,
      `STRIPE_WEBHOOK_SECRET`, `SUPABASE_WEBHOOK_SECRET`) must exist ONLY in Vercel env,
      never `VITE_`-prefixed, never in any tracked file or built bundle under `public/`.
- [ ] **Scan built bundles** (`public/**/assets/*.js`, `dist/`) for `sk_live`, `sk_test`,
      `service_role`, `whsec_`, `re_`, `-----BEGIN`, `"private_key"`, `AKIA`.
- [ ] **Zapier webhook URLs** are unauthenticated POST sinks; if they're `VITE_`-exposed,
      bots can spam them (Zapier task quota = $). Consider routing through a server
      function, or accept the risk and cap Zapier tasks.

### 3b. Supabase RLS / views / functions (`rls-audit.sql` + advisor)
- [ ] **Every `public` table has RLS enabled.** (Tables with RLS + 0 policies are
      default-deny for client roles — safe, only `service_role` bypasses.)
- [ ] **SECURITY DEFINER views are the top trap.** A view with `security_invoker=false`
      runs as its owner and **bypasses the underlying tables' RLS**. If `anon` or
      `authenticated` has `SELECT` on such a view, that role reads ALL rows. Check
      `has_table_privilege('anon'|'authenticated', view, 'SELECT')` together with
      `security_invoker`. Fix = `ALTER VIEW … SET (security_invoker = on)` (and ensure
      underlying RLS is admin-only) **or** `REVOKE SELECT … FROM anon, authenticated`
      so only the service role (server endpoints) can read them.
- [ ] **`authenticated` is not "trusted".** Players, parents, and coaches log in and get
      the `authenticated` role; if self-signup is on, so does anyone. Master/CRM views
      and PII tables must NOT be readable by `authenticated` broadly — only dashboard admins.
- [ ] **Empirically prove it** with `anon-exposure-scan.sh` (anon) — the definitive
      "can a stranger download this?" test. For the `authenticated` tier, mint a low-priv
      test user and repeat, or reason from grants + `security_invoker`.
- [ ] **No plaintext credentials.** Flag any column matching `pass|password|secret|token`
      in a client-readable table (e.g. `program_members.generated_password`).
- [ ] **SECURITY DEFINER functions** callable by `anon`/`authenticated` (advisor:
      `*_security_definer_function_executable`) run elevated from the public REST API.
      Review especially data-export / lookup functions; `REVOKE EXECUTE` or make
      `SECURITY INVOKER` where not intentional.
- [ ] **`search_path` set** on SECURITY DEFINER functions (advisor:
      `function_search_path_mutable`) — hardening against search_path hijack.

### 3c. Supabase Storage & Auth
- [ ] **Public buckets shouldn't allow listing** (advisor: `public_bucket_allows_listing`).
      A broad `SELECT` on `storage.objects` lets anyone enumerate every file. Especially
      sensitive for player photos / minors (`headshots`) and any passport/ID uploads.
      Keep object URLs working but drop the list policy; use signed URLs for private docs.
- [ ] **Auth signups**: confirm whether email signups are open. If on, anyone can become
      `authenticated` — which must therefore have near-zero data access (see 3b).
- [ ] **Sensitive tables locked**: `password_reset_tokens`, `recovery_attempts`, and any
      `*_backup_*` tables should be service-role-only (RLS on, no anon/auth policy).

---

## Severity model (sort the report by this)

- **CRITICAL** — exposed *right now* to anyone, money- or breach-impacting: plaintext
  creds/PII downloadable with the public key; live secret key in git/bundle; an
  unauthenticated expensive endpoint with no cap; client-controlled payment amounts.
- **HIGH** — exposed to any logged-in user, or a clear bot/cost vector: SECURITY DEFINER
  views readable by `authenticated`; fail-open auth; write-open (`USING(true)`) RLS on
  PII tables; no spend cap on the provider that hosts the expensive function.
- **MEDIUM** — requires guessing/effort, or quota/abuse not direct theft: IDOR by hard
  UUID; unauth email re-send; public bucket listing; permissive CORS.
- **LOW / hardening** — `function_search_path_mutable`, reference tables world-readable
  by design, defense-in-depth.

## Report format

For each finding: **Severity · Title · Where (file:line / object) · Proof (status code,
row count, lint id) · Why it costs money or leaks data · Fix (one concrete action) ·
Effort.** Group by the three pillars. End with a "fix first" shortlist (the CRITICALs)
and the account-level cap checklist (Pillar 1), since caps are the ultimate backstop.

## Remediation playbook (only when asked)

- **Lock a leaked view/table**: `ALTER VIEW x SET (security_invoker=on);` or
  `REVOKE SELECT ON x FROM anon, authenticated;` then re-run `anon-exposure-scan.sh`.
- **Replace `USING(true)` write policies** with role checks (`is_dashboard_user()` /
  `auth.uid() = owner`); keep a narrow `WITH CHECK` insert policy if a public form needs it.
- **Drop plaintext secrets**: remove the column or move to Supabase Auth; rotate exposed creds.
- **Rate-limit endpoints**: Upstash/`@vercel/firewall` wrapper; for the scraper add a
  per-IP + global budget and short timeout, or move to a queue/auth.
- **Fail closed**: replace `if (expected) {check}` with "require `expected`, else 500".
- **Rotate** any secret that ever touched git history; scrub history if a server secret leaked.
- Always re-run this skill after fixes to confirm green.

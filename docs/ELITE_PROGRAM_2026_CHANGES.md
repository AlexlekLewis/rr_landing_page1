# Elite Program 2026 — Restructure Changes Log

**Branch**: `claude/supabase-structure-audit-l8GAw`
**Started**: 2026-05-22
**Goal**: Unify Elite Program 2026 player records — make `elite_program_2026_roster` the single source of truth, enriched with data from `official_cohort_2026` and `players`. Soft-rename via views.

---

## Status

| Phase | Status | What |
|---|---|---|
| 0 | ✅ done | Full audit doc — `docs/SUPABASE_AUDIT.md` |
| 1a | ✅ pre-existing | 24 enrichment columns added to `elite_program_2026_roster` |
| 1b | ✅ done this session | Backfill from `official_cohort_2026` + `players` |
| 1c | ✅ pre-existing | FKs `player_id` → `players.id`, `application_id` → `official_cohort_2026.id` |
| 2 | ✅ done this session | Soft rename via VIEWs |
| 3 | ⏳ pending | Full CRUD admin page for `elite_program_2026` |

---

## Phase 1a — Additive schema (pre-existing in DB at session start)

24 nullable columns added to `elite_program_2026_roster` (state confirmed via `information_schema.columns`):

```
player_id uuid, application_id uuid, data_quality_notes text,
first_name text, last_name text, dob date, age integer, gender text,
email text, phone text, suburb text, club text, player_role text,
payment_status text, payment_plan_selected text, accepted_offer boolean,
auth_user_id uuid, headshot_url text, weekday_session text, weekend_session text,
batting_hand text, bowling_type text,
player_bat_archetype text, player_bwl_archetype text
```

Indexes added: `_application_id_idx`, `_player_id_idx`, `_norm_name_idx`, `elite_roster_emails_idx`, `elite_roster_email2_idx`, `elite_roster_email3_idx`.

---

## Phase 1b — Backfill (✅ done this session)

Migrations applied:
- `backfill_elite_program_2026_roster_from_cohort_and_players`
- `backfill_elite_program_2026_roster_from_players`
- `flag_unmatched_elite_program_2026_roster_rows`

**Strategy**: Per duplicate, picked the source row with the most non-null fields (`jsonb_strip_nulls(to_jsonb(row))` key count); tiebreaker = most recent `created_at`. All writes use `COALESCE` so pre-existing roster values were preserved.

### Coverage report (88 rows total)

| Field | Filled | Note |
|---|---:|---|
| `application_id` (FK → official_cohort_2026) | 83 / 88 | 5 missing as expected (no application record): Dheer Chaudhari, Dulin Gunawardhana, Kunwar Badwal, Pranjol Josh Roy, Priyam Sharma |
| `player_id` (FK → players) | 71 / 88 | 17 missing — players without an academy app record |
| `email` | 85 / 88 | |
| `phone` | 85 / 88 | |
| `suburb` | 83 / 88 | |
| `payment_status` | 83 / 88 | |
| `auth_user_id` | 71 / 88 | matches player_id coverage |
| `bat_archetype` | 70 / 88 | |
| `headshot_url` | 43 / 88 | only half have uploaded a headshot |
| **`first_name`** | **30 / 88** | ⚠️ many cohort rows have NULL first_name; "most complete row" strategy preferred rows with more total fields |
| **`dob`** | **30 / 88** | ⚠️ same issue |
| `data_quality_notes` (any flag set) | 74 / 88 | dupes + unmatched |

**Known follow-up**: a "best per-field" backfill (union of best non-null per column across all matching source rows) would lift first_name/dob coverage significantly. Currently picks the single most-complete row.

### Rollback (data only, schema stays)

```sql
UPDATE elite_program_2026_roster
SET player_id = NULL, application_id = NULL, data_quality_notes = NULL,
    first_name = NULL, last_name = NULL, dob = NULL, age = NULL, gender = NULL,
    email = NULL, phone = NULL, suburb = NULL, club = NULL, player_role = NULL,
    payment_status = NULL, payment_plan_selected = NULL, accepted_offer = NULL,
    auth_user_id = NULL, headshot_url = NULL, weekday_session = NULL, weekend_session = NULL,
    batting_hand = NULL, bowling_type = NULL,
    player_bat_archetype = NULL, player_bwl_archetype = NULL;
```

Note: this also wipes any pre-backfill enrichment data (none was present, so safe to run).

---

## Phase 1c — Foreign keys (pre-existing)

Both already in DB at session start:
- `elite_program_2026_roster_player_id_fkey`: `FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL`
- `elite_program_2026_roster_application_id_fkey`: `FOREIGN KEY (application_id) REFERENCES official_cohort_2026(id) ON DELETE SET NULL`

---

## Phase 2 — Soft rename via VIEWs (✅ done this session)

Migration applied: `soft_rename_elite_program_2026_via_views`

**Why views, not RENAME**: 12 active code files reference `official_cohort_2026` (3 of them WRITE — checkout, stripe-success, acceptance). A direct rename would break live signup/payment until every reference is updated. Views let code migrate at its own pace with zero downtime.

```sql
CREATE OR REPLACE VIEW public.elite_program_2026
WITH (security_invoker = true) AS
SELECT * FROM public.elite_program_2026_roster;

CREATE OR REPLACE VIEW public.elite_program_applications_2026
WITH (security_invoker = true) AS
SELECT * FROM public.official_cohort_2026;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.elite_program_2026 TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.elite_program_applications_2026 TO anon, authenticated, service_role;
```

Properties:
- **Auto-updatable**: simple `SELECT *` views in Postgres support INSERT/UPDATE/DELETE — writes go through to the underlying table.
- **RLS preserved**: `security_invoker=true` (PG 15+) means RLS still applies as the calling user. The view doesn't bypass row-level policies.
- **Zero impact on existing code**: old code keeps writing to `official_cohort_2026` and `elite_program_2026_roster` — works exactly as before.
- **New code can use the new names**: `elite_program_2026` and `elite_program_applications_2026` are now valid table names for the API/PostgREST layer.

Verified row counts:

| Name | Rows |
|---|---:|
| `elite_program_2026` (view) | 88 |
| `elite_program_2026_roster` (table) | 88 |
| `elite_program_applications_2026` (view) | 241 |
| `official_cohort_2026` (table) | 241 |

### Rollback (instant, zero data loss)

```sql
DROP VIEW IF EXISTS public.elite_program_2026;
DROP VIEW IF EXISTS public.elite_program_applications_2026;
```

### Future hard rename (optional, much later)

When all 12 code files have migrated to the new names, drop the views and rename the underlying tables. Then re-create the OLD names as backward-compat views (or drop them entirely).

```sql
-- (Run only after all consumers migrate to the new names)
DROP VIEW public.elite_program_2026;
DROP VIEW public.elite_program_applications_2026;
ALTER TABLE public.elite_program_2026_roster RENAME TO elite_program_2026;
ALTER TABLE public.official_cohort_2026 RENAME TO elite_program_applications_2026;
-- Optional backward-compat:
CREATE VIEW public.elite_program_2026_roster WITH (security_invoker=true) AS SELECT * FROM public.elite_program_2026;
CREATE VIEW public.official_cohort_2026 WITH (security_invoker=true) AS SELECT * FROM public.elite_program_applications_2026;
```

---

## Phase 3 — Admin UI (⏳ pending — next work item)

User chose: **Full CRUD admin page**.

### Scope

- New route + tab in admin dashboard, labelled "Elite Program 2026"
- File: `src/components/admin/EliteProgram2026.jsx`
- Register in `src/components/admin/AdminLayout.jsx` + admin router (likely `src/admin/App.jsx`)
- Reads from the new `elite_program_2026` VIEW (not the underlying table, so any future hard rename is transparent)

### Features
- **List view**:
  - All 88 rows, all 24 enriched fields visible (sortable columns)
  - Column visibility toggles (hide noisy fields by default)
  - Filters: `is_female`, `is_ambassador`, `payment_status`, `accepted_offer`, has-headshot, has-data-quality-notes
  - Free-text search across `player_name`, `email`, `parent_name`
  - CSV export
  - Row indicator when `data_quality_notes` is set
- **Add player** — inline form (modal/drawer). Inserts into `elite_program_2026` (routes to the underlying table).
- **Edit player** — inline edit or detail drawer. Updates through the view.
- **Delete / archive** — toggle `active=false` (soft delete, preserves history).
- **Per-row detail drawer** (Phase 3.5 if scope permits):
  - Full 24-column view
  - Linked panels via `player_id` / `application_id`: assessments, payments, comms, fitness logs
  - "Re-link" action to manually fix `player_id` / `application_id` if the auto-match was wrong

### Existing patterns to mimic
- `src/components/admin/PlayerProfiles.jsx` (table + realtime sync)
- `src/components/admin/UnifiedPlayerDetail.jsx` (detail drawer)
- `src/components/admin/ApplicationsTable.jsx` (filters + CSV export)

### Realtime
- Subscribe via `useRealtimeSync(['elite_program_2026_roster'], fetchData)` (subscribe to the underlying table — Postgres realtime doesn't currently fire on views, only on tables).

---

## Data quality items to action separately

1. **Massive duplicates in `official_cohort_2026`** — 60 of 88 roster names have multiple rows (up to 6). Likely from payment-retry form re-submissions. Consider a deduplication pass that keeps the most-complete row per email/phone and archives the others.
2. **9 duplicate `players` records** — Angad Singh Pantlya, Arihant Kalla, Arnav Bhargava, Guhika Vij, Harsh Sinha, Ishita Tiwari, Kabir Thapar, Tanish Billa, Zoe Oza.
3. **5 roster players missing from `official_cohort_2026`**: Dheer Chaudhari, Dulin Gunawardhana, Kunwar Badwal, Pranjol Josh Roy, Priyam Sharma — likely added directly to the roster without going through any landing-page form.
4. **3 of those 5 also missing from `players`**: Dulin Gunawardhana, Kunwar Badwal, Pranjol Josh Roy — will only have `player_name` + the original parent fields.
5. **Low `first_name` / `dob` coverage (30/88)** — the "most-complete row" backfill strategy picked rows with high total field count, often weighted by UTM/admin metadata. A per-field union pass would fix this. Worth doing before the admin UI ships, OR can be done in-UI by editing.
6. **`sessions.pk_columns = "id, id"`** in the audit (separate concern, legacy session table).

---

## Code references — for future planning

Files reading/writing the underlying tables (no change needed unless we do the hard rename):

### `official_cohort_2026` — 12 active files

| File | Operation | Severity if renamed without code change |
|---|---|---|
| `src/components/master-landing-page/MasterCheckout.jsx:146` | INSERT | HIGH — checkout breaks |
| `src/components/master-landing-page/MasterStripeSuccess.jsx:200,213` | UPDATE + INSERT | HIGH — Stripe confirmation breaks |
| `src/components/landing-page-3/AcceptanceForm.jsx:165` | INSERT | HIGH — offer acceptance breaks |
| `src/DNAProfileApp/db/adminDb.js:336,342` | DELETE + SELECT | MEDIUM |
| `src/components/admin/DashboardOverview.jsx:77,144` | SELECT + realtime | MEDIUM |
| `src/components/admin/PlayerProfiles.jsx:43,72` | SELECT + realtime | MEDIUM |
| `src/components/admin/UnifiedPlayerDetail.jsx:92` | SELECT by email | MEDIUM |
| `src/components/admin/LP3Inquiries.jsx:17,34` | SELECT + realtime | MEDIUM |
| `src/components/admin/IndiaTour2026Dashboard.jsx:80` | SELECT | MEDIUM |
| `src/DNAProfileApp/coach/AdminProfiles.jsx:93` | SELECT | LOW |
| `src/DNAProfileApp/coach/SquadAssignment.jsx:33` | SELECT | LOW |
| `src/hooks/useRealtimeSync.js:13` | comment | NONE |

### `elite_program_2026_roster` — 0 active files

Not currently used. The new Phase 3 admin UI will use the `elite_program_2026` VIEW name.

### FKs pointing at `official_cohort_2026` (unaffected by soft rename)

- `india_tour_2026_travellers.cohort_player_id`
- `player_communications.player_id`
- `player_comms_tracker.player_id`
- `player_stats_seasons.cohort_id`
- `elite_program_2026_roster.application_id` (added in Phase 1c)

---

## Rollback summary

| Phase | Rollback | Cost |
|---|---|---|
| 1a (cols) | `ALTER TABLE … DROP COLUMN x24` | trivial; loses backfilled values |
| 1b (backfill) | `UPDATE … SET NULL` per column | instant, idempotent |
| 1c (FKs) | `ALTER TABLE … DROP CONSTRAINT x2` | trivial |
| 2 (views) | `DROP VIEW x2` | instant, zero data loss |
| 3 (admin UI) | delete file + remove route + remove tab entry | trivial |

Phases 1 and 2 are entirely non-destructive to `official_cohort_2026` and `players` — we only read from them.

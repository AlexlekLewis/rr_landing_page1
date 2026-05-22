# Elite Program 2026 — Restructure Changes Log

**Branch**: `claude/supabase-structure-audit-l8GAw`
**Started**: 2026-05-22
**Goal**: Unify Elite Program 2026 player records — make `elite_program_2026_roster` the single source of truth, enriched with data from `official_cohort_2026` and `players`. Rename tables to reflect their true purpose.

---

## Current state of play

### Phase 0 — Audit (DONE, committed)

- `docs/SUPABASE_AUDIT.md` committed in `77472c8`.
- Full schema audit of all 144 tables, 17 edge functions, 5 views.

### Phase 1a — Additive schema changes (ALREADY APPLIED outside this session)

These changes were already in the DB when this session began (a prior session or manual change must have applied them). They are **safe and reversible** but **not yet backfilled**.

**Table**: `elite_program_2026_roster`

**Columns added** (all nullable, no data yet):
```
player_id              uuid    -- intended FK to players.id (FK NOT yet created)
application_id         uuid    -- intended FK to official_cohort_2026.id (FK NOT yet created)
data_quality_notes     text
first_name             text
last_name              text
dob                    date
age                    integer
gender                 text
email                  text
phone                  text
suburb                 text
club                   text
player_role            text
payment_status         text
payment_plan_selected  text
accepted_offer         boolean
auth_user_id           uuid
headshot_url           text
weekday_session        text
weekend_session        text
batting_hand           text
bowling_type           text
player_bat_archetype   text
player_bwl_archetype   text
```

**Indexes added** (also already in DB):
- `elite_program_2026_roster_application_id_idx`
- `elite_program_2026_roster_player_id_idx`
- `elite_program_2026_roster_norm_name_idx`
- `elite_roster_emails_idx`, `elite_roster_email2_idx`, `elite_roster_email3_idx`

**Rollback** (if needed):
```sql
ALTER TABLE public.elite_program_2026_roster
  DROP COLUMN IF EXISTS player_id,
  DROP COLUMN IF EXISTS application_id,
  DROP COLUMN IF EXISTS data_quality_notes,
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS dob,
  DROP COLUMN IF EXISTS age,
  DROP COLUMN IF EXISTS gender,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS suburb,
  DROP COLUMN IF EXISTS club,
  DROP COLUMN IF EXISTS player_role,
  DROP COLUMN IF EXISTS payment_status,
  DROP COLUMN IF EXISTS payment_plan_selected,
  DROP COLUMN IF EXISTS accepted_offer,
  DROP COLUMN IF EXISTS auth_user_id,
  DROP COLUMN IF EXISTS headshot_url,
  DROP COLUMN IF EXISTS weekday_session,
  DROP COLUMN IF EXISTS weekend_session,
  DROP COLUMN IF EXISTS batting_hand,
  DROP COLUMN IF EXISTS bowling_type,
  DROP COLUMN IF EXISTS player_bat_archetype,
  DROP COLUMN IF EXISTS player_bwl_archetype;
```

---

## Pending changes (NOT YET APPLIED)

### Phase 1b — Backfill enrichment columns (READY, attempted but errored)

**Strategy**: Per duplicate, pick the row with the most non-null fields (`jsonb_strip_nulls(to_jsonb(row))` key count); tiebreaker = most recent `created_at`. Use `COALESCE` so existing roster values are never overwritten.

**Source coverage**:
- 88 roster rows total
- 83 match `official_cohort_2026` (5 will get no application_id: Dheer Chaudhari, Dulin Gunawardhana, Kunwar Badwal, Pranjol Josh Roy, Priyam Sharma)
- 71 match `players` (17 get no player_id — those without academy app records)
- 60 of 88 roster names have DUPLICATES in `official_cohort_2026` (some up to 6 rows)
- 9 of 88 have DUPLICATES in `players`
- Dupes flagged in `data_quality_notes` (e.g. `"cohort_dupes=3; latest+most-complete used"`)

**SQL** (see `supabase/migrations/<pending>_backfill_elite_program_2026_roster.sql` once we write it):

```sql
-- Step 1: best cohort row per roster name
WITH roster_norm AS (
  SELECT id AS roster_id,
         lower(regexp_replace(player_name, '\s+', ' ', 'g')) AS norm
  FROM elite_program_2026_roster
),
cohort_ranked AS (
  SELECT c.*,
         lower(regexp_replace(c.player_name, '\s+', ' ', 'g')) AS norm,
         row_number() OVER (
           PARTITION BY lower(regexp_replace(c.player_name, '\s+', ' ', 'g'))
           ORDER BY (SELECT count(*) FROM jsonb_object_keys(jsonb_strip_nulls(to_jsonb(c)))) DESC,
                    c.created_at DESC
         ) AS rn
  FROM official_cohort_2026 c
),
best_cohort AS (SELECT * FROM cohort_ranked WHERE rn = 1),
dupe_counts AS (
  SELECT lower(regexp_replace(player_name, '\s+', ' ', 'g')) AS norm, count(*) AS cnt
  FROM official_cohort_2026
  GROUP BY 1 HAVING count(*) > 1
)
UPDATE elite_program_2026_roster r
SET application_id = bc.id,
    first_name = COALESCE(r.first_name, bc.first_name),
    last_name  = COALESCE(r.last_name,  bc.last_name),
    dob        = COALESCE(r.dob,        bc.dob),
    age        = COALESCE(r.age,        bc.age),
    gender     = COALESCE(r.gender,     bc.gender),
    email      = COALESCE(r.email,      bc.player_email, bc.email),
    phone      = COALESCE(r.phone,      bc.player_phone, bc.phone),
    suburb     = COALESCE(r.suburb,     bc.suburb),
    club       = COALESCE(r.club,       bc.club),
    player_role           = COALESCE(r.player_role,           bc.player_role),
    payment_status        = COALESCE(r.payment_status,        bc.payment_status),
    payment_plan_selected = COALESCE(r.payment_plan_selected, bc.payment_plan_selected, bc.payment_option_selected),
    accepted_offer        = COALESCE(r.accepted_offer,        bc.accepted_offer),
    data_quality_notes = trim(both ' | ' from
                              concat_ws(' | ', r.data_quality_notes,
                                CASE WHEN dc.cnt > 1
                                     THEN format('cohort_dupes=%s; latest+most-complete used', dc.cnt)
                                END))
FROM roster_norm n
JOIN best_cohort bc ON bc.norm = n.norm
LEFT JOIN dupe_counts dc ON dc.norm = n.norm
WHERE r.id = n.roster_id;

-- Step 2: best players row per roster name
WITH roster_norm AS (
  SELECT id AS roster_id,
         lower(regexp_replace(player_name, '\s+', ' ', 'g')) AS norm
  FROM elite_program_2026_roster
),
players_ranked AS (
  SELECT p.*,
         lower(regexp_replace(p.name, '\s+', ' ', 'g')) AS norm,
         row_number() OVER (
           PARTITION BY lower(regexp_replace(p.name, '\s+', ' ', 'g'))
           ORDER BY (SELECT count(*) FROM jsonb_object_keys(jsonb_strip_nulls(to_jsonb(p)))) DESC,
                    COALESCE(p.updated_at, p.created_at) DESC
         ) AS rn
  FROM players p
),
best_player AS (SELECT * FROM players_ranked WHERE rn = 1),
dupe_counts AS (
  SELECT lower(regexp_replace(name, '\s+', ' ', 'g')) AS norm, count(*) AS cnt
  FROM players GROUP BY 1 HAVING count(*) > 1
)
UPDATE elite_program_2026_roster r
SET player_id            = bp.id,
    auth_user_id         = COALESCE(r.auth_user_id,         bp.auth_user_id),
    headshot_url         = COALESCE(r.headshot_url,         bp.headshot_url),
    weekday_session      = COALESCE(r.weekday_session,      bp.weekday_session),
    weekend_session      = COALESCE(r.weekend_session,      bp.weekend_session),
    batting_hand         = COALESCE(r.batting_hand,         bp.batting_hand),
    bowling_type         = COALESCE(r.bowling_type,         bp.bowling_type),
    player_bat_archetype = COALESCE(r.player_bat_archetype, bp.player_bat_archetype),
    player_bwl_archetype = COALESCE(r.player_bwl_archetype, bp.player_bwl_archetype),
    dob   = COALESCE(r.dob,   CASE WHEN bp.dob ~ '^\d{4}-\d{2}-\d{2}$' THEN bp.dob::date END),
    email = COALESCE(r.email, bp.email),
    phone = COALESCE(r.phone, bp.phone),
    club  = COALESCE(r.club,  bp.club),
    gender = COALESCE(r.gender, bp.gender),
    player_role = COALESCE(r.player_role, bp.role),
    data_quality_notes = trim(both ' | ' from
                              concat_ws(' | ', r.data_quality_notes,
                                CASE WHEN dc.cnt > 1
                                     THEN format('players_dupes=%s; latest+most-complete used', dc.cnt)
                                END))
FROM roster_norm n
JOIN best_player bp ON bp.norm = n.norm
LEFT JOIN dupe_counts dc ON dc.norm = n.norm
WHERE r.id = n.roster_id;

-- Step 3: flag unmatched rows
UPDATE elite_program_2026_roster
SET data_quality_notes = trim(both ' | ' from concat_ws(' | ', data_quality_notes, 'no_official_cohort_match'))
WHERE application_id IS NULL;

UPDATE elite_program_2026_roster
SET data_quality_notes = trim(both ' | ' from concat_ws(' | ', data_quality_notes, 'no_players_match'))
WHERE player_id IS NULL;
```

**Last attempt errored**: `ERROR: 42703: column "norm" does not exist` — the `dupe_counts` CTE referenced `norm` but used `SELECT norm ...` from the source table directly. Fix: use the normalised expression in `dupe_counts` GROUP BY (already done in the SQL above — the original migration call had it grouped as `GROUP BY lower(regexp_replace(player_name, '\s+', ' ', 'g'))` and the SELECT list referenced the alias incorrectly).

**Rollback** (reverts the data only — schema stays):
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

### Phase 1c — Add proper foreign keys (PENDING)

After backfill succeeds, lock in the relationships:

```sql
ALTER TABLE elite_program_2026_roster
  ADD CONSTRAINT elite_program_2026_roster_player_id_fkey
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL;

ALTER TABLE elite_program_2026_roster
  ADD CONSTRAINT elite_program_2026_roster_application_id_fkey
    FOREIGN KEY (application_id) REFERENCES official_cohort_2026(id) ON DELETE SET NULL;
```

**Rollback**: `ALTER TABLE elite_program_2026_roster DROP CONSTRAINT <name>;`

### Phase 2 — Renames (PENDING — high risk, deferred)

User asked for:
- `elite_program_2026_roster` → `elite_program_2026`
- `official_cohort_2026` → `elite_program_applications_2026`

**Decision**: deferred until the admin UI is built (user agreed). When done, the rename SQL is trivial:

```sql
ALTER TABLE elite_program_2026_roster RENAME TO elite_program_2026;
ALTER TABLE official_cohort_2026 RENAME TO elite_program_applications_2026;
```

Postgres preserves FKs and indexes automatically across rename.

**Rollback**: rename back. No data loss.

**Critical: code references that will break the moment rename happens** (12 active files for `official_cohort_2026`, 0 for `elite_program_2026_roster`):

| File | Operation | Risk |
|---|---|---|
| `src/components/master-landing-page/MasterCheckout.jsx:146` | INSERT | HIGH — live checkout breaks |
| `src/components/master-landing-page/MasterStripeSuccess.jsx:200,213` | UPDATE + INSERT | HIGH — payment confirmation breaks |
| `src/components/landing-page-3/AcceptanceForm.jsx:165` | INSERT | HIGH — offer acceptance breaks |
| `src/DNAProfileApp/db/adminDb.js:336,342` | DELETE + SELECT | MEDIUM — admin DB helper |
| `src/components/admin/DashboardOverview.jsx:77,144` | SELECT + realtime subscription | MEDIUM — admin home |
| `src/components/admin/PlayerProfiles.jsx:43,72` | SELECT + realtime sync | MEDIUM |
| `src/components/admin/UnifiedPlayerDetail.jsx:92` | SELECT by email | MEDIUM |
| `src/components/admin/LP3Inquiries.jsx:17,34` | SELECT + realtime sync | MEDIUM |
| `src/components/admin/IndiaTour2026Dashboard.jsx:80` | SELECT | MEDIUM |
| `src/DNAProfileApp/coach/AdminProfiles.jsx:93` | SELECT | LOW |
| `src/DNAProfileApp/coach/SquadAssignment.jsx:33` | SELECT | LOW |
| `src/hooks/useRealtimeSync.js:13` | comment only | NONE |

Plus FKs pointing at `official_cohort_2026` (Postgres updates automatically on rename, no code change needed unless code references the FK name): `india_tour_2026_travellers.cohort_player_id`, `player_communications.player_id`, `player_comms_tracker.player_id`, `player_stats_seasons.cohort_id`.

### Phase 3 — Admin UI for Elite Program 2026 (PENDING)

User chose: **read-only table view first**.

Scope:
- New admin route + tab labelled "Elite Program 2026"
- Read all 88 rows of `elite_program_2026_roster` with all enriched columns
- Sortable columns, basic filter (e.g. by `is_female`, `is_ambassador`, `payment_status`)
- CSV export
- Per-row indicator if `data_quality_notes` is set (so you can spot dupes/missing)
- Optional: link `application_id` → existing UnifiedPlayerDetail flow

Location candidate: `src/components/admin/EliteProgram2026.jsx`, registered in `src/components/admin/AdminLayout.jsx` and routed via the admin router (likely `src/admin/App.jsx` or similar).

---

## Data quality findings to action separately

1. **Massive duplicate problem in `official_cohort_2026`** — 60 of 88 roster names have multiple rows (some up to 6). After backfill, run a deduplication pass to consolidate. Most likely cause: form re-submissions on payment retry.
2. **9 duplicate `players` records** — for Angad Singh Pantlya, Arihant Kalla, Arnav Bhargava, Guhika Vij, Harsh Sinha, Ishita Tiwari, Kabir Thapar, Tanish Billa, Zoe Oza.
3. **5 roster players missing from `official_cohort_2026`**: Dheer Chaudhari, Dulin Gunawardhana, Kunwar Badwal, Pranjol Josh Roy, Priyam Sharma.
4. **3 of those 5 also missing from `players`**: Dulin Gunawardhana, Kunwar Badwal, Pranjol Josh Roy. They'll have only `player_name` + the original parent fields after backfill.
5. **`sessions.pk_columns = "id, id"`** — likely a duplicate constraint on the legacy `sessions` table. Investigate when touching that area.

---

## Order of execution (recommended)

1. ✅ Audit doc → committed in `77472c8`
2. ⏳ **NEXT**: Re-run Phase 1b backfill (with the corrected `dupe_counts` SQL above)
3. Verify backfill report (how many of 88 got each piece of data)
4. Apply Phase 1c FKs
5. Build Phase 3 admin UI (read-only)
6. **PAUSE** — user uses the new UI, validates data, decides if rename is still wanted
7. Phase 2 renames (only if needed) — atomic PR with all 12 code updates + DB rename

---

## Rollback summary (TL;DR)

| Phase | Reversal cost |
|---|---|
| 1a (columns added) | DROP COLUMN x24 — trivial, no data loss except enriched values |
| 1b (backfill data) | UPDATE SET NULL — instant, idempotent |
| 1c (add FKs) | DROP CONSTRAINT x2 — trivial |
| 2 (renames) | RENAME back + revert code changes — atomic if both DB + code reverted together |
| 3 (new admin UI) | Delete the file + remove route + remove tab entry |

Phases 1a–1c are **non-destructive** to existing tables (`official_cohort_2026`, `players`) — we only read from them, never modify.

Phase 2 is the only one that affects existing dependent code paths.

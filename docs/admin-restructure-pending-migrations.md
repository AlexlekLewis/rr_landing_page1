# Pending DB Migrations (review before applying)

These changes were identified during the security audit on `feature/admin-restructure` but **were NOT applied** because they are mildly destructive (dropping tables) or potentially intentional (silent-RLS auth/recovery tables). Review and apply manually after confirming.

## 1. Drop orphaned backup tables

`sp_squad_players_backup_20260420` (2 rows) and `sp_squad_players_backup_20260421` (168 rows) are point-in-time backups left in the public schema. Neither is referenced by any code in `src/` or `api/`. The 0421 table was *publicly readable via anon key*; that's been locked down (RLS enabled, no policies) on 2026-05-02 — but the data is still there. Drop them once you've confirmed they're not needed:

```sql
-- Backup the backups first (just in case), then drop:
CREATE TABLE archive_sp_squad_players_backup_20260420 AS SELECT * FROM sp_squad_players_backup_20260420;
CREATE TABLE archive_sp_squad_players_backup_20260421 AS SELECT * FROM sp_squad_players_backup_20260421;

-- Confirm archives:
SELECT COUNT(*) FROM archive_sp_squad_players_backup_20260420;  -- should be 2
SELECT COUNT(*) FROM archive_sp_squad_players_backup_20260421;  -- should be 168

-- Drop the originals:
DROP TABLE public.sp_squad_players_backup_20260420;
DROP TABLE public.sp_squad_players_backup_20260421;
```

## 2. Confirm intent on `password_reset_tokens` and `recovery_attempts`

Both tables have RLS enabled with **zero policies** — meaning only `service_role` can access them. Per the Known Failure Library, "RLS on, zero policies" usually indicates a silent failure (data invisible to all clients). However, both tables are completely orphaned in the codebase (`grep -rn` finds no references in `src/` or `api/`).

Two interpretations:
- **(a)** They were used by a now-removed password-recovery feature. Drop them.
- **(b)** They're intended to be server-side-only (which the current setup correctly enforces).

Recommend dropping them after reading the data once to confirm nothing important is in there:

```sql
-- Inspect first:
SELECT * FROM password_reset_tokens;  -- 4 rows
SELECT * FROM recovery_attempts ORDER BY created_at DESC LIMIT 10;  -- 43 rows total

-- If safe to drop:
DROP TABLE public.password_reset_tokens;
DROP TABLE public.recovery_attempts;
```

## 3. Optional: convert all reference tables to use a shared policy helper

Five reference-data tables (`assessment_domains`, `association_competitions`, `eligibility_rules`, `vccl_regions`, `vmcu_associations`) now have explicit `Anon read reference data` + `Authenticated read reference data` policies (applied 2026-05-02). The same pattern is repeated on `competition_grades`, `competition_tiers`, etc. — could DRY into a single `is_reference_table_reader()` helper, but not urgent.

---

To apply via Supabase MCP after review: paste each SQL block into `mcp__execute_sql` or Supabase SQL Editor.

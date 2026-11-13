# India Tour 2026 EOIs — Google Sheet auto-sync

A standalone Google Sheet that mirrors `public.india_tour_2026_eoi` from Supabase.
New expressions of interest appear automatically (within ~1 minute), all on a
single tab named **India Tour 2026 EOIs**.

- **Sheet:** https://docs.google.com/spreadsheets/d/1ASp9IPb-5g_YKM4LlFs2BP45g3CupiXsehWwIu1ha4A/edit
- **Spreadsheet ID:** `1ASp9IPb-5g_YKM4LlFs2BP45g3CupiXsehWwIu1ha4A`

## How it works

```
india_tour_2026_eoi (Supabase)
        │  RLS: only authenticated can read directly
        ▼
export_india_tour_2026_eoi(p_token)   ← SECURITY DEFINER, service_role only
        ▲
        │  HTTPS POST with the service_role key (Script Properties), every 1 min
Apps Script syncIndiaTourEOIs()        ← bound to the sheet
        ▼
"India Tour 2026 EOIs" tab             ← appends new rows, deduped by id
```

The service_role key lives only in the script's Script Properties, never in
`Code.gs` — this repo is public. The export function refuses every caller except
the service_role key; `p_token` is still accepted but ignored once
`supabase/migrations/20260927120000_sheet_sync_secrets_to_vault.sql` is applied.
Each run reconciles the whole table, so it is self-healing — no rows are missed
even if the script is paused.

## One-time setup

1. Open the sheet (link above) → **Extensions → Apps Script**.
2. Replace the default `Code.gs` with [`Code.gs`](./Code.gs) in this folder. Save.
3. **Project Settings → Script properties** → add `SUPABASE_SERVICE_KEY`
   (Supabase → Project Settings → API → service_role key).
4. Run `syncIndiaTourEOIs` once → approve the Google authorization prompt.
5. Run `installTrigger` once → schedules the sync every minute.

Done. Never paste a key or token into `Code.gs` or a migration — this repo is
public. If the service_role key is rotated, update the Script Property.

## Columns

`created_at` (Melbourne time), `player_name`, `player_dob`, `player_age`,
`current_club`, `highest_level`, `primary_skill`, `secondary_skill`, `is_over_18`, `player_email`, `player_phone`,
`guardian1_name`, `guardian1_relationship`, `guardian1_email`, `guardian1_phone`,
`guardian2_name`, `guardian2_relationship`, `guardian2_email`, `guardian2_phone`,
`consent_contact`, `referral_name`, `referral_code`, `utm_source`, `utm_medium`,
`utm_campaign`, `page_referrer`, `id`.

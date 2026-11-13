# Power Game Inquiries 2026 — Google Sheet auto-sync

A standalone Google Sheet that mirrors `public.power_game_inquiries` from Supabase.
New inquiries appear automatically (within ~1 minute), all on a single tab named
**Power Game Inquiries 2026**.

- **Sheet:** https://docs.google.com/spreadsheets/d/18y5BxkTAEict_rlrlpYSzhXovf_5554Kv2G7L9A_uNs/edit
- **Spreadsheet ID:** `18y5BxkTAEict_rlrlpYSzhXovf_5554Kv2G7L9A_uNs`

## How it works

```
power_game_inquiries (Supabase)
        │  RLS: only authenticated can read directly
        ▼
export_power_game_inquiries(p_token)   ← SECURITY DEFINER, service_role only
        ▲
        │  HTTPS POST with the service_role key (Script Properties), every 1 min
Apps Script syncPowerGameInquiries()   ← bound to the sheet
        ▼
"Power Game Inquiries 2026" tab        ← appends new rows, deduped by id
```

The service_role key lives only in the script's Script Properties, never in
`Code.gs` — this repo is public. The export function refuses every caller except
the service_role key; `p_token` is still accepted but ignored once
`supabase/migrations/20260927120000_sheet_sync_secrets_to_vault.sql` is applied.
Each run reconciles the whole table, so it is self-healing — no rows are missed
even if the script is paused.

## One-time setup

1. Open the sheet → **Extensions → Apps Script**.
2. Replace the default `Code.gs` with [`Code.gs`](./Code.gs) in this folder. Save.
3. **Project Settings → Script properties** → add `SUPABASE_URL` and
   `SUPABASE_SERVICE_KEY` (optional: `SHEET_ID`) — see the SETUP comment in `Code.gs`.
4. Run `syncPowerGameInquiries` once → approve the Google authorization prompt.
5. Run `installTrigger` once → schedules the sync every minute.

Done. Never paste a key or token into `Code.gs` or a migration — this repo is
public. If the service_role key is rotated, update the Script Property.

## Columns

`created_at` (Melbourne time), `player_name`, `player_dob`, `parent_name`,
`parent_phone`, `parent_email`, `suburb`, `city`, `source`, `program`,
`utm_source`, `utm_medium`, `utm_campaign`, `page_referrer`, `id`.

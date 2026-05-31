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
export_power_game_inquiries(p_token)   ← SECURITY DEFINER, token-gated RPC
        ▲
        │  HTTPS POST { p_token } with the public anon key, every 1 min
Apps Script syncPowerGameInquiries()   ← bound to the sheet
        ▼
"Power Game Inquiries 2026" tab        ← appends new rows, deduped by id
```

The sheet never holds a powerful database key. The only secret is a narrow read
token (`SYNC_TOKEN`) that unlocks just this one read function. Each run reconciles
the whole table, so it is self-healing — no rows are missed even if the script is
paused.

## One-time setup

1. Open the sheet → **Extensions → Apps Script**.
2. Replace the default `Code.gs` with [`Code.gs`](./Code.gs) in this folder. Save.
3. Run `syncPowerGameInquiries` once → approve the Google authorization prompt.
4. Run `installTrigger` once → schedules the sync every minute.

Done. To rotate the token later, change it in both `Code.gs` (`SYNC_TOKEN`) and the
`export_power_game_inquiries` migration, then re-apply the migration.

## Columns

`created_at` (Melbourne time), `player_name`, `player_dob`, `parent_name`,
`parent_phone`, `parent_email`, `suburb`, `city`, `source`, `program`,
`utm_source`, `utm_medium`, `utm_campaign`, `page_referrer`, `id`.

// ============================================================
// Vercel Serverless Function — Sync Holiday Registration → Google Sheets
// POST /api/sync-holiday-row
// ============================================================
// Triggered by a Supabase Database Webhook on INSERT/UPDATE of any
// holiday-program registration table (holiday_clinic_registrations,
// junior_royals_july_holidays_registrations, future tables).
//
// Looks up the active workbook + per-location tab from holiday_program_sheets
// (keyed by source_table), then:
//   INSERT → append a new row to the correct location tab
//   UPDATE → find the row by registration id and overwrite payment columns
//
// Idempotent: re-running with the same row id will update in place, never
// duplicate. Safe to replay missed webhook deliveries.
//
// Required env vars in Vercel:
//   SUPABASE_SERVICE_ROLE_KEY               — for config lookup + back-fill
//   GOOGLE_SERVICE_ACCOUNT_JSON             — same JSON used by export-to-sheets
//   SUPABASE_WEBHOOK_SECRET                 — shared secret in webhook header
//   (optional) VITE_SUPABASE_URL            — defaults to RRA project
//
// Supabase Database Webhook configuration (in Supabase dashboard):
//   Method:  POST
//   URL:     https://<your-vercel-host>/api/sync-holiday-row
//   Headers: x-webhook-secret: <SUPABASE_WEBHOOK_SECRET value>
//   Events:  INSERT, UPDATE on the registration tables you want synced
// ============================================================

import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: { bodyParser: { sizeLimit: '256kb' } },
};

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _auth = null;
const getAuth = () => {
  if (_auth) return _auth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var missing');
  const credentials = JSON.parse(raw);
  _auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  return _auth;
};

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL
           || process.env.VITE_SUPABASE_URL
           || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var missing');
  _supabase = createClient(url, key);
  return _supabase;
};

// Column order written to each location tab. Keep stable — backfills and
// in-place updates rely on positional column indexes.
const SHEET_HEADERS = [
  'Registration ID',
  'Submitted At (Melbourne)',
  'Player Name',
  'Player Age',
  'Cricket Type',
  'Primary Club',
  'Suburb',
  'Parent Name',
  'Parent Email',
  'Parent Phone',
  'Location',
  'Shirt Size',
  'Has Shirt',                 // only set on jr_july table; blank otherwise
  'Waitlist?',
  'Payment Status',
  'Amount Paid (AUD)',
  'Paid At (Melbourne)',
  'Stripe Session',
  'Receipt URL',
  'Shirt Distributed',         // admin toggles in dashboard on handover day
  'Distributed At (Melbourne)',
  'Admin Notes',
  'Terms',
  'Player Code',
  'Parent Code',
  'Social Media Consent',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Referrer',
];

const fmtMelb = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-AU', {
      timeZone: 'Australia/Melbourne',
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

const fmtMoney = (cents) =>
  typeof cents === 'number' ? `$${(cents / 100).toFixed(2)}` : '';

const yesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '');

// Build the positional row from a registration record. Falls back to '' for
// columns the source table doesn't have (e.g. has_shirt on the April table).
const buildRow = (r) => ([
  r.id || '',
  fmtMelb(r.created_at),
  r.player_name || '',
  r.player_age ?? '',
  r.player_gender || '',
  r.primary_club || '',
  r.suburb || '',
  r.parent_name || '',
  r.parent_email || '',
  r.parent_phone || '',
  r.location || '',
  r.shirt_size || '',
  yesNo(r.has_shirt),
  yesNo(r.on_waitlist),
  r.payment_status || 'pending',
  fmtMoney(r.amount_paid_cents),
  fmtMelb(r.paid_at),
  r.stripe_session_id || '',
  r.receipt_url || '',
  yesNo(r.shirt_distributed),
  fmtMelb(r.shirt_distributed_at),
  r.admin_notes || '',
  yesNo(r.accept_terms),
  yesNo(r.accept_player_code),
  yesNo(r.accept_parent_code),
  yesNo(r.accept_social_media),
  r.utm_source || '',
  r.utm_medium || '',
  r.utm_campaign || '',
  r.page_referrer || '',
]);

// Pick the tab to write to. Waitlist rows go to waitlist_tab if configured;
// otherwise fall through to the location's normal tab.
const resolveTab = (cfg, record) => {
  if (record.on_waitlist && cfg.waitlist_tab) return cfg.waitlist_tab;
  const map = cfg.location_to_tab || {};
  return map[record.location] || null;
};

// Find the row index (1-based, including header) of an existing registration
// id in the given tab. Returns null if not found.
const findRowByRegistrationId = async (sheets, spreadsheetId, tabName, registrationId) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A:A`,
    majorDimension: 'COLUMNS',
  });
  const ids = res.data.values?.[0] || [];
  // ids[0] is the header. Data rows start at ids[1] → sheet row 2.
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === registrationId) return i + 1; // 1-based sheet row
  }
  return null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Shared-secret verification — Supabase webhooks let you add custom headers.
  // If SUPABASE_WEBHOOK_SECRET is set in Vercel, require it match.
  const expected = process.env.SUPABASE_WEBHOOK_SECRET;
  if (expected) {
    const got = req.headers['x-webhook-secret'];
    if (got !== expected) {
      console.warn('sync-holiday-row: bad/missing webhook secret');
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  // Supabase DB webhook payload shape:
  //   { type: 'INSERT'|'UPDATE'|'DELETE', table, schema, record, old_record }
  const { type, table, record, old_record } = req.body || {};
  if (!type || !table) return res.status(400).json({ error: 'invalid payload' });
  if (type === 'DELETE') {
    return res.status(200).json({ ignored: true, reason: 'delete events not synced' });
  }
  if (!record?.id) {
    return res.status(400).json({ error: 'record.id required' });
  }

  let supabase, auth, sheets;
  try {
    supabase = getSupabase();
    auth = getAuth();
    sheets = google.sheets({ version: 'v4', auth });
  } catch (err) {
    console.error('sync-holiday-row setup failed:', err.message);
    return res.status(500).json({ error: err.message });
  }

  // Look up the active workbook + tab map for this source table.
  const { data: cfg, error: cfgErr } = await supabase
    .from('holiday_program_sheets')
    .select('*')
    .eq('source_table', table)
    .eq('is_active', true)
    .maybeSingle();
  if (cfgErr) {
    console.error('config lookup failed:', cfgErr);
    return res.status(500).json({ error: cfgErr.message });
  }
  if (!cfg || !cfg.workbook_id) {
    return res.status(200).json({ ignored: true, reason: 'no active workbook for table', table });
  }

  const tabName = resolveTab(cfg, record);
  if (!tabName) {
    return res.status(200).json({
      ignored: true,
      reason: 'no tab configured for location',
      location: record.location,
    });
  }

  const row = buildRow(record);

  try {
    if (type === 'INSERT') {
      // Append. If a row with this id somehow already exists, prefer update
      // semantics so replays are idempotent.
      const existing = await findRowByRegistrationId(sheets, cfg.workbook_id, tabName, record.id);
      if (existing) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: cfg.workbook_id,
          range: `${tabName}!A${existing}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [row] },
        });
      } else {
        await sheets.spreadsheets.values.append({
          spreadsheetId: cfg.workbook_id,
          range: `${tabName}!A1`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [row] },
        });
      }
    } else if (type === 'UPDATE') {
      // If the location changed, the row may belong to a different tab now.
      // Delete-from-old + insert-to-new is messy; for the holiday programs
      // we never expect a location swap, so just update in place on the
      // location's current tab. If not found, append.
      const existing = await findRowByRegistrationId(sheets, cfg.workbook_id, tabName, record.id);
      if (existing) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: cfg.workbook_id,
          range: `${tabName}!A${existing}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [row] },
        });
      } else {
        // Possibly a location change from an old tab. Check the old tab and,
        // if found there, blank it. Then append to the new tab.
        const oldLoc = old_record?.location;
        if (oldLoc && oldLoc !== record.location) {
          const oldTab = (cfg.location_to_tab || {})[oldLoc];
          if (oldTab) {
            const oldRow = await findRowByRegistrationId(sheets, cfg.workbook_id, oldTab, record.id);
            if (oldRow) {
              await sheets.spreadsheets.values.update({
                spreadsheetId: cfg.workbook_id,
                range: `${oldTab}!A${oldRow}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [new Array(SHEET_HEADERS.length).fill('')] },
              });
            }
          }
        }
        await sheets.spreadsheets.values.append({
          spreadsheetId: cfg.workbook_id,
          range: `${tabName}!A1`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [row] },
        });
      }
    }

    // Touch last_synced_at — best-effort, don't fail the request if this errors.
    await supabase
      .from('holiday_program_sheets')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', cfg.id);

    return res.status(200).json({
      ok: true,
      table,
      type,
      tab: tabName,
      registration_id: record.id,
    });
  } catch (err) {
    console.error('sync-holiday-row sheets write failed:', err);
    const msg = err.errors?.[0]?.message || err.message || 'unknown';
    return res.status(500).json({ error: msg });
  }
}

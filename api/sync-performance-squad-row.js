// ============================================================
// Vercel Serverless Function — Sync Performance Squad lead → Google Sheets
// POST /api/sync-performance-squad-row
// ============================================================
// Mirrors api/sync-holiday-row.js. Triggered by a Supabase Database Webhook on
// INSERT/UPDATE of public.performance_squad_leads. Looks up the active workbook
// + per-centre tab map from holiday_program_sheets (keyed by source_table),
// then appends a new row to the correct centre tab, or updates it in place by
// registration id. Every registration is synced — paid or not — because the
// trial fee is paid on Stripe after this row is written.
//
// Idempotent: re-running with the same id updates in place, never duplicates.
//
// Required env vars in Vercel (all already set for the holiday sync):
//   SUPABASE_SERVICE_ROLE_KEY     — config lookup
//   GOOGLE_SERVICE_ACCOUNT_JSON   — service account, Editor on the workbook
//   SUPABASE_WEBHOOK_SECRET       — shared secret, matched against x-webhook-secret
//   (optional) VITE_SUPABASE_URL  — defaults to the RRA project
//
// Supabase Database Webhook configuration:
//   Method:  POST
//   URL:     https://rramelbourne.com/api/sync-performance-squad-row
//   Headers: x-webhook-secret: <SUPABASE_WEBHOOK_SECRET value>
//   Events:  INSERT, UPDATE on public.performance_squad_leads
// ============================================================

import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: { bodyParser: { sizeLimit: '256kb' } },
};

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive', // create + share the workbook on first run
];

const SUPABASE_URL_FALLBACK = 'https://pudldzgmluwoocwxtzhw.supabase.co';
const SOURCE_TABLE = 'performance_squad_leads';

// First-run provisioning. If no active workbook is configured, the function
// creates one (a tab per active centre), shares it to these addresses, and
// persists the config so every later run reuses it — no manual setup.
const WORKBOOK_TITLE = 'Performance Squads — Registrations';
const SHARE_WITH = ['andy@rramelbourne.com', 'info@rramelbourne.com', 'alexleklewis@gmail.com'];
const CENTRE_TABS = {
  'north-melbourne': 'North Melbourne',
  'south-east-melbourne': 'South-East Melbourne',
};

let _auth = null;
const getAuth = () => {
  if (_auth) return _auth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var missing');
  _auth = new google.auth.GoogleAuth({ credentials: JSON.parse(raw), scopes: SCOPES });
  return _auth;
};

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || SUPABASE_URL_FALLBACK;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var missing');
  _supabase = createClient(url, key);
  return _supabase;
};

// Friendly centre names for the sheet (slugs are what the form stores).
const CENTRE_NAMES = {
  'north-melbourne': 'North Melbourne',
  'south-east-melbourne': 'South-East Melbourne',
  'west-melbourne': 'West Melbourne',
  'east-melbourne': 'East Melbourne',
};

// What each signup type reads as in the sheet.
const SIGNUP_LABELS = {
  trial: 'Trial',
  registration_weekly: 'Registration Fee (Weekly)',
  registration_upfront: 'Registration Fee (Upfront)',
};

// Column order per centre tab. Keep stable — in-place updates use positional
// indexes.
const SHEET_HEADERS = [
  'Registration ID',
  'Submitted At (Melbourne)',
  'Player Name',
  'Player Age (years)',
  'Parent / Guardian Name',
  'Email',
  'Phone',
  'Current Club',
  'Centre',
  'Signing Up For',
  'Playing Role',
  'Trial Sessions (count)',
  'Trial Session Dates',
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

const buildRow = (r) => ([
  r.id || '',
  fmtMelb(r.created_at),
  r.player_name || '',
  r.player_age ?? '',
  r.parent_name || '',
  r.email || '',
  r.phone || '',
  r.club || '',
  CENTRE_NAMES[r.preferred_centre] || r.preferred_centre || '',
  SIGNUP_LABELS[r.entry_type] || r.entry_type || '',
  r.playing_role || '',
  r.trial_sessions ?? '',
  Array.isArray(r.trial_session_dates) ? r.trial_session_dates.join(' | ') : '',
  r.utm_source || '',
  r.utm_medium || '',
  r.utm_campaign || '',
  r.page_referrer || '',
]);

// Which tab a row belongs in, by centre.
const resolveTab = (cfg, record) => {
  const map = cfg.location_to_tab || {};
  return map[record.preferred_centre] || null;
};

const findRowByRegistrationId = async (sheets, spreadsheetId, tabName, registrationId) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A:A`,
    majorDimension: 'COLUMNS',
  });
  const ids = res.data.values?.[0] || [];
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === registrationId) return i + 1; // 1-based sheet row
  }
  return null;
};

// Make sure the tab exists AND has our header row. Self-healing against a fresh
// workbook, same idea as pgpSheets.ensureTab.
const ensureTab = async (sheets, spreadsheetId, tabName) => {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = (meta.data.sheets || []).some((s) => s.properties?.title === tabName);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] },
    });
  }
  // Header row: write it if A1 is empty.
  const head = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A1:A1`,
  });
  if (!head.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [SHEET_HEADERS] },
    });
  }
};

// Resolve the config row; create + share the workbook and persist config on
// first run. Mirrors the coaches-day self-provisioning pattern.
const resolveConfig = async (supabase, sheets, drive) => {
  const { data: cfg } = await supabase
    .from('holiday_program_sheets')
    .select('*')
    .eq('source_table', SOURCE_TABLE)
    .eq('is_active', true)
    .maybeSingle();
  if (cfg?.workbook_id) return cfg;

  // First run — create the workbook with a tab per centre.
  const created = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: WORKBOOK_TITLE },
      sheets: Object.values(CENTRE_TABS).map((title) => ({ properties: { title } })),
    },
    fields: 'spreadsheetId,spreadsheetUrl',
  });
  const workbookId = created.data.spreadsheetId;
  const workbookUrl = created.data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${workbookId}`;

  // Header each centre tab.
  for (const title of Object.values(CENTRE_TABS)) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: workbookId,
      range: `${title}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [SHEET_HEADERS] },
    });
  }

  // Share (best-effort — a failure here must not stop the sync).
  for (const email of SHARE_WITH) {
    try {
      await drive.permissions.create({
        fileId: workbookId,
        sendNotificationEmail: false,
        requestBody: { type: 'user', role: 'writer', emailAddress: email },
      });
    } catch (e) {
      console.warn(`sync-performance-squad-row: could not share with ${email}:`, e.message);
    }
  }

  const { data: saved } = await supabase
    .from('holiday_program_sheets')
    .upsert({
      program_slug: 'performance_squads',
      program_label: 'Performance Squads',
      source_table: SOURCE_TABLE,
      workbook_id: workbookId,
      workbook_url: workbookUrl,
      location_to_tab: CENTRE_TABS,
      is_active: true,
    }, { onConflict: 'program_slug' })
    .select('*')
    .maybeSingle();

  return saved || { workbook_id: workbookId, location_to_tab: CENTRE_TABS };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const expected = process.env.SUPABASE_WEBHOOK_SECRET;
  if (expected) {
    const got = req.headers['x-webhook-secret'];
    if (got !== expected) {
      console.warn('sync-performance-squad-row: bad/missing webhook secret');
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  const { type, table, record, old_record } = req.body || {};
  if (!type || !table) return res.status(400).json({ error: 'invalid payload' });
  if (type === 'DELETE') {
    return res.status(200).json({ ignored: true, reason: 'delete events not synced' });
  }
  if (!record?.id) return res.status(400).json({ error: 'record.id required' });

  let supabase, sheets, drive;
  try {
    supabase = getSupabase();
    const auth = getAuth();
    sheets = google.sheets({ version: 'v4', auth });
    drive = google.drive({ version: 'v3', auth });
  } catch (err) {
    console.error('sync-performance-squad-row setup failed:', err.message);
    return res.status(500).json({ error: err.message });
  }

  let cfg;
  try {
    cfg = await resolveConfig(supabase, sheets, drive);
  } catch (err) {
    console.error('config resolve/provision failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
  if (!cfg || !cfg.workbook_id) {
    return res.status(200).json({ ignored: true, reason: 'no active workbook for performance_squad_leads' });
  }

  const tabName = resolveTab(cfg, record);
  if (!tabName) {
    return res.status(200).json({
      ignored: true,
      reason: 'no tab configured for centre',
      centre: record.preferred_centre,
    });
  }

  const row = buildRow(record);

  try {
    await ensureTab(sheets, cfg.workbook_id, tabName);

    if (type === 'INSERT' || type === 'UPDATE') {
      // If the centre changed on update, clear the row from the old tab first.
      if (type === 'UPDATE' && old_record?.preferred_centre
          && old_record.preferred_centre !== record.preferred_centre) {
        const oldTab = (cfg.location_to_tab || {})[old_record.preferred_centre];
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
    }

    await supabase
      .from('holiday_program_sheets')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', cfg.id);

    return res.status(200).json({ ok: true, type, tab: tabName, registration_id: record.id });
  } catch (err) {
    console.error('sync-performance-squad-row sheets write failed:', err);
    const msg = err.errors?.[0]?.message || err.message || 'unknown';
    return res.status(500).json({ error: msg });
  }
}

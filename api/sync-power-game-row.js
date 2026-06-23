// ============================================================
// Vercel Serverless Function — Sync Power Game Application → Google Sheets
// POST /api/sync-power-game-row
// ============================================================
// Mirrors /api/sync-holiday-row but for a single Power Game workbook/tab.
// Triggered by a Supabase Database Webhook on INSERT/UPDATE of
// power_game_applications. Appends a new row, or updates in place by id
// (idempotent — safe to replay missed webhook deliveries).
//
// Required env vars in Vercel:
//   SUPABASE_SERVICE_ROLE_KEY     — (not required here but kept for parity)
//   GOOGLE_SERVICE_ACCOUNT_JSON   — same service-account JSON as holiday sync
//   POWER_GAME_SHEET_ID           — the Google Sheet (workbook) ID to write to
//   POWER_GAME_SHEET_TAB          — tab name (defaults to 'Applications')
//   SUPABASE_WEBHOOK_SECRET       — shared secret sent in x-webhook-secret
//
// Supabase Database Webhook configuration (Supabase dashboard):
//   Method:  POST
//   URL:     https://<your-vercel-host>/api/sync-power-game-row
//   Headers: x-webhook-secret: <SUPABASE_WEBHOOK_SECRET value>
//   Events:  INSERT, UPDATE on public.power_game_applications
//
// IMPORTANT: share the target Google Sheet with the service account's
// client_email (from GOOGLE_SERVICE_ACCOUNT_JSON) as an Editor.
// ============================================================

import { google } from 'googleapis';

export const config = {
  api: { bodyParser: { sizeLimit: '256kb' } },
};

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

let _auth = null;
const getAuth = () => {
  if (_auth) return _auth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var missing');
  const credentials = JSON.parse(raw);
  _auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  return _auth;
};

// Column order written to the tab. Keep stable — in-place updates rely on
// positional column indexes. Includes UTM source/medium/campaign + referrer.
const SHEET_HEADERS = [
  'Application ID',
  'Submitted At (Melbourne)',
  'Application Type',
  'Player First Name',
  'Player Last Name',
  'Player Age',
  'Date of Birth',
  'Cricket Type',
  'Player Email',
  'Player Phone',
  'Suburb',
  'Current Level',
  'Capability Statement',
  'PlayCricket Profile',
  'Current Club(s)',
  'Bio',
  'Career Goals',
  'CV URL',
  'Parent/Guardian 1 Name',
  'Parent/Guardian 1 Email',
  'Parent/Guardian 1 Phone',
  'Parent/Guardian 2 Name',
  'Parent/Guardian 2 Email',
  'Parent/Guardian 2 Phone',
  'Venue',
  'Age Group',
  'Session Day',
  'Session Time',
  'Phase',
  'Terms',
  'Player Code',
  'Parent Code',
  'Social Media Consent',
  'Minimum Standard Ack',
  'Ability Standard Ack',
  'Uniform Selection',
  'Uniform Total (AUD)',
  'Payment Status',
  'Amount Paid (AUD)',
  'Paid At (Melbourne)',
  'Stripe Session',
  'Receipt URL',
  'Status',
  'Admin Notes',
  'Source',
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

const buildRow = (r) => ([
  r.id || '',
  fmtMelb(r.created_at),
  r.application_type === 'capability' ? 'Capability Request' : 'Standard',
  r.first_name || '',
  r.last_name || '',
  r.age ?? '',
  r.dob || '',
  r.cricket_type || '',
  r.email || '',
  r.phone || '',
  r.suburb || '',
  r.current_level || '',
  r.capability_statement || '',
  r.profile_link || '',
  r.current_club || r.club || '',
  r.bio || '',
  r.goals || '',
  r.cv_url || '',
  r.parent1_name || '',
  r.parent1_email || '',
  r.parent1_phone || '',
  r.parent2_name || '',
  r.parent2_email || '',
  r.parent2_phone || '',
  r.venue || '',
  r.age_group || '',
  r.session_day || '',
  r.session_time || '',
  r.phase || '',
  yesNo(r.accept_terms),
  yesNo(r.accept_player_code),
  yesNo(r.accept_parent_code),
  yesNo(r.accept_social_media),
  yesNo(r.accept_playing_standard),
  yesNo(r.accept_ability_standard),
  r.uniform_selection || '',
  r.uniform_total_cents ? `$${(r.uniform_total_cents / 100).toFixed(2)}` : '',
  r.payment_status || 'pending',
  fmtMoney(r.amount_paid_cents),
  fmtMelb(r.paid_at),
  r.stripe_session_id || '',
  r.receipt_url || '',
  r.status || 'pending',
  r.admin_notes || '',
  r.source || 'power-game-program',
  r.utm_source || '',
  r.utm_medium || '',
  r.utm_campaign || '',
  r.page_referrer || '',
]);

// Route to a tab based on application type. Standard applications go to the
// main tab; capability requests go to a clearly separated tab.
const resolveTab = (record) => {
  const standardTab = process.env.POWER_GAME_SHEET_TAB || 'Applications';
  const capabilityTab = process.env.POWER_GAME_CAPABILITY_TAB || 'Capability Requests';
  return record.application_type === 'capability' ? capabilityTab : standardTab;
};

// Ensure the header row exists exactly once at the top of the tab.
const ensureHeader = async (sheets, spreadsheetId, tabName) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!1:1`,
  });
  const firstRow = res.data.values?.[0] || [];
  if (firstRow.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [SHEET_HEADERS] },
    });
  }
};

// Find the 1-based sheet row of an existing application id (column A).
const findRowById = async (sheets, spreadsheetId, tabName, id) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A:A`,
    majorDimension: 'COLUMNS',
  });
  const ids = res.data.values?.[0] || [];
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === id) return i + 1;
  }
  return null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Shared-secret verification (matches holiday sync).
  const expected = process.env.SUPABASE_WEBHOOK_SECRET;
  if (expected) {
    const got = req.headers['x-webhook-secret'];
    if (got !== expected) {
      console.warn('sync-power-game-row: bad/missing webhook secret');
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  const { type, table, record } = req.body || {};
  if (!type || !table) return res.status(400).json({ error: 'invalid payload' });
  if (type === 'DELETE') {
    return res.status(200).json({ ignored: true, reason: 'delete events not synced' });
  }
  if (!record?.id) return res.status(400).json({ error: 'record.id required' });

  const spreadsheetId = process.env.POWER_GAME_SHEET_ID;
  const tabName = resolveTab(record);
  if (!spreadsheetId) {
    return res.status(503).json({ ignored: true, reason: 'POWER_GAME_SHEET_ID not configured' });
  }

  let sheets;
  try {
    const auth = getAuth();
    sheets = google.sheets({ version: 'v4', auth });
  } catch (err) {
    console.error('sync-power-game-row setup failed:', err.message);
    return res.status(500).json({ error: err.message });
  }

  const row = buildRow(record);

  try {
    await ensureHeader(sheets, spreadsheetId, tabName);
    const existing = await findRowById(sheets, spreadsheetId, tabName, record.id);
    if (existing) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${tabName}!A${existing}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
      return res.status(200).json({ ok: true, action: 'updated', row: existing });
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    return res.status(200).json({ ok: true, action: 'appended' });
  } catch (err) {
    console.error('sync-power-game-row sheet write failed:', err);
    return res.status(500).json({ error: err.message });
  }
}

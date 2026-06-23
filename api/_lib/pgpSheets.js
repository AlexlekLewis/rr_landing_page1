// ============================================================
// Shared Google Sheets helpers for the Power Game workbook.
// ============================================================
// Used by both api/sync-power-game-row.js (real-time, if a DB webhook is wired)
// and api/sync-pgp-leads.js (hourly reconcile). Centralises the auth client, the
// "Paid players" column layout, and a SELF-HEALING ensureTab() that creates the
// worksheet if it doesn't exist yet — so neither sync throws "Unable to parse
// range" against a brand-new workbook tab.
// Env: GOOGLE_SERVICE_ACCOUNT_JSON (service account shared as Editor on the book).
// ============================================================
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let _auth = null;
export const getAuth = () => {
  if (_auth) return _auth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var missing');
  _auth = new google.auth.GoogleAuth({ credentials: JSON.parse(raw), scopes: SCOPES });
  return _auth;
};

export const getSheets = () => google.sheets({ version: 'v4', auth: getAuth() });

// ------------------------------------------------------------
// "Paid players" column layout (kept stable — in-place updates rely on positional
// column indexes). Mirrors the create-on-payment record fields.
// ------------------------------------------------------------
export const PAID_HEADERS = [
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

export const fmtMelb = (iso) => {
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

export const buildPaidRow = (r) => ([
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

// ------------------------------------------------------------
// SELF-HEALING: ensure the worksheet (tab) exists; create it if missing.
// Returns true if it created the tab. Never throws on an already-present tab.
// ------------------------------------------------------------
export const ensureTab = async (sheets, spreadsheetId, tabName) => {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties.title',
  });
  const exists = (meta.data.sheets || []).some(
    (s) => s.properties?.title === tabName,
  );
  if (exists) return false;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] },
  });
  return true;
};

// Write the header row at A1 only if row 1 is currently empty.
export const ensureHeader = async (sheets, spreadsheetId, tabName, headers) => {
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
      requestBody: { values: [headers] },
    });
  }
};

// Find the 1-based sheet row of an existing Application ID (column A).
export const findRowById = async (sheets, spreadsheetId, tabName, id) => {
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

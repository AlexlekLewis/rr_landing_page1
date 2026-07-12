// ============================================================
// Independent Google Sheet sync for The Coaches Session (/coaches-day).
// ============================================================
// Kept SEPARATE from the Power Game workbook: registrations land in their own
// standalone workbook so the coaches list is fully independent.
//
// SELF-PROVISIONING: on the first run it creates the workbook, shares it to Alex
// (view/edit), and stores the new spreadsheet id in public.coaches_day_config so
// every later run reuses it. No manual "share with the service account" step and
// no new Vercel env var — it reuses GOOGLE_SERVICE_ACCOUNT_JSON + the existing
// 30-min sync-pgp-leads cron.
//
// Full rebuild each run from coaches_day_registrations (tiny table, idempotent,
// chronological). Wrapped in try/catch by the caller so it can never affect the
// Power Game reconcile.
// ============================================================
import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive', // needed to create + share the new file
];

// Who the new workbook is shared with (writers).
const SHARE_WITH = ['alex.lewis@rramelbourne.com', 'alexleklewis@gmail.com'];

const WORKBOOK_TITLE = 'Royals Way Coaches Session — Registrations';
const TAB_NAME = 'Coaches';

const HEADERS = [
  'Registered (Melbourne)',
  'Coach Name',
  'Email',
  'Phone',
  'Playing History',
  'Highest Level Played',
  'Current Coaching Role(s)',
  'Loves About Coaching',
  'Hopes To Learn From The Day',
  'Consent',
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
      year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

const yesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '');

const coachRow = (r) => ([
  fmtMelb(r.created_at),
  r.coach_name || '',
  r.email || '',
  // Leading apostrophe keeps Sheets from stripping a leading 0 off the number.
  r.phone ? `'${r.phone}` : '',
  r.playing_history || '',
  r.highest_level || '',
  r.coaching_roles || '',
  r.love_coaching || '',
  r.hope_to_learn || '',
  yesNo(r.accept_terms),
  r.source || '',
  r.utm_source || '',
  r.utm_medium || '',
  r.utm_campaign || '',
  r.page_referrer || '',
]);

let _auth = null;
const getAuth = () => {
  if (_auth) return _auth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var missing');
  _auth = new google.auth.GoogleAuth({ credentials: JSON.parse(raw), scopes: SCOPES });
  return _auth;
};

// Resolve the workbook id from config; create + share + persist it on first run.
async function resolveSheetId(supabase, sheets, drive) {
  const { data: cfg } = await supabase
    .from('coaches_day_config')
    .select('sheet_id')
    .eq('singleton', true)
    .maybeSingle();
  if (cfg?.sheet_id) return cfg.sheet_id;

  // First run — create the independent workbook.
  const created = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: WORKBOOK_TITLE },
      sheets: [{ properties: { title: TAB_NAME } }],
    },
    fields: 'spreadsheetId,spreadsheetUrl',
  });
  const sheetId = created.data.spreadsheetId;
  const sheetUrl = created.data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetId}`;

  // Share it so Alex can open it (best-effort; failure here must not stop the sync).
  for (const email of SHARE_WITH) {
    try {
      await drive.permissions.create({
        fileId: sheetId,
        sendNotificationEmail: false,
        requestBody: { type: 'user', role: 'writer', emailAddress: email },
      });
    } catch (e) {
      console.warn(`coachesSheet: could not share with ${email}:`, e.message);
    }
  }

  await supabase
    .from('coaches_day_config')
    .upsert({ singleton: true, sheet_id: sheetId, sheet_url: sheetUrl }, { onConflict: 'singleton' });

  return sheetId;
}

// Full rebuild of the Coaches tab from coaches_day_registrations.
export async function reconcileCoaches(supabase) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  const spreadsheetId = await resolveSheetId(supabase, sheets, drive);

  const { data, error } = await supabase
    .from('coaches_day_registrations')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  const rows = (data || []).map(coachRow);

  // Header (always) + clear body + write rows.
  await sheets.spreadsheets.values.update({
    spreadsheetId, range: `${TAB_NAME}!A1`, valueInputOption: 'USER_ENTERED',
    requestBody: { values: [HEADERS] },
  });
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${TAB_NAME}!A2:O100000` });
  if (rows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: `${TAB_NAME}!A2`, valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });
  }
  return { spreadsheetId, registrations: rows.length };
}

// ============================================================
// Vercel Serverless Function — mirror Power Game Masterclass registrations
// into their own Google Sheet. Runs on its own 4-hourly cron.
// GET (Vercel Cron) or POST (admin manual run).
// ============================================================
// Target: the standalone workbook "Power Game Masterclass — Sept 2026 —
// Registrations" (MASTERCLASS_SHEET_ID), owned by Alex and shared to the sync
// service account as Editor. It is NOT the Power Game 2026 book.
//
// !! NEVER let the service account create the workbook itself. That SA has
// Google Drive storage quota 0, so any file it owns dies within days — 404 even
// to the SA, and writes start failing 403. Every sync target must be created by
// a human and shared to the SA.
//
// ── THE ONE RULE THIS FILE EXISTS TO HONOUR ──────────────────
// Marielle works in this sheet by hand. The sync must never destroy her work.
// So this sync is NON-DESTRUCTIVE. Specifically, it:
//
//   • never clears anything,
//   • never deletes a row,
//   • never writes outside columns A–X (SYNC_LAST_COL),
//   • only rewrites a row when that row's data has ACTUALLY CHANGED in the
//     database — an unchanged registration's row is not touched at all,
//   • only writes the header row if row 1 is empty, so a relabelled column
//     stays relabelled.
//
// The column contract, stated once and enforced above:
//   A–X    owned by the sync. The database is the truth. Hand-edits here WILL
//          be overwritten the next time that registration changes.
//   Y →    Marielle's. The sync does not read, write, clear or even look at it.
//          Notes, follow-up status, payment ticks — anything — is safe there.
//
// Rows are matched by Registration ID (column A), not by position, so sorting,
// filtering or inserting rows in the sheet cannot mis-align anyone's notes.
// New registrations are appended at the bottom.
//
// Deliberately a SEPARATE endpoint from sync-pgp-leads.js: different schedule
// (every 4 hours), different workbook, and isolation — a failure here can't
// touch the paid-players and Stripe leads reconciles that money depends on.
//
// !! The "Paid?" column cannot be trusted as a payment record. Nothing in this
// codebase ever sets masterclass_registrations.paid — the form redirects
// straight to a Stripe Payment Link and Stripe never writes back. It is
// mirrored so it works the moment someone fills it in, and its header says so
// in plain words. Stripe is the truth today.
//
// Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` (GET); a
// dashboard admin can also POST with their Supabase JWT to run it on demand.
// Env: SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      GOOGLE_SERVICE_ACCOUNT_JSON, MASTERCLASS_SHEET_ID, CRON_SECRET,
//      MASTERCLASS_TAB (optional — defaults to "Registrations").
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { getSheets, ensureTab, ensureHeader } from './_lib/pgpSheets.js';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

const TAB = process.env.MASTERCLASS_TAB || 'Registrations';
const GUIDE_TAB = 'How this sheet works';

// Price the player is due to pay, from the shirt choice made on the form.
// $240 covers both Sundays; the shirt is a $29.95 optional line item they untick
// at Stripe checkout if they already own one.
const COURSE_CENTS = 24000;
const SHIRT_CENTS = 2995;

// Headers say what the column MEANS, not just what it is called — whoever opens
// this sheet cold has not read the build doc and will not ask.
export const HEADERS = [
  'Registration ID',
  'Registered (Melbourne)',
  'Player Name',
  'Age',
  'Email',
  'Phone',
  'Club',
  'Shirt Size',
  'Already Owns Shirt',
  'Buying a Shirt ($29.95)',
  'Total Due (AUD)',
  'Paid? (NOT auto-updated — check Stripe)',
  'Paid At (Melbourne)',
  'Accepted T&Cs',
  'Accepted Player Code',
  'Accepted Parent Code',
  'Photo/Video Consent',
  'Program',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Content',
  'UTM Term',
  'Referrer',
];

// Last column the sync is allowed to touch. HEADERS.length === 24 === 'X'.
// Everything from column Y rightwards belongs to whoever is working the sheet.
const SYNC_LAST_COL = 'X';

// Melbourne local time as "YYYY-MM-DD HH:MM", written as TEXT (see asText).
//
// It is deliberately NOT a pretty "20 Aug 2026, 7:15 pm" and deliberately NOT a
// real date cell. Under USER_ENTERED, Sheets parses a pretty date string into a
// datetime and renders it back in the sheet's own locale — "07:15 pm" returns as
// "7:15 PM". That round-trip made every row differ from what the code built, so
// the sync rewrote all of them on every run and the "unchanged rows are never
// touched" guarantee was worthless. Storing it as text makes the comparison
// exact and immune to whatever locale the sheet is set to.
//
// This format still sorts correctly as text, so nothing is lost by it.
const fmtMelb = (iso) => {
  if (!iso) return '';
  try {
    const p = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Australia/Melbourne',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date(iso)).reduce((a, x) => (a[x.type] = x.value, a), {});
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
  } catch { return iso; }
};

const yesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '');

// Leading apostrophe forces Sheets to store the value as TEXT. Without it:
//   - a phone number loses its leading 0 to numeric coercion (un-diallable);
//   - an age lands in a cell with sticky date formatting and renders as a
//     ~1900 date (15 → "1900-01-14"). Clearing values does NOT clear cell
//     formatting, so that bug survives every later write once it appears.
const asText = (v) => (v !== null && v !== undefined && v !== '' ? `'${v}` : '');

export const masterclassRow = (r) => {
  const dueCents = COURSE_CENTS + (r.purchase_shirt ? SHIRT_CENTS : 0);
  return [
    r.id || '',
    asText(fmtMelb(r.created_at)),
    r.player_name || '',
    asText(r.player_age),
    r.email || '',
    asText(r.phone),
    r.club || '',
    r.shirt_size || '',
    yesNo(r.has_shirt),
    yesNo(r.purchase_shirt),
    `$${(dueCents / 100).toFixed(2)}`,
    yesNo(r.paid),
    asText(fmtMelb(r.paid_at)),
    yesNo(r.accept_terms),
    yesNo(r.accept_player_code),
    yesNo(r.accept_parent_code),
    yesNo(r.accept_social_media),
    r.program_type || '',
    r.utm_source || '',
    r.utm_medium || '',
    r.utm_campaign || '',
    r.utm_content || '',
    r.utm_term || '',
    r.page_referrer || '',
  ];
};

// Sheets returns short rows when trailing cells are empty; pad so a like-for-like
// comparison doesn't report a false change and trigger a needless write.
const padTo = (arr, n) => {
  const out = arr.slice(0, n);
  while (out.length < n) out.push('');
  return out;
};

// A cell the sheet stored as text comes back WITHOUT the leading apostrophe we
// sent, so compare against the un-prefixed form or every row looks changed
// forever and the sync rewrites the whole sheet on every run.
const normalise = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return s.startsWith("'") ? s.slice(1) : s;
};

const sameRow = (a, b) => {
  const n = HEADERS.length;
  const x = padTo(a, n), y = padTo(b, n);
  for (let i = 0; i < n; i++) if (normalise(x[i]) !== normalise(y[i])) return false;
  return true;
};

// ------------------------------------------------------------
// The plain-English guide tab. Written ONCE, on the first run only — if the tab
// already exists this function does nothing, so any wording Marielle changes to
// suit herself survives.
// ------------------------------------------------------------
const GUIDE_LINES = [
  ['Power Game Masterclass — Sept 2026 — how this sheet works'],
  [''],
  ['This sheet fills itself in automatically. It refreshes every 4 hours from the'],
  ['registration form at rramelbourne.com/power-game-masterclass. You do not need to'],
  ['add registrations by hand — a new one appears here on its own within 4 hours.'],
  [''],
  ['WHERE YOU CAN WORK SAFELY'],
  [''],
  ['Columns A to X are filled in by the automatic update. If you change something in'],
  ['those columns, your change will be replaced next time that person’s details change.'],
  [''],
  ['Column Y onwards is yours. The automatic update never reads, writes, or clears'],
  ['anything from column Y across. Put your notes, follow-up status, call logs and'],
  ['anything else there and it will not be touched.'],
  [''],
  ['You can sort, filter, colour and hide rows freely. Rows are matched by the'],
  ['Registration ID in column A, not by their position, so your notes stay attached to'],
  ['the right player even after sorting.'],
  [''],
  ['THE "PAID?" COLUMN IS NOT A PAYMENT RECORD'],
  [''],
  ['Column L says "Paid?" but it will show "No" for everyone, including people who have'],
  ['actually paid. Nothing connects Stripe back to this sheet yet. To check whether'],
  ['someone has paid, look in Stripe.'],
  [''],
  ['If you want to track payment yourself, do it in your own columns (Y onwards) — that'],
  ['is the part of the sheet the automatic update leaves alone.'],
  [''],
  ['WHAT THE PRICE COLUMN MEANS'],
  [''],
  ['"Total Due" is $240.00 if the player already owns the official training shirt, or'],
  ['$269.95 if they ticked that they need one ($240 course + $29.95 shirt). The $240'],
  ['covers both Sundays, not one session.'],
  [''],
  ['IF A ROW LOOKS WRONG'],
  [''],
  ['The sheet is a mirror of what the person actually typed into the form. If a detail'],
  ['is wrong, it was entered wrong — correct it in your own columns, or ask for it to be'],
  ['fixed at the source. Deleting a row here does not delete the registration; the row'],
  ['will come back on the next update.'],
];

async function ensureGuideTab(sheets, spreadsheetId) {
  const created = await ensureTab(sheets, spreadsheetId, GUIDE_TAB);
  if (!created) return { guide: 'already present, left alone' };
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${GUIDE_TAB}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: GUIDE_LINES },
  });
  return { guide: 'created' };
}

// ------------------------------------------------------------
// Non-destructive reconcile. See the rule at the top of this file.
//
// `sb` is injectable so the reconcile can be exercised end-to-end against a real
// workbook without a service-role key in the room; production passes nothing and
// gets the real client.
// ------------------------------------------------------------
export async function reconcileMasterclass(sheets, spreadsheetId, tabName = TAB, sb = null) {
  sb = sb || getSupabase();
  const { data, error } = await sb
    .from('masterclass_registrations')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;

  await ensureTab(sheets, spreadsheetId, tabName);
  await ensureHeader(sheets, spreadsheetId, tabName, HEADERS);

  // Read back ONLY the sync-owned block. Marielle's columns are never fetched,
  // so they can't be echoed back into a write by accident.
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A2:${SYNC_LAST_COL}100000`,
  });
  const present = existing.data.values || [];

  // id -> { rowNumber, values }. Row 1 is the header, so data starts at row 2.
  const byId = new Map();
  present.forEach((row, i) => {
    const id = (row[0] || '').trim();
    if (id) byId.set(id, { rowNumber: i + 2, values: row });
  });

  const updates = [];   // changed rows, written in place
  const appends = [];   // registrations not yet in the sheet
  let unchanged = 0;

  for (const rec of data || []) {
    const built = masterclassRow(rec);
    const hit = byId.get(String(rec.id));
    if (!hit) { appends.push(built); continue; }
    if (sameRow(hit.values, built)) { unchanged++; continue; }
    updates.push({
      range: `${tabName}!A${hit.rowNumber}:${SYNC_LAST_COL}${hit.rowNumber}`,
      values: [built],
    });
  }

  // Only rows whose data actually changed are rewritten — and only across A:X.
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: 'USER_ENTERED', data: updates },
    });
  }

  // New registrations go on the end. INSERT_ROWS (not OVERWRITE) so append can
  // never land on top of anything already sitting below the data.
  if (appends.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A2`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: appends },
    });
  }

  const guide = await ensureGuideTab(sheets, spreadsheetId);

  return {
    tab: tabName,
    inDatabase: (data || []).length,
    added: appends.length,
    updated: updates.length,
    unchanged,
    buyingShirts: (data || []).filter((r) => r.purchase_shirt).length,
    ...guide,
  };
}

// Authorise: a Vercel Cron call (shared CRON_SECRET) or an active dashboard
// admin (JWT). Same contract as sync-pgp-leads.js.
async function authorise(req) {
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (token && process.env.CRON_SECRET && token === process.env.CRON_SECRET) return 'cron';
  if (!token) throw new Error('unauthorized');
  const sb = getSupabase();
  const { data: { user } = {}, error } = await sb.auth.getUser(token);
  if (error || !user?.email) throw new Error('unauthorized');
  const { data: admin } = await sb
    .from('dashboard_users')
    .select('email')
    .eq('email', user.email)
    .eq('active', true)
    .maybeSingle();
  if (!admin) throw new Error('forbidden');
  return user.email;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await authorise(req);
  } catch (e) {
    return res.status(e.message === 'forbidden' ? 403 : 401).json({ error: e.message });
  }

  const spreadsheetId = process.env.MASTERCLASS_SHEET_ID;
  if (!spreadsheetId) {
    return res.status(503).json({ error: 'MASTERCLASS_SHEET_ID not configured' });
  }

  let sheets;
  try {
    sheets = getSheets();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  try {
    const result = await reconcileMasterclass(sheets, spreadsheetId);
    return res.status(200).json({ ok: true, masterclass: result });
  } catch (err) {
    console.error('sync-masterclass: reconcile failed:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

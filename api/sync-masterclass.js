// ============================================================
// Vercel Serverless Function — mirror Power Game Masterclass registrations
// into the Power Game workbook. Runs on its own 4-hourly cron.
// GET (Vercel Cron) or POST (admin manual run).
// ============================================================
// Writes ONE tab, "Masterclass — Sept 2026", rebuilt in full from the
// `masterclass_registrations` table each run. The table is tiny (one row per
// person who submitted the form on /power-game-masterclass), so a full rebuild
// is cheaper and safer than an upsert: the sheet is always a faithful mirror of
// the database, and re-running it can never duplicate a row.
//
// Deliberately a SEPARATE endpoint from sync-pgp-leads.js, for two reasons:
//   1. It runs on a different schedule (every 4 hours, not every 30 minutes).
//   2. Isolation — if this reconcile throws, the paid-players and Stripe leads
//      reconciles that money depends on are untouched.
//
// The tab is SELF-HEALING: ensureTab() creates the worksheet if it is missing,
// so the first run provisions it and no one has to make the tab by hand.
//
// !! The "Paid?" column cannot be trusted as a payment record. Nothing in this
// codebase ever sets masterclass_registrations.paid — the form redirects
// straight to a Stripe Payment Link and Stripe never writes back. The column is
// mirrored so it works the moment someone fills it in (by hand or by a future
// webhook), and its header says so in plain words. Stripe is the truth today.
//
// Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` (GET); a
// dashboard admin can also POST with their Supabase JWT to run it on demand.
// Env: SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      GOOGLE_SERVICE_ACCOUNT_JSON, POWER_GAME_SHEET_ID, CRON_SECRET,
//      MASTERCLASS_TAB (optional — defaults to "Masterclass — Sept 2026").
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { getSheets, ensureTab } from './_lib/pgpSheets.js';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

const TAB = process.env.MASTERCLASS_TAB || 'Masterclass — Sept 2026';

// Price the player is due to pay, from the shirt choice they made on the form.
// $240 covers both Sundays; the shirt is a $29.95 optional line item they untick
// at Stripe checkout if they already own one.
const COURSE_CENTS = 24000;
const SHIRT_CENTS = 2995;

// Headers say what the column MEANS, not just what it is called — whoever opens
// this sheet cold has not read the build doc and will not ask.
export const HEADERS = [
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
// Last column letter for HEADERS.length (23) — used to clear old rows.
const LAST_COL = 'W';

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

const yesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '');

// Leading apostrophe forces Sheets to store the value as TEXT. Without it:
//   - a phone number loses its leading 0 to numeric coercion (un-diallable);
//   - an age lands in a cell with sticky date formatting and renders as a
//     ~1900 date (15 → "1900-01-14"). Full rebuilds clear values but NOT cell
//     formatting, so that bug survives every re-run once it appears.
const asText = (v) => (v !== null && v !== undefined && v !== '' ? `'${v}` : '');

export const masterclassRow = (r) => {
  const dueCents = COURSE_CENTS + (r.purchase_shirt ? SHIRT_CENTS : 0);
  return [
    fmtMelb(r.created_at),
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
    fmtMelb(r.paid_at),
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

// ------------------------------------------------------------
// Full rebuild of the masterclass tab. Chronological (oldest first), every row
// kept — no dedup, so the sheet is a faithful record. A genuine double
// submission shows up twice because it happened twice; fix it in the database,
// not here.
// ------------------------------------------------------------
// `sb` is injectable so the reconcile can be exercised end-to-end against a
// real workbook without a service-role key in the room; production passes
// nothing and gets the real client.
export async function reconcileMasterclass(sheets, spreadsheetId, tabName = TAB, sb = null) {
  sb = sb || getSupabase();
  const { data, error } = await sb
    .from('masterclass_registrations')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const rows = (data || []).map(masterclassRow);

  await ensureTab(sheets, spreadsheetId, tabName);
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tabName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [HEADERS] },
  });
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${tabName}!A2:${LAST_COL}100000`,
  });
  if (rows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A2`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });
  }

  const buyingShirts = (data || []).filter((r) => r.purchase_shirt).length;
  return { registrations: rows.length, buyingShirts, tab: tabName };
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

  const spreadsheetId = process.env.POWER_GAME_SHEET_ID;
  if (!spreadsheetId) {
    return res.status(503).json({ error: 'POWER_GAME_SHEET_ID not configured' });
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

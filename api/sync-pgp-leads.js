// ============================================================
// Vercel Serverless Function — reconcile the Power Game workbook (hourly cron).
// GET (Vercel Cron, hourly) or POST (admin manual run).
// ============================================================
// Rebuilds BOTH operational tabs in the Power Game workbook each run. It is the
// single, self-contained source of truth for the sheet — no Supabase DB webhook
// required, and it never touches the live payment path.
//
//   "Paid players"        ← UPSERT-by-Application-ID from power_game_applications
//                            paid rows (idempotent; backfills existing payments;
//                            preserves any manual columns/notes you add).
//   "Leads (incomplete)"  ← REBUILT from Stripe Checkout Sessions that started but
//                            did NOT pay (paid emails excluded; a lead who later
//                            pays drops off automatically). No DB rows written for
//                            leads — no bot/abandon pollution.
//   "Mickleham Open Day"     ← REBUILT from the standalone
//   "Williamstown Open Day"     {centre}_open_day_registrations tables (Elite
//   "Hallam Open Day"           Trial sign-ups for each open day). Full rebuild
//                               each run; chronological sign-up log.
//
// All tabs are SELF-HEALING: created automatically if missing (ensureTab).
//
// Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` (GET); a dashboard
// admin can also POST with their Supabase JWT to run it on demand.
// Env: STRIPE_SECRET_KEY, SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      GOOGLE_SERVICE_ACCOUNT_JSON, POWER_GAME_SHEET_ID, POWER_GAME_PAID_TAB,
//      POWER_GAME_LEADS_TAB, CRON_SECRET.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { unpackApplication } from './_lib/pgpCheckout.js';
import {
  getSheets, PAID_HEADERS, buildPaidRow, ensureTab, ensureHeader, findRowById,
} from './_lib/pgpSheets.js';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

let _stripe = null;
const getStripe = () => (_stripe ||= new Stripe(process.env.STRIPE_SECRET_KEY));

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

const LEADS_HEADERS = [
  'Lead Started (Melbourne)', 'Stripe Status', 'Player Name', 'Age', 'Player Email', 'Player Phone',
  'Parent Email', 'Parent Phone', 'Suburb', 'Centre', 'Session Day', 'Session Time',
  'Cricket Level', 'Current Club(s)', 'Would-be Fee (AUD)', 'Session Ref',
];

const fmtMelb = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-AU', {
      timeZone: 'Australia/Melbourne', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
};

const fullName = (a) => a.player_name || [a.first_name, a.last_name].filter(Boolean).join(' ') || '';

const leadRow = (s, a) => ([
  fmtMelb(new Date(s.created * 1000).toISOString()),
  s.status === 'expired' ? 'Abandoned (expired)' : 'Started, not paid',
  fullName(a),
  a.age ?? '',
  a.email || s.customer_details?.email || '',
  a.phone || s.customer_details?.phone || '',
  a.parent1_email || '',
  a.parent1_phone || '',
  a.suburb || '',
  a.venue || s.metadata?.venue || '',
  a.session_day || s.metadata?.session_day || '',
  a.session_time || s.metadata?.session_time || '',
  a.current_level || '',
  a.current_club || a.club || '',
  s.amount_total != null ? `$${(s.amount_total / 100).toFixed(2)}` : '',
  String(s.id).slice(-8).toUpperCase(),
]);

const OPEN_DAY_HEADERS = [
  'Registered (Melbourne)', 'Type', 'Here For', 'Player Name', 'Age', 'Gender', 'Date of Birth',
  'Parent/Guardian Name', 'Parent Email', 'Parent Phone', 'Suburb',
  'Current Club', 'Current Grade', 'Years Playing', 'Primary Role',
  'Batting Hand', 'Bowling Type', 'Honours', 'Session',
  'Terms', 'Social Media Consent', 'Liability', 'Source',
  'UTM Source', 'UTM Medium', 'UTM Campaign', 'Referrer',
];

// Entry check-ins (source '{centre}-open-day-entry') vs detailed Elite Trial regos.
const rowType = (r) => (String(r.source || '').endsWith('-entry') ? 'Entry (door)' : 'Elite Trial');
const ATTENDING_LABELS = { junior: 'Junior Royals', elite: 'Elite Royals', both: 'Both / Not sure' };

const openDayRow = (r) => ([
  fmtMelb(r.created_at),
  rowType(r),
  ATTENDING_LABELS[r.attending] || '',
  r.player_name || '',
  r.player_age ?? '',
  r.player_gender || '',
  r.player_dob || '',
  r.parent_name || '',
  r.parent_email || '',
  // Leading apostrophe forces Sheets to store as text, so USER_ENTERED can't
  // numeric-coerce the number and strip the leading 0 (un-diallable otherwise).
  r.parent_phone ? `'${r.parent_phone}` : '',
  r.suburb || '',
  r.current_club || '',
  r.current_grade || '',
  r.years_playing || '',
  r.primary_role || '',
  r.batting_hand || '',
  r.bowling_type || '',
  r.honours || '',
  r.session || '',
  r.accept_terms === true ? 'Yes' : r.accept_terms === false ? 'No' : '',
  r.accept_social_media === true ? 'Yes' : r.accept_social_media === false ? 'No' : '',
  r.accept_liability === true ? 'Yes' : r.accept_liability === false ? 'No' : '',
  r.source || '',
  r.utm_source || '',
  r.utm_medium || '',
  r.utm_campaign || '',
  r.page_referrer || '',
]);

// ------------------------------------------------------------
// Open Day tabs (Mickleham / Williamstown / Hallam) — full rebuild from each
// standalone registrations table (they share the same schema, so one reconcile
// serves all three). Chronological sign-up log (oldest first). Tiny tables; full
// rebuild is fine and idempotent. Every row is kept (no dedup) so the sheet is a
// faithful record.
// ------------------------------------------------------------
async function reconcileOpenDay(sheets, spreadsheetId, table, tabName) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from(table)
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  const rows = (data || []).map(openDayRow);

  await ensureTab(sheets, spreadsheetId, tabName);
  await sheets.spreadsheets.values.update({
    spreadsheetId, range: `${tabName}!A1`, valueInputOption: 'USER_ENTERED',
    requestBody: { values: [OPEN_DAY_HEADERS] },
  });
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${tabName}!A2:AD100000` });
  if (rows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: `${tabName}!A2`, valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });
  }
  return { registrations: rows.length };
}

// Authorise: a Vercel Cron call (shared CRON_SECRET) or an active dashboard admin (JWT).
async function authorise(req) {
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (token && process.env.CRON_SECRET && token === process.env.CRON_SECRET) return 'cron';
  if (!token) throw new Error('unauthorized');
  const sb = getSupabase();
  const { data: { user } = {}, error } = await sb.auth.getUser(token);
  if (error || !user?.email) throw new Error('unauthorized');
  const { data: admin } = await sb.from('dashboard_users').select('email').eq('email', user.email).eq('active', true).maybeSingle();
  if (!admin) throw new Error('forbidden');
  return user.email;
}

// Map a power_game_applications.venue string to one of the three centres.
// Substring match keeps it robust to minor venue-label changes in squads.ts.
//   The Netz                        → Williamstown
//   Elite Cricket Centre            → Hallam
//   Mickleham Indoor Sports Centre  → Mickleham
const PAID_CENTRES = [
  { key: 'Williamstown', tab: 'Paid — Williamstown', match: (v) => v.includes('netz') || v.includes('williamstown') },
  { key: 'Hallam',       tab: 'Paid — Hallam',       match: (v) => v.includes('elite cricket') || v.includes('hallam') },
  { key: 'Mickleham',    tab: 'Paid — Mickleham',    match: (v) => v.includes('mickleham') },
];
const centreForVenue = (venue) => {
  const v = String(venue || '').toLowerCase();
  return PAID_CENTRES.find((c) => c.match(v)) || null;
};

// Upsert a set of paid DB rows into a tab by Application ID (column A). Self-healing:
// creates the tab + header if missing, refreshes existing rows in place (preserving
// any manual columns/notes added to the right), and appends new ones. Shared by the
// master "Paid players" tab and each per-centre tab.
async function upsertPaidTab(sheets, spreadsheetId, tabName, rows) {
  await ensureTab(sheets, spreadsheetId, tabName);
  await ensureHeader(sheets, spreadsheetId, tabName, PAID_HEADERS);

  const idRes = await sheets.spreadsheets.values.get({
    spreadsheetId, range: `${tabName}!A:A`, majorDimension: 'COLUMNS',
  });
  const ids = idRes.data.values?.[0] || [];
  const rowById = new Map();
  for (let i = 1; i < ids.length; i++) if (ids[i]) rowById.set(ids[i], i + 1);

  const updates = [];   // { range, values }
  const appends = [];   // row arrays
  for (const r of rows) {
    const row = buildPaidRow(r);
    const at = rowById.get(r.id);
    if (at) updates.push({ range: `${tabName}!A${at}`, values: [row] });
    else appends.push(row);
  }
  if (updates.length) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: 'USER_ENTERED', data: updates },
    });
  }
  if (appends.length) {
    await sheets.spreadsheets.values.append({
      spreadsheetId, range: `${tabName}!A1`, valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS', requestBody: { values: appends },
    });
  }
  return { rows: rows.length, updated: updates.length, appended: appends.length };
}

// ------------------------------------------------------------
// Paid players — the master "Paid players" tab (ALL centres) PLUS one roster tab
// per centre (Paid — Williamstown / Hallam / Mickleham), split by venue. Every tab
// is an upsert-by-Application-ID so it self-heals, flows new paid players in, and
// keeps any manual columns/notes. NOTE: upsert adds/refreshes but does not delete —
// if a paid player is ever re-assigned to a different venue they'd need to be
// removed from the old centre tab by hand (rare; matches the master tab's behaviour).
// ------------------------------------------------------------
async function reconcilePaid(sheets, spreadsheetId) {
  const masterTab = process.env.POWER_GAME_PAID_TAB || 'Paid players';
  const sb = getSupabase();
  const { data, error } = await sb
    .from('power_game_applications')
    .select('*')
    .or('payment_status.eq.completed,status.eq.paid')
    .order('paid_at', { ascending: true });
  if (error) throw error;
  const paid = data || [];

  // Master tab — every paid player.
  const master = await upsertPaidTab(sheets, spreadsheetId, masterTab, paid);

  // Split by centre and write each per-centre roster tab.
  const byCentre = {};
  let unassigned = 0;
  for (const r of paid) {
    const c = centreForVenue(r.venue);
    if (c) (byCentre[c.key] ||= []).push(r);
    else unassigned++;
  }
  const centres = {};
  for (const c of PAID_CENTRES) {
    centres[c.key] = await upsertPaidTab(sheets, spreadsheetId, c.tab, byCentre[c.key] || []);
  }
  if (unassigned) console.warn(`sync-pgp-leads: ${unassigned} paid player(s) had an unrecognised venue (master tab only)`);

  return { paid: paid.length, master, centres, unassigned };
}

// ------------------------------------------------------------
// "Leads (incomplete)" tab — rebuilt from Stripe (started-but-not-paid sessions).
// ------------------------------------------------------------
async function reconcileLeads(sheets, spreadsheetId, days) {
  const tabName = process.env.POWER_GAME_LEADS_TAB || 'Leads (incomplete)';
  const stripe = getStripe();
  const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

  // Walk every Stripe Checkout Session in the window; keep Power Game ones.
  const paidEmails = new Set();
  const incomplete = []; // { s, app, email, created }
  let startingAfter = null;
  for (let guard = 0; guard < 100; guard++) {
    const params = { limit: 100, created: { gte: since } };
    if (startingAfter) params.starting_after = startingAfter;
    const page = await stripe.checkout.sessions.list(params);
    for (const s of page.data) {
      if (s?.metadata?.source !== 'power-game') continue;
      const email = (s.customer_details?.email || s.metadata?.email || '').toLowerCase();
      if (s.payment_status === 'paid') { if (email) paidEmails.add(email); continue; }
      const app = unpackApplication(s.metadata) || {};
      incomplete.push({ s, app, email, created: s.created });
    }
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]?.id;
  }

  // Drop anyone who also has a PAID session, and de-dupe to the most recent attempt per email.
  const byEmail = new Map();
  for (const lead of incomplete) {
    if (lead.email && paidEmails.has(lead.email)) continue;
    const key = lead.email || lead.s.id; // no-email sessions stay distinct
    const prev = byEmail.get(key);
    if (!prev || lead.created > prev.created) byEmail.set(key, lead);
  }
  const leads = [...byEmail.values()].sort((a, b) => b.created - a.created);
  const rows = leads.map(({ s, app }) => leadRow(s, app));

  // Rebuild the tab: header + current incomplete leads (paid leads drop off).
  await ensureTab(sheets, spreadsheetId, tabName);
  await sheets.spreadsheets.values.update({
    spreadsheetId, range: `${tabName}!A1`, valueInputOption: 'USER_ENTERED',
    requestBody: { values: [LEADS_HEADERS] },
  });
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${tabName}!A2:Z100000` });
  if (rows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId, range: `${tabName}!A2`, valueInputOption: 'USER_ENTERED',
      requestBody: { values: rows },
    });
  }
  return { leads: rows.length, paidExcluded: paidEmails.size };
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await authorise(req);
  } catch (e) {
    return res.status(e.message === 'forbidden' ? 403 : 401).json({ error: e.message });
  }

  const spreadsheetId = process.env.POWER_GAME_SHEET_ID;
  if (!spreadsheetId) return res.status(503).json({ error: 'POWER_GAME_SHEET_ID not configured' });

  const days = Math.min(Number(req.body?.days) || 180, 365);
  const out = { ok: true };

  let sheets;
  try {
    sheets = getSheets();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  // Run both reconciles independently — one failing must not block the other.
  try {
    out.paidPlayers = await reconcilePaid(sheets, spreadsheetId);
  } catch (err) {
    console.error('sync-pgp-leads: paid reconcile failed:', err);
    out.paidPlayers = { error: err.message };
    out.ok = false;
  }
  try {
    out.leadsTab = await reconcileLeads(sheets, spreadsheetId, days);
  } catch (err) {
    console.error('sync-pgp-leads: leads reconcile failed:', err);
    out.leadsTab = { error: err.message };
    out.ok = false;
  }
  const openDays = [
    { key: 'micklehamTab', table: 'mickleham_open_day_registrations', tab: process.env.POWER_GAME_MICKLEHAM_TAB || 'Mickleham Open Day' },
    { key: 'williamstownTab', table: 'williamstown_open_day_registrations', tab: process.env.POWER_GAME_WILLIAMSTOWN_TAB || 'Williamstown Open Day' },
    { key: 'hallamTab', table: 'hallam_open_day_registrations', tab: process.env.POWER_GAME_HALLAM_TAB || 'Hallam Open Day' },
  ];
  for (const od of openDays) {
    try {
      out[od.key] = await reconcileOpenDay(sheets, spreadsheetId, od.table, od.tab);
    } catch (err) {
      console.error(`sync-pgp-leads: ${od.tab} reconcile failed:`, err);
      out[od.key] = { error: err.message };
      out.ok = false;
    }
  }

  return res.status(out.ok ? 200 : 500).json(out);
}

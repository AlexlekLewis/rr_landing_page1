// ============================================================
// Vercel Serverless Function — mirror Performance Squads registrations AND
// their Stripe trial payments into one Google Sheet. Runs 4-hourly on cron.
// GET (Vercel Cron) or POST (admin manual run).
// ============================================================
// Target workbook: "Performance Squads — Registrations & Payments", created by
// Alex in his own Drive and shared to the sync service account as Editor. The
// id lives in holiday_program_sheets (source_table = 'performance_squad_leads'),
// so it can be repointed with one SQL update and needs no redeploy.
//
// !! NEVER let the service account create the workbook itself. That SA has
// Google Drive storage quota 0, so any file it OWNS dies within days — 404 even
// to the SA, and writes start failing 403. Every sync target must be created by
// a human and shared to the SA. (api/sync-performance-squad-row.js still
// contains that unsafe auto-provisioning path; see the note at the bottom.)
//
// ── WHY THIS EXISTS ──────────────────────────────────────────
// Registrations were reaching NOTHING. api/sync-performance-squad-row.js was
// written to mirror rows on a Supabase Database Webhook, but that webhook was
// never created (no trigger on the table) and no workbook row was ever added to
// holiday_program_sheets — so every registration since 21 Aug 2026 existed only
// in Postgres. This function replaces that event-driven path with a scheduled
// full reconcile, which self-heals: if a run fails, the next one catches up.
//
// ── PAYMENTS ─────────────────────────────────────────────────
// performance_squad_leads has NO payment columns. The trial fee is taken by
// Stripe Payment Links, and a Payment Link never writes back to this codebase.
// So payments are read straight from Stripe: we walk Checkout Sessions, keep the
// ones whose payment_link is one of the four Performance Squads trial links, and
// match them to a registration BY EMAIL (lower-cased, trimmed).
//
// Email matching is honest but not perfect: a parent who registers with one
// address and pays with another will land in "Payments (Stripe)" as UNMATCHED
// rather than being silently attached to the wrong player. Unmatched payments
// are never dropped — they are listed so a human can resolve them.
//
// ── NON-DESTRUCTIVE ──────────────────────────────────────────
// People work in this sheet by hand. So the sync:
//   • never clears anything, never deletes a row,
//   • never writes outside its own column block (see SYNC_LAST_COL per tab),
//   • only rewrites a row whose data has ACTUALLY CHANGED,
//   • only writes the header row if row 1 is empty.
// Rows are matched by id in column A, never by position, so sorting and
// filtering in the sheet cannot mis-align anyone's notes.
//
// Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` (GET); a
// dashboard admin can POST with their Supabase JWT to run it on demand.
// Env: SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      GOOGLE_SERVICE_ACCOUNT_JSON, STRIPE_SECRET_KEY, CRON_SECRET,
//      PERFORMANCE_SQUADS_SHEET_ID (optional — overrides the DB config row).
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getSheets, ensureTab, ensureHeader } from './_lib/pgpSheets.js';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

const SOURCE_TABLE = 'performance_squad_leads';
const GUIDE_TAB = 'How this sheet works';
const PAYMENTS_TAB = 'Payments (Stripe)';

// One tab per live centre. Slug -> tab name, mirroring the centre slugs the
// registration form writes into preferred_centre.
const CENTRE_TABS = {
  'north-melbourne': 'North Melbourne',
  'south-east-melbourne': 'South-East Melbourne',
};
// A registration for a centre we have no tab for still has to land somewhere.
const FALLBACK_TAB = 'Other / Unassigned';

// Trial fee, in cents, per session. Source of truth is PAYMENT_OPTIONS in
// src/components/performance-squads/data.js ("$30 per player, per session").
const TRIAL_FEE_CENTS = 3000;

// The four Stripe Payment Links that take Performance Squads trial money.
// Source of truth: PAYMENT_LINKS in src/components/performance-squads/data.js.
// A Checkout Session carries the Payment Link ID (plink_...), not this short
// URL, so at runtime we list Payment Links once and map url -> id.
const PS_PAYMENT_LINK_URLS = {
  'https://buy.stripe.com/4gMcN56nvggZ2D233t9Zm0z': { centre: 'north-melbourne', sessions: 1 },
  'https://buy.stripe.com/8x2bJ17rz2q9elKeMb9Zm0A': { centre: 'north-melbourne', sessions: 2 },
  'https://buy.stripe.com/6oU4gz3bj0i1elK1Zp9Zm0x': { centre: 'south-east-melbourne', sessions: 1 },
  'https://buy.stripe.com/9B6cN53bj8Ox6TifQf9Zm0y': { centre: 'south-east-melbourne', sessions: 2 },
};

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  _supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  return _supabase;
};

let _stripe = null;
const getStripe = () => (_stripe ||= new Stripe(process.env.STRIPE_SECRET_KEY));

// ------------------------------------------------------------
// Cell formatting. These three helpers carry hard-won lessons from
// sync-masterclass.js — read the comments there before changing them.
// ------------------------------------------------------------

// Melbourne local time as "YYYY-MM-DD HH:MM", written as TEXT. Deliberately not
// a pretty date: under USER_ENTERED, Sheets re-parses a pretty date into its own
// locale and hands back a different string, which would make every row look
// changed on every run and defeat the "unchanged rows are never touched" rule.
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

// Leading apostrophe forces Sheets to store TEXT. Without it a phone number
// loses its leading 0 and an age lands in a date-formatted cell and renders as
// a ~1900 date — and clearing values does not clear that sticky formatting.
const asText = (v) => (v !== null && v !== undefined && v !== '' ? `'${v}` : '');

const money = (cents) => (cents || cents === 0 ? `$${(cents / 100).toFixed(2)}` : '');

const emailKey = (e) => String(e || '').trim().toLowerCase();

// ------------------------------------------------------------
// Registration tab
// ------------------------------------------------------------
export const REG_HEADERS = [
  'Registration ID',
  'Registered (Melbourne)',
  'Player Name',
  'Age',
  'Parent / Guardian',
  'Email',
  'Phone',
  'Club',
  'Playing Role',
  'Centre',
  'Trial Sessions Booked',
  'Trial Sessions Chosen',
  'Trial Fee Due (AUD)',
  'Paid in Stripe?',
  'Amount Paid (AUD)',
  'Paid At (Melbourne)',
  'Payment Matched By',
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
// REG_HEADERS.length === 28 === column AB. Everything from AC rightwards is the
// humans' and is never read, written or cleared by this sync.
const REG_LAST_COL = 'AB';

export const regRow = (r, pay) => {
  const sessions = Number(r.trial_sessions) || 0;
  const dates = Array.isArray(r.trial_session_dates) ? r.trial_session_dates.join(' · ') : '';
  return [
    r.id || '',
    asText(fmtMelb(r.created_at)),
    r.player_name || '',
    asText(r.player_age),
    r.parent_name || '',
    r.email || '',
    asText(r.phone),
    r.club || '',
    r.playing_role || '',
    CENTRE_TABS[r.preferred_centre] || r.preferred_centre || '',
    asText(sessions || ''),
    dates,
    sessions ? money(sessions * TRIAL_FEE_CENTS) : '',
    pay ? 'Yes' : 'No',
    pay ? money(pay.amountCents) : '',
    pay ? asText(fmtMelb(pay.paidAt)) : '',
    pay ? pay.method : '',
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
// Payments tab — every Performance Squads trial payment Stripe has, including
// ones we could not attach to a registration.
// ------------------------------------------------------------
export const PAY_HEADERS = [
  'Stripe Session ID',
  'Paid At (Melbourne)',
  'Payer Name',
  'Payer Email',
  'Amount (AUD)',
  'Sessions Paid For',
  'Centre (from payment link)',
  'Matched Registration',
  'Matched Player',
  'Stripe Status',
];
// PAY_HEADERS.length === 10 === column J.
const PAY_LAST_COL = 'J';

export const payRow = (p) => ([
  p.sessionId,
  asText(fmtMelb(p.paidAt)),
  p.payerName || '',
  p.payerEmail || '',
  money(p.amountCents),
  asText(p.sessions || ''),
  CENTRE_TABS[p.centre] || p.centre || '',
  p.matchedId || 'UNMATCHED — no registration with this email',
  p.matchedPlayer || '',
  p.status || '',
]);

// ------------------------------------------------------------
// Row comparison. Sheets returns short rows when trailing cells are empty, and
// strips the leading apostrophe from text cells — both have to be normalised or
// every row looks changed forever and the sync rewrites the whole sheet.
// ------------------------------------------------------------
const padTo = (arr, n) => {
  const out = arr.slice(0, n);
  while (out.length < n) out.push('');
  return out;
};
const normalise = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return s.startsWith("'") ? s.slice(1) : s;
};
const sameRow = (a, b, n) => {
  const x = padTo(a, n), y = padTo(b, n);
  for (let i = 0; i < n; i++) if (normalise(x[i]) !== normalise(y[i])) return false;
  return true;
};

// ------------------------------------------------------------
// Stripe: pull every Performance Squads trial payment.
// ------------------------------------------------------------

// Map Payment Link URL -> plink id, once per cold start. Checkout Sessions
// reference the id; the code and the sheet think in URLs.
let _linkIds = null;
async function resolvePaymentLinkIds(stripe) {
  if (_linkIds) return _linkIds;
  const wanted = new Map(); // plink id -> {centre, sessions}
  let params = { limit: 100 };
  for (let page = 0; page < 10; page++) {
    const res = await stripe.paymentLinks.list(params);
    for (const link of res.data) {
      const meta = PS_PAYMENT_LINK_URLS[link.url];
      if (meta) wanted.set(link.id, meta);
    }
    if (!res.has_more) break;
    params = { ...params, starting_after: res.data[res.data.length - 1].id };
  }
  _linkIds = wanted;
  return wanted;
}

// Walk Checkout Sessions and keep the paid ones that came from a PS trial link.
// `sinceUnix` bounds the walk — the program launched Aug 2026, so there is no
// reason to page back through years of unrelated sessions.
export async function fetchPerformanceSquadPayments(stripe, sinceUnix) {
  const linkIds = await resolvePaymentLinkIds(stripe);
  if (linkIds.size === 0) return { payments: [], linksFound: 0 };

  const payments = [];
  let params = { limit: 100, created: { gte: sinceUnix } };
  for (let page = 0; page < 25; page++) {
    const res = await stripe.checkout.sessions.list(params);
    for (const s of res.data) {
      if (!s.payment_link || !linkIds.has(s.payment_link)) continue;
      if (s.payment_status !== 'paid') continue;
      const meta = linkIds.get(s.payment_link);
      payments.push({
        sessionId: s.id,
        paidAt: new Date((s.created || 0) * 1000).toISOString(),
        payerName: s.customer_details?.name || '',
        payerEmail: s.customer_details?.email || '',
        amountCents: s.amount_total ?? null,
        sessions: meta.sessions,
        centre: meta.centre,
        status: s.payment_status,
      });
    }
    if (!res.has_more) break;
    params = { ...params, starting_after: res.data[res.data.length - 1].id };
  }
  return { payments, linksFound: linkIds.size };
}

// email -> what that address has paid in total. A player who paid for two
// sessions in two separate transactions must read as the sum, not as whichever
// one Stripe happened to return last. `paidAt` keeps the EARLIEST payment, so
// the sheet shows when they first committed.
export function aggregatePaymentsByEmail(payments) {
  const byEmail = new Map();
  for (const p of payments) {
    const k = emailKey(p.payerEmail);
    if (!k) continue;
    const prev = byEmail.get(k);
    if (!prev) {
      byEmail.set(k, { amountCents: p.amountCents || 0, paidAt: p.paidAt, method: 'email match', count: 1 });
      continue;
    }
    prev.amountCents += p.amountCents || 0;
    prev.count += 1;
    if (new Date(p.paidAt) < new Date(prev.paidAt)) prev.paidAt = p.paidAt;
    prev.method = `email match (${prev.count} payments)`;
  }
  return byEmail;
}

// ------------------------------------------------------------
// Non-destructive reconcile of one tab.
// ------------------------------------------------------------
async function reconcileTab(sheets, spreadsheetId, tabName, headers, lastCol, rows) {
  await ensureTab(sheets, spreadsheetId, tabName);
  await ensureHeader(sheets, spreadsheetId, tabName, headers);

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tabName}!A2:${lastCol}100000`,
  });
  const present = existing.data.values || [];

  const byId = new Map();
  present.forEach((row, i) => {
    const id = (row[0] || '').trim();
    if (id) byId.set(id, { rowNumber: i + 2, values: row });
  });

  const updates = [];
  const appends = [];
  let unchanged = 0;

  for (const built of rows) {
    const id = String(built[0]);
    const hit = byId.get(id);
    if (!hit) { appends.push(built); continue; }
    if (sameRow(hit.values, built, headers.length)) { unchanged++; continue; }
    updates.push({
      range: `${tabName}!A${hit.rowNumber}:${lastCol}${hit.rowNumber}`,
      values: [built],
    });
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: 'USER_ENTERED', data: updates },
    });
  }
  // INSERT_ROWS, never OVERWRITE, so an append can't land on top of anything
  // sitting below the data.
  if (appends.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A2`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: appends },
    });
  }

  return { tab: tabName, rows: rows.length, added: appends.length, updated: updates.length, unchanged };
}

// ------------------------------------------------------------
// The plain-English guide tab. Written ONCE, on first run only, so any wording
// a human changes to suit themselves survives every later sync.
// ------------------------------------------------------------
const GUIDE_LINES = [
  ['Performance Squads — Registrations & Payments — how this sheet works'],
  [''],
  ['This sheet fills itself in automatically. It refreshes every 4 hours from the'],
  ['registration form at rramelbourne.com/performance-squads and from Stripe. You do'],
  ['not need to add anyone by hand — a new registration appears on its own within 4'],
  ['hours, and so does a payment.'],
  [''],
  ['THE TABS'],
  [''],
  ['"North Melbourne" and "South-East Melbourne" — one row per player who registered'],
  ['for a trial at that centre, with whether they have paid.'],
  [''],
  ['"Payments (Stripe)" — every Performance Squads trial payment Stripe has taken,'],
  ['including any we could not match to a registration.'],
  [''],
  ['WHERE YOU CAN WORK SAFELY'],
  [''],
  ['On the centre tabs, columns A to AB are filled in by the automatic update. If you'],
  ['change something there, your change is replaced next time that player’s details'],
  ['change. Column AC onwards is yours and is never touched — put notes, follow-up'],
  ['status, selection decisions and anything else there.'],
  [''],
  ['On the Payments tab the same applies to columns A to J; K onwards is yours.'],
  [''],
  ['You can sort, filter, colour and hide rows freely. Rows are matched by the ID in'],
  ['column A, not by position, so your notes stay attached to the right person.'],
  [''],
  ['HOW "PAID" IS WORKED OUT'],
  [''],
  ['The trial fee is $30 per player, per session, taken through a Stripe payment link.'],
  ['Stripe does not tell our website when someone pays, so this sheet asks Stripe'],
  ['directly and matches a payment to a player BY EMAIL ADDRESS.'],
  [''],
  ['That means: if a parent registers with one email address and pays with a different'],
  ['one, the player shows as not paid, and the payment appears on the Payments tab'],
  ['marked UNMATCHED. It is not lost — it just needs a human to connect the two.'],
  ['Check the Payments tab before chasing anyone for money.'],
  [''],
  ['"Trial Fee Due" is simply $30 multiplied by the number of sessions the player'],
  ['booked on the form. "Amount Paid" is what Stripe actually took.'],
  [''],
  ['IF A ROW LOOKS WRONG'],
  [''],
  ['The sheet mirrors what the person typed into the form. If a detail is wrong, it was'],
  ['entered wrong — correct it in your own columns, or ask for it to be fixed at the'],
  ['source. Deleting a row here does not delete the registration; it comes back on the'],
  ['next update.'],
];

async function ensureGuideTab(sheets, spreadsheetId) {
  const created = await ensureTab(sheets, spreadsheetId, GUIDE_TAB);
  if (!created) return 'already present, left alone';
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${GUIDE_TAB}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: GUIDE_LINES },
  });
  return 'created';
}

// ------------------------------------------------------------
// Where the workbook id comes from. Env wins (an operator override); otherwise
// the holiday_program_sheets config row, so the target can be repointed with one
// SQL update and no redeploy.
// ------------------------------------------------------------
export async function resolveWorkbookId(sb) {
  if (process.env.PERFORMANCE_SQUADS_SHEET_ID) {
    return { id: process.env.PERFORMANCE_SQUADS_SHEET_ID, from: 'env' };
  }
  const { data, error } = await sb
    .from('holiday_program_sheets')
    .select('workbook_id')
    .eq('source_table', SOURCE_TABLE)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  if (!data?.workbook_id) return { id: null, from: 'none' };
  return { id: data.workbook_id, from: 'holiday_program_sheets' };
}

// ------------------------------------------------------------
// The whole job.
// ------------------------------------------------------------
export async function reconcilePerformanceSquads(sheets, spreadsheetId, sb = null, stripe = null) {
  sb = sb || getSupabase();
  stripe = stripe || getStripe();

  const { data: leads, error } = await sb
    .from(SOURCE_TABLE)
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;

  // Stripe, from a month before the earliest registration — comfortably covers
  // anyone who paid before finishing the form.
  const earliest = leads?.length ? new Date(leads[0].created_at).getTime() : Date.now();
  const sinceUnix = Math.floor((earliest - 30 * 24 * 3600 * 1000) / 1000);
  const { payments, linksFound } = await fetchPerformanceSquadPayments(stripe, sinceUnix);

  const paidByEmail = aggregatePaymentsByEmail(payments);

  // Registration email -> {id, player} so the Payments tab can name its match.
  const regByEmail = new Map();
  for (const r of leads || []) {
    const k = emailKey(r.email);
    if (k && !regByEmail.has(k)) regByEmail.set(k, { id: r.id, player: r.player_name });
  }

  // Group registrations into their centre tabs.
  const byTab = new Map();
  for (const r of leads || []) {
    const tab = CENTRE_TABS[r.preferred_centre] || FALLBACK_TAB;
    if (!byTab.has(tab)) byTab.set(tab, []);
    byTab.get(tab).push(regRow(r, paidByEmail.get(emailKey(r.email)) || null));
  }

  const tabResults = [];
  for (const [tab, rows] of byTab) {
    tabResults.push(await reconcileTab(sheets, spreadsheetId, tab, REG_HEADERS, REG_LAST_COL, rows));
  }

  // Payments tab — including unmatched, which is the whole point of listing it.
  const payRows = payments.map((p) => {
    const hit = regByEmail.get(emailKey(p.payerEmail));
    return payRow({ ...p, matchedId: hit?.id || null, matchedPlayer: hit?.player || '' });
  });
  const payResult = await reconcileTab(sheets, spreadsheetId, PAYMENTS_TAB, PAY_HEADERS, PAY_LAST_COL, payRows);

  const guide = await ensureGuideTab(sheets, spreadsheetId);

  await sb
    .from('holiday_program_sheets')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('source_table', SOURCE_TABLE);

  return {
    registrations: (leads || []).length,
    centreTabs: tabResults,
    payments: {
      ...payResult,
      stripePaymentsFound: payments.length,
      paymentLinksResolved: linksFound,
      unmatched: payRows.filter((r) => String(r[7]).startsWith('UNMATCHED')).length,
    },
    guide,
  };
}

// Authorise: a Vercel Cron call (shared CRON_SECRET) or an active dashboard
// admin (JWT). Same contract as sync-masterclass.js / sync-pgp-leads.js.
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

  let sb;
  try {
    sb = getSupabase();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  let workbook;
  try {
    workbook = await resolveWorkbookId(sb);
  } catch (err) {
    return res.status(500).json({ error: `workbook lookup failed: ${err.message}` });
  }
  if (!workbook.id) {
    return res.status(503).json({
      error: 'No Performance Squads workbook configured. Add a holiday_program_sheets row '
        + `with source_table='${SOURCE_TABLE}' and workbook_id set, or set PERFORMANCE_SQUADS_SHEET_ID.`,
    });
  }

  let sheets;
  try {
    sheets = getSheets();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  try {
    const result = await reconcilePerformanceSquads(sheets, workbook.id);
    return res.status(200).json({ ok: true, workbook: workbook.from, performanceSquads: result });
  } catch (err) {
    console.error('sync-performance-squads: reconcile failed:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

// ── NOTE ON api/sync-performance-squad-row.js ────────────────
// That file remains in the tree but is inert: no Supabase Database Webhook was
// ever created for performance_squad_leads, so it is never called. It also
// carries an auto-provisioning path that would have the service account CREATE
// the workbook — the failure mode this file's header warns about. It should be
// deleted, or its provisioning path removed, once someone confirms nothing else
// points at it.

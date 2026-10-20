// ============================================================
// Junior Royals Term 4, 2026 — its own sign-up workbook, one tab per centre.
// ============================================================
// Alex, 20 Oct 2026: "lets just create a new stand alone Junior Royals T4 2026 sign up
// sheet with tabs for each centre". Rows come from jr_term4_waitlist (every Term 4
// entry, booking and standby request from /junior-royals), every 10 minutes.
//
// Tabs (names end "— DO NOT EDIT"; notes go in the column to the right of the data):
//   Mickleham — Mondays           Mickleham entries, plus Williamstown entries
//                                 (no Term 4 in the west; Alex, 20 Oct: offer Mickleham).
//   Cranbourne North — Wednesdays Cranbourne North entries, plus Hallam entries (the
//                                 south-east program moved to Cranbourne North).
//   Centre not known              only if an entry names no centre we can place.
//   Summary                       counts per centre, rewritten every run.
//
// The workbook is Alex's (his Drive, Restricted, the service account as Editor) and is
// found through holiday_program_sheets.source_table = 'jr_term4_2026', so it can be
// repointed with one SQL update. The old "Junior Royals Term 4" tab in RRA — Program
// Sign-Ups keeps running until Alex retires it.
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { getSheets } from './_lib/pgpSheets.js';
import { reconcileTab, ensureTab, ensureProtectedRange, fmtMelb, asText } from './_lib/sheetReconcile.js';
import { jrTerm4Centre, jrTerm4Group, jrTerm4Payment, jrTerm4RequestDay } from './sync-program-signups.js';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

export const SOURCE_KEY = 'jr_term4_2026';
const DNE = ' — DO NOT EDIT';
const SAFE_COL_LABEL = 'YOUR NOTES — SAFE TO EDIT, NEVER OVERWRITTEN →';
const ROW_CAP = 5000;

// Where each entry's centre goes. Source of truth for the running centres:
// centres[] in src/components/junior-royals-t3/jrTerm4Data.js.
export const CENTRE_TABS = {
  mickleham: { tab: `Mickleham — Mondays${DNE}`, name: 'Mickleham', night: 'Mondays' },
  'cranbourne-north': { tab: `Cranbourne North — Wednesdays${DNE}`, name: 'Cranbourne North', night: 'Wednesdays' },
};
const UNKNOWN_TAB = `Centre not known${DNE}`;
const SUMMARY_TAB = `Summary${DNE}`;
export const tabFor = (centre) => ({
  mickleham: 'mickleham', williamstown: 'mickleham',
  'cranbourne-north': 'cranbourne-north', hallam: 'cranbourne-north',
}[centre] || null);

export const JR_T4_HEADERS = [
  'Entry ID',
  'Signed up (Melbourne)',
  'Status',
  'Player name',
  'Age',
  'Group and time',
  'Night',
  'Parent / guardian',
  'Parent email',
  'Parent phone',
  'Payment',
  'Note from the sign-up',
];

const kind = (r) => {
  const s = r.source || '';
  if (jrTerm4RequestDay(r)) return 'request';
  if (s.startsWith('junior-royals-term4-booking')) return 'booking';
  return 'interest';   // entries made before booking opened (19 Oct 2026), incl. the Term 3 sold-out page
};
const ageOk = (r) => Number(r.player_age) >= 7 && Number(r.player_age) <= 12;

// The same player entered more than once (same first name, same parent email). The
// entry kept is the paid one, else a booking or request, else the latest; the rest
// are marked so nobody rings a family twice. Siblings share an email, so the first
// name is part of the key and an email alone never merges two children.
export const duplicateOf = (rows) => {
  const key = (r) => `${String(r.player_name || '').trim().toLowerCase().split(/\s+/)[0]}|${String(r.parent_email || '').trim().toLowerCase()}`;
  const rank = (r) => [r.paid ? 2 : kind(r) === 'interest' ? 0 : 1, String(r.created_at || '')];
  const best = new Map();
  for (const r of rows) {
    const k = key(r); const b = best.get(k);
    if (!b || rank(r)[0] > rank(b)[0] || (rank(r)[0] === rank(b)[0] && rank(r)[1] > rank(b)[1])) best.set(k, r);
  }
  const out = new Map();
  for (const r of rows) { const b = best.get(key(r)); if (b && b.id !== r.id) out.set(r.id, b); }
  return out;
};

export const jrT4Status = (r, dupOf = null) => {
  if (dupOf) return `DUPLICATE — same player as the entry from ${fmtMelb(dupOf.created_at).slice(0, 10)} (${String(dupOf.id).slice(0, 8)})`;
  if (r.paid) return 'PAID — place booked';
  const day = jrTerm4RequestDay(r);
  if (day) return `STANDBY — asked for ${day} nights (nothing paid, no place held)`;
  if (!ageOk(r)) return `CHECK AGE — ${r.player_age ?? '?'} is outside 7 to 12`;
  if (kind(r) === 'booking') return 'NOT PAID — went to checkout, no payment yet';
  return 'INTEREST ONLY — signed up before booking opened; not booked';
};

export const jrT4Note = (r) => {
  const c = jrTerm4Centre(r);
  if (c === 'hallam') return 'Signed up for Hallam. The south-east program moved to the Elite Cricket Centre, Cranbourne North: tell them the venue.';
  if (c === 'williamstown') return 'Signed up for Williamstown. There is no Term 4 there; Alex: offer Mickleham (Mondays).';
  if (c === 'mickleham' && r.preferred_day === 'wednesday') return 'Asked for a Wednesday. Mickleham is now on Mondays: tell them the night has changed.';
  return '';
};

export const jrT4Row = (r, dupOf = null) => {
  const c = tabFor(jrTerm4Centre(r));
  const day = jrTerm4RequestDay(r);
  return [
    r.id || '',
    asText(fmtMelb(r.created_at)),
    jrT4Status(r, dupOf),
    r.player_name || '',
    asText(r.player_age ?? ''),
    jrTerm4Group(r),
    day ? `Asked for ${day} instead (standby)` : (CENTRE_TABS[c]?.night || ''),
    r.parent_name || '',
    r.parent_email || '',
    asText(r.parent_phone || ''),
    jrTerm4Payment(r),
    jrT4Note(r),
  ];
};

// Split every entry into its centre tab, oldest first (new entries are added at the bottom).
export const buildTabs = (rows) => {
  const sorted = [...rows].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  const dups = duplicateOf(sorted);
  const tabs = { mickleham: [], 'cranbourne-north': [], unknown: [] };
  for (const r of sorted) tabs[tabFor(jrTerm4Centre(r)) || 'unknown'].push(jrT4Row(r, dups.get(r.id) || null));
  return tabs;
};

// The Summary tab: one small table, rewritten every run.
export const summaryLines = (rows, now = new Date()) => {
  const dups = duplicateOf(rows);
  const live = rows.filter((r) => !dups.has(r.id));
  const at = (c) => live.filter((r) => tabFor(jrTerm4Centre(r)) === c);
  const paid = (rs, g) => rs.filter((r) => r.paid && (!g || jrTerm4Group(r).startsWith(g))).length;
  const opt = (rs, o) => rs.filter((r) => r.paid && new RegExp(`\\|pay=${o}`).test(r.source || '')).length;
  const nights = (rs) => {
    const n = {};
    for (const r of rs) { const d = jrTerm4RequestDay(r); if (d) n[d] = (n[d] || 0) + 1; }
    return Object.entries(n).map(([d, k]) => `${d} ${k}`).join(', ') || '0';
  };
  const col = (f) => ['mickleham', 'cranbourne-north'].map((c) => f(at(c)));
  return [
    ['Junior Royals Term 4, 2026: sign-ups by centre'],
    [`Updated ${fmtMelb(now.toISOString())} (Melbourne). This tab is rewritten every 10 minutes.`],
    [''],
    ['', 'Mickleham (Mondays, from 26 Oct)', 'Cranbourne North (Wednesdays, from 28 Oct)'],
    ['PAID: 5:00pm – 6:00pm group (ages 7–9)', ...col((rs) => paid(rs, '5:00pm'))],
    ['PAID: 6:00pm – 7:00pm group (ages 10–12)', ...col((rs) => paid(rs, '6:00pm'))],
    ['PAID: total places booked', ...col((rs) => paid(rs))],
    ['   of which paid upfront ($349)', ...col((rs) => opt(rs, 'upfront'))],
    ['   of which paying weekly ($44.95)', ...col((rs) => opt(rs, 'weekly'))],
    ['NOT PAID: went to checkout, no payment yet', ...col((rs) => rs.filter((r) => !r.paid && kind(r) === 'booking').length)],
    ['STANDBY: asked for another night (by night)', ...col(nights)],
    ['INTEREST ONLY: signed up before booking opened', ...col((rs) => rs.filter((r) => !r.paid && kind(r) === 'interest' && ageOk(r)).length)],
    ['CHECK AGE: outside 7 to 12', ...col((rs) => rs.filter((r) => !r.paid && !jrTerm4RequestDay(r) && !ageOk(r)).length)],
    [''],
    ['How to read this sheet'],
    ['Each centre tab has one row per sign-up. The Status column says what it is:'],
    ['  PAID: the family has paid; the player has a place. Only PAID rows have a place.'],
    ['  NOT PAID: they started booking and went to Stripe, but no payment has come through.'],
    ['  STANDBY: they asked for a night we do not run yet. Nothing paid, no place held.'],
    ['  INTEREST ONLY: they put their name down before booking opened on 19 October. Not booked.'],
    ['  CHECK AGE: the age they gave is outside 7 to 12.'],
    ['  DUPLICATE: the same player entered again; the row it points to is the one that counts.'],
    ['Williamstown sign-ups are on the Mickleham tab, and Hallam sign-ups on the Cranbourne North tab. Their "Note" column says so.'],
    [`Columns A to L are filled in automatically. Type notes in column M ("${SAFE_COL_LABEL.split(' —')[0]}") or to the right of it.`],
  ];
};

async function writeSummary(sheets, spreadsheetId, rows) {
  await ensureTab(sheets, spreadsheetId, SUMMARY_TAB);
  const lines = summaryLines(rows);
  await sheets.spreadsheets.values.update({
    spreadsheetId, range: `${SUMMARY_TAB}!A1`, valueInputOption: 'RAW', requestBody: { values: lines },
  });
  try {
    await ensureProtectedRange(sheets, spreadsheetId, SUMMARY_TAB, null,
      'This whole tab is rewritten automatically every 10 minutes. Anything you type here is replaced.');
  } catch (err) {
    console.warn('sync-jr-term4: could not protect the summary tab:', err.message);
  }
}

export async function syncJrTerm4(sheets, spreadsheetId, rows) {
  const tabs = buildTabs(rows);
  const results = [];
  for (const c of ['mickleham', 'cranbourne-north']) {
    results.push(await reconcileTab(sheets, spreadsheetId, CENTRE_TABS[c].tab, JR_T4_HEADERS, tabs[c], SAFE_COL_LABEL));
  }
  if (tabs.unknown.length) results.push(await reconcileTab(sheets, spreadsheetId, UNKNOWN_TAB, JR_T4_HEADERS, tabs.unknown, SAFE_COL_LABEL));
  await writeSummary(sheets, spreadsheetId, rows);
  return results;
}

// ------------------------------------------------------------
// Vercel function: cron (CRON_SECRET) or an active dashboard admin.
// ------------------------------------------------------------
const getSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars for this deployment');
  return createClient(url, key);
};

async function authorise(req, sb) {
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (token && process.env.CRON_SECRET && token === process.env.CRON_SECRET) return 'cron';
  if (!token) throw new Error('unauthorized');
  const { data: { user } = {}, error } = await sb.auth.getUser(token);
  if (error || !user?.email) throw new Error('unauthorized');
  const { data: admin } = await sb.from('dashboard_users').select('email').eq('email', user.email).eq('active', true).maybeSingle();
  if (!admin) throw new Error('forbidden');
  return user.email;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  let sb;
  try { sb = getSupabase(); } catch (err) { return res.status(500).json({ error: err.message }); }
  try { await authorise(req, sb); } catch (e) { return res.status(e.message === 'forbidden' ? 403 : 401).json({ error: e.message }); }

  const { data: cfg, error: cfgErr } = await sb.from('holiday_program_sheets')
    .select('workbook_id').eq('source_table', SOURCE_KEY).eq('is_active', true).maybeSingle();
  if (cfgErr) return res.status(500).json({ error: `workbook lookup failed: ${cfgErr.message}` });
  if (!cfg?.workbook_id) {
    return res.status(503).json({ error: `No workbook configured: add a holiday_program_sheets row with source_table='${SOURCE_KEY}'.` });
  }
  const { data: rows, error } = await sb.from('jr_term4_waitlist').select('*').order('created_at', { ascending: true }).limit(ROW_CAP);
  if (error) return res.status(500).json({ error: error.message });
  if ((rows || []).length >= ROW_CAP) return res.status(500).json({ error: `jr_term4_waitlist reached the ${ROW_CAP}-row cap; raise ROW_CAP` });

  try {
    const result = await syncJrTerm4(getSheets(), cfg.workbook_id, rows || []);
    await sb.from('holiday_program_sheets').update({ last_synced_at: new Date().toISOString() }).eq('source_table', SOURCE_KEY);
    return res.status(200).json({ ok: true, rows: (rows || []).length, tabs: result });
  } catch (err) {
    console.error('sync-jr-term4: failed:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

// ============================================================
// Vercel Serverless Function — mirror the sign-ups for the four programs on the
// home-page Register modal into ONE Google Sheet, one simple tab each, every
// 30 minutes on cron. GET (Vercel Cron) or POST (admin manual run).
// ============================================================
// Target workbook: "RRA — Program Sign-Ups", created by Alex in his own Drive
// and shared to the sync service account as Editor. The id lives in
// holiday_program_sheets (source_table = 'program_signups'), so it can be
// repointed with one SQL update and needs no redeploy.
//
// !! NEVER let the service account create the workbook itself. That SA has
// Google Drive storage quota 0, so any file it OWNS dies within days — 404 even
// to the SA, and writes start failing 403. Every sync target must be created by
// a human and shared to the SA.
//
// ── THE FOUR PROGRAMS, AND WHERE THEIR ENTRIES LIVE ──────────
//   Open Trial       /performance-squads-open-trial
//                    performance_squad_leads, program_type = OPEN_TRIAL_PROGRAM
//   Spin Club        /spin-club
//                    applications, program_type = 'Spin Club'
//   Juniors with Sid /sid-juniors
//                    match_registrations, match_slug LIKE 'sid-juniors%'
//   Tour Interest    /tours  (plus the closed 2026 referral-gated EOI form)
//                    applications, source = 'india-tour-eoi'
//                    + india_tour_2026_eoi (historical, closed 10 Aug 2026)
//
// ── MONEY: ONLY ONE OF THE FOUR TAKES ANY ───────────────────
// As at 30 Sep 2026, Open Trial is the only one of these programs that charges
// anything online ($30 a session, through the Performance Squads Stripe links).
//   • Spin Club registers interest — nothing to pay.
//   • Tour Interest is an expression of interest — nothing to pay. The India
//     Tour deposit page was retired on 5 Aug 2026 having collected $0.
//   • Juniors with Sid takes BOOKING REQUESTS: paymentLink is null on both
//     sessions in src/components/sid-juniors/sidJuniorsData.js, so no money is
//     taken online and no row carries an amount.
// Those three tabs therefore carry a Payment column that says so in words,
// rather than an empty column that reads like a broken sync. The moment a
// Stripe Payment Link is added to PROGRAM_PAYMENT_LINKS below, that program
// starts reconciling against Stripe with no other change.
//
// ── OPEN TRIAL IS ALSO IN THE PERFORMANCE SQUADS WORKBOOK ────
// Open-trial bookings are performance_squad_leads rows and reuse the same four
// Stripe links, so api/sync-performance-squads.js already mirrors them into
// "Performance Squads — Registrations & Payments". This sync deliberately
// allocates payments across ALL performance_squad_leads and only then filters
// down to the open-trial rows, so the two workbooks can never disagree about
// who has paid. Retiring one of them is a decision for Alex, not a bug.
//
// ── NON-DESTRUCTIVE ──────────────────────────────────────────
// People work in this sheet by hand. Rules and mechanics live in
// api/_lib/sheetReconcile.js: never clear, never delete, never write outside
// the sync's own column block, only rewrite a row that actually changed, match
// rows by the id in column A.
//
// ── SETUP, ONCE ──────────────────────────────────────────────
//   1. Alex creates a Google Sheet named "RRA — Program Sign-Ups" in HIS OWN
//      Drive. The service account must never own it (see the quota note above).
//   2. Share it as Editor with the sync service account. Its address is already
//      on the share list of "Performance Squads — Registrations & Payments" —
//      copy the ...@....iam.gserviceaccount.com address from there.
//   3. Register the workbook:
//        insert into holiday_program_sheets (source_table, workbook_id, is_active)
//        values ('program_signups', '<the id from the sheet URL>', true);
//   4. The cron in vercel.json picks it up on the next half hour. To run it
//      immediately, POST to /api/sync-program-signups with a dashboard admin's
//      Supabase JWT.
// Until step 3 is done the endpoint answers 503 with these instructions rather
// than failing silently.
//
// Auth: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` (GET); a
// dashboard admin can POST with their Supabase JWT to run it on demand.
// Env: SUPABASE_URL/VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      GOOGLE_SERVICE_ACCOUNT_JSON, STRIPE_SECRET_KEY, CRON_SECRET,
//      PROGRAM_SIGNUPS_SHEET_ID (optional — overrides the DB config row).
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getSheets } from './_lib/pgpSheets.js';
import {
  reconcileTab, ensureTab, ensureProtectedRange,
  fmtMelb, asText, money, emailKey, colLetter,
} from './_lib/sheetReconcile.js';

export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

// The key this workbook is registered under in holiday_program_sheets. Not a
// real table — this sync reads four of them.
const SOURCE_TABLE = 'program_signups';

// Every tab this function writes carries the warning in its NAME, because the
// tab strip is the one thing you cannot miss. Someone who spends an afternoon
// typing notes into a synced column loses that afternoon on the next run, and a
// warning buried in a guide tab does not stop that.
const DNE = ' — DO NOT EDIT';
const GUIDE_TAB = `How this sheet works${DNE}`;
const PAYMENTS_TAB = `Payments (Stripe)${DNE}`;

const SAFE_COL_LABEL = 'YOUR NOTES — SAFE TO EDIT, NEVER OVERWRITTEN →';

// ------------------------------------------------------------
// Program identifiers. Source of truth is the form that writes the row —
// if one of these changes on the page, change it here in the same commit or
// the tab silently empties.
// ------------------------------------------------------------

// src/components/open-age-trial/OpenAgeRegistrationForm.jsx → PROGRAM_TYPE
const OPEN_TRIAL_PROGRAM = 'performance-squads-open-age-2026';
// src/components/spin-club/SCForm.jsx → program_type
const SPIN_CLUB_PROGRAM = 'Spin Club';
// src/components/sid-juniors/sidJuniorsData.js → dbSlug / requestSlug
const SID_SLUG_PREFIX = 'sid-juniors';
// src/components/india-tour-2026/ITForm.jsx → SOURCE_TAG
const TOUR_SOURCE = 'india-tour-eoi';
// src/components/junior-royals-t3/JRT3RegistrationForm.jsx writes every Term 4
// entry to its own table, so there is nothing to filter on.
const JR_TERM4_TABLE = 'jr_term4_waitlist';

// Tour Interest shows entries from 1 SEPTEMBER 2026 ONWARDS (Alex, 30 Sep 2026).
// Anything older is a lead from a campaign that has been and gone, and it made
// the tab read as a big list when the live funnel is small.
//
// In practice this cutoff removes the whole `india_tour_2026_eoi` source: that
// referral-gated form closed on 10 Aug 2026 and every one of its 22 entries
// predates the cutoff. The rows are NOT deleted — they are still in the table,
// they are just not on this tab. If the cutoff is ever moved back they reappear
// on the next run with no other change.
//
// Melbourne local midnight, not UTC: "from September" means the 1st here, not
// mid-afternoon on the 31st.
const TOUR_SINCE = '2026-08-31T14:00:00.000Z'; // 2026-09-01 00:00 Australia/Melbourne
export const isTourEntryInWindow = (createdAt) =>
  Boolean(createdAt) && new Date(createdAt) >= new Date(TOUR_SINCE);

// ------------------------------------------------------------
// Stripe. A program only reconciles against Stripe if it has links here.
//
// Open Trial: source of truth is PAYMENT_LINKS in
// src/components/performance-squads/data.js. A Checkout Session carries the
// Payment Link ID (plink_...), not the short URL, so at runtime we list Payment
// Links once and map url -> id.
//
// Juniors with Sid: both sessions have paymentLink: null (UNCONFIRMED, Alex to
// confirm). Add the two URLs here when they exist and the Sid tab starts
// showing payments — nothing else needs changing.
// ------------------------------------------------------------
export const PROGRAM_PAYMENT_LINKS = {
  'open-trial': {
    'https://buy.stripe.com/4gMcN56nvggZ2D233t9Zm0z': { centre: 'north-melbourne', sessions: 1 },
    'https://buy.stripe.com/8x2bJ17rz2q9elKeMb9Zm0A': { centre: 'north-melbourne', sessions: 2 },
    'https://buy.stripe.com/6oU4gz3bj0i1elK1Zp9Zm0x': { centre: 'south-east-melbourne', sessions: 1 },
    'https://buy.stripe.com/9B6cN53bj8Ox6TifQf9Zm0y': { centre: 'south-east-melbourne', sessions: 2 },
  },
  'spin-club': {},
  'sid-juniors': {},
  'tour-interest': {},
  'jr-term4': {},
};

// $30 per player, per session. Source of truth is PAYMENT_OPTIONS in
// src/components/performance-squads/data.js.
const TRIAL_FEE_CENTS = 3000;

// What a tab says in its Payment column when the program takes no money online.
// Full sentences on purpose: someone opening this sheet for the first time
// should not have to ask anyone what a blank column means.
const NO_PAYMENT_LINE = {
  'spin-club': 'Nothing to pay — this is a registration of interest only',
  'sid-juniors': 'Booking request — no payment has been taken and no place is held',
  'tour-interest': 'Nothing to pay — this is an expression of interest only',
  'jr-term4': 'Nothing to pay — an entry only. No place is held until we confirm one.',
};

// Readable centre names for CELL values. Deliberately separate from anything
// carrying the DO NOT EDIT suffix: a cell should read "Cranbourne North".
const CENTRE_NAMES = {
  'north-melbourne': 'Mickleham',
  'south-east-melbourne': 'Cranbourne North',
};

// The open-trial form stores session ids, which mean nothing to a coach reading
// the sheet. Source of truth is TRIAL_SESSIONS in
// src/components/open-age-trial/openAgeData.js. An unknown id falls back to the
// raw id rather than being hidden, so a stale mapping is visible, not silent.
const TRIAL_SESSION_LABELS = {
  'oa-2026-10-04': 'Sun 4 Oct, 1:00-2:30 PM (Cranbourne North)',
  'oa-2026-10-05': 'Mon 5 Oct, 5:30-7:00 PM (Mickleham)',
};
const sessionLabel = (id) => TRIAL_SESSION_LABELS[id] || id;

// Spin Club club keys -> where that block actually runs.
// Source: CLUBS in src/components/spin-club/scOptions.js.
const SPIN_CLUB_CENTRES = {
  north: 'Spin Club North — Mickleham Indoor Sports Centre',
  south: 'Spin Club South — Elite Cricket Centre, Cranbourne North',
};

// Tour window ids -> the words the player actually chose on the form.
// Source: TOURS in src/components/india-tour-2026/itCopy.js.
const TOUR_WINDOWS = {
  '2026-12-late-dec-jan': 'Late December 2026 to early January 2027',
  '2027-04-april': 'April 2027',
};

// How many rows this sync will read from any one source. PostgREST silently
// caps an unbounded select at 1,000 and still returns 200 OK, so "unbounded"
// is not the safe option — an explicit, generous cap that is CHECKED after the
// read is. Largest source is performance_squad_leads at 240 (30 Sep 2026).
const ROW_CAP = 5000;

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in Vercel env vars for this deployment');
  _supabase = createClient(url, key);
  return _supabase;
};

let _stripe = null;
const getStripe = () => (_stripe ||= new Stripe(process.env.STRIPE_SECRET_KEY));

// ============================================================
// Stripe
// ============================================================

// Every configured URL across every program, mapped url -> { program, ...meta }.
const allConfiguredLinks = () => {
  const out = new Map();
  for (const [program, links] of Object.entries(PROGRAM_PAYMENT_LINKS)) {
    for (const [url, meta] of Object.entries(links)) out.set(url, { program, ...meta });
  }
  return out;
};

// Map Payment Link URL -> plink id. A configured URL Stripe has never heard of
// takes money nowhere — the Pay button leads to a dead Stripe screen and the
// player quietly gives up. Silence is the dangerous outcome, so name the misses.
export async function resolvePaymentLinkIds(stripe) {
  const configured = allConfiguredLinks();
  if (configured.size === 0) return { ids: new Map(), missing: [], inactive: [] };

  const ids = new Map();          // plink id -> { program, centre, sessions, url, active }
  const seenUrls = new Set();
  let params = { limit: 100 };
  for (let page = 0; page < 10; page++) {
    const res = await stripe.paymentLinks.list(params);
    for (const link of res.data) {
      const meta = configured.get(link.url);
      if (!meta) continue;
      seenUrls.add(link.url);
      ids.set(link.id, { ...meta, url: link.url, active: link.active !== false });
    }
    if (!res.has_more) break;
    params = { ...params, starting_after: res.data[res.data.length - 1].id };
  }
  const missing = [...configured.keys()].filter((u) => !seenUrls.has(u));
  const inactive = [...ids.values()].filter((m) => !m.active).map((m) => m.url);
  return { ids, missing, inactive };
}

// One plain-English line per configured link, for the guide tab.
export function describeLinkHealth({ ids, inactive = [] }) {
  const configured = allConfiguredLinks();
  if (configured.size === 0) return [];
  // Derive each verdict from what Stripe actually returned, NOT from a
  // separately-computed "missing" list. Absence of evidence is the whole signal
  // here, and defaulting an unrecognised link to "working" would hide exactly
  // the fault this section exists to catch.
  const byUrl = new Map([...ids.values()].map((m) => [m.url, m]));
  return [...configured.entries()].map(([url, meta]) => {
    const centre = CENTRE_NAMES[meta.centre] || meta.centre || meta.program;
    const what = `${PROGRAM_LABELS[meta.program] || meta.program} — ${centre}, `
      + `${meta.sessions} session${meta.sessions > 1 ? 's' : ''} ($${meta.sessions * TRIAL_FEE_CENTS / 100})`;
    if (!byUrl.has(url)) return `${what}: BROKEN — Stripe has no payment link at this address.`;
    if (inactive.includes(url)) return `${what}: TURNED OFF in Stripe — it will not take a payment.`;
    return `${what}: working.`;
  });
}

// Walk Checkout Sessions and keep the paid ones that came from a configured
// link. `sinceUnix` bounds the walk — there is no reason to page back through
// years of unrelated sessions.
export async function fetchPayments(stripe, sinceUnix) {
  const health = await resolvePaymentLinkIds(stripe);
  if (health.ids.size === 0) return { payments: [], health };

  const payments = [];
  let params = { limit: 100, created: { gte: sinceUnix } };
  for (let page = 0; page < 25; page++) {
    const res = await stripe.checkout.sessions.list(params);
    for (const s of res.data) {
      if (!s.payment_link || !health.ids.has(s.payment_link)) continue;
      if (s.payment_status !== 'paid') continue;
      const meta = health.ids.get(s.payment_link);
      payments.push({
        sessionId: s.id,
        paidAt: new Date((s.created || 0) * 1000).toISOString(),
        payerName: s.customer_details?.name || '',
        payerEmail: s.customer_details?.email || '',
        amountCents: s.amount_total ?? null,
        program: meta.program,
        centre: meta.centre,
        sessions: meta.sessions,
      });
    }
    if (!res.has_more) break;
    params = { ...params, starting_after: res.data[res.data.length - 1].id };
  }
  return { payments, health };
}

// A payment can land a little before the registration row it belongs to —
// clock skew, or a player who opened the link then finished the form.
const PAYMENT_GRACE_MS = 5 * 60 * 1000;

// Give every payment to ONE registration, instead of giving every registration
// the lifetime total for its email address. This matters because the open age
// trial reuses the September squad-trial Stripe links: someone who paid $30 in
// September and books a $30 open age session in October would otherwise read as
// fully PAID for October without paying for it.
//
// A payment goes to the most recent registration made at or before it. A
// payment that predates every registration for that email goes to the first
// one. An email with exactly one registration is therefore unchanged.
export function allocatePayments(records, payments) {
  const byEmail = new Map();
  for (const r of records || []) {
    const k = emailKey(r.email);
    if (!k) continue;
    if (!byEmail.has(k)) byEmail.set(k, []);
    byEmail.get(k).push(r);
  }
  for (const list of byEmail.values()) {
    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  const byRecordId = new Map();     // record id -> paid summary
  const recordByPayment = new Map(); // stripe session id -> { id, player, program }

  for (const p of payments) {
    const k = emailKey(p.payerEmail);
    const regs = k ? byEmail.get(k) : null;
    if (!regs || !regs.length) continue;

    const paidAt = new Date(p.paidAt).getTime();
    let target = regs[0];
    for (const r of regs) {
      if (new Date(r.created_at).getTime() <= paidAt + PAYMENT_GRACE_MS) target = r;
      else break;
    }

    recordByPayment.set(p.sessionId, {
      id: target.id,
      player: target.player_name || '',
      program: target.program_type || '',
    });

    const prev = byRecordId.get(target.id);
    if (!prev) {
      byRecordId.set(target.id, {
        amountCents: p.amountCents || 0, paidAt: p.paidAt, count: 1,
      });
      continue;
    }
    prev.amountCents += p.amountCents || 0;
    prev.count += 1;
    if (new Date(p.paidAt) < new Date(prev.paidAt)) prev.paidAt = p.paidAt;
  }

  return { byRecordId, recordByPayment };
}

// Does what Stripe took line up with what the form said they owe? This exists
// because email matching cannot see siblings: one parent paying for two children
// from a single email address makes the first look OVERPAID and the second look
// UNPAID, and the obvious reaction — chase the second family — would be wrong.
export const paymentCheck = (dueCents, pay) => {
  if (!pay) return dueCents ? 'Not paid yet' : '';
  const paid = pay.amountCents || 0;
  if (!dueCents) return `Paid ${money(paid)} — the form recorded no sessions, check what they booked`;
  if (paid === dueCents) return 'OK';
  if (paid > dueCents) {
    return `Paid ${money(paid - dueCents)} more than due — likely covers a sibling registered `
      + 'under a different email. Check before chasing anyone.';
  }
  return `Short ${money(dueCents - paid)} — paid ${money(paid)} of ${money(dueCents)}`;
};

// ============================================================
// The four tabs. One row per person, plain column names, no codes.
// ============================================================
export const PROGRAM_LABELS = {
  'open-trial': 'Open Trial',
  'spin-club': 'Spin Club',
  'sid-juniors': 'Juniors with Sid',
  'tour-interest': 'Tour Interest',
  'jr-term4': 'Junior Royals Term 4',
};
const tabName = (key) => `${PROGRAM_LABELS[key]}${DNE}`;

// ── Open Trial ──────────────────────────────────────────────
export const OPEN_TRIAL_HEADERS = [
  'Registration ID',
  'Registered (Melbourne)',
  'Player Name',
  'Age',
  'Parent / Guardian',
  'Email',
  'Phone',
  'Club',
  'Centre',
  'Sessions Booked',
  'Session Dates',
  'Fee Due (AUD)',
  'Paid in Stripe?',
  'Amount Paid (AUD)',
  'Paid At (Melbourne)',
  'Payment Check',
];

export const openTrialRow = (r, pay) => {
  const sessions = Number(r.trial_sessions) || 0;
  const dates = Array.isArray(r.trial_session_dates)
    ? r.trial_session_dates.map(sessionLabel).join(', ')
    : '';
  const dueCents = sessions * TRIAL_FEE_CENTS;
  return [
    r.id || '',
    asText(fmtMelb(r.created_at)),
    r.player_name || '',
    asText(r.player_age ?? ''),
    r.parent_name || '',
    r.email || '',
    asText(r.phone || ''),
    r.club || '',
    CENTRE_NAMES[r.preferred_centre] || r.preferred_centre || '',
    asText(sessions || ''),
    dates,
    sessions ? money(dueCents) : '',
    pay ? 'Yes' : 'No',
    pay ? money(pay.amountCents) : '',
    pay ? asText(fmtMelb(pay.paidAt)) : '',
    paymentCheck(dueCents, pay),
  ];
};

// ── Spin Club ───────────────────────────────────────────────
export const SPIN_CLUB_HEADERS = [
  'Registration ID',
  'Registered (Melbourne)',
  'Player Name',
  'Age',
  'Parent / Guardian',
  'Email',
  'Phone',
  'Current Club',
  'Type of Spin They Bowl',
  'Already in a Performance Squad?',
  'Which Spin Club',
  'What They Told Us',
  'Payment',
];

// The form appends "Intends to accept an offer if selected: yes" to whatever the
// parent typed. That line is on every single row, so it tells a reader nothing
// and only buries the note that does. Strip it and keep the person's own words.
const ACCEPT_LINE = /\n*Intends to accept an offer if selected: yes\s*$/;

export const spinClubRow = (r) => ([
  r.id || '',
  asText(fmtMelb(r.created_at)),
  [r.first_name, r.last_name].filter(Boolean).join(' '),
  asText(r.age ?? ''),
  r.parent1_name || '',
  r.email || '',
  asText(r.phone || ''),
  r.club || '',
  r.cricket_type || '',
  r.experience_level || '',
  SPIN_CLUB_CENTRES[r.location] || r.program || r.location || '',
  (r.bio || '').replace(ACCEPT_LINE, '').trim(),
  NO_PAYMENT_LINE['spin-club'],
]);

// ── Juniors with Sid ────────────────────────────────────────
export const SID_HEADERS = [
  'Booking ID',
  'Booked (Melbourne)',
  'Session',
  'Centre',
  'Player Name',
  'Age',
  'Parent / Guardian',
  'Email',
  'Phone',
  'Club',
  'Photo/Video Consent',
  'What They Told Us',
  'Payment',
  'Amount Paid (AUD)',
  'Paid At (Melbourne)',
];

// The slug carries the centre: 'sid-juniors-2026-10-04-cranbourne-north[-request]'.
export const sidCentre = (slug) => {
  const s = String(slug || '');
  if (s.includes('cranbourne-north')) return 'Cranbourne North';
  if (s.includes('mickleham')) return 'Mickleham';
  return '';
};

export const sidRow = (r, pay) => {
  // A '-request' slug is a booking request: details saved, no money taken, no
  // place held. Anything else came through a Stripe payment link.
  const isRequest = String(r.match_slug || '').endsWith('-request');
  const paidLine = pay
    ? 'Paid'
    : (isRequest ? NO_PAYMENT_LINE['sid-juniors'] : `Not paid yet — ${money(r.amount ? r.amount * 100 : 0)} due`);
  return [
    r.id || '',
    asText(fmtMelb(r.created_at)),
    r.match_name || r.match_slug || '',
    sidCentre(r.match_slug),
    r.player_name || '',
    asText(r.player_age ?? ''),
    r.parent_name || '',
    r.email || '',
    asText(r.phone || ''),
    r.club || '',
    r.accept_social_media === true ? 'Yes' : r.accept_social_media === false ? 'No' : '',
    r.notes || '',
    paidLine,
    pay ? money(pay.amountCents) : '',
    pay ? asText(fmtMelb(pay.paidAt)) : '',
  ];
};

// ── Tour Interest ───────────────────────────────────────────
export const TOUR_HEADERS = [
  'Entry ID',
  'Registered (Melbourne)',
  'Player Name',
  'Date of Birth',
  'Age',
  'Email',
  'Phone',
  'Parent / Guardian',
  'Parent Email',
  'Parent Phone',
  'Current Club',
  'Highest Level Played',
  'Main Skill',
  'Tours They Want',
  'Registered Via',
  'Payment',
];

// The live /tours page writes an applications row.
export const tourRowFromApplication = (r) => ([
  r.id || '',
  asText(fmtMelb(r.created_at)),
  [r.first_name, r.last_name].filter(Boolean).join(' '),
  asText(r.dob || ''),
  asText(r.age ?? ''),
  r.email || '',
  asText(r.phone || ''),
  r.parent1_name || '',
  r.parent1_email || '',
  asText(r.parent1_phone || ''),
  r.club || '',
  r.experience_level || '',
  r.cricket_type || '',
  (Array.isArray(r.tour_interest) ? r.tour_interest : [])
    .map((id) => TOUR_WINDOWS[id] || id).join(', '),
  'Tour page (rramelbourne.com/tours)',
  NO_PAYMENT_LINE['tour-interest'],
]);

// The 2026 referral-gated EOI form. It stopped taking entries on 10 Aug 2026,
// but the people who filled it in are the same list of "who wants to tour", and
// leaving them out would make this tab read as if almost nobody is interested.
// The "Registered Via" column keeps the two apart.
export const tourRowFromEoi = (r) => ([
  r.id || '',
  asText(fmtMelb(r.created_at)),
  r.player_name || '',
  asText(r.player_dob || ''),
  asText(r.player_age ?? ''),
  r.player_email || '',
  asText(r.player_phone || ''),
  r.guardian1_name || '',
  r.guardian1_email || '',
  asText(r.guardian1_phone || ''),
  r.current_club || '',
  r.highest_level || '',
  r.primary_skill || '',
  '',
  'India Tour 2026 EOI form (closed 10 Aug 2026)',
  NO_PAYMENT_LINE['tour-interest'],
]);

// ── Junior Royals Term 4 ────────────────────────────────────
// Entries from /junior-royals. Nothing is paid and no place is held — the page
// says so, and so does this tab.
//
// THE POINT OF THE "RUNNING IN TERM 4?" COLUMN.
// Until 27 Sep 2026 the form still offered Hallam and Williamstown. Alex
// confirmed that day that neither has a Term 4 program, and the form now offers
// Mickleham and Cranbourne North only — but the entries taken before that are
// still in the table, and 16 of the 29 on the list picked a centre that will
// not run. Listing them without saying so puts a coach on the phone to a family
// about a session that does not exist. So every row states it in words.
//
// Deliberately NOT done here: proposing the other centre. Mickleham and
// Cranbourne North are about 70km apart, and a same-centre offer is the
// standing rule — who gets called, and what they are offered, is Alex's call
// and not a column in a spreadsheet.
export const JR_TERM4_HEADERS = [
  'Entry ID',
  'Registered (Melbourne)',
  'Player Name',
  'Age',
  'Parent / Guardian',
  'Parent Email',
  'Parent Phone',
  'Centre They Chose',
  'Running in Term 4?',
  'Night They Chose',
  'Payment',
];

// Centres that actually run Junior Royals in Term 4. Source of truth is
// WAITLIST_CENTRES in src/components/junior-royals-t3/JRT3RegistrationForm.jsx.
// If a centre is added or dropped there, change it here in the same commit.
const JR_TERM4_CENTRES = {
  'mickleham': 'Mickleham Indoor Sports Centre',
  'cranbourne-north': 'Elite Cricket Centre, Cranbourne North',
  // "hallam" IS the Cranbourne North centre under its old name (Alex, 30 Sep
  // 2026). The south-east centre was called Hallam when these 12 families
  // entered, so they are IN the centre that runs Term 4, not stranded by it.
  // Treating 'hallam' as closed would have put a coach on the phone telling 12
  // families there is no program when there is one.
  'hallam': 'Elite Cricket Centre, Cranbourne North',
};
// Centres the form used to offer that genuinely have no Term 4 program. Named
// rather than lumped into an "unknown" bucket, so a stale value and a genuinely
// unrecognised one do not read the same.
const JR_TERM4_CLOSED_CENTRES = {
  williamstown: 'Williamstown',
};

export const jrTerm4CentreStatus = (centre) => {
  if (JR_TERM4_CENTRES[centre]) {
    return 'Yes — Wednesdays 6:00pm or 7:00pm, 7 October to 16 December';
  }
  if (JR_TERM4_CLOSED_CENTRES[centre]) {
    return `NO — there is no Term 4 program at ${JR_TERM4_CLOSED_CENTRES[centre]}. `
      + 'They entered before the centres were confirmed and have not been told yet.';
  }
  return `Centre "${centre || '(blank)'}" is not one we recognise — check this row by hand`;
};

// Wednesday is the booked night at both centres (net bookings RRA-T4-2026-MIC
// and RRA-T4-2026-CRN). Monday is Performance Squad, and is offered on the form
// only to measure demand for a second night.
const JR_TERM4_NIGHTS = {
  wednesday: 'Wednesday — the Term 4 night',
  monday: 'Monday — only runs if we add a second night',
};

export const jrTerm4Row = (r) => ([
  r.id || '',
  asText(fmtMelb(r.created_at)),
  r.player_name || '',
  asText(r.player_age ?? ''),
  r.parent_name || '',
  r.parent_email || '',
  asText(r.parent_phone || ''),
  r.preferred_centre === 'hallam'
    ? `${JR_TERM4_CENTRES.hallam} (they picked it as "Hallam", the centre's old name)`
    : JR_TERM4_CENTRES[r.preferred_centre]
      || JR_TERM4_CLOSED_CENTRES[r.preferred_centre]
      || r.preferred_centre || '',
  jrTerm4CentreStatus(r.preferred_centre),
  JR_TERM4_NIGHTS[r.preferred_day]
    || (r.preferred_day ? r.preferred_day : 'Not asked — they entered before the form asked about nights'),
  NO_PAYMENT_LINE['jr-term4'],
]);

// ── Payments (Stripe) ───────────────────────────────────────
// Every payment on a configured link, INCLUDING the ones we could not attach to
// a sign-up. An unmatched payment is never dropped — it is listed so a human can
// resolve it, because the alternative is chasing someone who has already paid.
export const PAY_HEADERS = [
  'Stripe Session ID',
  'Paid At (Melbourne)',
  'Payer Name',
  'Payer Email',
  'Amount (AUD)',
  'Paid For',
  'Centre (from payment link)',
  'Matched To',
  'Matched Player',
  'Which Program the Match Belongs To',
];

export const payRow = (p) => ([
  p.sessionId,
  asText(fmtMelb(p.paidAt)),
  p.payerName || '',
  p.payerEmail || '',
  money(p.amountCents),
  PROGRAM_LABELS[p.program] || p.program,
  CENTRE_NAMES[p.centre] || p.centre || '',
  p.matchedId || 'UNMATCHED — no sign-up with this email address',
  p.matchedPlayer || '',
  // Open-trial money and September squad-trial money are the SAME product
  // inside Stripe and cannot be told apart on the payment side. The matched
  // registration's program_type is the only thing that splits them.
  p.matchedProgram || '',
]);

// ============================================================
// The guide tab. Unlike the data tabs this one IS rewritten every run,
// deliberately: it tells people which columns are safe to work in, and when that
// boundary moves a guide frozen at first-write would quietly send someone to put
// their notes in a column the sync overwrites. Generated documentation, not a
// scratchpad — keep your own notes on the data tabs.
// ============================================================
export const guideLines = (linkLines = [], counts = {}) => {
  const safeCol = (headers) => colLetter(headers.length);
  return [
    ['RRA — Program Sign-Ups — how this sheet works'],
    [''],
    ['This sheet fills itself in automatically, every 30 minutes, from the registration'],
    ['forms on rramelbourne.com and from Stripe. You do not need to add anyone by hand —'],
    ['a new sign-up appears on its own within half an hour, and so does a payment.'],
    [''],
    ['THE PROGRAM TABS — one per program on the "Register" panel on the home page'],
    [''],
    [`"${PROGRAM_LABELS['open-trial']}" — the open age T20 trial for players 16 to 25 at`],
    ['  rramelbourne.com/performance-squads-open-trial. $30 per player, per session,'],
    ['  paid through Stripe when they book. This is the only program on this sheet that'],
    [`  takes money online. Currently ${counts.openTrial ?? 0} sign-ups.`],
    [''],
    [`"${PROGRAM_LABELS['spin-club']}" — spin bowlers 10 to 25 registering interest in the`],
    ['  8-week Wednesday block at rramelbourne.com/spin-club. Nothing is paid: these'],
    [`  people have put their hand up, not bought anything. Currently ${counts.spinClub ?? 0} sign-ups.`],
    [''],
    [`"${PROGRAM_LABELS['sid-juniors']}" — the junior sessions with Siddhartha Lahiri for`],
    ['  players 8 to 16 at rramelbourne.com/sid-juniors. These are BOOKING REQUESTS:'],
    ['  the details are saved, no money has been taken and no place is held. Someone'],
    ['  has to come back to each family and confirm. If a Stripe payment link is added'],
    [`  to the page later, payments start appearing here on their own. Currently ${counts.sidJuniors ?? 0}.`],
    [''],
    [`"${PROGRAM_LABELS['jr-term4']}" — families who have entered for Term 4 at`],
    ['  rramelbourne.com/junior-royals. Nothing is paid and NO PLACE IS HELD: an entry'],
    [`  means they have put their hand up, not that they are in. Currently ${counts.jrTerm4 ?? 0} entries.`],
    [''],
    ['  READ THE "RUNNING IN TERM 4?" COLUMN BEFORE YOU RING ANYONE.'],
    ['  Term 4 runs at Mickleham and the Elite Cricket Centre in Cranbourne North, on'],
    ['  Wednesday nights, 7 October to 16 December, one hour a week in two groups at'],
    ['  6:00pm and 7:00pm.'],
    [''],
    ['  "HALLAM" ON A ROW MEANS CRANBOURNE NORTH. It is the same south-east centre'],
    ['  under its old name, so those families are in a centre that IS running. Their'],
    ['  row says so. Nothing is wrong with those entries.'],
    [''],
    [`  Williamstown is the real gap: ${counts.jrTerm4Closed ?? 0} entries on this tab picked it, and there`],
    ['  is no Term 4 program there. Those families have not been told. Do not promise'],
    ['  them a place, and do not offer them another centre off your own bat —'],
    ['  Williamstown to either Term 4 centre is a long way across Melbourne. Ask Alex'],
    ['  what those families should be told.'],
    [''],
    ['  The "Night They Chose" column works the same way. Wednesday is the night that is'],
    ['  actually booked. Monday was offered to measure whether a second night is worth'],
    ['  adding — picking it does not mean a Monday session exists.'],
    [''],
    [`"${PROGRAM_LABELS['tour-interest']}" — players who want to go on an India tour, from`],
    ['  rramelbourne.com/tours. An expression of interest, not a booking: nothing has'],
    ['  been paid and no place is held.'],
    [''],
    [`  THIS TAB STARTS AT 1 SEPTEMBER 2026. Currently ${counts.tour ?? 0} entries. A further`],
    [`  ${counts.tourBeforeCutoff ?? 0} people registered interest before that date and are NOT shown here —`],
    ['  almost all of them through the older India Tour 2026 EOI form, which closed on'],
    ['  10 August 2026. Nothing has been deleted: those entries are still in the'],
    ['  database and can be put back on this tab whenever you want them.'],
    [''],
    [`"${PAYMENTS_TAB.replace(DNE, '')}" — every payment Stripe has taken on these programs,`],
    ['  including any we could NOT match to a sign-up.'],
    [''],
    ['WHY EVERY TAB SAYS "DO NOT EDIT"'],
    [''],
    ['Every tab here is filled in by the automation, so each one is named'],
    ['"... — DO NOT EDIT". That warning is about the AUTOMATIC COLUMNS, not the whole'],
    ['sheet — there is a safe place to work, and it is right below. Google will also'],
    ['warn you if you start typing into an automatic column; that warning is real, and'],
    ['clicking through it means your typing is replaced within half an hour.'],
    [''],
    ['WHERE YOU CAN WORK SAFELY'],
    [''],
    ['On each tab, everything up to and including the last automatic column is'],
    ['rewritten by the update. The first column AFTER it is yours and is never'],
    ['touched — put notes, follow-up status and decisions there. It is labelled'],
    ['"YOUR NOTES — SAFE TO EDIT" so you can find it. Per tab, your first safe column is:'],
    [''],
    [`  ${PROGRAM_LABELS['open-trial']}: column ${safeCol(OPEN_TRIAL_HEADERS)} onwards`],
    [`  ${PROGRAM_LABELS['spin-club']}: column ${safeCol(SPIN_CLUB_HEADERS)} onwards`],
    [`  ${PROGRAM_LABELS['sid-juniors']}: column ${safeCol(SID_HEADERS)} onwards`],
    [`  ${PROGRAM_LABELS['jr-term4']}: column ${safeCol(JR_TERM4_HEADERS)} onwards`],
    [`  ${PROGRAM_LABELS['tour-interest']}: column ${safeCol(TOUR_HEADERS)} onwards`],
    [`  Payments (Stripe): column ${safeCol(PAY_HEADERS)} onwards`],
    [''],
    ['This guide tab is the one exception: it is rewritten in full every time, so do'],
    ['not keep anything here at all.'],
    [''],
    ['You can sort, filter, colour and hide rows freely. Rows are matched by the ID in'],
    ['column A, not by position, so your notes stay attached to the right person.'],
    [''],
    ['HOW "PAID" IS WORKED OUT'],
    [''],
    ['Only the Open Trial charges anything online. Spin Club, Junior Royals Term 4 and'],
    ['Tour Interest take no money at all, and the junior sessions with Sid are booking'],
    ['requests. The Open Trial fee is $30 per player, per'],
    ['session, taken through a Stripe payment link. Stripe does not tell our website'],
    ['when someone pays, so this sheet asks Stripe directly and matches a payment to a'],
    ['player BY EMAIL ADDRESS.'],
    [''],
    ['That means: if a parent registers with one email address and pays with a'],
    ['different one, the player shows as not paid, and the payment appears on the'],
    ['Payments tab marked UNMATCHED. It is not lost — it just needs a human to connect'],
    ['the two. Check the Payments tab before chasing anyone for money.'],
    [''],
    ['The Open Trial uses the SAME Stripe links as the September Performance Squads'],
    ['trials, so both kinds of payment show on the Payments tab. The last column says'],
    ['which program the matched sign-up belongs to, so you can tell them apart.'],
    [''],
    ['ARE THE PAYMENT BUTTONS WORKING?'],
    [''],
    ['Checked automatically every time this sheet updates, straight from Stripe:'],
    [''],
    ...(linkLines.length ? linkLines.map((l) => [`  ${l}`]) : [['  (no payment links configured)']]),
    [''],
    ['If any line above does not say "working", the Pay button for that centre and'],
    ['session count is not taking money. Tell Alex — the fix is in Stripe, not here.'],
    [''],
    ['IF A ROW LOOKS WRONG'],
    [''],
    ['The sheet mirrors what the person typed into the form. If a detail is wrong, it'],
    ['was entered wrong — correct it in your own columns, or ask for it to be fixed at'],
    ['the source. Deleting a row here does not delete the sign-up; it comes back on'],
    ['the next update.'],
  ];
};

async function ensureGuideTab(sheets, spreadsheetId, linkLines, counts) {
  const created = await ensureTab(sheets, spreadsheetId, GUIDE_TAB);
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${GUIDE_TAB}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: guideLines(linkLines, counts) },
  });
  try {
    await ensureProtectedRange(
      sheets, spreadsheetId, GUIDE_TAB, null,
      'This whole tab is rewritten automatically on every update. Anything you type here is replaced.',
    );
  } catch (err) {
    console.warn('sync-program-signups: could not protect the guide tab:', err.message);
  }
  return created ? 'created' : 'refreshed';
}

// ============================================================
// Where the workbook id comes from. Env wins (an operator override); otherwise
// the holiday_program_sheets config row, so the target can be repointed with one
// SQL update and no redeploy.
// ============================================================
export async function resolveWorkbookId(sb) {
  if (process.env.PROGRAM_SIGNUPS_SHEET_ID) {
    return { id: process.env.PROGRAM_SIGNUPS_SHEET_ID, from: 'env' };
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

// ============================================================
// The whole job.
// ============================================================
export async function reconcileProgramSignups(sheets, spreadsheetId, sb = null, stripe = null) {
  sb = sb || getSupabase();
  stripe = stripe || getStripe();

  // ── Read every source. Ordered oldest-first so allocation is deterministic.
  //
  // Every select is explicitly bounded. PostgREST silently caps an unbounded
  // select at 1,000 rows and returns 200 OK, so a table crossing that line
  // would quietly stop putting people on a coach's tab with nothing to show it
  // had happened. ROW_CAP is well above any of these (240 in
  // performance_squad_leads at 30 Sep 2026) and hitting it is logged loudly.
  const [squadLeads, spinClub, sidBookings, tourApps, tourEois, jrTerm4] = await Promise.all([
    // ALL performance_squad_leads, not just the open-trial ones: payments are
    // allocated across the whole table so this workbook and the Performance
    // Squads workbook can never disagree about who has paid. Filtered down to
    // open-trial rows only after allocation.
    sb.from('performance_squad_leads').select('*').order('created_at', { ascending: true }).limit(ROW_CAP),
    sb.from('applications').select('*').eq('program_type', SPIN_CLUB_PROGRAM).order('created_at', { ascending: true }).limit(ROW_CAP),
    sb.from('match_registrations').select('*').like('match_slug', `${SID_SLUG_PREFIX}%`).order('created_at', { ascending: true }).limit(ROW_CAP),
    sb.from('applications').select('*').eq('source', TOUR_SOURCE).order('created_at', { ascending: true }).limit(ROW_CAP),
    sb.from('india_tour_2026_eoi').select('*').order('created_at', { ascending: true }).limit(ROW_CAP),
    sb.from(JR_TERM4_TABLE).select('*').order('created_at', { ascending: true }).limit(ROW_CAP),
  ]);
  const sources = {
    performance_squad_leads: squadLeads,
    'applications (Spin Club)': spinClub,
    'match_registrations (Sid)': sidBookings,
    'applications (Tour)': tourApps,
    india_tour_2026_eoi: tourEois,
    jr_term4_waitlist: jrTerm4,
  };
  for (const [name, r] of Object.entries(sources)) {
    if (r.error) throw r.error;
    if ((r.data || []).length >= ROW_CAP) {
      console.error(
        `sync-program-signups: ${name} returned ${r.data.length} rows, at or above the `
        + `${ROW_CAP} cap. People are being LEFT OFF the sheet. Raise ROW_CAP or page the read.`,
      );
    }
  }

  // ── Stripe, from a month before the earliest record on a paying program.
  // Comfortably covers anyone who paid before finishing the form.
  const payingRecords = [...(squadLeads.data || []), ...(sidBookings.data || [])];
  const earliest = payingRecords.length
    ? Math.min(...payingRecords.map((r) => new Date(r.created_at).getTime()))
    : Date.now();
  const sinceUnix = Math.floor((earliest - 30 * 24 * 3600 * 1000) / 1000);
  const { payments, health } = await fetchPayments(stripe, sinceUnix);
  const linkLines = describeLinkHealth(health);
  if (health.missing.length || health.inactive.length) {
    console.warn('sync-program-signups: payment link problem —', JSON.stringify({
      missing: health.missing, inactive: health.inactive,
    }));
  }

  // Allocate each program's payments against that program's own records only, so
  // a Sid payment can never be credited to an open-trial booking.
  const byProgram = (key) => payments.filter((p) => p.program === key);
  const openTrialAlloc = allocatePayments(squadLeads.data, byProgram('open-trial'));
  const sidAlloc = allocatePayments(sidBookings.data, byProgram('sid-juniors'));

  const paidById = new Map([...openTrialAlloc.byRecordId, ...sidAlloc.byRecordId]);
  const matchByPayment = new Map([...openTrialAlloc.recordByPayment, ...sidAlloc.recordByPayment]);

  // ── Build each tab.
  const openTrialLeads = (squadLeads.data || []).filter((r) => r.program_type === OPEN_TRIAL_PROGRAM);

  const tabs = [
    {
      key: 'open-trial',
      headers: OPEN_TRIAL_HEADERS,
      rows: openTrialLeads.map((r) => openTrialRow(r, paidById.get(r.id) || null)),
    },
    {
      key: 'spin-club',
      headers: SPIN_CLUB_HEADERS,
      rows: (spinClub.data || []).map(spinClubRow),
    },
    {
      key: 'sid-juniors',
      headers: SID_HEADERS,
      rows: (sidBookings.data || []).map((r) => sidRow(r, paidById.get(r.id) || null)),
    },
    {
      key: 'jr-term4',
      headers: JR_TERM4_HEADERS,
      rows: (jrTerm4.data || []).map(jrTerm4Row),
    },
    {
      key: 'tour-interest',
      headers: TOUR_HEADERS,
      rows: [
        ...(tourApps.data || []).filter((r) => isTourEntryInWindow(r.created_at)).map(tourRowFromApplication),
        ...(tourEois.data || []).filter((r) => isTourEntryInWindow(r.created_at)).map(tourRowFromEoi),
      ],
    },
  ];

  const tabResults = [];
  for (const t of tabs) {
    tabResults.push(await reconcileTab(
      sheets, spreadsheetId, tabName(t.key), t.headers, t.rows, SAFE_COL_LABEL,
    ));
  }

  // ── Payments tab, including unmatched, which is the whole point of listing it.
  const payRows = payments.map((p) => {
    const hit = matchByPayment.get(p.sessionId);
    return payRow({
      ...p,
      matchedId: hit?.id || null,
      matchedPlayer: hit?.player || '',
      matchedProgram: hit?.program || '',
    });
  });
  const payResult = await reconcileTab(
    sheets, spreadsheetId, PAYMENTS_TAB, PAY_HEADERS, payRows, SAFE_COL_LABEL,
  );

  const guide = await ensureGuideTab(sheets, spreadsheetId, linkLines, {
    openTrial: openTrialLeads.length,
    spinClub: (spinClub.data || []).length,
    sidJuniors: (sidBookings.data || []).length,
    tour: [...(tourApps.data || []), ...(tourEois.data || [])]
      .filter((r) => isTourEntryInWindow(r.created_at)).length,
    tourBeforeCutoff: [...(tourApps.data || []), ...(tourEois.data || [])]
      .filter((r) => !isTourEntryInWindow(r.created_at)).length,
    jrTerm4: (jrTerm4.data || []).length,
    jrTerm4Closed: (jrTerm4.data || [])
      .filter((r) => !JR_TERM4_CENTRES[r.preferred_centre]).length,
  });

  await sb
    .from('holiday_program_sheets')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('source_table', SOURCE_TABLE);

  return {
    programs: tabResults,
    payments: {
      ...payResult,
      stripePaymentsFound: payments.length,
      paymentLinks: { working: health.ids.size, missing: health.missing, inactive: health.inactive },
      unmatched: payRows.filter((r) => String(r[7]).startsWith('UNMATCHED')).length,
    },
    guide,
  };
}

// Authorise: a Vercel Cron call (shared CRON_SECRET) or an active dashboard
// admin (JWT). Same contract as sync-performance-squads.js / sync-pgp-leads.js.
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
      error: 'No Program Sign-Ups workbook configured. Create the workbook in Alex\'s own '
        + 'Drive, share it to the sync service account as Editor, then add a '
        + `holiday_program_sheets row with source_table='${SOURCE_TABLE}' and workbook_id set, `
        + 'or set PROGRAM_SIGNUPS_SHEET_ID.',
    });
  }

  let sheets;
  try {
    sheets = getSheets();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  try {
    const result = await reconcileProgramSignups(sheets, workbook.id);
    return res.status(200).json({ ok: true, workbook: workbook.from, programSignups: result });
  } catch (err) {
    console.error('sync-program-signups: reconcile failed:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

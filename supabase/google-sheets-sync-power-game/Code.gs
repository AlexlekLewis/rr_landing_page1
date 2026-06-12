/**
 * Power Game 2026 -- Combined Google Sheets auto-sync
 * ------------------------------------------------------------------
 * Bound Apps Script for the "Power Game 2026" workbook.
 * Every 5 minutes syncAll() rebuilds TWO tabs from Supabase:
 *
 *   "Power Game Players Phase 1"   <- power_game_applications (pgp2026)
 *   "Power Game Inquiries 2026"    <- power_game_inquiries
 *
 * Players tab is categorised into paid / awaiting / callback / review /
 * waitlist / other sections. Inquiries tab is a flat chronological list.
 *
 * Self-healing: full reconciliation each run, nothing lost if paused.
 *
 * SECURITY: no keys in this file. The Supabase service key is stored in
 * Script Properties (visible only to the sheet owner).
 *
 * SETUP (one time):
 *   1. Extensions -> Apps Script -> paste this file -> Save.
 *   2. Project Settings -> Script Properties -> set SUPABASE_SERVICE_KEY.
 *   3. Run syncAll once and approve the authorization prompt.
 *   4. Run installTrigger once to schedule every 5 minutes.
 */

const SUPABASE_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co';
const TZ = 'Australia/Melbourne';
const PLAYERS_TAB = 'Power Game Players Phase 1';
const INQUIRIES_TAB = 'Power Game Inquiries 2026';
const TEST_SOURCES = ['pgp2026-e2e-test', 'pgp2026-funnel-preview'];

// --Shared helpers ------------------------------------------------

function supabaseFetch_(table, queryString) {
  const key = PropertiesService.getScriptProperties().getProperty('SUPABASE_SERVICE_KEY');
  if (!key) throw new Error('Set SUPABASE_SERVICE_KEY in Project Settings -> Script Properties first.');

  const PAGE = 1000;
  let all = [];
  let from = 0;

  while (true) {
    const to = from + PAGE - 1;
    const url = SUPABASE_URL + '/rest/v1/' + table + '?' + queryString;
    const res = UrlFetchApp.fetch(url, {
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        Range: from + '-' + to,
        Prefer: 'count=exact'
      },
      muteHttpExceptions: true
    });
    const code = res.getResponseCode();
    if (code !== 200 && code !== 206) {
      throw new Error('Supabase ' + code + ': ' + res.getContentText().slice(0, 300));
    }
    const rows = JSON.parse(res.getContentText());
    all = all.concat(rows);
    if (rows.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function melb_(iso, withTime) {
  if (!iso) return '';
  try {
    return Utilities.formatDate(new Date(iso), TZ, withTime ? 'd MMM yyyy HH:mm' : 'd MMM yyyy');
  } catch (_) { return String(iso); }
}

function writeGrid_(tabName, rows, width) {
  const sh = sheet_(tabName);
  sh.clearContents();
  if (!rows.length) return;
  const padded = rows.map(function (r) {
    const copy = r.slice(0, width);
    while (copy.length < width) copy.push('');
    return copy;
  });
  sh.getRange(1, 1, padded.length, width).setValues(padded);
}

function isTestRow_(r) {
  const src = String(r.source || '');
  return TEST_SOURCES.some(function (t) { return src.indexOf(t) !== -1; });
}

// --Players -----------------------------------------------------------

const HEADERS = [
  'Submitted (Melb)', 'Player', 'Age', 'DOB', 'Gender', 'Club',
  'Parent/Guardian', 'Email', 'Phone',
  'Parent 2', 'Parent 2 Email', 'Parent 2 Phone',
  'Suburb', 'Level entered', 'Venue', 'Age group',
  'Day', 'Time slot',
  'Application type', 'Application status', 'Payment status',
  'Amount paid', 'Paid at (Melb)', 'Stripe session', 'Receipt',
  'Uniform?', 'Uniform items', 'Uniform $',
  'Cricket profile', 'Goals',
  'Consents', 'Notes', 'Source', 'ID'
];

const SECTIONS = [
  { key: 'paid',     label: '🟢 CONFIRMED PLAYERS - PAID (official time slot locked in)' },
  { key: 'awaiting', label: '🟡 SECURED A TIME - AWAITING PAYMENT' },
  { key: 'callback', label: '🔵 REQUESTED A CALL / MORE INFO' },
  { key: 'review',   label: '⚪ COACH REVIEW (no payment until a coach confirms)' },
  { key: 'waitlist', label: '⚫ VENUE WAITLIST (TBC venue)' },
  { key: 'other',    label: '❓ UNRECOGNISED STATUS - check manually' }
];

function categorise(r) {
  if (r.payment_status === 'completed' || r.status === 'paid') return 'paid';
  if (r.status === 'awaiting_payment') return 'awaiting';
  if (r.status === 'callback_requested') return 'callback';
  if (r.status === 'venue_waitlist') return 'waitlist';
  if (r.status === 'review' || r.application_type === 'capability') return 'review';
  return 'other';
}

function fmtConsents_(r) {
  const parts = [];
  if (r.accept_terms) parts.push('Terms');
  if (r.accept_player_code) parts.push('Player Code');
  if (r.accept_parent_code) parts.push('Parent Code');
  if (r.accept_social_media) parts.push('Social Media');
  if (r.accept_playing_standard) parts.push('Playing Std');
  return parts.join(', ');
}

function toRow_(r) {
  const minorContact = r.email ? false : true;
  return [
    melb_(r.created_at, true),
    r.player_name || ((r.first_name || '') + ' ' + (r.last_name || '')).trim(),
    r.age != null ? r.age : '',
    r.dob || '',
    r.cricket_type || '',
    r.club || '',
    r.parent1_name || '',
    minorContact ? (r.parent1_email || '') : r.email,
    minorContact ? (r.parent1_phone || '') : r.phone,
    r.parent2_name || '',
    r.parent2_email || '',
    r.parent2_phone || '',
    r.suburb || '',
    r.current_level || '',
    r.venue || '',
    r.age_group || '',
    r.session_day || '',
    r.session_time || '',
    r.application_type || '',
    r.status || '',
    r.payment_status || 'pending',
    typeof r.amount_paid_cents === 'number' && r.amount_paid_cents > 0 ? '$' + (r.amount_paid_cents / 100).toFixed(2) : '',
    melb_(r.paid_at, true),
    r.stripe_session_id || '',
    r.receipt_url || '',
    r.needs_uniform === true ? 'Yes' : r.needs_uniform === false ? 'No' : '',
    r.uniform_selection || '',
    typeof r.uniform_total_cents === 'number' && r.uniform_total_cents > 0 ? '$' + (r.uniform_total_cents / 100).toFixed(2) : '',
    r.bio || '',
    r.goals || '',
    fmtConsents_(r),
    r.capability_statement || r.admin_notes || '',
    r.source || '',
    r.id || ''
  ];
}

function syncPlayers() {
  const rows = supabaseFetch_('power_game_applications', 'select=*&phase=eq.pgp2026&order=created_at.asc');
  const clean = rows.filter(function (r) { return !isTestRow_(r); });

  const byCat = {};
  SECTIONS.forEach(function (s) { byCat[s.key] = []; });
  clean.forEach(function (r) { byCat[categorise(r)].push(r); });

  const out = [];
  const sectionHeaderRows = [];
  const columnHeaderRows = [];

  out.push(['POWER GAME PLAYERS - PHASE 1 | LIVE (auto-synced from Supabase every 5 min)']);
  out.push(['Last sync: ' + melb_(new Date().toISOString(), true) +
    '   |   ' + clean.length + ' applications' +
    '   |   ' + byCat.paid.length + ' paid' +
    ' | ' + byCat.awaiting.length + ' awaiting payment' +
    ' | ' + byCat.callback.length + ' call requested' +
    ' | ' + byCat.review.length + ' coach review' +
    ' | ' + byCat.waitlist.length + ' venue waitlist' +
    (rows.length > clean.length ? '   | (' + (rows.length - clean.length) + ' test/preview rows hidden)' : '')]);
  out.push(['* Squads are subject to change - we\'ll work with players and families if any changes are needed.']);
  out.push(['']);

  SECTIONS.forEach(function (s) {
    const list = byCat[s.key];
    if (s.key === 'other' && list.length === 0) return;
    sectionHeaderRows.push(out.length + 1);
    out.push([s.label + '   (' + list.length + ')']);
    columnHeaderRows.push(out.length + 1);
    out.push(HEADERS);
    if (list.length === 0) out.push(['- none yet -']);
    else list.forEach(function (r) { out.push(toRow_(r)); });
    out.push(['']);
  });

  const width = HEADERS.length;
  writeGrid_(PLAYERS_TAB, out, width);

  // Styling
  const sh = sheet_(PLAYERS_TAB);
  sh.getRange(1, 1, 1, width).setFontWeight('bold').setFontSize(12);
  sh.getRange(3, 1, 1, width).setFontStyle('italic').setFontColor('#888888').setFontSize(9);
  sectionHeaderRows.forEach(function (rn) {
    sh.getRange(rn, 1, 1, width).setFontWeight('bold').setBackground('#212a38').setFontColor('#ffffff');
  });
  columnHeaderRows.forEach(function (rn) {
    sh.getRange(rn, 1, 1, width).setFontWeight('bold').setBackground('#e8ebf2').setFontColor('#000000');
  });
  sh.setFrozenRows(0);
  return clean.length;
}

// --Inquiries ---------------------------------------------------------

const INQ_HEADERS = [
  'Submitted (Melb)', 'Player', 'DOB', 'Parent/Guardian',
  'Email', 'Phone', 'Suburb', 'City',
  'Program', 'Source', 'UTM source', 'UTM medium', 'UTM campaign',
  'Page referrer', 'ID'
];

function syncInquiries() {
  const rows = supabaseFetch_('power_game_inquiries', 'select=*&order=created_at.desc');
  const clean = rows.filter(function (r) { return !isTestRow_(r); });

  const out = [];
  out.push(['POWER GAME INQUIRIES 2026 | LIVE (auto-synced every 5 min)']);
  out.push(['Last sync: ' + melb_(new Date().toISOString(), true) + '   |   ' + clean.length + ' inquiries']);
  out.push(['']);
  out.push(INQ_HEADERS);

  clean.forEach(function (r) {
    out.push([
      melb_(r.created_at, true),
      r.player_name || '',
      r.player_dob || '',
      r.parent_name || '',
      r.parent_email || '',
      r.parent_phone || '',
      r.suburb || '',
      r.city || '',
      r.program || '',
      r.source || '',
      r.utm_source || '',
      r.utm_medium || '',
      r.utm_campaign || '',
      r.page_referrer || '',
      r.id || ''
    ]);
  });

  const width = INQ_HEADERS.length;
  writeGrid_(INQUIRIES_TAB, out, width);

  const sh = sheet_(INQUIRIES_TAB);
  sh.getRange(1, 1, 1, width).setFontWeight('bold').setFontSize(12);
  sh.getRange(4, 1, 1, width).setFontWeight('bold').setBackground('#e8ebf2').setFontColor('#000000');
  sh.setFrozenRows(4);
  return clean.length;
}

// --Entry point -------------------------------------------------------

function syncAll() {
  const p = syncPlayers();
  const q = syncInquiries();
  Logger.log('syncAll done - ' + p + ' players, ' + q + ' inquiries');
}

function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'syncAll') ScriptApp.deleteTrigger(t);
    if (t.getHandlerFunction() === 'syncPowerGamePhase1') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncAll').timeBased().everyMinutes(5).create();
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Power Game')
    .addItem('Sync now (all tabs)', 'syncAll')
    .addItem('Sync players only', 'syncPlayers')
    .addItem('Sync inquiries only', 'syncInquiries')
    .addToUi();
}

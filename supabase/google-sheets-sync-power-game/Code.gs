/**
 * Power Game 2026 — Players Phase 1 → Google Sheets auto-sync
 * ------------------------------------------------------------------
 * Bound Apps Script for the "Power Game 2026" workbook. Every 5 minutes it
 * reads every power_game_applications row from Supabase and REBUILDS the
 * "Power Game Players Phase 1" tab, categorised into:
 *
 *   🟢 CONFIRMED PLAYERS — PAID        Stripe payment completed; official time slot
 *   🟡 SECURED A TIME — AWAITING PAYMENT  picked a slot, checkout not finished
 *   🔵 REQUESTED A CALL / MORE INFO    qualified, asked to talk before paying
 *   ⚪ COACH REVIEW                    below floor / no level — coach decides, no payment
 *   ⚫ VENUE WAITLIST (TBC venue)      registered interest in the coming-soon venue
 *
 * Stripe confirmation flows automatically: the website's Stripe webhook flips the
 * database row to paid (payment_status=completed, amount, paid_at, session id,
 * receipt) and the next sync run moves the player into the green section.
 *
 * Because it reconciles the whole table each run it is self-healing — nothing is
 * lost if the script is paused for a while.
 *
 * SECURITY: no keys live in this file. The Supabase service key is stored in
 * Script Properties (visible only to the sheet owner).
 *
 * SETUP (one time):
 *   1. Open the "Power Game 2026" sheet → Extensions → Apps Script.
 *   2. Add this file's contents as Code.gs (or a new script file) and Save.
 *   3. Project Settings (gear icon) → Script Properties → add:
 *        SUPABASE_SERVICE_KEY = <service_role key from Supabase dashboard>
 *   4. Run syncPowerGamePhase1 once and approve the authorization prompt.
 *   5. Run installTrigger once to schedule it every 5 minutes.
 */

var SHEET_ID = '18y5BxkTAEict_rlrlpYSzhXovf_5554Kv2G7L9A_uNs'; // Power Game 2026 workbook
var TAB_NAME = 'Power Game Players Phase 1';
var SUPABASE_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co';
var PHASE = 'pgp2026';
var INCLUDE_PREVIEW_ROWS = false; // test submissions have source like 'pgp2026-funnel-preview' / 'pgp2026-e2e-test'

var HEADERS = [
  'Submitted (Melb)', 'Player', 'Age', 'DOB', 'Gender', 'Parent/Guardian',
  'Email', 'Phone', 'Suburb', 'Level entered', 'Venue', 'Age group',
  'Day', 'Time slot', 'Application status', 'Payment status', 'Amount paid',
  'Paid at (Melb)', 'Stripe session', 'Receipt', 'Uniform?', 'Notes', 'Source', 'ID'
];

var SECTIONS = [
  { key: 'paid',     label: '🟢 CONFIRMED PLAYERS — PAID (official time slot locked in)' },
  { key: 'awaiting', label: '🟡 SECURED A TIME — AWAITING PAYMENT' },
  { key: 'callback', label: '🔵 REQUESTED A CALL / MORE INFO' },
  { key: 'review',   label: '⚪ COACH REVIEW (no payment until a coach confirms)' },
  { key: 'waitlist', label: '⚫ VENUE WAITLIST (TBC venue)' },
  { key: 'other',    label: '❓ UNRECOGNISED STATUS — check manually' }
];

function categorise(r) {
  if (r.payment_status === 'completed' || r.status === 'paid') return 'paid';
  if (r.status === 'awaiting_payment') return 'awaiting';
  if (r.status === 'callback_requested') return 'callback';
  if (r.status === 'venue_waitlist') return 'waitlist';
  if (r.status === 'review' || r.application_type === 'capability') return 'review';
  return 'other';
}

function fetchApplications_() {
  var key = PropertiesService.getScriptProperties().getProperty('SUPABASE_SERVICE_KEY');
  if (!key) throw new Error('Set SUPABASE_SERVICE_KEY in Project Settings → Script Properties first.');
  var url = SUPABASE_URL + '/rest/v1/power_game_applications' +
    '?select=*&phase=eq.' + PHASE + '&order=created_at.asc&limit=2000';
  var res = UrlFetchApp.fetch(url, {
    headers: { apikey: key, Authorization: 'Bearer ' + key },
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Supabase error ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 300));
  }
  var rows = JSON.parse(res.getContentText());
  if (!INCLUDE_PREVIEW_ROWS) {
    rows = rows.filter(function (r) { var src = String(r.source || ''); return src.indexOf('preview') === -1 && src.indexOf('test') === -1; });
  }
  return rows;
}

function fmtMelb_(iso, withTime) {
  if (!iso) return '';
  try {
    return Utilities.formatDate(new Date(iso), 'Australia/Melbourne', withTime ? 'd MMM yyyy HH:mm' : 'd MMM yyyy');
  } catch (_) { return String(iso); }
}

function toRow_(r) {
  var minorContact = r.email ? false : true; // funnel stores adult contact on the row, minor contact on parent1_*
  return [
    fmtMelb_(r.created_at, true),
    r.player_name || ((r.first_name || '') + ' ' + (r.last_name || '')).trim(),
    r.age != null ? r.age : '',
    r.dob || '',
    r.cricket_type || '',
    r.parent1_name || '',
    minorContact ? (r.parent1_email || '') : r.email,
    minorContact ? (r.parent1_phone || '') : r.phone,
    r.suburb || '',
    r.current_level || '',
    r.venue || '',
    r.age_group || '',
    r.session_day || '',
    r.session_time || '',
    r.status || '',
    r.payment_status || 'pending',
    typeof r.amount_paid_cents === 'number' ? '$' + (r.amount_paid_cents / 100).toFixed(2) : '',
    fmtMelb_(r.paid_at, true),
    r.stripe_session_id || '',
    r.receipt_url || '',
    r.needs_uniform === true ? 'Yes' : r.needs_uniform === false ? 'No' : '',
    r.capability_statement || r.admin_notes || '',
    r.source || '',
    r.id || ''
  ];
}

/** Full rebuild of the Phase 1 tab, categorised. Safe to run any time. */
function syncPowerGamePhase1() {
  var rows = fetchApplications_();
  var byCat = {};
  SECTIONS.forEach(function (s) { byCat[s.key] = []; });
  rows.forEach(function (r) { byCat[categorise(r)].push(r); });

  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);
  sheet.clearContents();

  var out = [];
  var sectionHeaderRows = [];   // 1-based row numbers needing section styling
  var columnHeaderRows = [];

  out.push(['POWER GAME PLAYERS — PHASE 1 (auto-synced from the website database)']);
  out.push(['Last synced: ' + fmtMelb_(new Date().toISOString(), true) +
    '   ·   ' + rows.length + ' applications' +
    '   ·   paid ' + byCat.paid.length +
    ' · awaiting payment ' + byCat.awaiting.length +
    ' · call requested ' + byCat.callback.length +
    ' · coach review ' + byCat.review.length +
    ' · venue waitlist ' + byCat.waitlist.length]);
  out.push(['* Squads are subject to change — we’ll work with players and families if any changes are needed.']);
  out.push(['']);

  SECTIONS.forEach(function (s) {
    var list = byCat[s.key];
    if (s.key === 'other' && list.length === 0) return; // hide empty catch-all
    sectionHeaderRows.push(out.length + 1);
    out.push([s.label + '   (' + list.length + ')']);
    columnHeaderRows.push(out.length + 1);
    out.push(HEADERS);
    if (list.length === 0) out.push(['— none yet —']);
    else list.forEach(function (r) { out.push(toRow_(r)); });
    out.push(['']);
  });

  // Normalise row widths and write in one shot.
  var width = HEADERS.length;
  var values = out.map(function (row) {
    var copy = row.slice(0, width);
    while (copy.length < width) copy.push('');
    return copy;
  });
  sheet.getRange(1, 1, values.length, width).setValues(values);

  // Light styling (idempotent).
  sheet.getRange(1, 1, 1, width).setFontWeight('bold').setFontSize(12);
  sheet.getRange(3, 1, 1, width).setFontStyle('italic').setFontColor('#888888').setFontSize(9);
  sectionHeaderRows.forEach(function (rn) {
    sheet.getRange(rn, 1, 1, width).setFontWeight('bold').setBackground('#212a38').setFontColor('#ffffff');
  });
  columnHeaderRows.forEach(function (rn) {
    sheet.getRange(rn, 1, 1, width).setFontWeight('bold').setBackground('#e8ebf2').setFontColor('#000000');
  });
  sheet.setFrozenRows(0);
  return rows.length;
}

/** One-time: refresh every 5 minutes. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'syncPowerGamePhase1') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncPowerGamePhase1').timeBased().everyMinutes(5).create();
}

/** Adds a "Power Game" menu with a manual Sync Now. */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Power Game')
    .addItem('Sync now', 'syncPowerGamePhase1')
    .addToUi();
}

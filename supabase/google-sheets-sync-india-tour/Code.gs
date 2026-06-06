/**
 * India Tour 2026 — Expression-of-Interest → Google Sheets auto-sync
 * ------------------------------------------------------------------
 * Bound Apps Script for the "India Tour 2026 — Expressions of Interest" sheet.
 *
 * Every minute it calls a token-gated Supabase function, gets every
 * india_tour_2026_eoi row, and appends any that aren't in the sheet yet
 * (deduped by id). Because it reconciles the whole table each run it is
 * self-healing: nothing is lost even if the script is paused for a while.
 *
 * SETUP (one time):
 *   1. Open the sheet → Extensions → Apps Script.
 *   2. Replace the default Code.gs with this file and Save.
 *   3. Run `syncIndiaTourEOIs` once and approve the authorization prompt.
 *   4. Run `installTrigger` once to schedule it every minute.
 * That's it — new registrations flow in automatically.
 */

var SHEET_ID   = '1ASp9IPb-5g_YKM4LlFs2BP45g3CupiXsehWwIu1ha4A';
var SHEET_NAME = 'India Tour 2026 EOIs';

var SUPABASE_URL  = 'https://pudldzgmluwoocwxtzhw.supabase.co';
// Public publishable (anon) key — safe to embed. It CANNOT read the table by
// itself; data only comes back via the token-gated function below.
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZGxkemdtbHV3b29jd3h0emh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTA0OTQsImV4cCI6MjA4NDk4NjQ5NH0.X-pDkxLGDGIpno_HVmPTURXf4IZ2jucZURXjj3si0gg';
// Shared secret that unlocks the export function. Keep this private.
var SYNC_TOKEN    = 'it26_976803fcea81a687074b255fcb09402c62619d1f9711c51e';

// Canonical column order — matches the sheet header row and the DB columns.
var COLS = [
  'created_at', 'player_name', 'player_dob', 'player_age', 'current_club',
  'highest_level', 'primary_skill', 'secondary_skill', 'is_over_18', 'player_email', 'player_phone',
  'guardian1_name', 'guardian1_relationship', 'guardian1_email', 'guardian1_phone',
  'guardian2_name', 'guardian2_relationship', 'guardian2_email', 'guardian2_phone',
  'consent_contact', 'referral_name', 'referral_code',
  'utm_source', 'utm_medium', 'utm_campaign', 'page_referrer', 'id'
];

/** Pulls all EOIs and appends any new ones. Returns count appended. */
function syncIndiaTourEOIs() {
  var res = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/rpc/export_india_tour_2026_eoi', {
    method: 'post',
    contentType: 'application/json',
    headers: { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON },
    payload: JSON.stringify({ p_token: SYNC_TOKEN }),
    muteHttpExceptions: true
  });

  if (res.getResponseCode() !== 200) {
    throw new Error('Supabase error ' + res.getResponseCode() + ': ' + res.getContentText());
  }

  var rows = JSON.parse(res.getContentText());          // sorted by created_at asc
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

  // Ensure the header row matches COLS (idempotent — self-heals if columns change).
  var headerRange = sheet.getRange(1, 1, 1, COLS.length);
  var currentHeader = headerRange.getValues()[0];
  var headerOk = currentHeader.length === COLS.length && COLS.every(function (c, i) { return currentHeader[i] === c; });
  if (!headerOk) headerRange.setValues([COLS]);

  // Build a set of ids already in the sheet.
  var existing = {};
  var last = sheet.getLastRow();
  var idColIndex = COLS.indexOf('id') + 1;
  if (last >= 2) {
    var vals = sheet.getRange(2, idColIndex, last - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) existing[String(vals[i][0])] = true;
  }

  var toAppend = [];
  for (var j = 0; j < rows.length; j++) {
    var rec = rows[j];
    if (existing[String(rec.id)]) continue;
    toAppend.push(COLS.map(function (c) {
      var v = rec[c];
      if (c === 'created_at' && v) {
        try { v = Utilities.formatDate(new Date(v), 'Australia/Melbourne', 'yyyy-MM-dd HH:mm:ss'); } catch (_) {}
      }
      if (typeof v === 'boolean') v = v ? 'Yes' : 'No';
      return (v === null || v === undefined) ? '' : v;
    }));
  }

  if (toAppend.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, toAppend.length, COLS.length).setValues(toAppend);
  }
  return toAppend.length;
}

/** Run once to schedule syncIndiaTourEOIs every minute. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'syncIndiaTourEOIs') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncIndiaTourEOIs').timeBased().everyMinutes(1).create();
}

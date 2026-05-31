/**
 * Power Game Inquiries 2026 — Supabase → Google Sheets auto-sync
 * ----------------------------------------------------------------
 * Bound Apps Script for the "Power Game Inquiries 2026" spreadsheet.
 *
 * Every minute it calls a token-gated Supabase function, gets every
 * power_game_inquiries row, and appends any that aren't in the sheet yet
 * (deduped by id). Because it reconciles the whole table each run it is
 * self-healing: nothing is lost even if the script is paused for a while.
 *
 * SETUP (one time):
 *   1. Open the sheet → Extensions → Apps Script.
 *   2. Replace the default Code.gs with this file and Save.
 *   3. Run `syncPowerGameInquiries` once and approve the authorization prompt.
 *   4. Run `installTrigger` once to schedule it every minute.
 * That's it — new inquiries flow in automatically.
 */

var SHEET_ID   = '18y5BxkTAEict_rlrlpYSzhXovf_5554Kv2G7L9A_uNs';
var SHEET_NAME = 'Power Game Inquiries 2026';

var SUPABASE_URL  = 'https://pudldzgmluwoocwxtzhw.supabase.co';
// Public publishable (anon) key — safe to embed. It CANNOT read the table by
// itself; data only comes back via the token-gated function below.
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZGxkemdtbHV3b29jd3h0emh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTA0OTQsImV4cCI6MjA4NDk4NjQ5NH0.X-pDkxLGDGIpno_HVmPTURXf4IZ2jucZURXjj3si0gg';
// Shared secret that unlocks the export function. Keep this private.
var SYNC_TOKEN    = 'pg26_41d3a9013d39da58e110f69b5c0882e0cc5f729c151c7039';

// Canonical column order — matches the sheet header row and the DB columns.
var COLS = [
  'created_at', 'player_name', 'player_dob', 'parent_name', 'parent_phone',
  'parent_email', 'suburb', 'city', 'source', 'program', 'utm_source',
  'utm_medium', 'utm_campaign', 'page_referrer', 'id'
];

/** Pulls all inquiries and appends any new ones. Returns count appended. */
function syncPowerGameInquiries() {
  var res = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/rpc/export_power_game_inquiries', {
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
      return (v === null || v === undefined) ? '' : v;
    }));
  }

  if (toAppend.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, toAppend.length, COLS.length).setValues(toAppend);
  }
  return toAppend.length;
}

/** Run once to schedule syncPowerGameInquiries every minute. */
function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'syncPowerGameInquiries') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncPowerGameInquiries').timeBased().everyMinutes(1).create();
}

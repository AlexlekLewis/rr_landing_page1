/**
 * Power Game Inquiries 2026 — Supabase → Google Sheets auto-sync
 * ----------------------------------------------------------------
 * Bound Apps Script for the "Power Game Inquiries 2026" spreadsheet.
 *
 * Every minute it calls a service-role-gated Supabase function, gets every
 * power_game_inquiries row, and appends any that aren't in the sheet yet
 * (deduped by id). Because it reconciles the whole table each run it is
 * self-healing: nothing is lost even if the script is paused for a while.
 *
 * ⚠️ SECRETS LIVE IN SCRIPT PROPERTIES — never hardcode them in this file
 * (it is committed to source control). The Supabase export function is
 * restricted to the service_role key, so the anon key no longer works here.
 *
 * SETUP (one time):
 *   1. Open the sheet → Extensions → Apps Script.
 *   2. Replace the default Code.gs with this file and Save.
 *   3. Project Settings → Script properties → add:
 *        SUPABASE_URL          https://pudldzgmluwoocwxtzhw.supabase.co
 *        SUPABASE_SERVICE_KEY  <service_role key — Supabase → Project Settings → API>
 *        SYNC_TOKEN            <token expected by export_power_game_inquiries>
 *        SHEET_ID              18y5BxkTAEict_rlrlpYSzhXovf_5554Kv2G7L9A_uNs  (optional)
 *   4. Run `syncPowerGameInquiries` once and approve the authorization prompt.
 *   5. Run `installTrigger` once to schedule it every minute.
 */

var SHEET_NAME = 'Power Game Inquiries 2026';
var DEFAULT_SHEET_ID = '18y5BxkTAEict_rlrlpYSzhXovf_5554Kv2G7L9A_uNs';

// Canonical column order — matches the sheet header row and the DB columns.
var COLS = [
  'created_at', 'player_name', 'player_dob', 'parent_name', 'parent_phone',
  'parent_email', 'suburb', 'city', 'source', 'program', 'utm_source',
  'utm_medium', 'utm_campaign', 'page_referrer', 'id'
];

/** Read a secret from Script Properties; throws a clear setup error if missing. */
function _prop(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  if (v) return v;
  if (fallback !== undefined) return fallback;
  throw new Error('Missing Script Property "' + key + '". Add it under Project Settings → Script properties.');
}

/** Pulls all inquiries and appends any new ones. Returns count appended. */
function syncPowerGameInquiries() {
  var supabaseUrl = _prop('SUPABASE_URL');
  var serviceKey  = _prop('SUPABASE_SERVICE_KEY');
  var syncToken   = _prop('SYNC_TOKEN');
  var sheetId     = _prop('SHEET_ID', DEFAULT_SHEET_ID);

  var res = UrlFetchApp.fetch(supabaseUrl + '/rest/v1/rpc/export_power_game_inquiries', {
    method: 'post',
    contentType: 'application/json',
    headers: { apikey: serviceKey, Authorization: 'Bearer ' + serviceKey },
    payload: JSON.stringify({ p_token: syncToken }),
    muteHttpExceptions: true
  });

  if (res.getResponseCode() !== 200) {
    throw new Error('Supabase error ' + res.getResponseCode() + ': ' + res.getContentText());
  }

  var rows = JSON.parse(res.getContentText());          // sorted by created_at asc
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(SHEET_NAME);

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

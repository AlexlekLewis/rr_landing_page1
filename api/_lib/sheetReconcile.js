// ============================================================
// Shared "mirror rows into a Google Sheet without destroying anyone's work".
// ============================================================
// Extracted from api/sync-performance-squads.js, which earned every rule below
// the hard way. Used by api/sync-program-signups.js.
//
// sync-performance-squads.js still carries its own private copies of these
// helpers. It is live and in season, so it was deliberately left alone rather
// than refactored mid-flight — it should adopt this module next time it is
// opened for another reason.
//
// THE CONTRACT, in one line: people work in these sheets by hand, so a sync
// never clears, never deletes, never writes outside its own column block, and
// only rewrites a row whose data has actually changed.
// ============================================================

// ------------------------------------------------------------
// Cell formatting
// ------------------------------------------------------------

// Melbourne local time as "YYYY-MM-DD HH:MM", written as TEXT. Deliberately not
// a pretty date: under USER_ENTERED, Sheets re-parses a pretty date into its own
// locale and hands back a different string, which would make every row look
// changed on every run and defeat the "unchanged rows are never touched" rule.
export const fmtMelb = (iso) => {
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

// Leading apostrophe forces Sheets to store TEXT. Without it a phone number
// loses its leading 0 and an age lands in a date-formatted cell and renders as
// a ~1900 date — and clearing values does not clear that sticky formatting.
export const asText = (v) => (v !== null && v !== undefined && v !== '' ? `'${v}` : '');

export const money = (cents) => (cents || cents === 0 ? `$${(cents / 100).toFixed(2)}` : '');

export const yesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '');

export const emailKey = (e) => String(e || '').trim().toLowerCase();

// 0-based column index -> A1 letter. 0 -> A, 26 -> AA, 29 -> AD.
export const colLetter = (n) => {
  let s = '', i = n;
  do { s = String.fromCharCode(65 + (i % 26)) + s; i = Math.floor(i / 26) - 1; } while (i >= 0);
  return s;
};

// ------------------------------------------------------------
// Row comparison. asText() writes a leading apostrophe but Sheets reads the
// value back WITHOUT it, so a naive compare marks every text cell as changed on
// every run and rewrites the whole sheet hourly.
// ------------------------------------------------------------
const padTo = (arr, n) => (arr.length >= n ? arr : [...arr, ...Array(n - arr.length).fill('')]);
const normalise = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return s.startsWith("'") ? s.slice(1) : s;
};
export const sameRow = (a, b, n) => {
  const x = padTo(a, n), y = padTo(b, n);
  for (let i = 0; i < n; i++) if (normalise(x[i]) !== normalise(y[i])) return false;
  return true;
};

// ------------------------------------------------------------
// Tab plumbing
// ------------------------------------------------------------
const sheetMeta = async (sheets, spreadsheetId) => {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets(properties(sheetId,title,gridProperties(columnCount)),protectedRanges(description,protectedRangeId))',
  });
  return meta.data.sheets || [];
};

// SELF-HEALING: create the worksheet if it does not exist yet, so a run against
// a brand-new workbook does not die on "Unable to parse range".
export const ensureTab = async (sheets, spreadsheetId, tabName) => {
  const all = await sheetMeta(sheets, spreadsheetId);
  if (all.some((s) => s.properties?.title === tabName)) return false;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] },
  });
  return true;
};

// Write the header row at A1 only if row 1 is currently empty — someone's own
// wording for a column should survive.
export const ensureHeader = async (sheets, spreadsheetId, tabName, headers) => {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${tabName}!1:1` });
  const firstRow = res.data.values?.[0] || [];
  if (firstRow.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });
  }
};

// A new tab's grid is only as wide as what has been written to it. Reading or
// writing the first column past that fails with "exceeds grid limits" and, left
// unhandled, takes the whole run down. Widen the grid first.
async function ensureColumnCount(sheets, spreadsheetId, tabName, minCols) {
  const all = await sheetMeta(sheets, spreadsheetId);
  const hit = all.find((x) => x.properties?.title === tabName);
  if (!hit) return false;
  const have = hit.properties?.gridProperties?.columnCount ?? 0;
  if (have >= minCols) return false;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        appendDimension: { sheetId: hit.properties.sheetId, dimension: 'COLUMNS', length: minCols - have },
      }],
    },
  });
  return true;
}

// A warningOnly protected range: Sheets shows "you are editing a part of this
// sheet that should not be changed" before the edit lands. Deliberately NOT a
// hard lock — locking a range to the service account would stop a human fixing
// something genuinely wrong, and would not stop the sync overwriting it anyway.
// The point is to interrupt someone before they invest an afternoon in a column
// that gets rewritten.
const PROTECT_TAG = 'rra-sync';
export async function ensureProtectedRange(sheets, spreadsheetId, tabName, nCols, description) {
  const all = await sheetMeta(sheets, spreadsheetId);
  const hit = all.find((x) => x.properties?.title === tabName);
  if (!hit) return false;
  const wanted = `${description} [${PROTECT_TAG}]`;
  const existing = (hit.protectedRanges || []).find((r) => (r.description || '').includes(PROTECT_TAG));

  if (existing && existing.description === wanted) return false;

  // Already there but the wording has moved on. The note tells people which
  // columns are safe to work in, so a stale one is worse than none.
  if (existing) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          updateProtectedRange: {
            protectedRange: { protectedRangeId: existing.protectedRangeId, description: wanted },
            fields: 'description',
          },
        }],
      },
    });
    return true;
  }

  const range = { sheetId: hit.properties.sheetId, startRowIndex: 0, startColumnIndex: 0 };
  if (nCols) range.endColumnIndex = nCols;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{ addProtectedRange: { protectedRange: { range, description: wanted, warningOnly: true } } }],
    },
  });
  return true;
}

// Label the first column the sync never touches, so there is an obvious place
// to work. Written ONCE and only into an empty cell — if someone has already
// put their own heading there, it is left alone.
export async function ensureSafeColumnLabel(sheets, spreadsheetId, tabName, firstSafeIndex, label) {
  await ensureColumnCount(sheets, spreadsheetId, tabName, firstSafeIndex + 1);
  const cell = `${colLetter(firstSafeIndex)}1`;
  const cur = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${tabName}!${cell}` });
  if ((cur.data.values?.[0]?.[0] || '') !== '') return false;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tabName}!${cell}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[label]] },
  });
  return true;
}

// ------------------------------------------------------------
// Non-destructive reconcile of one tab.
// Rows are matched by the id in column A, NEVER by position, so sorting and
// filtering in the sheet cannot mis-align anyone's notes.
// ------------------------------------------------------------
export async function reconcileTab(sheets, spreadsheetId, tabName, headers, rows, safeColLabel) {
  const lastCol = colLetter(headers.length - 1);

  await ensureTab(sheets, spreadsheetId, tabName);
  await ensureHeader(sheets, spreadsheetId, tabName, headers);

  // ensureHeader only fills an EMPTY row 1, which is right for a relabelled
  // column. But if the stored header is SHORTER than the current contract, a
  // column has been added since it was written and every column to the right of
  // the new one is now mislabelled. That is not a wording preference, it is a
  // wrong sheet, so rewrite it.
  const head = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${tabName}!1:1` });
  if ((head.data.values?.[0] || []).length < headers.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });
  }

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
    updates.push({ range: `${tabName}!A${hit.rowNumber}:${lastCol}${hit.rowNumber}`, values: [built] });
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: { valueInputOption: 'USER_ENTERED', data: updates },
    });
  }
  // INSERT_ROWS, never OVERWRITE, so an append cannot land on top of anything
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

  // Signposting is decoration. The rows are the job and they are already
  // written by this point, so a failure here is logged and swallowed rather
  // than allowed to abort the run and strand the tabs that come after it.
  try {
    await ensureProtectedRange(
      sheets, spreadsheetId, tabName, headers.length,
      `Columns A-${lastCol} are filled in automatically. Anything you type here is replaced `
        + `on the next update. Put your notes in column ${colLetter(headers.length)} onwards instead.`,
    );
    if (safeColLabel) {
      await ensureSafeColumnLabel(sheets, spreadsheetId, tabName, headers.length, safeColLabel);
    }
  } catch (err) {
    console.warn(`sheetReconcile: signposting on "${tabName}" failed (rows are still synced):`, err.message);
  }

  return { tab: tabName, rows: rows.length, added: appends.length, updated: updates.length, unchanged };
}

// ============================================================
// Vercel Serverless Function — Export to Google Sheets
// POST /api/export-to-sheets
// Body: { title, sheet_name?, headers: [...], rows: [[...], [...]] }
// ============================================================
// ADMIN-ONLY. Creates a new Google Spreadsheet inside the configured
// shared Drive folder, writes the given headers+rows, and returns the
// spreadsheet URL. All admins can run this; the spreadsheet is owned
// by the service account but accessible to anyone in the shared folder.
//
// Required env vars in Vercel:
//   SUPABASE_SERVICE_ROLE_KEY                — for verifyAdmin
//   GOOGLE_SERVICE_ACCOUNT_JSON              — full service-account JSON (one line)
//   GOOGLE_DRIVE_EXPORT_FOLDER_ID            — Drive folder ID where exports land
//
// Setup steps documented in docs/google-sheets-setup.md.
// ============================================================

import { google } from 'googleapis';
import { verifyAdmin } from './_lib/verifyAdmin.js';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

let _auth = null;
const getAuth = () => {
  if (_auth) return _auth;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var missing');
  let credentials;
  try { credentials = JSON.parse(raw); }
  catch (e) { throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON: ' + e.message); }
  _auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  return _auth;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let admin;
  try {
    admin = await verifyAdmin(req);
  } catch (err) {
    const isAuth = err.code === 'AUTH';
    return res.status(isAuth ? 401 : 500).json({ error: err.message });
  }

  const { title, sheet_name, headers, rows } = req.body || {};
  if (!title || !Array.isArray(headers) || !Array.isArray(rows)) {
    return res.status(400).json({ error: 'title, headers, rows required' });
  }
  const folderId = process.env.GOOGLE_DRIVE_EXPORT_FOLDER_ID;
  if (!folderId) {
    return res.status(500).json({ error: 'GOOGLE_DRIVE_EXPORT_FOLDER_ID env var missing' });
  }

  try {
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    // Step 1 — create the spreadsheet inside the shared Drive folder
    const fileRes = await drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        parents: [folderId],
      },
      fields: 'id, webViewLink, name',
    });
    const spreadsheetId = fileRes.data.id;
    const url = fileRes.data.webViewLink;

    // Step 2 — rename the default sheet (optional) and write headers + rows
    if (sheet_name) {
      const meta = await sheets.spreadsheets.get({ spreadsheetId });
      const firstSheet = meta.data.sheets?.[0];
      if (firstSheet) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              updateSheetProperties: {
                properties: { sheetId: firstSheet.properties.sheetId, title: sheet_name },
                fields: 'title',
              },
            }],
          },
        });
      }
    }

    const range = `${sheet_name || 'Sheet1'}!A1`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [headers, ...rows] },
    });

    // Step 3 — bold the header row + freeze it
    const meta2 = await sheets.spreadsheets.get({ spreadsheetId });
    const firstSheetId = meta2.data.sheets?.[0]?.properties?.sheetId ?? 0;
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: { sheetId: firstSheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: { userEnteredFormat: { textFormat: { bold: true } } },
              fields: 'userEnteredFormat.textFormat.bold',
            },
          },
          {
            updateSheetProperties: {
              properties: { sheetId: firstSheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount',
            },
          },
        ],
      },
    });

    console.log(`export-to-sheets: ${admin.email} created '${title}' (${spreadsheetId}, ${rows.length} rows)`);
    return res.status(200).json({ ok: true, spreadsheet_id: spreadsheetId, url, title, row_count: rows.length });
  } catch (err) {
    console.error('export-to-sheets error:', err);
    const msg = err.errors?.[0]?.message || err.message || 'Unknown error';
    return res.status(500).json({ error: msg });
  }
}

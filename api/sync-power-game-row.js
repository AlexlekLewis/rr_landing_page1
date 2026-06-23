// ============================================================
// Vercel Serverless Function — Sync Power Game Application → Google Sheets
// POST /api/sync-power-game-row
// ============================================================
// Real-time per-row sync, triggered by a Supabase Database Webhook on
// INSERT/UPDATE of power_game_applications. Appends a new row, or updates in
// place by id (idempotent — safe to replay missed webhook deliveries).
//
// NOTE: this only runs if a Supabase DB webhook is configured to call it. The
// hourly reconcile (api/sync-pgp-leads) rebuilds the same "Paid players" tab from
// the DB regardless, so paid players still land even with no webhook wired.
//
// Required env vars in Vercel:
//   GOOGLE_SERVICE_ACCOUNT_JSON   — service-account JSON (shared as Editor)
//   POWER_GAME_SHEET_ID           — the Google Sheet (workbook) ID to write to
//   POWER_GAME_PAID_TAB           — paid tab name (defaults to 'Paid players')
//   SUPABASE_WEBHOOK_SECRET       — shared secret sent in x-webhook-secret
//
// IMPORTANT: share the target Google Sheet with the service account's
// client_email (from GOOGLE_SERVICE_ACCOUNT_JSON) as an Editor.
// ============================================================

import {
  getSheets, PAID_HEADERS, buildPaidRow, ensureTab, ensureHeader, findRowById,
} from './_lib/pgpSheets.js';

export const config = {
  api: { bodyParser: { sizeLimit: '256kb' } },
};

// Route to a tab. With create-on-payment every row here is PAID, so paid rows go to
// the "Paid players" tab. (Leads/incomplete are handled separately by api/sync-pgp-leads
// straight from Stripe.) Legacy non-paid rows fall back to the old tabs.
const resolveTab = (record) => {
  const paidTab = process.env.POWER_GAME_PAID_TAB || 'Paid players';
  const standardTab = process.env.POWER_GAME_SHEET_TAB || 'Applications';
  const capabilityTab = process.env.POWER_GAME_CAPABILITY_TAB || 'Capability Requests';
  const isPaid = record.payment_status === 'completed' || record.status === 'paid';
  if (isPaid) return paidTab;
  if (record.application_type === 'capability') return capabilityTab;
  return standardTab;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Shared-secret verification (matches holiday sync).
  const expected = process.env.SUPABASE_WEBHOOK_SECRET;
  if (expected) {
    const got = req.headers['x-webhook-secret'];
    if (got !== expected) {
      console.warn('sync-power-game-row: bad/missing webhook secret');
      return res.status(401).json({ error: 'unauthorized' });
    }
  }

  const { type, table, record } = req.body || {};
  if (!type || !table) return res.status(400).json({ error: 'invalid payload' });
  if (type === 'DELETE') {
    return res.status(200).json({ ignored: true, reason: 'delete events not synced' });
  }
  if (!record?.id) return res.status(400).json({ error: 'record.id required' });

  const spreadsheetId = process.env.POWER_GAME_SHEET_ID;
  const tabName = resolveTab(record);
  if (!spreadsheetId) {
    return res.status(503).json({ ignored: true, reason: 'POWER_GAME_SHEET_ID not configured' });
  }

  let sheets;
  try {
    sheets = getSheets();
  } catch (err) {
    console.error('sync-power-game-row setup failed:', err.message);
    return res.status(500).json({ error: err.message });
  }

  const row = buildPaidRow(record);

  try {
    await ensureTab(sheets, spreadsheetId, tabName);
    await ensureHeader(sheets, spreadsheetId, tabName, PAID_HEADERS);
    const existing = await findRowById(sheets, spreadsheetId, tabName, record.id);
    if (existing) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${tabName}!A${existing}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
      return res.status(200).json({ ok: true, action: 'updated', row: existing });
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    return res.status(200).json({ ok: true, action: 'appended' });
  } catch (err) {
    console.error('sync-power-game-row sheet write failed:', err);
    return res.status(500).json({ error: err.message });
  }
}

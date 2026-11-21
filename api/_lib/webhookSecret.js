// ============================================================
// Shared-secret check for the routes Supabase calls (database webhooks,
// triggers and manual refreshes). The caller sends the secret in an
// x-webhook-secret header; it must match SUPABASE_WEBHOOK_SECRET.
//
// FAILS CLOSED: if SUPABASE_WEBHOOK_SECRET is not set in this environment the
// request is refused with a 500. A missing env var (e.g. on a Preview
// deployment) must never mean "no auth" — these routes write to Google Sheets.
//
// Used by: sync-holiday-row, sync-performance-squad-row, sync-power-game-row,
// refresh-unified-people.
// Env: SUPABASE_WEBHOOK_SECRET
// ============================================================
import { timingSafeEqual } from 'node:crypto';

// Constant-time comparison. timingSafeEqual throws on unequal lengths, so a
// length mismatch is simply a mismatch.
export const secretsMatch = (got, expected) => {
  if (typeof got !== 'string' || typeof expected !== 'string') return false;
  const a = Buffer.from(got, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
};

// Returns null when the request may proceed, otherwise { status, error } for
// the caller to send:
//   const denied = checkWebhookSecret(req, 'sync-holiday-row');
//   if (denied) return res.status(denied.status).json({ error: denied.error });
export const checkWebhookSecret = (req, label) => {
  const expected = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!expected) {
    console.error(`${label}: SUPABASE_WEBHOOK_SECRET is not set — refusing request`);
    return { status: 500, error: 'webhook secret not configured' };
  }
  if (!secretsMatch(req.headers?.['x-webhook-secret'], expected)) {
    console.warn(`${label}: bad/missing webhook secret`);
    return { status: 401, error: 'unauthorized' };
  }
  return null;
};

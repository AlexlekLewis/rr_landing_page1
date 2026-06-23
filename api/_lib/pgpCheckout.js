// ============================================================
// Shared pack/unpack for carrying a full Power Game application payload through
// Stripe Checkout Session metadata, so the power_game_applications row is created
// ONLY after payment is confirmed (create-on-payment) — no DB/sheet lock until paid.
//
// Stripe metadata limits: ≤50 keys, key ≤40 chars, value ≤500 chars. We base64 the
// JSON (ASCII-only, so chunks can be split anywhere without breaking multi-byte
// chars) and spread it across app_0..app_{n-1} with app_n = chunk count.
// ============================================================

/** application object → Stripe metadata fields (merge into session.metadata). */
export function packApplication(application) {
  const b64 = Buffer.from(JSON.stringify(application || {}), 'utf8').toString('base64');
  const chunks = b64.match(/.{1,480}/g) || []; // 480 < Stripe's 500-char value limit
  if (chunks.length > 45) throw new Error('application payload too large for Stripe metadata');
  const md = { app_n: String(chunks.length) };
  chunks.forEach((c, i) => { md[`app_${i}`] = c; });
  return md;
}

/** Stripe session.metadata → application object (or null if no packed payload). */
export function unpackApplication(metadata) {
  const n = parseInt(metadata?.app_n || '0', 10);
  if (!Number.isInteger(n) || n <= 0) return null;
  let b64 = '';
  for (let i = 0; i < n; i++) b64 += metadata[`app_${i}`] ?? '';
  try {
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

/**
 * Build the PAID power_game_applications row from the unpacked application + the
 * Stripe session. Overrides the pending fields the funnel set with the confirmed
 * payment fields. `stripe_session_id` is the idempotency key (unique index).
 */
export function buildPaidRow(application, session) {
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : undefined;
  return {
    ...(id ? { id } : {}),
    ...application,
    payment_status: 'completed',
    status: 'paid',
    amount_paid_cents: session?.amount_total ?? null,
    paid_at: new Date().toISOString(),
    stripe_session_id: session?.id || null,
    // Record the SERVER-priced kit total/selection (from the checkout metadata) so the
    // row reflects what was actually charged — not the funnel's size-only placeholder.
    uniform_total_cents: Number(session?.metadata?.uniform_total_cents) || application?.uniform_total_cents || 0,
    uniform_selection: session?.metadata?.uniform_selection || application?.uniform_selection || '',
  };
}

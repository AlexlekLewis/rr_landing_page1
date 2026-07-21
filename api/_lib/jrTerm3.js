// ============================================================
// Junior Royals Term 3 — Stripe payment reconciliation helpers
// ============================================================
// Shared by api/stripe-webhook.js (real-time), api/sync-pgp-leads.js
// (30-min cron reconcile + historical backfill) and
// api/sync-programs-from-stripe.js (admin manual sync). Mirrors the
// Power Game payment-confirmations pattern.
//
// Context: JR T3 registrations are inserted into jr_term3_{centre} with
// payment_status='pending', then the parent pays through a STATIC Stripe
// Payment Link that never redirects back to /junior-royals/success — so the
// success page's localStorage completion never runs. The link's product also
// reuses the Term 2 Hallam price ID, so its sessions were being filed in
// program_registrations as term_2_hallam. These helpers classify a checkout
// session as JR T3 and flip the matching registration row to completed:
// by client_reference_id when present (the form now stamps
// `jrt3-{centre}-{recordId}` onto the payment link URL), else by payer email.
// Every processed session is recorded in jr_term3_payment_confirmations,
// including unmatched ones, so nothing fails silently.
// ============================================================

export const JR_T3_TABLES = ['jr_term3_mickleham', 'jr_term3_hallam', 'jr_term3_williamstown'];

// The Term 3 Payment Links sell this price. It was created for Term 2 Hallam
// and reused for Term 3 (the product was renamed), so sessions carrying it are
// only Term 3 if they were created after the Term 3 launch — see JR_T3_SINCE.
export const JR_T3_SHARED_PRICE_IDS = new Set([
  'price_1TMFh5Io52UEA50yrjh0rz92', // "2026 Junior Royals Program - Term 3: Hallam, Mickleham, Williamstown North"
]);

// Term 3 registrations opened 27 Jun 2026 (Melbourne). Unix seconds.
export const JR_T3_SINCE = Math.floor(Date.parse('2026-06-26T14:00:00Z') / 1000);

// client_reference_id format stamped by JRT3RegistrationForm: jrt3-{centre}-{uuid}
export const parseJrT3Ref = (ref) => {
  const m = /^jrt3-(mickleham|hallam|williamstown)-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(String(ref || ''));
  return m ? { table: `jr_term3_${m[1].toLowerCase()}`, id: m[2].toLowerCase() } : null;
};

// lineItems: [{ description|name, price_id, quantity }]
export const isJrT3Session = (session, lineItems) => {
  if (parseJrT3Ref(session?.client_reference_id)) return true;
  const desc = (lineItems || []).map((i) => String(i.description || i.name || '')).join(' | ').toLowerCase();
  if (desc.includes('junior royals') && desc.includes('term 3')) return true;
  return (lineItems || []).some((i) => JR_T3_SHARED_PRICE_IDS.has(i.price_id))
    && (session?.created || 0) >= JR_T3_SINCE;
};

export const classifyJrT3 = (lineItems) => ({
  program: 'junior_royals',
  program_variant: 'term_3',
  program_label: (lineItems || []).map((i) => i.description || i.name).find(Boolean)
    || 'Junior Royals — Term 3',
});

// Quantity of the program line (a parent buying for 2 kids in one checkout
// shows up as quantity 2 — only one row gets flipped, so it's flagged).
export const jrT3ProgramQuantity = (lineItems) => {
  const q = (lineItems || [])
    .filter((i) => JR_T3_SHARED_PRICE_IDS.has(i.price_id))
    .reduce((s, i) => s + (i.quantity || 1), 0);
  return q || 1;
};

const likeSafe = (s) => String(s).replace(/[\\%_]/g, (c) => `\\${c}`);

const sessionEmail = (session) =>
  String(session?.customer_details?.email || session?.customer_email || '').trim().toLowerCase();

// Flip the matching jr_term3_* row to completed and record a confirmation row.
// Idempotent: re-processing a session upserts the same confirmation (by
// stripe_session_id) and finds the row already completed ('already').
// Returns { method: 'client_ref'|'email'|'already'|'none', table?, id? }.
export async function completeJrT3Registration(supabase, session, lineItems, source = 'webhook') {
  const email = sessionEmail(session);
  const paidAt = session?.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString();
  const qty = jrT3ProgramQuantity(lineItems);
  const notes = [];
  let matched = null;
  let method = 'none';

  // 1) Exact match via client_reference_id stamped on the payment link URL.
  const ref = parseJrT3Ref(session?.client_reference_id);
  if (ref) {
    const { data, error } = await supabase
      .from(ref.table)
      .update({ payment_status: 'completed' })
      .eq('id', ref.id)
      .select('id');
    if (error) notes.push(`client_ref update failed: ${error.message}`);
    else if (data && data.length) { matched = { table: ref.table, id: ref.id }; method = 'client_ref'; }
    else notes.push(`client_ref row ${ref.id} not found in ${ref.table}`);
  }

  // 2) Fallback: newest PENDING row for the payer email across the three tables.
  if (!matched && email) {
    const candidates = [];
    for (const table of JR_T3_TABLES) {
      const { data, error } = await supabase
        .from(table)
        .select('id, created_at, payment_status')
        .ilike('parent_email', likeSafe(email));
      if (error) { notes.push(`${table} lookup failed: ${error.message}`); continue; }
      for (const r of data || []) candidates.push({ table, ...r });
    }
    candidates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const pending = candidates.filter((r) => r.payment_status !== 'completed');
    if (pending.length) {
      const pick = pending[0];
      const { error } = await supabase
        .from(pick.table)
        .update({ payment_status: 'completed' })
        .eq('id', pick.id);
      if (error) notes.push(`${pick.table} update failed: ${error.message}`);
      else { matched = { table: pick.table, id: pick.id }; method = 'email'; }
      if (pending.length > 1) notes.push(`${pending.length - 1} other pending row(s) for this email left untouched (likely duplicate submissions)`);
    } else if (candidates.length) {
      matched = { table: candidates[0].table, id: candidates[0].id };
      method = 'already';
    } else {
      notes.push('no registration row found for payer email');
    }
  }
  if (!email && !ref) notes.push('session has no payer email and no client_reference_id');
  if (qty > 1) notes.push(`program quantity ${qty} — check for additional siblings to mark manually`);

  const confirmation = {
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === 'string'
      ? session.payment_intent : session.payment_intent?.id || null,
    stripe_payment_link: typeof session.payment_link === 'string'
      ? session.payment_link : session.payment_link?.id || null,
    customer_email: email || null,
    customer_name: session.customer_details?.name || null,
    amount_total_cents: session.amount_total ?? null,
    currency: session.currency || 'aud',
    program_quantity: qty,
    paid_at: paidAt,
    matched_table: matched?.table || null,
    matched_record_id: matched?.id || null,
    match_method: method,
    notes: notes.length ? `[${source}] ${notes.join('; ')}` : `[${source}]`,
  };
  const { error: confErr } = await supabase
    .from('jr_term3_payment_confirmations')
    .upsert(confirmation, { onConflict: 'stripe_session_id' });
  if (confErr) console.warn('jr_term3_payment_confirmations upsert failed:', confErr.message);

  return { method, ...(matched || {}) };
}

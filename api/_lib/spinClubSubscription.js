// ============================================================
// Spin Club weekly subscription — Stripe → Supabase
// ============================================================
// Spin Club moved to a weekly subscription on 27 Nov 2026: $60 a Wednesday,
// GST included, the same price for everyone (Alex). One Stripe Payment Link
// sells it, and that link is a SUBSCRIPTION, so a checkout is only the first
// week. Every later week arrives as an invoice event, and a pause or a
// cancellation arrives as a subscription event. All three are recorded here,
// so the admin can answer "who has paid this week" without opening Stripe.
//
//   spin_club_subscriptions  one row per subscription (= one player held spot)
//   spin_club_payments       one row per weekly invoice, paid or failed
//   v_spin_club_members      the two joined, matched to rra_players_master
//                            and the player portal's players table
//
// Matching keys, strongest first:
//   1. client_reference_id — the applications.id the /spin-club form sends to
//      Stripe with the payment link, so a website sign-up lands on its own row.
//   2. parent email / mobile + the player's name (the link's two custom
//      fields) — for families who pay straight from a WhatsApp link.
// ============================================================

// The live link (Alex's Stripe, created 27 Nov 2026). Source of truth for the
// URL is STRIPE_SUBSCRIPTION_LINK in src/components/spin-club/scOptions.js.
export const SPIN_CLUB_SUBSCRIPTION_PLINK = 'plink_1UgKIGIo52UEA50y8aHnHHXg';

export const SPIN_CLUB_PROGRAM = {
  program: 'spin_club',
  program_variant: 'weekly_subscription',
  program_label: 'Spin Club — weekly subscription ($60 a week incl. GST)',
};

const SUBS_TABLE = 'spin_club_subscriptions';
const PAYMENTS_TABLE = 'spin_club_payments';

const isUuid = (v) =>
  typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

const iso = (unix) => (unix ? new Date(unix * 1000).toISOString() : null);
const idOf = (v) => (v && typeof v === 'object' ? v.id : v) || null;

// The link's two custom fields. Stripe builds each field's key from its label
// when the link is made, so read by label first and only fall back to the key.
export const readCustomFields = (session) => {
  const out = { player_name: null, centre: null };
  for (const f of session?.custom_fields || []) {
    const label = String(f?.label?.custom || f?.key || '').toLowerCase();
    const value = f?.type === 'dropdown' ? f?.dropdown?.value : f?.text?.value;
    if (!value) continue;
    if (label.includes('player')) out.player_name = String(value).trim();
    else if (label.includes('centre') || label.includes('center')) {
      // Dropdown values are Stripe-generated keys; map them to the centre names.
      const v = String(value).toLowerCase();
      out.centre = v.includes('mickleham') ? 'Mickleham'
        : v.includes('cranbourne') ? 'Cranbourne North'
        : String(value);
    }
  }
  return out;
};

export const isSpinClubSession = (session) =>
  session?.payment_link === SPIN_CLUB_SUBSCRIPTION_PLINK;

// Checkout completed → the held spot. Idempotent on the subscription id.
export async function recordSpinClubCheckout(supabase, session) {
  const subscriptionId = idOf(session.subscription);
  const fields = readCustomFields(session);
  const ref = session.client_reference_id;
  const row = {
    stripe_subscription_id: subscriptionId,
    stripe_customer_id:     idOf(session.customer),
    stripe_session_id:      session.id,
    application_id:         isUuid(ref) ? ref : null,
    player_name:            fields.player_name,
    centre:                 fields.centre,
    parent_name:            session.customer_details?.name || null,
    parent_email:           (session.customer_details?.email || '').toLowerCase() || null,
    parent_phone:           session.customer_details?.phone || null,
    status:                 'active',
    started_at:             iso(session.created) || new Date().toISOString(),
    updated_at:             new Date().toISOString(),
  };
  if (!subscriptionId) throw new Error(`spin club checkout ${session.id} has no subscription`);
  const { error } = await supabase.from(SUBS_TABLE).upsert(row, { onConflict: 'stripe_subscription_id' });
  if (error) throw new Error(`${SUBS_TABLE} upsert failed: ${error.message}`);
  return row;
}

// Is this invoice a Spin Club week? Known subscription first; the product name
// on the invoice line covers an invoice that beats its own checkout event here.
export async function isSpinClubInvoice(supabase, invoice) {
  const subscriptionId = idOf(invoice?.subscription) || idOf(invoice?.parent?.subscription_details?.subscription);
  if (subscriptionId) {
    const { data } = await supabase.from(SUBS_TABLE).select('id').eq('stripe_subscription_id', subscriptionId).limit(1);
    if (data?.length) return true;
  }
  return (invoice?.lines?.data || []).some((l) => /spin club/i.test(l?.description || ''));
}

// invoice.paid / invoice.payment_failed → one row per weekly invoice.
export async function recordSpinClubInvoice(supabase, invoice, eventType) {
  const subscriptionId = idOf(invoice.subscription) || idOf(invoice?.parent?.subscription_details?.subscription);
  const line = (invoice.lines?.data || [])[0];
  const paid = eventType === 'invoice.paid';
  const row = {
    stripe_invoice_id:      invoice.id,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id:     idOf(invoice.customer),
    status:                 paid ? 'paid' : 'failed',
    billing_reason:         invoice.billing_reason || null,
    amount_cents:           paid ? (invoice.amount_paid ?? null) : (invoice.amount_due ?? null),
    currency:               invoice.currency || 'aud',
    period_start:           iso(line?.period?.start),
    period_end:             iso(line?.period?.end),
    paid_at:                paid ? (iso(invoice.status_transitions?.paid_at) || new Date().toISOString()) : null,
    customer_email:         (invoice.customer_email || '').toLowerCase() || null,
    hosted_invoice_url:     invoice.hosted_invoice_url || null,
    updated_at:             new Date().toISOString(),
  };
  // A failed invoice that is later paid keeps ONE row, which flips to paid.
  const { error } = await supabase.from(PAYMENTS_TABLE).upsert(row, { onConflict: 'stripe_invoice_id' });
  if (error) throw new Error(`${PAYMENTS_TABLE} upsert failed: ${error.message}`);
  if (!paid && subscriptionId) {
    await supabase.from(SUBS_TABLE)
      .update({ status: 'payment_failed', updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', subscriptionId);
  }
  return row;
}

// customer.subscription.updated / .deleted → paused, cancelled or active again.
export const subscriptionStatus = (sub, eventType) => {
  if (eventType === 'customer.subscription.deleted' || sub?.status === 'canceled') return 'cancelled';
  if (sub?.pause_collection) return 'paused';
  if (sub?.status === 'past_due' || sub?.status === 'unpaid') return 'payment_failed';
  return 'active';
};

export async function recordSpinClubSubscriptionChange(supabase, sub, eventType) {
  const { data } = await supabase.from(SUBS_TABLE).select('id').eq('stripe_subscription_id', sub.id).limit(1);
  if (!data?.length) return { matched: false };
  const status = subscriptionStatus(sub, eventType);
  const { error } = await supabase.from(SUBS_TABLE).update({
    status,
    paused_until:     iso(sub.pause_collection?.resumes_at),
    cancelled_at:     status === 'cancelled' ? (iso(sub.canceled_at) || new Date().toISOString()) : null,
    next_payment_at:  iso(sub.trial_end && sub.status === 'trialing' ? sub.trial_end : (sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end)),
    updated_at:       new Date().toISOString(),
  }).eq('stripe_subscription_id', sub.id);
  if (error) throw new Error(`${SUBS_TABLE} status update failed: ${error.message}`);
  return { matched: true, status };
}

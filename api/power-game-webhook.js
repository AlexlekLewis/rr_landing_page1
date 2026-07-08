// ============================================================
// Vercel Serverless Function — Stripe webhook for Power Game payments.
// CREATE-ON-PAYMENT: on checkout.session.completed we CREATE the paid
// power_game_applications row from the application payload packed into the session
// metadata — the row (and therefore the Google Sheet) only ever exists for a PAID
// applicant. Idempotent via a unique index on stripe_session_id.
//   • New flow:    metadata has the packed app payload → insert the paid row.
//   • Legacy flow: a row was pre-created and linked by client_reference_id /
//                  metadata.application_id → flip it to paid (back-compat).
// A confirmation email is sent ONCE, by whichever path first creates/flips the row.
// Env: STRIPE_SECRET_KEY, STRIPE_PG_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      RESEND_API_KEY (optional — email skipped if unset).
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { unpackApplication, buildPaidRow } from './_lib/pgpCheckout.js';
import { sendPgpConfirmation } from './_lib/pgpEmail.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

const refOf = (sid) => (sid ? String(sid).slice(-8).toUpperCase() : '');

async function emailFor(row, session) {
  try {
    if (!row?.email) return;
    await sendPgpConfirmation({
      to: row.email,
      playerName: row.player_name,
      centreName: row.venue,
      sessionDay: row.session_day,
      sessionTime: row.session_time,
      ageGroup: row.age_group,
      amountCents: session?.amount_total ?? row.amount_paid_cents ?? null,
      ref: refOf(session?.id || row.stripe_session_id),
    });
  } catch (e) {
    console.error('power-game-webhook: confirmation email failed (non-fatal):', e.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let event;
  try {
    const sig = req.headers['stripe-signature'];
    const buf = await rawBody(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_PG_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;

      // Single-use scholarship link: mark the token consumed so it can't be reused.
      // Idempotent; api/power-game-verify-session (success page) does the same.
      const schToken = s.metadata?.scholarship_token;
      if (schToken) {
        await supabase
          .from('pgp_scholarship_prefill')
          .update({ redeemed_at: new Date().toISOString() })
          .eq('token', schToken)
          .is('redeemed_at', null);
      }

      const application = unpackApplication(s.metadata);

      if (application) {
        // ── New flow: create the PAID row now (idempotent on stripe_session_id). ──
        const row = buildPaidRow(application, s);
        const { data, error } = await supabase
          .from('power_game_applications')
          .upsert(row, { onConflict: 'stripe_session_id', ignoreDuplicates: true })
          .select('id, email, player_name, venue, session_day, session_time, age_group, amount_paid_cents, stripe_session_id');
        if (error) throw error;
        const created = Array.isArray(data) && data.length > 0;
        if (created) await emailFor(data[0], s);
      } else {
        // ── Legacy flow: a row was pre-created — flip it to paid (only if not already). ──
        const appId = s.client_reference_id || s.metadata?.application_id;
        const isPowerGame = s.metadata?.source === 'power-game' || !!s.client_reference_id;
        if (isPowerGame && appId) {
          const { data, error } = await supabase
            .from('power_game_applications')
            .update({
              payment_status: 'completed',
              status: 'paid',
              amount_paid_cents: s.amount_total ?? null,
              paid_at: new Date().toISOString(),
              stripe_session_id: s.id,
            })
            .eq('id', appId)
            .neq('payment_status', 'completed')
            .select('id, email, player_name, venue, session_day, session_time, age_group, amount_paid_cents, stripe_session_id');
          if (error) throw error;
          if (Array.isArray(data) && data.length > 0) await emailFor(data[0], s);
        }
      }
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('power-game-webhook error:', e);
    return res.status(500).json({ error: e.message });
  }
}

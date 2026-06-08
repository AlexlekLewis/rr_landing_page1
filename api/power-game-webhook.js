// ============================================================
// Vercel Serverless Function — Stripe webhook for Power Game payments.
// Confirms the held booking (atomic pg_confirm_booking RPC) + marks the
// application booked when checkout completes.
// Env: STRIPE_SECRET_KEY, STRIPE_PG_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Point a Stripe webhook endpoint (checkout.session.completed) at this route.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
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
      if (s.metadata?.source === 'power-game' && s.metadata.booking_id) {
        // Atomic confirm of the held spot (survives the hold TTL once confirmed).
        await supabase.rpc('pg_confirm_booking', {
          p_booking: s.metadata.booking_id,
          p_session: s.id,
          p_pi: s.payment_intent,
          p_amount: s.amount_total,
        });
        if (s.metadata.application_id) {
          await supabase.from('pg_applications').update({ status: 'booked' }).eq('id', s.metadata.application_id);
        }
      }
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('power-game-webhook error:', e);
    return res.status(500).json({ error: e.message });
  }
}

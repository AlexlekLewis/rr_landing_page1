// ============================================================
// Vercel Serverless Function — Stripe webhook for Power Game payments.
// On checkout.session.completed, flips the linked power_game_applications row to
// paid (payment_status=completed) — the "official player" signal the portal ingests.
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
      const appId = s.metadata?.application_id;
      // A paid checkout flips the canonical power_game_applications row to completed —
      // this is what marks an "official player" the Elite Player Portal ingests.
      if (s.metadata?.source === 'power-game' && appId) {
        await supabase
          .from('power_game_applications')
          .update({
            payment_status: 'completed',
            status: 'paid',
            amount_paid_cents: s.amount_total ?? null,
            paid_at: new Date().toISOString(),
            stripe_session_id: s.id,
          })
          .eq('id', appId);
      }
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('power-game-webhook error:', e);
    return res.status(500).json({ error: e.message });
  }
}

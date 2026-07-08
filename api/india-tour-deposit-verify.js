// ============================================================
// Vercel Serverless Function — verify an India Tour deposit payment.
// GET/POST /api/india-tour-deposit-verify?session_id=cs_...
//
// Called by the deposit success page. Retrieves the Stripe Checkout Session,
// and if paid, marks the matching india_tour_2026_deposits row as paid.
// Acts as the success-page backstop (no webhook required for this flow).
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://pudldzgmluwoocwxtzhw.supabase.co';

let _supabase = null;
const getSupabase = () => {
  if (_supabase) return _supabase;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  _supabase = createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
  return _supabase;
};

export default async function handler(req, res) {
  try {
    const sessionId = (req.query && req.query.session_id) || (req.body && req.body.session_id);
    if (!sessionId) return res.status(400).json({ error: 'Missing session_id' });
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Not configured' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
    const paid = session.payment_status === 'paid';
    const name = session.metadata?.registrant_name || session.customer_details?.name || '';
    const playerName = session.metadata?.player_name || '';

    if (paid) {
      const supabase = getSupabase();
      if (supabase) {
        const patch = {
          status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          amount_paid_cents: session.amount_total,
          stripe_session_id: session.id,
          stripe_payment_intent:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id || null,
        };
        const depositId = session.client_reference_id || session.metadata?.deposit_id;
        if (depositId) await supabase.from('india_tour_2026_deposits').update(patch).eq('id', depositId);
        else await supabase.from('india_tour_2026_deposits').update(patch).eq('stripe_session_id', session.id);
      }
    }

    return res.status(200).json({
      ok: true,
      paid,
      name,
      player_name: playerName,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (e) {
    console.error('india-tour-deposit-verify error:', e);
    return res.status(500).json({ error: e.message || 'Verify failed' });
  }
}

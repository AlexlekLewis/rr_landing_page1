// ============================================================
// Vercel Serverless Function — second-layer payment validation for Power Game.
// POST /api/power-game-verify-session  { sessionId, pixelFired? }
//
// The success page calls this with the Stripe session id from the redirect URL.
// We retrieve the session SERVER-SIDE (never trusting the redirect alone) and:
//   • if paid: upsert a row into power_game_payment_confirmations (the audit/
//     pixel log), and backstop-update the application row to paid in case the
//     webhook was missed (idempotent — same fields the webhook writes).
//   • return { paid, amountCents, playerName, applicationId } for the page.
// A follow-up call with pixelFired:true stamps purchase_pixel_fired_at so we
// can audit that the Meta Purchase pixel fired for every real payment.
// Env: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// ============================================================
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { sessionId, pixelFired } = req.body || {};
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return res.status(400).json({ error: 'Missing or invalid sessionId' });
    }

    const s = await stripe.checkout.sessions.retrieve(sessionId);
    // Accept BOTH paths: the dynamic checkout (metadata.source='power-game') and the
    // hosted payment link, which carries the application row UUID via client_reference_id.
    const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
    if (s?.metadata?.source !== 'power-game' && !isUuid(s?.client_reference_id)) {
      return res.status(404).json({ error: 'Not a Power Game session' });
    }

    const paid = s.payment_status === 'paid';
    const appId = s.metadata?.application_id || s.client_reference_id || null;

    if (paid) {
      // Audit row (idempotent on stripe_session_id).
      await supabase.from('power_game_payment_confirmations').upsert(
        {
          stripe_session_id: s.id,
          application_id: appId,
          amount_cents: s.amount_total ?? null,
          currency: s.currency || 'aud',
          payment_status: s.payment_status,
          player_name: s.metadata?.player_name || null,
          ...(pixelFired ? { purchase_pixel_fired_at: new Date().toISOString() } : {}),
        },
        { onConflict: 'stripe_session_id' },
      );

      // Backstop: make sure the application row reflects the payment even if the
      // Stripe webhook was missed. Same fields the webhook writes — idempotent.
      if (appId) {
        await supabase
          .from('power_game_applications')
          .update({
            payment_status: 'completed',
            status: 'paid',
            amount_paid_cents: s.amount_total ?? null,
            paid_at: new Date().toISOString(),
            stripe_session_id: s.id,
          })
          .eq('id', appId)
          .neq('payment_status', 'completed');
      }
    }

    return res.status(200).json({
      paid,
      amountCents: s.amount_total ?? null,
      playerName: s.metadata?.player_name || '',
      applicationId: appId,
    });
  } catch (e) {
    console.error('power-game-verify-session error:', e);
    return res.status(500).json({ error: 'verification_failed' });
  }
}

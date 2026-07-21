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
import { unpackApplication, buildPaidRow } from './_lib/pgpCheckout.js';
import { sendPgpConfirmation } from './_lib/pgpEmail.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const refOf = (sid) => (sid ? String(sid).slice(-8).toUpperCase() : '');
async function emailFor(row, session) {
  try {
    if (!row?.email) return;
    await sendPgpConfirmation({
      to: row.email, playerName: row.player_name, centreName: row.venue,
      sessionDay: row.session_day, sessionTime: row.session_time, ageGroup: row.age_group,
      amountCents: session?.amount_total ?? row.amount_paid_cents ?? null,
      ref: refOf(session?.id || row.stripe_session_id),
    });
  } catch (e) { console.error('verify-session: confirmation email failed (non-fatal):', e.message); }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { sessionId, pixelFired } = req.body || {};
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return res.status(400).json({ error: 'Missing or invalid sessionId' });
    }

    const s = await stripe.checkout.sessions.retrieve(sessionId);
    // Accept ALL Power Game session shapes: the dynamic checkout
    // (metadata.source='power-game'), the legacy create-pgp-checkout sessions
    // ('power-game-program' — no packed application, so only the audit row is
    // written for them), and the hosted payment link, which carries the
    // application row UUID via client_reference_id.
    const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
    if (!['power-game', 'power-game-program'].includes(s?.metadata?.source) && !isUuid(s?.client_reference_id)) {
      return res.status(404).json({ error: 'Not a Power Game session' });
    }

    const paid = s.payment_status === 'paid';
    let appId = s.metadata?.application_id || s.client_reference_id || null;

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

      // Single-use scholarship link: mark the token consumed so it can't be reused.
      // Idempotent (only flips a not-yet-redeemed token); the webhook does the same.
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
        // Create-on-payment BACKSTOP: if the webhook hasn't created the paid row yet,
        // create it now (idempotent on stripe_session_id). Whichever path inserts
        // first sends the one confirmation email.
        const row = buildPaidRow(application, s);
        const { data, error } = await supabase
          .from('power_game_applications')
          .upsert(row, { onConflict: 'stripe_session_id', ignoreDuplicates: true })
          .select('id, email, player_name, venue, session_day, session_time, age_group, amount_paid_cents, stripe_session_id');
        if (!error && Array.isArray(data) && data.length > 0) {
          appId = data[0].id;
          await emailFor(data[0], s);
        } else if (!appId) {
          // Row already existed (webhook won the race) — resolve its id for the response.
          const { data: existing } = await supabase
            .from('power_game_applications')
            .select('id')
            .eq('stripe_session_id', s.id)
            .maybeSingle();
          appId = existing?.id || null;
        }
      } else if (appId) {
        // Legacy backstop: pre-created row — flip to paid even if the webhook was missed.
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

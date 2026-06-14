// ============================================================
// Vercel Serverless Function — Create Stripe Checkout Session for a Power Game spot.
// POST /api/power-game-checkout  { application, email, playerName, squadId, uniformTotalCents, uniformSelection }
//
// CREATE-ON-PAYMENT: the application row is NOT written to the database here. The
// full application payload travels in the Stripe session metadata (packed); the
// power_game_applications row is created only once payment is confirmed, by
// api/power-game-webhook (with api/power-game-verify-session as the success-page
// backstop). So an unpaid applicant never locks a spot in the DB or the Google Sheet.
// Env: STRIPE_SECRET_KEY, VITE_APP_URL.
// ============================================================
import Stripe from 'stripe';
import { packApplication } from './_lib/pgpCheckout.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const BLOCK_FEE_CENTS = 98900; // $989 — 8-week phase

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { application, email, playerName, squadId, uniformTotalCents, uniformSelection } = req.body || {};
    if (!application || typeof application !== 'object') {
      return res.status(400).json({ error: 'Missing application payload' });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Checkout is not configured.' });
    }

    // Consents are the gate. The application payload is the source of truth (the UI
    // also gates this); fail closed if any required consent is missing.
    const a = application;
    const consentsAccepted =
      a.accept_terms && a.accept_player_code && a.accept_parent_code &&
      a.accept_social_media && a.accept_playing_standard;
    if (!consentsAccepted) {
      return res.status(403).json({ error: 'All compliance agreements must be accepted before payment.' });
    }

    const lineItems = [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'The Power Game Program — 8-week Power Pre-Season (Phase 1)' },
          unit_amount: BLOCK_FEE_CENTS,
        },
        quantity: 1,
      },
    ];

    // Kit/uniform is size-capture only by default (not charged on the fixed $989 link);
    // a positive uniformTotalCents would bundle it into the same payment.
    const kitCents = Number(uniformTotalCents) || 0;
    if (kitCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Royals Academy Kit',
            description: (uniformSelection || '').slice(0, 250) || undefined,
          },
          unit_amount: kitCents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: lineItems,
      metadata: {
        source: 'power-game',
        player_name: (playerName || a.player_name || '').slice(0, 200),
        squad_id: squadId || '',
        uniform_selection: (uniformSelection || a.uniform_selection || '').slice(0, 480),
        uniform_total_cents: String(kitCents),
        // Full application payload, packed across app_0..app_{n-1} (+ app_n count).
        ...packApplication(a),
      },
      success_url: `${BASE_URL}/PGP2026/apply/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/PGP2026/apply?cancelled=1`,
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (e) {
    console.error('power-game-checkout error:', e);
    return res.status(500).json({ error: e.message });
  }
}

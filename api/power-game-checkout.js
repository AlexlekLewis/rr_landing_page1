// ============================================================
// Vercel Serverless Function — Create Stripe Checkout Session for a Power Game spot.
// POST /api/power-game-checkout  { applicationId, bookingId, squadId, email, playerName }
// The held spot (bookingId) is confirmed by api/power-game-webhook.js on payment.
// Env: STRIPE_SECRET_KEY, VITE_APP_URL.
// ============================================================
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.VITE_APP_URL || 'https://rramelbourne.com';
const BLOCK_FEE_CENTS = 98900; // $989 — 8-week phase

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { applicationId, bookingId, squadId, email, playerName, uniformTotalCents, uniformSelection } = req.body || {};
    if (!bookingId || !squadId) return res.status(400).json({ error: 'Missing booking or squad' });

    const lineItems = [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'The Power Game Program — 8-week phase' },
          unit_amount: BLOCK_FEE_CENTS,
        },
        quantity: 1,
      },
    ];

    // Kit/uniform is bundled into the same payment (special first-time pricing).
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
        application_id: applicationId || '',
        booking_id: bookingId,
        squad_id: squadId,
        player_name: playerName || '',
        uniform_selection: (uniformSelection || '').slice(0, 480),
        uniform_total_cents: String(kitCents),
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

// ============================================================
// Vercel Serverless Function — Stripe Webhook Handler
// POST /api/stripe-webhook
// ============================================================
// Listens for Stripe checkout.session.completed events and
// updates Supabase order records with customer details.
//
// Required environment variables (set in Vercel Dashboard):
//   STRIPE_SECRET_KEY         = sk_live_...
//   STRIPE_WEBHOOK_SECRET     = whsec_... (from Stripe webhook settings)
//   SUPABASE_URL              = https://xxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY = service_role key (not anon key)
// ============================================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Use service role key for server-side writes (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable body parsing — Stripe needs the raw body to verify signature
export const config = { api: { bodyParser: false } };

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  // Only handle completed checkout sessions
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const customerName = session.customer_details?.name || null;
    const customerEmail = session.customer_details?.email || null;
    const customerPhone = session.customer_details?.phone || null;
    const sessionId = session.id;

    const { order_id: trainingOrderId, ipl_order_id: iplOrderId } = session.metadata || {};

    const updates = {
      payment_status: 'completed',
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      stripe_session_id: sessionId,
    };

    // Update training order if present
    if (trainingOrderId) {
      const { error } = await supabase
        .from('shop_orders_training')
        .update(updates)
        .eq('id', trainingOrderId);
      if (error) console.error('Training order update error:', error);
      else console.log(`Training order ${trainingOrderId} updated with customer details`);
    }

    // Update IPL order if present
    if (iplOrderId) {
      const { error } = await supabase
        .from('shop_orders_ipl')
        .update(updates)
        .eq('id', iplOrderId);
      if (error) console.error('IPL order update error:', error);
      else console.log(`IPL order ${iplOrderId} updated with customer details`);
    }
  }

  return res.status(200).json({ received: true });
};

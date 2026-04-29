// ============================================================
// Vercel Serverless Function — Stripe Webhook
// POST /api/stripe-webhook
// ============================================================
// Required environment variables in Vercel:
//   STRIPE_SECRET_KEY        = sk_live_...
//   STRIPE_WEBHOOK_SECRET    = whsec_...
//   VITE_SUPABASE_URL        = https://xxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY = eyJ...
//   ZAPIER_SHOP_WEBHOOK_URL  = https://hooks.zapier.com/...
// ============================================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: err.message });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const customerName    = session.customer_details?.name || '';
    const customerEmail   = session.customer_details?.email || '';
    const customerPhone   = session.customer_details?.phone || '';
    const shippingAddress = session.shipping_details?.address || null;
    const shippingLabel   = session.shipping_cost?.shipping_rate_details?.display_name || '';

    const fulfillmentMethod = shippingLabel.toLowerCase().includes('pickup')
      ? 'pickup'
      : shippingLabel.toLowerCase().includes('express') ? 'express' : 'standard';

    // Get line items from Stripe
    let lineItems = [];
    try {
      const resp = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 });
      lineItems = resp.data.map(i => ({
        name: i.description,
        quantity: i.quantity,
        unit_price: i.price?.unit_amount,
        total: i.amount_total,
      }));
    } catch (e) { console.warn('Line items fetch failed:', e.message); }

    const orderId    = session.metadata?.order_id || null;
    const iplOrderId = session.metadata?.ipl_order_id || null;

    const updatePayload = {
      payment_status:    'completed',
      stripe_session_id:  session.id,
      customer_name:     customerName,
      customer_email:    customerEmail,
      customer_phone:    customerPhone,
      shipping_address:  shippingAddress,
      fulfillment_method: fulfillmentMethod,
    };

    if (orderId) {
      const { error } = await supabase.from('shop_orders_training').update(updatePayload).eq('id', orderId);
      if (error) console.error('Training update failed:', error);
    }

    if (iplOrderId) {
      const { error } = await supabase.from('shop_orders_ipl').update({ ...updatePayload, supplier_status: 'awaiting_bulk_order' }).eq('id', iplOrderId);
      if (error) console.error('IPL update failed:', error);
    }

    // Fire Zapier → Google Sheets
    const zapierUrl = process.env.ZAPIER_SHOP_WEBHOOK_URL;
    if (zapierUrl) {
      try {
        const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
        await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id:       orderId || iplOrderId || '',
            stripe_session: session.id,
            order_date:     new Date().toLocaleDateString('en-AU'),
            order_time:     new Date().toLocaleTimeString('en-AU'),
            customer_name:  customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            delivery_method: fulfillmentMethod === 'pickup'
              ? `Pickup — ${shippingLabel}`
              : fulfillmentMethod === 'express' ? 'Express Shipping' : 'Standard Shipping',
            shipping_address: shippingAddress
              ? `${shippingAddress.line1 || ''}, ${shippingAddress.city || ''} ${shippingAddress.postal_code || ''}, ${shippingAddress.country || ''}`.trim()
              : '',
            items: lineItems
              .filter(i => !i.name?.toLowerCase().includes('delivery') && !i.name?.toLowerCase().includes('shipping'))
              .map(i => `${i.name} x${i.quantity}`)
              .join(' | '),
            total_paid: `$${(session.amount_total / 100).toFixed(2)} AUD`,
          }),
        });
        console.log('Zapier fired successfully');
      } catch (e) { console.warn('Zapier failed (non-blocking):', e.message); }
    }
  }

  return res.status(200).json({ received: true });
};

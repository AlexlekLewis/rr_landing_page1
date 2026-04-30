// ============================================================
// Vercel Serverless Function — Manual Order Confirmation Email
// POST /api/send-confirmation  { order_id, source }
// source: 'training' | 'ipl'
// ============================================================
// Used by the admin dashboard "Send confirmation email" button.
// Looks up the order in Supabase, then sends the same email template
// the auto-webhook uses, via Resend.
// Required env vars in Vercel:
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL (optional)
// ============================================================

const { createClient } = require('@supabase/supabase-js');
const { sendOrderConfirmation } = require('./_lib/orderEmail');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order_id, source } = req.body || {};
  if (!order_id || !source) {
    return res.status(400).json({ error: 'order_id and source required' });
  }
  if (source !== 'training' && source !== 'ipl') {
    return res.status(400).json({ error: 'source must be "training" or "ipl"' });
  }

  try {
    const table = source === 'ipl' ? 'shop_orders_ipl' : 'shop_orders_training';
    const { data: order, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', order_id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (!order.customer_email) {
      return res.status(400).json({ error: 'Order has no customer email yet' });
    }

    const result = await sendOrderConfirmation({
      to: order.customer_email,
      customerName: order.customer_name,
      items: order.items || [],
      fulfillmentMethod: order.fulfillment_method,
      pickupVenue: order.pickup_venue,
      shippingAddress: order.shipping_address,
      total: order.total,
      orderRef: order.id,
    });

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error('send-confirmation error:', err);
    return res.status(500).json({ error: err.message });
  }
};

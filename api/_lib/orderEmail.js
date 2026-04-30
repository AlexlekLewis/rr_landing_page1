// ============================================================
// Shared order-confirmation email builder + Resend sender
// Used by /api/stripe-webhook (auto) and /api/send-confirmation (manual)
// ============================================================
// Required env vars in Vercel:
//   RESEND_API_KEY    = re_...
//   RESEND_FROM_EMAIL = "Royals Melbourne Academy <info@rramelbourne.com>"
//                       (domain must be verified in Resend; until DNS is verified,
//                        use "onboarding@resend.dev" and send only to the
//                        Resend account owner email)
//   RESEND_BCC        = info@rramelbourne.com   (optional, BCC ops inbox)
// ============================================================

const FROM_DEFAULT = 'Royals Melbourne Academy <onboarding@resend.dev>';

const formatAUD = (cents) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
    .format((cents || 0) / 100);

const formatMoney = (n) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
    .format(Number(n || 0));

const renderItemsHtml = (items = []) => items
  .filter(i => !(i.name || i.product_name || '').toLowerCase().includes('delivery'))
  .filter(i => !(i.name || i.product_name || '').toLowerCase().includes('shipping'))
  .map(i => {
    const name = i.product_name || i.name || i.product_id || 'Item';
    const size = i.size ? ` — Size ${i.size}` : '';
    const qty = i.quantity || 1;
    const unit = i.unit_price != null
      ? (i.unit_price > 1000 ? formatAUD(i.unit_price) : formatMoney(i.unit_price))
      : '';
    return `<tr>
      <td style="padding:12px 0;border-bottom:1px solid #eee;color:#0a0a14;font-weight:600">${name}${size}</td>
      <td style="padding:12px 0;border-bottom:1px solid #eee;color:#555;text-align:center">${qty}</td>
      <td style="padding:12px 0;border-bottom:1px solid #eee;color:#0a0a14;text-align:right">${unit}</td>
    </tr>`;
  }).join('');

const renderFulfillmentHtml = ({ fulfillmentMethod, pickupVenue, shippingAddress }) => {
  if (fulfillmentMethod === 'pickup') {
    const venue = pickupVenue === 'bundoora'
      ? { name: 'Cutting Edge Cricket — Bundoora', address: 'Unit 7, Factory 19, Enterprise Drive, Bundoora VIC 3083' }
      : pickupVenue === 'hallam'
        ? { name: 'Cricket Connect — Hallam', address: '22 Technology CCT, Hallam VIC 3803' }
        : null;
    return `
      <p style="margin:0 0 8px;color:#0a0a14;font-weight:700">Academy Pickup</p>
      ${venue ? `
        <p style="margin:0;color:#0a0a14;font-size:14px;font-weight:600">${venue.name}</p>
        <p style="margin:4px 0 0;color:#555;font-size:14px">${venue.address}</p>` : ''}
      <p style="margin:12px 0 0;color:#0a0a14;font-size:13px;font-weight:600">We'll send you a text message when your order is ready for pickup.</p>
      <p style="margin:4px 0 0;color:#888;font-size:12px">Made-to-order items typically take 2–4 weeks to arrive from our supplier.</p>`;
  }
  const addr = shippingAddress
    ? `${shippingAddress.line1 || ''}${shippingAddress.line2 ? ', ' + shippingAddress.line2 : ''}<br>${shippingAddress.city || ''} ${shippingAddress.state || ''} ${shippingAddress.postal_code || ''}<br>${shippingAddress.country || ''}`
    : 'Address on file';
  const label = fulfillmentMethod === 'express' ? 'Express Shipping' : 'Standard Shipping';
  const eta = fulfillmentMethod === 'express' ? '1–3 business days' : '5–7 business days';
  return `
    <p style="margin:0 0 8px;color:#0a0a14;font-weight:700">${label}</p>
    <p style="margin:0;color:#555;font-size:14px">${addr}</p>
    <p style="margin:8px 0 0;color:#888;font-size:13px">In-stock items: ${eta} from purchase. Made-to-order items: 2–4 weeks to Australia, then ${eta} to your door.</p>`;
};

export const buildOrderConfirmationEmail = ({
  customerName,
  items,
  fulfillmentMethod,
  pickupVenue,
  shippingAddress,
  total,            // dollars (number) OR cents from Stripe (number > 1000)
  totalCents,       // optional explicit cents
  orderRef,         // short ref for the customer (id or stripe session id)
}) => {
  const totalDisplay = totalCents != null
    ? formatAUD(totalCents)
    : formatMoney(total);

  const subject = `Royals Melbourne Academy — Order Confirmation${orderRef ? ` (${orderRef.slice(0, 8)})` : ''}`;

  const html = `<!DOCTYPE html>
<html><body style="margin:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
        <tr><td style="padding:32px;background:linear-gradient(135deg,#E11F8F,#1226AA);text-align:center">
          <img src="https://rramelbourne.com/assets/Logo_White_Transparent.png" alt="Rajasthan Royals Academy Melbourne" width="120" height="120" style="display:inline-block;width:120px;height:auto;margin:0 0 12px" />
          <p style="margin:0;color:rgba(255,255,255,.85);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Royals Melbourne Academy</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:28px;font-weight:900;letter-spacing:-0.5px">You're kitted up.</h1>
        </td></tr>
        <tr><td style="padding:32px">
          <p style="margin:0 0 8px;color:#0a0a14;font-size:16px">Hi ${customerName || 'there'},</p>
          <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6">Thanks for your order. Here's a confirmation of what you bought and how it'll reach you.</p>

          <h2 style="margin:0 0 12px;color:#0a0a14;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Order</h2>
          <table width="100%" style="margin:0 0 24px;font-size:14px">
            <thead><tr>
              <th align="left" style="padding:8px 0;color:#888;font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #eee">Item</th>
              <th align="center" style="padding:8px 0;color:#888;font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #eee">Qty</th>
              <th align="right" style="padding:8px 0;color:#888;font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #eee">Price</th>
            </tr></thead>
            <tbody>${renderItemsHtml(items)}</tbody>
            <tfoot><tr>
              <td colspan="2" style="padding:16px 0 0;color:#0a0a14;font-weight:900;font-size:16px">Total paid</td>
              <td style="padding:16px 0 0;color:#0a0a14;font-weight:900;font-size:16px;text-align:right">${totalDisplay}</td>
            </tr></tfoot>
          </table>

          <h2 style="margin:0 0 12px;color:#0a0a14;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">How you'll receive it</h2>
          <div style="background:#f7f7fa;border-radius:12px;padding:16px;margin:0 0 24px">
            ${renderFulfillmentHtml({ fulfillmentMethod, pickupVenue, shippingAddress })}
          </div>

          <p style="margin:0 0 4px;color:#555;font-size:14px">Questions? Reply to this email or write to <a href="mailto:info@rramelbourne.com" style="color:#E11F8F;text-decoration:none;font-weight:600">info@rramelbourne.com</a>.</p>
          ${orderRef ? `<p style="margin:24px 0 0;color:#bbb;font-size:11px;font-family:monospace">Order ref: ${orderRef}</p>` : ''}
        </td></tr>
        <tr><td style="padding:24px 32px;background:#0a0a14;text-align:center">
          <p style="margin:0;color:rgba(255,255,255,.5);font-size:11px">© Royals Melbourne Academy</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html };
};

export const sendOrderConfirmation = async ({ to, ...orderData }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email send');
    return { skipped: true, reason: 'no_api_key' };
  }
  if (!to) {
    return { skipped: true, reason: 'no_recipient' };
  }

  const from = process.env.RESEND_FROM_EMAIL || FROM_DEFAULT;
  const bcc = process.env.RESEND_BCC || undefined;
  const { subject, html } = buildOrderConfirmationEmail(orderData);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      bcc: bcc ? [bcc] : undefined,
      subject,
      html,
      reply_to: 'info@rramelbourne.com',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API ${res.status}: ${errText}`);
  }

  return res.json();
};

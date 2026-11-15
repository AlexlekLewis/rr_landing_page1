// Academy Shop order rules, server side. Pure functions so they can be tested.
//
// Why this exists (Power Shop agent, 15 Nov 2026): the size a family picks used to live only in a
// draft row the browser wrote before checkout. Since the shop tables were locked to admins on
// 14 Sep 2026 that insert failed silently, so every order since then was saved without sizes or a
// pickup venue. The server now validates the cart, writes the draft itself and sends the sizes and
// venue to Stripe, so an order can't be paid for without them.
//
// Prices are the Stripe prices (the server never trusts amounts from the browser).
// Keep in step with src/components/academy-shop/shopConfig.js.

export const SHOP_PRODUCTS = {
  'ipl-replica-shirt': { priceId: 'price_1TRJe7Io52UEA50yZ4i5OPwH', name: '2026 Rajasthan Royals IPL Replica Playing Shirt', madeToOrder: true, oneSize: false },
  'training-shirt':    { priceId: 'price_1TRJinIo52UEA50yaIwEA8Ni', name: 'RRA Melbourne Training Shirt', madeToOrder: false, oneSize: false },
  'training-shorts':   { priceId: 'price_1TRJqhIo52UEA50ycGPuIieZ', name: 'RRA Melbourne Training Shorts', madeToOrder: false, oneSize: false },
  'training-pants':    { priceId: 'price_1TRJt4Io52UEA50ydwZmfUKh', name: 'RRA Melbourne Training Pants', madeToOrder: false, oneSize: false },
  'pink-cap':          { priceId: 'price_1TRNozIo52UEA50yEkWYWKAq', name: 'RRA Melbourne Academy Cap', madeToOrder: false, oneSize: true },
  'fleece-jacket':     { priceId: 'price_1TRNwaIo52UEA50yIChLyg1J', name: 'RRA Melbourne Fleece Lined Jacket', madeToOrder: true, oneSize: false },
};

export const FULFILMENT_METHODS = ['pickup', 'standard', 'express'];

// Pickup points new orders may choose (the two centres since 5 Oct 2026).
export const NEW_ORDER_VENUES = ['mickleham', 'cranbourne-north'];

export const MTO_SURCHARGE_CENTS = 1200;
export const MAX_QTY_PER_LINE = 20;

const cleanSize = (s) => (typeof s === 'string' ? s.trim().slice(0, 24) : '');

/**
 * Checks a cart from the browser. Returns { error } or
 * { lines: [{ product_id, product_name, size, quantity, price_id, made_to_order }], mtoQty }.
 * Unit prices are filled in from Stripe later, not taken from the browser.
 */
export function validateCart({ items, fulfillment, pickupVenue } = {}) {
  if (!Array.isArray(items) || items.length === 0) return { error: 'No items provided' };
  if (!FULFILMENT_METHODS.includes(fulfillment)) return { error: 'Choose pickup or a shipping option' };
  if (fulfillment === 'pickup' && !NEW_ORDER_VENUES.includes(pickupVenue)) {
    return { error: 'Choose a pickup venue' };
  }
  const lines = [];
  for (const item of items) {
    const product = SHOP_PRODUCTS[item?.product_id];
    if (!product) return { error: `Unknown product: ${item?.product_id}` };
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY_PER_LINE) {
      return { error: `Quantity for ${product.name} must be 1 to ${MAX_QTY_PER_LINE}` };
    }
    const size = product.oneSize ? 'One Size' : cleanSize(item.size);
    if (!size) return { error: `Choose a size for ${product.name}` };
    lines.push({
      product_id: item.product_id,
      product_name: product.name,
      size,
      quantity,
      price_id: product.priceId,
      made_to_order: product.madeToOrder,
    });
  }
  const mtoQty = lines.filter((l) => l.made_to_order).reduce((s, l) => s + l.quantity, 0);
  return { lines, mtoQty };
}

/** "Training Shirt (28) x1, Academy Cap (One Size) x2": for Stripe, the dashboard and receipts. */
export function sizeSummary(lines, max = 500) {
  const text = lines
    .map((l) => `${l.product_name.replace(/^RRA Melbourne |^2026 Rajasthan Royals /, '')} (${l.size}) x${l.quantity}`)
    .join(', ');
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** Stripe line items: the catalogue prices, plus the made-to-order surcharge when shipping. */
export function stripeLineItems(lines, fulfillment, mtoQty) {
  const out = lines.map((l) => ({ price: l.price_id, quantity: l.quantity }));
  if (fulfillment !== 'pickup' && mtoQty > 0) {
    out.push({
      price_data: {
        currency: 'aud',
        unit_amount: MTO_SURCHARGE_CENTS,
        product_data: {
          name: 'Made-to-Order Delivery Surcharge',
          description: `Separate international delivery for ${mtoQty} made-to-order item${mtoQty > 1 ? 's' : ''}`,
        },
      },
      quantity: mtoQty,
    });
  }
  return out;
}

/**
 * The fulfilment method of a paid session. Our own metadata first: Stripe's session has no
 * shipping-rate label, which is why every order used to be saved as "standard".
 */
export function fulfilmentFromSession(session) {
  const m = session?.metadata?.fulfillment_method;
  if (FULFILMENT_METHODS.includes(m)) return m;
  const label = (session?.shipping_cost?.shipping_rate?.display_name || '').toLowerCase();
  if (label.includes('pickup')) return 'pickup';
  if (label.includes('express')) return 'express';
  return 'standard';
}

/** True when a stored items array already carries the family's sizes (so a sync must not replace it). */
export const itemsHaveSizes = (items) =>
  Array.isArray(items) && items.length > 0 && items.every((i) => typeof i?.size === 'string' && i.size.trim() !== '');

/** Refund state for the shop tables from a Stripe charge. */
export function refundStatus(charge) {
  if (!charge?.amount_refunded) return null;
  return charge.amount_refunded >= charge.amount ? 'refunded' : 'partially_refunded';
}

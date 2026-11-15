import { describe, it, expect } from 'vitest';
import {
  validateCart, sizeSummary, stripeLineItems, fulfilmentFromSession, itemsHaveSizes, refundStatus, SHOP_PRODUCTS,
} from './shopOrder.js';

const shirt = { product_id: 'training-shirt', size: 'JNR 28', quantity: 1 };

describe('validateCart', () => {
  it('keeps the size on every line and takes the price id from the server', () => {
    const r = validateCart({ items: [shirt, { product_id: 'pink-cap', quantity: 2 }], fulfillment: 'pickup', pickupVenue: 'mickleham' });
    expect(r.error).toBeUndefined();
    expect(r.lines.map((l) => l.size)).toEqual(['JNR 28', 'One Size']);
    expect(r.lines[0].price_id).toBe(SHOP_PRODUCTS['training-shirt'].priceId);
  });
  it('refuses a sized product with no size', () => {
    expect(validateCart({ items: [{ product_id: 'training-pants', quantity: 1 }], fulfillment: 'standard' }).error).toMatch(/size/);
  });
  it('refuses pickup without one of the current venues', () => {
    expect(validateCart({ items: [shirt], fulfillment: 'pickup' }).error).toMatch(/venue/);
    expect(validateCart({ items: [shirt], fulfillment: 'pickup', pickupVenue: 'bundoora' }).error).toMatch(/venue/);
  });
  it('refuses unknown products, bad quantities and unknown delivery', () => {
    expect(validateCart({ items: [{ product_id: 'x', size: 'M', quantity: 1 }], fulfillment: 'standard' }).error).toMatch(/Unknown/);
    expect(validateCart({ items: [{ ...shirt, quantity: 0 }], fulfillment: 'standard' }).error).toMatch(/Quantity/);
    expect(validateCart({ items: [{ ...shirt, quantity: 1.5 }], fulfillment: 'standard' }).error).toMatch(/Quantity/);
    expect(validateCart({ items: [shirt], fulfillment: 'drone' }).error).toBeTruthy();
    expect(validateCart({ items: [], fulfillment: 'standard' }).error).toBeTruthy();
  });
  it('counts made-to-order items on the server', () => {
    const r = validateCart({ items: [{ product_id: 'fleece-jacket', size: 'M', quantity: 2 }, shirt], fulfillment: 'standard' });
    expect(r.mtoQty).toBe(2);
  });
});

describe('stripeLineItems', () => {
  const { lines, mtoQty } = validateCart({ items: [{ product_id: 'fleece-jacket', size: 'M', quantity: 2 }], fulfillment: 'standard' });
  it('adds the made-to-order surcharge only when shipping', () => {
    expect(stripeLineItems(lines, 'standard', mtoQty)).toHaveLength(2);
    expect(stripeLineItems(lines, 'standard', mtoQty)[1].quantity).toBe(2);
    expect(stripeLineItems(lines, 'pickup', mtoQty)).toHaveLength(1);
  });
});

describe('sizeSummary', () => {
  it('lists product, size and quantity, within Stripe metadata limits', () => {
    const { lines } = validateCart({ items: [shirt], fulfillment: 'standard' });
    expect(sizeSummary(lines)).toBe('Training Shirt (JNR 28) x1');
    const many = Array.from({ length: 40 }, () => lines[0]);
    expect(sizeSummary(many).length).toBeLessThanOrEqual(500);
  });
});

describe('fulfilmentFromSession', () => {
  it('reads our metadata first (Stripe has no rate label on the session)', () => {
    expect(fulfilmentFromSession({ metadata: { fulfillment_method: 'pickup' }, shipping_cost: { shipping_rate: 'shr_x' } })).toBe('pickup');
    expect(fulfilmentFromSession({ metadata: {}, shipping_cost: { shipping_rate: { display_name: 'Express Shipping' } } })).toBe('express');
    expect(fulfilmentFromSession({})).toBe('standard');
  });
});

describe('itemsHaveSizes / refundStatus', () => {
  it('spots stored items that carry sizes', () => {
    expect(itemsHaveSizes([{ size: '28' }])).toBe(true);
    expect(itemsHaveSizes([{ name: 'Shirt' }])).toBe(false);
    expect(itemsHaveSizes([])).toBe(false);
  });
  it('tells full from partial refunds', () => {
    expect(refundStatus({ amount: 6495, amount_refunded: 6495 })).toBe('refunded');
    expect(refundStatus({ amount: 6495, amount_refunded: 2000 })).toBe('partially_refunded');
    expect(refundStatus({ amount: 6495, amount_refunded: 0 })).toBeNull();
  });
});

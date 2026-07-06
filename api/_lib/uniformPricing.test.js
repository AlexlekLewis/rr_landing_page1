import { describe, it, expect } from 'vitest';
import { buildUniformLineItems, freeKeysForOffer } from './uniformPricing.js';

const BLOCK_FEE_CENTS = 98900; // must match api/power-game-checkout.js

describe('freeKeysForOffer', () => {
  it('resolves the mickleham early-bird offer to shirt + shorts', () => {
    expect(freeKeysForOffer('mickleham')).toEqual({ id: 'mickleham', keys: ['shirt', 'shorts'] });
  });
  it('is case/space-insensitive', () => {
    expect(freeKeysForOffer('  MICKLEHAM ').id).toBe('mickleham');
  });
  it('returns no gift for unknown or missing offers', () => {
    expect(freeKeysForOffer('bogus')).toEqual({ id: '', keys: [] });
    expect(freeKeysForOffer(undefined)).toEqual({ id: '', keys: [] });
    expect(freeKeysForOffer('')).toEqual({ id: '', keys: [] });
  });
});

describe('buildUniformLineItems — mickleham free shirt + shorts', () => {
  const { keys } = freeKeysForOffer('mickleham');

  it('charges $0 for shirt + shorts so the program total stays exactly $989', () => {
    const r = buildUniformLineItems([{ key: 'shirt', size: 'L' }, { key: 'shorts', size: 'L' }], keys);
    expect(r.totalCents).toBe(0);
    expect(BLOCK_FEE_CENTS + r.totalCents).toBe(98900);
  });

  it('still sends both garments to Stripe as $0 line items (tracked, not dropped)', () => {
    const r = buildUniformLineItems([{ key: 'shirt', size: 'L' }, { key: 'shorts', size: 'L' }], keys);
    expect(r.lineItems).toHaveLength(2);
    expect(r.lineItems.every((li) => li.price_data.unit_amount === 0)).toBe(true);
    expect(r.giftedKeys).toEqual(['shirt', 'shorts']);
    expect(r.giftSummary).toMatch(/Shirt/);
    expect(r.giftSummary).toMatch(/Shorts/);
  });

  it('charges the normal price for anything extra they need to play', () => {
    const r = buildUniformLineItems([{ key: 'shirt', size: 'L' }, { key: 'shorts', size: 'L' }, { key: 'pants', size: '32' }], keys);
    expect(r.totalCents).toBe(3700); // pants only
    expect(BLOCK_FEE_CENTS + r.totalCents).toBe(98900 + 3700);
    expect(r.lineItems).toHaveLength(3);
  });

  it('does not gift a garment outside the offer, even if asked (server is authoritative)', () => {
    const r = buildUniformLineItems([{ key: 'jacket', size: 'L' }], keys);
    expect(r.totalCents).toBe(4900);
    expect(r.giftedKeys).toEqual([]);
  });
});

describe('buildUniformLineItems — no offer (unchanged behaviour)', () => {
  it('charges full price when no free keys are passed', () => {
    const r = buildUniformLineItems([{ key: 'shirt', size: 'M' }, { key: 'shorts', size: 'M' }]);
    expect(r.totalCents).toBe(2995 + 3500);
    expect(r.giftedKeys).toEqual([]);
    expect(r.giftSummary).toBe('');
  });
});

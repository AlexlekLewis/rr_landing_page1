// ============================================================
// Server-authoritative Power Game uniform pricing. The browser sends only an
// array of { key, size } picks — the PRICE is decided here, never trusted from
// the client, so a tampered request can't change what's charged for kit.
//
// Keep these prices in sync with the on-page display table in
// src/components/power-game/returning/ExpressSignup.jsx (UNIFORM).
// ============================================================

export const UNIFORM_CATALOG = {
  shirt:  { label: 'Royals Academy Training Shirt',  priceCents: 2995 },
  shorts: { label: 'Royals Academy Training Shorts', priceCents: 3500 },
  pants:  { label: 'Royals Academy Training Pants',  priceCents: 3700 },
  cap:    { label: 'Royals Academy Cap',             priceCents: 2500, oneSize: true },
  jacket: { label: 'Royals Academy Fleece Jacket',   priceCents: 4900 },
};

// ── Gift offers ────────────────────────────────────────────────────────────
// Shared-link early-bird deals where specific garments are FREE. The offer id
// travels from the client (?gift=<id>) but the SERVER decides which keys are
// free, so a tampered request can only ask for a known offer — never invent one.
// Keep this map in sync with the client mirror in ExpressSignup.jsx (GIFT_OFFERS).
export const GIFT_OFFERS = {
  mickleham: ['shirt', 'shorts'], // Mickleham early-bird offer: free shirt + shorts
};

// Resolve a client-supplied offer id to { id, keys }. Unknown/blank → no gift.
export function freeKeysForOffer(offerId) {
  const id = typeof offerId === 'string' ? offerId.trim().toLowerCase() : '';
  return GIFT_OFFERS[id] ? { id, keys: GIFT_OFFERS[id] } : { id: '', keys: [] };
}

// ── Scholarship offers ──────────────────────────────────────────────────────
// A UNIQUE per-player link (?s=<token>) discounts the PROGRAM only (any tier —
// 20%, 50%, …). The token's discounted price AND single-use state live entirely
// in the pgp_scholarship_prefill table (Supabase), read server-side by
// api/pgp-scholarship + api/power-game-checkout. Adding a scholarship is a data
// insert, no code change. Kit is always charged at full price on top.

/**
 * uniformItems: [{ key, size }] → Stripe line_items + total (server prices only).
 * Unknown keys, duplicates, and non-one-size items without a size are dropped.
 *
 * freeKeys: garment keys that are gifted for this order — they still travel to
 * Stripe as real line items (so the receipt shows them) but at $0, and they are
 * excluded from the charged total. giftSummary/giftedKeys report what was gifted.
 */
export function buildUniformLineItems(uniformItems, freeKeys = []) {
  const empty = { lineItems: [], totalCents: 0, summary: '', giftSummary: '', giftedKeys: [] };
  if (!Array.isArray(uniformItems)) return empty;
  const free = new Set(Array.isArray(freeKeys) ? freeKeys : []);
  const lineItems = [];
  const summaryParts = [];
  const giftParts = [];
  const giftedKeys = [];
  let totalCents = 0;
  const seen = new Set();
  for (const it of uniformItems) {
    const key = it && typeof it.key === 'string' ? it.key : '';
    const cat = UNIFORM_CATALOG[key];
    if (!cat || seen.has(key)) continue;
    const size = cat.oneSize ? 'One size' : String((it && it.size) || '').trim().slice(0, 40);
    if (!cat.oneSize && !size) continue; // a sized garment needs a size
    seen.add(key);
    const isGift = free.has(key);
    const unitAmount = isGift ? 0 : cat.priceCents;
    lineItems.push({
      price_data: {
        currency: 'aud',
        product_data: { name: isGift ? `${cat.label} — early-bird gift` : cat.label, description: `Size: ${size}` },
        unit_amount: unitAmount,
      },
      quantity: 1,
    });
    summaryParts.push(`${cat.label} (${size})${isGift ? ' — gift' : ''}`);
    if (isGift) { giftParts.push(`${cat.label} (${size})`); giftedKeys.push(key); }
    totalCents += unitAmount;
  }
  return {
    lineItems,
    totalCents,
    summary: summaryParts.join(', '),
    giftSummary: giftParts.join(', '),
    giftedKeys,
  };
}

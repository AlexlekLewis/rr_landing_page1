// ============================================================
// Server-authoritative Power Game uniform pricing. The browser sends only an
// array of { key, size } picks — the PRICE is decided here, never trusted from
// the client, so a tampered request can't change what's charged for kit.
//
// Keep these prices in sync with the on-page display table in
// src/components/power-game/returning/ReturningSignup.jsx (UNIFORM).
// ============================================================

export const UNIFORM_CATALOG = {
  shirt:  { label: 'Royals Academy Training Shirt',  priceCents: 2995 },
  shorts: { label: 'Royals Academy Training Shorts', priceCents: 3500 },
  pants:  { label: 'Royals Academy Training Pants',  priceCents: 3700 },
  cap:    { label: 'Royals Academy Cap',             priceCents: 2500, oneSize: true },
  jacket: { label: 'Royals Academy Fleece Jacket',   priceCents: 4900 },
};

/**
 * uniformItems: [{ key, size }] → Stripe line_items + total (server prices only).
 * Unknown keys, duplicates, and non-one-size items without a size are dropped.
 */
export function buildUniformLineItems(uniformItems) {
  if (!Array.isArray(uniformItems)) return { lineItems: [], totalCents: 0, summary: '' };
  const lineItems = [];
  const summaryParts = [];
  let totalCents = 0;
  const seen = new Set();
  for (const it of uniformItems) {
    const key = it && typeof it.key === 'string' ? it.key : '';
    const cat = UNIFORM_CATALOG[key];
    if (!cat || seen.has(key)) continue;
    const size = cat.oneSize ? 'One size' : String((it && it.size) || '').trim().slice(0, 40);
    if (!cat.oneSize && !size) continue; // a sized garment needs a size
    seen.add(key);
    lineItems.push({
      price_data: {
        currency: 'aud',
        product_data: { name: cat.label, description: `Size: ${size}` },
        unit_amount: cat.priceCents,
      },
      quantity: 1,
    });
    summaryParts.push(`${cat.label} (${size})`);
    totalCents += cat.priceCents;
  }
  return { lineItems, totalCents, summary: summaryParts.join(', ') };
}

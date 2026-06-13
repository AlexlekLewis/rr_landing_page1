// ============================================================
// kit.ts — Power Game uniform/kit add-on for the apply funnel.
// Players MUST purchase at least a Training Shirt (with a size).
// Hat, Jacket, Shorts and Pants are optional add-ons.
// Prices below are SPECIAL first-time-participant prices (in cents).
//
// ⚠️ PLACEHOLDER PRICES — replace `priceCents` for each item with the
// confirmed first-time-participant pricing, then (for live Stripe) add a
// matching one-off Price ID per item/size in the Stripe Dashboard.
// ============================================================

export const KIT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type KitSize = (typeof KIT_SIZES)[number] | 'OS';

export interface KitItem {
  id: 'shirt' | 'shorts' | 'pants' | 'hat' | 'jacket';
  name: string;
  priceCents: number;      // special first-time price (PLACEHOLDER)
  required: boolean;       // shirt is mandatory
  oneSize?: boolean;       // hat = one size
  note?: string;
}

// Order: required item first, then optional add-ons.
export const KIT_ITEMS: KitItem[] = [
  { id: 'shirt',  name: 'Royals Academy Training Shirt',  priceCents: 0, required: false, note: 'The core training top — skip it if you already have one.' },
  { id: 'shorts', name: 'Royals Academy Training Shorts', priceCents: 0, required: false },
  { id: 'pants',  name: 'Royals Academy Training Pants',  priceCents: 0, required: false },
  { id: 'hat',    name: 'Royals Academy Cap',             priceCents: 0, required: false, oneSize: true },
  { id: 'jacket', name: 'Royals Academy Fleece Jacket',   priceCents: 0, required: false, note: 'Runs small — consider ordering one size up.' },
];

export const KIT_BY_ID: Record<string, KitItem> = Object.fromEntries(KIT_ITEMS.map((i) => [i.id, i]));

// A selection maps item id -> chosen size ('' = not selected).
export type KitSelection = Record<string, string>;

export const BLANK_KIT: KitSelection = { shirt: '', shorts: '', pants: '', hat: '', jacket: '' };

/** Kit is optional — players who already own their gear can skip every item. */
export function kitValid(_sel: KitSelection): boolean {
  return true;
}

/** Sum of selected items (only items with a chosen size are counted). */
export function kitTotalCents(sel: KitSelection): number {
  return KIT_ITEMS.reduce((sum, item) => {
    const chosen = sel[item.id];
    return chosen && chosen.trim() ? sum + item.priceCents : sum;
  }, 0);
}

/** Human-readable summary lines for the chosen kit. */
export function kitSummary(sel: KitSelection): { name: string; size: string; priceCents: number }[] {
  return KIT_ITEMS.filter((i) => sel[i.id] && sel[i.id].trim()).map((i) => ({
    name: i.name,
    size: i.oneSize ? 'One size' : sel[i.id],
    priceCents: i.priceCents,
  }));
}

export const fmtAud = (cents: number) => `$${(cents / 100).toFixed(2)}`;

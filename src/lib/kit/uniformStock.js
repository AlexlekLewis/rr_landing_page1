// Uniform dashboard rules (/rramadmin_26/uniforms). Pure functions so they can be tested.
// Stock = store_stock_moves summed per size (store_stock_position). See supabase/migrations/20261119000000_uniform_dashboard.sql.

/** Movement types staff can record by hand. sign: +1 adds to stock, -1 takes away. */
export const MOVE_TYPES = [
  { reason: 'receipt', label: 'Received from supplier', sign: 1 },
  { reason: 'sale', label: 'Sold (paid on the day)', sign: -1 },
  { reason: 'handover', label: 'Given out free (coach, umpire, staff)', sign: -1 },
  { reason: 'return', label: 'Returned / swapped back', sign: 1 },
  { reason: 'write_off', label: 'Damaged or lost', sign: -1 },
];

export const STATUS_LABELS = {
  to_hand_out: 'To hand out',
  size_needed: 'Size needed',
  handed_out: 'Handed out',
  unpaid: 'Not paid',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const SOURCE_LABELS = {
  entitlement: 'Program shirt',
  kit_order: 'Squad kit order',
  shop_order: 'Shop order',
  power_game: 'Power Game kit',
};

/**
 * One block per product, each with its sizes in order and the stock figures for each size.
 * products: store_products rows; variants: store_variants rows; positions: store_stock_position rows.
 */
export function buildStockGrid(products, variants, positions) {
  const pos = new Map((positions || []).map((p) => [p.variant_id, p]));
  return (products || [])
    .filter((p) => !p.archived_at && p.status !== 'archived')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name))
    .map((p) => {
      const sizes = (variants || [])
        .filter((v) => v.product_id === p.id && v.is_active !== false && !v.archived_at)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((v) => {
          const s = pos.get(v.id) || {};
          return {
            variant_id: v.id,
            size_label: v.size_label,
            size_group: v.size_group,
            on_hand: s.on_hand ?? 0,
            committed: s.committed ?? 0,
            free: s.free ?? (s.on_hand ?? 0) - (s.committed ?? 0),
          };
        });
      const total = (k) => sizes.reduce((n, r) => n + (r[k] || 0), 0);
      return { product_id: p.id, slug: p.slug, name: p.name, sizes, on_hand: total('on_hand'), committed: total('committed') };
    });
}

/**
 * The adjustment rows a stock take creates: one per size whose counted number differs from what the list says.
 * counts: { [variant_id]: number | '' } (blank = not counted, left alone).
 */
export function stockTakeMoves(sizes, counts, { who, date, locationId }) {
  const moves = [];
  for (const s of sizes) {
    const raw = counts?.[s.variant_id];
    if (raw === '' || raw == null) continue;
    const counted = Number(raw);
    if (!Number.isInteger(counted) || counted < 0) throw new Error(`Count for ${s.size_label} must be a whole number`);
    const diff = counted - (s.on_hand || 0);
    if (diff === 0) continue;
    moves.push({
      variant_id: s.variant_id,
      location_id: locationId,
      qty: diff,
      reason: 'adjustment',
      note: `Stock take ${date}: counted ${counted} (list said ${s.on_hand || 0})${who ? `, by ${who}` : ''}`,
    });
  }
  return moves;
}

/** A hand-entered movement, validated. */
export function manualMove({ variantId, reason, qty, note, who, locationId }) {
  const type = MOVE_TYPES.find((t) => t.reason === reason);
  if (!type) throw new Error('Choose what happened');
  if (!variantId) throw new Error('Choose a size');
  const n = Number(qty);
  if (!Number.isInteger(n) || n < 1) throw new Error('Quantity must be 1 or more');
  return {
    variant_id: variantId,
    location_id: locationId,
    qty: type.sign * n,
    reason,
    note: [note?.trim(), who ? `by ${who}` : null].filter(Boolean).join(' · ') || type.label,
  };
}

const norm = (s) => (s || '').toString().toLowerCase();

/** Free-text search over a uniform line: player, parent, email, phone, product, size, program, centre. */
export function lineMatches(line, query) {
  const q = norm(query).trim();
  if (!q) return true;
  const hay = [line.player, line.contact, line.email, line.phone, line.product_name, line.size_label, line.program, line.centre]
    .map(norm)
    .join(' | ');
  return q.split(/\s+/).every((word) => hay.includes(word));
}

/** Lines grouped by player (name + email), newest order first. */
export function groupByPlayer(lines) {
  const groups = new Map();
  for (const l of lines) {
    const key = `${norm(l.player)}|${norm(l.email)}`;
    if (!groups.has(key)) groups.set(key, { key, player: l.player || '(no name)', email: l.email, contact: l.contact, phone: l.phone, lines: [] });
    groups.get(key).lines.push(l);
  }
  const latest = (g) => Math.max(...g.lines.map((l) => new Date(l.ordered_at || 0).getTime()));
  return [...groups.values()].sort((a, b) => latest(b) - latest(a));
}

/** Counts for the summary tiles. */
export function lineSummary(lines) {
  const out = { to_hand_out: 0, size_needed: 0, handed_out: 0, unpaid: 0 };
  for (const l of lines) if (l.status in out) out[l.status] += l.qty || 1;
  return out;
}

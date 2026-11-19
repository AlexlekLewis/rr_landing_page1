import { describe, it, expect } from 'vitest';
import { buildStockGrid, stockTakeMoves, manualMove, lineMatches, groupByPlayer, lineSummary } from './uniformStock.js';

const products = [
  { id: 'p2', slug: 'training-shorts', name: 'Training Shorts', sort_order: 2, status: 'active' },
  { id: 'p1', slug: 'training-shirt', name: 'Training Shirt', sort_order: 1, status: 'active' },
  { id: 'p3', slug: 'ipl', name: 'IPL Shirt', sort_order: 0, status: 'archived' },
];
const variants = [
  { id: 'v2', product_id: 'p1', size_label: 'M (40)', sort_order: 103 },
  { id: 'v1', product_id: 'p1', size_label: 'S (38)', sort_order: 102 },
  { id: 'v3', product_id: 'p2', size_label: 'S', sort_order: 101 },
];
const positions = [{ variant_id: 'v1', on_hand: 3, committed: 2, free: 1 }];

describe('buildStockGrid', () => {
  const grid = buildStockGrid(products, variants, positions);
  it('drops archived products and orders products and sizes', () => {
    expect(grid.map((g) => g.slug)).toEqual(['training-shirt', 'training-shorts']);
    expect(grid[0].sizes.map((s) => s.size_label)).toEqual(['S (38)', 'M (40)']);
  });
  it('fills stock figures, zero where nothing is recorded', () => {
    expect(grid[0].sizes[0]).toMatchObject({ on_hand: 3, committed: 2, free: 1 });
    expect(grid[0].sizes[1]).toMatchObject({ on_hand: 0, committed: 0, free: 0 });
    expect(grid[0].on_hand).toBe(3);
  });
});

describe('stockTakeMoves', () => {
  const sizes = [
    { variant_id: 'v1', size_label: 'S (38)', on_hand: 3 },
    { variant_id: 'v2', size_label: 'M (40)', on_hand: 0 },
    { variant_id: 'v4', size_label: 'L (42)', on_hand: 5 },
  ];
  it('creates one adjustment per size that differs, skipping blanks and matches', () => {
    const moves = stockTakeMoves(sizes, { v1: '1', v2: '4', v4: '' }, { who: 'andy', date: '19/11/2026', locationId: 'hq' });
    expect(moves.map((m) => [m.variant_id, m.qty])).toEqual([['v1', -2], ['v2', 4]]);
    expect(moves[0].note).toContain('counted 1 (list said 3)');
    expect(stockTakeMoves(sizes, { v1: '3' }, { date: 'x' })).toEqual([]);
  });
  it('rejects counts that are not whole numbers', () => {
    expect(() => stockTakeMoves(sizes, { v1: '2.5' }, { date: 'x' })).toThrow();
    expect(() => stockTakeMoves(sizes, { v1: '-1' }, { date: 'x' })).toThrow();
  });
});

describe('manualMove', () => {
  it('signs the quantity by movement type', () => {
    expect(manualMove({ variantId: 'v1', reason: 'receipt', qty: '6' }).qty).toBe(6);
    expect(manualMove({ variantId: 'v1', reason: 'handover', qty: 1, note: 'coach' }).qty).toBe(-1);
  });
  it('needs a size, a type and a positive whole quantity', () => {
    expect(() => manualMove({ reason: 'sale', qty: 1 })).toThrow();
    expect(() => manualMove({ variantId: 'v1', reason: 'nope', qty: 1 })).toThrow();
    expect(() => manualMove({ variantId: 'v1', reason: 'sale', qty: 0 })).toThrow();
  });
});

const lines = [
  { player: 'Riya Shah', email: 'shah@example.com', product_name: 'Training Shirt', size_label: '28', program: 'Junior Royals', centre: 'mickleham', status: 'to_hand_out', qty: 1, ordered_at: '2026-10-01' },
  { player: 'Riya Shah', email: 'shah@example.com', product_name: 'Training Shorts', size_label: '24', program: 'Power Game', status: 'handed_out', qty: 1, ordered_at: '2026-11-01' },
  { player: 'Tom Lee', email: 'lee@example.com', product_name: 'Cap', size_label: 'One size', status: 'unpaid', qty: 2, ordered_at: '2026-09-01' },
];

describe('search and grouping', () => {
  it('matches every word anywhere in the line', () => {
    expect(lines.filter((l) => lineMatches(l, 'riya shirt')).length).toBe(1);
    expect(lines.filter((l) => lineMatches(l, 'mickleham')).length).toBe(1);
    expect(lines.filter((l) => lineMatches(l, '')).length).toBe(3);
  });
  it('groups by player, newest first, and counts statuses', () => {
    const g = groupByPlayer(lines);
    expect(g.map((x) => x.player)).toEqual(['Riya Shah', 'Tom Lee']);
    expect(g[0].lines).toHaveLength(2);
    expect(lineSummary(lines)).toEqual({ to_hand_out: 1, size_needed: 0, handed_out: 1, unpaid: 2 });
  });
});

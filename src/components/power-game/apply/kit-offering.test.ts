import { describe, it, expect } from 'vitest';
import { TOPS_SIZES, SHORTS_SIZES, PANTS_SIZES, JACKET_SIZES } from '../../academy-shop/sizeData';

// Mirrors ApplyFlow's KIT_ITEMS_UI offering rule: a garment is only offered if it's
// one-size OR has at least one size for the player's age group. This guards the live
// bug where a JUNIOR who ticked the Fleece Jacket (JACKET_SIZES.junior === null) could
// never pick a size, so the "Continue" button stayed permanently disabled (dead-end).
const KIT = (group: 'junior' | 'senior') => [
  { key: 'shirt', sizes: TOPS_SIZES[group] || [] },
  { key: 'shorts', sizes: SHORTS_SIZES[group] || [] },
  { key: 'pants', sizes: PANTS_SIZES[group] || [] },
  { key: 'cap', oneSize: true, sizes: null as unknown as unknown[] },
  { key: 'jacket', sizes: JACKET_SIZES[group] || [] },
];
const offeredKeys = (group: 'junior' | 'senior') =>
  KIT(group)
    .filter((it) => it.oneSize || (Array.isArray(it.sizes) && it.sizes.length > 0))
    .map((it) => it.key);

describe('kit offering by age group (jacket dead-end guard)', () => {
  it('does NOT offer the Fleece Jacket to juniors (no junior sizes)', () => {
    expect(offeredKeys('junior')).toEqual(['shirt', 'shorts', 'pants', 'cap']);
    expect(offeredKeys('junior')).not.toContain('jacket');
  });

  it('offers the Fleece Jacket to seniors', () => {
    expect(offeredKeys('senior')).toContain('jacket');
  });

  it('every OFFERED garment is one-size or has at least one selectable size (no dead-end)', () => {
    for (const group of ['junior', 'senior'] as const) {
      const offered = offeredKeys(group);
      for (const item of KIT(group)) {
        if (!offered.includes(item.key)) continue;
        if (item.oneSize) continue;
        expect(Array.isArray(item.sizes) && item.sizes.length, `${group}/${item.key}`).toBeTruthy();
      }
    }
  });
});

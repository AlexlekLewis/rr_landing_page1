import { describe, it, expect } from 'vitest';
import { shirtError, shirtTag, needsShirt, suggestedSize, SHIRT_SIZES, TRAINING_SHIRT, EMPTY_SHIRT } from './trainingShirt';

// Andy, 9 Nov 2026: every paid program page makes a family without a shirt order one.
describe('mandatory training shirt', () => {
    it('blocks the booking until the question is answered, and a "no" until a size is picked', () => {
        expect(shirtError(EMPTY_SHIRT)).toMatch(/already has a training shirt/);
        expect(shirtError({ has: 'no', size: '' })).toMatch(/choose a shirt size/);
        expect(shirtError({ has: 'no', size: 'not-a-size' })).toMatch(/choose a shirt size/);
        expect(shirtError({ has: 'no', size: '28' })).toBeNull();
        expect(shirtError({ has: 'yes', size: '' })).toBeNull();
    });

    it('records the answer with the booking', () => {
        expect(shirtTag({ has: 'yes', size: '' })).toBe('|shirt=has');
        expect(shirtTag({ has: 'no', size: '28' })).toBe('|shirt=order-28');
        expect(shirtTag({ has: 'no', size: 'M (40)' })).toBe('|shirt=order-M');
        expect(needsShirt({ has: 'no' })).toBe(true);
        expect(needsShirt({ has: 'yes' })).toBe(false);
    });

    it('uses the shop sizes and price, and suggests a size by age', () => {
        expect(SHIRT_SIZES[0]).toBe('18');
        expect(SHIRT_SIZES).toContain('3XL (48)');
        expect(TRAINING_SHIRT.priceLabel).toBe('$29.95 incl. GST');
        expect(suggestedSize(8)).toBe('26');
        expect(suggestedSize(10)).toBe('28');
        expect(suggestedSize(12)).toBe('30');
        expect(suggestedSize('')).toBe('');
    });
});

describe('shirtCheckoutUrl', () => {
    it('sends "no shirt" families to the link with the shirt, and only "yes" to the other', async () => {
        const { shirtCheckoutUrl } = await import('./trainingShirt');
        const links = { withShirt: 'https://buy.stripe.com/WITH', noShirt: 'https://buy.stripe.com/WITHOUT' };
        expect(shirtCheckoutUrl(links, { has: 'no', size: '28' }, { id: 'r1', email: 'a@b.co' })).toBe('https://buy.stripe.com/WITH?client_reference_id=r1&prefilled_email=a%40b.co');
        expect(shirtCheckoutUrl(links, { has: 'yes' }, { id: 'r1' })).toBe('https://buy.stripe.com/WITHOUT?client_reference_id=r1');
        expect(shirtCheckoutUrl(links, { has: '' })).toBe('https://buy.stripe.com/WITH');
    });
});

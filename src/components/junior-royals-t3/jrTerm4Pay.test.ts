import { describe, it, expect } from 'vitest';
import { JR_T4, PAY_OPTIONS, PRICE, UPFRONT_LINK, WEEKLY_OPENS, weeklyOpen, WEEKLY_CONFIRMED } from './jrTerm4Data';
import { classifyJrT4 } from '../../../api/stripe-webhook.js';

// Alex, 19 Oct 2026: the official Term 4 payment options.
describe('Junior Royals Term 4 payments', () => {
    it('uses the official prices: $349 upfront, $44.95 a week, $29.95 shirt', () => {
        expect(PRICE).toEqual({ upfront: 349, weekly: 44.95, shirt: 29.95 });
        expect(PAY_OPTIONS.upfront.link).toBe(UPFRONT_LINK);
        expect(PAY_OPTIONS.upfront.detail).toContain('$10.60 less than paying weekly');
        expect(PAY_OPTIONS.weekly.detail).toContain('at most 8 payments, $359.60');
        expect(JR_T4.priceLine).toContain('incl. GST');
        expect(JR_T4.shirtLine).toContain('$29.95 incl. GST');
    });

    // "the stripe link for weekly payments is wrong" + "27th": weekly stays off
    // until Alex confirms the link, and never before Tue 27 Oct.
    it('keeps weekly off until the link is confirmed, and never before 27 Oct', () => {
        expect(WEEKLY_CONFIRMED).toBe(false);
        expect(weeklyOpen(new Date('2026-11-01T00:00:00+11:00'))).toBe(false);
        expect(WEEKLY_OPENS.toISOString()).toBe('2026-10-26T13:00:00.000Z');
    });

    it('Cranbourne North is 5:00pm – 7:00pm and Mickleham 6:00pm – 8:00pm', () => {
        const t = Object.fromEntries(JR_T4.centres.map((c) => [c.value, c.times]));
        expect(t).toEqual({ mickleham: '6:00pm – 8:00pm', 'cranbourne-north': '5:00pm – 7:00pm' });
        expect(JR_T4.monday.lead).toContain('Mickleham only');
    });

    it('the webhook files both products as Junior Royals Term 4, by plan', () => {
        expect(classifyJrT4([{ description: 'Rajasthan Royals Academy Term 4 Junior Royals - One-Off Payment' }, { description: 'Rajasthan Royals Academy Training Shirt (Participant Price)' }]))
            .toMatchObject({ program: 'junior_royals', program_variant: 'term_4_upfront' });
        expect(classifyJrT4([{ description: 'Rajasthan Royals Academy Term 4 Junior Royals - Weekly Payment' }]))
            .toMatchObject({ program_variant: 'term_4_weekly' });
        expect(classifyJrT4([{ description: '2026 Junior Royals Program - Term 3: Hallam' }])).toBeNull();
    });
});

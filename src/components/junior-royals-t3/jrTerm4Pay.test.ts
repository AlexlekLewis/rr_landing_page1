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

    // Alex, 19 Oct 2026: "I want to move Mickleham TO mondays 5-7pm" (26 Oct – 14 Dec).
    it('Mickleham runs Mondays and Cranbourne North Wednesdays, both 5:00pm – 7:00pm', () => {
        const t = Object.fromEntries(JR_T4.centres.map((c) => [c.value, [c.day, c.times, c.datesShort, c.firstSessionLong]]));
        expect(t).toEqual({
            mickleham: ['monday', '5:00pm – 7:00pm', '26 Oct – 14 Dec', 'Monday 26 October'],
            'cranbourne-north': ['wednesday', '5:00pm – 7:00pm', '28 Oct – 16 Dec', 'Wednesday 28 October'],
        });
        expect(JR_T4.factLine).toContain('Mondays at Mickleham, Wednesdays at Cranbourne North');
        expect('monday' in JR_T4).toBe(false); // no Monday enquiry any more
    });

    it('the webhook files both products as Junior Royals Term 4, by plan', () => {
        expect(classifyJrT4([{ description: 'Rajasthan Royals Academy Term 4 Junior Royals - One-Off Payment' }, { description: 'Rajasthan Royals Academy Training Shirt (Participant Price)' }]))
            .toMatchObject({ program: 'junior_royals', program_variant: 'term_4_upfront' });
        expect(classifyJrT4([{ description: 'Rajasthan Royals Academy Term 4 Junior Royals - Weekly Payment' }]))
            .toMatchObject({ program_variant: 'term_4_weekly' });
        expect(classifyJrT4([{ description: '2026 Junior Royals Program - Term 3: Hallam' }])).toBeNull();
        expect(PAY_OPTIONS.upfront.detail).toContain('Afterpay');
    });
});

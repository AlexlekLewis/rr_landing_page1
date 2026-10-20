import { describe, it, expect } from 'vitest';
import { JR_T4, PAY_OPTIONS, PRICE, UPFRONT_LINK, WEEKLY_OPENS, weeklyOpen, WEEKLY_CONFIRMED } from './jrTerm4Data';
import { classifyJrT4 } from '../../../api/stripe-webhook.js';

// Alex, 19 Oct 2026: the official Term 4 payment options.
describe('Junior Royals Term 4 payments', () => {
    it('uses the official prices: $349 upfront, $44.95 a week, $29.95 shirt', () => {
        expect(PRICE).toEqual({ upfront: 349, weekly: 44.95, shirt: 29.95 });
        expect(PAY_OPTIONS.upfront.link).toBe(UPFRONT_LINK);
        expect(PAY_OPTIONS.upfront.detail).toContain('$10.60 less than paying weekly');
        expect(PAY_OPTIONS.weekly.detail).toContain('8 weeks is $359.60');
        expect(JR_T4.priceLine).toContain('incl. GST');
        expect(JR_T4.shirtLine).toContain('$29.95 incl. GST');
    });

    // Alex, 20 Oct 2026: "these links are fine … make sure the copy reflects the 2 payment
    // options". Weekly is confirmed and opens on Tue 27 Oct (his "27th").
    it('shows both ways to pay; weekly opens on 27 Oct', () => {
        expect(WEEKLY_CONFIRMED).toBe(true);
        expect(weeklyOpen(new Date('2026-10-26T23:59:00+11:00'))).toBe(false);
        expect(weeklyOpen(new Date('2026-10-27T00:00:00+11:00'))).toBe(true);
        expect(JR_T4.priceLine).toContain('$349 upfront for all 8 weeks, or $44.95 a week');
        expect(JR_T4.priceLineBeforeWeekly).toContain('from Tuesday 27 October');
    });

    // "automatic enrolment into the next term (opt out) … we will be in touch to confirm.
    // Direct debits will be cancelled at the end of the term and restart at the beginning."
    it('says enrolment carries on (opt-out), we confirm, and direct debits stop and restart', () => {
        const all = JR_T4.renewLines.join(' ');
        expect(all).toContain('unless you opt out');
        expect(all).toContain('be in touch');
        expect(all).toContain('cancelled at the end of each term and start again');
        expect(all).toContain('at least 2 weeks before the next term');
        expect(PAY_OPTIONS.weekly.detail).toContain('direct debit');
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

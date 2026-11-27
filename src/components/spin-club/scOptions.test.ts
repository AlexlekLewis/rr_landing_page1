import { describe, it, expect } from 'vitest';
import { NIGHT_DATES, CHRISTMAS_BREAK, START_DATE } from './scOptions';

// 27 Nov 2026: the first draft listed 3/10/17 Dec and 28 Jan — all Thursdays.
describe('Spin Club nights', () => {
    it('every night is a Wednesday', () => {
        for (const n of NIGHT_DATES) {
            const [y, m, d] = n.iso.split('-').map(Number);
            expect(new Date(y, m - 1, d).getDay(), n.iso).toBe(3);
        }
    });
    it('labels match their dates', () => {
        for (const n of NIGHT_DATES) {
            const [y, m, d] = n.iso.split('-').map(Number);
            const label = `${d} ${new Date(y, m - 1, d).toLocaleString('en-AU', { month: 'long' })}`;
            expect(n.label).toBe(label);
        }
    });
    it('the break and start lines use dates that are on the list', () => {
        const labels = NIGHT_DATES.map((n) => `Wednesday ${n.label}`);
        expect(labels).toContain(START_DATE);
        expect(labels).toContain(CHRISTMAS_BREAK.lastNight);
        expect(labels).toContain(CHRISTMAS_BREAK.backOn);
    });
});

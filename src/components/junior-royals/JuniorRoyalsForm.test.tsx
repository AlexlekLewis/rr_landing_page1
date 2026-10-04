import { describe, it, expect } from 'vitest';
import { ageAtStart } from './JuniorRoyalsForm';
import { AGES, CENTRES, FEES, YEARLY, PER_HOUR, SESSIONS_PER_YEAR, CALENDAR } from './juniorRoyalsData';

// Junior Royals is ages 7–12 (Alex, 5 Oct 2026). Age is taken on the later of
// today and the first session (Wed 28 Oct 2026) — the age the player starts at.
describe('Junior Royals age check', () => {
    const before = new Date('2026-10-05T10:00:00');

    it('uses the first session date when it is still ahead', () => {
        // Turns 13 on 20 Oct 2026, so is 13 by the first session.
        expect(ageAtStart('2013-10-20', before)).toBe(13);
        // Turns 13 on 29 Oct 2026, so is still 12 at the first session.
        expect(ageAtStart('2013-10-29', before)).toBe(12);
    });

    it('uses today once the first session has passed', () => {
        expect(ageAtStart('2013-10-29', new Date('2026-11-05T10:00:00'))).toBe(13);
    });

    it('allows 7 to 12 and nothing outside it', () => {
        const ok = (dob: string) => {
            const a = ageAtStart(dob, before)!;
            return a >= AGES.min && a <= AGES.max;
        };
        expect(ok('2019-10-28')).toBe(true);   // 7 on the day
        expect(ok('2019-10-29')).toBe(false);  // still 6
        expect(ok('2014-01-01')).toBe(true);   // 12
        expect(ok('2013-01-01')).toBe(false);  // 13 → Performance Squads
    });

    it('returns null for a date it cannot read', () => {
        expect(ageAtStart('not-a-date', before)).toBeNull();
    });
});

describe('Junior Royals facts agree with each other', () => {
    it('the yearly fee is 52 weekly payments', () => {
        expect(YEARLY).toBe(FEES.weekly * 52);
    });

    it('sessions per year matches the 2027 school-term calendar', () => {
        const y2027 = CALENDAR.filter((c) => c.label.includes('2027')).reduce((n, c) => n + c.sessions, 0);
        expect(y2027).toBe(SESSIONS_PER_YEAR);
    });

    it('the per-hour figure is the yearly fee over the sessions, rounded', () => {
        expect(PER_HOUR).toBe(Math.round(YEARLY / SESSIONS_PER_YEAR));
    });

    it('offers exactly the two Term 4 centres, with the values the database must accept', () => {
        // If these change, the hourly watchdog test-inserts and the table must change too.
        expect(CENTRES.map((c) => c.value)).toEqual(['mickleham', 'cranbourne-north']);
    });
});

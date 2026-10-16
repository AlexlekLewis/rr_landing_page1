import { describe, it, expect } from 'vitest';
import { ageAtStart } from './JuniorRoyalsForm';
import {
    AGES, CENTRES, CALENDAR, SESSIONS_PER_YEAR, MEMBER, MEMBER_WEEKLY, MEMBER_YEARLY, MEMBER_FIRST_YEAR,
    FIRST_PAYMENT, termPrice, TERM_YEAR, PAY_CHOICES,
} from './juniorRoyalsData';

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

describe('Junior Royals prices agree with each other', () => {
    it('membership: $25 an hour over 40 sessions, paid as 52 weekly payments', () => {
        expect(MEMBER.perHour).toBe(25);
        expect(MEMBER_WEEKLY).toBe(19.23);
        expect(MEMBER_YEARLY).toBe(999.96);
        expect(Math.round(MEMBER_YEARLY / SESSIONS_PER_YEAR)).toBe(MEMBER.perHour);
        expect(MEMBER_FIRST_YEAR).toBe(1148.96);
        expect(FIRST_PAYMENT).toBe(168.23);
    });

    it('by the term: $35 a session, so a 10-week term is $350', () => {
        expect(termPrice(10)).toBe(350);
        expect(TERM_YEAR).toBe(1400);
    });

    it('sessions per year matches the 2027 school-term calendar', () => {
        const y2027 = CALENDAR.filter((c) => c.label.includes('2027')).reduce((n, c) => n + c.sessions, 0);
        expect(y2027).toBe(SESSIONS_PER_YEAR);
    });

    it('a member pays less than term-by-term for a full year, even in the first year', () => {
        expect(MEMBER_FIRST_YEAR).toBeLessThan(TERM_YEAR);
    });
});

describe('Junior Royals form values the database must accept', () => {
    // If these change, the hourly watchdog test-inserts and the table must change too.
    it('centres', () => {
        expect(CENTRES.map((c) => c.value)).toEqual(['mickleham', 'cranbourne-north']);
    });
    it('payment choices', () => {
        expect(PAY_CHOICES.map((c) => c.value)).toEqual(['membership', 'term', 'not-sure']);
    });
});

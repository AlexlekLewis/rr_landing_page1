import { describe, expect, it } from 'vitest';
import {
    OPEN_AGE_SESSION_ENDS,
    getUpcomingTrials,
    getUpcomingTrialsForCentre,
    isOpenAgeTrialOn,
    isSquadTrialBookable,
    joinDays,
    dayOf,
    timeOf,
} from './trialCalendar';
import { TRIAL_SESSIONS as OPEN_AGE_SESSIONS } from '../open-age-trial/openAgeData';
import { MEMBERSHIP, MEMBERSHIP_YEARLY, money, FAQS, MEMBER_PRICING_RULE, TOUR_MEMBER_MONTHS } from './data';

const at = (iso: string) => new Date(iso);

describe('trial dates on /performance-squads', () => {
    it('knows when every open age session finishes, so none can outlive its date', () => {
        for (const s of OPEN_AGE_SESSIONS) {
            expect(OPEN_AGE_SESSION_ENDS[s.id], `no finish time for ${s.id}`).toBeTruthy();
        }
    });

    it('lists both open age sessions before the weekend, soonest first', () => {
        const trials = getUpcomingTrials(at('2026-10-02T12:00:00+10:00'));
        expect(trials.map((t) => t.id)).toEqual(['oa-2026-10-04', 'oa-2026-10-05']);
        expect(isOpenAgeTrialOn(at('2026-10-02T12:00:00+10:00'))).toBe(true);
    });

    it('drops the Cranbourne North session once it has been played', () => {
        const now = at('2026-10-04T15:00:00+11:00');
        expect(getUpcomingTrials(now).map((t) => t.id)).toEqual(['oa-2026-10-05']);
        expect(getUpcomingTrialsForCentre('south-east-melbourne', now)).toEqual([]);
        expect(getUpcomingTrialsForCentre('north-melbourne', now)).toHaveLength(1);
    });

    it('shows no trial at all once the Mickleham session has finished', () => {
        const now = at('2026-10-05T19:00:00+11:00');
        expect(getUpcomingTrials(now)).toEqual([]);
        expect(isOpenAgeTrialOn(now)).toBe(false);
    });

    it('never offers a September squad trial for booking', () => {
        expect(isSquadTrialBookable(at('2026-10-02T12:00:00+10:00'))).toBe(false);
    });

    it('reads day and time straight off the session label', () => {
        expect(dayOf('Sunday 4 October · 1:00–2:30 PM')).toBe('Sunday 4 October');
        expect(timeOf('Sunday 4 October · 1:00–2:30 PM')).toBe('1:00–2:30 PM');
        expect(joinDays(getUpcomingTrials(at('2026-10-02T12:00:00+10:00'))))
            .toBe('Sunday 4 October and Monday 5 October');
    });
});

describe('membership numbers', () => {
    it('works the yearly fee out from the weekly fee', () => {
        expect(MEMBERSHIP.weeklyFee).toBe(29.95);
        expect(MEMBERSHIP.joiningFee).toBe(149);
        expect(MEMBERSHIP_YEARLY).toBe(1557.4);
    });

    it('formats money the way the welcome page does', () => {
        expect(money(149)).toBe('$149');
        expect(money(29.95)).toBe('$29.95');
        expect(money(1557.4)).toBe('$1,557.40');
        expect(money(30)).toBe('$30');
    });

    it('quotes the same fees in the FAQ as the membership section', () => {
        const cost = FAQS.find((f) => f.q === 'What does it cost?')!.a;
        expect(cost).toContain('$149 joining fee');
        expect(cost).toContain('$1,557.40');
        expect(cost).toContain('$29.95 a week');
        const cancel = FAQS.find((f) => f.q === 'Can I cancel my membership?')!.a;
        expect(cancel).toContain('$149 joining fee again');
    });
});

describe('member pricing rule', () => {
    it('gives tours a six-month minimum and programs the price while active', () => {
        expect(TOUR_MEMBER_MONTHS).toBe(6);
        expect(MEMBER_PRICING_RULE).toContain('while your membership is active');
        expect(MEMBER_PRICING_RULE).toContain('six months in a row by the date the tour starts');
    });

    it('says the same in the FAQ, including that rejoining restarts the clock', () => {
        const faq = FAQS.find((f) => f.q === 'When do I get member pricing?')!.a;
        expect(faq).toContain('six months in a row by the date the tour starts');
        expect(faq).toContain('the member discount becomes payable');
        expect(faq).toContain('the six months start again');
        expect(faq).toContain('clause 13');
    });
});

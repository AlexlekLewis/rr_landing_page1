import { describe, it, expect } from 'vitest';
import { OPTIONS, DISCOUNTS, NOTICE_WEEKS, TERM_8, PHASES, SESSION, CURRICULUM, BADGES, wednesdays2027 } from './jrV2Facts';
import * as CONTENT from './jrV2Content';
import { priceAhead, termTotal, yearTotal, SHORT_TERM_NOTE, GROUP_UPSIDE } from './jrV2Content';
import { FORM_VALUES } from './JRV2Form';
import { JR_V2_SEO, JR_V2_JSONLD, JR_SEO_VENUES } from './jrV2Seo';
import { CENTRES } from '../juniorRoyalsData';

// Junior Royals mock-up v2 (Alex, 7–8 Oct 2026): two options, rolling term enrolment,
// discounts for paying ahead. These tests keep every number on the page in step.
describe('the two options', () => {
    it('Groups of 4: never more than 5, $49.95; Groups of 6: never more than 7, $34.95 (Alex, 8 Oct)', () => {
        expect(OPTIONS).toEqual([
            { key: '4s', name: 'Groups of 4', perLane: 4, max: 5, price: 49.95 },
            { key: '6s', name: 'Groups of 6', perLane: 6, max: 7, price: 34.95 },
        ]);
        OPTIONS.forEach((o) => expect(o.max).toBe(o.perLane + 1)); // one make-up spot
    });

    it('paying ahead: 10% off 2 terms, 15% off the year', () => {
        expect(DISCOUNTS).toEqual({ twoTerms: 0.10, year: 0.15 });
        // rounded DOWN to 5c, so the saving is never less than advertised
        expect(priceAhead(49.95, DISCOUNTS.twoTerms)).toBe(44.95);
        expect(priceAhead(49.95, DISCOUNTS.year)).toBe(42.45);
        expect(priceAhead(34.95, DISCOUNTS.twoTerms)).toBe(31.45);
        expect(priceAhead(34.95, DISCOUNTS.year)).toBe(29.7);
        expect(priceAhead(50, DISCOUNTS.twoTerms)).toBe(45);   // exact values stay exact
    });

    it('Term 4 2026 (8 sessions): $399.60 for Groups of 4, $279.60 for Groups of 6', () => {
        expect(termTotal('4s', 8)).toBe(399.6);
        expect(termTotal('6s', 8)).toBe(279.6);
        // a year ahead = the rounded per-session price × 40, never a different rounding
        expect(yearTotal('4s', DISCOUNTS.year)).toBe(1698);
        expect(yearTotal('6s', DISCOUNTS.year)).toBe(1188);
    });

    it('each option leads with what the group size gives a player, never a coach-time ratio', () => {
        expect(Object.keys(GROUP_UPSIDE)).toEqual(['4s', '6s']);
        expect(JSON.stringify(CONTENT)).not.toMatch(/coach.s hour|minutes of coach|1 coach for every/i);
    });

    it('2 weeks notice before the next term', () => {
        expect(NOTICE_WEEKS).toBe(2);
    });
});

describe('the program facts', () => {
    it('three stages, two goals each, ages 7 to 12 with no gaps', () => {
        expect(PHASES.map((p) => [p.min, p.max])).toEqual([[7, 8], [9, 10], [11, 12]]);
        PHASES.forEach((p) => expect(p.canDo).toHaveLength(2));
    });

    it('the session is 60 minutes, 20 batting, 20 bowling', () => {
        const mins = (k: string) => SESSION.filter((s) => s.kind === k).reduce((n, s) => n + s.to - s.from, 0);
        expect(SESSION[SESSION.length - 1].to).toBe(60);
        expect(mins('bat')).toBe(20);
        expect(mins('bowl')).toBe(20);
    });

    it('Term 4 rows are 8 real Wednesdays, 28 Oct to 16 Dec 2026', () => {
        const months: Record<string, number> = { Oct: 9, Nov: 10, Dec: 11 };
        expect(TERM_8).toHaveLength(8);
        TERM_8.forEach((t) => {
            const [, d, m] = t.date.split(' ');
            expect(new Date(Date.UTC(2026, months[m], Number(d))).getUTCDay()).toBe(3);
        });
        expect(TERM_8[0].date).toBe('Wed 28 Oct');
        expect(TERM_8[7].date).toBe('Wed 16 Dec');
    });

    it('2027 has 52 Wednesdays: 40 training, 12 holidays', () => {
        const w = wednesdays2027();
        expect(w).toHaveLength(52);
        expect(w.filter((x) => x.term).length).toBe(40);
    });
});

describe('the pathway pop-ups and skill badges (Alex, 8 Oct: show the full curriculum)', () => {
    it('every stage has topics for batting, bowling and fielding, and things to work towards', () => {
        PHASES.forEach((p) => {
            const c = CURRICULUM[p.key];
            expect(c, p.key).toBeTruthy();
            ['batting', 'bowling', 'fielding', 'byTheEnd'].forEach((k) => expect(c[k].length, `${p.key}.${k}`).toBeGreaterThan(0));
        });
        // Stage certificates (Alex, 8 Oct): "completed", never "passed"
        PHASES.forEach((p) => expect(CURRICULUM[p.key].certificate).toMatch(new RegExp(`completed (${p.name}|Junior Royals)`)));
        expect(JSON.stringify(CURRICULUM)).not.toMatch(/passed|failed/i);
    });

    it('28 badges a year: one batting + one bowling per block (12 blocks) + 4 fielding', () => {
        expect(BADGES.perYear).toEqual({ batting: 12, bowling: 12, fielding: 4 });
        expect(BADGES.check).toEqual({ good: 4, of: 6, nights: 2 });
        expect(BADGES.status).toBe('proposed');
    });

    it('safety promises are scoped to Wednesday training (matches are real games)', () => {
        const text = JSON.stringify(CONTENT.WORRIES) + JSON.stringify(CONTENT.FAQS);
        expect(text).toMatch(/At Wednesday training, players aged 7 and 8/);
        expect(text).not.toMatch(/Soft balls\. The coach feeds every ball/);
    });
});

describe('continuity: one word for one thing (Alex, 8 Oct)', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { SHORT_TERM_NOTE: _note, ...copy } = CONTENT;
    const text = JSON.stringify(copy) + JSON.stringify({ PHASES, CURRICULUM, BADGES });
    it('blocks are 3 weeks everywhere; the 8-week-term note is worded once', () => {
        expect(text).not.toMatch(/2 or 3 weeks|two or three weeks|usually lasts/i);
        expect(text.split(SHORT_TERM_NOTE).length - 1).toBe(1);
    });
    it('no leftover "Junior Level" certificates, "join the list", or "night" for a session', () => {
        expect(text).not.toMatch(/Junior Level|Join the list|first night|last night|two nights/i);
    });
});

describe('the interest form', () => {
    it('sends only these values (the database must accept every one; add each to the watchdog)', () => {
        expect(FORM_VALUES).toEqual({
            centre: ['mickleham', 'cranbourne-north'],
            group_option: ['4s', '6s', 'either'],
            preferred_time: ['6pm', '7pm', 'either'],
            payment_plan: ['term', 'weekly', '2-terms', 'year', 'not-sure'],
        });
    });
});

describe('search and structured data', () => {
    it('title ≤ 60 and description ≤ 155 characters, both saying Melbourne', () => {
        expect(JR_V2_SEO.title.length).toBeLessThanOrEqual(60);
        expect(JR_V2_SEO.description.length).toBeLessThanOrEqual(155);
        expect(JR_V2_SEO.descriptionUndated.length).toBeLessThanOrEqual(155);
        expect(JR_V2_SEO.title).toMatch(/Melbourne/);
        expect(JR_V2_SEO.description).toMatch(/Melbourne/);
    });

    it('venue addresses match the centres shown on the page', () => {
        JR_SEO_VENUES.forEach((v) => {
            const c = CENTRES.find((x) => x.value === v.id)!;
            expect(c.address).toBe(`${v.street}, ${v.locality} VIC ${v.postcode}`);
        });
    });

    it('no prices in the structured data until joining opens, and no retired centres', () => {
        const json = JSON.stringify(JR_V2_JSONLD);
        expect(json).not.toMatch(/"offers"/);
        expect(json).not.toMatch(/Hallam|Williamstown/i);
        expect(() => JSON.parse(json)).not.toThrow();
    });
});

describe('copy rules (CLAUDE.md §2, language.md)', () => {
    const text = JSON.stringify(CONTENT);
    it('no banned sales words, no "economy"/"premium" tiers, no retired centres', () => {
        expect(text).not.toMatch(/\b(investment|essential|premium|economy|world-class|unlock|journey|tailored|bespoke|limited time|act now|from just)\b/i);
        expect(text).not.toMatch(/Junior Royals [46]s|(?<!["\w])[46]s\b(?!")/); // renamed: Groups of 4 / Groups of 6 (keys "4s"/"6s" are internal)
        expect(text).not.toMatch(/Hallam|Williamstown/i);
        expect(text).not.toMatch(/North Melbourne/); // an inner suburb; Mickleham is "Melbourne's north"
    });
    it('never promises selection, the same coach, or app notes', () => {
        // "the same coaching team" is fine; "the same coach(es)" is a promise we can't keep.
        expect(text).not.toMatch(/guarantee(d)? (a )?(place|selection)|same coach(es)?\b|app notes/i);
    });
});

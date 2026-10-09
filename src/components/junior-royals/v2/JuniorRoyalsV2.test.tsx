import { describe, it, expect } from 'vitest';
import { PRICE, SHIRT, NOTICE_WEEKS, PHASES, SESSION, CURRICULUM, BADGES, wednesdays2027 } from './jrV2Facts';
import * as CONTENT from './jrV2Content';
import { termTotal, yearTotal, TERMS, V2_CENTRES, DAYS, MIN_DAYS } from './jrV2Content';
import { FORM_VALUES } from './JRV2Form';
import { JR_V2_SEO, JR_V2_JSONLD, JR_SEO_VENUES } from './jrV2Seo';
import { CENTRES } from '../juniorRoyalsData';

// Junior Royals mock-up v2, restructured 9 Oct 2026 (Alex): one price, $49.95 a
// week paid weekly in term; compulsory shirt at $29.95 (free for the first 20);
// no bulk discounts; no stage ages; Ravenhall coming soon; 2+ weekday choices.
describe('price (Alex, 9 Oct)', () => {
    it('one price: $49.95 a week, up to 6 per lane (+1 make-up), shirt $29.95', () => {
        expect(PRICE).toEqual({ perWeek: 49.95, perLane: 6, max: 7 });
        expect(SHIRT).toEqual({ memberPrice: 29.95, shopPrice: 62.95, freeForFirst: 20 });
        expect(NOTICE_WEEKS).toBe(2);
    });

    it('term and year totals are the weekly price × weeks', () => {
        expect(termTotal(10)).toBe(499.5);
        expect(termTotal(11)).toBe(549.45);
        expect(yearTotal()).toBe(1998);
        expect(TERMS.every((t) => t.sessions > 0)).toBe(true);
        expect(TERMS[0].label).toBe('Term 4, 2026');
    });

    it('no bulk / pay-ahead discounts and no group-size options left in the copy', () => {
        const text = JSON.stringify(CONTENT);
        expect(text).not.toMatch(/(pay|paid|paying)( the year| \d terms?)? ahead|save 10%|save 15%|Groups of [46]|Junior Royals [46]s/i);
    });

    it('the compulsory shirt sits next to every headline price (no drip pricing)', () => {
        expect(CONTENT.HERO.shirt).toMatch(/\$29\.95/);
        expect(CONTENT.HERO.shirt).toMatch(/compulsory/);
        expect(CONTENT.PRICES.shirt).toMatch(/\$29\.95/);
    });
});

describe('the program facts', () => {
    it('three stages, two goals each — and no ages on the stages (Alex, 9 Oct)', () => {
        expect(PHASES.map((p) => p.name)).toEqual(['Discover', 'Develop', 'Elevate']);
        PHASES.forEach((p) => {
            expect(p.canDo).toHaveLength(2);
            expect(p).not.toHaveProperty('ages');
            expect(p).not.toHaveProperty('min');
        });
        expect(JSON.stringify(CURRICULUM)).not.toMatch(/\bat (9|11|13)\b|ages? \d/i);
    });

    it('the session is 60 minutes, 20 batting, 20 bowling', () => {
        const mins = (k: string) => SESSION.filter((s) => s.kind === k).reduce((n, s) => n + s.to - s.from, 0);
        expect(SESSION[SESSION.length - 1].to).toBe(60);
        expect(mins('bat')).toBe(20);
        expect(mins('bowl')).toBe(20);
    });

    it('2027 has 52 weeks: 40 with sessions, 12 holidays', () => {
        const w = wednesdays2027();
        expect(w).toHaveLength(52);
        expect(w.filter((x) => x.term).length).toBe(40);
    });
});

describe('progress system and stages', () => {
    it('every stage has topics for batting, bowling and fielding, and things to work towards', () => {
        PHASES.forEach((p) => {
            const c = CURRICULUM[p.key];
            ['batting', 'bowling', 'fielding', 'byTheEnd'].forEach((k) => expect(c[k].length, `${p.key}.${k}`).toBeGreaterThan(0));
            expect(c.certificate).toMatch(new RegExp(`completed (${p.name}|Junior Royals)`));
        });
        expect(JSON.stringify(CURRICULUM)).not.toMatch(/passed|failed/i);
    });

    it('28 badges a year: one batting + one bowling per block (12 blocks) + 4 fielding', () => {
        expect(BADGES.perYear).toEqual({ batting: 12, bowling: 12, fielding: 4 });
        expect(BADGES.check).toEqual({ good: 4, of: 6, nights: 2 });
    });

    it('the system has its name, and the page makes no unprovable superlatives (CLAUDE.md §2)', () => {
        expect(CONTENT.PROGRESS.title).toBe('The Royals Way Progress Tracking and Development System');
        expect(JSON.stringify(CONTENT)).not.toMatch(/second to none|unique|world-class|best in|only academy/i);
    });
});

describe('the interest form', () => {
    it('sends only these values (the database must accept every one; add each to the watchdog)', () => {
        expect(FORM_VALUES).toEqual({
            centre: ['mickleham', 'cranbourne-north', 'ravenhall'],
            preferred_days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            preferred_time: ['6pm', '7pm', 'either'],
        });
    });

    it('asks for at least 2 weekdays, Monday to Friday', () => {
        expect(MIN_DAYS).toBe(2);
        expect(DAYS.map((d) => d.label)).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    });

    it('Ravenhall is shown as coming soon, at its real address', () => {
        const r = V2_CENTRES.find((c) => c.value === 'ravenhall')!;
        expect(r.comingSoon).toBe(true);
        expect(r.address).toBe('5/65 Eucumbene Drive, Ravenhall VIC 3023');
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
    // The shared centre records (V2_CENTRES) carry data fields the page never shows.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { V2_CENTRES: _c, RAVENHALL: _r, ...copy } = CONTENT;
    const text = JSON.stringify(copy);
    it('no banned sales words, no retired centres, no "8 weeks" note', () => {
        expect(text).not.toMatch(/\b(investment|essential|premium|economy|world-class|unlock|journey|tailored|bespoke|limited time|act now|from just|while stocks last)\b/i);
        expect(text).not.toMatch(/Hallam|Williamstown/i);
        expect(text).not.toMatch(/North Melbourne/); // an inner suburb; Mickleham is "Melbourne's north"
        expect(text).not.toMatch(/8 Wednesdays|8-week|8 weeks|8 sessions/i);
    });
    it('never promises selection, the same coach, or app notes', () => {
        // "the same coaching team" is fine; "the same coach(es)" is a promise we can't keep.
        expect(text).not.toMatch(/guarantee(d)? (a )?(place|selection)|same coach(es)?\b|app notes/i);
    });
});

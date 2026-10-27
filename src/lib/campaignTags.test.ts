import { describe, it, expect } from 'vitest';
import {
    readCampaignTags,
    stripClickIds,
    getFirstTouch,
    mergeCampaignTags,
    FIRST_TOUCH_STORAGE_KEY,
    MAX_TAG_LENGTH,
} from './campaignTags';

const memoryStorage = () => {
    const data = new Map<string, string>();
    return {
        data,
        getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
        setItem: (k: string, v: string) => { data.set(k, v); },
    };
};
const brokenStorage = {
    getItem: () => { throw new Error('storage blocked'); },
    setItem: () => { throw new Error('storage blocked'); },
};
const fresh = () => ({ value: null as Record<string, unknown> | null });

describe('readCampaignTags', () => {
    it('returns nothing when there are no params', () => {
        expect(readCampaignTags('')).toEqual({});
        expect(readCampaignTags('?foo=bar')).toEqual({});
    });

    it('reads all utm params, lower-casing source and medium only', () => {
        const tags = readCampaignTags('?utm_source=FB&utm_medium=Paid&utm_campaign=JR_Term4&utm_content=Ad123&utm_term=Cricket+Coaching&utm_id=9988');
        expect(tags).toEqual({
            utm_source: 'fb',
            utm_medium: 'paid',
            utm_campaign: 'JR_Term4',
            utm_content: 'Ad123',
            utm_term: 'Cricket Coaching',
            utm_id: '9988',
        });
    });

    it('notes fbclid as a boolean and never stores its value', () => {
        const tags = readCampaignTags('?utm_source=fb&fbclid=IwZXh0SECRETVALUE');
        expect(tags.has_fbclid).toBe(true);
        expect(JSON.stringify(tags)).not.toContain('IwZXh0SECRETVALUE');
        expect(tags).not.toHaveProperty('has_gclid');
    });

    it('treats gclid, wbraid and gbraid as has_gclid without storing values', () => {
        for (const name of ['gclid', 'wbraid', 'gbraid']) {
            const tags = readCampaignTags(`?${name}=ABC123SECRET`);
            expect(tags).toEqual({ has_gclid: true });
        }
    });

    it('caps long values at 100 characters', () => {
        const tags = readCampaignTags(`?utm_campaign=${'a'.repeat(500)}`);
        expect((tags.utm_campaign as string).length).toBe(MAX_TAG_LENGTH);
    });

    it('ignores empty, whitespace-only and control-character values; trims the rest', () => {
        const tags = readCampaignTags('?utm_source=&utm_medium=%20%20&utm_campaign=%00%01&utm_content=%20%20x%20&utm_term');
        expect(tags).toEqual({ utm_content: 'x' });
    });

    it('ignores empty click ids', () => {
        expect(readCampaignTags('?fbclid=&gclid=%20')).toEqual({});
    });

    it('never throws on odd input', () => {
        expect(readCampaignTags(undefined as unknown as string)).toEqual({});
        expect(readCampaignTags('%%%?&&=')).toEqual({});
    });
});

describe('getFirstTouch', () => {
    it('stores the landing tags and landing_path, then returns them on later pages', () => {
        const storage = memoryStorage();
        const fallback = fresh();
        const first = getFirstTouch({ search: '?utm_source=Facebook&utm_campaign=jr&fbclid=SECRET', pathname: '/junior-royals', storage, fallback });
        expect(first).toEqual({ utm_source: 'facebook', utm_campaign: 'jr', has_fbclid: true, landing_path: '/junior-royals' });

        // Visitor clicks through to another page (no utm in the URL now).
        const later = getFirstTouch({ search: '', pathname: '/power-league', storage, fallback });
        expect(later).toEqual(first);
        expect(storage.data.get(FIRST_TOUCH_STORAGE_KEY)).not.toContain('SECRET');
    });

    it('records just landing_path for an organic visit and keeps it', () => {
        const storage = memoryStorage();
        const fallback = fresh();
        expect(getFirstTouch({ search: '', pathname: '/', storage, fallback })).toEqual({ landing_path: '/' });
        expect(getFirstTouch({ search: '?utm_source=late', pathname: '/x', storage, fallback })).toEqual({ landing_path: '/' });
    });

    it('still works when sessionStorage is unavailable (null)', () => {
        const fallback = fresh();
        const a = getFirstTouch({ search: '?utm_source=google', pathname: '/a', storage: null, fallback });
        const b = getFirstTouch({ search: '', pathname: '/b', storage: null, fallback });
        expect(a).toEqual({ utm_source: 'google', landing_path: '/a' });
        expect(b).toEqual(a);
    });

    it('still works when sessionStorage throws on read and write', () => {
        const fallback = fresh();
        const a = getFirstTouch({ search: '?utm_medium=cpc', pathname: '/a', storage: brokenStorage, fallback });
        const b = getFirstTouch({ search: '', pathname: '/b', storage: brokenStorage, fallback });
        expect(a).toEqual({ utm_medium: 'cpc', landing_path: '/a' });
        expect(b).toEqual(a);
    });

    it('ignores unknown keys in a tampered stored value', () => {
        const storage = memoryStorage();
        storage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify({ utm_source: 'fb', email: 'x@y.z' }));
        expect(getFirstTouch({ storage, fallback: fresh() })).toEqual({ utm_source: 'fb' });
    });
});

describe('mergeCampaignTags', () => {
    it('adds tags without changing existing event_data keys', () => {
        expect(mergeCampaignTags({ depth: 50 }, { utm_source: 'fb', landing_path: '/' })).toEqual({
            depth: 50, utm_source: 'fb', landing_path: '/',
        });
        expect(mergeCampaignTags({ url: 'mine' }, { url: 'theirs' } as never)).toEqual({ url: 'mine' });
    });
    it('copes with missing arguments', () => {
        expect(mergeCampaignTags(undefined, undefined)).toEqual({});
    });
});

describe('stripClickIds', () => {
    it('removes fbclid in the middle', () => {
        expect(stripClickIds('https://x.com/p?utm_source=fb&fbclid=AAA&utm_medium=paid'))
            .toBe('https://x.com/p?utm_source=fb&utm_medium=paid');
    });
    it('removes fbclid at the end', () => {
        expect(stripClickIds('https://x.com/p?utm_source=fb&fbclid=AAA')).toBe('https://x.com/p?utm_source=fb');
    });
    it('removes fbclid when it is the only param (and drops the "?")', () => {
        expect(stripClickIds('https://x.com/p?fbclid=AAA')).toBe('https://x.com/p');
    });
    it('removes every click id type but keeps utm and other params', () => {
        expect(stripClickIds('https://x.com/?gclid=1&wbraid=2&gbraid=3&msclkid=4&dclid=5&FBCLID=6&utm_id=7&ref=abc'))
            .toBe('https://x.com/?utm_id=7&ref=abc');
    });
    it('keeps the fragment', () => {
        expect(stripClickIds('https://x.com/p?fbclid=A&x=1#top')).toBe('https://x.com/p?x=1#top');
        expect(stripClickIds('https://x.com/p?fbclid=A#top')).toBe('https://x.com/p#top');
    });
    it('returns a URL with no click id untouched, byte for byte', () => {
        const u = 'https://x.com/p?utm_source=fb&utm_term=a%20b';
        expect(stripClickIds(u)).toBe(u);
        expect(stripClickIds('https://x.com/p')).toBe('https://x.com/p');
    });
    it('does not touch params that merely contain a click-id name', () => {
        const u = 'https://x.com/p?not_fbclid=1&myfbclid=2';
        expect(stripClickIds(u)).toBe(u);
    });
    it('returns a malformed URL unchanged', () => {
        expect(stripClickIds('not a url')).toBe('not a url');
        expect(stripClickIds('%%%')).toBe('%%%');
    });
    it('handles a referrer with no query, an empty string, and non-strings', () => {
        expect(stripClickIds('https://l.facebook.com/')).toBe('https://l.facebook.com/');
        expect(stripClickIds('')).toBe('');
        expect(stripClickIds(null as unknown as string)).toBe(null);
        expect(stripClickIds(undefined as unknown as string)).toBe(undefined);
    });
});

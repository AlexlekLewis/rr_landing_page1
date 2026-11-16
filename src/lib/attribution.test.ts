import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildFbc, captureAttribution, getAttribution, utmSearchParams } from './attribution.js';
import { newEventId, track, trackCustom } from './metaPixel.js';

// Minimal browser stand-ins: vitest runs these in plain Node.
const setUrl = (path: string) => {
    const u = new URL(path, 'https://rramelbourne.com');
    (globalThis as any).window.location = { search: u.search, origin: u.origin, pathname: u.pathname };
};

beforeEach(() => {
    const store: Record<string, string> = {};
    let cookie = '';
    (globalThis as any).window = {
        localStorage: {
            getItem: (k: string) => (k in store ? store[k] : null),
            setItem: (k: string, v: string) => { store[k] = v; },
        },
    };
    (globalThis as any).document = {
        referrer: 'https://l.facebook.com/',
        get cookie() { return cookie; },
        set cookie(v: string) {
            const pair = v.split(';')[0];
            const name = pair.split('=')[0];
            const rest = cookie.split('; ').filter((c) => c && !c.startsWith(`${name}=`));
            cookie = [...rest, pair].join('; ');
        },
    };
});

afterEach(() => {
    delete (globalThis as any).window;
    delete (globalThis as any).document;
    vi.useRealTimers();
});

describe('attribution', () => {
    it('keeps the ad tags after the family navigates away from the landing URL', () => {
        setUrl('/?utm_source=facebook&utm_medium=paid&utm_campaign=jr-t1&utm_content=video&fbclid=ABC');
        captureAttribution();
        setUrl('/junior-royals');
        const a = getAttribution();
        expect(a).toMatchObject({ utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'jr-t1', utm_content: 'video', utm_term: null, fbclid: 'ABC', landing_page: 'https://rramelbourne.com/', referrer: 'https://l.facebook.com/' });
        expect(a.fbc).toMatch(/^fb\.1\.\d+\.ABC$/);
        expect(utmSearchParams().get('utm_campaign')).toBe('jr-t1');
    });

    it('lets the current URL win over storage, and keeps the first touch', () => {
        setUrl('/?utm_source=facebook');
        captureAttribution();
        setUrl('/holiday?utm_source=google');
        captureAttribution();
        expect(getAttribution().utm_source).toBe('google');
        const saved = JSON.parse((globalThis as any).window.localStorage.getItem('rra_attribution'));
        expect(saved.first.utm_source).toBe('facebook');
        expect(saved.last.utm_source).toBe('google');
    });

    it('does not set _fbc when the Pixel already set one for this click', () => {
        (globalThis as any).document.cookie = '_fbc=fb.1.111.ABC';
        setUrl('/?fbclid=ABC');
        captureAttribution();
        expect(getAttribution().fbc).toBe('fb.1.111.ABC');
        expect(buildFbc('XYZ', 5)).toBe('fb.1.5.XYZ');
    });

    it('stops using a touch older than 30 days', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-10-01T00:00:00Z'));
        setUrl('/?utm_source=facebook');
        captureAttribution();
        vi.setSystemTime(new Date('2026-11-15T00:00:00Z'));
        setUrl('/junior-royals');
        expect(getAttribution().utm_source).toBeNull();
    });

    it('survives blocked storage', () => {
        (globalThis as any).window.localStorage = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
        setUrl('/?utm_source=facebook');
        expect(() => captureAttribution()).not.toThrow();
        setUrl('/x');
        expect(getAttribution().utm_source).toBeNull();
        expect(utmSearchParams().get('utm_source')).toBeNull();
    });
});

describe('metaPixel', () => {
    it('is a no-op without fbq, and passes eventID through when present', () => {
        expect(track('Lead', { content_name: 'x' })).toBe(false);
        const fbq = vi.fn();
        (globalThis as any).window.fbq = fbq;
        expect(track('Lead', { content_name: 'x' }, { eventID: 'e1' })).toBe(true);
        expect(fbq).toHaveBeenCalledWith('track', 'Lead', { content_name: 'x' }, { eventID: 'e1' });
        trackCustom('SpinClubSignup');
        expect(fbq).toHaveBeenLastCalledWith('trackCustom', 'SpinClubSignup', {});
        (globalThis as any).window.fbq = () => { throw new Error('boom'); };
        expect(track('Lead')).toBe(false);
        expect(newEventId()).not.toBe(newEventId());
    });
});

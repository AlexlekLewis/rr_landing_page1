import { describe, it, expect, vi } from 'vitest';
import {
    PIXEL_BLOCKED_PATH_PREFIXES,
    isPixelBlockedPath,
    pixelTrack,
    trackPixelPageView,
} from './metaPixel';

const BLOCKED = [
    '/junior-royals',
    '/junior-royals/',
    '/Junior-Royals',
    '/junior-royals/success',
    '/junior-royals-term2',
    '/junior-royals-term2/success',
    '/junior-royals-holiday',
    '/junior-royals-holiday/success',
    '/lower-plenty-junior-royals-day',
    '/lower-plenty-junior-royals-day/success',
    '/lower-plenty-junior-royals-day/pay',
    '/carnival',
];
const ALLOWED = [
    '/',
    '/performance-squads',
    '/performance-squads/interest',
    '/performance-squads-open-trial',
    '/careers',
    '/power-league',
    '/mickleham',
    '/tours',
    '/junior-royalsxyz',
];

// A fake browser window: records every fbq call, and every script tag added.
function fakeBrowser(pathname: string, withPixel = true) {
    const calls: unknown[][] = [];
    const scripts: string[] = [];
    const win: any = { location: { pathname } };
    if (withPixel) win.fbq = vi.fn((...args: unknown[]) => { calls.push(args); });
    const doc: any = {
        createElement: () => ({}),
        getElementsByTagName: () => [{ parentNode: { insertBefore: (el: any) => scripts.push(el.src) } }],
        head: { appendChild: (el: any) => scripts.push(el.src) },
    };
    return { win, doc, calls, scripts };
}

describe('isPixelBlockedPath', () => {
    it.each(BLOCKED)('blocks %s', (p) => expect(isPixelBlockedPath(p)).toBe(true));
    it.each(ALLOWED)('allows %s', (p) => expect(isPixelBlockedPath(p)).toBe(false));
    it('ignores a query string or fragment', () => {
        expect(isPixelBlockedPath('/junior-royals?utm_source=fb')).toBe(true);
        expect(isPixelBlockedPath('/power-league#top')).toBe(false);
    });
    it('every list entry blocks itself', () => {
        for (const prefix of PIXEL_BLOCKED_PATH_PREFIXES) expect(isPixelBlockedPath(prefix)).toBe(true);
    });
});

describe('pixelTrack (events)', () => {
    it.each(BLOCKED)('never calls fbq on %s', (p) => {
        const { win, calls } = fakeBrowser(p);
        for (const ev of ['Lead', 'InitiateCheckout', 'Purchase', 'PageView']) {
            expect(pixelTrack(ev, { value: 1 }, { eventID: 'x' }, win)).toBe(false);
        }
        expect(win.fbq).not.toHaveBeenCalled();
        expect(calls).toHaveLength(0);
    });

    it('still fires on an allowed route', () => {
        const { win, calls } = fakeBrowser('/performance-squads');
        expect(pixelTrack('Lead', { content_name: 'x' }, undefined, win)).toBe(true);
        expect(calls).toEqual([['track', 'Lead', { content_name: 'x' }]]);
    });

    it('passes the options argument through (event id for de-duplication)', () => {
        const { win, calls } = fakeBrowser('/');
        pixelTrack('Purchase', { value: 5 }, { eventID: 'abc' }, win);
        expect(calls).toEqual([['track', 'Purchase', { value: 5 }, { eventID: 'abc' }]]);
    });

    it('does nothing if the pixel is not loaded or fbq throws', () => {
        expect(pixelTrack('Lead', {}, undefined, fakeBrowser('/', false).win)).toBe(false);
        const { win } = fakeBrowser('/');
        win.fbq = () => { throw new Error('boom'); };
        expect(pixelTrack('Lead', {}, undefined, win)).toBe(false);
    });
});

describe('trackPixelPageView (loading the script)', () => {
    it.each(BLOCKED)('does not load the Meta script or create fbq on %s', (p) => {
        const { win, doc, scripts } = fakeBrowser(p, false);
        expect(trackPixelPageView(win, doc)).toBe(false);
        expect(win.fbq).toBeUndefined();
        expect(scripts).toHaveLength(0);
    });

    it('does not fire PageView on a blocked route even if the pixel was loaded on an earlier page', () => {
        const { win, doc, calls } = fakeBrowser('/junior-royals');
        expect(trackPixelPageView(win, doc)).toBe(false);
        expect(calls).toHaveLength(0);
    });

    it('loads the script, inits and sends PageView on an allowed route', () => {
        const { win, doc, scripts } = fakeBrowser('/', false);
        expect(trackPixelPageView(win, doc)).toBe(true);
        expect(scripts).toEqual(['https://connect.facebook.net/en_US/fbevents.js']);
        expect(win.fbq.disablePushState).toBe(true);
        const queued = win.fbq.queue.map((a: IArguments) => Array.from(a));
        expect(queued).toEqual([['init', '3125499870991789'], ['track', 'PageView']]);
    });

    it('loads only once; later allowed pages just send PageView', () => {
        const { win, doc, scripts } = fakeBrowser('/', false);
        trackPixelPageView(win, doc);
        win.location.pathname = '/careers';
        trackPixelPageView(win, doc);
        expect(scripts).toHaveLength(1);
        expect(win.fbq.queue.filter((a: IArguments) => a[1] === 'PageView')).toHaveLength(2);
    });

    it('a visitor landing on a blocked page then moving to an allowed one gets the pixel from then on', () => {
        const { win, doc, scripts } = fakeBrowser('/junior-royals', false);
        trackPixelPageView(win, doc);
        expect(scripts).toHaveLength(0);
        win.location.pathname = '/';
        expect(trackPixelPageView(win, doc)).toBe(true);
        expect(scripts).toHaveLength(1);
    });
});

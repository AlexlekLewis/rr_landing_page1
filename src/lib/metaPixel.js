// Meta Pixel, in one place.
//
// Meta's rules forbid the Pixel on pages for under-13 programs. This module is the ONLY
// place the Pixel is loaded or fired from, and it refuses to do either on the routes
// listed below. To audit or change where the Pixel is off, edit PIXEL_BLOCKED_PATH_PREFIXES
// and nothing else.

export const PIXEL_ID = '3125499870991789';
const PIXEL_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

// Under-13 program routes. A path is blocked when it equals an entry or sits under it
// ("/junior-royals" blocks "/junior-royals/success" but not "/junior-royals-holiday",
// which has its own entry). Matching ignores case and a trailing slash.
export const PIXEL_BLOCKED_PATH_PREFIXES = [
    '/junior-royals',                    // Junior Royals Term 4 (+ /success)
    '/junior-royals-term2',              // Junior Royals Term 2 (+ /success)
    '/junior-royals-holiday',            // Junior Royals holiday camps (+ /success)
    '/lower-plenty-junior-royals-day',   // Lower Plenty Junior Royals Day (+ /success, /pay)
    '/carnival',                         // old link that redirects to the Lower Plenty day
];

const normalise = (pathname) => {
    const p = String(pathname || '/').toLowerCase().split(/[?#]/)[0];
    return p.length > 1 ? p.replace(/\/+$/, '') : '/';
};

/** True when the Pixel must not load or fire on this path. */
export function isPixelBlockedPath(pathname) {
    const p = normalise(pathname);
    return PIXEL_BLOCKED_PATH_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

const currentPath = (win) => (win && win.location ? win.location.pathname : '/');

/** Load Meta's script and create fbq. Does nothing if fbq already exists. */
function installPixel(win, doc) {
    if (win.fbq) return;
    const n = function () {
        if (n.callMethod) n.callMethod.apply(n, arguments);
        else n.queue.push(arguments);
    };
    win.fbq = n;
    if (!win._fbq) win._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    // The router below sends PageView itself on each page change, so Meta's own
    // history-change PageView (which would also fire on blocked pages) is switched off.
    n.disablePushState = true;
    n.allowDuplicatePageViews = true;
    const script = doc.createElement('script');
    script.async = true;
    script.src = PIXEL_SRC;
    const first = doc.getElementsByTagName('script')[0];
    if (first && first.parentNode) first.parentNode.insertBefore(script, first);
    else doc.head.appendChild(script);
    win.fbq('init', PIXEL_ID);
}

/**
 * Call on every page change. Allowed page: loads the Pixel on first use and sends PageView.
 * Blocked page: does nothing at all (the script is not even downloaded).
 */
export function trackPixelPageView(win = window, doc = document) {
    if (isPixelBlockedPath(currentPath(win))) return false;
    installPixel(win, doc);
    win.fbq('track', 'PageView');
    return true;
}

/**
 * Fire a Pixel event (Lead, InitiateCheckout, Purchase ...). Replaces direct window.fbq
 * calls. Silent no-op on blocked routes, when the Pixel is not loaded, or if fbq throws.
 */
export function pixelTrack(eventName, params, options, win = typeof window === 'undefined' ? undefined : window) {
    try {
        if (!win || typeof win.fbq !== 'function') return false;
        if (isPixelBlockedPath(currentPath(win))) return false;
        const args = ['track', eventName];
        if (params !== undefined || options !== undefined) args.push(params);
        if (options !== undefined) args.push(options);
        win.fbq(...args);
        return true;
    } catch {
        return false; // never let analytics break the page
    }
}

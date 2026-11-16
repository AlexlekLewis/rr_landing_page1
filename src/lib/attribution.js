// Ad attribution that survives in-site navigation.
//
// Forms used to read utm_* from the URL at submit time, so a family who landed on
// /?utm_source=facebook and clicked through to a program page submitted with no
// tags. On every load (main.jsx) and route change (MetaPixelPageviewTracker) we
// store the tags and fbclid: the first touch once, the last touch every time.
// Forms read them through utmSearchParams() / getAttribution(), where the URL
// still wins and storage is only the fallback.
//
// Storage can be blocked (private mode, cookies off): every access is wrapped,
// and with nothing stored the forms behave exactly as before.

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const STORAGE_KEY = 'rra_attribution';
// A stored touch older than this no longer tags a sign-up.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
// Meta's own _fbc cookie lifetime.
const FBC_MAX_AGE_S = 90 * 24 * 60 * 60;

const hasWindow = () => typeof window !== 'undefined';

const readStore = () => {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
};

const writeStore = (value) => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* blocked */ }
};

export const readCookie = (name) => {
    try {
        const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
        return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
    } catch {
        return null;
    }
};

// Meta's click id cookie format: fb.<subdomain index>.<creation ms>.<fbclid>
export const buildFbc = (fbclid, ms = Date.now()) => `fb.1.${ms}.${fbclid}`;

const fresh = (touch) => !!touch && typeof touch.ts === 'number' && Date.now() - touch.ts < MAX_AGE_MS;

// Store the URL's utm_* / fbclid, if it has any. Safe to call more than once.
export function captureAttribution() {
    if (!hasWindow()) return;
    try {
        const params = new URLSearchParams(window.location.search);
        const touch = {};
        UTM_KEYS.forEach((k) => { if (params.get(k)) touch[k] = params.get(k); });
        const fbclid = params.get('fbclid');
        if (fbclid) touch.fbclid = fbclid;
        if (!Object.keys(touch).length) return;

        const now = Date.now();
        if (fbclid) {
            let fbc = readCookie('_fbc');
            // Keep an existing cookie for the same click (the Pixel may have set it).
            if (!fbc || !fbc.endsWith(`.${fbclid}`)) {
                fbc = buildFbc(fbclid, now);
                try {
                    document.cookie = `_fbc=${encodeURIComponent(fbc)}; max-age=${FBC_MAX_AGE_S}; path=/; SameSite=Lax`;
                } catch { /* cookies blocked */ }
            }
            touch.fbc = fbc;
        }
        touch.landing_page = `${window.location.origin}${window.location.pathname}`;
        touch.referrer = document.referrer || null;
        touch.ts = now;

        const store = readStore();
        writeStore({ first: store.first || touch, last: touch });
    } catch { /* never block the page */ }
}

// Everything a form or checkout might want to save. URL values win; the last
// stored touch (if under 30 days old) fills in when the URL has no tags.
export function getAttribution() {
    const out = { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null, fbclid: null, fbc: null, fbp: null, landing_page: null, referrer: null };
    if (!hasWindow()) return out;
    try {
        const params = new URLSearchParams(window.location.search);
        const urlHasTags = UTM_KEYS.some((k) => params.get(k)) || !!params.get('fbclid');
        const last = readStore().last;
        const touch = urlHasTags ? null : (fresh(last) ? last : null);
        UTM_KEYS.forEach((k) => { out[k] = (urlHasTags ? params.get(k) : touch?.[k]) || null; });
        out.fbclid = (urlHasTags ? params.get('fbclid') : touch?.fbclid) || null;
        out.fbc = readCookie('_fbc') || touch?.fbc || null;
        out.fbp = readCookie('_fbp');
        out.landing_page = touch?.landing_page || `${window.location.origin}${window.location.pathname}`;
        out.referrer = (touch ? touch.referrer : document.referrer) || null;
    } catch { /* return what we have */ }
    return out;
}

// Drop-in for `new URLSearchParams(window.location.search)` in the forms' UTM
// readers: the URL's own params, plus the stored utm_* when the URL has none.
export function utmSearchParams() {
    const params = new URLSearchParams(hasWindow() ? window.location.search : '');
    try {
        if (UTM_KEYS.some((k) => params.get(k))) return params;
        const a = getAttribution();
        UTM_KEYS.forEach((k) => { if (a[k]) params.set(k, a[k]); });
    } catch { /* URL params only */ }
    return params;
}

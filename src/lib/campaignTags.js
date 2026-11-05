// Campaign tags for the site's own analytics (the page_analytics table).
//
// Pure functions only. No network calls, no cookies, nothing personal.
//
//  - First-touch: the utm_* tags on the URL a visitor LANDED on are remembered for the
//    rest of the browser session, so later events (scroll, time on page, exit, button
//    clicks) carry the same tags as the page view.
//  - Ad click ids (fbclid, gclid ...) are never stored. We keep only a yes/no flag
//    (has_fbclid / has_gclid) and strip the ids from any URL or referrer we record.

export const FIRST_TOUCH_STORAGE_KEY = 'rra_first_touch';
export const MAX_TAG_LENGTH = 100;

// Query parameters that identify one individual ad click. Removed from stored URLs.
export const CLICK_ID_PARAMS = ['fbclid', 'gclid', 'wbraid', 'gbraid', 'msclkid', 'dclid'];

// utm tag -> whether it is lower-cased.
const UTM_KEYS = {
    utm_source: true,
    utm_medium: true,
    utm_campaign: false,
    utm_content: false,
    utm_term: false,
    utm_id: false,
};

const GOOGLE_CLICK_IDS = ['gclid', 'wbraid', 'gbraid'];

// Trim, drop control characters, cap the length. Returns null when nothing usable is left.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;
function cleanValue(value, lowerCase) {
    if (typeof value !== 'string') return null;
    let v = value.replace(CONTROL_CHARS, '').trim();
    if (!v) return null;
    if (v.length > MAX_TAG_LENGTH) v = v.slice(0, MAX_TAG_LENGTH).trim();
    if (!v) return null;
    return lowerCase ? v.toLowerCase() : v;
}

// Accepts "?a=b", "a=b" or "". Never throws.
function toParams(search) {
    try {
        return new URLSearchParams(typeof search === 'string' ? search : '');
    } catch {
        return new URLSearchParams('');
    }
}

/**
 * Read the campaign tags from a query string.
 * Returns only keys that have a value. Click-id VALUES are never returned, only booleans.
 */
export function readCampaignTags(search) {
    const params = toParams(search);
    const tags = {};
    for (const [key, lowerCase] of Object.entries(UTM_KEYS)) {
        const v = cleanValue(params.get(key), lowerCase);
        if (v) tags[key] = v;
    }
    const present = (name) => params.has(name) && (params.get(name) || '').trim() !== '';
    if (present('fbclid')) tags.has_fbclid = true;
    if (GOOGLE_CLICK_IDS.some(present)) tags.has_gclid = true;
    return tags;
}

/**
 * Remove ad click-id parameters from a URL (or any string with a query part).
 * Everything else is left byte-for-byte as it was: other params, their order, the
 * fragment. Strings with no query string (a bare referrer, a malformed URL) come back
 * unchanged. Never throws.
 */
export function stripClickIds(input) {
    if (typeof input !== 'string' || input.indexOf('?') === -1) return input;
    const hashAt = input.indexOf('#');
    const beforeHash = hashAt === -1 ? input : input.slice(0, hashAt);
    const hash = hashAt === -1 ? '' : input.slice(hashAt);
    const qAt = beforeHash.indexOf('?');
    if (qAt === -1) return input; // the "?" was inside the fragment
    const base = beforeHash.slice(0, qAt);
    const kept = beforeHash
        .slice(qAt + 1)
        .split('&')
        .filter((pair) => {
            if (!pair) return false;
            let name = pair.split('=')[0];
            try { name = decodeURIComponent(name); } catch { /* keep raw name */ }
            return !CLICK_ID_PARAMS.includes(name.trim().toLowerCase());
        });
    return base + (kept.length ? `?${kept.join('&')}` : '') + hash;
}

const KNOWN_KEYS = [...Object.keys(UTM_KEYS), 'has_fbclid', 'has_gclid', 'landing_path'];
function pickKnownKeys(obj) {
    const out = {};
    for (const key of KNOWN_KEYS) {
        if (obj[key] !== undefined && obj[key] !== null) out[key] = obj[key];
    }
    return out;
}

// Reads/writes the first-touch from sessionStorage; falls back to memory when storage is
// missing or throws (private modes, blocked cookies), so the session still stays consistent.
const memoryFallback = { value: null };

/**
 * The session's first-touch campaign tags (utm_*, has_fbclid, has_gclid, landing_path).
 * The first call in a session reads the landing URL and remembers the result; every
 * later call returns the same object, whatever page the visitor is on by then.
 */
export function getFirstTouch({
    search = '',
    pathname = '',
    storage = null,
    fallback = memoryFallback,
} = {}) {
    try {
        const raw = storage && storage.getItem(FIRST_TOUCH_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') return pickKnownKeys(parsed);
        }
    } catch { /* storage unavailable or corrupt: fall through */ }

    if (fallback.value) return fallback.value;

    const touch = readCampaignTags(search);
    const landing = cleanValue(pathname, false);
    if (landing) touch.landing_path = landing;

    fallback.value = touch;
    try {
        if (storage) storage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(touch));
    } catch { /* best effort */ }
    return touch;
}

/** Add the first-touch keys to an event's event_data. Keys the event already has are kept. */
export function mergeCampaignTags(eventData, firstTouch) {
    return { ...(firstTouch || {}), ...(eventData || {}) };
}

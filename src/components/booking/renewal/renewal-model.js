// Pure browser950 decoder transpiled from frozen private-renewal-contract.ts 1ad4ccccaa5f1a1c728bec15b77606462b878f05a03cd8ace7a7528494ce8b8e.
// No runtime dependency on the Admin repository; preserve canonical wire semantics.
const own = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && [Object.prototype, null].includes(Object.getPrototypeOf(v));
const exact = (v, keys) => own(v) && Reflect.ownKeys(v).length === keys.length && keys.every(k => { const d = Object.getOwnPropertyDescriptor(v, k); return d?.enumerable === true && Object.hasOwn(d, 'value'); });
const int = (v, min, max = 2147483647) => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
const one = (v, list) => typeof v === 'string' && list.includes(v);
const uuid = (v) => typeof v === 'string' && v.length === 36 && /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.exec(v)?.[0] === v;
const text = (v, min, max) => typeof v === 'string' && v.length >= min && v.length <= max && v === v.trim() && !/[\u0000-\u001f\u007f-\u009f\u2028\u2029\u202a-\u202e\u2066-\u2069]/u.test(v);
function bounded(v) {
    let nodes = 0;
    function visit(x, depth) {
        if (++nodes > 12000 || depth > 16)
            return false;
        if (x === null || typeof x === 'string' || typeof x === 'boolean')
            return true;
        if (typeof x === 'number')
            return Number.isFinite(x);
        if (Array.isArray(x)) {
            if (Object.getPrototypeOf(x) !== Array.prototype || Reflect.ownKeys(x).length !== x.length + 1)
                return false;
            for (let i = 0; i < x.length; i++) {
                const d = Object.getOwnPropertyDescriptor(x, String(i));
                if (!d?.enumerable || !Object.hasOwn(d, 'value') || !visit(d.value, depth + 1))
                    return false;
            }
            return true;
        }
        if (!own(x))
            return false;
        const keys = Reflect.ownKeys(x);
        return keys.every(k => typeof k === 'string' && (() => { const d = Object.getOwnPropertyDescriptor(x, k); return d?.enumerable === true && Object.hasOwn(d, 'value') && visit(d.value, depth + 1); })());
    }
    try {
        return visit(v, 0) && new TextEncoder().encode(JSON.stringify(v)).byteLength <= 1048576;
    }
    catch {
        return false;
    }
}
function date(s) { return /^\d{4}-\d{2}-\d{2}$/.exec(s)?.[0] === s && Number.isFinite(Date.parse(s + 'T00:00:00Z')) && new Date(s + 'T00:00:00Z').toISOString().slice(0, 10) === s; }
function stamp(v) { return typeof v === 'string' && v.length <= 40 && /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?(?:Z|[+-](?:0\d|1[0-5]):[0-5]\d)$/.exec(v)?.[0] === v && date(v.slice(0, 10)) && Number.isFinite(Date.parse(v)); }
function micros(s) { const m = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}:\d{2})$/.exec(s); return BigInt(Date.parse(m[1] + m[3])) * 1000n + BigInt((m[2] ?? '').padEnd(6, '0')); }
const deadline = (p, e, d) => stamp(p) && stamp(e) && int(d, 1, 365) && micros(e) - micros(p) === BigInt(d) * 86400000000n;
function same(a, b) {
    if (a === b)
        return true;
    if (Array.isArray(a) && Array.isArray(b))
        return a.length === b.length && a.every((v, i) => same(v, b[i]));
    if (!own(a) || !own(b))
        return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
}
const clone = (v) => structuredClone(v);
const priceKeys = ['currency', 'per_session_cents', 'sessions', 'discount_applied', 'first_session_hold_cents', 'rest_cents', 'total_cents'];
function price(v) {
    if (!exact(v, priceKeys) || v.currency !== 'AUD' || !int(v.sessions, 1, 104) || typeof v.discount_applied !== 'boolean' || !['per_session_cents', 'first_session_hold_cents', 'rest_cents', 'total_cents'].every(k => int(v[k], 0, 99999999)))
        return false;
    return v.first_session_hold_cents === v.per_session_cents && v.rest_cents === v.per_session_cents * (v.sessions - 1) && v.total_cents === v.per_session_cents * v.sessions;
}
export function isRenewalOfferToken(v) { return typeof v === 'string' && v.length === 69 && /^pro1\.[a-f0-9]{64}$/.exec(v)?.[0] === v; }
export function isRenewalFamilyReview(v) {
    if (typeof v !== 'string' || v.length > 89 || /^rrf1\.[a-f0-9]{64}\.[1-9][0-9]{0,18}$/.exec(v)?.[0] !== v)
        return false;
    return BigInt(v.split('.')[2]) <= 9223372036854775807n;
}
export function isRenewalFamilyFields(v, accept = false) {
    return bounded(v) && exact(v, ['parent', 'note', 'confirm_players', 'consent_save_card']) && exact(v.parent, ['name', 'email', 'phone'])
        && text(v.parent.name, 1, 120) && text(v.parent.email, 5, 254) && v.parent.email === v.parent.email.toLowerCase() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.exec(v.parent.email)?.[0] === v.parent.email
        && text(v.parent.phone, 7, 30) && /^[+\d ()-]+$/.exec(v.parent.phone)?.[0] === v.parent.phone && typeof v.note === 'string' && v.note.length <= 3000 && v.note === v.note.trim() && !/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/u.test(v.note)
        && typeof v.confirm_players === 'boolean' && typeof v.consent_save_card === 'boolean' && (!accept || v.confirm_players === true && v.consent_save_card === true);
}
export function isRenewalDeclineFields(v) { return bounded(v) && exact(v, ['reason']) && text(v.reason, 0, 300); }
const offerKeys = ['schema_version', 'view_kind', 'offer_id', 'state', 'centre', 'coach', 'participants', 'goals', 'dates', 'duration_minutes', 'hold_days', 'prepared_real_at', 'expires_real_at', 'price', 'recipient_hint', 'consent_version', 'participant_confirmation_required', 'card_consent_required'];
const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit' });
function offer(v) {
    if (!exact(v, offerKeys) || v.schema_version !== 1 || v.view_kind !== 'renewal_offer' || !uuid(v.offer_id) || v.state !== 'issued'
        || !exact(v.centre, ['key', 'name']) || !one(v.centre.key, ['mickleham', 'cranbourne-north']) || !text(v.centre.name, 1, 200)
        || !exact(v.coach, ['name', 'slug']) || !text(v.coach.name, 1, 200) || !text(v.coach.slug, 1, 200) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(v.coach.slug)?.[0] !== v.coach.slug
        || !Array.isArray(v.participants) || v.participants.length < 1 || v.participants.length > 4 || !v.participants.every((p, i) => exact(p, ['ordinal', 'name', 'age_years', 'age_basis']) && p.ordinal === i + 1 && text(p.name, 1, 120) && int(p.age_years, 0, 120) && one(p.age_basis, ['verified_dob', 'retained_approximate']))
        || !Array.isArray(v.goals) || v.goals.length > 4 || new Set(v.goals).size !== v.goals.length || !v.goals.every(g => text(g, 1, 80) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(g)?.[0] === g)
        || ![60, 90, 120].includes(v.duration_minutes) || !deadline(v.prepared_real_at, v.expires_real_at, v.hold_days) || !price(v.price)
        || !text(v.recipient_hint, 7, 254) || /^[^@\s*]\*{3}@[^@\s*]+\.[^@\s*]+$/u.exec(v.recipient_hint)?.[0] !== v.recipient_hint
        || v.consent_version !== 'private_save_card_v1' || v.participant_confirmation_required !== true || v.card_consent_required !== true || !Array.isArray(v.dates) || v.dates.length < 1 || v.dates.length > 104 || v.dates.length !== v.price.sessions)
        return false;
    const ds = v.dates;
    if (!ds.every((d, i) => exact(d, ['ordinal', 'starts_at', 'ends_at', 'venue']) && d.ordinal === i + 1 && stamp(d.starts_at) && stamp(d.ends_at) && micros(d.ends_at) - micros(d.starts_at) === BigInt(v.duration_minutes) * 60000000n && text(d.venue, 1, 200) && d.venue === ds[0].venue && (i === 0 || micros(d.starts_at) >= micros(ds[i - 1].ends_at))))
        return false;
    return micros(v.expires_real_at) <= micros(ds[0].starts_at) && new Set(ds.map(d => localDate.format(new Date(d.starts_at)))).size === ds.length;
}
function unavailable(v) { return exact(v, ['schema_version', 'view_kind', 'offer_id', 'state', 'expires_real_at']) && v.schema_version === 1 && v.view_kind === 'renewal_offer_unavailable' && uuid(v.offer_id) && one(v.state, ['expired', 'closed']) && stamp(v.expires_real_at); }
export function decodeRenewalPreview(raw) { try {
    return bounded(raw) && (offer(raw) || unavailable(raw)) ? clone(raw) : null;
}
catch {
    return null;
} }
const codes = ['release_off', 'not_due', 'source_review', 'funding_review', 'provider_review', 'delivery_review', 'active_offer', 'successor_exists', 'unavailable', 'price_changed', 'expired', 'predecessor_changed', 'limit'];
export function decodeRenewalQuote(raw, ref) {
    try {
        if (!bounded(raw) || !own(raw) || ref && (!bounded(ref) || !exact(ref, ['offer', 'fields']) || !offer(ref.offer) || !isRenewalFamilyFields(ref.fields)))
            return null;
        if (raw.state === 'blocked')
            return exact(raw, ['schema_version', 'state', 'offer_id', 'code']) && raw.schema_version === 1 && uuid(raw.offer_id) && one(raw.code, codes) && (!ref || raw.offer_id === ref.offer.offer_id) ? clone(raw) : null;
        if (!exact(raw, ['schema_version', 'state', 'offer', 'fields', 'review', 'review_expires_at', 'price']) || raw.schema_version !== 1 || raw.state !== 'quoted' || !offer(raw.offer) || !isRenewalFamilyFields(raw.fields, true) || !isRenewalFamilyReview(raw.review) || !stamp(raw.review_expires_at) || !price(raw.price) || !same(raw.price, raw.offer.price))
            return null;
        if (micros(raw.review_expires_at) > micros(raw.offer.expires_real_at) || micros(raw.review_expires_at) <= micros(raw.offer.prepared_real_at) || BigInt(raw.review.split('.')[2]) !== micros(raw.review_expires_at))
            return null;
        return !ref || same(raw.offer, ref.offer) && same(raw.fields, ref.fields) ? clone(raw) : null;
    }
    catch {
        return null;
    }
}
const receiptKeys = ['schema_version', 'saved', 'operation', 'nonce', 'offer_id', 'state', 'at', 'hold_days', 'prepared_real_at', 'expires_real_at', 'new_request_id'];
function reference(ref) { return bounded(ref) && exact(ref, ['offerId', 'nonce', 'operation']) && uuid(ref.offerId) && uuid(ref.nonce) && one(ref.operation, ['accept', 'decline']); }
export function decodeRenewalReceipt(raw, ref) {
    try {
        if (!bounded(raw) || !reference(ref) || !exact(raw, receiptKeys) || raw.schema_version !== 1 || raw.saved !== true || raw.operation !== ref.operation || raw.nonce !== ref.nonce || raw.offer_id !== ref.offerId || !stamp(raw.at) || !deadline(raw.prepared_real_at, raw.expires_real_at, raw.hold_days) || micros(raw.at) < micros(raw.prepared_real_at))
            return null;
        return ref.operation === 'accept' ? raw.state === 'accepted' && uuid(raw.new_request_id) ? clone(raw) : null : raw.state === 'declined' && raw.new_request_id === null ? clone(raw) : null;
    }
    catch {
        return null;
    }
}
export function decodeRenewalOriginalReceipt(raw, ref) {
    try {
        if (!bounded(raw) || !reference(ref) || !exact(raw, ['schema_version', 'state', 'receipt']) || raw.schema_version !== 1)
            return null;
        if (raw.state === 'missing')
            return raw.receipt === null ? clone(raw) : null;
        if (raw.state !== 'found')
            return null;
        const receipt = decodeRenewalReceipt(raw.receipt, ref);
        return receipt ? { schema_version: 1, state: 'found', receipt } : null;
    }
    catch {
        return null;
    }
}
const requestStates = ['checkout', 'requested', 'venue_told', 'confirmed', 'declined', 'expired', 'cancelled'];
const paymentStates = ['checkout_pending', 'setup_pending', 'authorized', 'card_saved', 'covered', 'capture_pending', 'capture_failed', 'rest_pending', 'paid', 'owing', 'release_pending', 'released', 'reconcile'];
function checkout(v) {
    if (typeof v !== 'string' || v.length > 4096 || /[\u0000-\u0020\u007f-\u009f]/u.test(v) || /^[^#]*\?/.test(v))
        return false;
    try {
        const u = new URL(v);
        return u.origin === 'https://checkout.stripe.com' && !u.username && !u.password && !u.search && /^\/c\/pay\/cs_(?:test|live)_[A-Za-z0-9]+$/.exec(u.pathname)?.[0] === u.pathname;
    }
    catch {
        return false;
    }
}
export function decodeRenewalCurrent(raw, ref) {
    try {
        if (!bounded(raw))
            return null;
        if (ref && (!bounded(ref) || !(exact(ref, ['offerId']) || exact(ref, ['offerId', 'requestId']))))
            return null;
        if (ref && (!uuid(ref.offerId) || ref.requestId !== undefined && !uuid(ref.requestId)))
            return null;
        if (unavailable(raw))
            return !ref || raw.offer_id === ref.offerId ? clone(raw) : null;
        if (!exact(raw, ['schema_version', 'view_kind', 'offer_id', 'request_id', 'revision', 'request_state', 'payment_state', 'checkout_state', 'checkout_url']) || raw.schema_version !== 1 || raw.view_kind !== 'renewal_successor_current' || !uuid(raw.offer_id) || !uuid(raw.request_id) || !int(raw.revision, 1) || !one(raw.request_state, requestStates) || !one(raw.payment_state, paymentStates) || !one(raw.checkout_state, ['none', 'preparing', 'ready', 'closed']) || ref && (raw.offer_id !== ref.offerId || ref.requestId !== undefined && raw.request_id !== ref.requestId))
            return null;
        if (['setup_pending', 'card_saved', 'covered'].includes(raw.payment_state) || raw.request_state === 'checkout' && !['checkout_pending', 'reconcile'].includes(raw.payment_state) || ['requested', 'venue_told', 'confirmed'].includes(raw.request_state) && raw.payment_state === 'checkout_pending')
            return null;
        if ((raw.checkout_state === 'ready') !== (raw.checkout_url !== null) || raw.checkout_url !== null && !checkout(raw.checkout_url))
            return null;
        if (['ready', 'preparing'].includes(raw.checkout_state) && (raw.request_state !== 'checkout' || raw.payment_state !== 'checkout_pending'))
            return null;
        return clone(raw);
    }
    catch {
        return null;
    }
}

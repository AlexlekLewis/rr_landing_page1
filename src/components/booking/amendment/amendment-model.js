// Generated from the shared pure 952 TypeScript decoder.
const object = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v, keys) => object(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
const full = (re, s) => re.exec(s)?.[0] === s;
const uuid = (v) => typeof v === 'string' && full(/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/, v);
const integer = (v, min = 0, max = 99999999) => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
const hasC0 = (value, allowTextBreaks = false) => [...value].some(point => { const code = point.codePointAt(0); return code < 32 && (!allowTextBreaks || code !== 9 && code !== 10); });
const hasControl = (value, allowTextBreaks = false) => hasC0(value, allowTextBreaks) || value.includes(String.fromCharCode(127));
const text = (v, min, max) => typeof v === 'string' && v.length >= min && v.length <= max && v === v.trim() && !hasControl(v);
const bounded = (v) => { try {
    return new TextEncoder().encode(JSON.stringify(v)).byteLength <= 1048576;
}
catch {
    return false;
} };
function micros(v) { if (typeof v !== 'string')
    return null; const m = /^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)(?:\.(\d{1,6}))?(Z|[+-]\d\d:\d\d)$/.exec(v); if (!m || m[0] !== v)
    return null; const base = Date.parse(m[1] + 'Z'), time = Date.parse(m[1] + m[3]); if (!Number.isFinite(base) || !Number.isFinite(time) || new Date(base).toISOString().slice(0, 19) !== m[1])
    return null; return BigInt(time) * 1000n + BigInt((m[2] ?? '').padEnd(6, '0')); }
const stamp = (v) => micros(v) !== null;
const sameTime = (a, b) => micros(a) !== null && micros(a) === micros(b);
export const isAmendmentToken = (v) => typeof v === 'string' && full(/^[a-f0-9]{64}$/, v);
export const isAmendmentFamilyReview = (v) => typeof v === 'string' && full(/^lr1\.[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/, v);
function family(v, consent, confirmed) { return exact(v, ['parent', 'note', 'confirm_players', 'consent_save_card']) && exact(v.parent, ['name', 'email', 'phone']) && text(v.parent.name, 1, 120) && text(v.parent.email, 5, 254) && v.parent.email === v.parent.email.toLowerCase() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.parent.email) && text(v.parent.phone, 7, 30) && typeof v.note === 'string' && v.note.length <= 3000 && v.note === v.note.trim() && !hasControl(v.note, true) && v.consent_save_card === consent && typeof v.confirm_players === 'boolean' && (!confirmed || v.confirm_players); }
export const isAmendmentFamilyFields = (v, accepting = false) => family(v, accepting, true);
function price(v) { return exact(v, ['currency', 'per_session_cents', 'sessions', 'discount_applied', 'first_session_hold_cents', 'rest_cents', 'total_cents']) && v.currency === 'AUD' && integer(v.per_session_cents, 50) && integer(v.sessions, 1, 104) && typeof v.discount_applied === 'boolean' && integer(v.first_session_hold_cents, 50) && integer(v.rest_cents) && integer(v.total_cents, 50) && v.first_session_hold_cents === v.per_session_cents && v.total_cents === v.per_session_cents * v.sessions && v.rest_cents === v.total_cents - v.first_session_hold_cents; }
const localDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit' });
function terms(v) { if (!exact(v, ['duration_minutes', 'price', 'dates']) || ![60, 90, 120].includes(v.duration_minutes) || !price(v.price) || !Array.isArray(v.dates) || v.dates.length !== v.price.sessions)
    return false; const dates = v.dates; return dates.every((d, n) => exact(d, ['ordinal', 'starts_at', 'ends_at', 'venue']) && d.ordinal === n + 1 && stamp(d.starts_at) && stamp(d.ends_at) && text(d.venue, 1, 200) && micros(d.ends_at) - micros(d.starts_at) === BigInt(v.duration_minutes) * 60000000n && (!n || stamp(dates[n - 1]?.ends_at) && micros(d.starts_at) >= micros(dates[n - 1].ends_at))) && new Set(dates.map(d => localDay.format(new Date(d.starts_at)))).size === dates.length; }
function retainedStarts(a, b) { return a.dates.length === b.dates.length && a.dates.every((d, n) => sameTime(d.starts_at, b.dates[n].starts_at)); }
function amendment(v) { return exact(v, ['schema_version', 'amendment_id', 'centre', 'coach', 'participants', 'old_terms', 'new_terms']) && v.schema_version === 1 && uuid(v.amendment_id) && exact(v.centre, ['key', 'name']) && ['mickleham', 'cranbourne-north'].includes(v.centre.key) && text(v.centre.name, 1, 200) && exact(v.coach, ['name']) && text(v.coach.name, 1, 200) && Array.isArray(v.participants) && v.participants.length >= 1 && v.participants.length <= 4 && v.participants.every((p, n) => exact(p, ['ordinal', 'name', 'age_years']) && p.ordinal === n + 1 && text(p.name, 1, 120) && integer(p.age_years, 0, 120)) && terms(v.old_terms) && terms(v.new_terms) && v.old_terms.duration_minutes !== v.new_terms.duration_minutes && retainedStarts(v.old_terms, v.new_terms); }
const same = (a, b) => { if (!object(a) || !object(b))
    return Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((v, n) => same(v, b[n])) : a === b; const keys = Object.keys(a); return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && same(a[k], b[k])); };
function unavailable(raw, id) { return exact(raw, ['schema_version', 'state', 'amendment_id', 'code']) && raw.schema_version === 1 && raw.state === 'unavailable' && uuid(raw.amendment_id) && (!id || raw.amendment_id === id) && ['closed', 'unavailable', 'price_or_dates_changed', 'not_submitted', 'review'].includes(raw.code); }
export function decodeAmendmentPreview(raw, amendmentId) { if (!bounded(raw))
    return null; if (unavailable(raw, amendmentId))
    return raw; return exact(raw, ['schema_version', 'state', 'amendment', 'fields']) && raw.schema_version === 1 && raw.state === 'available' && amendment(raw.amendment) && (!amendmentId || raw.amendment.amendment_id === amendmentId) && family(raw.fields, false, false) && raw.fields.confirm_players === false ? raw : null; }
export function decodeAmendmentQuote(raw, ref) { if (!bounded(raw))
    return null; if (unavailable(raw, ref?.amendment.amendment_id))
    return raw; if (!exact(raw, ['schema_version', 'state', 'amendment', 'fields', 'review', 'expires_real_at']) || raw.schema_version !== 1 || raw.state !== 'ready' || !amendment(raw.amendment) || !family(raw.fields, false, true) || !isAmendmentFamilyReview(raw.review) || !stamp(raw.expires_real_at))
    return null; if (ref && (!same(raw.amendment, ref.amendment) || !same(raw.fields, ref.fields)))
    return null; return raw; }
export function decodeAmendmentSubmissionReceipt(raw, ref) { if (!bounded(raw) || !uuid(ref.amendmentId) || !uuid(ref.nonce) || !exact(raw, ['schema_version', 'amendment_id', 'nonce', 'outcome', 'request_id']) || raw.schema_version !== 1 || raw.amendment_id !== ref.amendmentId || raw.nonce !== ref.nonce || !['accepted', 'needs_review', 'unavailable'].includes(raw.outcome) || (raw.outcome === 'accepted' ? !uuid(raw.request_id) : raw.request_id !== null))
    return null; return raw; }
export function decodeAmendmentOriginalReceipt(raw, ref) { if (!bounded(raw))
    return null; if (exact(raw, ['schema_version', 'receipt_state']) && raw.schema_version === 1 && raw.receipt_state === 'not_found')
    return raw; if (!exact(raw, ['schema_version', 'receipt_state', 'receipt']) || raw.schema_version !== 1 || raw.receipt_state !== 'found')
    return null; const r = decodeAmendmentSubmissionReceipt(raw.receipt, ref); return r ? { schema_version: 1, receipt_state: 'found', receipt: r } : null; }
export function decodeAmendmentCurrent(raw, ref) {
    if (!bounded(raw) || !uuid(ref.amendmentId) || ref.requestId !== undefined && !uuid(ref.requestId))
        return null;
    if (unavailable(raw, ref.amendmentId))
        return raw;
    if (!exact(raw, ['schema_version', 'view_kind', 'amendment_id', 'request_id', 'revision', 'request_state', 'payment_state', 'checkout_state', 'checkout_url']) || raw.schema_version !== 1 || raw.view_kind !== 'amendment_successor_current' || raw.amendment_id !== ref.amendmentId || !uuid(raw.request_id) || ref.requestId !== undefined && raw.request_id !== ref.requestId || !integer(raw.revision, 1, 2147483647) || !['checkout', 'requested', 'venue_told', 'confirmed', 'declined', 'expired', 'cancelled'].includes(raw.request_state) || !['checkout_pending', 'authorized', 'capture_pending', 'capture_failed', 'rest_pending', 'paid', 'owing', 'release_pending', 'released', 'reconcile'].includes(raw.payment_state) || !['none', 'preparing', 'ready', 'closed'].includes(raw.checkout_state))
        return null;
    if (raw.request_state === 'checkout' && !['checkout_pending', 'reconcile'].includes(raw.payment_state) || ['requested', 'venue_told', 'confirmed'].includes(raw.request_state) && raw.payment_state === 'checkout_pending')
        return null;
    if ((raw.checkout_state === 'ready') !== (raw.checkout_url !== null) || ['ready', 'preparing'].includes(raw.checkout_state) && (raw.request_state !== 'checkout' || raw.payment_state !== 'checkout_pending') || raw.request_state !== 'checkout' && ['ready', 'preparing'].includes(raw.checkout_state))
        return null;
    if (raw.checkout_url !== null) {
        if (typeof raw.checkout_url !== 'string' || raw.checkout_url.length > 2048 || (/\s/.test(raw.checkout_url) || hasC0(raw.checkout_url)))
            return null;
        try {
            const u = new URL(raw.checkout_url);
            if (u.origin !== 'https://checkout.stripe.com' || u.username || u.password || u.search || !full(/^\/c\/pay\/cs_(?:test|live)_[A-Za-z0-9]+$/, u.pathname) || !full(/^#[A-Za-z0-9!#$%&'()*+,\-./:;=?@_~]*$|^$/, u.hash))
                return null;
        }
        catch {
            return null;
        }
    }
    return raw;
}

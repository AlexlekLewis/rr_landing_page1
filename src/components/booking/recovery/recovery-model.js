// Generated pure wire projections. Run scripts/generate-recovery-model.mjs; do not edit.
// Canonical source SHA256: d647a34f0d628fe57e19c427865165a1c0edbaf8fab0e379a1cbb8282e882455
/* eslint-disable no-control-regex -- Reject literal controls in public provider URLs. */
const requestCodec = (() => {
class PublicFailure extends Error {
}
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const token = /^[a-f0-9]{64}$/;
function fail(code = 'invalid_request', status = 400) { throw new PublicFailure(code, status); }
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value) ? value : fail();
const text = (value, min, max) => typeof value === 'string' && value.length <= max && value.trim().length >= min ? value.trim() : fail();
const integer = (value, min, max = Number.MAX_SAFE_INTEGER) => typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max ? value : fail();
const choice = (value, values) => typeof value === 'string' && values.includes(value) ? value : fail();
const id = (value) => typeof value === 'string' && uuid.test(value) ? value.toLowerCase() : fail();
function date(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(`${value}T00:00:00Z`)) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value)
        fail();
    return value;
}
function instant(value) {
    if (typeof value !== 'string' || value.length > 40 || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,6})?)?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.test(value) || !Number.isFinite(Date.parse(value)))
        fail();
    date(value.slice(0, 10));
    return value;
}
function priceProjection(raw) {
    const p = object(raw), per = integer(p.per_session_cents, 1), sessions = integer(p.sessions, 1, 104), first = integer(p.first_session_hold_cents, 0), rest = integer(p.rest_cents, 0), total = integer(p.total_cents, 1);
    const credit = p.credit_reserved_cents === undefined ? 0 : integer(p.credit_reserved_cents, 0), funding = p.funding_mode === undefined ? 'card' : choice(p.funding_mode, ['card', 'setup', 'covered', 'recorded']);
    if (typeof p.discount_applied !== 'boolean' || !Number.isSafeInteger(per * sessions) || per * sessions !== total || first + rest + credit !== total ||
        (funding === 'card' && first === 0) || (funding === 'setup' && (first !== 0 || rest === 0 || credit < per)) || (funding === 'covered' && (first !== 0 || rest !== 0 || credit !== total)) || (credit > 0 && p.funding_mode === undefined))
        fail();
    return { per_session_cents: per, sessions, discount_applied: p.discount_applied, first_session_hold_cents: first, rest_cents: rest, total_cents: total,
        ...(p.credit_reserved_cents === undefined ? {} : { credit_reserved_cents: credit }), ...(p.funding_mode === undefined ? {} : { funding_mode: funding }) };
}
function requestProjection(raw, includeToken, local) {
    const r = object(raw);
    if (r.state === 'needs_review')
        return { state: 'needs_review', receipt: id(r.receipt), server_now: instant(r.server_now), call_by: instant(r.call_by), call_by_plain: text(r.call_by_plain, 3, 150) };
    const state = choice(r.state, ['checkout', 'requested', 'venue_told', 'confirmed', 'declined', 'expired', 'cancelled']);
    const checkoutState = choice(r.checkout_state, ['preparing', 'ready', 'closed']), seconds = integer(r.expires_in_seconds, 0, 2678400);
    if (!Array.isArray(r.dates) || r.dates.length < 1 || r.dates.length > 104)
        fail();
    const dates = r.dates.map(item => { const d = object(item), start = instant(d.starts_at), end = instant(d.ends_at); if (Date.parse(end) <= Date.parse(start))
        fail(); return { date: date(d.date), starts_at: start, ends_at: end }; });
    const price = priceProjection(r.price);
    if (price.sessions !== dates.length)
        fail();
    const out = { request_id: id(r.request_id), state, server_now: instant(r.server_now), expires_at: r.expires_at === null ? null : instant(r.expires_at), expires_in_seconds: seconds, dates, price, checkout_state: checkoutState };
    if (r.funding_mode !== undefined) {
        const funding = choice(r.funding_mode, ['card', 'setup', 'covered', 'recorded']);
        if ((price.funding_mode !== undefined && price.funding_mode !== funding) || (['setup', 'covered'].includes(funding) && price.funding_mode !== funding))
            fail();
        out.funding_mode = funding;
    }
    if ((out.funding_mode ?? price.funding_mode) === 'covered' && state === 'checkout')
        fail();
    if (includeToken) {
        const returned = text(r.request_token, 64, 64);
        if (!token.test(returned))
            fail();
        out.request_token = returned;
    }
    if (r.confirm_by !== undefined && r.confirm_by !== null)
        out.confirm_by = instant(r.confirm_by);
    if (r.call_by_plain !== undefined && r.call_by_plain !== null)
        out.call_by_plain = text(r.call_by_plain, 3, 150);
    if (state === 'checkout' && checkoutState === 'ready' && seconds > 0) {
        if (typeof r.checkout_url !== 'string' || r.checkout_url.length > 4096)
            fail();
        const url = new URL(r.checkout_url);
        if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com' || url.port || url.username || url.password || (local && !url.pathname.includes('cs_test_')))
            fail();
        out.checkout_url = url.href;
    }
    return out;
}

return {requestProjection};
})();
const paymentCodec = (() => {
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const exact = (v, keys) => Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
function paymentRecoveryProjection(raw, local) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw))
        throw Error('recovery_result_invalid');
    const r = raw, ready = r.state === 'ready';
    if (!exact(r, ['schema_version', 'kind', 'request_id', 'state', 'payment_state', 'amount_cents', 'currency', ...(ready ? ['checkout_url', 'expires_at'] : [])]) ||
        r.schema_version !== 1 || r.kind !== 'remaining_payment' || typeof r.request_id !== 'string' || !UUID.test(r.request_id) ||
        !['preparing', 'ready', 'paid', 'expired', 'review'].includes(String(r.state)) || !['owing', 'paid', 'reconcile'].includes(String(r.payment_state)) ||
        (r.state === 'paid') !== (r.payment_state === 'paid') || (r.state === 'review') !== (r.payment_state === 'reconcile') || !Number.isSafeInteger(r.amount_cents) || Number(r.amount_cents) < 50 || Number(r.amount_cents) > 99999999 || r.currency !== 'aud')
        throw Error('recovery_result_invalid');
    if (ready) {
        if (typeof r.checkout_url !== 'string' || r.checkout_url.length > 4096 || /[\u0000-\u0020\u007f-\u009f]/.test(r.checkout_url) || r.checkout_url.split('#')[0].includes('?') || typeof r.expires_at !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}T/.test(r.expires_at) || !Number.isFinite(Date.parse(r.expires_at)))
            throw Error('recovery_result_invalid');
        const u = new URL(r.checkout_url);
        if (u.protocol !== 'https:' || u.hostname !== 'checkout.stripe.com' || u.port || u.username || u.password || u.search ||
            !new RegExp('^/c/pay/cs_' + (local ? 'test' : 'live') + '_[A-Za-z0-9]+$').test(u.pathname))
            throw Error('recovery_result_invalid');
        // Preserve the original signed/opaque Stripe fragment byte-for-byte.
        return { ...r };
    }
    return { ...r };
}

return {paymentRecoveryProjection};
})();
const lapsedCodec = (() => {
// Pure output boundary. SQL owns capability scope, original receipt identity,
// availability and money. No reconstructed nonce, request token or authority.
const { requestProjection } = requestCodec;
const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
function fail() { throw Error('lapsed_result_invalid'); }
const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) ? v : fail();
const exact = (v, keys) => Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
const id = (v) => typeof v === 'string' && v.length === 36 && UUID.test(v) ? v : fail();
const integer = (v, min = 0, max = 99999999) => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max ? v : fail();
const day = (v) => { if (typeof v !== 'string' || v.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(v + 'T00:00:00Z')) || new Date(v + 'T00:00:00Z').toISOString().slice(0, 10) !== v)
    fail(); return v; };
const instant = (v) => { if (typeof v !== 'string' || v.length > 40 || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.test(v) || !Number.isFinite(Date.parse(v)))
    fail(); day(v.slice(0, 10)); return v; };
function melbourne(v) { const p = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(v)); const part = (key) => p.find(x => x.type === key).value; return { day: [part('year'), part('month'), part('day')].join('-'), time: [part('hour'), part('minute'), part('second')].join(':') }; }
function isLapsedReview(v) { return typeof v === 'string' && v.length === 40 && v.startsWith('lr1.') && UUID.test(v.slice(4)); }
function price(raw) { const p = object(raw); if (!exact(p, ['per_session_cents', 'sessions', 'discount_applied', 'first_session_hold_cents', 'rest_cents', 'total_cents']))
    fail(); const per = integer(p.per_session_cents, 1), sessions = integer(p.sessions, 1, 104), first = integer(p.first_session_hold_cents, 1), rest = integer(p.rest_cents), total = integer(p.total_cents, 1); if (typeof p.discount_applied !== 'boolean' || per * sessions !== total || first !== per || rest !== per * (sessions - 1))
    fail(); return { per_session_cents: per, sessions, discount_applied: p.discount_applied, first_session_hold_cents: first, rest_cents: rest, total_cents: total }; }
function lapsedQuoteProjection(raw, fields) {
    const v = object(raw);
    if (!exact(v, ['schema_version', 'kind', 'prior_request_id', 'review', 'expires_at', 'price', 'dates', 'decision_quote']) || v.schema_version !== 1 || v.kind !== 'lapsed_request_review' || !isLapsedReview(v.review))
        fail();
    const p = price(v.price), start = instant(fields.starts_at), first = melbourne(start), duration = integer(fields.duration_minutes, 60, 120), weeks = integer(fields.weeks, 1, 104);
    if (![60, 90, 120].includes(duration) || p.sessions > weeks || !Array.isArray(v.dates) || v.dates.length !== p.sessions || !Array.isArray(fields.skip_dates))
        fail();
    const skipped = new Set(fields.skip_dates.map(day));
    let previous = -Infinity;
    const dates = v.dates.map(item => {
        const d = object(item);
        if (!exact(d, ['date', 'starts_at', 'ends_at']))
            fail();
        const from = instant(d.starts_at), to = instant(d.ends_at), local = melbourne(from), date = day(d.date), gap = (Date.parse(date + 'T00:00:00Z') - Date.parse(first.day + 'T00:00:00Z')) / 86400000;
        if (Date.parse(to) - Date.parse(from) !== duration * 60000 || local.day !== date || local.time !== first.time || gap < 0 || gap % 7 !== 0 || gap >= weeks * 7 || skipped.has(date) || Date.parse(from) <= previous)
            fail();
        previous = Date.parse(from);
        return { date, starts_at: from, ends_at: to };
    });
    let decision = null;
    if (v.decision_quote !== null) {
        const d = object(v.decision_quote);
        if (!exact(d, ['kind', 'quoted_at', 'confirm_by']) || d.kind !== 'policy_quote')
            fail();
        const quoted = instant(d.quoted_at), confirm = instant(d.confirm_by);
        if (Date.parse(confirm) <= Date.parse(quoted))
            fail();
        decision = { kind: 'policy_quote', quoted_at: quoted, confirm_by: confirm };
    }
    return { schema_version: 1, kind: 'lapsed_request_review', prior_request_id: id(v.prior_request_id), review: v.review, expires_at: instant(v.expires_at), price: p, dates, decision_quote: decision };
}
function checkoutUrl(value, local) {
    if (typeof value !== 'string' || value.length > 4096 || /[\u0000-\u0020\u007f-\u009f]/.test(value) || value.split('#', 1)[0].includes('?'))
        fail();
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.hostname !== 'checkout.stripe.com' || u.port || u.username || u.password || u.search || !new RegExp('^/c/pay/cs_' + (local ? 'test' : 'live') + '_[A-Za-z0-9]+$').test(u.pathname))
        fail();
    return value;
}
/** Canonical public row, with no request-token minting and no service extras.
 * Known canonical players are deliberately discarded by requestProjection. */
function canonical(raw, local, initial) {
    const r = object(raw);
    if (r.state === 'needs_review') {
        if (!exact(r, ['state', 'receipt', 'server_now', 'call_by', 'call_by_plain']))
            fail();
        return requestProjection(r, false, local);
    }
    const required = ['request_id', 'state', 'payment_state', 'revision', 'server_now', 'expires_at', 'expires_in_seconds', 'dates', 'price', 'checkout_state'];
    const optional = ['funding_mode', 'players', 'confirm_by', 'call_by_plain', 'checkout_url'];
    if (required.some(k => !Object.hasOwn(r, k)) || Object.keys(r).some(k => ![...required, ...optional].includes(k)))
        fail();
    if (r.funding_mode !== 'card')
        fail();
    const p = object(r.price);
    if (p.funding_mode !== undefined && p.funding_mode !== 'card' || p.credit_reserved_cents !== undefined && p.credit_reserved_cents !== 0)
        fail();
    const priceKeys = ['per_session_cents', 'sessions', 'discount_applied', 'first_session_hold_cents', 'rest_cents', 'total_cents'];
    if (Object.keys(p).some(k => ![...priceKeys, 'funding_mode', 'credit_reserved_cents', 'actual_dates', 'skipped_dates', 'flagged'].includes(k)))
        fail();
    if (p.actual_dates !== undefined) {
        if (!Array.isArray(p.actual_dates) || p.actual_dates.length > 104)
            fail();
        for (const value of p.actual_dates) {
            const d = object(value);
            if (!exact(d, ['date', 'starts_at', 'ends_at']))
                fail();
            day(d.date);
            const a = instant(d.starts_at), z = instant(d.ends_at);
            if (Date.parse(z) <= Date.parse(a))
                fail();
        }
    }
    if (p.skipped_dates !== undefined) {
        if (!Array.isArray(p.skipped_dates) || p.skipped_dates.length > 104)
            fail();
        p.skipped_dates.forEach(day);
    }
    if (p.flagged !== undefined) {
        if (!Array.isArray(p.flagged) || p.flagged.length > 104)
            fail();
        for (const value of p.flagged) {
            const d = object(value);
            if (!exact(d, ['date', 'kind', 'reason_plain']) || typeof d.kind !== 'string' || d.kind.length < 1 || d.kind.length > 100 || typeof d.reason_plain !== 'string' || d.reason_plain.length < 1 || d.reason_plain.length > 500)
                fail();
            day(d.date);
        }
    }
    price(Object.fromEntries(priceKeys.map(k => [k, p[k]])));
    if (initial && (r.state !== 'checkout' || r.payment_state !== 'checkout_pending' || r.checkout_state !== 'preparing' || r.checkout_url !== undefined && r.checkout_url !== null))
        fail();
    if (!['checkout_pending', 'authorized', 'capture_pending', 'capture_failed', 'rest_pending', 'owing', 'paid', 'reconcile', 'release_pending', 'released'].includes(String(r.payment_state)))
        fail();
    integer(r.revision, 1, Number.MAX_SAFE_INTEGER);
    if (!Array.isArray(r.dates))
        fail();
    for (const value of r.dates) {
        const d = object(value);
        if (!exact(d, ['date', 'starts_at', 'ends_at']))
            fail();
    }
    const out = requestProjection(r, false, local);
    out.payment_state = r.payment_state;
    out.revision = r.revision;
    if (r.state === 'checkout' && r.checkout_state === 'ready') {
        if (r.payment_state !== 'checkout_pending' || !(Number(r.expires_in_seconds) > 0))
            fail();
        out.checkout_url = checkoutUrl(r.checkout_url, local);
    }
    else if (r.checkout_url !== undefined && r.checkout_url !== null)
        fail();
    return out;
}
function lapsedReceiptProjection(raw, local) {
    const v = object(raw);
    if (v.schema_version !== 1)
        fail();
    if (v.receipt_state === 'not_found') {
        if (!exact(v, ['schema_version', 'receipt_state']))
            fail();
        return { schema_version: 1, receipt_state: 'not_found' };
    }
    if (!exact(v, ['schema_version', 'receipt_state', 'receipt']) || v.receipt_state !== 'found')
        fail();
    const r = object(v.receipt);
    if (!exact(r, ['schema_version', 'receipt_kind', 'prior_request_id', 'nonce', 'outcome', 'request_id', 'result']) || r.schema_version !== 1 || r.receipt_kind !== 'original_lapsed_submission' || !['accepted', 'needs_review', 'unavailable'].includes(String(r.outcome)))
        fail();
    const prior = id(r.prior_request_id), nonce = id(r.nonce);
    let result = null, request = null;
    if (r.outcome === 'accepted') {
        request = id(r.request_id);
        if (request === prior)
            fail();
        result = canonical(r.result, local, true);
        if (result.request_id !== request)
            fail();
    }
    else if (r.outcome === 'needs_review') {
        if (r.request_id !== null)
            fail();
        result = canonical(r.result, local, true);
        if (result.state !== 'needs_review' || result.receipt !== nonce)
            fail();
    }
    else if (r.request_id !== null || r.result !== null)
        fail();
    return { schema_version: 1, receipt_state: 'found', receipt: { schema_version: 1, receipt_kind: 'original_lapsed_submission', prior_request_id: prior, nonce, outcome: r.outcome, request_id: request, result } };
}
function lapsedCurrentProjection(raw, local) { const v = object(raw); if (!exact(v, ['schema_version', 'kind', 'prior_request_id', 'request']) || v.schema_version !== 1 || v.kind !== 'fresh_request')
    fail(); const prior = id(v.prior_request_id), request = v.request === null ? null : canonical(v.request, local, false); if (request && (request.state === 'needs_review' || request.request_id === prior))
    fail(); return { schema_version: 1, kind: 'fresh_request', prior_request_id: prior, request }; }

return {isLapsedReview,lapsedQuoteProjection,lapsedReceiptProjection,lapsedCurrentProjection};
})();
export const {paymentRecoveryProjection} = paymentCodec;
export const {isLapsedReview,lapsedQuoteProjection,lapsedReceiptProjection,lapsedCurrentProjection} = lapsedCodec;

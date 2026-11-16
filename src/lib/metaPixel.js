// Meta Pixel (3125499870991789) wrapper. The base code (fbq init + the first
// PageView) lives in index.html; everything else goes through here.
//
// Every call is a no-op when fbq is missing (ad blocker, prerender, tests) and
// never throws: analytics must never block a family's sign-up.
// Send program, centre and price only, never a name, email, phone or age.

// One id per event, shared by the browser event and the matching Conversions
// API event so Meta counts them once. Purchase uses the Stripe Checkout Session
// id instead (see api/_lib/metaCapi.js).
export function newEventId() {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    } catch { /* fall through */ }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

const send = (method, event, params, opts) => {
    try {
        if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false;
        if (opts?.eventID) window.fbq(method, event, params || {}, { eventID: opts.eventID });
        else window.fbq(method, event, params || {});
        return true;
    } catch {
        return false;
    }
};

// Standard event (PageView, Lead, InitiateCheckout, Purchase, ...).
export const track = (event, params, opts) => send('track', event, params, opts);

// Custom event name.
export const trackCustom = (event, params, opts) => send('trackCustom', event, params, opts);

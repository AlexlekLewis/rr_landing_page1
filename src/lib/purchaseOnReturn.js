// Fire the Meta Purchase event on a success page — but ONLY when the visitor
// actually came back from a completed Stripe payment.
//
// Rule: no `session_id` in the URL → nothing fires. A plain visit to a success
// page (bookmark, shared link, email) is never counted as a sale.
//
// With a session id we ask /api/get-stripe-payment (already used by the holiday
// success page) whether Stripe says it is paid and what was charged:
//   paid         → Purchase with the real amount
//   not paid     → nothing (async / processing payment)
//   unreachable  → Purchase with the page's known price (don't lose the sale)
// trackPurchase de-dupes per session id, so a reload never counts twice.
//
// Payment Links only add session_id if their "After payment → Redirect" URL in
// the Stripe Dashboard ends in ?session_id={CHECKOUT_SESSION_ID}.
import { trackPurchase } from './metaPixel';

export const getReturnSessionId = () => {
  try {
    const sid = new URLSearchParams(window.location.search).get('session_id') || '';
    // Stripe ids look like cs_live_… / cs_test_…; ignore an unreplaced template.
    return /^cs_[A-Za-z0-9_]+$/.test(sid) ? sid : '';
  } catch {
    return '';
  }
};

export const trackPurchaseOnReturn = async ({ program, fallbackValue, verify = true } = {}) => {
  try {
    const sessionId = getReturnSessionId();
    if (!sessionId) return false;
    try { if (sessionStorage.getItem(`px_purchase_${sessionId}`)) return false; } catch { /* ignore */ }

    let value = fallbackValue;
    if (verify) {
      try {
        const r = await fetch(`/api/get-stripe-payment?session_id=${encodeURIComponent(sessionId)}`);
        const data = r.ok ? await r.json() : null;
        if (data && data.payment_status && data.payment_status !== 'paid') return false;
        if (data && typeof data.amount_total === 'number' && data.amount_total > 0) value = data.amount_total / 100;
      } catch { /* unreachable — fall back to the known price */ }
    }
    return trackPurchase({ program, value, sessionId });
  } catch {
    return false;
  }
};

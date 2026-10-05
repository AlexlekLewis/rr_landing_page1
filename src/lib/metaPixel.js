// Meta Pixel helper — the ONLY place the site calls fbq() (besides the base code
// in index.html, which fires the first PageView). Pages import these helpers;
// never hand-write fbq calls.
//
// PRIVACY: these pages are about children. Events carry the program name, the
// centre and the price ONLY — never a name, email, phone, date of birth, a
// specific player's age, a suburb or any free text.
//
// Every call is wrapped so a missing/blocked pixel can never break a page.
const PIXEL_ID = '3125499870991789';
const fbq = (...a) => { try { if (typeof window !== 'undefined' && window.fbq) window.fbq(...a); } catch { /* never throw */ } };

export const trackPageView = () => fbq('track', 'PageView');

// A form was submitted (interest, entry, booking request, application).
export const trackLead = ({ program, centre, value } = {}) =>
  fbq('track', 'Lead', { content_name: program, content_category: centre, ...(value ? { value, currency: 'AUD' } : {}) });

// A booking reached Stripe Checkout.
export const trackCheckout = ({ program, value } = {}) =>
  fbq('track', 'InitiateCheckout', { content_name: program, value, currency: 'AUD' });

// Payment confirmed — call on the success page ONCE per Stripe session.
// Returns true when the event was sent (first time for this session id), false
// when it was a repeat (refresh, back button).
export const trackPurchase = ({ program, value, sessionId } = {}) => {
  const key = `px_purchase_${sessionId || program}`;
  try { if (sessionStorage.getItem(key)) return false; sessionStorage.setItem(key, '1'); } catch { /* storage blocked: still fire once per page load */ }
  fbq('track', 'Purchase', { content_name: program, value, currency: 'AUD' }, sessionId ? { eventID: sessionId } : undefined);
  return true;
};
export { PIXEL_ID };

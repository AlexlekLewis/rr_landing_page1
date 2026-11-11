import { isPrivateBookingPath } from './booking-privacy';
import { QA_PUBLIC_ORIGIN } from './private-runtime';

const productionOrigins = new Set(['https://rramelbourne.com', 'https://www.rramelbourne.com']);
const namespace = 'rra-private-booking-pixel';
const requestIdPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const pending = [];
const reported = new Set();
let frame;
let loaded = false;

export function bookingPixelTarget(origin, appEnv) {
  if (appEnv === 'test' && origin === QA_PUBLIC_ORIGIN) return 'test';
  if (appEnv !== 'test' && appEnv !== 'local' && productionOrigins.has(origin)) return 'meta';
  return null;
}

export function bookingPixelEvent(event, requestId, chargedCents) {
  if (event === 'PageView') return { namespace, event };
  if (typeof requestId !== 'string' || !requestIdPattern.test(requestId)) return null;
  const eventId = requestId.toLowerCase();
  if (event === 'InitiateCheckout' || event === 'Lead') return { namespace, event, eventId };
  if (event === 'Purchase' && Number.isSafeInteger(chargedCents) && chargedCents > 0 && chargedCents <= 999999999) {
    return { namespace, event, eventId, chargedCents };
  }
  return null;
}

function flush() {
  if (!loaded || !frame?.contentWindow) return;
  // The iframe has an opaque origin. The payload has already been reduced to
  // the event name, an opaque request ID and, for Purchase, the charged amount.
  while (pending.length) {
    const { payload, key } = pending.shift();
    frame.contentWindow.postMessage(payload, '*');
    if (payload.eventId) {
      try { window.localStorage.setItem(`${namespace}:${key}`, '1'); } catch { /* In-memory deduplication still applies. */ }
    }
  }
}

export function trackPrivateBooking(event, requestId, chargedCents) {
  const target = bookingPixelTarget(window.location.origin, import.meta.env.VITE_APP_ENV);
  if (!target || !isPrivateBookingPath(window.location.pathname) ||
      window.location.hash || typeof window.fbq === 'function') return;
  const payload = bookingPixelEvent(event, requestId, chargedCents);
  if (!payload) return;
  const key = payload.eventId ? `${payload.event}:${payload.eventId}` : `PageView:${window.location.pathname}`;
  if (reported.has(key)) return;
  if (target === 'test') {
    reported.add(key);
    window.dispatchEvent(new CustomEvent(namespace, { detail: payload }));
    return;
  }
  try {
    if (payload.eventId && window.localStorage.getItem(`${namespace}:${key}`)) return;
  } catch { /* Browser storage can be unavailable. */ }
  if (pending.length >= 20) return;
  reported.add(key);
  pending.push({ payload, key });
  if (!frame) {
    frame = document.createElement('iframe');
    frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.referrerPolicy = 'no-referrer';
    frame.src = '/private-booking-pixel.html';
    frame.addEventListener('load', () => { loaded = true; flush(); }, { once: true });
    document.body.appendChild(frame);
  }
  flush();
}

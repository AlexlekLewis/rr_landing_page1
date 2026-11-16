// ============================================================
// Meta Conversions API: server-side Purchase for every paid Stripe Checkout.
// ============================================================
// Called from api/stripe-webhook.js on checkout.session.completed. event_id is
// the Checkout Session id, the same eventID the success pages give the browser
// Pixel Purchase (JRT3Success, HolidayProgramSuccess, ...), so Meta counts a
// payment once even when both arrive. Payments whose success page never loads
// (closed tab, ad blocker, Payment Links with no Pixel) are now counted too.
//
// Personal data is SHA-256 hashed here before it leaves the server, as Meta
// requires; ip, user agent, fbc and fbp are sent as-is (Meta's rule) and only
// when the checkout stored them in session metadata (attributionMetadata below).
//
// Env (Vercel):
//   META_CAPI_ACCESS_TOKEN = Conversions API token from Events Manager. Unset → skipped.
//   META_TEST_EVENT_CODE   = optional, e.g. TEST12345, while checking in Test Events.
//
// Nothing here may break the webhook: sendMetaPurchase never throws, and times out fast.
// ============================================================

import crypto from 'node:crypto';

export const META_PIXEL_ID = '3125499870991789';
export const META_CAPI_URL = `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events`;
const SITE_URL = 'https://rramelbourne.com/';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

export const sha256 = (value) => crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');

export const normEmail = (email) => {
  const e = String(email || '').trim().toLowerCase();
  return e.includes('@') ? e : null;
};

// Digits only, with country code, no leading zero: 0412 345 678 → 61412345678.
// Numbers already in international form keep their country code.
export const normPhone = (phone) => {
  let d = String(phone || '').replace(/\D/g, '');
  if (!d) return null;
  if (d.startsWith('00')) d = d.slice(2);              // 0061 412 ...
  if (d.startsWith('610')) d = `61${d.slice(3)}`;      // +61 0412 ... (stray trunk zero)
  else if (d.length === 10 && d.startsWith('0')) d = `61${d.slice(1)}`; // 0412 345 678, 03 9xxx xxxx
  else if (d.length === 9 && /^[23478]/.test(d)) d = `61${d}`;          // 412 345 678
  return d.length >= 8 && d.length <= 15 ? d : null;
};

// Lowercase, letters and digits only (Meta: no punctuation, no spaces).
export const normText = (value) => {
  const t = String(value || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  return t || null;
};

export const splitName = (fullName) => {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: null, last: null };
  return { first: parts[0], last: parts.length > 1 ? parts[parts.length - 1] : null };
};

// Origin + path of the page the family lands on after paying, without the
// session id or other query values.
export const eventSourceUrl = (session, fallback) => {
  try {
    if (session?.success_url) {
      const u = new URL(session.success_url.replace('{CHECKOUT_SESSION_ID}', ''));
      return `${u.origin}${u.pathname}`;
    }
  } catch { /* fall through */ }
  return fallback || SITE_URL;
};

const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''));

export function buildUserData(session) {
  const cd = session?.customer_details || {};
  const addr = cd.address || {};
  const md = session?.metadata || {};
  const { first, last } = splitName(cd.name);
  const em = normEmail(cd.email || session?.customer_email);
  const ph = normPhone(cd.phone);
  const hashed = (v) => (v ? sha256(v) : null);
  return clean({
    em: em ? [sha256(em)] : null,
    ph: ph ? [sha256(ph)] : null,
    fn: hashed(normText(first)),
    ln: hashed(normText(last)),
    ct: hashed(normText(addr.city)),
    st: hashed(normText(addr.state)),
    zp: hashed(normText(addr.postal_code)),
    country: hashed(normText(addr.country)),
    client_ip_address: md.client_ip_address || null,
    client_user_agent: md.client_user_agent || null,
    fbc: md.fbc || null,
    fbp: md.fbp || null,
  });
}

export function buildPurchasePayload(session, { contentName, sourceUrl, testEventCode, now = Date.now() } = {}) {
  const event = {
    event_name: 'Purchase',
    event_time: Math.floor(now / 1000),
    event_id: session.id,
    action_source: 'website',
    event_source_url: eventSourceUrl(session, sourceUrl),
    user_data: buildUserData(session),
    custom_data: clean({
      value: typeof session.amount_total === 'number' ? session.amount_total / 100 : null,
      currency: 'aud',
      content_name: contentName || null,
    }),
  };
  return clean({ data: [event], test_event_code: testEventCode || null });
}

let warnedNoToken = false;

// Never throws. Resolves to a small status object for logs and tests.
export async function sendMetaPurchase(session, { contentName, sourceUrl, env = process.env, fetchImpl = globalThis.fetch, timeoutMs = 3000, now } = {}) {
  try {
    if (!session?.id || session.payment_status !== 'paid') return { skipped: 'not_paid' };
    const token = env.META_CAPI_ACCESS_TOKEN;
    if (!token) {
      if (!warnedNoToken) {
        console.log('Meta CAPI: META_CAPI_ACCESS_TOKEN is not set, server Purchase events are off.');
        warnedNoToken = true;
      }
      return { skipped: 'no_token' };
    }
    const payload = buildPurchasePayload(session, { contentName, sourceUrl, testEventCode: env.META_TEST_EVENT_CODE, now });
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const r = await fetchImpl(META_CAPI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Token in the body, not the URL, so it can't end up in a URL log.
        body: JSON.stringify({ ...payload, access_token: token }),
        signal: ctrl.signal,
      });
      if (!r.ok) {
        const text = await r.text().catch(() => '');
        console.error(`Meta CAPI Purchase ${session.id} failed: ${r.status} ${text.slice(0, 300)}`);
        return { ok: false, status: r.status };
      }
      return { ok: true };
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    console.error(`Meta CAPI Purchase ${session?.id} error:`, err?.message || err);
    return { ok: false, error: err?.message || String(err) };
  }
}

// For the site's own Checkout Sessions: what the webhook needs later to match
// the payment to the ad click. `attribution` is the browser's getAttribution()
// (src/lib/attribution.js), sent in the request body; ip and user agent come
// from the request. Only short strings within Stripe's metadata limits
// (key ≤ 40 chars, value ≤ 500 chars).
export function attributionMetadata(req, attribution) {
  const a = attribution && typeof attribution === 'object' ? attribution : {};
  const out = {};
  const put = (key, value, max) => {
    if (typeof value === 'string' && value.trim()) out[key] = value.trim().slice(0, max);
  };
  put('fbc', a.fbc, 255);
  put('fbp', a.fbp, 255);
  UTM_KEYS.forEach((k) => put(k, a[k], 200));
  const headers = req?.headers || {};
  const fwd = Array.isArray(headers['x-forwarded-for']) ? headers['x-forwarded-for'][0] : headers['x-forwarded-for'];
  put('client_ip_address', (fwd || '').split(',')[0] || headers['x-real-ip'], 64);
  put('client_user_agent', headers['user-agent'], 500);
  return out;
}

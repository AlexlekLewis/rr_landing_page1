import { parseCatalog, parsePrice, parseSlots, uuid, validDate } from './booking-model';
export class PublicBookingError extends Error {
  constructor(code = 'unavailable', status = 0, retryAfter = 0) { super(code); this.code = code; this.status = status; this.retryAfter = retryAfter; }
}
export function publicError(error) {
  if (error?.code === 'rate_limited') return 'There have been too many checks. Please wait a few minutes before trying again. Your draft is still here.';
  if (error?.code === 'verification_failed') return 'Please complete the security check again, then retry.';
  if (error?.code === 'under18_needs_parent') return 'A parent or guardian’s name is needed for a player under 18.';
  if (error?.code === 'slot_taken') return 'That time has just been taken. Choose another time at this centre.';
  if (error?.code === 'invalid_request') return 'Check the details and try again. Nothing has been confirmed.';
  return 'We couldn’t reach the booking service. Your draft is still here. Please try again.';
}
export function publicConfig(env = import.meta.env) {
  const raw = env.VITE_PRIVATE_BOOKING_URL;
  if (!raw || env.VITE_PRIVATE_BOOKING_MOCK === 'true') throw new PublicBookingError();
  let url; try { url = new URL(raw); } catch { throw new PublicBookingError(); }
  const local = ['local', 'test'].includes(env.VITE_APP_ENV);
  if (url.username || url.password || url.search || url.hash || url.pathname.replace(/\/$/, '') !== '/functions/v1' || (local ? !['localhost', '127.0.0.1'].includes(url.hostname) || url.protocol !== 'http:' || url.port !== '54321' : url.protocol !== 'https:')) throw new PublicBookingError();
  return { base: url.href.replace(/\/$/, ''), key: env.VITE_PRIVATE_BOOKING_KEY || '', local };
}
export function createPublicClient(env = import.meta.env, request = globalThis.fetch) {
  async function call(path, { body, nonce, signal } = {}) {
    const config = publicConfig(env), controller = new AbortController(), abort = () => controller.abort();
    if (signal?.aborted) controller.abort(); else signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(abort, 18000);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (config.key) Object.assign(headers, { apikey: config.key, Authorization: `Bearer ${config.key}` });
      if (nonce) { if (!uuid(nonce)) throw new PublicBookingError('invalid_request'); headers['Idempotency-Key'] = nonce; }
      const res = await request(`${config.base}/${path}`, { method: body ? 'POST' : 'GET', headers, ...(body ? { body: JSON.stringify(body) } : {}), signal: controller.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
      if (res.status === 429) {
        try { await res.body?.cancel(); } catch { /* The refusal still stops this operation. */ }
        throw new PublicBookingError('rate_limited', 429, Math.max(0, Number(res.headers.get('Retry-After')) || 0));
      }
      const raw = await res.text(); if (raw.length > 4194304) throw new PublicBookingError();
      let data; try { data = JSON.parse(raw); } catch { throw new PublicBookingError(); }
      if (!res.ok) {
        const error = new PublicBookingError(typeof data?.error?.code === 'string' ? data.error.code : typeof data?.code === 'string' ? data.code : 'unavailable', res.status, Number(res.headers.get('Retry-After')) || 0);
        const suggestions = data?.error?.nearest ?? data?.nearest;
        error.nearest = Array.isArray(suggestions) && body?.centre ? suggestions.filter(a => a && (!a.centre || a.centre === body.centre) && uuid(a.profile_id) && typeof a.starts_at === 'string' && Number.isFinite(Date.parse(a.starts_at)) && typeof a.ends_at === 'string' && Number.isFinite(Date.parse(a.ends_at))).slice(0, 8).map(a => ({ centre: body.centre, profile_id: a.profile_id, starts_at: a.starts_at, ends_at: a.ends_at })) : [];
        throw error;
      }
      return data;
    } catch (error) { if (error instanceof PublicBookingError) throw error; if (signal?.aborted) throw new DOMException('Aborted', 'AbortError'); throw new PublicBookingError(); }
    finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  }
  return {
    async catalog(signal) { try { return parseCatalog(await call('public-private-catalog', { signal })); } catch (error) { if (error instanceof PublicBookingError || error.name === 'AbortError') throw error; throw new PublicBookingError(); } },
    async slots(intent, signal) { try { return parseSlots(await call('public-private-slots', { body: intent, signal }), intent.centre); } catch (error) { if (error instanceof PublicBookingError || error.name === 'AbortError') throw error; throw new PublicBookingError(); } },
    async enquiry(intent, token, nonce, signal) {
      const data = await call('public-enquiry', { body: { ...intent, turnstile_token: token, company_website: '' }, nonce, signal });
      if (!uuid(data?.enquiry_id) || typeof data.call_by !== 'string' || !Number.isFinite(Date.parse(data.call_by)) || typeof data.call_by_plain !== 'string' || data.call_by_plain.length > 150) throw new PublicBookingError();
      return { enquiry_id: data.enquiry_id, call_by: data.call_by, call_by_plain: data.call_by_plain };
    },
    async reserve(intent, token, nonce, signal) {
      const data = await call('public-private-request', { body: { ...intent, turnstile_token: token, company_website: '' }, nonce, signal });
      return parseRequest(data, { tokenRequired: true, local: publicConfig(env).local });
    },
    async status(token, signal) {
      if (!requestToken(token)) throw new PublicBookingError('invalid_request');
      return parseRequest(await call('public-private-request-status', { body: { request_token: token }, signal }), { local: publicConfig(env).local });
    },
  };
}
export const requestToken = value => typeof value === 'string' && /^[A-Za-z\d._~-]{16,1024}$/.test(value);
export function checkoutUrl(value, local = false) {
  if (typeof value !== 'string') return null;
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'checkout.stripe.com' && !url.username && !url.password && (!local || url.pathname.includes('cs_test_')) ? url.href : null; } catch { return null; }
}
export function parseRequest(data, { tokenRequired = false, local = false } = {}) {
  const r = data?.request;
  if (data?.ok !== true || !r || !['checkout', 'requested', 'venue_told', 'confirmed', 'declined', 'expired', 'cancelled', 'needs_review'].includes(r.state)) throw new PublicBookingError();
  if (r.state === 'needs_review') {
    if (typeof r.call_by_plain !== 'string' || r.call_by_plain.length > 150 || !uuid(r.receipt)) throw new PublicBookingError();
    return { state: r.state, call_by_plain: r.call_by_plain, receipt: r.receipt };
  }
  if (!uuid(r.request_id) || typeof r.server_now !== 'string' || !Number.isFinite(Date.parse(r.server_now)) || !Number.isSafeInteger(r.expires_in_seconds) || r.expires_in_seconds < 0 || r.expires_in_seconds > 2678400 || !Array.isArray(r.dates) || r.dates.length > 104 || (tokenRequired && !requestToken(r.request_token)) || typeof r.checkout_state !== 'string' || r.checkout_state.length > 80) throw new PublicBookingError();
  const dates = r.dates.map(d => {
    if (typeof d === 'string' && validDate(d)) return { date: d };
    if (!d || typeof d !== 'object' || !validDate(d.date) || !Number.isFinite(Date.parse(d.starts_at)) || !Number.isFinite(Date.parse(d.ends_at))) throw new PublicBookingError();
    return { date: d.date, starts_at: d.starts_at, ends_at: d.ends_at };
  });
  const out = { request_id: r.request_id, state: r.state, server_now: r.server_now, expires_at: typeof r.expires_at === 'string' && Number.isFinite(Date.parse(r.expires_at)) ? r.expires_at : null, expires_in_seconds: r.expires_in_seconds, dates, price: parsePrice(r.price,{funded:true}), checkout_state: r.checkout_state };
  if(dates.length===0||out.price.sessions!==dates.length)throw new PublicBookingError();
  if(r.funding_mode!==undefined){if(!['card','setup','covered','recorded'].includes(r.funding_mode)||(out.price.funding_mode!==undefined&&out.price.funding_mode!==r.funding_mode)||(['setup','covered'].includes(r.funding_mode)&&out.price.funding_mode!==r.funding_mode))throw new PublicBookingError();out.funding_mode=r.funding_mode;}
  if((out.funding_mode??out.price.funding_mode)==='covered'&&r.state==='checkout')throw new PublicBookingError();
  if (tokenRequired) out.request_token = r.request_token;
  if (r.checkout_url) { const url = checkoutUrl(r.checkout_url, local); if (!url) throw new PublicBookingError(); if (r.state === 'checkout' && r.expires_in_seconds > 0) out.checkout_url = url; }
  if (typeof r.call_by_plain === 'string' && r.call_by_plain.length <= 150) out.call_by_plain = r.call_by_plain;
  return out;
}

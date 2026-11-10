import { publicConfig, checkedPublicResult } from '../public-client';
import { isRenewalOfferToken, isRenewalFamilyFields, isRenewalDeclineFields, isRenewalFamilyReview, decodeRenewalPreview, decodeRenewalQuote, decodeRenewalReceipt, decodeRenewalOriginalReceipt, decodeRenewalCurrent } from './renewal-model';
export class RenewalError extends Error { constructor(code = 'unavailable') { super(code); this.code = code; } }
export const renewalError = code => code === 'rate_limited' ? 'Too many checks have paused this visit. Keep the original command unchanged.' : code === 'invalid_fields' ? 'Check your contact details and the explicit confirmations.' : 'This renewal could not be verified. Keep any submitted original command and contact the Academy for help.';
const uuid = s => typeof s === 'string' && /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.exec(s)?.[0] === s;
async function packet(response, signal) {
  if (!response.body || signal.aborted) throw new RenewalError();
  const reader = response.body.getReader(), decoder = new TextDecoder('utf-8', { fatal: true }), parts = []; let bytes = 0, complete = false, rejectAbort;
  const aborted = new Promise((_, reject) => { rejectAbort = reject; }), cancel = () => { void reader.cancel().catch(() => {}); }, abort = () => { rejectAbort(new RenewalError()); cancel(); };
  signal.addEventListener('abort', abort, { once: true });
  try { if (signal.aborted) throw new RenewalError(); while (true) { const { done, value } = await Promise.race([reader.read(), aborted]); if (signal.aborted) throw new RenewalError(); if (done) break; if (!(value instanceof Uint8Array) || value.byteLength > 1048576 - bytes) throw new RenewalError(); bytes += value.byteLength; parts.push(decoder.decode(value, { stream: true })); } parts.push(decoder.decode()); complete = true; return JSON.parse(parts.join('')); }
  finally { signal.removeEventListener('abort', abort); if (!complete) cancel(); reader.releaseLock(); }
}
export function createRenewalClient(env = import.meta.env, request = globalThis.fetch, memory) {
  let halted = false;
  async function call(kind, body = {}, nonce) {
    if (halted) throw new RenewalError('rate_limited'); const token = memory?.read(); if (!isRenewalOfferToken(token)) throw new RenewalError();
    const config = publicConfig(env), controller = new AbortController(), timer = setTimeout(() => controller.abort(), 18000);
    try { const headers = { 'Content-Type': 'application/json' }; if (config.key) Object.assign(headers, { apikey: config.key, Authorization: `Bearer ${config.key}` }); if (nonce !== undefined) { if (!uuid(nonce)) throw new RenewalError('invalid_fields'); headers['Idempotency-Key'] = nonce; }
      const response = await request(`${config.base}/public-private-renewal-${kind}`, { method: 'POST', headers, body: JSON.stringify({ offer_token: token, ...body }), credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: controller.signal });
      if (response.status === 429) { halted = true; void response.body?.cancel().catch(() => {}); throw new RenewalError('rate_limited'); }
      const data = await packet(response, controller.signal), key = { preview: 'preview', quote: 'quote', accept: 'acceptance', decline: 'decline', receipt: 'receipt', current: 'current' }[kind];
      if (!response.ok || data?.ok !== true || Object.keys(data).length !== 2 || !Object.hasOwn(data, key) || memory.read() !== token) throw new RenewalError(); return checkedPublicResult(data[key],config);
    } catch (error) { controller.abort(); throw error instanceof RenewalError ? error : new RenewalError(); } finally { clearTimeout(timer); }
  }
  const check = v => { if (!v) throw new RenewalError(); return v; };
  const original = a => ({ offerId: a.offer.offer_id, nonce: a.nonce, operation: a.operation });
  return { paused: () => halted,
    async preview() { return check(decodeRenewalPreview(await call('preview'))); },
    async quote(fields, offer) { if (!isRenewalFamilyFields(fields, true)) throw new RenewalError('invalid_fields'); return check(decodeRenewalQuote(await call('quote', { fields }), { offer, fields })); },
    async accept(a, turnstile) { if (a.operation !== 'accept' || !isRenewalFamilyFields(a.fields, true) || !isRenewalFamilyReview(a.review) || typeof turnstile !== 'string' || !turnstile) throw new RenewalError('invalid_fields'); return check(decodeRenewalReceipt(await call('accept', { fields: a.fields, review: a.review, turnstile_token: turnstile, company_website: '' }, a.nonce), original(a))); },
    async decline(a, turnstile) { if (a.operation !== 'decline' || !isRenewalDeclineFields(a.fields) || a.review !== null || typeof turnstile !== 'string' || !turnstile) throw new RenewalError('invalid_fields'); return check(decodeRenewalReceipt(await call('decline', { fields: a.fields, turnstile_token: turnstile, company_website: '' }, a.nonce), original(a))); },
    async receipt(a) { if (!['accept', 'decline'].includes(a.operation) || a.operation === 'accept' && (!isRenewalFamilyFields(a.fields, true) || !isRenewalFamilyReview(a.review)) || a.operation === 'decline' && (!isRenewalDeclineFields(a.fields) || a.review !== null)) throw new RenewalError('invalid_fields'); return check(decodeRenewalOriginalReceipt(await call('receipt', { operation: a.operation, fields: a.fields, review: a.review }, a.nonce), original(a))); },
    async current(ref) { return check(decodeRenewalCurrent(await call('current'), ref)); },
  };
}

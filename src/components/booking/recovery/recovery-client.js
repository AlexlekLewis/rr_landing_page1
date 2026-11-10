import { publicConfig } from '../public-client';
import { creditFields } from '../credit-client';
import { FamilyOperationError } from '../family-operation-gate';
import { uuid } from '../booking-model';
import { isLapsedReview, paymentRecoveryProjection, lapsedQuoteProjection, lapsedReceiptProjection, lapsedCurrentProjection } from './recovery-model';

export const recoveryEnabled = env => env?.VITE_PRIVATE_BOOKING_PAYMENT_RECOVERY_ENABLED === 'true';
export function recoveryError(error) {
  if (error?.code === 'rate_limited') return 'Too many checks have paused this private visit. Keep any submitted request unchanged.';
  if (error?.code === 'invalid_request') return 'Check the players, contact details and new booking dates.';
  if (['review_required', 'slot_taken'].includes(error?.code)) return 'Those dates or terms are unavailable. Review a new quote before submitting.';
  if (error?.code === 'family_unavailable') return 'This secure option is unavailable. Open your email link or contact the Academy.';
  return 'We couldn’t confirm the result. Keep any submitted request unchanged and read its original receipt.';
}
async function boundedPacket(response, signal) {
  if (!response.body || signal.aborted) throw new FamilyOperationError();
  const reader = response.body.getReader(), decoder = new TextDecoder('utf-8', { fatal: true }), parts = [];
  let bytes = 0, complete = false, rejectAbort;
  const aborted = new Promise((_, reject) => { rejectAbort = reject; });
  const cancel = () => { void reader.cancel().catch(() => {}); };
  const abort = () => { rejectAbort(new FamilyOperationError()); cancel(); };
  signal.addEventListener('abort', abort, { once: true });
  try {
    if (signal.aborted) throw new FamilyOperationError();
    while (true) {
      const { done, value } = await Promise.race([reader.read(), aborted]);
      if (signal.aborted) throw new FamilyOperationError();
      if (done) break;
      if (!(value instanceof Uint8Array) || value.byteLength > 1048576 - bytes) throw new FamilyOperationError();
      bytes += value.byteLength; parts.push(decoder.decode(value, { stream: true }));
    }
    parts.push(decoder.decode()); complete = true;
    return JSON.parse(parts.join(''));
  } finally { signal.removeEventListener('abort', abort); if (!complete) cancel(); reader.releaseLock(); }
}
/** A POST-only capability door. It never creates a provider payment or stores a bearer. */
export function createRecoveryClient(env, request, memory, gate) {
  const controllers = new Set();
  async function call(path, key, body, nonce, original = false) {
    if (!original && !recoveryEnabled(env)) throw new FamilyOperationError('family_unavailable', 404);
    gate.assertReadable();
    const capability = memory.read();
    if (typeof capability !== 'string' || !/^[a-f0-9]{64}$/.test(capability)) throw new FamilyOperationError('family_unavailable', 404);
    const config = publicConfig(env), controller = new AbortController(); controllers.add(controller);
    const unregister = gate.registerAbort(() => controller.abort()), timer = setTimeout(() => controller.abort(), 18000);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (config.key) Object.assign(headers, { apikey: config.key, Authorization: `Bearer ${config.key}` });
      if (nonce) { if (!uuid(nonce)) throw new FamilyOperationError('invalid_request', 400); headers['X-Request-Id'] = nonce; }
      const encoded = JSON.stringify({ ...body, family_token: capability });
      if (new TextEncoder().encode(encoded).length > 24000) throw new FamilyOperationError('invalid_request', 400);
      const response = await request(`${config.base}/public-private-${path}`, { method: 'POST', headers, body: encoded, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', redirect: 'error', signal: controller.signal });
      if (response.status === 429) { gate.pause(); void response.body?.cancel().catch(() => {}); throw new FamilyOperationError('rate_limited', 429); }
      const packet = await boundedPacket(response, controller.signal);
      if (memory.read() !== capability) throw new FamilyOperationError();
      if (!response.ok) {
        const code = ['invalid_request', 'family_unavailable', 'review_required', 'slot_taken', 'verification_failed'].includes(packet?.error?.code) ? packet.error.code : 'unavailable';
        throw new FamilyOperationError(code, response.status);
      }
      if (packet?.ok !== true || Object.keys(packet).length !== 2 || !Object.hasOwn(packet, key)) throw new FamilyOperationError();
      return packet[key];
    } catch (error) { controller.abort(); throw error instanceof FamilyOperationError ? error : new FamilyOperationError(); }
    finally { clearTimeout(timer); unregister(); controllers.delete(controller); }
  }
  const prior = value => { if (!uuid(value)) throw new FamilyOperationError('invalid_request', 400); return value.toLowerCase(); };
  const fields = (value, consent) => { const result = creditFields(value); if (result.consent_save_card !== consent) throw new FamilyOperationError('invalid_request', 400); return result; };
  const decode = (fn, value, ...args) => { try { return fn(value, ...args); } catch { throw new FamilyOperationError(); } };
  const originalBody = attempt => {
    if (!isLapsedReview(attempt.review) || !uuid(attempt.nonce)) throw new FamilyOperationError('invalid_request', 400);
    return { prior_request_id: prior(attempt.prior_request_id), fields: fields(attempt.fields, true), review: attempt.review };
  };
  return {
    async remaining(id) { const request_id = prior(id); const r = decode(paymentRecoveryProjection, await call('payment-recovery', 'recovery', { request_id }), publicConfig(env).local); if (r.request_id !== request_id) throw new FamilyOperationError(); return r; },
    async current(id) { const prior_request_id = prior(id); const r = decode(lapsedCurrentProjection, await call('lapsed-current', 'current', { prior_request_id }), publicConfig(env).local); if (r.prior_request_id !== prior_request_id) throw new FamilyOperationError(); return r; },
    async quote(id, input) { const prior_request_id = prior(id), value = fields(input, false); const q = decode(lapsedQuoteProjection, await call('lapsed-quote', 'quote', { prior_request_id, fields: value }), value); if (q.prior_request_id !== prior_request_id) throw new FamilyOperationError(); return q; },
    async accept(attempt, token) { if (typeof token !== 'string' || !token || token.length > 2048) throw new FamilyOperationError('invalid_request', 400); return decode(lapsedReceiptProjection, await call('lapsed-request', 'acceptance', { ...originalBody(attempt), turnstile_token: token, company_website: '' }, attempt.nonce), publicConfig(env).local); },
    async receipt(attempt) { return decode(lapsedReceiptProjection, await call('lapsed-receipt', 'receipt', originalBody(attempt), attempt.nonce, true), publicConfig(env).local); },
    dispose() { for (const controller of controllers) controller.abort(); controllers.clear(); },
  };
}

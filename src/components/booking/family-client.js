import { publicConfig } from './public-client';
import { uuid, validDate } from './booking-model';
import { familyCapabilityMemory } from './family-capability';
import { createFamilyOperationGate } from './family-operation-gate';

export class FamilyBookingError extends Error {
  constructor(code = 'unavailable', status = 0, retryAfter = 0) {
    super(code); this.code = code; this.status = status; this.retryAfter = retryAfter;
  }
}
export function familyError(error) {
  if (error?.code === 'rate_limited') return 'There have been too many checks. Please wait before opening your secure link again.';
  if (error?.code === 'family_unavailable') return 'This private-coaching link or session is unavailable. Open the link in your email or contact the Academy.';
  if (error?.code === 'review_required') return 'The session or cancellation terms changed. Check the current terms before confirming again.';
  if (error?.code === 'outcome_unknown') return 'The result of your previous choice still needs checking. Check that same choice before making another.';
  if (error?.code === 'invalid_request') return 'Check the details before trying again. No change has been confirmed.';
  return 'We couldn’t check the booking service. A submitted choice may still have been saved. Check its result before making another.';
}
const fail = () => { throw new FamilyBookingError('unavailable', 503); };
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value) ? value : fail();
const text = (value, max = 300) => typeof value === 'string' && value.length <= max ? value : fail();
const id = value => uuid(value) ? value.toLowerCase() : fail();
const cents = value => Number.isSafeInteger(value) && value >= 0 ? value : fail();
const stamp = value => {
  if (typeof value !== 'string' || value.length > 40 || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.test(value) || !validDate(value.slice(0, 10)) || !Number.isFinite(Date.parse(value))) fail();
  return value;
};
const state = value => ['checkout', 'requested', 'venue_told', 'confirmed', 'declined', 'expired', 'cancelled'].includes(value) ? value : fail();
const list = (value, max) => Array.isArray(value) && value.length <= max ? value : fail();
const unique = (rows, key) => { if (new Set(rows.map(row => row[key])).size !== rows.length) fail(); return rows; };
const outcome = value => ['credit', 'refund', 'move'].includes(value) ? value : fail();
const cardRefundEligibility = value => {
  if (!Object.hasOwn(value, 'can_request_card_refund')) return false;
  return typeof value.can_request_card_refund === 'boolean' ? value.can_request_card_refund : fail();
};

export function parseFamily(data) {
  if (data?.ok !== true) fail();
  const value = object(data.family);
  const players = unique(list(value.players, 400).map(item => {
    const p = object(item);
    return { id: id(p.id), name: text(p.name), available_credit_cents: cents(p.available_credit_cents), reserved_credit_cents: cents(p.reserved_credit_cents) };
  }), 'id');
  const items = unique(list(value.items, 400).map(item => {
    const b = object(item), starts_at = stamp(b.starts_at), ends_at = stamp(b.ends_at);
    if (Date.parse(ends_at) <= Date.parse(starts_at)) fail();
    return { booking_id: id(b.booking_id), request_id: id(b.request_id), starts_at, ends_at, coach: b.coach === null ? null : text(b.coach, 120), centre: text(b.centre), state: state(b.state), state_plain: text(b.state_plain, 120), can_cancel_free_until: stamp(b.can_cancel_free_until), late_fee_cents: cents(b.late_fee_cents), cancellation_fee_cents: b.cancellation_fee_cents === null ? null : cents(b.cancellation_fee_cents), pending_choice_event: b.pending_choice_event === null ? null : id(b.pending_choice_event), can_request_card_refund: cardRefundEligibility(b) };
  }), 'booking_id');
  return { as_of: stamp(value.as_of), players, items };
}
export function parseCancelPreview(data, booking) {
  if (data?.ok !== true) fail();
  const p = object(data.preview);
  if (id(p.booking_id) !== booking) fail();
  const result = { booking_id: booking, request_id: id(p.request_id), state: state(p.state), cancel_free_until: stamp(p.cancel_free_until), fee_cents: cents(p.fee_cents), prepaid_cents: cents(p.prepaid_cents), credit_cents: cents(p.credit_cents), fee_owing_cents: cents(p.fee_owing_cents), session_value_cents: cents(p.session_value_cents), server_now: stamp(p.server_now) };
  if (result.fee_cents > result.session_value_cents || result.credit_cents > result.prepaid_cents || result.fee_owing_cents > result.fee_cents) fail();
  return result;
}
function parseReceipt(data, operation) {
  if (data?.ok !== true) fail();
  const r = object(data[operation.kind === 'cancel' ? 'cancellation' : 'choice']);
  if (r.saved !== true || id(r.request) !== operation.nonce) fail();
  const result = { saved: true, request: operation.nonce, request_id: id(r.request_id), event_id: id(r.event_id), choice: outcome(r.choice), credit_cents: cents(r.credit_cents) };
  if (operation.kind === 'cancel') {
    if (id(r.booking_id) !== operation.body.booking_id || r.cause !== 'family' || result.choice !== 'credit' || cents(r.fee_cents) !== operation.body.expected_fee_cents || !Number.isSafeInteger(r.revision) || r.revision < 1) fail();
    return { ...result, booking_id: operation.body.booking_id, cause: 'family', fee_cents: cents(r.fee_cents), fee_owing_cents: cents(r.fee_owing_cents), revision: r.revision };
  }
  if (result.event_id !== operation.body.event_id || result.choice !== operation.body.choice) fail();
  return result;
}

/** Family secrets enter POST bodies only. Financial attempts live only in this closure. */
export function createFamilyClient(env = import.meta.env, request = globalThis.fetch, memory = familyCapabilityMemory, gate = createFamilyOperationGate()) {
  const controllers = new Set();
  async function call(endpoint, body, nonce, signal) {
    gate.assertReadable();
    const capability = memory.read();
    if (typeof capability !== 'string' || !/^[0-9a-f]{64}$/.test(capability)) throw new FamilyBookingError('family_unavailable', 404);
    const controller = new AbortController(), abort = () => controller.abort();
    if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
    controllers.add(controller); const unregister = gate.registerAbort(abort), timer = setTimeout(abort, 18000);
    try {
      const config = publicConfig(env), headers = { 'Content-Type': 'application/json' };
      if (config.key) Object.assign(headers, { apikey: config.key, Authorization: `Bearer ${config.key}` });
      if (nonce) headers['Idempotency-Key'] = nonce;
      const response = await request(`${config.base}/${endpoint}`, { method: 'POST', headers, body: JSON.stringify({ ...body, family_token: capability }), signal: controller.signal, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' });
      if (response.status === 429) {
        gate.pause(); try { await response.body?.cancel(); } catch { /* Refusal still stops the client. */ }
        throw new FamilyBookingError('rate_limited', 429, Math.max(0, Number(response.headers.get('Retry-After')) || 0));
      }
      const raw = await response.text(); if (raw.length > 1048576) fail();
      let data; try { data = JSON.parse(raw); } catch { fail(); }
      if (!response.ok) {
        const known = ['family_unavailable', 'review_required', 'rate_limited', 'invalid_request'];
        const code = known.includes(data?.error?.code) ? data.error.code : 'unavailable';
        throw new FamilyBookingError(code, response.status);
      }
      return data;
    } catch (error) {
      if (error instanceof FamilyBookingError) throw error;
      throw new FamilyBookingError();
    } finally { clearTimeout(timer); unregister(); signal?.removeEventListener('abort', abort); controllers.delete(controller); }
  }
  function perform(kind, body, signal) {
    return gate.perform(kind, body, async ({ body: intent, nonce, transport }) => parseReceipt(await call(kind === 'cancel' ? 'public-private-cancel' : 'public-private-cancel-choice', intent, nonce, transport), { kind, body: intent, nonce }), signal);
  }
  return {
    async read(signal) { return parseFamily(await call('public-private-manage', {}, null, signal)); },
    async preview(booking, signal) { const bookingId = id(booking); return parseCancelPreview(await call('public-private-cancel-preview', { booking_id: bookingId }, null, signal), bookingId); },
    cancel({ booking_id, expected_fee_cents, accept_fee }, signal) {
      const body = { booking_id: id(booking_id), expected_fee_cents: cents(expected_fee_cents), accept_fee };
      if (typeof accept_fee !== 'boolean') return Promise.reject(new FamilyBookingError('invalid_request', 400));
      return perform('cancel', body, signal);
    },
    choose({ event_id, choice }, signal) { return perform('choice', { event_id: id(event_id), choice: outcome(choice) }, signal); },
    retry(signal) {
      if (!['cancel', 'choice'].includes(gate.getSnapshot().pending?.kind)) return Promise.reject(new FamilyBookingError('invalid_request', 400));
      return gate.retry(signal);
    },
    state: gate.getSnapshot,
    getSnapshot: gate.getSnapshot,
    subscribe: gate.subscribe,
    clear() { gate.clear(); for (const controller of controllers) controller.abort(); controllers.clear(); },
  };
}

import { FOCUS_LABELS, GOALS, uuid, validDate } from './booking-model';
import { publicConfig, parseRequest } from './public-client';
import { familyCapabilityMemory } from './family-capability';
import { FamilyOperationError, familyOperationGate } from './family-operation-gate';
import { creditReviewChanged, parseCreditQuote } from './credit-quote';

const invalid = () => { throw new FamilyOperationError('invalid_request', 400); };
const plain = value => value && typeof value === 'object' && !Array.isArray(value) ? value : invalid();
const string = (value, max, allowEmpty = false) => typeof value === 'string' && value.length <= max && (allowEmpty || value.trim()) ? value.trim() : invalid();
const integer = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max ? value : invalid();
function only(value, keys) { if (Object.keys(value).some(key => !keys.includes(key))) invalid(); }
function strings(value, max, parse) {
  if (!Array.isArray(value) || value.length > max) invalid();
  const result = value.map(parse); if (new Set(result).size !== result.length) invalid(); return result;
}
/** No draft recovery or storage is used. Return only ordinary canonical request fields. */
export function creditFields(input) {
  const value = plain(input);
  only(value, ['centre', 'profile_id', 'starts_at', 'duration_minutes', 'weeks', 'skip_dates', 'kind', 'group_size', 'focus', 'machine', 'players', 'parent', 'note', 'goals', 'source_page', 'consent_save_card']);
  if (!['mickleham', 'cranbourne-north'].includes(value.centre) || !uuid(value.profile_id) || typeof value.starts_at !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value.starts_at) || !Number.isFinite(Date.parse(value.starts_at)) || !validDate(value.starts_at.slice(0, 10)) || ![60, 90, 120].includes(value.duration_minutes) || !['one_on_one', 'group'].includes(value.kind) || !Object.hasOwn(FOCUS_LABELS, value.focus) || !['yes', 'no', 'either'].includes(value.machine)) invalid();
  const group = value.kind === 'group' ? integer(value.group_size, 2, 4) : 1;
  if (value.kind === 'one_on_one' && value.group_size !== undefined) invalid();
  if (!Array.isArray(value.players) || value.players.length !== group) invalid();
  const players = value.players.map(raw => {
    const player = plain(raw); only(player, ['name', 'age']);
    if (!/^\d{1,3}$/.test(String(player.age))) invalid();
    return { name: string(player.name, 120), age: integer(Number(player.age), 0, 120) };
  });
  const contact = plain(value.parent); only(contact, ['name', 'email', 'mobile']);
  const name = contact.name === undefined ? '' : string(contact.name, 120, true), email = string(contact.email, 254).toLowerCase(), mobile = string(contact.mobile, 30);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || mobile.replace(/\D/g, '').length < 7 || !/^[+\d ()-]+$/.test(mobile) || ((group > 1 || players.some(player => player.age < 18)) && !name)) invalid();
  if (value.consent_save_card !== undefined && typeof value.consent_save_card !== 'boolean') invalid();
  const source = value.source_page === undefined ? null : string(value.source_page, 200);
  if (source !== null && !/^\/(?:book|coaches\/[a-z0-9-]+)$/.test(source)) invalid();
  const note = value.note === undefined ? '' : string(value.note, 3000, true);
  return { centre: value.centre, profile_id: value.profile_id.toLowerCase(), starts_at: value.starts_at, duration_minutes: value.duration_minutes, weeks: integer(value.weeks, 1, 104), skip_dates: strings(value.skip_dates ?? [], 104, day => validDate(day) ? day : invalid()), kind: value.kind, ...(group > 1 ? { group_size: group } : {}), focus: value.focus, machine: value.focus === 'batting' ? value.machine : 'either', players, parent: { ...(name ? { name } : {}), email, mobile }, ...(note ? { note } : {}), goals: strings(value.goals ?? [], 4, goal => Object.hasOwn(GOALS, goal) ? goal : invalid()), ...(source === null ? {} : { source_page: source }), consent_save_card: value.consent_save_card ?? false };
}
export function creditDraftFields(draft) {
  return creditFields({ centre: draft.centre, profile_id: draft.profile_id, starts_at: draft.starts_at, duration_minutes: draft.duration_minutes, weeks: draft.weeks, skip_dates: draft.skip_dates, kind: draft.kind, ...(draft.kind === 'group' ? { group_size: draft.group_size } : {}), focus: draft.focus, machine: draft.machine, players: draft.players, parent: draft.parent, note: draft.note, goals: draft.goals, source_page: draft.source_page, consent_save_card: draft.consent_save_card });
}
export function creditError(error) {
  if (error?.code === 'rate_limited') return 'There have been too many checks. Please wait before opening your secure link again.';
  if (error?.code === 'family_unavailable') return 'This private-coaching link is unavailable. Open the link in your email or contact the Academy.';
  if (error?.code === 'outcome_unknown') return 'Check your previous submitted choice before starting another credit request.';
  if (error?.code === 'slot_taken' || error?.code === 'review_required') return 'Your dates or credit quote changed. Check the current quote before requesting.';
  if (error?.code === 'invalid_request') return 'Check the player and family details before checking credit.';
  if (error?.code === 'verification_failed') return 'Complete the security check again before checking the same request.';
  if (error?.code === 'payment_limit') return 'Please contact the Academy to arrange this block.';
  return 'We couldn’t check the booking service. Check the current quote or your submitted result before continuing.';
}
export function parseCreditRequest(data, local = false) {
  let result; try { result = parseRequest(data, { tokenRequired: true, local }); } catch { throw new FamilyOperationError('unavailable', 503); }
  if (result.state !== 'needs_review' && !['card', 'setup', 'covered'].includes(result.funding_mode)) throw new FamilyOperationError('unavailable', 503);
  return result;
}

function bindReceipt(data, quote, nonce, capability, local) {
  const result = parseCreditRequest(data, local);
  if (result.state === 'needs_review') {
    if (result.receipt !== nonce) throw new FamilyOperationError('unavailable', 503);
    return result;
  }
  const p = result.price, f = quote.funding, gross = quote.price;
  if (result.request_token === capability || result.funding_mode !== f.funding_mode || p.per_session_cents !== gross.per_session_cents || p.sessions !== gross.sessions || p.total_cents !== gross.total_cents || p.discount_applied !== gross.discount_applied || p.first_session_hold_cents !== f.first_due_cents || p.rest_cents !== f.rest_due_cents || (p.credit_reserved_cents ?? 0) !== f.credit_applied_cents || result.dates.length !== quote.series_check.dates.length || result.dates.some((day, index) => {
    const expected = quote.series_check.dates[index];
    return day.date !== expected.date || Date.parse(day.starts_at) !== Date.parse(expected.starts_at) || Date.parse(day.ends_at) !== Date.parse(expected.ends_at);
  })) throw new FamilyOperationError('unavailable', 503);
  return result;
}
const challenge = value => string(value, 2048);

/** The capability and every credit intent stay in memory, with no anonymous fallback. */
export function createCreditClient(env = import.meta.env, request = globalThis.fetch, memory = familyCapabilityMemory, gate = familyOperationGate) {
  const controllers = new Set(); let preparing = null, generation = 0;
  async function call(endpoint, body, nonce, signal) {
      gate.assertReadable(); const capability = memory.read();
      if (typeof capability !== 'string' || !/^[0-9a-f]{64}$/.test(capability)) throw new FamilyOperationError('family_unavailable', 404);
      const controller = new AbortController(), abort = () => controller.abort();
      if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
      controllers.add(controller); const unregister = gate.registerAbort(abort), timer = setTimeout(abort, 18000);
      try {
        if (controller.signal.aborted) throw new FamilyOperationError();
        const config = publicConfig(env), encoded = JSON.stringify({ ...body, family_token: capability });
        if (new TextEncoder().encode(encoded).length > 16384) invalid();
        const headers = { 'Content-Type': 'application/json' };
        if (config.key) Object.assign(headers, { apikey: config.key, Authorization: `Bearer ${config.key}` });
        if (nonce) headers['Idempotency-Key'] = nonce;
        const response = await request(`${config.base}/${endpoint}`, { method: 'POST', headers, body: encoded, signal: controller.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (response.status === 429) {
          gate.pause(); try { await response.body?.cancel(); } catch { /* The visit stays paused. */ }
          throw new FamilyOperationError('rate_limited', 429, Math.max(0, Number(response.headers.get('Retry-After')) || 0));
        }
        if (controller.signal.aborted) throw new FamilyOperationError();
        const raw = await response.text(); if (raw.length > 1048576) throw new FamilyOperationError('unavailable', 503);
        if (controller.signal.aborted) throw new FamilyOperationError();
        let data; try { data = JSON.parse(raw); } catch { throw new FamilyOperationError('unavailable', 503); }
        if (!response.ok) {
          const code = ['family_unavailable', 'invalid_request', 'review_required', 'slot_taken', 'verification_failed', 'verification_unavailable', 'payment_limit', 'under18_needs_parent'].includes(data?.error?.code) ? data.error.code : 'unavailable';
          throw new FamilyOperationError(code, code === 'unavailable' ? 503 : response.status);
        }
        return data;
      } catch (error) {
        if (error instanceof FamilyOperationError) throw error;
        throw new FamilyOperationError();
      } finally { clearTimeout(timer); unregister(); controllers.delete(controller); signal?.removeEventListener('abort', abort); }
  }
  async function quote(input, signal) {
    gate.assertReadable();
    if (gate.getSnapshot().pending) throw new FamilyOperationError('outcome_unknown');
    const fields = creditFields(input);
    return parseCreditQuote(await call('public-private-credit-quote', { fields }, null, signal), fields);
  }
  return {
    quote,
    reserve(input, reviewed, token, signal) {
      gate.assertReadable();
      const fields = creditFields(input), expected = parseCreditQuote({ ok: true, quote: reviewed }, fields), proof = challenge(token);
      if (expected.state !== 'quoted' || !expected.decision_quote || (expected.funding.funding_mode !== 'covered' && !fields.consent_save_card)) return Promise.reject(new FamilyOperationError('invalid_request', 400));
      if (expected.funding.funding_mode === 'covered') fields.consent_save_card = false;
      const key = JSON.stringify([fields, expected.review]);
      if (preparing) return preparing.key === key ? preparing.promise : Promise.reject(new FamilyOperationError('outcome_unknown'));
      if (gate.getSnapshot().pending) return Promise.reject(new FamilyOperationError('outcome_unknown'));
      const sequence = { key, promise: null, generation }; preparing = sequence;
      sequence.promise = (async () => {
        const fresh = await quote(fields, signal);
        if (sequence.generation !== generation) throw new FamilyOperationError();
        if (creditReviewChanged(expected, fresh)) {
          const error = new FamilyOperationError('review_required', 409); error.quote = fresh; throw error;
        }
        // Keep the displayed binding. A newer opaque fingerprint never silently
        // replaces the terms the family actually reviewed.
        return gate.perform('credit_request', { fields, review: expected.review }, async ({ body, nonce, transport }) => {
          const raw = await call('public-private-credit-request', { ...body, turnstile_token: challenge(transport.token), company_website: '' }, nonce, transport.signal);
          return bindReceipt(raw, expected, nonce, memory.read(), publicConfig(env).local);
        }, { token: proof, signal });
      })();
      sequence.promise.then(() => { if (preparing === sequence) preparing = null; }, () => { if (preparing === sequence) preparing = null; });
      return sequence.promise;
    },
    retry(token, signal) {
      if (gate.getSnapshot().pending?.kind !== 'credit_request') return Promise.reject(new FamilyOperationError('invalid_request', 400));
      return gate.retry({ token: challenge(token), signal });
    },
    getSnapshot: gate.getSnapshot,
    subscribe: gate.subscribe,
    clear() { generation++; preparing = null; for (const controller of controllers) controller.abort(); controllers.clear(); },
  };
}

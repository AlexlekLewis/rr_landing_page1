import { isRenewalFamilyFields, isRenewalDeclineFields, isRenewalFamilyReview } from './renewal-model';
import { RenewalError } from './renewal-client';
const freeze = value => { const copy = structuredClone(value); const walk = v => { if (v && typeof v === 'object') { Object.values(v).forEach(walk); Object.freeze(v); } }; walk(copy); return copy; };
const stable = value => JSON.stringify(value, (_key, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v);
const instant = s => { const m = /^(.*?)(?:\.(\d{1,6}))?(Z|[+-]\d{2}:\d{2})$/.exec(s ?? ''); if (!m || !Number.isFinite(Date.parse(m[1] + m[3]))) return null; return BigInt(Date.parse(m[1] + m[3])) * 1000n + BigInt((m[2] ?? '').padEnd(6, '0')); };
const active = v => v?.view_kind === 'renewal_offer';
export function createRenewalOperation(client, memory, randomUUID = () => crypto.randomUUID()) {
  let state = Object.freeze({ phase: 'empty', preview: null, quote: null, receipt: null, current: null, missing: false, paused: false, error: null, pending: false }), attempt = null, reviewed = null, busy = false; const listeners = new Set();
  const publish = patch => { state = Object.freeze({ ...state, ...patch, pending: busy }); memory?.setLocked(busy || state.phase === 'unknown' || state.paused); for (const listener of listeners) listener(); };
  const blocked = () => busy || state.paused || state.phase === 'unknown';
  const idle = () => { if (blocked() || state.receipt) throw new RenewalError(state.paused ? 'rate_limited' : 'outcome_unknown'); };
  async function run(work, recovery = false) {
    if (busy || state.paused || !recovery && state.phase === 'unknown') throw new RenewalError('outcome_unknown'); busy = true; publish({ error: null });
    try { return await work(); } catch (e) { const code = e?.code ?? 'unavailable'; const stopRead = state.phase !== 'unknown' && code !== 'invalid_fields'; publish({ error: code, paused: state.paused || code === 'rate_limited' || stopRead, ...(stopRead ? { phase: 'paused' } : {}) }); throw e; }
    finally { busy = false; publish({}); }
  }
  function matches(receipt) { return receipt && attempt && receipt.operation === attempt.operation && receipt.nonce === attempt.nonce && receipt.offer_id === attempt.offer.offer_id && receipt.hold_days === attempt.offer.hold_days && instant(receipt.prepared_real_at) === instant(attempt.offer.prepared_real_at) && instant(receipt.expires_real_at) === instant(attempt.offer.expires_real_at); }
  function record(receipt) { if (!matches(receipt)) throw new RenewalError('outcome_unknown'); reviewed = null; publish({ phase: 'known', receipt: freeze(receipt), quote: null, missing: false, current: null }); return receipt; }
  async function writer(turnstile) {
    let result; try { result = await client[attempt.operation](attempt, turnstile); if (!matches(result)) throw new RenewalError('outcome_unknown'); } catch (e) { publish({ phase: 'unknown', missing: false }); throw e; }
    // A valid known writer result still needs an independent original receipt.
    try { const proof = await client.receipt(attempt); if (proof.state !== 'found' || !matches(proof.receipt) || stable(proof.receipt) !== stable(result)) { publish({ phase: 'unknown', missing: proof.state === 'missing' }); throw new RenewalError('outcome_unknown'); } return record(proof.receipt); }
    catch (e) { publish({ phase: 'unknown' }); throw e; }
  }
  function original(operation, fields, review) { const nonce = randomUUID(); if (typeof nonce !== 'string' || /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.exec(nonce)?.[0] !== nonce) throw new RenewalError('invalid_fields'); attempt = freeze({ operation, fields, review, nonce, offer: state.preview }); publish({ phase: 'unknown', missing: false }); }
  return { getSnapshot: () => state, subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }, blocked, busy: () => busy,
    preview: () => run(async () => { if (attempt || state.receipt) throw new RenewalError('outcome_unknown'); const preview = await client.preview(); reviewed = null; publish({ preview: freeze(preview), phase: 'ready', quote: null, current: null }); return preview; }),
    quote: fields => run(async () => { if (!active(state.preview) || state.receipt || !isRenewalFamilyFields(fields, true)) throw new RenewalError('invalid_fields'); const copy = freeze(fields), quote = await client.quote(copy, state.preview); reviewed = quote.state === 'quoted' ? copy : null; publish({ quote: freeze(quote), phase: quote.state === 'quoted' ? 'review' : 'ready', current: null }); return quote; }),
    accept: (fields, turnstile, confirmed) => run(async () => { if (confirmed !== true || !active(state.preview) || state.quote?.state !== 'quoted' || !reviewed || !isRenewalFamilyFields(fields, true) || stable(fields) !== stable(reviewed) || !isRenewalFamilyReview(state.quote.review)) throw new RenewalError('invalid_fields'); original('accept', fields, state.quote.review); return writer(turnstile); }),
    reviewDecline(fields) { idle(); if (!active(state.preview) || !isRenewalDeclineFields(fields)) throw new RenewalError('invalid_fields'); reviewed = freeze(fields); publish({ phase: 'decline', quote: null, current: null }); },
    decline: (fields, turnstile, confirmed) => run(async () => { if (confirmed !== true || state.phase !== 'decline' || !active(state.preview) || !isRenewalDeclineFields(fields) || stable(fields) !== stable(reviewed)) throw new RenewalError('invalid_fields'); original('decline', fields, null); return writer(turnstile); }),
    recover: () => run(async () => { if (!attempt || state.phase !== 'unknown') throw new RenewalError('outcome_unknown'); const proof = await client.receipt(attempt); if (proof.state === 'missing') { publish({ phase: 'unknown', missing: true }); return null; } return record(proof.receipt); }, true),
    current: () => run(async () => { const ref = state.receipt ? { offerId: state.receipt.offer_id, ...(state.receipt.new_request_id ? { requestId: state.receipt.new_request_id } : {}) } : active(state.preview) ? { offerId: state.preview.offer_id } : undefined; const current = await client.current(ref); publish({ phase: 'current', current: freeze(current) }); return current; }),
    change() { idle(); reviewed = null; publish({ phase: state.preview ? 'ready' : 'empty', quote: null, current: null, error: null }); },
    dispose() { attempt = null; reviewed = null; busy = false; publish({ phase: 'empty', preview: null, quote: null, receipt: null, current: null, missing: false, paused: false, error: null }); memory?.clear(); },
  };
}

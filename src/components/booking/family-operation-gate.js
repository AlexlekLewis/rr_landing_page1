const codes = new Set(['unavailable', 'family_unavailable', 'review_required', 'rate_limited', 'invalid_request', 'verification_failed', 'verification_unavailable', 'slot_taken', 'outcome_unknown', 'payment_limit', 'under18_needs_parent']);
export class FamilyOperationError extends Error {
  constructor(code = 'unavailable', status = 0, retryAfter = 0) { super(code); this.code = code; this.status = status; this.retryAfter = retryAfter; }
}
function safeError(error) {
  return new FamilyOperationError(codes.has(error?.code) ? error.code : 'unavailable', Number.isSafeInteger(error?.status) ? error.status : 0, Number.isSafeInteger(error?.retryAfter) ? error.retryAfter : 0);
}
function frozenIntent(value) {
  let encoded;
  try { encoded = JSON.stringify(value, (key, item) => {
    if (['family_token', 'request_token', 'turnstile_token'].includes(key)) throw new FamilyOperationError('invalid_request', 400);
    return item;
  }); } catch { throw new FamilyOperationError('invalid_request', 400); }
  if (!encoded || new TextEncoder().encode(encoded).length > 24000) throw new FamilyOperationError('invalid_request', 400);
  const freeze = item => { if (item && typeof item === 'object') { for (const child of Object.values(item)) freeze(child); Object.freeze(item); } return item; };
  return freeze(JSON.parse(encoded));
}

/** One visit-wide latch and private financial journal. Snapshots contain no intent or bearer. */
export function createFamilyOperationGate() {
  let paused = false, pending = null, generation = 0, snapshot = Object.freeze({ paused: false, pending: null });
  const listeners = new Set(), aborters = new Set();
  const emit = () => {
    snapshot = Object.freeze({ paused, pending: pending ? Object.freeze({ kind: pending.kind, phase: pending.phase, target: pending.body.booking_id ?? pending.body.event_id ?? pending.body.prior_request_id ?? null }) : null });
    for (const listener of listeners) listener();
  };
  async function dispatch(operation, transport) {
    if (paused) throw new FamilyOperationError('rate_limited', 429);
    if (operation.promise) return operation.promise;
    operation.phase = 'sending'; emit(); const sequence = generation;
    operation.promise = (async () => {
      try {
        const result = await operation.execute({ body: operation.body, nonce: operation.nonce, transport });
        if (generation === sequence && pending === operation) { pending = null; emit(); }
        return result;
      } catch (raw) {
        const error = safeError(raw);
        if (generation === sequence && pending === operation) {
          if (error.code === 'rate_limited') paused = true;
          if (error.status === 409 && ['review_required', 'slot_taken'].includes(error.code)) pending = null;
          else if (!operation.retried && [400, 404].includes(error.status)) pending = null;
          else operation.phase = paused ? 'paused' : 'unknown';
          emit();
        }
        throw error;
      }
    })();
    // Install settlement cleanup after assigning the promise, including when an
    // injected transport throws synchronously before its first await.
    operation.promise.then(() => { operation.promise = null; }, () => { operation.promise = null; });
    return operation.promise;
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    pause() { paused = true; if (pending) pending.phase = 'paused'; emit(); },
    assertReadable() {
      if (paused) throw new FamilyOperationError('rate_limited', 429);
    },
    perform(kind, body, execute, transport, existingNonce) {
      if (paused) return Promise.reject(new FamilyOperationError('rate_limited', 429));
      if (!['cancel', 'choice', 'credit_request', 'card_request'].includes(kind) || (existingNonce !== undefined && !/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(existingNonce))) return Promise.reject(new FamilyOperationError('invalid_request', 400));
      const intent = frozenIntent(body), key = JSON.stringify([kind, intent]);
      if (pending && (pending.key !== key || (existingNonce !== undefined && existingNonce !== pending.nonce))) return Promise.reject(new FamilyOperationError('outcome_unknown'));
      if (!pending) pending = { kind, body: intent, key, nonce: existingNonce ?? crypto.randomUUID(), execute, phase: 'sending', promise: null, retried: false };
      else if (!pending.promise) pending.retried = true;
      return dispatch(pending, transport);
    },
    retry(transport) {
      if (!pending || pending.exclusive) return Promise.reject(new FamilyOperationError('invalid_request', 400));
      if (!pending.promise) pending.retried = true;
      return dispatch(pending, transport);
    },
    registerAbort(abort) { aborters.add(abort); return () => aborters.delete(abort); },
    acquireExclusive(kind, target) {
      if (paused) throw new FamilyOperationError('rate_limited', 429);
      if (pending || kind !== 'lapsed_request') throw new FamilyOperationError('outcome_unknown');
      const held = { kind, phase: 'sending', body: { prior_request_id: target }, exclusive: true };
      pending = held; emit();
      return Object.freeze({
        setUnknown() { if (pending === held) { held.phase = paused ? 'paused' : 'unknown'; emit(); } },
        release() { if (pending === held) { pending = null; emit(); } },
      });
    },
    clear() {
      if (pending?.exclusive) return false;
      generation++; pending = null;
      for (const abort of aborters) abort(); aborters.clear(); emit();
      // A429 is permanent for this visit; clear never resets that latch.
      return true;
    },
  };
}

export const familyOperationGate = createFamilyOperationGate();

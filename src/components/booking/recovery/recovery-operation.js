import { creditFields } from '../credit-client';
import { FamilyOperationError } from '../family-operation-gate';
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const priceKeys = ['per_session_cents', 'sessions', 'discount_applied', 'first_session_hold_cents', 'rest_cents', 'total_cents'];
const termsMatch = (a, b) => priceKeys.every(key => a.price[key] === b.price[key]) && a.dates.length === b.dates.length && a.dates.every((day, i) => day.date === b.dates[i].date && Date.parse(day.starts_at) === Date.parse(b.dates[i].starts_at) && Date.parse(day.ends_at) === Date.parse(b.dates[i].ends_at));
function frozen(value) { const copy = JSON.parse(JSON.stringify(value)); const freeze = v => { if (v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }; return freeze(copy); }
const blank = () => ({ phase: 'idle', selected: null, mode: null, busy: false, error: null, quote: null, receipt: null, current: null, balance: null });
/** Exact original intent exists only in this document's closure. No writer retry is exposed.
 * @param {() => string} [newNonce]
 */
export function createRecoveryOperation(client, gate, newNonce = () => crypto.randomUUID()) {
  let state = Object.freeze(blank()), original = null, reviewedFields = null, release = null, sequence = 0;
  const listeners = new Set(), emit = patch => { state = Object.freeze({ ...state, ...patch }); listeners.forEach(fn => fn()); };
  const ready = () => { gate.assertReadable(); if (state.busy || original || gate.getSnapshot().pending) throw new FamilyOperationError('outcome_unknown'); };
  function bind(read) {
    if (read.receipt_state !== 'found') throw new FamilyOperationError('outcome_unknown');
    const r = read.receipt;
    if (r.nonce !== original.nonce || r.prior_request_id !== original.prior_request_id) throw new FamilyOperationError('outcome_unknown');
    if (r.outcome === 'accepted') {
      const expected = state.quote;
      if (!termsMatch(r.result, expected)) throw new FamilyOperationError('outcome_unknown');
    }
    return read;
  }
  const failed = error => ({ error: error?.code ?? 'unavailable', busy: false });
  async function inspect(id, mode) {
    ready(); const n = ++sequence; reviewedFields = null; emit({ ...blank(), selected: id, mode, busy: true });
    try { const value = await (mode === 'remaining' ? client.remaining(id) : client.current(id)); if (n === sequence) emit(mode === 'remaining' ? { phase: 'balance', balance: value, busy: false } : { phase: value.request ? 'current' : 'draft', current: value, busy: false }); }
    catch (error) { if (n === sequence) emit(failed(error)); }
  }
  async function quote(input) {
    ready(); const fields = creditFields({ ...input, consent_save_card: false }); emit({ busy: true, error: null, quote: null }); reviewedFields = null;
    try { const q = await client.quote(state.selected, fields); reviewedFields = frozen(fields); emit({ phase: 'quoted', quote: q, busy: false }); }
    catch (error) { emit({ ...failed(error), phase: 'draft' }); }
  }
  async function accept(input, confirmed, token) {
    ready(); const fields = creditFields(input);
    if (!state.quote || !reviewedFields || !confirmed || fields.consent_save_card !== true || !same({ ...fields, consent_save_card: false }, reviewedFields) || !token) throw new FamilyOperationError('invalid_request', 400);
    original = frozen({ prior_request_id: state.selected, fields, review: state.quote.review, nonce: newNonce() });
    try { release = gate.acquireExclusive('lapsed_request', state.selected); } catch (error) { original = null; throw error; }
    emit({ phase: 'unknown', busy: true, error: null });
    try {
      const ack = bind(await client.accept(original, token));
      const receipt = bind(await client.receipt(original));
      if (!same(ack, receipt)) throw new FamilyOperationError('outcome_unknown');
      original = null; release.release(); release = null; emit({ phase: 'receipt', receipt, busy: false });
    } catch (error) { release?.setUnknown(); emit(failed(error)); }
  }
  async function readOriginal() {
    gate.assertReadable(); if (!original || state.busy) throw new FamilyOperationError('invalid_request', 400);
    emit({ busy: true, error: null });
    try { const read = bind(await client.receipt(original)); original = null; release.release(); release = null; emit({ phase: 'receipt', receipt: read, busy: false }); }
    catch (error) { release?.setUnknown(); emit(failed(error)); }
  }
  return {
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }, getSnapshot: () => state, locked: () => Boolean(original), inspect, quote, accept, readOriginal,
    invalidate() { ready(); reviewedFields = null; emit({ phase: 'draft', quote: null, error: null }); },
    async current() { ready(); emit({ busy: true, error: null }); try { const current = await client.current(state.selected); emit({ current, phase: 'current', busy: false }); } catch (error) { emit(failed(error)); } },
    close() { if (original || state.busy) return false; ++sequence; reviewedFields = null; emit(blank()); return true; },
    dispose() { ++sequence; client.dispose(); original = null; release?.release(); release = null; reviewedFields = null; state = Object.freeze(blank()); },
  };
}

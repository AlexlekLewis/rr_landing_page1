import { expect, it, vi } from 'vitest';
import { createFamilyOperationGate } from '../family-operation-gate';
import { createRecoveryOperation } from './recovery-operation';
import { fields, quote, receipt, current, nonce, prior } from './recovery-fixtures.test-helper';
const deferred = () => { let resolve!: (value: any) => void; const promise = new Promise<any>(done => { resolve = done; }); return { resolve, promise }; };
async function setup(overrides = {}) {
  const gate = createFamilyOperationGate();
  const client = { current: vi.fn(async () => current()), quote: vi.fn(async () => quote()), accept: vi.fn(async () => receipt()), receipt: vi.fn(async () => receipt()), dispose: vi.fn(), ...overrides };
  const next = vi.fn(() => nonce), operation = createRecoveryOperation(client, gate, next);
  await operation.inspect(prior, 'fresh'); await operation.quote(fields());
  return { client, gate, next, operation };
}
it('waits for the independent original receipt after ACK; transient unknown remains busy', async () => {
  const delayed = deferred(), t = await setup({ receipt: vi.fn(() => delayed.promise) });
  const saving = t.operation.accept({ ...fields(), consent_save_card: true }, true, 'unit-challenge');
  await vi.waitFor(() => expect(t.client.receipt).toHaveBeenCalledTimes(1));
  expect(t.operation.getSnapshot()).toMatchObject({ phase: 'unknown', busy: true }); expect(t.gate.getSnapshot()).toMatchObject({ pending: { kind: 'lapsed_request' } });
  await expect(t.operation.readOriginal()).rejects.toMatchObject({ code: 'invalid_request' });
  delayed.resolve(receipt()); await saving;
  expect(t.operation.getSnapshot()).toMatchObject({ phase: 'receipt', busy: false }); expect(t.gate.getSnapshot().pending).toBeNull(); expect(t.next).toHaveBeenCalledTimes(1);
});
it('freezes exact intent after lost ACK and not_found; manual recovery never replays writer', async () => {
  const read = vi.fn(async (_attempt: unknown) => ({ schema_version: 1, receipt_state: 'not_found' }));
  const t = await setup({ accept: vi.fn(async () => { throw Error('unit-lost'); }), receipt: read });
  const submitted = { ...fields(), consent_save_card: true }; await t.operation.accept(submitted, true, 'unit-challenge'); submitted.parent.email = 'changed@example.test';
  expect(t.operation.close()).toBe(false); expect(t.gate.clear()).toBe(false);
  await expect(t.operation.quote(fields())).rejects.toMatchObject({ code: 'outcome_unknown' });
  await expect(t.gate.retry()).rejects.toMatchObject({ code: 'invalid_request' });
  await t.operation.readOriginal(); expect(t.operation.locked()).toBe(true); expect(t.operation.getSnapshot().busy).toBe(false);
  expect(read.mock.calls[0][0]).toMatchObject({ nonce, fields: { parent: { email: 'family@example.test' } } });
  read.mockImplementationOnce(async () => receipt()); await t.operation.readOriginal();
  expect(t.operation.getSnapshot().phase).toBe('receipt'); expect(t.client.accept).toHaveBeenCalledTimes(1); expect(t.next).toHaveBeenCalledTimes(1);
});
it('keeps mismatched nonce, terms or ACK/receipt bodies unknown', async () => {
  for (const mutate of [(r: any) => { r.receipt.nonce = prior; }, (r: any) => { r.receipt.result.price.total_cents += 1; }, (r: any) => { r.receipt.result.server_now = '2026-11-09T09:00:01+11:00'; }]) {
    const bad = receipt(); mutate(bad); const t = await setup({ receipt: vi.fn(async () => bad) });
    await t.operation.accept({ ...fields(), consent_save_card: true }, true, 'unit-challenge'); expect(t.operation.locked()).toBe(true); expect(t.operation.getSnapshot().phase).toBe('unknown');
  }
});
it('requires explicit fresh consent and exact reviewed fields; editing discards review', async () => {
  const t = await setup();
  await expect(t.operation.accept(fields(), true, 'unit-challenge')).rejects.toMatchObject({ code: 'invalid_request' });
  await expect(t.operation.accept({ ...fields(), consent_save_card: true }, false, 'unit-challenge')).rejects.toMatchObject({ code: 'invalid_request' });
  t.operation.invalidate(); expect(t.operation.getSnapshot().quote).toBeNull();
  await expect(t.operation.accept({ ...fields(), consent_save_card: true }, true, 'unit-challenge')).rejects.toMatchObject({ code: 'invalid_request' }); expect(t.client.accept).not.toHaveBeenCalled();
});
it('records definitive unavailability and needs explicit new review; no automatic quote/current', async () => {
  const t = await setup({ accept: vi.fn(async () => receipt('unavailable')), receipt: vi.fn(async () => receipt('unavailable')) });
  await t.operation.accept({ ...fields(), consent_save_card: true }, true, 'unit-challenge');
  expect(t.operation.getSnapshot()).toMatchObject({ receipt: { receipt: { outcome: 'unavailable' } } }); expect(t.operation.locked()).toBe(false); expect(t.client.quote).toHaveBeenCalledTimes(1); expect(t.client.current).toHaveBeenCalledTimes(1);
});
it('visit429 blocks every further recovery read and writer while original stays retained', async () => {
  const t = await setup({ accept: vi.fn(async () => { t.gate.pause(); throw { code: 'rate_limited' }; }) });
  await t.operation.accept({ ...fields(), consent_save_card: true }, true, 'unit-challenge');
  await expect(t.operation.readOriginal()).rejects.toMatchObject({ code: 'rate_limited' }); expect(t.operation.locked()).toBe(true); expect(t.client.receipt).not.toHaveBeenCalled();
});

import { expect, it, vi } from 'vitest';
import { createFamilyPublicReader } from './family-public-reader';
import { createFamilyOperationGate, FamilyOperationError } from './family-operation-gate';
it('allows public availability reads during an unknown financial choice while stopping other writes', async () => {
  const gate = createFamilyOperationGate(), client = { catalog: vi.fn().mockResolvedValue({ live: true }), slots: vi.fn().mockResolvedValue({ live: true }) };
  await expect(gate.perform('credit_request', { fields: {} }, () => Promise.reject(new FamilyOperationError()))).rejects.toBeTruthy();
  const reads = createFamilyPublicReader(gate, client); await reads.catalog(); await reads.slots({ centre: 'mickleham' }); expect(client.catalog).toHaveBeenCalledTimes(1); expect(client.slots).toHaveBeenCalledTimes(1);
  await expect(gate.perform('cancel', {}, vi.fn())).rejects.toMatchObject({ code: 'outcome_unknown' });
});
it('pauses every later active-visit public read on429 without changing anonymous behavior', async () => {
  const gate = createFamilyOperationGate(), client = { catalog: vi.fn().mockRejectedValue(new FamilyOperationError('rate_limited', 429)), slots: vi.fn() }, reads = createFamilyPublicReader(gate, client);
  await expect(reads.catalog()).rejects.toMatchObject({ code: 'rate_limited' }); await expect(reads.slots({})).rejects.toMatchObject({ code: 'rate_limited' }); expect(client.slots).not.toHaveBeenCalled();
  const ordinary = createFamilyPublicReader(null, client); await expect(ordinary.catalog()).rejects.toMatchObject({ code: 'rate_limited' }); expect(client.catalog).toHaveBeenCalledTimes(2);
});

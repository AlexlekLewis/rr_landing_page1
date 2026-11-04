import { expect, it, vi } from 'vitest';
import { createFamilyOperationGate, FamilyOperationError } from './family-operation-gate';
import { id } from './fixtures.test-helper';
import { reviewMarker } from './credit-fixtures.test-helper';

it('deduplicates double submit with one private immutable intent and nonce', async () => {
  const gate = createFamilyOperationGate(); let release: (value: unknown) => void = () => {};
  const execute = vi.fn().mockImplementation(() => new Promise(resolve => { release = resolve; }));
  const body = { fields: { players: [{ name: 'Test Player' }] }, review: reviewMarker };
  const first = gate.perform('credit_request', body, execute), second = gate.perform('credit_request', body, execute);
  expect(execute).toHaveBeenCalledTimes(1); body.fields.players[0].name = 'Changed';
  expect(execute.mock.calls[0][0].body.fields.players[0].name).toBe('Test Player');
  expect(JSON.stringify(gate.getSnapshot())).not.toContain('Test Player'); expect(JSON.stringify(gate.getSnapshot())).not.toContain(reviewMarker);
  release({ saved: true }); await Promise.all([first, second]); expect(gate.getSnapshot().pending).toBeNull();
});
it('retains the exact nonce, fields and opaque review after unknown outcome without retaining challenge transport', async () => {
  const gate = createFamilyOperationGate(), execute = vi.fn().mockRejectedValueOnce(new Error('raw provider private detail')).mockResolvedValueOnce({ saved: true });
  const body = { fields: { note: 'Test request' }, review: reviewMarker };
  await expect(gate.perform('credit_request', body, execute, { challenge: 'unit-one' })).rejects.toMatchObject({ code: 'unavailable' });
  await expect(gate.perform('cancel', { booking_id: id(1) }, execute)).rejects.toMatchObject({ code: 'outcome_unknown' });
  expect(gate.getSnapshot().pending).toMatchObject({ kind: 'credit_request', phase: 'unknown' });
  await gate.retry({ challenge: 'unit-two' });
  expect(execute.mock.calls[1][0].nonce).toBe(execute.mock.calls[0][0].nonce); expect(execute.mock.calls[1][0].body).toBe(execute.mock.calls[0][0].body);
  expect(execute.mock.calls.map(([value]) => value.transport.challenge)).toEqual(['unit-one', 'unit-two']);
});
it('can retry a synchronous unknown failure rather than retaining an already-rejected promise', async () => {
  const gate = createFamilyOperationGate(), execute = vi.fn().mockImplementationOnce(() => { throw new Error('private'); }).mockResolvedValueOnce({ saved: true });
  await expect(gate.perform('cancel', { booking_id: id(1) }, execute)).rejects.toMatchObject({ code: 'unavailable' });
  await expect(gate.retry()).resolves.toEqual({ saved: true }); expect(execute).toHaveBeenCalledTimes(2);
});
it('releases an explicit atomic review refusal for a newly reviewed attempt and new nonce', async () => {
  const gate = createFamilyOperationGate(), execute = vi.fn().mockRejectedValueOnce(new FamilyOperationError('review_required', 409)).mockResolvedValueOnce({ saved: true });
  await expect(gate.perform('credit_request', { review: reviewMarker }, execute)).rejects.toMatchObject({ code: 'review_required' });
  expect(gate.getSnapshot().pending).toBeNull(); await gate.perform('credit_request', { review: reviewMarker + '0' }, execute);
  expect(execute.mock.calls[1][0].nonce).not.toBe(execute.mock.calls[0][0].nonce);
});
it('keeps429 paused for the remainder of the visit, including after memory clear', async () => {
  const gate = createFamilyOperationGate(), execute = vi.fn().mockRejectedValue(new FamilyOperationError('rate_limited', 429));
  await expect(gate.perform('cancel', { booking_id: id(1) }, execute)).rejects.toMatchObject({ code: 'rate_limited' });
  gate.clear(); expect(gate.getSnapshot()).toMatchObject({ paused: true, pending: null });
  await expect(gate.perform('choice', { event_id: id(2) }, execute)).rejects.toMatchObject({ code: 'rate_limited' }); expect(execute).toHaveBeenCalledTimes(1); expect(() => gate.assertReadable()).toThrow('rate_limited');
});
it.each(['family_token', 'request_token', 'turnstile_token'])('rejects %s inside retained business intent', async key => {
  const gate = createFamilyOperationGate(), execute = vi.fn();
  expect(() => gate.perform('credit_request', { fields: { [key]: 'private' } }, execute)).toThrow('invalid_request'); expect(execute).not.toHaveBeenCalled();
});

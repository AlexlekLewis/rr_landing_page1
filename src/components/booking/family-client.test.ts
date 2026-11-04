import { expect, it, vi } from 'vitest';
import { createFamilyClient, familyError, parseFamily } from './family-client';
import { cancelReceipt, choiceReceipt, family, familyEnv, jsonResponse, preview } from './family-fixtures.test-helper';
import { id } from './fixtures.test-helper';

const capability = 'a'.repeat(64), memory = { read: () => capability };
const nonceOf = (init: RequestInit) => (init.headers as Record<string, string>)['Idempotency-Key'];
const cancellation = () => ({ booking_id: id(601), expected_fee_cents: 3500, accept_fee: true });

it('puts a capability only in a credential-free no-store POST body', async () => {
  const send = vi.fn().mockResolvedValue(jsonResponse({ ok: true, family: family() }));
  await createFamilyClient(familyEnv, send, memory).read();
  const [url, init] = send.mock.calls[0];
  expect(url).toBe('http://127.0.0.1:54321/functions/v1/public-private-manage');
  expect(url.includes(capability)).toBe(false); expect(JSON.stringify(init.headers).includes(capability)).toBe(false);
  expect(JSON.parse(init.body).family_token === capability).toBe(true);
  expect(init).toMatchObject({ method: 'POST', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' });
});
it('rejects a missing capability and remote local-mode configuration before networking', async () => {
  const send = vi.fn();
  await expect(createFamilyClient(familyEnv, send, { read: () => null }).read()).rejects.toMatchObject({ code: 'family_unavailable' });
  await expect(createFamilyClient({ ...familyEnv, VITE_PRIVATE_BOOKING_URL: 'https://remote.example.test/functions/v1' }, send, memory).read()).rejects.toMatchObject({ code: 'unavailable' });
  expect(send).not.toHaveBeenCalled();
});
it('projects only family DTO fields and rejects invalid money, states and duplicate identities', () => {
  const raw = family(); Object.assign(raw, { family_token: capability, provider_id: 'unit-private' });
  Object.assign(raw.items[0], { net: 'private', payment: 'private' });
  const parsed = parseFamily({ ok: true, family: raw });
  expect(JSON.stringify(parsed).includes(capability)).toBe(false); expect(parsed.items[0]).not.toHaveProperty('net');
  for (const amount of [-1, '1000', Number.MAX_SAFE_INTEGER + 1]) {
    const bad = family(); Object.assign(bad.players[0], { available_credit_cents: amount }); expect(() => parseFamily({ ok: true, family: bad })).toThrow();
  }
  const duplicate = family(); duplicate.players.push(duplicate.players[0]); expect(() => parseFamily({ ok: true, family: duplicate })).toThrow();
  const state = family(); state.items[0].state = 'paid'; expect(() => parseFamily({ ok: true, family: state })).toThrow();
});
it.each([null, 0, 3500])('preserves the applied cancellation fee as %s without inventing a decision', applied => {
  const raw = family(); Object.assign(raw.items[0], { cancellation_fee_cents: applied });
  expect(parseFamily({ ok: true, family: raw }).items[0].cancellation_fee_cents).toBe(applied);
});
it('binds previews to the selected booking and validates the server monetary facts', async () => {
  const send = vi.fn().mockResolvedValueOnce(jsonResponse({ ok: true, preview: preview() }))
    .mockResolvedValueOnce(jsonResponse({ ok: true, preview: { ...preview(), booking_id: id(602) } }));
  const client = createFamilyClient(familyEnv, send, memory);
  expect((await client.preview(id(601))).fee_cents).toBe(3500);
  await expect(client.preview(id(601))).rejects.toMatchObject({ code: 'unavailable' });
});
it('deduplicates an in-flight double click and accepts only its retained nonce and booking', async () => {
  let resolve: (response: Response) => void = () => {};
  const send = vi.fn().mockImplementation(() => new Promise<Response>(done => { resolve = done; }));
  const client = createFamilyClient(familyEnv, send, memory), first = client.cancel(cancellation()), second = client.cancel(cancellation());
  expect(send).toHaveBeenCalledTimes(1);
  const nonce = nonceOf(send.mock.calls[0][1]);
  resolve(jsonResponse({ ok: true, cancellation: { ...cancelReceipt(nonce), provider_id: 'not-public' } }));
  const results = await Promise.all([first, second]);
  expect(results[0]).toEqual(results[1]); expect(results[0]).not.toHaveProperty('provider_id'); expect(client.state().pending).toBeNull();
});
it('retains a lost response exactly and refuses a different financial choice before its retry', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('private transport diagnostic'))
    .mockImplementationOnce((_url, init) => Promise.resolve(jsonResponse({ ok: true, cancellation: cancelReceipt(nonceOf(init)) })));
  const client = createFamilyClient(familyEnv, send, memory);
  await expect(client.cancel(cancellation())).rejects.toMatchObject({ code: 'unavailable' });
  expect(client.state().pending).toMatchObject({ kind: 'cancel', phase: 'unknown' });
  await expect(client.choose({ event_id: id(801), choice: 'refund' })).rejects.toMatchObject({ code: 'outcome_unknown' });
  await expect(client.cancel({ ...cancellation(), expected_fee_cents: 0 })).rejects.toMatchObject({ code: 'outcome_unknown' });
  expect(send).toHaveBeenCalledTimes(1);
  await client.retry();
  expect(send.mock.calls[0][1].body === send.mock.calls[1][1].body).toBe(true);
  expect(nonceOf(send.mock.calls[0][1])).toBe(nonceOf(send.mock.calls[1][1]));
  expect(client.state().pending).toBeNull();
});
it.each(['nonce', 'booking', 'fee'])('does not treat a successful HTTP response with the wrong %s as saved', async change => {
  const changeFields = change === 'nonce' ? { request: id(999) } : change === 'booking' ? { booking_id: id(999) } : { fee_cents: 0 };
  const send = vi.fn().mockImplementation((_url, init) => Promise.resolve(jsonResponse({ ok: true, cancellation: { ...cancelReceipt(nonceOf(init)), ...changeFields } })));
  const client = createFamilyClient(familyEnv, send, memory);
  await expect(client.cancel(cancellation())).rejects.toMatchObject({ code: 'unavailable' });
  expect(client.state().pending?.phase).toBe('unknown');
});
it('keeps an unknown attempt after a later authorization refusal', async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error('unit lost response')).mockResolvedValueOnce(jsonResponse({ ok: false, error: { code: 'family_unavailable', message: 'private' } }, 404));
  const client = createFamilyClient(familyEnv, send, memory);
  await expect(client.cancel(cancellation())).rejects.toBeTruthy(); await expect(client.retry()).rejects.toMatchObject({ code: 'family_unavailable' });
  expect(client.state().pending?.phase).toBe('unknown');
});
it('requires a fresh review after a definitive fee refusal and uses a new nonce only for that new choice', async () => {
  const send = vi.fn().mockResolvedValueOnce(jsonResponse({ ok: false, error: { code: 'review_required' } }, 409))
    .mockImplementationOnce((_url, init) => Promise.resolve(jsonResponse({ ok: true, cancellation: { ...cancelReceipt(nonceOf(init)), fee_cents: 0, credit_cents: 13000 } })));
  const client = createFamilyClient(familyEnv, send, memory);
  await expect(client.cancel(cancellation())).rejects.toMatchObject({ code: 'review_required' }); expect(client.state().pending).toBeNull();
  await client.cancel({ ...cancellation(), accept_fee: false, expected_fee_cents: 0 });
  expect(nonceOf(send.mock.calls[0][1])).not.toBe(nonceOf(send.mock.calls[1][1]));
});
it('stops every activity on a non-JSON429 without automatic retries', async () => {
  const send = vi.fn().mockResolvedValue(new Response('unit non-JSON refusal', { status: 429, headers: { 'Retry-After': '52' } }));
  const client = createFamilyClient(familyEnv, send, memory);
  await expect(client.cancel(cancellation())).rejects.toMatchObject({ code: 'rate_limited', retryAfter: 52 });
  await expect(client.read()).rejects.toMatchObject({ code: 'rate_limited' });
  await expect(client.preview(id(601))).rejects.toMatchObject({ code: 'rate_limited' });
  await expect(client.retry()).rejects.toMatchObject({ code: 'rate_limited' });
  expect(send).toHaveBeenCalledTimes(1); expect(client.state().paused).toBe(true);
});
it('validates choice receipts without claiming a queued refund or move is completed', async () => {
  const send = vi.fn().mockImplementation((_url, init) => Promise.resolve(jsonResponse({ ok: true, choice: choiceReceipt(nonceOf(init), 'refund') })));
  const client = createFamilyClient(familyEnv, send, memory), result = await client.choose({ event_id: id(801), choice: 'refund' });
  expect(result.choice).toBe('refund'); expect(result).not.toHaveProperty('refunded'); expect(result).not.toHaveProperty('provider_id');
});
it('clearing an in-flight operation cannot resurrect its memory journal', async () => {
  let reject: (error: Error) => void = () => {};
  const send = vi.fn().mockImplementation(() => new Promise((_resolve, fail) => { reject = fail; }));
  const client = createFamilyClient(familyEnv, send, memory), pending = client.cancel(cancellation());
  client.clear(); reject(new Error('unit aborted')); await expect(pending).rejects.toBeTruthy();
  expect(client.state().pending).toBeNull();
});
it('never exposes raw server or transport messages', async () => {
  const send = vi.fn().mockResolvedValue(jsonResponse({ ok: false, error: { code: '42501', message: 'private database diagnostic', stack: 'private' } }, 503));
  try { await createFamilyClient(familyEnv, send, memory).read(); throw Error('Expected refusal'); } catch (error) {
    expect(familyError(error)).not.toMatch(/database|diagnostic|42501|stack/);
  }
});

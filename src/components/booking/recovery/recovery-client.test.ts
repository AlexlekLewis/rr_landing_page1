import { afterEach, expect, it, vi } from 'vitest';
import { createFamilyOperationGate } from '../family-operation-gate';
import { createRecoveryClient, recoveryEnabled } from './recovery-client';
import { env, fields, quote, receipt, nonce, prior, json } from './recovery-fixtures.test-helper';
import { createRecoveryOperation } from './recovery-operation';
const cap = 'a'.repeat(64), memory = { read: () => cap };
afterEach(() => vi.useRealTimers());
function setup(send: any, config = env) { const gate = createFamilyOperationGate(); return { gate, client: createRecoveryClient(config, send, memory, gate) }; }
it('defaults OFF strictly; no ordinary fallback; original receipt is still readable', async () => {
  expect([undefined, '', 'TRUE', '1', true].every(v => !recoveryEnabled({ VITE_PRIVATE_BOOKING_PAYMENT_RECOVERY_ENABLED: v }))).toBe(true);
  const send = vi.fn(async () => json('receipt', receipt())), t = setup(send, { ...env, VITE_PRIVATE_BOOKING_PAYMENT_RECOVERY_ENABLED: '' });
  await expect(t.client.current(prior)).rejects.toMatchObject({ code: 'family_unavailable' }); expect(send).not.toHaveBeenCalled();
  await t.client.receipt({ prior_request_id: prior, fields: { ...fields(), consent_save_card: true }, nonce, review: quote().review }); expect(send).toHaveBeenCalledTimes(1);
});
it('POSTs capability only in body, exact nonce header, no storage/referrer/credentials', async () => {
  const send = vi.fn(async (_url: string, _init: RequestInit) => json('acceptance', receipt())), { client } = setup(send);
  await client.accept({ prior_request_id: prior, fields: { ...fields(), consent_save_card: true }, nonce, review: quote().review }, 'unit-challenge');
  const [url, init] = send.mock.calls[0]; expect(url).not.toContain(cap); expect(init).toMatchObject({ method: 'POST', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', redirect: 'error' });
  const headers = init.headers as Record<string, string>;
  expect(headers['X-Request-Id']).toBe(nonce); expect(headers['Idempotency-Key']).toBeUndefined(); expect(JSON.parse(init.body as string).family_token).toBe(cap);
});
it('rejects quote consenttrue, cross-request projections and foreign/current payment URLs', async () => {
  const send = vi.fn(async () => json('quote', { ...quote(), prior_request_id: nonce })), { client } = setup(send);
  await expect(client.quote(prior, { ...fields(), consent_save_card: true })).rejects.toMatchObject({ code: 'invalid_request' }); expect(send).not.toHaveBeenCalled();
  await expect(client.quote(prior, fields())).rejects.toBeTruthy();
});
it('preserves opaque genuine Checkout fragments; review/reconcile carries no link', async () => {
  const url = 'https://checkout.stripe.com/c/pay/cs_test_unit#' + 'opaque'.repeat(51);
  let recovery: any = { schema_version: 1, kind: 'remaining_payment', request_id: prior, state: 'ready', payment_state: 'owing', amount_cents: 13000, currency: 'aud', checkout_url: url, expires_at: '2026-11-09T09:30:00Z' };
  const { client } = setup(async () => json('recovery', recovery)); expect((await client.remaining(prior)).checkout_url).toBe(url);
  recovery = { schema_version: 1, kind: 'remaining_payment', request_id: prior, state: 'review', payment_state: 'reconcile', amount_cents: 13000, currency: 'aud' }; expect(await client.remaining(prior)).not.toHaveProperty('checkout_url');
  recovery.checkout_url = url; await expect(client.remaining(prior)).rejects.toBeTruthy();
});
it.each(['https://foreign.example/c/pay/cs_test_unit#opaque', 'https://checkout.stripe.com:444/c/pay/cs_test_unit', 'https://user@checkout.stripe.com/c/pay/cs_test_unit', 'https://checkout.stripe.com/c/pay/cs_test_unit?', 'https://checkout.stripe.com/other/cs_test_unit', 'https://checkout.stripe.com/c/pay/cs_test_unit#bad\nfragment'])('rejects unqualified current link %s', async checkout_url => {
  const { client } = setup(async () => json('recovery', { schema_version: 1, kind: 'remaining_payment', request_id: prior, state: 'ready', payment_state: 'owing', amount_cents: 13000, currency: 'aud', checkout_url, expires_at: '2026-11-09T09:30:00Z' }));
  await expect(client.remaining(prior)).rejects.toBeTruthy();
});
it('malformed actual writer body freezes the original intent; subsequent recovery calls only receipt', async () => {
  const send = vi.fn(async (url: string) => url.endsWith('lapsed-current') ? json('current', { schema_version: 1, kind: 'fresh_request', prior_request_id: prior, request: null }) : url.endsWith('lapsed-quote') ? json('quote', quote()) : url.endsWith('lapsed-request') ? new Response(new Uint8Array([0xe2, 0x82])) : json('receipt', { schema_version: 1, receipt_state: 'not_found' }));
  const { client, gate } = setup(send), operation = createRecoveryOperation(client, gate, () => nonce);
  await operation.inspect(prior, 'fresh'); await operation.quote(fields()); await operation.accept({ ...fields(), consent_save_card: true }, true, 'unit-challenge');
  expect(operation.locked()).toBe(true); await operation.readOriginal(); expect(operation.locked()).toBe(true);
  expect(send.mock.calls.filter(([url]) => url.endsWith('lapsed-request'))).toHaveLength(1); expect(send.mock.calls.filter(([url]) => url.endsWith('lapsed-receipt'))).toHaveLength(1);
});
it.each(['oversize', 'malformed', 'incomplete'])('refuses %s realResponse stream without retry and cancels reader', async kind => {
  let cancelled = false;
  const send = vi.fn(async () => new Response(new ReadableStream({ start(controller) { controller.enqueue(kind === 'oversize' ? new Uint8Array(1048577) : new Uint8Array(kind === 'malformed' ? [0xff] : [0xe2, 0x82])); if (kind !== 'oversize') controller.close(); }, cancel() { cancelled = true; } })));
  const { client } = setup(send); await expect(client.remaining(prior)).rejects.toBeTruthy(); expect(send).toHaveBeenCalledTimes(1); if (kind === 'oversize') expect(cancelled).toBe(true);
});
it('aborts a stalled body deadline and stops all calls after429', async () => {
  vi.useFakeTimers(); let cancelled = false;
  const send = vi.fn(async () => new Response(new ReadableStream({ cancel() { cancelled = true; } }))), { client } = setup(send);
  const result = client.remaining(prior).catch(e => e); await vi.advanceTimersByTimeAsync(18001); expect((await result).code).toBe('unavailable'); expect(cancelled).toBe(true); expect(send).toHaveBeenCalledTimes(1);
  const limited = vi.fn(async () => new Response('{}', { status: 429 })), t = setup(limited); await expect(t.client.remaining(prior)).rejects.toMatchObject({ code: 'rate_limited' }); await expect(t.client.current(prior)).rejects.toMatchObject({ code: 'rate_limited' }); expect(limited).toHaveBeenCalledTimes(1);
});

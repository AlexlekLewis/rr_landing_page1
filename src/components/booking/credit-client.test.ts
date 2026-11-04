import { expect, it, vi } from 'vitest';
import { createCreditClient, creditFields, creditError } from './credit-client';
import { createFamilyOperationGate, FamilyOperationError } from './family-operation-gate';
import { creditEnv, creditFixture, creditReceipt, creditResponse, familyMarker, reviewMarker } from './credit-fixtures.test-helper';

const memory = { read: () => familyMarker };
function setup(f = creditFixture(), override?: (url: string, init: RequestInit) => Promise<Response>) {
  const gate = createFamilyOperationGate(), send = vi.fn(async (url: string, init: RequestInit) => override ? override(url, init) : creditResponse(url.endsWith('credit-quote') ? f.envelope : creditReceipt(f.quote)));
  return { gate, send, client: createCreditClient(creditEnv, send, memory, gate) };
}
it('sends only ordinary nested fields and the memory capability to the dedicated quote endpoint', async () => {
  const f = creditFixture(), test = setup(f); await test.client.quote(f.fields);
  const [url, options] = test.send.mock.calls[0], body = JSON.parse(options.body as string);
  expect(url).toBe('http://127.0.0.1:54321/functions/v1/public-private-credit-quote'); expect(url).not.toContain(familyMarker);
  expect(JSON.stringify(options.headers)).not.toContain(familyMarker); expect(options.headers).not.toHaveProperty('Idempotency-Key');
  expect(body).toEqual({ fields: creditFields(f.fields), family_token: familyMarker });
  expect(options).toMatchObject({ credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', method: 'POST' });
});
it('refuses a missing capability and wrong local backend without anonymous or remote fallback', async () => {
  const f = creditFixture(), send = vi.fn();
  await expect(createCreditClient(creditEnv, send, { read: () => null }, createFamilyOperationGate()).quote(f.fields)).rejects.toMatchObject({ code: 'family_unavailable' });
  await expect(createCreditClient({ ...creditEnv, VITE_PRIVATE_BOOKING_URL: 'https://remote.example.test/functions/v1' }, send, memory, createFamilyOperationGate()).quote(f.fields)).rejects.toMatchObject({ code: 'unavailable' }); expect(send).not.toHaveBeenCalled();
});
it.each([{ credits: [5000], consent: true, mode: 'card' }, { credits: [13000], consent: true, mode: 'setup' }, { credits: [26000], consent: false, mode: 'covered' }])('submits the canonical $mode route using the originally displayed review binding', async ({ credits, consent, mode }) => {
  const f = creditFixture(credits), fresh = creditFixture(credits); fresh.quote.review = 'v1.' + 'ac'.repeat(32) + '.2'; fresh.quote.decision_quote.confirm_by = '2026-11-10T09:01:00+11:00';
  const test = setup(f, async url => creditResponse(url.endsWith('credit-quote') ? fresh.envelope : creditReceipt(f.quote)));
  const result = await test.client.reserve({ ...f.fields, consent_save_card: consent }, f.quote, 'unit-challenge');
  expect(result.funding_mode).toBe(mode); expect(test.send).toHaveBeenCalledTimes(2);
  const [url, init] = test.send.mock.calls[1], body = JSON.parse(init.body as string);
  expect(url).toContain('public-private-credit-request'); expect(body.review).toBe(reviewMarker); expect(body.review).not.toBe(fresh.quote.review);
  expect(body.fields.consent_save_card).toBe(consent); expect(body).toMatchObject({ family_token: familyMarker, turnstile_token: 'unit-challenge', company_website: '' });
  expect((init.headers as Record<string, string>)['Idempotency-Key']).toMatch(/^[a-f\d-]{36}$/);
  expect(JSON.stringify(test.gate.getSnapshot())).not.toContain(familyMarker); expect(test.gate.getSnapshot().pending).toBeNull();
});
it('never submits uncovered card or setup funding without valid consent', async () => {
  for (const credits of [[5000], [13000]]) {
    const f = creditFixture(credits), test = setup(f); await expect(test.client.reserve(f.fields, f.quote, 'unit-challenge')).rejects.toMatchObject({ code: 'invalid_request' }); expect(test.send).not.toHaveBeenCalled();
  }
});
it('normalizes fully covered consent to false and requires a server decision quote', async () => {
  const f = creditFixture([26000]), test = setup(f); await test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-challenge');
  expect(JSON.parse(test.send.mock.calls[1][1].body as string).fields.consent_save_card).toBe(false);
  const missing = creditFixture([26000]), unavailable = setup(missing); Object.assign(missing.quote, { decision_quote: null });
  await expect(unavailable.client.reserve(missing.fields, missing.quote, 'unit-challenge')).rejects.toMatchObject({ code: 'invalid_request' }); expect(unavailable.send).not.toHaveBeenCalled();
});
it('returns a fresh reviewed quote without mutating when the final funding changed', async () => {
  const f = creditFixture(), changed = creditFixture([4000]), test = setup(f, async () => creditResponse(changed.envelope));
  let error: any; try { await test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-challenge'); } catch (e) { error = e; }
  expect(error).toMatchObject({ code: 'review_required', status: 409 }); expect(error.quote.funding.first_due_cents).toBe(9000);
  expect(test.send).toHaveBeenCalledTimes(1); expect(test.gate.getSnapshot().pending).toBeNull();
});
it('retries unknown outcomes with exact nonce, fields and review without a fresh quote', async () => {
  const f = creditFixture(), records: { body: any; nonce: string }[] = [];
  const test = setup(f, async (url, init) => {
    if (url.endsWith('credit-quote')) return creditResponse(f.envelope);
    records.push({ body: JSON.parse(init.body as string), nonce: (init.headers as Record<string, string>)['Idempotency-Key'] });
    if (records.length === 1) throw Error('private transport diagnostic after server save'); return creditResponse(creditReceipt(f.quote));
  });
  await expect(test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-one')).rejects.toMatchObject({ code: 'unavailable' });
  await expect(test.client.quote(f.fields)).rejects.toMatchObject({ code: 'outcome_unknown' });
  await expect(test.gate.perform('cancel', { booking_id: 'unit-other' }, vi.fn())).rejects.toMatchObject({ code: 'outcome_unknown' });
  await test.client.retry('unit-two'); expect(test.send).toHaveBeenCalledTimes(3);
  expect(records[1].nonce).toBe(records[0].nonce); expect(records[1].body.fields).toEqual(records[0].body.fields); expect(records[1].body.review).toBe(records[0].body.review);
  expect(records.map(row => row.body.turnstile_token)).toEqual(['unit-one', 'unit-two']);
});
it.each(['funding', 'dates', 'family-token-as-request-token'])('does not treat a malformed successful %s receipt as a saved request', async field => {
  const f = creditFixture(), bad = creditReceipt(f.quote);
  if (field === 'funding') { bad.request.price.credit_reserved_cents--; bad.request.price.rest_cents++; }
  if (field === 'dates') bad.request.dates = [{ ...bad.request.dates[0], starts_at: '2026-11-11T18:00:00+11:00' }, ...bad.request.dates.slice(1)];
  if (field === 'family-token-as-request-token') bad.request.request_token = familyMarker;
  const test = setup(f, async url => creditResponse(url.endsWith('credit-quote') ? f.envelope : bad));
  await expect(test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-challenge')).rejects.toMatchObject({ code: 'unavailable' }); expect(test.gate.getSnapshot().pending?.phase).toBe('unknown');
});
it('releases an atomic review_required refusal and uses a new nonce for another reviewed submission', async () => {
  const f = creditFixture(), nonces: string[] = []; const test = setup(f, async (url, init) => {
    if (url.endsWith('credit-quote')) return creditResponse(f.envelope);
    nonces.push((init.headers as Record<string, string>)['Idempotency-Key']);
    return nonces.length === 1 ? creditResponse({ ok: false, error: { code: 'review_required' } }, 409) : creditResponse(creditReceipt(f.quote));
  });
  await expect(test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-one')).rejects.toMatchObject({ code: 'review_required' }); expect(test.gate.getSnapshot().pending).toBeNull();
  await test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-two'); expect(nonces[0]).not.toBe(nonces[1]);
});
it('deduplicates the final check and request while one submit is already in flight', async () => {
  const f = creditFixture(); let release: (value: Response) => void = () => {};
  const test = setup(f, (url) => url.endsWith('credit-quote') ? new Promise(resolve => { release = resolve; }) : Promise.resolve(creditResponse(creditReceipt(f.quote))));
  const fields = { ...f.fields, consent_save_card: true }, first = test.client.reserve(fields, f.quote, 'unit-one'), second = test.client.reserve(fields, f.quote, 'unit-two');
  expect(test.send).toHaveBeenCalledTimes(1); release(creditResponse(f.envelope)); await Promise.all([first, second]); expect(test.send).toHaveBeenCalledTimes(2);
});
it('shares the permanent visit429 pause across reads and writes without parsing raw refusal text', async () => {
  const f = creditFixture(), test = setup(f, async () => new Response('private raw refusal', { status: 429 }));
  await expect(test.client.quote(f.fields)).rejects.toMatchObject({ code: 'rate_limited' });
  await expect(test.client.quote(f.fields)).rejects.toMatchObject({ code: 'rate_limited' });
  await expect(test.gate.perform('cancel', {}, vi.fn())).rejects.toMatchObject({ code: 'rate_limited' }); expect(test.send).toHaveBeenCalledTimes(1);
});
it('refuses to retry another kind of pending family action', async () => {
  const test = setup(), execute = vi.fn().mockRejectedValue(new FamilyOperationError());
  await expect(test.gate.perform('cancel', { booking_id: 'unit-other' }, execute)).rejects.toBeTruthy();
  await expect(test.client.retry('unit-challenge')).rejects.toMatchObject({ code: 'invalid_request' }); expect(test.send).not.toHaveBeenCalled();
});
it('excludes monetary authority, family identifiers and browser storage recovery from credit fields', () => {
  const f = creditFixture(); expect(creditFields({ ...f.fields, players: [{ name: ' Test Player ', age: '0' }] }).players).toEqual([{ name: 'Test Player', age: 0 }]);
  for (const key of ['family_token', 'player_id', 'price', 'funding', 'review', 'request_token']) expect(() => creditFields({ ...f.fields, [key]: 'private' })).toThrow('invalid_request');
  expect(() => creditFields({ ...f.fields, parent: { ...f.fields.parent, mobile: '       ' } })).toThrow('invalid_request');
  expect(creditError({ code: '42501', message: 'private SQL detail' })).not.toMatch(/42501|SQL|private/);
});
it('does not dispatch a request when the final refresh refuses a25c remainder', async () => {
  const f = creditFixture(), unsupported = creditFixture([12975]), test = setup(f, async () => creditResponse(unsupported.envelope));
  await expect(test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-challenge')).rejects.toMatchObject({ code: 'payment_limit' });
  expect(test.send).toHaveBeenCalledTimes(1); expect(test.gate.getSnapshot().pending).toBeNull();
});
it('clearing the visit while a final quote is preparing cannot start a financial request later', async () => {
  const f = creditFixture(); let release: (response: Response) => void = () => {};
  const test = setup(f, async () => new Promise(resolve => { release = resolve; }));
  const pending = test.client.reserve({ ...f.fields, consent_save_card: true }, f.quote, 'unit-challenge');
  test.gate.clear(); test.client.clear(); release(creditResponse(f.envelope));
  await expect(pending).rejects.toMatchObject({ code: 'unavailable' }); expect(test.send).toHaveBeenCalledTimes(1); expect(test.gate.getSnapshot().pending).toBeNull();
});

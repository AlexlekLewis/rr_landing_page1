import { expect, it, vi } from 'vitest';
import { catalog, id, slot } from './fixtures.test-helper';
import { checkoutUrl, createPublicClient, parseRequest, publicConfig, publicError } from './public-client';
const env = { VITE_APP_ENV: 'local', VITE_PRIVATE_BOOKING_URL: 'http://127.0.0.1:54321/functions/v1', VITE_PRIVATE_BOOKING_KEY: 'unit-public-anon', VITE_SUPABASE_URL: 'http://127.0.0.1:54331' };
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Retry-After': '90' } });
const receipt = () => ({ ok: true, request: { request_id: id(7), state: 'checkout', expires_at: '2026-11-09T09:30:00+11:00', server_now: '2026-11-09T09:00:00+11:00', expires_in_seconds: 1800, dates: slot().series_check.dates, price: slot().price, request_token: 'unit_scoped_request_token_123456789', checkout_state: 'ready', checkout_url: 'https://checkout.stripe.com/c/pay/cs_test_unit' } });
it('uses only the dedicated portal backend and no-store credential-free requests', async () => {
  const fetch = vi.fn().mockResolvedValue(response(catalog())); await createPublicClient(env, fetch).catalog(); const [url, init] = fetch.mock.calls[0];
  expect(url).toBe('http://127.0.0.1:54321/functions/v1/public-private-catalog'); expect(url).not.toContain('54331'); expect(init).toMatchObject({ cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' }); expect(init.headers.apikey).toBe('unit-public-anon');
});
it.each(['https://remote.supabase.co/functions/v1', 'http://127.0.0.1:54331/functions/v1', 'http://127.0.0.1:54321/functions/v1?debug=true'])('local mode refuses a remote or wrong backend %s', url => expect(() => publicConfig({ ...env, VITE_PRIVATE_BOOKING_URL: url })).toThrow());
it('refuses mock mode rather than presenting fake availability', () => expect(() => publicConfig({ ...env, VITE_PRIVATE_BOOKING_MOCK: 'true' })).toThrow());
it('keeps challenge changes outside the exact enquiry idempotency nonce', async () => {
  const fetch = vi.fn().mockImplementation(async () => response({ enquiry_id: id(8), call_by: '2026-11-10T09:00:00+11:00', call_by_plain: '9am Tuesday', staff_note: 'private' })); const api = createPublicClient(env, fetch);
  const intent = { player_name: 'Test Player', player_age: 0, parent_name: 'Test Parent', mobile: '0400000001', email: 'test@example.test', source_page: '/book' };
  const value = await api.enquiry(intent, 'unit-challenge-one', id(5)); await api.enquiry(intent, 'unit-challenge-two', id(5));
  expect(fetch.mock.calls.map(([, options]) => options.headers['Idempotency-Key'])).toEqual([id(5), id(5)]); expect(value).not.toHaveProperty('staff_note');
});
it('posts status tokens in JSON without putting them in URL or reissuing them', async () => {
  const fetch = vi.fn().mockResolvedValue(response(receipt())); const out = await createPublicClient(env, fetch).status('unit_scoped_request_token_123456789'); const [url, init] = fetch.mock.calls[0]; expect(url).not.toContain('unit_scoped'); expect(JSON.parse(init.body)).toEqual({ request_token: 'unit_scoped_request_token_123456789' }); expect(out).not.toHaveProperty('request_token'); expect(out.expires_in_seconds).toBe(1800);
});
it('rejects live Checkout in local mode and arbitrary redirect origins everywhere', () => {
  expect(checkoutUrl('https://checkout.stripe.com/c/pay/cs_live_untrusted', true)).toBeNull(); expect(checkoutUrl('https://evil.example/checkout', false)).toBeNull(); expect(checkoutUrl('https://checkout.stripe.com/c/pay/cs_test_unit', true)).toContain('cs_test_unit');
});
it('does not accept a return URL as evidence of received, confirmed or paid', () => {
  expect(() => parseRequest({ payment: 'success' })).toThrow(); const raw = receipt(); raw.request.expires_in_seconds = -1; expect(() => parseRequest(raw)).toThrow();
});
it('rate limiting surfaces a pause without an automatic retry or raw SQL error text', async () => {
  const fetch = vi.fn().mockResolvedValue(response({ code: 'rate_limited', message: 'sensitive diagnostic' }, 429)); let error; try { await createPublicClient(env, fetch).catalog(); } catch (e) { error = e; } expect(fetch).toHaveBeenCalledTimes(1); expect(publicError(error)).toContain('wait'); expect(publicError(error)).not.toContain('diagnostic');
});
it('slot-conflict suggestions drop foreign-centre and internal fields', async () => {
  const fetch = vi.fn().mockResolvedValue(response({ ok: false, error: { code: 'slot_taken', nearest: [{ centre: 'cranbourne-north', profile_id: id(3), starts_at: '2026-11-12T17:00:00+11:00', ends_at: '2026-11-12T18:00:00+11:00' }, { centre: 'mickleham', profile_id: id(3), starts_at: '2026-11-13T17:00:00+11:00', ends_at: '2026-11-13T18:00:00+11:00', net: 7 }] } }, 409));
  let error; try { await createPublicClient(env, fetch).reserve({ centre: 'mickleham' }, 'unit-token', id(4)); } catch (e) { error = e; } expect(error.nearest).toHaveLength(1); expect(error.nearest[0].centre).toBe('mickleham'); expect(error.nearest[0]).not.toHaveProperty('net');
});

import { expect, it, vi } from 'vitest';
import { publicConfig, createPublicClient } from './public-client';
import { QA_PUBLIC_ORIGIN as origin, QA_SUPABASE_URL as backend, hostedBookingRuntime, hostedCheckoutResult } from './private-runtime';
import { catalog } from './fixtures.test-helper';
import { createInvitationClient } from './invitation/invitation-client';
import { header, id as invitationId, secret as invitationToken } from './invitation/invitation-fixtures.test-helper';
import { createRenewalClient } from './renewal/renewal-client';
import { current as renewalCurrent, id as renewalId, secret as renewalToken } from './renewal/renewal-fixtures.test-helper';
import { createAmendmentClient } from './amendment/amendment-client';
import { current as amendmentCurrent, id as amendmentId } from './amendment/amendment-fixtures.test-helper';
const env = { VITE_APP_ENV: 'test', VITE_QA_PUBLIC_ORIGIN: origin, VITE_QA_SUPABASE_URL: backend,
  VITE_PRIVATE_BOOKING_URL: backend + '/functions/v1', VITE_PRIVATE_BOOKING_KEY: 'synthetic-public-key',
  VITE_SUPABASE_URL: backend, VITE_SUPABASE_ANON_KEY: 'synthetic-public-key' };

it('admits one explicit HTTPS TEST backend while keeping test Checkout checks', async () => {
  expect(publicConfig(env)).toEqual({ base: backend + '/functions/v1', key: 'synthetic-public-key', local: true, hostedTest: true });
  const request = vi.fn().mockResolvedValue(Response.json(catalog()));
  await createPublicClient(env, request).catalog();
  expect(request.mock.calls[0][0]).toBe(backend + '/functions/v1/public-private-catalog');
  expect(request.mock.calls[0][1]).toMatchObject({ cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
});
it.each([
  { VITE_QA_SUPABASE_URL: undefined }, { VITE_QA_PUBLIC_ORIGIN: undefined }, { VITE_APP_ENV: 'production' },
  { VITE_QA_PUBLIC_ORIGIN: origin + '/' }, { VITE_QA_PUBLIC_ORIGIN: origin + '/book' },
  { VITE_QA_PUBLIC_ORIGIN: 'https://rra-coaching-test-admin.vercel.app' },
  { VITE_QA_PUBLIC_ORIGIN: 'https://rra-coaching-test-web.vercel.app.evil.invalid' },
  { VITE_QA_SUPABASE_URL: 'https://vejxqtzodktdqcblosuf.supabase.co' },
  { VITE_PRIVATE_BOOKING_URL: 'https://pudldzgmluwoocwxtzhw.supabase.co/functions/v1' },
  { VITE_PRIVATE_BOOKING_URL: backend + '/functions/v1?token=private' },
  { VITE_SUPABASE_URL: 'https://pudldzgmluwoocwxtzhw.supabase.co' },
  { VITE_PRIVATE_BOOKING_KEY: 'sb_secret_synthetic-refused' }, { VITE_SUPABASE_ANON_KEY: '' },
])('refuses incomplete/mixed hosted configuration before fetch: %j', async patch => {
  const request = vi.fn(); await expect(createPublicClient({ ...env, ...patch }, request).catalog()).rejects.toThrow();
  expect(request).not.toHaveBeenCalled();
});
it('refuses a service-role JWT in either browser key slot', () => {
  const token = 'eyJhbGciOiJIUzI1NiJ9.' + btoa(JSON.stringify({ role: 'service_role', ref: 'tbdwfwgvzmieaehxnpzo' })) + '.synthetic';
  expect(() => hostedBookingRuntime({ ...env, VITE_PRIVATE_BOOKING_KEY: token })).toThrow();
  expect(() => hostedBookingRuntime({ ...env, VITE_SUPABASE_ANON_KEY: token })).toThrow();
});
it('leaves ordinary local/prod configuration and non-Checkout original receipts unchanged', () => {
  expect(publicConfig({ VITE_APP_ENV: 'local', VITE_PRIVATE_BOOKING_URL: 'http://127.0.0.1:54321/functions/v1' })).toEqual({ base: 'http://127.0.0.1:54321/functions/v1', key: '', local: true });
  expect(publicConfig({ VITE_APP_ENV: 'production', VITE_PRIVATE_BOOKING_URL: 'https://legacy.example/functions/v1' })).toEqual({ base: 'https://legacy.example/functions/v1', key: '', local: false });
  const original = { state: 'found', receipt: { saved: true, nonce: 'retained' } };
  expect(hostedCheckoutResult(original, true)).toBe(original);
});

const invitationCurrent = () => ({ ...header(), view_kind: 'current_invitation_request', original_receipt: false,
  state: 'request', request_id: invitationId(7), revision: 1, request_state: 'checkout', payment_state: 'checkout_pending',
  checkout_state: 'ready', checkout_url: 'https://checkout.stripe.com/c/pay/cs_test_SYNTHETIC#opaque' });
it.each(['invitation', 'renewal', 'amendment'])('%s current handoff accepts only TEST Checkout on the hosted target', async kind => {
  const current = kind === 'invitation' ? invitationCurrent() : kind === 'renewal' ? renewalCurrent() : amendmentCurrent();
  const request = vi.fn().mockResolvedValueOnce(Response.json({ ok: true, current })).mockResolvedValueOnce(
    Response.json({ ok: true, current: { ...current, checkout_url: current.checkout_url.replace('cs_test_', 'cs_live_') } }));
  let client, reference;
  if (kind === 'invitation') { client = createInvitationClient(env, request, { read: () => invitationToken }); reference = { invitation: invitationId(1), proposalVersion: 1 }; }
  else if (kind === 'renewal') { client = createRenewalClient(env, request, { read: () => renewalToken }); reference = { offerId: renewalId(950001), requestId: renewalId(950003) }; }
  else { const capability = { amendmentId: amendmentId(), token: 'a'.repeat(64) }; client = createAmendmentClient(env, request, { read: () => capability }); reference = { amendmentId: amendmentId(), requestId: amendmentId(4) }; }
  await expect(client.current(reference)).resolves.toMatchObject({ checkout_url: current.checkout_url });
  await expect(client.current(reference)).rejects.toMatchObject({ code: 'unavailable' });
  expect(request).toHaveBeenCalledTimes(2);
  expect(request.mock.calls.every(([url]) => url.startsWith(backend + '/functions/v1/'))).toBe(true);
});

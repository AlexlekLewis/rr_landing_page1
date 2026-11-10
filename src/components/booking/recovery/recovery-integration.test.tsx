// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FamilyManagePage from '../FamilyManagePage';
import { createFamilyClient } from '../family-client';
import { FamilyContext } from '../family-context';
import { createFamilyOperationGate } from '../family-operation-gate';
import { family, familyEnv, jsonResponse } from '../family-fixtures.test-helper';
import { catalog, id } from '../fixtures.test-helper';
import { createRecoveryClient } from './recovery-client';
import { createRecoveryOperation } from './recovery-operation';
import { env, fields, quote, prior, nonce, current } from './recovery-fixtures.test-helper';
vi.mock('../family-public-reader', () => ({ createFamilyPublicReader: () => ({ catalog: async () => catalog() }) }));
afterEach(cleanup);
type RecoveryService = { hasCapability: boolean; client: ReturnType<typeof createFamilyClient>; gate: ReturnType<typeof createFamilyOperationGate>; recovery: ReturnType<typeof createRecoveryOperation>; recoveryEnabled: boolean; clear: () => boolean };
// The existing untyped JS context starts at null; supply its real service shape in this test.
const RecoveryProvider = FamilyContext.Provider as unknown as React.Provider<RecoveryService>;
// Response is Node-native in jsdom; construct body chunks in this DOM's byte
// realm so the real bounded decoder sees ordinary same-realm browser bytes.
function recoveryResponse(value: unknown) {
  return new Response(new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(new TextEncoder().encode(JSON.stringify(value)))); controller.close(); } }));
}

function mount(transport: ReturnType<typeof vi.fn>, server = family()) {
  const gate = createFamilyOperationGate(), memory = { read: () => 'a'.repeat(64), has: () => true, subscribe: (_listener: () => void) => () => false, clear() {} };
  const familySend = vi.fn(async () => jsonResponse({ ok: true, family: server }));
  const client = createFamilyClient(familyEnv, familySend, memory, gate);
  const recovery = createRecoveryOperation(createRecoveryClient(env, transport, memory, gate), gate, () => nonce);
  const clear = vi.fn(() => !recovery.locked());
  render(<MemoryRouter initialEntries={['/booking']}><RecoveryProvider value={{ hasCapability: true, client, gate, recovery, recoveryEnabled: true, clear }}><FamilyManagePage /></RecoveryProvider></MemoryRouter>);
  return { gate, client, recovery, clear, familySend };
}
it('deduplicates confirmed requests and opens the actual recovery reader without submitting a payment', async () => {
  const server = family(); server.items.push({ ...server.items[0], booking_id: id(602) });
  const url = 'https://checkout.stripe.com/c/pay/cs_test_integration#originalOpaque';
  const transport = vi.fn(async (_url: string, _init: RequestInit) => recoveryResponse({ ok: true, recovery: { schema_version: 1, kind: 'remaining_payment', request_id: server.items[0].request_id, state: 'ready', payment_state: 'owing', amount_cents: 13000, currency: 'aud', checkout_url: url, expires_at: '2026-11-18T09:30:00Z' } }));
  mount(transport, server);
  await screen.findByRole('heading', { name: 'Payment and expired requests' });
  expect(screen.getAllByRole('button', { name: 'Check remaining payment' })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Check remaining payment' }));
  expect((await screen.findByRole('link', { name: 'Pay $130 remaining balance' })).getAttribute('href')).toBe(url);
  expect(transport).toHaveBeenCalledTimes(1); expect(transport.mock.calls[0][0]).toMatch(/public-private-payment-recovery$/);
  expect(JSON.parse(transport.mock.calls[0][1].body as string)).toEqual({ request_id: server.items[0].request_id, family_token: 'a'.repeat(64) });
  expect(document.body.innerHTML).not.toContain('a'.repeat(64));
});
it('holds management actions during unknown fresh submission while retaining strict bank-refund eligibility', async () => {
  const server = family(); server.items[0].state = 'expired'; server.items[0].request_id = prior;
  server.items.push({ ...server.items[0], booking_id: id(602), state: 'cancelled', pending_choice_event: id(801), can_request_card_refund: false });
  const transport = vi.fn(async (url: string) => {
    if (url.endsWith('lapsed-current')) return recoveryResponse({ ok: true, current: current() });
    if (url.endsWith('lapsed-quote')) return recoveryResponse({ ok: true, quote: quote() });
    if (url.endsWith('lapsed-request')) throw Error('unit writer response lost');
    return recoveryResponse({ ok: true, receipt: { schema_version: 1, receipt_state: 'not_found' } });
  });
  const t = mount(transport, server); await screen.findByRole('button', { name: 'Review a fresh request after expiry' });
  expect(screen.queryByRole('radio', { name: 'Refund to the original card' })).toBeNull();
  await act(async () => { await t.recovery.inspect(prior, 'fresh'); await t.recovery.quote(fields()); await t.recovery.accept({ ...fields(), consent_save_card: true }, true, 'unit-security'); });
  await screen.findByRole('button', { name: 'Read original fresh-request receipt' });
  expect(t.recovery.locked()).toBe(true); expect(t.gate.getSnapshot()).toMatchObject({ pending: { kind: 'lapsed_request' } });
  expect(screen.queryByRole('button', { name: 'Check submitted result' })).toBeNull();
  expect(screen.queryByRole('link', { name: 'Request another session by card' })).toBeNull();
  expect((screen.getByRole('button', { name: 'Check latest sessions and credit' }) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole('button', { name: 'Save my choice' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('link', { name: 'Close private page' })); expect(t.clear).toHaveReturnedWith(false);
  fireEvent.click(screen.getByRole('button', { name: 'Read original fresh-request receipt' }));
  await waitFor(() => expect(transport.mock.calls.filter(([url]) => url.endsWith('lapsed-receipt'))).toHaveLength(1));
  expect(transport.mock.calls.filter(([url]) => url.endsWith('lapsed-request'))).toHaveLength(1);
  expect(t.recovery.locked()).toBe(true); expect(document.body.innerHTML).not.toContain(nonce);
  expect(sessionStorage.length + localStorage.length).toBe(0);
});

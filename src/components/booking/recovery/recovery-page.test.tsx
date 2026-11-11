// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FamilyContext } from '../family-context';
import { createFamilyOperationGate } from '../family-operation-gate';
import { createRecoveryOperation } from './recovery-operation';
import { catalog, id, slots, starts } from '../fixtures.test-helper';
import { fields, quote, receipt, current, nonce, prior } from './recovery-fixtures.test-helper';
import FamilyRecovery from './FamilyRecovery';
// The existing untyped JS context starts at null; supply its real service shape in this test.
const RecoveryProvider = FamilyContext.Provider as unknown as React.Provider<{ recovery: ReturnType<typeof createRecoveryOperation>; gate: ReturnType<typeof createFamilyOperationGate> }>;
const reads = vi.hoisted(() => ({ catalog: vi.fn(), slots: vi.fn() }));
vi.mock('../family-public-reader', () => ({ createFamilyPublicReader: () => reads }));
vi.mock('../Turnstile', () => ({ default: ({ onToken }: any) => <button type="button" onClick={() => onToken('unit-widget-token')}>Unit security check</button> }));
afterEach(cleanup);
async function mount(overrides = {}, catalogue = catalog()) {
  reads.catalog.mockResolvedValue(catalogue); reads.slots.mockResolvedValue(slots());
  const gate = createFamilyOperationGate(); const client = { current: vi.fn(async () => current()), quote: vi.fn(async () => quote()), receipt: vi.fn(async () => receipt()), accept: vi.fn(async () => receipt()), dispose: vi.fn(), ...overrides };
  const operation = createRecoveryOperation(client, gate, () => nonce); await operation.inspect(prior, 'fresh');
  render(<RecoveryProvider value={{ recovery: operation, gate }}><FamilyRecovery /></RecoveryProvider>);
  await screen.findByRole('button', { name: 'Find a new time' }); return { operation, gate, client };
}
it('uses explicit group-only offers and the first supported group size rather than assuming two players', async () => {
  const catalogue = catalog(); catalogue.group_sizes = [3, 4]; catalogue.coaches[0].offers = { one_on_one: false, group: true };
  await mount({}, catalogue);
  expect((screen.getByLabelText('Session type') as HTMLSelectElement).value).toBe('group');
  expect(screen.queryByRole('option', { name: 'One player' })).toBeNull();
  expect((screen.getByLabelText('Players') as HTMLSelectElement).value).toBe('3');
  fireEvent.click(screen.getByRole('button', { name: 'Find a new time' }));
  await waitFor(() => expect(reads.slots).toHaveBeenCalled());
  expect(reads.slots.mock.calls.at(-1)?.[0]).toMatchObject({ kind: 'group', group_size: 3 });
});
it('does not invent bookable session types when both explicit offers are false', async () => {
  const catalogue = catalog(); catalogue.coaches[0].offers = { one_on_one: false, group: false };
  await mount({}, catalogue);
  expect(screen.queryByRole('option', { name: 'One player' })).toBeNull();
  expect(screen.queryByRole('option', { name: 'Group' })).toBeNull();
  expect((screen.getByRole('button', { name: 'Find a new time' }) as HTMLButtonElement).disabled).toBe(true);
});
async function quoteViaUi() {
  fireEvent.change(screen.getByLabelText('Weekly sessions'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Find a new time' }));
  fireEvent.click(await screen.findByRole('button', { name: /Wednesday 11 November 2026, 5pm Melbourne time/ }));
  fireEvent.click(screen.getByRole('button', { name: /Test Coach.*Choose/ }));
  for (const [label, value] of [['Player’s full name', 'Test Player 1'], ['Age', '12'], ['Parent or person booking’s name', 'Test Parent'], ['Email', 'family@example.test'], ['Mobile', '0400000000']]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Check my request' })); await screen.findByRole('heading', { name: 'Review the new request' });
}
it('shows new dates/hold/balance/total and two unchecked permissions; editing clears both and the quote', async () => {
  const t = await mount(); await quoteViaUi();
  expect(screen.getByText('First-session card hold')).toBeTruthy(); expect(screen.getByText('Remaining block payment')).toBeTruthy(); expect(screen.getByText('$260')).toBeTruthy();
  const permissions = screen.getAllByRole('checkbox') as HTMLInputElement[]; expect(permissions).toHaveLength(2); expect(permissions.every(p => !p.checked)).toBe(true);
  expect((screen.getByRole('button', { name: 'Submit this fresh request' }) as HTMLButtonElement).disabled).toBe(true);
  permissions.forEach(p => fireEvent.click(p)); fireEvent.click(screen.getByRole('button', { name: 'Unit security check' }));
  fireEvent.click(screen.getByRole('button', { name: 'Check my request' }));
  await waitFor(() => expect(t.client.quote).toHaveBeenCalledTimes(2)); await screen.findByRole('heading', { name: 'Review the new request' });
  expect((screen.getAllByRole('checkbox') as HTMLInputElement[]).every(p => !p.checked)).toBe(true);
  screen.getAllByRole('checkbox').forEach(p => fireEvent.click(p)); fireEvent.click(screen.getByRole('button', { name: 'Unit security check' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Note for the coach (optional)' }), { target: { value: 'Changed family note' } });
  expect(screen.queryByRole('heading', { name: 'Review the new request' })).toBeNull(); expect(t.client.accept).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Check my request' })); await screen.findByRole('heading', { name: 'Review the new request' });
  expect((screen.getAllByRole('checkbox') as HTMLInputElement[]).every(p => !p.checked)).toBe(true); expect(t.client.quote).toHaveBeenCalledTimes(3);
});
it('keeps pending receipt recovery disabled and exposes no alternate booking door or raw original nonce', async () => {
  let finish!: (v: any) => void; const delayed = new Promise(done => { finish = done; });
  const t = await mount({ receipt: vi.fn(() => delayed) }); await quoteViaUi();
  screen.getAllByRole('checkbox').forEach(p => fireEvent.click(p)); fireEvent.click(screen.getByRole('button', { name: 'Unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Submit this fresh request' }));
  await waitFor(() => expect(t.client.receipt).toHaveBeenCalledTimes(1));
  expect((screen.getByRole('button', { name: 'Read original fresh-request receipt' }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.queryByRole('button', { name: 'Submit this fresh request' })).toBeNull(); expect(screen.queryByRole('link')).toBeNull(); expect(document.body.innerHTML).not.toContain(nonce); expect(document.body.innerHTML).not.toContain(quote().review);
  finish(receipt()); await screen.findByRole('heading', { name: 'Original fresh-request receipt' }); expect(t.client.accept).toHaveBeenCalledTimes(1);
});
it('shows a one-off amount only with a strict ready current link, separate from original request proof', async () => {
  const gate = createFamilyOperationGate(), url = 'https://checkout.stripe.com/c/pay/cs_test_unit#opaque';
  const client = { remaining: async () => ({ schema_version: 1, kind: 'remaining_payment', request_id: prior, state: 'ready', payment_state: 'owing', amount_cents: 13000, currency: 'aud', checkout_url: url, expires_at: starts }), dispose: vi.fn() };
  const operation = createRecoveryOperation(client, gate); await operation.inspect(prior, 'remaining');
  render(<RecoveryProvider value={{ recovery: operation, gate }}><FamilyRecovery /></RecoveryProvider>);
  const link = screen.getByRole('link', { name: 'Pay $130 remaining balance' }); expect(link.getAttribute('href')).toBe(url); expect(link.getAttribute('referrerpolicy')).toBe('no-referrer');
  expect(link.getAttribute('target')).toBe('_blank'); expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  expect(screen.getByText('Stripe opens in a new tab. Keep this page open to check the balance afterwards.')).toBeTruthy();
  expect(screen.getByText(/This is a payment, not a new card hold/)).toBeTruthy(); expect(screen.queryByRole('checkbox')).toBeNull();
});
it('removes every financial href after visit429, including retained current data after refresh', async () => {
  const gate = createFamilyOperationGate(), url = 'https://checkout.stripe.com/c/pay/cs_test_unit#opaque';
  const currentRead = vi.fn(async () => ({ ...current(), request: { ...receipt().receipt.result, checkout_state: 'ready', checkout_url: url } }));
  const client = { current: currentRead, dispose: vi.fn() }, operation = createRecoveryOperation(client, gate);
  await operation.inspect(prior, 'fresh'); render(<RecoveryProvider value={{ recovery: operation, gate }}><FamilyRecovery /></RecoveryProvider>);
  const originalCheckout = screen.getByRole('link', { name: 'Continue the original card authorisation' });
  expect(originalCheckout.getAttribute('href')).toBe(url); expect(originalCheckout.getAttribute('target')).toBe('_blank');
  expect(screen.getByText('Stripe opens in a new tab. Keep this page open to check the request afterwards.')).toBeTruthy();
  currentRead.mockImplementationOnce(async () => { gate.pause(); throw { code: 'rate_limited' }; });
  fireEvent.click(screen.getByRole('button', { name: 'Check current fresh request' }));
  await waitFor(() => expect(operation.getSnapshot().error).toBe('rate_limited'));
  expect(operation.getSnapshot()).toMatchObject({ current: { request: { checkout_url: url } } }); expect(screen.queryByRole('link')).toBeNull(); expect((screen.getByRole('button', { name: 'Continue the original card authorisation' }) as HTMLButtonElement).disabled).toBe(true);
  cleanup();
  const secondGate = createFamilyOperationGate(), balanceClient = { remaining: async () => ({ state: 'ready', amount_cents: 13000, checkout_url: url, expires_at: starts }), dispose: vi.fn() }, second = createRecoveryOperation(balanceClient, secondGate);
  await second.inspect(prior, 'remaining'); render(<RecoveryProvider value={{ recovery: second, gate: secondGate }}><FamilyRecovery /></RecoveryProvider>);
  expect(screen.getByRole('link', { name: 'Pay $130 remaining balance' })).toBeTruthy();
  await act(async () => secondGate.pause()); expect(screen.queryByRole('link')).toBeNull(); expect((screen.getByRole('button', { name: 'Pay $130 remaining balance' }) as HTMLButtonElement).disabled).toBe(true);
});

// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createFamilyClient } from './family-client';
import { FamilyContext } from './family-context';
import FamilyManagePage from './FamilyManagePage';
import { cancelReceipt, choiceReceipt, family, familyEnv, jsonResponse, preview } from './family-fixtures.test-helper';
import { id } from './fixtures.test-helper';

const capability = 'a'.repeat(64), memory = { read: () => capability };
beforeEach(() => { sessionStorage.clear(); localStorage.clear(); });
afterEach(cleanup);
function harness(handler?: (url: string, init: RequestInit, server: ReturnType<typeof family>) => Promise<Response>) {
  const server = family();
  const send = vi.fn(async (url: string, init: RequestInit) => {
    if (handler) return handler(url, init, server);
    if (url.endsWith('public-private-manage')) return jsonResponse({ ok: true, family: server });
    if (url.endsWith('public-private-cancel-preview')) return jsonResponse({ ok: true, preview: preview() });
    const body = JSON.parse(init.body as string), nonce = (init.headers as Record<string, string>)['Idempotency-Key'];
    if (url.endsWith('public-private-cancel')) {
      server.items[0].state = 'cancelled'; server.items[0].state_plain = 'Cancelled'; server.items[0].cancellation_fee_cents = 3500; server.players[0].available_credit_cents += 9500;
      return jsonResponse({ ok: true, cancellation: cancelReceipt(nonce) });
    }
    if (url.endsWith('public-private-cancel-choice')) {
      server.items[0].pending_choice_event = null;
      return jsonResponse({ ok: true, choice: choiceReceipt(nonce, body.choice) });
    }
    throw Error('Unexpected unit endpoint');
  });
  const client = createFamilyClient(familyEnv, send, memory), clear = vi.fn();
  const mount = (hasCapability = true) => render(<MemoryRouter initialEntries={['/booking']}><FamilyContext.Provider value={{ client, hasCapability, clear }}><FamilyManagePage /></FamilyContext.Provider></MemoryRouter>);
  return { server, send, client, mount };
}
async function ready() { return screen.findByRole('heading', { name: 'Player credit' }); }
async function openTerms() { fireEvent.click(screen.getByRole('button', { name: 'Check cancellation terms' })); return screen.findByRole('heading', { name: 'Check this cancellation' }); }
function confirmFee() { fireEvent.click(screen.getByRole('checkbox', { name: 'I accept the $35 cancellation fee.' })); fireEvent.click(screen.getByRole('button', { name: 'Confirm cancellation' })); }

it('shows proved player balances and sessions while keeping credit booking gated and secrets out of the page', async () => {
  const test = harness(); test.mount(); await ready();
  expect(screen.getByText('Available: $10')).toBeTruthy(); expect(screen.getByText('Reserved for requests: $20')).toBeTruthy();
  expect((screen.getByRole('button', { name: 'Book with my credit' }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByRole('link', { name: 'Request another session by card' }).getAttribute('href')).toBe('/book');
  expect(document.body.innerHTML.includes(capability)).toBe(false); expect(sessionStorage.length + localStorage.length).toBe(0);
});
it('never reads family data without the memory capability', () => {
  const test = harness(); test.mount(false); expect(screen.getByRole('heading', { name: 'Secure link unavailable' })).toBeTruthy();
  expect(test.send).not.toHaveBeenCalled();
});
it('shows the actual fee and requires explicit acceptance before saving and refreshing the balance', async () => {
  const test = harness(); test.mount(); await ready(); await openTerms();
  expect((screen.getByRole('button', { name: 'Confirm cancellation' }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByText('$95')).toBeTruthy(); confirmFee();
  await screen.findByRole('heading', { name: 'Session cancelled' }); await screen.findByText('Available: $105');
  const calls = test.send.mock.calls.filter(([url]) => url.endsWith('public-private-cancel'));
  expect(calls.length).toBe(1); expect(JSON.parse(calls[0][1].body as string)).toMatchObject({ booking_id: id(601), expected_fee_cents: 3500, accept_fee: true });
});
it('keeps an unknown result visible and retries the same operation instead of inventing a second cancellation', async () => {
  const attempts: { body: string; nonce: string }[] = []; let applied = false;
  const test = harness(async (url, init, server) => {
    if (url.endsWith('public-private-manage')) return jsonResponse({ ok: true, family: server });
    if (url.endsWith('public-private-cancel-preview')) return jsonResponse({ ok: true, preview: preview() });
    const nonce = (init.headers as Record<string, string>)['Idempotency-Key']; attempts.push({ body: init.body as string, nonce });
    if (!applied) { applied = true; server.items[0].state = 'cancelled'; server.items[0].state_plain = 'Cancelled'; server.items[0].cancellation_fee_cents = 3500; server.players[0].available_credit_cents += 9500; throw Error('unit response lost after save'); }
    return jsonResponse({ ok: true, cancellation: cancelReceipt(nonce) });
  });
  test.mount(); await ready(); await openTerms(); confirmFee();
  await screen.findByRole('heading', { name: 'Check your submitted choice' }); expect(screen.queryByRole('heading', { name: 'Session cancelled' })).toBeNull();
  expect(screen.queryByText('Available: $10')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Check submitted result' }));
  await screen.findByRole('heading', { name: 'Session cancelled' }); await screen.findByText('Available: $105');
  expect(attempts.length).toBe(2); expect(attempts[0].body === attempts[1].body).toBe(true); expect(attempts[0].nonce).toBe(attempts[1].nonce);
});
it('does not show success for a200 receipt bound to another booking', async () => {
  const test = harness(async (url, init, server) => {
    if (url.endsWith('public-private-manage')) return jsonResponse({ ok: true, family: server });
    if (url.endsWith('public-private-cancel-preview')) return jsonResponse({ ok: true, preview: preview() });
    const nonce = (init.headers as Record<string, string>)['Idempotency-Key'];
    return jsonResponse({ ok: true, cancellation: { ...cancelReceipt(nonce), booking_id: id(999) } });
  });
  test.mount(); await ready(); await openTerms(); confirmFee();
  await screen.findByRole('heading', { name: 'Check your submitted choice' }); expect(screen.queryByRole('heading', { name: 'Session cancelled' })).toBeNull();
});
it('requires another fee preview and explicit consent when the server refuses changed terms', async () => {
  const nonces: string[] = []; let previews = 0;
  const test = harness(async (url, init, server) => {
    if (url.endsWith('public-private-manage')) return jsonResponse({ ok: true, family: server });
    if (url.endsWith('public-private-cancel-preview')) return jsonResponse({ ok: true, preview: previews++ === 0 ? { ...preview(), fee_cents: 0, credit_cents: 13000, server_now: '2026-11-16T17:00:00+11:00' } : preview() });
    const nonce = (init.headers as Record<string, string>)['Idempotency-Key']; nonces.push(nonce);
    return nonces.length === 1 ? jsonResponse({ ok: false, error: { code: 'review_required' } }, 409) : jsonResponse({ ok: true, cancellation: cancelReceipt(nonce) });
  });
  test.server.as_of = '2026-11-16T17:00:00+11:00'; test.mount(); await ready(); await openTerms();
  fireEvent.click(screen.getByRole('button', { name: 'Confirm cancellation' }));
  await screen.findByText(/session or cancellation terms changed/); expect(screen.queryByRole('heading', { name: 'Check this cancellation' })).toBeNull();
  await openTerms(); expect((screen.getByRole('button', { name: 'Confirm cancellation' }) as HTMLButtonElement).disabled).toBe(true); confirmFee();
  await screen.findByRole('heading', { name: 'Session cancelled' }); expect(nonces.length).toBe(2); expect(nonces[0]).not.toBe(nonces[1]);
});
it('shows refund and replacement choices as pending requests, not completed money or a replacement booking', async () => {
  const test = harness(); test.server.items[0].state = 'cancelled'; test.server.items[0].state_plain = 'Cancelled'; test.server.items[0].pending_choice_event = id(801);
  test.mount(); await ready(); expect((screen.getByRole('button', { name: 'Save my choice' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('radio', { name: 'Refund to the original card' })); fireEvent.click(screen.getByRole('button', { name: 'Save my choice' }));
  await screen.findByText('Your refund has been requested. The Academy will confirm when it is completed.');
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Save my choice' })).toBeNull());
  expect(screen.queryByText('Your refund is complete')).toBeNull();
});
it('keeps missing or refused reads distinct from an empty family or a zero balance', async () => {
  const test = harness(async () => jsonResponse({ ok: false, error: { code: 'family_unavailable', message: 'private foreign family' } }, 404));
  test.mount(); await screen.findByRole('alert');
  expect(screen.queryByText('Available: $0')).toBeNull(); expect(screen.queryByText(/No private sessions/)).toBeNull();
  expect(document.body.textContent).not.toContain('private foreign family');
});
it('stops after429 without an automatic read loop or an enabled retry button', async () => {
  const test = harness(async () => new Response('notJSON', { status: 429, headers: { 'Retry-After': '52' } }));
  test.mount(); await screen.findByText(/too many checks/);
  expect((screen.getByRole('button', { name: 'Check latest sessions and credit' }) as HTMLButtonElement).disabled).toBe(true);
  expect(test.send).toHaveBeenCalledTimes(1);
});

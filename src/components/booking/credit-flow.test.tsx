// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { parseCatalog, parseSlots } from './booking-model';
import { catalog, id, slots } from './fixtures.test-helper';
import { creditEnv, creditFixture, creditReceipt, creditResponse, familyMarker, reviewMarker } from './credit-fixtures.test-helper';
import { createCreditClient } from './credit-client';
import { createFamilyOperationGate, FamilyOperationError } from './family-operation-gate';
import { FamilyContext } from './family-context';
import { createFamilyClient } from './family-client';
import { family, jsonResponse } from './family-fixtures.test-helper';
import { requestCheckpoint, writeAttempt, writeDraft } from './private-draft';
const api = vi.hoisted(() => ({ catalog: vi.fn(), slots: vi.fn(), reserve: vi.fn(), status: vi.fn(), enquiry: vi.fn() }));
vi.mock('./public-client', async () => ({ ...await vi.importActual<object>('./public-client'), createPublicClient: () => api }));
vi.mock('./Turnstile', () => ({ default: ({ onToken }: { onToken: (token: string) => void }) => <button type="button" onClick={() => onToken('unit-challenge')}>Complete unit security check</button> }));
import BookPage from './BookPage';
import CreditBookingReview from './CreditBookingReview';
import FamilyManagePage from './FamilyManagePage';
import AskUs from './AskUs';

beforeEach(() => {
  vi.resetAllMocks(); sessionStorage.clear(); localStorage.clear();
  history.replaceState(null, '', '/book/credit?centre=mickleham&coach=test-coach&start=2026-11-11T17%3A00&duration=60&focus=batting');
  api.catalog.mockResolvedValue(parseCatalog(catalog())); api.slots.mockResolvedValue(parseSlots(slots(), 'mickleham'));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function harness(override?: (url: string, init: RequestInit) => Promise<Response>) {
  const f = creditFixture([13000], 1), gate = createFamilyOperationGate();
  const send = vi.fn(async (url: string, init: RequestInit) => override ? override(url, init) : creditResponse(url.endsWith('credit-quote') ? f.envelope : creditReceipt(f.quote)));
  const creditClient = createCreditClient(creditEnv, send, { read: () => familyMarker }, gate);
  const service = { hasCapability: true, creditEnabled: true, creditClient, gate, clear: vi.fn() };
  return { ...f, send, gate, creditClient, service, mount: () => render(<MemoryRouter><FamilyContext.Provider value={service}><BookPage credit /></FamilyContext.Provider></MemoryRouter>) };
}
async function reachReview() {
  await screen.findByRole('heading', { name: 'How many weeks?' }); fireEvent.click(screen.getByRole('button', { name: 'Continue with 1 session' }));
  fireEvent.change(screen.getByLabelText('Player’s full name'), { target: { value: 'Test Credit Player' } }); fireEvent.change(screen.getByLabelText('Age'), { target: { value: '12' } }); fireEvent.change(screen.getByLabelText('Parent or person booking’s name'), { target: { value: 'Test Credit Parent' } }); fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'credit@example.test' } }); fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000000' } });
  fireEvent.click(screen.getByRole('button', { name: 'Check my request' })); await screen.findByRole('heading', { name: 'Check your credit request' });
}
it('never reads an ordinary draft or attempt and stores only request status after validated credit creation', async () => {
  const test = harness(), read = vi.spyOn(Storage.prototype, 'getItem'), write = vi.spyOn(Storage.prototype, 'setItem');
  test.mount(); await reachReview(); expect(read).not.toHaveBeenCalled(); expect(write).not.toHaveBeenCalled();
  expect(screen.queryByRole('checkbox')).toBeNull(); expect(screen.getByText(/No card is needed/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Request using player credit' }));
  await screen.findByRole('heading', { name: 'Request received — not booked yet' });
  expect(api.reserve).not.toHaveBeenCalled(); expect(test.send.mock.calls.filter(([url]) => url.endsWith('credit-request'))).toHaveLength(1);
  expect(sessionStorage.length).toBe(1); const saved = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)!)!);
  expect(saved).toEqual({ request_id: id(7), request_token: 'unit_scoped_credit_request_123456789', mode: 'credit', saved_at: expect.any(Number) });
  const stored = JSON.stringify(saved); expect(stored).not.toMatch(/Test Credit|fields|nonce|review/); expect(stored).not.toContain(familyMarker); expect(stored).not.toContain(reviewMarker);
  expect(document.body.innerHTML).not.toContain(familyMarker); expect(document.body.innerHTML).not.toContain(reviewMarker);
});
it('keeps unknown credit intent in memory and checks the same request without another quote', async () => {
  const f = creditFixture([13000], 1); let writes = 0;
  const test = harness(async url => {
    if (url.endsWith('credit-quote')) return creditResponse(f.envelope);
    if (++writes === 1) throw Error('unit response lost after save'); return creditResponse(creditReceipt(f.quote));
  }); test.mount(); await reachReview();
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Request using player credit' }));
  await screen.findByRole('button', { name: 'Check submitted credit request' }); expect(sessionStorage.length).toBe(0);
  const checked = test.send.mock.calls.filter(([url]) => url.endsWith('credit-quote')).length;
  fireEvent.click(screen.getByRole('button', { name: 'Check submitted credit request' })); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Recover my attempt' }));
  await screen.findByRole('heading', { name: 'Request received — not booked yet' }); expect(test.send.mock.calls.filter(([url]) => url.endsWith('credit-quote'))).toHaveLength(checked);
  const attempts = test.send.mock.calls.filter(([url]) => url.endsWith('credit-request')); expect(attempts).toHaveLength(2); expect(attempts[0][1].body).toBe(attempts[1][1].body); expect((attempts[0][1].headers as any)['Idempotency-Key']).toBe((attempts[1][1].headers as any)['Idempotency-Key']);
});
it('fails closed on credit reload without family access and never recovers old anonymous intent', () => {
  writeDraft({ players: [{ name: 'Old ordinary player', age: '12' }] }); writeAttempt('request', { nonce: id(9), payload: '{"old":"ordinary"}' });
  const read = vi.spyOn(Storage.prototype, 'getItem'); render(<MemoryRouter><BookPage credit /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Secure link unavailable' })).toBeTruthy(); expect(screen.queryByText(/Old ordinary/)).toBeNull(); expect(api.catalog).not.toHaveBeenCalled();
  expect(read.mock.calls.every(([key]) => !String(key).includes('.attempt.') && !String(key).endsWith('.v1'))).toBe(true);
});
it('keeps the credit feature default-off without issuing a quote or recovering anonymous intake', () => {
  const test = harness(); render(<MemoryRouter><FamilyContext.Provider value={{ ...test.service, creditEnabled: false }}><BookPage credit /></FamilyContext.Provider></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Secure link unavailable' })).toBeTruthy(); expect(test.send).not.toHaveBeenCalled(); expect(api.catalog).not.toHaveBeenCalled();
});
it('removes the request-ready review and offers Academy help when final credit leaves an unsupported25c card amount', async () => {
  const f = creditFixture([13000], 1), unsupported = creditFixture([12975], 1); let checks = 0;
  const test = harness(async () => creditResponse(++checks === 1 ? f.envelope : unsupported.envelope)); test.mount(); await reachReview();
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Request using player credit' }));
  await screen.findByText('Please contact the Academy to arrange this block.'); expect(screen.queryByRole('heading', { name: 'Check your credit request' })).toBeNull(); expect(test.send.mock.calls.every(([url]) => url.endsWith('credit-quote'))).toBe(true); expect(sessionStorage.length).toBe(0);
});
it('invalidates the old ready quote and permission when a manual credit refresh is refused', async () => {
  const f = creditFixture([13000], 1); let checks = 0;
  const test = harness(async () => ++checks === 1 ? creditResponse(f.envelope) : creditResponse({ ok: false, error: { code: 'payment_limit' } }, 400)); test.mount(); await reachReview();
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Check current credit quote' }));
  await screen.findByText('Please contact the Academy to arrange this block.'); expect(screen.queryByRole('heading', { name: 'Check your credit request' })).toBeNull(); expect(screen.queryByRole('button', { name: 'Request using player credit' })).toBeNull(); expect(test.send).toHaveBeenCalledTimes(2);
});
it('resumes only request status after pagehide and a plain /book Checkout return, with no family authority or anonymous rebooking', async () => {
  const f = creditFixture([13000], 1), result = creditReceipt(f.quote).request;
  requestCheckpoint({ request_id: result.request_id, request_token: result.request_token, mode: 'credit' });
  api.status.mockResolvedValue({ ...result, state: 'expired' }); history.replaceState(null, '', '/book');
  const read = vi.spyOn(Storage.prototype, 'getItem');
  render(<MemoryRouter initialEntries={['/book']}><Routes><Route path="/book" element={<BookPage />} /><Route path="/booking" element={<h1>Open your private email link</h1>} /></Routes></MemoryRouter>);
  await screen.findByRole('heading', { name: 'This request has expired' }); expect(api.status).toHaveBeenCalledWith(result.request_token, expect.any(AbortSignal)); expect(api.catalog).not.toHaveBeenCalled();
  expect(read.mock.calls.every(([key]) => !String(key).includes('.attempt.') && !String(key).endsWith('.v1'))).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Find another time' })); await screen.findByRole('heading', { name: 'Open your private email link' }); expect(requestCheckpoint()).toBeNull(); expect(api.catalog).not.toHaveBeenCalled();
});
it('preserves the old card checkpoint shape and ordinary card status behavior', async () => {
  const f = creditFixture([0], 1), result = creditReceipt(f.quote).request;
  requestCheckpoint({ request_id: result.request_id, request_token: result.request_token }); api.status.mockResolvedValue(result);
  render(<MemoryRouter><BookPage /></MemoryRouter>); await screen.findByRole('heading', { name: 'Finish your card hold' }); expect(requestCheckpoint()).not.toHaveProperty('mode');
});
it('latches a request-status429 across the active family visit without claiming a saved draft or retrying', async () => {
  const test = harness(); requestCheckpoint({ request_id: id(7), request_token: 'unit_scoped_credit_request_123456789', mode: 'credit' });
  api.status.mockRejectedValue(new FamilyOperationError('rate_limited', 429));
  render(<MemoryRouter><FamilyContext.Provider value={test.service}><BookPage /></FamilyContext.Provider></MemoryRouter>);
  await screen.findByRole('alert'); expect(test.gate.getSnapshot().paused).toBe(true); expect((screen.getByRole('button', { name: 'Check again' }) as HTMLButtonElement).disabled).toBe(true); expect(screen.queryByText(/draft is still here/)).toBeNull(); expect(api.status).toHaveBeenCalledTimes(1);
});
it('keeps a no-family-capability credit status return paused after429', async () => {
  const test = harness(); requestCheckpoint({ request_id: id(7), request_token: 'unit_scoped_credit_request_123456789', mode: 'credit' });
  api.status.mockRejectedValue(new FamilyOperationError('rate_limited', 429));
  render(<MemoryRouter><FamilyContext.Provider value={{ ...test.service, hasCapability: false, creditEnabled: false }}><BookPage /></FamilyContext.Provider></MemoryRouter>);
  await screen.findByRole('alert'); expect(test.gate.getSnapshot().paused).toBe(true); fireEvent.click(screen.getByRole('button', { name: 'Check again' })); expect(api.status).toHaveBeenCalledTimes(1); expect(api.catalog).not.toHaveBeenCalled(); expect(test.send).not.toHaveBeenCalled();
});
it('pauses an active-family catalog429 and refuses another catalog dispatch', async () => {
  const test = harness(); api.catalog.mockRejectedValue(new FamilyOperationError('rate_limited', 429)); test.mount();
  await screen.findByRole('alert'); expect(test.gate.getSnapshot().paused).toBe(true); fireEvent.click(screen.getByRole('button', { name: 'Try the live service again' })); expect(api.catalog).toHaveBeenCalledTimes(1); expect(api.slots).not.toHaveBeenCalled();
});
it('shares a SlotPicker429 with the visit and prevents another availability or family read', async () => {
  history.replaceState(null, '', '/book/credit?centre=mickleham&duration=60&focus=batting'); const test = harness(); api.slots.mockRejectedValue(new FamilyOperationError('rate_limited', 429)); test.mount();
  await screen.findByRole('button', { name: 'Check again' }); expect(test.gate.getSnapshot().paused).toBe(true);
  expect((screen.getByRole('button', { name: 'Next week →' }) as HTMLButtonElement).disabled).toBe(true); fireEvent.click(screen.getByRole('button', { name: 'Check again' })); expect(api.slots).toHaveBeenCalledTimes(1);
  const send = vi.fn(), client = createFamilyClient(creditEnv, send, { read: () => familyMarker }, test.gate); await expect(client.read()).rejects.toMatchObject({ code: 'rate_limited' }); expect(send).not.toHaveBeenCalled();
});
it('includes the explicit Ask us enquiry in the active family visit429 pause', async () => {
  const gate = createFamilyOperationGate(); api.enquiry.mockRejectedValue(new FamilyOperationError('rate_limited', 429));
  render(<AskUs operationGate={gate} />); fireEvent.change(screen.getByLabelText('Player’s name'), { target: { value: 'Test Player' } }); fireEvent.change(screen.getByLabelText('Player’s age'), { target: { value: '19' } }); fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'player@example.test' } }); fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000000' } }); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Send my enquiry' }));
  await screen.findByRole('alert'); expect(gate.getSnapshot().paused).toBe(true); expect((screen.getByRole('button', { name: 'Send my enquiry' }) as HTMLButtonElement).disabled).toBe(true); fireEvent.click(screen.getByRole('button', { name: 'Send my enquiry' })); expect(api.enquiry).toHaveBeenCalledTimes(1);
});
it('blocks an active-family ordinary card submit when another financial choice has an unknown outcome', async () => {
  const test = harness(); await expect(test.gate.perform('cancel', { booking_id: id(6) }, () => Promise.reject(new FamilyOperationError()))).rejects.toBeTruthy();
  render(<MemoryRouter><FamilyContext.Provider value={test.service}><BookPage /></FamilyContext.Provider></MemoryRouter>);
  await screen.findByRole('heading', { name: 'How many weeks?' }); expect(screen.getByText(/Check your previous submitted choice/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Continue with 1 session' }));
  fireEvent.change(screen.getByLabelText('Player’s full name'), { target: { value: 'Test Player' } }); fireEvent.change(screen.getByLabelText('Age'), { target: { value: '19' } }); fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.test' } }); fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000000' } }); fireEvent.click(screen.getByRole('button', { name: 'Check my request' }));
  await screen.findByRole('alert'); expect(api.reserve).not.toHaveBeenCalled(); expect(test.send).not.toHaveBeenCalled();
});
it('reacts immediately to the shared429 latch without another form event', async () => {
  const test = harness(); test.mount(); await reachReview(); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' }));
  expect((screen.getByRole('button', { name: 'Request using player credit' }) as HTMLButtonElement).disabled).toBe(false);
  act(() => test.gate.pause()); await waitFor(() => expect((screen.getByRole('button', { name: 'Request using player credit' }) as HTMLButtonElement).disabled).toBe(true)); expect(test.send).toHaveBeenCalledTimes(1);
});
it('keeps a known credit request unknown across navigation and blocks management or card choices reactively', async () => {
  const test = harness(), send = vi.fn().mockImplementation(() => Promise.resolve(jsonResponse({ ok: true, family: family() })));
  const client = createFamilyClient(creditEnv, send, { read: () => familyMarker }, test.gate);
  render(<MemoryRouter><FamilyContext.Provider value={{ ...test.service, client }}><FamilyManagePage /></FamilyContext.Provider></MemoryRouter>);
  await screen.findByText('Available: $10'); expect(screen.getByRole('link', { name: 'Book with my credit' }).getAttribute('href')).toBe('/book/credit');
  await act(async () => { await expect(test.gate.perform('credit_request', { fields: test.fields, review: reviewMarker }, () => Promise.reject(new FamilyOperationError()))).rejects.toBeTruthy(); });
  expect(screen.queryByText('Available: $10')).toBeNull(); expect(screen.getByRole('link', { name: 'Check submitted booking request' }).getAttribute('href')).toBe('/book/credit');
  expect(screen.queryByRole('link', { name: 'Request another session by card' })).toBeNull(); expect((screen.getByRole('button', { name: 'Book with my credit' }) as HTMLButtonElement).disabled).toBe(true);
  await expect(client.retry()).rejects.toMatchObject({ code: 'invalid_request' }); expect(send).toHaveBeenCalledTimes(1);
});
it('uses the existing exact card nonce in the shared active-family journal and blocks another family mutation', async () => {
  const test = harness(); api.reserve.mockRejectedValueOnce(new Error('unit card response lost')).mockResolvedValueOnce(creditReceipt(creditFixture([0], 1).quote).request);
  render(<MemoryRouter><FamilyContext.Provider value={test.service}><BookPage /></FamilyContext.Provider></MemoryRouter>);
  await screen.findByRole('heading', { name: 'How many weeks?' }); fireEvent.click(screen.getByRole('button', { name: 'Continue with 1 session' }));
  fireEvent.change(screen.getByLabelText('Player’s full name'), { target: { value: 'Test Card Player' } }); fireEvent.change(screen.getByLabelText('Age'), { target: { value: '19' } }); fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'card@example.test' } }); fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000000' } }); fireEvent.click(screen.getByRole('button', { name: 'Check my request' }));
  await screen.findByRole('heading', { name: 'Check and request' }); fireEvent.click(screen.getByRole('checkbox')); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' }));
  await screen.findByText(/couldn’t reach the booking service/); expect(test.gate.getSnapshot().pending).toMatchObject({ kind: 'card_request', phase: 'unknown' });
  const send = vi.fn(), familyClient = createFamilyClient(creditEnv, send, { read: () => familyMarker }, test.gate);
  await expect(familyClient.cancel({ booking_id: id(1), expected_fee_cents: 0, accept_fee: false })).rejects.toMatchObject({ code: 'outcome_unknown' }); expect(send).not.toHaveBeenCalled();
  const checks = api.slots.mock.calls.length; fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' }));
  await waitFor(() => expect(api.reserve).toHaveBeenCalledTimes(2)); expect(api.reserve.mock.calls[0][2]).toBe(api.reserve.mock.calls[1][2]); expect(api.reserve.mock.calls[0][0]).toEqual(api.reserve.mock.calls[1][0]); expect(api.slots.mock.calls.length).toBe(checks);
});
it.each([{ credits: [5000], mode: 'card', label: 'Request and continue to card hold', text: /\$80 first-session card hold/ }, { credits: [13000], mode: 'setup', label: 'Request and save card', text: /remaining \$130/ }, { credits: [26000], mode: 'covered', label: 'Request using player credit', text: /No card is needed/ }])('renders truthful $mode review and mode-specific card consent', ({ credits, mode, label, text }) => {
  const f = creditFixture(credits); render(<CreditBookingReview quote={f.quote} fields={f.fields} coachName="Test Coach" centre={catalog().centres[0]} cancellation={catalog().cancellation} turnstileToken="unit-challenge" onConsent={vi.fn()} onToken={vi.fn()} onRequest={vi.fn()} />);
  if (mode === 'covered') { expect(screen.queryByRole('checkbox')).toBeNull(); expect((screen.getByRole('button', { name: label }) as HTMLButtonElement).disabled).toBe(false); expect(screen.getByText(text)).toBeTruthy(); }
  else { expect(screen.getByRole('checkbox').parentElement?.textContent).toMatch(text); expect((screen.getByRole('button', { name: label }) as HTMLButtonElement).disabled).toBe(true); }
  expect(screen.getByText(/inside that window the cancellation fee is \$35/)).toBeTruthy(); expect(screen.queryByText(/\$0.*hold|hold.*\$0/)).toBeNull();
});

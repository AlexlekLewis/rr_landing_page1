// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { emptyDraft, parseCatalog, parseSlots } from './booking-model';
import { catalog, id, slots, starts } from './fixtures.test-helper';
import { writeDraft } from './private-draft';
const api = vi.hoisted(() => ({ catalog: vi.fn(), slots: vi.fn(), enquiry: vi.fn(), reserve: vi.fn(), status: vi.fn() }));
vi.mock('./public-client', async () => ({ ...await vi.importActual<object>('./public-client'), createPublicClient: () => api }));
vi.mock('./Turnstile', () => ({ default: ({ onToken }: { onToken: (token: string) => void }) => <button type="button" onClick={() => onToken('unit-test-challenge')}>Complete unit security check</button> }));
import BookPage from './BookPage';
import AskUs from './AskUs';
import { Quote } from './SeriesDates';
beforeEach(() => { vi.resetAllMocks(); sessionStorage.clear(); history.replaceState(null, '', '/book?centre=mickleham&coach=test-coach&start=2026-11-11T17%3A00&duration=60&focus=batting'); api.catalog.mockResolvedValue(parseCatalog(catalog())); api.slots.mockResolvedValue(parseSlots(slots(), 'mickleham')); });
afterEach(cleanup);
it('shows the discounted group quote per player as well as the amount due for the whole group', () => {
  const price = { per_session_cents: 16200, sessions: 6, discount_applied: true, total_cents: 97200 };
  render(<Quote slot={{ price }} groupSize={3} />);
  expect(screen.getByText('6 actual sessions · whole group')).toBeTruthy();
  expect(screen.getByText('$972')).toBeTruthy();
  expect(screen.getByText('$162 per session · block discount included.')).toBeTruthy();
  expect(screen.getByText('Per player · $54 per session · $324 for the block.')).toBeTruthy();
});
it('a validated coach deep link reaches weeks only after a real slot-adapter read', async () => {
  render(<BookPage />); await screen.findByRole('heading', { name: 'How many weeks?' }); expect(api.slots).toHaveBeenCalled(); expect(screen.getByText(/1 actual session/)).toBeTruthy(); expect(api.reserve).not.toHaveBeenCalled();
});
it('offers only weeks inside the selected start’s server window', async () => {
  render(<BookPage />);
  await screen.findByRole('heading', { name: 'How many weeks?' });
  expect(screen.getByRole('option', { name: '10 weeks' })).toBeTruthy();
  expect(screen.queryByRole('option', { name: '11 weeks' })).toBeNull();
  expect(screen.queryByRole('option', { name: '20 weeks' })).toBeNull();
});
it.each([12, 21])('retains the saved %s-week selection as blocked until the player changes it', async weeks => {
  history.replaceState(null, '', '/book');
  writeDraft({ ...emptyDraft(), centre: 'mickleham', kind: 'one_on_one', focus: 'batting', duration_minutes: 60, profile_id: id(3), starts_at: starts, weeks });
  render(<BookPage />);
  fireEvent.click(await screen.findByRole('button', { name: 'Wednesday 11 November 2026, 5pm Melbourne time, 1 coach free' }));
  const select = await screen.findByLabelText('Number of weeks') as HTMLSelectElement;
  expect(select.value).toBe(String(weeks));
  expect((screen.getByRole('option', { name: `${weeks} weeks · unavailable` }) as HTMLOptionElement).disabled).toBe(true);
  expect(screen.getByRole('alert').textContent).toContain('Choose up to 10 weeks');
  expect(screen.queryByRole('button', { name: /Continue with/ })).toBeNull();
  expect(api.slots.mock.calls.every(([query]) => query.weeks === 1)).toBe(true);
  fireEvent.change(select, { target: { value: '1' } });
  expect(await screen.findByRole('button', { name: 'Continue with 1 session' })).toBeTruthy();
  expect(api.reserve).not.toHaveBeenCalled();
});
it('uses the server’s actual series conflicts for a week count that fits the window', async () => {
  api.slots.mockImplementation(async query => {
    const result = parseSlots(slots(), 'mickleham');
    if (query.weeks === 2) {
      const slot = result.by_coach[0].slots[0];
      slot.decision_quote = null;
      Object.assign(slot.series_check, { requested_weeks: 2, ready: false, blocked: [{ date: '2026-11-18', kind: 'coach', reason_plain: 'Coach unavailable that week', auto_skipped: false, alternative: null }] });
    }
    return result;
  });
  render(<BookPage />);
  fireEvent.change(await screen.findByLabelText('Number of weeks'), { target: { value: '2' } });
  expect(await screen.findByText('Coach unavailable that week')).toBeTruthy();
  expect((screen.getByRole('button', { name: 'Continue with 1 session' }) as HTMLButtonElement).disabled).toBe(true);
});
it('an invalid centre is asked again instead of silently booking a fallback', async () => {
  history.replaceState(null, '', '/book?centre=williamstown&coach=test-coach&duration=30'); render(<BookPage />); await screen.findByRole('button', { name: /Mickleham Test Mickleham/ }); expect(screen.getByRole('heading', { name: 'Where would you like to train?' })).toBeTruthy(); expect(api.slots).not.toHaveBeenCalled();
});
it('lost-response retries keep the nonce and skip a new slot check that would see their own hold', async () => {
  render(<BookPage />); await screen.findByRole('heading', { name: 'How many weeks?' }); fireEvent.click(screen.getByRole('button', { name: 'Continue with 1 session' }));
  fireEvent.change(screen.getByLabelText('Player’s full name'), { target: { value: 'Test Player' } }); fireEvent.change(screen.getByLabelText('Age'), { target: { value: '10' } }); fireEvent.change(screen.getByLabelText('Parent or person booking’s name'), { target: { value: 'Test Parent' } }); fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test-parent@example.test' } }); fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000001' } }); fireEvent.click(screen.getByRole('button', { name: 'Check my request' })); await screen.findByRole('heading', { name: 'Check and request' });
  fireEvent.click(screen.getByRole('checkbox')); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); api.reserve.mockRejectedValue(new Error('unit lost response')); fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' })); await waitFor(() => expect(api.reserve).toHaveBeenCalledTimes(1)); await screen.findByText(/couldn’t reach the booking service/); const checked = api.slots.mock.calls.length;
  api.slots.mockResolvedValue({ ...parseSlots(slots(), 'mickleham'), by_coach: [] }); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' })); await waitFor(() => expect(api.reserve).toHaveBeenCalledTimes(2)); expect(api.reserve.mock.calls[1][2]).toBe(api.reserve.mock.calls[0][2]); expect(api.reserve.mock.calls[1][0]).toEqual(api.reserve.mock.calls[0][0]); expect(api.slots.mock.calls.length).toBe(checked);
});
it('AskUs preserves details on failure, supports age zero, and reads the actual deadline on receipt', async () => {
  render(<AskUs centre="mickleham" sourcePage="/mickleham" />); fireEvent.change(screen.getByLabelText('Player’s name'), { target: { value: 'Test Junior' } }); fireEvent.change(screen.getByLabelText('Player’s age'), { target: { value: '0' } }); fireEvent.change(screen.getByLabelText(/Parent or guardian/), { target: { value: 'Test Parent' } }); fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test-parent@example.test' } }); fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000001' } }); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); api.enquiry.mockRejectedValueOnce(new Error('unit offline')); fireEvent.click(screen.getByRole('button', { name: 'Send my enquiry' })); await screen.findByRole('alert'); expect((screen.getByLabelText('Player’s name') as HTMLInputElement).value).toBe('Test Junior');
  api.enquiry.mockResolvedValueOnce({ enquiry_id: id(10), call_by: '2026-11-10T09:00:00+11:00', call_by_plain: 'by 9am on Tuesday' }); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Send my enquiry' })); await screen.findByText(/9am on Tuesday/); expect(screen.queryByText(/by by/)).toBeNull(); expect(api.enquiry.mock.calls[0][0].player_age).toBe(0); expect(api.enquiry.mock.calls[0][0].parent_name).toBe('Test Parent'); expect(api.enquiry.mock.calls[1][2]).toBe(api.enquiry.mock.calls[0][2]);
});


it('keeps a stale deep-link notice after jumping to the server window and loading same-centre alternatives', async () => {
  history.replaceState(null, '', '/book?centre=mickleham&coach=test-coach&start=2026-11-01T16%3A00&duration=60&focus=batting');
  api.slots.mockImplementation(async query => ({ ...parseSlots(slots(), 'mickleham'), by_coach: query.to < '2026-11-11' ? [] : parseSlots(slots(), 'mickleham').by_coach }));
  render(<BookPage />);
  await screen.findByRole('button', { name: 'Wednesday 11 November 2026, 5pm Melbourne time, 1 coach free' });
  expect(screen.getByRole('alert').textContent).toContain('That preview time is no longer available');
  expect(api.slots.mock.calls.some(([query]) => query.from === '2026-11-11')).toBe(true);
  expect(api.slots.mock.calls.every(([query]) => query.centre === 'mickleham')).toBe(true);
  expect(api.reserve).not.toHaveBeenCalled();
});


it('coach-first cards show the authoritative existing single-session quote', async () => {
  history.replaceState(null, '', '/book?centre=mickleham&duration=60&focus=batting'); render(<BookPage />);
  fireEvent.click(await screen.findByRole('tab', { name: 'Pick a coach' }));
  await screen.findByRole('button', { name: /Test Coach.*\$130 incl. GST.*one session/ });
  expect(api.reserve).not.toHaveBeenCalled();
});

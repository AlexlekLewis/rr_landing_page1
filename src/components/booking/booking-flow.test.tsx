// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { parseCatalog, parseSlots } from './booking-model';
import { catalog, id, slots } from './fixtures.test-helper';
const api = vi.hoisted(() => ({ catalog: vi.fn(), slots: vi.fn(), enquiry: vi.fn(), reserve: vi.fn(), status: vi.fn() }));
vi.mock('./public-client', async () => ({ ...await vi.importActual<object>('./public-client'), createPublicClient: () => api }));
vi.mock('./Turnstile', () => ({ default: ({ onToken }: { onToken: (token: string) => void }) => <button type="button" onClick={() => onToken('unit-test-challenge')}>Complete unit security check</button> }));
import BookPage from './BookPage';
import AskUs from './AskUs';
beforeEach(() => { vi.resetAllMocks(); sessionStorage.clear(); history.replaceState(null, '', '/book?centre=mickleham&coach=test-coach&start=2026-11-11T17%3A00&duration=60&focus=batting'); api.catalog.mockResolvedValue(parseCatalog(catalog())); api.slots.mockResolvedValue(parseSlots(slots(), 'mickleham')); });
afterEach(cleanup);
it('a validated coach deep link reaches weeks only after a real slot-adapter read', async () => {
  render(<BookPage />); await screen.findByRole('heading', { name: 'How many weeks?' }); expect(api.slots).toHaveBeenCalled(); expect(screen.getByText(/1 actual session/)).toBeTruthy(); expect(api.reserve).not.toHaveBeenCalled();
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

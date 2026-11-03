// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { id } from './fixtures.test-helper';
const api = vi.hoisted(() => ({ enquiry: vi.fn() }));
vi.mock('./public-client', async () => ({ ...await vi.importActual<object>('./public-client'), createPublicClient: () => api }));
vi.mock('./Turnstile', () => ({ default: ({ onToken }: { onToken: (value: string) => void }) => <button type="button" onClick={() => onToken('unit-challenge')}>Complete unit security check</button> }));
import AskUs from './AskUs';
import AskUsDialog from './AskUsDialog';
import LaunchForm from '../mickleham-launch/LaunchForm';
function Harness() { const [open, setOpen] = useState(false); const close = () => setOpen(false); return <><button onClick={() => setOpen(true)}>Open enquiry</button>{open ? <AskUsDialog onClose={close}><AskUs sourcePage="/book" onClose={close} /></AskUsDialog> : null}</>; }
const accepted = { enquiry_id: id(11), call_by: '2026-11-10T09:00:00+11:00', call_by_plain: 'by 9am Tuesday' };
const fill = () => { fireEvent.change(screen.getByLabelText('Player’s name'), { target: { value: 'Test Player' } }); fireEvent.change(screen.getByLabelText('Player’s age'), { target: { value: '14' } }); fireEvent.change(screen.getByLabelText(/Parent or guardian/), { target: { value: 'Test Parent' } }); fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.test' } }); fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000001' } }); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); };
beforeEach(() => { vi.resetAllMocks(); sessionStorage.clear(); history.replaceState(null, '', '/book'); api.enquiry.mockResolvedValue(accepted); });
afterEach(cleanup);
it('moves focus into the dialog, traps both tab directions, closes on Escape and returns focus', () => {
  render(<Harness />); const opener = screen.getByRole('button', { name: 'Open enquiry' }); opener.focus(); fireEvent.click(opener);
  const dialog = screen.getByRole('dialog'); expect(document.activeElement).toBe(within(dialog).getByRole('heading', { name: 'Ask us' })); expect(opener.closest('[inert]')).not.toBeNull();
  const first = within(dialog).getByRole('button', { name: 'Back to my request' }), last = within(dialog).getByRole('link', { name: 'Privacy policy' });
  last.focus(); fireEvent.keyDown(document, { key: 'Tab' }); expect(document.activeElement).toBe(first); first.focus(); fireEvent.keyDown(document, { key: 'Tab', shiftKey: true }); expect(document.activeElement).toBe(last);
  fireEvent.keyDown(document, { key: 'Escape' }); expect(screen.queryByRole('dialog')).toBeNull(); expect(document.activeElement).toBe(opener); expect(opener.closest('[inert]')).toBeNull();
});
it('closing an unknown in-flight submission retains values and exact nonce without claiming failure', async () => {
  api.enquiry.mockImplementationOnce((_intent, _token, _nonce, signal) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))));
  render(<Harness />); fireEvent.click(screen.getByRole('button', { name: 'Open enquiry' })); fill(); fireEvent.click(screen.getByRole('button', { name: 'Send my enquiry' })); await waitFor(() => expect(api.enquiry).toHaveBeenCalledTimes(1)); const nonce = api.enquiry.mock.calls[0][2];
  fireEvent.keyDown(document, { key: 'Escape' }); expect(screen.queryByRole('alert')).toBeNull(); fireEvent.click(screen.getByRole('button', { name: 'Open enquiry' })); expect((screen.getByLabelText('Player’s name') as HTMLInputElement).value).toBe('Test Player'); expect(screen.queryByRole('alert')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: 'Send my enquiry' })); await screen.findByText(/by 9am Tuesday/); expect(api.enquiry.mock.calls[1][2]).toBe(nonce); expect(api.enquiry.mock.calls[1][0]).toEqual(api.enquiry.mock.calls[0][0]);
});
it.each(['/mickleham-launch', '/Mickleham_Launch', '/launch'])('campaign enquiry uses the direct adapter with actual route attribution %s', async path => {
  history.replaceState(null, '', path); render(<LaunchForm />);
  fireEvent.change(screen.getByLabelText(/Player’s Name/), { target: { value: 'Test Junior' } }); fireEvent.change(screen.getByLabelText(/^Age/), { target: { value: '0' } }); fireEvent.change(screen.getByLabelText(/Parent \/ Guardian Name/), { target: { value: 'Test Parent' } }); fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'test@example.test' } }); fireEvent.change(screen.getByLabelText(/^Phone/), { target: { value: '0400000001' } }); fireEvent.change(screen.getByLabelText(/Which night/), { target: { value: 'tuesday' } }); fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(screen.getByRole('button', { name: /Claim My/ }));
  await screen.findByText(/by 9am Tuesday/); expect(api.enquiry).toHaveBeenCalledTimes(1); expect(api.enquiry.mock.calls[0][0]).toMatchObject({ centre: 'mickleham', source_page: path, player_age: 0, parent_name: 'Test Parent' }); expect(api.enquiry.mock.calls[0][0].note).toContain('Preferred night: Tuesday'); expect(screen.queryByText(/by by/)).toBeNull();
});

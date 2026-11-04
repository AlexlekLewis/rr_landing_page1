// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { emptyDraft, parseCatalog, parseSlots } from './booking-model';
import { catalog, id, slots } from './fixtures.test-helper';
const api = vi.hoisted(() => ({ catalog: vi.fn(), slots: vi.fn(), enquiry: vi.fn(), reserve: vi.fn(), status: vi.fn() }));
vi.mock('./public-client', async () => ({ ...await vi.importActual<object>('./public-client'), createPublicClient: () => api }));
vi.mock('./Turnstile', () => ({ default: ({ onToken }: { onToken: (token: string) => void }) => <button type="button" onClick={() => onToken('unit-test-challenge')}>Complete unit security check</button> }));
import BookPage from './BookPage';
import BookingReview from './BookingReview';
import SlotPicker from './SlotPicker';

const decision = { kind: 'policy_quote', quoted_at: '2026-11-09T09:00:00+11:00', confirm_by: '2026-11-10T09:00:00+11:00' };
function quotedSlots() {
  const raw = slots();
  Object.assign(raw.by_coach[0].slots[0], { decision_quote: { ...decision } });
  return raw;
}
beforeEach(() => {
  vi.resetAllMocks(); sessionStorage.clear();
  history.replaceState(null, '', '/book?centre=mickleham&coach=test-coach&start=2026-11-11T17%3A00&duration=60&focus=batting');
  api.catalog.mockResolvedValue(parseCatalog(catalog()));
  api.slots.mockResolvedValue(parseSlots(quotedSlots(), 'mickleham'));
});
afterEach(cleanup);
const draft = () => ({ ...emptyDraft(), centre: 'mickleham', kind: 'one_on_one', focus: 'batting', duration_minutes: 60 });
async function requestReview() {
  render(<BookPage />);
  await screen.findByRole('heading', { name: 'How many weeks?' });
  fireEvent.click(screen.getByRole('button', { name: /Continue with \d+ sessions?/ }));
  fireEvent.change(screen.getByLabelText('Player’s full name'), { target: { value: 'Test Player' } });
  fireEvent.change(screen.getByLabelText('Age'), { target: { value: '19' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test-player@example.test' } });
  fireEvent.change(screen.getByLabelText('Mobile'), { target: { value: '0400000001' } });
  fireEvent.click(screen.getByRole('button', { name: 'Check my request' }));
}
async function reachReview() { await requestReview(); return screen.findByRole('heading', { name: 'Check and request' }); }

it('time buttons announce the complete Melbourne date and distinct live coach count', async () => {
  const raw = quotedSlots(), other = { ...raw.by_coach[0], profile_id: id(4), display_name: 'Test Other Coach' };
  raw.by_coach.push(other, { ...other });
  api.slots.mockResolvedValue(parseSlots(raw, 'mickleham'));
  render(<SlotPicker draft={draft()} catalog={parseCatalog(catalog())} hint="" onSelect={vi.fn()} onDropHint={vi.fn()} pending={false} />);
  expect(await screen.findByRole('button', { name: 'Wednesday 11 November 2026, 5pm Melbourne time, 2 coaches free' })).toBeTruthy();
});

it('coach-first time buttons retain full date and the selected-coach count', async () => {
  render(<SlotPicker draft={{ ...draft(), profile_id: id(3) }} catalog={parseCatalog(catalog())} hint="" onSelect={vi.fn()} onDropHint={vi.fn()} pending={false} />);
  expect(await screen.findByRole('button', { name: 'Wednesday 11 November 2026, 5pm Melbourne time, 1 coach free' })).toBeTruthy();
});

it('renders the approved website portrait by the eligible catalogue slug', async () => {
  const raw = catalog(); raw.coaches[0].slug = 'ikroop-dhanoa'; raw.coaches[0].display_name = 'Ikroop Dhanoa';
  api.slots.mockResolvedValue(parseSlots(quotedSlots(), 'mickleham'));
  render(<SlotPicker draft={draft()} catalog={parseCatalog(raw)} hint="" onSelect={vi.fn()} onDropHint={vi.fn()} pending={false} />);
  fireEvent.click(await screen.findByRole('button', { name: /5(?::00)?\s*pm/ }));
  const card = screen.getByRole('button', { name: /Test Coach.*Choose/ });
  const portrait = card.querySelector('img');
  expect(portrait?.getAttribute('src')).toBe('/assets/coaches/ikroop-dhanoa.jpg');
  fireEvent.error(portrait!);
  expect(card.querySelector('img')).toBeNull();
  expect(card.textContent).toContain('TC');
});

it('keeps synthetic slugs as initials even if a backend photo URL claims a real portrait', async () => {
  const raw = catalog(); raw.coaches[0].photo_url = 'https://example.test/assets/coaches/ikroop-dhanoa.jpg' as never;
  render(<SlotPicker draft={draft()} catalog={parseCatalog(raw)} hint="" onSelect={vi.fn()} onDropHint={vi.fn()} pending={false} />);
  fireEvent.click(await screen.findByRole('button', { name: /5(?::00)?\s*pm/ }));
  const card = screen.getByRole('button', { name: /Test Coach.*Choose/ });
  expect(card.querySelector('img')).toBeNull(); expect(card.textContent).toContain('TC');
});

it('single-session review and permission do not invent a remaining block or zero charge', async () => {
  await reachReview();
  expect(screen.getByText(/we charge this session \(\$130\)/)).toBeTruthy();
  expect(screen.getByRole('checkbox').parentElement?.textContent).toContain('charge this session when the venue confirms');
  expect(screen.queryByText(/rest of the block|remaining block|\(\$0\)/)).toBeNull();
});

it('retains the server-quoted remainder and permission for a genuine multi-session block', () => {
  const raw = quotedSlots(), slot = raw.by_coach[0].slots[0];
  slot.price = { ...slot.price, sessions: 2, rest_cents: 13000, total_cents: 26000 };
  slot.series_check = { ...slot.series_check, requested_weeks: 2, actual_sessions: 2, dates: [...slot.series_check.dates, { date: '2026-11-18', starts_at: '2026-11-18T17:00:00+11:00', ends_at: '2026-11-18T18:00:00+11:00' }] };
  const parsed = parseSlots(raw, 'mickleham').by_coach[0].slots[0], config = parseCatalog(catalog());
  render(<BookingReview slot={parsed} draft={{ ...draft(), players: [{ name: 'Test Player', age: 19 }], consent_save_card: false }} catalog={config} coach={config.coaches[0]} centre={config.centres[0]} pending={false} token="" widgetReset={0} onConsent={vi.fn()} onToken={vi.fn()} onReserve={vi.fn()} />);
  expect(screen.getByText(/rest of the block \(\$130\)/)).toBeTruthy();
  expect(screen.getByRole('checkbox').parentElement?.textContent).toContain('first session and remaining block');
});

it('renders only the trusted indicative deadline and identifies its final-deadline limitation', async () => {
  await reachReview();
  const deadline = screen.getByText('Tue 10 Nov, 9am Melbourne time.');
  expect(deadline.parentElement?.textContent).toBe('The Academy aims to confirm by Tue 10 Nov, 9am Melbourne time.');
  expect(screen.getByText(/Your request will show the final deadline after the card hold/)).toBeTruthy();
});

it('does not enter review or fabricate a deadline when the server quote has none', async () => {
  const raw = quotedSlots(); Object.assign(raw.by_coach[0].slots[0], { decision_quote: null });
  api.slots.mockResolvedValue(parseSlots(raw, 'mickleham'));
  await requestReview();
  await screen.findByText('The confirmation deadline is unavailable. Check the dates again before requesting.');
  expect(screen.queryByRole('heading', { name: 'Check and request' })).toBeNull();
  expect(api.reserve).not.toHaveBeenCalled();
});

it.each([
  { change: 'moves earlier', next: { ...decision, confirm_by: '2026-11-10T08:00:00+11:00' } },
  { change: 'is no longer available', next: null },
])('requires another review and permission if the server deadline $change at the final check', async ({ next }) => {
  await reachReview();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' }));
  const raw = quotedSlots();
  Object.assign(raw.by_coach[0].slots[0], { decision_quote: next });
  api.slots.mockResolvedValue(parseSlots(raw, 'mickleham'));
  fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' }));
  await screen.findByText(/deadline changed/);
  expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
  expect(api.reserve).not.toHaveBeenCalled();
});

it('allows an ordinary later policy quote without endless permission resets or forwarding quote metadata', async () => {
  await reachReview();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' }));
  const raw = quotedSlots();
  Object.assign(raw.by_coach[0].slots[0], { decision_quote: { ...decision, quoted_at: '2026-11-09T09:01:00+11:00', confirm_by: '2026-11-10T09:01:00+11:00' } });
  api.slots.mockResolvedValue(parseSlots(raw, 'mickleham'));
  api.reserve.mockRejectedValue(new Error('unit lost response'));
  fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' }));
  await screen.findByText(/couldn’t reach the booking service/);
  expect(api.reserve).toHaveBeenCalledTimes(1);
  expect(api.reserve.mock.calls[0][0]).not.toHaveProperty('decision_quote');
  expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
});

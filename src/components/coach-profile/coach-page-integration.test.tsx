// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { catalog, id, slots } from '../booking/fixtures.test-helper';
import { parseCatalog, parseSlots } from '../booking/booking-model';
const api = vi.hoisted(() => ({ catalog: vi.fn(), slots: vi.fn(), enquiry: vi.fn(), reserve: vi.fn(), status: vi.fn() }));
vi.mock('../booking/public-client', async original => ({ ...await original<object>(), createPublicClient: () => api }));
vi.mock('../Navbar', () => ({ default: () => null }));
vi.mock('../Footer', () => ({ default: () => null }));
vi.mock('../../hooks/usePageAnalytics', () => ({ default: () => ({ trackEvent: () => {} }) }));
vi.mock('../booking/Turnstile', () => ({ default: ({ onToken }: { onToken: (token: string) => void }) => <button type="button" onClick={() => onToken('synthetic-unit-challenge')}>Complete unit security check</button> }));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const component = (tag: string) => React.forwardRef<HTMLElement, Record<string, unknown>>(({ children, initial: _i, animate: _a, whileInView: _w, viewport: _v, transition: _t, ...props }, ref) => React.createElement(tag, { ...props, ref }, children as React.ReactNode));
  return { motion: { div: component('div'), article: component('article') } };
});
import CoachProfilePage from './CoachProfilePage';
import CoachProfileRoute from './CoachProfileRoute';
import BookPage from '../booking/BookPage';
import CoachesPrivate from '../coaches/CoachesPrivate';

function currentCatalog(slug = 'ikroop-dhanoa', profile = id(3), centre = 'mickleham') {
  const raw = catalog(); Object.assign(raw.coaches[0]!, { slug, profile_id: profile, home_centre: centre, centres: [centre] }); return parseCatalog(raw);
}
function draw(gate?: boolean) {
  render(<BrowserRouter><Link to="/coaches/alex-thornhill">Switch to Alex</Link><Routes>
    <Route path="/coaches/:slug" element={gate === undefined ? <CoachProfilePage /> : <CoachProfileRoute enabled={gate} />} />
    <Route path="/coaches" element={<h1>All Academy coaches</h1>} />
    <Route path="/book" element={<BookPage />} />
  </Routes></BrowserRouter>);
}
beforeEach(() => {
  vi.resetAllMocks(); vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-11-10T00:00:00Z'));
  vi.stubEnv('VITE_APP_ENV', 'local'); vi.stubEnv('VITE_PRIVATE_BOOKING_URL', 'http://127.0.0.1:54321/functions/v1'); vi.stubEnv('VITE_PRIVATE_BOOKING_MOCK', 'false');
  sessionStorage.clear(); history.replaceState(null, '', '/coaches/ikroop-dhanoa'); window.scrollTo = vi.fn();
  api.catalog.mockResolvedValue(currentCatalog()); api.slots.mockResolvedValue(parseSlots(slots(), 'mickleham'));
  api.enquiry.mockResolvedValue({ enquiry_id: id(20), call_by: '2026-11-11T09:00:00+11:00', call_by_plain: 'by 9am on Wednesday' });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllEnvs(); });

it('disabled and unknown coach routes redirect without availability reads', async () => {
  draw(false); await screen.findByRole('heading', { name: 'All Academy coaches' }); expect(api.catalog).not.toHaveBeenCalled();
  cleanup(); history.replaceState(null, '', '/coaches/unknown-coach'); draw();
  await screen.findByRole('heading', { name: 'All Academy coaches' }); expect(api.catalog).not.toHaveBeenCalled(); expect(api.slots).not.toHaveBeenCalled();
});

it('an unbookable published coach retains canonical Ask-us context without inventing a profile or time', async () => {
  api.catalog.mockResolvedValue({ ...currentCatalog(), coaches: [] }); draw();
  await screen.findByText(/isn’t taking new private bookings right now/);
  expect(api.slots).not.toHaveBeenCalled(); expect(screen.queryByRole('button', { name: 'Continue: weeks and player details' })).toBeNull();
  const ask = screen.getByRole('region', { name: 'Ask us about private coaching' });
  fireEvent.change(within(ask).getByLabelText('Player’s name'), { target: { value: 'Test Player' } });
  fireEvent.change(within(ask).getByLabelText('Player’s age'), { target: { value: '10' } });
  fireEvent.change(within(ask).getByLabelText(/Parent or guardian/), { target: { value: 'Test Parent' } });
  fireEvent.change(within(ask).getByLabelText('Email'), { target: { value: 'test-parent@example.test' } });
  fireEvent.change(within(ask).getByLabelText('Mobile'), { target: { value: '0400000001' } });
  fireEvent.click(within(ask).getByRole('button', { name: 'Complete unit security check' })); fireEvent.click(within(ask).getByRole('button', { name: 'Send my enquiry' }));
  await within(ask).findByText(/your enquiry is with the Academy/);
  expect(api.enquiry).toHaveBeenCalledTimes(1); expect(api.enquiry.mock.calls[0]![0]).toMatchObject({ source_page: '/coaches/ikroop-dhanoa', centre: 'mickleham' });
  expect(api.enquiry.mock.calls[0]![0]).not.toHaveProperty('coach_profile_id'); expect(api.reserve).not.toHaveBeenCalled();
});

it('catalogue failure is not reported as ineligibility or an empty available week', async () => {
  api.catalog.mockRejectedValue(new Error('synthetic unavailable')); draw();
  await screen.findByText(/couldn’t verify the live coaching catalogue/);
  expect(screen.queryByText(/isn’t taking new private bookings/)).toBeNull(); expect(screen.queryByText(/No free times in the next week/)).toBeNull();
  expect(api.slots).not.toHaveBeenCalled(); expect(screen.getByRole('region', { name: 'Ask us about private coaching' })).toBeTruthy();
});

it('the coaches landing strip links only approved launch slugs actually present in the live catalogue', async () => {
  const current = currentCatalog(); current.coaches.push({ ...current.coaches[0]!, profile_id: id(9), slug: 'alex-lewis', display_name: 'Synthetic unlisted control' });
  api.catalog.mockResolvedValue(current); render(<BrowserRouter><CoachesPrivate /></BrowserRouter>);
  await screen.findByRole('link', { name: /Ikroop Dhanoa/ });
  expect(screen.queryByRole('link', { name: /Alex Thornhill|Ritin Raman|Mihiraj Jayasekara|Synthetic unlisted/ })).toBeNull();
  expect(api.slots).not.toHaveBeenCalled(); expect(api.reserve).not.toHaveBeenCalled();
});

it('a failed landing catalogue keeps an enquiry route without falsely declaring coaches unavailable', async () => {
  api.catalog.mockRejectedValue(new Error('synthetic unavailable')); render(<BrowserRouter><CoachesPrivate /></BrowserRouter>);
  const status = await screen.findByRole('status'); expect(status.textContent).toContain('could not be verified');
  expect(within(status).getByRole('link', { name: 'Check the booking service or ask us.' }).getAttribute('href')).toBe('/book');
  expect(screen.queryByText(/No published coach.*currently bookable/)).toBeNull();
});

it('the actual coach selection reaches the current wizard weeks step after a fresh matching-slot check', async () => {
  draw(true); fireEvent.click(await screen.findAllByRole('button', { name: 'Add to my booking' }).then(buttons => buttons[0]!));
  fireEvent.click(await screen.findByRole('button', { name: '5:00pm' })); fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  await screen.findByRole('heading', { name: 'How many weeks?' });
  const query = new URLSearchParams(location.search); expect(location.pathname).toBe('/book');
  expect(Object.fromEntries(query)).toMatchObject({ centre: 'mickleham', coach: 'ikroop-dhanoa', start: '2026-11-11T17:00', duration: '60', focus: 'spin', goals: 'leg-spin' });
  expect(api.catalog).toHaveBeenCalledTimes(2); expect(api.slots.mock.calls.length).toBeGreaterThanOrEqual(2);
  expect(api.slots.mock.calls.every(([q]) => q.centre === 'mickleham')).toBe(true); expect(api.reserve).not.toHaveBeenCalled();
});

function enterContact(form: Pick<typeof screen, 'getByLabelText'> = screen) {
  fireEvent.change(form.getByLabelText(/Parent or (person booking|guardian)/), { target: { value: 'Test Parent' } });
  fireEvent.change(form.getByLabelText('Email'), { target: { value: 'test-parent@example.test' } });
  fireEvent.change(form.getByLabelText('Mobile'), { target: { value: '0400000001' } });
}

async function sendEnquiryFromWizard() {
  fireEvent.click(screen.getByRole('link', { name: 'Ask us instead' }));
  const ask = within(screen.getByRole('region', { name: 'Ask us about private coaching' }));
  fireEvent.change(ask.getByLabelText('Player’s name'), { target: { value: 'Test Player' } });
  fireEvent.change(ask.getByLabelText('Player’s age'), { target: { value: '10' } });
  enterContact(ask);
  fireEvent.click(ask.getByRole('button', { name: 'Complete unit security check' }));
  fireEvent.click(ask.getByRole('button', { name: 'Send my enquiry' }));
  await ask.findByText(/your enquiry is with the Academy/);
  fireEvent.click(ask.getByRole('button', { name: 'Back to my request' }));
}

it.each([2, 3, 4])('coach-page group of %i reaches card review with every participant', async size => {
  const total = size * ({ 2: 7000, 3: 6000, 4: 5000 } as Record<number, number>)[size];
  api.slots.mockImplementation(async query => {
    const raw = slots();
    if (query.kind === 'group') Object.assign(raw.by_coach[0]!.slots[0]!.price, { per_session_cents: total, first_session_hold_cents: total, total_cents: total });
    return parseSlots(raw, 'mickleham');
  });
  draw(true);
  fireEvent.click((await screen.findAllByRole('button', { name: 'Add to my booking' }))[0]!);
  fireEvent.click(await screen.findByRole('radio', { name: `Group of ${size}` }));
  fireEvent.click(await screen.findByRole('button', { name: '5:00pm' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Continue with 1 session' }));
  const names = screen.getAllByLabelText('Player’s full name'), ages = screen.getAllByLabelText('Age');
  expect(names).toHaveLength(size);
  expect(ages).toHaveLength(size);
  const players = names.map((name, i) => {
    const player = { name: `Test Player ${i + 1}`, age: 10 + i };
    fireEvent.change(name, { target: { value: player.name } });
    fireEvent.change(ages[i]!, { target: { value: String(player.age) } });
    return player;
  });
  enterContact();
  fireEvent.click(screen.getByRole('button', { name: 'Check my request' }));
  await screen.findByRole('heading', { name: 'Check and request' });
  expect(screen.getByText(players.map(player => `${player.name} (${player.age})`).join(', '))).toBeTruthy();
  expect(screen.getByText(new RegExp(`hold of \\$${total / 100}`))).toBeTruthy();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' }));
  api.reserve.mockRejectedValue(new Error('synthetic request receipt unavailable'));
  fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' }));
  await waitFor(() => expect(api.reserve).toHaveBeenCalledTimes(1));
  expect(api.reserve.mock.calls[0]![0]).toMatchObject({ kind: 'group', group_size: size, players, profile_id: id(3), goals: ['leg-spin'], source_page: '/coaches/ikroop-dhanoa' });
});

it('choosing a different coach in the wizard clears the old goals and enquiry source', async () => {
  const current = currentCatalog();
  current.coaches.push({ ...current.coaches[0]!, profile_id: id(4), slug: 'alex-thornhill', display_name: 'Alex Thornhill' });
  api.catalog.mockResolvedValue(current);
  const raw = slots();
  raw.by_coach.push({ ...raw.by_coach[0]!, profile_id: id(4), display_name: 'Alex Thornhill' });
  api.slots.mockResolvedValue(parseSlots(raw, 'mickleham'));
  draw(true);
  fireEvent.click((await screen.findAllByRole('button', { name: 'Add to my booking' }))[0]!);
  fireEvent.click(await screen.findByRole('button', { name: '5:00pm' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Continue with 1 session' }));
  expect(screen.getByRole('button', { name: /Remove Leg spin goal/i })).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Player’s full name'), { target: { value: 'Test Player' } });
  fireEvent.change(screen.getByLabelText('Age'), { target: { value: '10' } });
  enterContact();
  fireEvent.click(screen.getByRole('button', { name: '← Back' }));
  fireEvent.click(screen.getByRole('button', { name: '← Back' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Choose a different coach' }));
  fireEvent.click(screen.getByRole('button', { name: /Alex Thornhill.*Next free/ }));
  fireEvent.click(screen.getByRole('button', { name: /5pm Melbourne time, 1 coach free/ }));
  fireEvent.click(await screen.findByRole('button', { name: 'Continue with 1 session' }));
  expect(screen.queryByRole('button', { name: /Remove Leg spin goal/i })).toBeNull();
  expect((screen.getByLabelText('Player’s full name') as HTMLInputElement).value).toBe('Test Player');

  await sendEnquiryFromWizard();
  expect(api.enquiry.mock.calls[0]![0]).toMatchObject({ coach_profile_id: id(4), source_page: '/book' });

  fireEvent.click(screen.getByRole('button', { name: 'Check my request' }));
  await screen.findByRole('heading', { name: 'Check and request' });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Complete unit security check' }));
  api.reserve.mockRejectedValue(new Error('synthetic request receipt unavailable'));
  fireEvent.click(screen.getByRole('button', { name: 'Request and continue to card hold' }));
  await waitFor(() => expect(api.reserve).toHaveBeenCalledTimes(1));
  expect(api.reserve.mock.calls[0]![0]).toMatchObject({ profile_id: id(4), goals: [], source_page: '/book' });
});

it('changing the centre does not attribute the new enquiry to the original coach page', async () => {
  draw(true);
  fireEvent.click((await screen.findAllByRole('button', { name: 'Add to my booking' }))[0]!);
  fireEvent.click(await screen.findByRole('button', { name: '5:00pm' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  await screen.findByRole('button', { name: 'Continue with 1 session' });
  for (const title of ['Find your time', 'How long would you like?', 'What do you want to work on?', 'Who’s the session for?', 'Where would you like to train?']) {
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    await screen.findByRole('heading', { name: title });
  }
  fireEvent.click(screen.getByRole('button', { name: /Cranbourne North Test Cranbourne/ }));
  await sendEnquiryFromWizard();
  expect(api.enquiry.mock.calls[0]![0]).toMatchObject({ centre: 'cranbourne-north', source_page: '/book' });
  expect(api.enquiry.mock.calls[0]![0]).not.toHaveProperty('coach_profile_id');
});

it('a taken coach-page preview is refused by the wizard and offers only the same-centre alternatives', async () => {
  const available = parseSlots(slots(), 'mickleham');
  api.slots.mockResolvedValueOnce(available).mockResolvedValueOnce({ ...available, by_coach: [] }).mockResolvedValue(available);
  draw(); fireEvent.click(await screen.findByRole('button', { name: '5:00pm' })); fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  await screen.findByRole('heading', { name: 'Find your time' });
  await screen.findByText(/That preview time is no longer available/);
  await screen.findByRole('button', { name: 'Wednesday 11 November 2026, 5pm Melbourne time, 1 coach free' });
  expect(api.slots.mock.calls.every(([q]) => q.centre === 'mickleham')).toBe(true); expect(api.reserve).not.toHaveBeenCalled();
});

it('an unavailable slot service is not presented as an empty free week or an actionable preview', async () => {
  api.slots.mockRejectedValue(new Error('synthetic read failure')); draw();
  await screen.findByText(/No availability has been assumed/);
  expect(screen.queryByText(/No free times in the next week/)).toBeNull(); expect(screen.queryByRole('button', { name: 'Continue: weeks and player details' })).toBeNull();
  expect(api.reserve).not.toHaveBeenCalled();
});

it('a late old-coach catalogue cannot fill the new coach page or transfer previous goals', async () => {
  let finishOld!: (value: unknown) => void;
  api.catalog.mockImplementationOnce(() => new Promise(resolve => { finishOld = resolve; })).mockResolvedValueOnce(currentCatalog('alex-thornhill', id(4), 'cranbourne-north'));
  const raw = slots(); raw.centre = 'cranbourne-north'; raw.by_coach[0]!.profile_id = id(4); raw.by_coach[0]!.home_centre = 'cranbourne-north';
  api.slots.mockResolvedValue(parseSlots(raw, 'cranbourne-north'));
  draw(); fireEvent.click(screen.getAllByRole('button', { name: 'Add to my booking' })[0]!); fireEvent.click(screen.getByRole('link', { name: 'Switch to Alex' }));
  await screen.findByRole('heading', { name: 'Alex Thornhill', level: 1 }); await screen.findByRole('button', { name: '5:00pm' });
  finishOld(currentCatalog()); await waitFor(() => expect(screen.queryByRole('heading', { name: 'Ikroop Dhanoa', level: 1 })).toBeNull());
  expect(screen.queryByText(/Added to your booking: Batting/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '5:00pm' })); fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  expect(new URLSearchParams(location.search).get('coach')).toBe('alex-thornhill'); expect(new URLSearchParams(location.search).has('goals')).toBe(false);
});

it('canonical429 pauses the page and enquiry controls without further slot checks', async () => {
  api.slots.mockRejectedValue({ code: 'rate_limited', status: 429 }); draw();
  await screen.findByRole('alert'); expect(screen.getByRole('alert').textContent).toContain('visit is paused');
  expect(screen.queryByRole('button', { name: 'One player' })).toBeNull(); expect(api.slots).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: /Ask us and we’ll call/ }));
  expect(screen.getByRole('button', { name: 'Send my enquiry' }).hasAttribute('disabled')).toBe(true); expect(api.enquiry).not.toHaveBeenCalled();
});
it('a changed slot query hides the old result and selection until a fresh explicit pick', async () => {
  const available = parseSlots(slots(), 'mickleham');
  let finish!: (value: unknown) => void;
  api.slots.mockResolvedValueOnce(available).mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  draw(); fireEvent.click(await screen.findByRole('button', { name: '5:00pm' }));
  expect(screen.getByRole('button', { name: 'Continue: weeks and player details' })).toBeTruthy();
  const length = screen.getByRole('radiogroup', { name: 'How long' }); fireEvent.click(within(length).getAllByRole('radio')[1]!);
  expect(screen.queryByRole('button', { name: 'Continue: weeks and player details' })).toBeNull();
  expect(screen.queryByRole('button', { name: '5:00pm' })).toBeNull(); expect(screen.getByText('Finding free times…')).toBeTruthy();
  const fresh = structuredClone(available); fresh.by_coach[0]!.slots[0]!.ends_at = '2026-11-11T07:30:00Z';
  finish(fresh); await screen.findByRole('button', { name: '5:00pm' });
  expect(screen.queryByRole('button', { name: 'Continue: weeks and player details' })).toBeNull();
  expect(api.reserve).not.toHaveBeenCalled();
});


it('a group-only coach defaults to a real group query and hides one-on-one choices and prices', async () => {
  const current = currentCatalog(); current.coaches[0]!.offers = { one_on_one: false, group: true }; api.catalog.mockResolvedValue(current); draw();
  await screen.findByRole('button', { name: '5:00pm' });
  expect(screen.queryByRole('radio', { name: 'One player' })).toBeNull();
  expect(screen.getByRole('radio', { name: 'Group of 2' }).getAttribute('aria-checked')).toBe('true');
  expect(api.slots.mock.calls.every(([q]) => q.kind === 'group' && q.group_size === 2)).toBe(true);
  expect(screen.queryByText('One-on-one with Ikroop')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '5:00pm' })); fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  expect(new URLSearchParams(location.search).get('kind')).toBe('group');
  expect(new URLSearchParams(location.search).get('group_size')).toBe('2'); expect(api.reserve).not.toHaveBeenCalled();
});
it('a group-only coach uses the first supported size when two players is not offered', async () => {
  const current = currentCatalog(); current.coaches[0]!.offers = { one_on_one: false, group: true }; current.group_sizes = [3, 4]; api.catalog.mockResolvedValue(current); draw();
  await screen.findByRole('button', { name: '5:00pm' });
  expect(screen.queryByRole('radio', { name: 'Group of 2' })).toBeNull();
  expect(screen.getByRole('radio', { name: 'Group of 3' }).getAttribute('aria-checked')).toBe('true');
  expect(api.slots.mock.calls.every(([q]) => q.kind === 'group' && q.group_size === 3)).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: '5:00pm' })); fireEvent.click(screen.getByRole('button', { name: 'Continue: weeks and player details' }));
  expect(new URLSearchParams(location.search).get('group_size')).toBe('3'); expect(api.reserve).not.toHaveBeenCalled();
});
it('a one-on-one-only coach hides group choices and group price tables', async () => {
  const current = currentCatalog(); current.coaches[0]!.offers = { one_on_one: true, group: false }; api.catalog.mockResolvedValue(current); draw();
  await screen.findByRole('button', { name: '5:00pm' });
  expect(screen.getByRole('radio', { name: 'One player' }).getAttribute('aria-checked')).toBe('true');
  expect(screen.queryByRole('radio', { name: 'Group of 2' })).toBeNull();
  expect(screen.queryByText('Small group, train with your mates')).toBeNull();
  expect(api.slots.mock.calls.every(([q]) => q.kind === 'one_on_one')).toBe(true); expect(api.reserve).not.toHaveBeenCalled();
});
it('explicitly unsupported formats retain Ask-us without making an availability request', async () => {
  const current = currentCatalog(); current.coaches[0]!.offers = { one_on_one: false, group: false }; api.catalog.mockResolvedValue(current); draw();
  await screen.findByText(/isn’t taking new private bookings right now/);
  expect(api.slots).not.toHaveBeenCalled(); expect(screen.queryByRole('radio', { name: 'One player' })).toBeNull();
  expect(screen.getByRole('region', { name: 'Ask us about private coaching' })).toBeTruthy();
});
it('a legacy catalogue with missing offers is unavailable, not an unsupported or eligible coach', async () => {
  const current = currentCatalog(); Reflect.deleteProperty(current.coaches[0]!, 'offers'); api.catalog.mockResolvedValue(current); draw();
  await screen.findByText(/couldn’t verify the live coaching catalogue/);
  expect(screen.queryByText(/isn’t taking new private bookings/)).toBeNull();
  expect(api.slots).not.toHaveBeenCalled(); expect(api.reserve).not.toHaveBeenCalled();
});

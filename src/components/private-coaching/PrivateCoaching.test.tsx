// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { catalog, id } from '../booking/fixtures.test-helper';
import PrivateCoaching from './PrivateCoaching';

const api = vi.hoisted(() => ({ catalog: vi.fn(), enquiry: vi.fn() }));
vi.mock('../booking/public-client', async () => ({
    ...await vi.importActual<object>('../booking/public-client'),
    createPublicClient: () => api,
}));
vi.mock('../booking/Turnstile', () => ({
    default: ({ onToken }: { onToken: (token: string) => void }) => (
        <button type="button" onClick={() => onToken('unit-challenge')}>Complete unit security check</button>
    ),
}));

function centrePage() {
    return render(<MemoryRouter initialEntries={['/mickleham']}><PrivateCoaching /></MemoryRouter>);
}

beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    sessionStorage.clear();
    api.catalog.mockResolvedValue(catalog());
    api.enquiry.mockResolvedValue({ enquiry_id: id(11), call_by: '2026-11-10T09:00:00+11:00', call_by_plain: 'by 9am Tuesday' });
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

it('shows the canonical rates, links the two centres and coaches, and removes obsolete offer copy', async () => {
    centrePage();
    const page = screen.getByRole('main');
    expect(within(page).getByRole('heading', { name: 'Private cricket coaching at Mickleham' })).toBeTruthy();
    expect(within(page).getByRole('link', { name: 'Find a time at Mickleham' }).getAttribute('href')).toBe('/book?centre=mickleham');
    expect(within(page).getByRole('link', { name: 'View the coaches' }).getAttribute('href')).toBe('/coaches');
    expect(within(page).getByRole('link', { name: 'Cranbourne North' }).getAttribute('href')).toBe('/book?centre=cranbourne-north');
    expect(await within(page).findByText('$130 per hour')).toBeTruthy();
    for (const rate of [70, 60, 50]) expect(within(page).getByText(`$${rate} per player per hour`)).toBeTruthy();
    expect(within(page).getByText('All prices incl. GST.')).toBeTruthy();
    expect(within(page).getByText('10% off every session when you book 6 or more together.')).toBeTruthy();
    expect(within(page).getByText(/Choose a single session/)).toBeTruthy();
    expect(within(page).getByText(/consultation at the usual session price/)).toBeTruthy();
    expect(page.textContent).not.toMatch(/\$160|journey|minimum booking|leadership coach|term or season|Alex Lewis|Williamstown/i);
    expect(screen.getByRole('link', { name: 'Junior Royals' }).getAttribute('href')).toBe('/junior-royals');
});

it('keeps booking and enquiries available when the rate read fails', async () => {
    api.catalog.mockRejectedValueOnce(Error('Unavailable'));
    centrePage();
    expect(await screen.findByText('Open booking to see current session prices.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Find a time at Mickleham' }).getAttribute('href')).toBe('/book?centre=mickleham');
    expect(screen.getByRole('heading', { name: 'Ask us' })).toBeTruthy();
    expect(screen.queryByText('$130 per hour')).toBeNull();
});

it('sends Ask us through the existing adapter with Mickleham attribution', async () => {
    centrePage();
    const form = within(screen.getByRole('region', { name: 'Ask us about private coaching' }));
    for (const [label, value] of [
        ['Player’s name', 'Test Player'],
        ['Player’s age', '14'],
        [/Parent or guardian/, 'Test Parent'],
        ['Email', 'test@example.test'],
        ['Mobile', '0400000001'],
    ] as const) fireEvent.change(form.getByLabelText(label), { target: { value } });
    fireEvent.click(form.getByRole('button', { name: 'Complete unit security check' }));
    fireEvent.click(form.getByRole('button', { name: 'Send my enquiry' }));
    await form.findByText(/your enquiry is with the Academy/);
    expect(api.enquiry).toHaveBeenCalledTimes(1);
    expect(api.enquiry.mock.calls[0][0]).toMatchObject({ centre: 'mickleham', source_page: '/mickleham', player_age: 14 });
});

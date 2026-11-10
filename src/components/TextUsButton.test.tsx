// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router-dom';
import TextUsButton from './TextUsButton';

function draw(path: string) {
  return render(<MemoryRouter initialEntries={[path]}>
    <Link to="/">Home page</Link>
    <Link to="/coaches/mihiraj-jayasekara">Coach details</Link>
    <Link to="/coaches">Coach list</Link>
    <Link to="/book">Booking form</Link>
    <TextUsButton />
  </MemoryRouter>);
}

afterEach(() => {
  cleanup();
  document.body.classList.remove('cart-drawer-open');
  vi.restoreAllMocks();
});

it.each(['/coaches/mihiraj-jayasekara', '/coaches/ikroop-dhanoa/', '/COACHES/ALEX-THORNHILL'])('keeps the floating SMS control off coach detail page %s', path => {
  draw(path);
  expect(screen.queryByRole('button', { name: 'Text us' })).toBeNull();
});

it.each(['/', '/coaches', '/coaches/', '/contact', '/coaches-day'])('retains the ordinary contact control on %s', path => {
  draw(path);
  expect(screen.getByRole('button', { name: 'Text us' })).toBeTruthy();
});

it.each(['/book', '/book/credit', '/book/renewal', '/booking', '/manage/session', '/%62ook'])('keeps the existing booking-flow exclusion for %s', path => {
  draw(path);
  expect(screen.queryByRole('button', { name: 'Text us' })).toBeNull();
});

it('updates visibility during same-client navigation without a reload', () => {
  draw('/');
  expect(screen.getByRole('button', { name: 'Text us' })).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Coach details' }));
  expect(screen.queryByRole('button', { name: 'Text us' })).toBeNull();
  fireEvent.click(screen.getByRole('link', { name: 'Coach list' }));
  expect(screen.getByRole('button', { name: 'Text us' })).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Booking form' }));
  expect(screen.queryByRole('button', { name: 'Text us' })).toBeNull();
  fireEvent.click(screen.getByRole('link', { name: 'Home page' }));
  expect(screen.getByRole('button', { name: 'Text us' })).toBeTruthy();
});

it('still suppresses the ordinary control while the cart drawer is open', async () => {
  draw('/coaches');
  document.body.classList.add('cart-drawer-open');
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Text us' })).toBeNull());
  document.body.classList.remove('cart-drawer-open');
  await screen.findByRole('button', { name: 'Text us' });
});

it.each([
  ['desktop', 'Desktop test browser', '?', 'Hi, I have a question about RRA Melbourne programs'],
  ['iPhone', 'iPhone', '&', 'Hi - Let us know if you have a question!'],
])('retains the existing %s SMS contact action', (_device, userAgent, separator, message) => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent);
  const open = vi.spyOn(window, 'open').mockImplementation(() => null);
  draw('/coaches');
  fireEvent.click(screen.getByRole('button', { name: 'Text us' }));
  expect(open).toHaveBeenCalledOnce();
  expect(open).toHaveBeenCalledWith(`sms:0421261825${separator}body=${encodeURIComponent(message)}`, '_self');
});

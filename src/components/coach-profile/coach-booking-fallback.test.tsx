// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { COACH_PROFILES } from './coachProfiles';
import CPBook from './CPBook';
import { createFamilyOperationGate } from '../booking/family-operation-gate';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('gives an approved coach missing from the catalogue a usable Ask us form', () => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.stubEnv('VITE_APP_ENV', 'local');
  vi.stubEnv('VITE_PRIVATE_BOOKING_URL', 'http://127.0.0.1:54321/functions/v1');
  vi.stubEnv('VITE_PRIVATE_BOOKING_MOCK', 'false');
  const profile = COACH_PROFILES['ikroop-dhanoa'];
  const slots = vi.fn();
  render(<MemoryRouter><CPBook profile={profile} catalog={{ coaches: [] }} catalogLoading={false}
    catalogError={false} catalogCoach={null} picks={[]} sourcePage="/coaches/ikroop-dhanoa"
    reader={{ slots }} operationGate={createFamilyOperationGate()} /></MemoryRouter>);
  expect(screen.getByText(/isn’t taking new private bookings right now/)).toBeTruthy();
  expect(screen.getByRole('region', { name: 'Ask us about private coaching' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Send my enquiry' })).toBeTruthy();
  expect(screen.queryByText('Free times')).toBeNull();
  expect(slots).not.toHaveBeenCalled();
});

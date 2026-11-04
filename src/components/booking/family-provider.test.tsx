// @vitest-environment jsdom
import React, { StrictMode, useEffect } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, useLocation } from 'react-router-dom';
const test = vi.hoisted(() => {
  let available = true; const listeners = new Set<() => void>();
  const memory = { has: () => available, subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, clear: () => { available = false; for (const listener of listeners) listener(); } };
  return { memory, seed: () => { available = true; }, client: { clear: vi.fn() } };
});
vi.mock('./family-capability', () => ({ familyCapabilityMemory: test.memory }));
vi.mock('./family-client', () => ({ createFamilyClient: () => test.client }));
import FamilyCapabilityProvider from './FamilyCapabilityProvider';
import { useFamilyService } from './family-context';

const states: unknown[] = [];
function Probe() {
  const { hasCapability } = useFamilyService(), location = useLocation();
  useEffect(() => { states.push(location.state); }, [location.state]);
  return <><p>{hasCapability ? 'Private access retained' : 'Private access cleared'}</p><Link to="/book">Book</Link><Link to="/booking">Manage</Link><Link to="/">Leave</Link></>;
}
beforeEach(() => { test.seed(); test.client.clear.mockClear(); states.length = 0; });
afterEach(cleanup);
it('survives StrictMode mount and carries access through internal book navigation without router state', () => {
  render(<StrictMode><MemoryRouter initialEntries={['/booking']}><FamilyCapabilityProvider><Probe /></FamilyCapabilityProvider></MemoryRouter></StrictMode>);
  expect(screen.getByText('Private access retained')).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Book' })); expect(screen.getByText('Private access retained')).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Manage' })); expect(screen.getByText('Private access retained')).toBeTruthy();
  expect(states.every(state => state === null)).toBe(true); expect(test.client.clear).not.toHaveBeenCalled();
});
it('clears both access and the pending-action client when leaving the private flow', () => {
  render(<MemoryRouter initialEntries={['/booking']}><FamilyCapabilityProvider><Probe /></FamilyCapabilityProvider></MemoryRouter>);
  fireEvent.click(screen.getByRole('link', { name: 'Leave' })); expect(screen.getByText('Private access cleared')).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Manage' })); expect(screen.getByText('Private access cleared')).toBeTruthy();
  expect(test.client.clear).toHaveBeenCalled();
});
it('clears memory when the document is left or put into the back-forward cache', () => {
  render(<MemoryRouter initialEntries={['/booking']}><FamilyCapabilityProvider><Probe /></FamilyCapabilityProvider></MemoryRouter>);
  fireEvent(window, new Event('pagehide')); expect(screen.getByText('Private access cleared')).toBeTruthy();
  expect(test.client.clear).toHaveBeenCalled();
});

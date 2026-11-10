// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Link, MemoryRouter, useLocation } from 'react-router-dom';
const access = vi.hoisted(() => { let available = true; const listeners = new Set<() => void>(); return { has: () => available, read: () => available ? 'a'.repeat(64) : null, subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); }, clear() { available = false; listeners.forEach(fn => fn()); } }; });
const transport = vi.hoisted(() => ({ current: vi.fn(), quote: vi.fn(), accept: vi.fn(), receipt: vi.fn(), dispose: vi.fn() }));
vi.mock('../family-capability', () => ({ familyCapabilityMemory: access }));
vi.mock('./recovery-client', async original => ({ ...await original(), createRecoveryClient: () => transport }));
import FamilyCapabilityProvider from '../FamilyCapabilityProvider';
import { useFamilyService } from '../family-context';
import { env, fields, quote, nonce, prior, json } from './recovery-fixtures.test-helper';
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
it('keeps memory and exact original attempt when SPA navigation or close tries to leave an unknown request', async () => {
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  transport.current.mockResolvedValue({ schema_version: 1, kind: 'fresh_request', prior_request_id: prior, request: null }); transport.quote.mockResolvedValue(quote()); transport.accept.mockRejectedValue(Error('unit-lost-writer'));
  let service: any;
  function Probe() { service = useFamilyService(); const location = useLocation(); return <><p>{location.pathname}</p><p>{service.hasCapability ? 'Private memory available' : 'Private memory cleared'}</p><Link to="/book">Other booking</Link><Link to="/">Leave</Link><button onClick={() => service.clear()}>Clear private page</button></>; }
  render(<MemoryRouter initialEntries={['/booking']}><FamilyCapabilityProvider><Probe /></FamilyCapabilityProvider></MemoryRouter>);
  await act(async () => { await service.recovery.inspect(prior, 'fresh'); expect(service.recovery.getSnapshot()).toMatchObject({ phase: 'draft', error: null }); await service.recovery.quote(fields()); expect(service.recovery.getSnapshot()).toMatchObject({ phase: 'quoted', error: null }); await service.recovery.accept({ ...fields(), consent_save_card: true }, true, 'unit-widget'); });
  fireEvent.click(screen.getByRole('button', { name: 'Clear private page' })); expect(access.has()).toBe(true);
  fireEvent.click(screen.getByRole('link', { name: 'Other booking' })); await waitFor(() => expect(screen.getByText('/booking')).toBeTruthy());
  fireEvent.click(screen.getByRole('link', { name: 'Leave' })); await waitFor(() => expect(screen.getByText('/booking')).toBeTruthy());
  expect(service.recovery.locked()).toBe(true); expect(screen.getByText('Private memory available')).toBeTruthy(); expect(document.body.innerHTML).not.toContain(nonce); expect(sessionStorage.length + localStorage.length).toBe(0);
  const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event); expect(event.defaultPrevented).toBe(true);
});

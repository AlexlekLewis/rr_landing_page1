import { describe, it, expect, vi } from 'vitest';
import {
  readCustomFields, isSpinClubSession, subscriptionStatus, recordSpinClubCheckout,
  recordSpinClubInvoice, isSpinClubInvoice, SPIN_CLUB_SUBSCRIPTION_PLINK,
} from './spinClubSubscription.js';

// Minimal Supabase double: records every upsert/update, answers selects from `rows`.
const fakeSupabase = (rows = []) => {
  const calls = [];
  const builder = (table) => {
    const q = { table, filters: {} };
    const api = {
      upsert: (row, opts) => { calls.push({ op: 'upsert', table, row, opts }); return Promise.resolve({ error: null }); },
      update: (row) => { q.update = row; return api; },
      select: () => api,
      eq: (k, v) => {
        q.filters[k] = v;
        if (q.update) { calls.push({ op: 'update', table, row: q.update, filters: { ...q.filters } }); return Promise.resolve({ error: null }); }
        return api;
      },
      limit: () => Promise.resolve({ data: rows.filter((r) => r.table === table && Object.entries(q.filters).every(([k, v]) => r[k] === v)) }),
    };
    return api;
  };
  return { from: vi.fn(builder), calls };
};

const session = {
  id: 'cs_1',
  created: 1795766400,
  payment_link: SPIN_CLUB_SUBSCRIPTION_PLINK,
  subscription: 'sub_1',
  customer: 'cus_1',
  client_reference_id: '11111111-2222-4333-8444-555555555555',
  customer_details: { name: 'Pat Parent', email: 'Pat@Example.com', phone: '+61400000000' },
  custom_fields: [
    { key: 'playersfullname', label: { type: 'custom', custom: "Player's full name" }, type: 'text', text: { value: ' Sam Spinner ' } },
    { key: 'centre', label: { type: 'custom', custom: 'Centre' }, type: 'dropdown', dropdown: { value: 'cranbournenorth' } },
  ],
};

describe('readCustomFields', () => {
  it('reads the player name and maps the centre dropdown to its name', () => {
    expect(readCustomFields(session)).toEqual({ player_name: 'Sam Spinner', centre: 'Cranbourne North' });
  });
  it('copes with a session that has no custom fields', () => {
    expect(readCustomFields({})).toEqual({ player_name: null, centre: null });
  });
});

describe('isSpinClubSession', () => {
  it('is true only for the Spin Club subscription link', () => {
    expect(isSpinClubSession(session)).toBe(true);
    expect(isSpinClubSession({ payment_link: 'plink_other' })).toBe(false);
  });
});

describe('recordSpinClubCheckout', () => {
  it('upserts one held spot keyed on the subscription, with the form row id', async () => {
    const sb = fakeSupabase();
    const row = await recordSpinClubCheckout(sb, session);
    expect(sb.calls[0]).toMatchObject({ op: 'upsert', table: 'spin_club_subscriptions', opts: { onConflict: 'stripe_subscription_id' } });
    expect(row).toMatchObject({
      stripe_subscription_id: 'sub_1', application_id: session.client_reference_id,
      player_name: 'Sam Spinner', centre: 'Cranbourne North', parent_email: 'pat@example.com', status: 'active',
    });
  });
  it('drops a client_reference_id that is not a uuid', async () => {
    const row = await recordSpinClubCheckout(fakeSupabase(), { ...session, client_reference_id: 'whatsapp' });
    expect(row.application_id).toBeNull();
  });
});

describe('invoices', () => {
  const invoice = {
    id: 'in_1', subscription: 'sub_1', customer: 'cus_1', amount_paid: 6000, amount_due: 6000,
    billing_reason: 'subscription_cycle', status_transitions: { paid_at: 1795766400 },
    lines: { data: [{ description: '1 × Spin Club — Weekly Subscription (at $60.00 / week)', period: { start: 1795766400, end: 1796371200 } }] },
  };
  it('recognises a Spin Club invoice by its line even before the checkout is recorded', async () => {
    expect(await isSpinClubInvoice(fakeSupabase(), invoice)).toBe(true);
    expect(await isSpinClubInvoice(fakeSupabase(), { ...invoice, subscription: 'sub_x', lines: { data: [{ description: 'Junior Royals' }] } })).toBe(false);
  });
  it('records a paid week', async () => {
    const sb = fakeSupabase();
    const row = await recordSpinClubInvoice(sb, invoice, 'invoice.paid');
    expect(row).toMatchObject({ status: 'paid', amount_cents: 6000, stripe_subscription_id: 'sub_1' });
    expect(sb.calls).toHaveLength(1);
  });
  it('records a failed week and flags the spot', async () => {
    const sb = fakeSupabase();
    const row = await recordSpinClubInvoice(sb, invoice, 'invoice.payment_failed');
    expect(row.status).toBe('failed');
    expect(row.paid_at).toBeNull();
    expect(sb.calls[1]).toMatchObject({ op: 'update', table: 'spin_club_subscriptions', row: { status: 'payment_failed' } });
  });
});

describe('subscriptionStatus', () => {
  it('maps Stripe states to plain words', () => {
    expect(subscriptionStatus({ status: 'active' }, 'customer.subscription.updated')).toBe('active');
    expect(subscriptionStatus({ status: 'trialing' }, 'customer.subscription.updated')).toBe('active');
    expect(subscriptionStatus({ status: 'active', pause_collection: { behavior: 'void' } }, 'customer.subscription.updated')).toBe('paused');
    expect(subscriptionStatus({ status: 'past_due' }, 'customer.subscription.updated')).toBe('payment_failed');
    expect(subscriptionStatus({ status: 'active' }, 'customer.subscription.deleted')).toBe('cancelled');
  });
});

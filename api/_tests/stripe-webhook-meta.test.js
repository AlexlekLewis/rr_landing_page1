// The Meta Conversions API call in the Stripe webhook must never change what
// the webhook does: same response to Stripe whether Meta answers, fails or hangs.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const SESSION = {
  id: 'cs_test_meta1',
  payment_status: 'paid',
  amount_total: 4495,
  metadata: { source: 'performance-squad-join' }, // no registration_id → quick 200 "ignored"
  customer_details: { email: 'parent@example.com', phone: '0412345678', name: 'Sam Lee' },
  line_items: { data: [] },
};

vi.mock('stripe', () => ({
  default: class {
    webhooks = { constructEvent: () => ({ type: 'checkout.session.completed', data: { object: { id: SESSION.id } } }) };
    checkout = { sessions: { retrieve: async () => SESSION } };
  },
}));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({}) }));

const { default: handler } = await import('../stripe-webhook.js');

const call = async () => {
  const res = {
    statusCode: null, payload: undefined,
    status(code) { this.statusCode = code; return this; },
    json(p) { this.payload = p; return this; },
  };
  const req = { method: 'POST', headers: { 'stripe-signature': 'sig' }, async *[Symbol.asyncIterator]() { yield Buffer.from('{}'); } };
  await handler(req, res);
  return res;
};

const EXPECTED = { received: true, ignored: 'join_session_without_registration_id' };

describe('stripe-webhook → Meta Conversions API', () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_x';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service';
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    delete process.env.META_CAPI_ACCESS_TOKEN;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('sends a Purchase with the Checkout Session id as event_id', async () => {
    process.env.META_CAPI_ACCESS_TOKEN = 'tok';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', fetchMock);
    const res = await call();
    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual(EXPECTED);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.data[0]).toMatchObject({ event_name: 'Purchase', event_id: SESSION.id, custom_data: { value: 44.95, currency: 'aud', content_name: 'performance-squad-join' } });
  });

  it('answers Stripe the same when Meta is down', async () => {
    process.env.META_CAPI_ACCESS_TOKEN = 'tok';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')));
    const res = await call();
    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual(EXPECTED);
  });

  it('skips Meta entirely without a token', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await call();
    expect(res.payload).toEqual(EXPECTED);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

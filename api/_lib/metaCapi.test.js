import { describe, it, expect, vi } from 'vitest';
import crypto from 'node:crypto';
import {
  META_CAPI_URL, sha256, normEmail, normPhone, normText, splitName, eventSourceUrl,
  buildPurchasePayload, sendMetaPurchase, attributionMetadata,
} from './metaCapi.js';

const h = (v) => crypto.createHash('sha256').update(v).digest('hex');

const SESSION = {
  id: 'cs_live_abc123',
  payment_status: 'paid',
  amount_total: 4495,
  currency: 'aud',
  success_url: 'https://rramelbourne.com/junior-royals/success?session_id={CHECKOUT_SESSION_ID}&x=1',
  customer_details: {
    email: '  Parent@Example.COM ',
    phone: '0412 345 678',
    name: 'Priya  Sharma-Patel',
    address: { city: 'Point Cook', state: 'VIC', postal_code: '3030', country: 'AU' },
  },
  metadata: { fbc: 'fb.1.1700000000000.ABC', fbp: 'fb.1.1700000000000.123', client_ip_address: '1.2.3.4', client_user_agent: 'Mozilla/5.0' },
};

describe('normalisation', () => {
  it('lowercases and trims emails, rejects junk', () => {
    expect(normEmail('  Parent@Example.COM ')).toBe('parent@example.com');
    expect(normEmail('nope')).toBeNull();
  });

  it('turns Australian numbers into E.164 digits', () => {
    expect(normPhone('0412 345 678')).toBe('61412345678');
    expect(normPhone('+61 412 345 678')).toBe('61412345678');
    expect(normPhone('+61 (0) 412 345 678')).toBe('61412345678');
    expect(normPhone('0061412345678')).toBe('61412345678');
    expect(normPhone('412345678')).toBe('61412345678');
    expect(normPhone('(03) 9123 4567')).toBe('61391234567');
    expect(normPhone('+64 21 123 4567')).toBe('64211234567');
    expect(normPhone('')).toBeNull();
    expect(normPhone('123')).toBeNull();
  });

  it('strips punctuation and spaces from names and places', () => {
    expect(normText('Sharma-Patel')).toBe('sharmapatel');
    expect(normText('Point Cook')).toBe('pointcook');
    expect(normText('  ')).toBeNull();
    expect(splitName('Priya  Sharma-Patel')).toEqual({ first: 'Priya', last: 'Sharma-Patel' });
    expect(splitName('Priya')).toEqual({ first: 'Priya', last: null });
  });

  it('hashes with SHA-256 hex', () => {
    expect(sha256('parent@example.com')).toBe(h('parent@example.com'));
  });

  it('uses the success page without its query as the source URL', () => {
    expect(eventSourceUrl(SESSION)).toBe('https://rramelbourne.com/junior-royals/success');
    expect(eventSourceUrl({}, 'https://rramelbourne.com/spin-club')).toBe('https://rramelbourne.com/spin-club');
    expect(eventSourceUrl({})).toBe('https://rramelbourne.com/');
  });
});

describe('buildPurchasePayload', () => {
  it('builds a Purchase that dedupes with the browser event and hashes personal data', () => {
    const p = buildPurchasePayload(SESSION, { contentName: 'Junior Royals Term 4', now: 1_800_000_000_000 });
    expect(p.test_event_code).toBeUndefined();
    expect(p.data).toHaveLength(1);
    const [e] = p.data;
    expect(e).toMatchObject({
      event_name: 'Purchase',
      event_time: 1_800_000_000,
      event_id: 'cs_live_abc123',
      action_source: 'website',
      event_source_url: 'https://rramelbourne.com/junior-royals/success',
      custom_data: { value: 44.95, currency: 'aud', content_name: 'Junior Royals Term 4' },
    });
    expect(e.user_data).toEqual({
      em: [h('parent@example.com')],
      ph: [h('61412345678')],
      fn: h('priya'),
      ln: h('sharmapatel'),
      ct: h('pointcook'),
      st: h('vic'),
      zp: h('3030'),
      country: h('au'),
      client_ip_address: '1.2.3.4',
      client_user_agent: 'Mozilla/5.0',
      fbc: 'fb.1.1700000000000.ABC',
      fbp: 'fb.1.1700000000000.123',
    });
    expect(JSON.stringify(p)).not.toMatch(/example\.com|0412|Priya/);
  });

  it('leaves out what Stripe did not collect and passes the test code', () => {
    const p = buildPurchasePayload({ id: 'cs_1', amount_total: 6000, customer_email: 'a@b.co', customer_details: {} }, { testEventCode: 'TEST1' });
    expect(p.test_event_code).toBe('TEST1');
    expect(p.data[0].user_data).toEqual({ em: [h('a@b.co')] });
    expect(p.data[0].custom_data).toEqual({ value: 60, currency: 'aud' });
  });
});

describe('sendMetaPurchase', () => {
  const okFetch = () => vi.fn().mockResolvedValue({ ok: true, text: async () => '' });

  it('skips without a token, and skips unpaid sessions', async () => {
    const f = okFetch();
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(await sendMetaPurchase(SESSION, { env: {}, fetchImpl: f })).toEqual({ skipped: 'no_token' });
    expect(await sendMetaPurchase({ ...SESSION, payment_status: 'unpaid' }, { env: { META_CAPI_ACCESS_TOKEN: 't' }, fetchImpl: f })).toEqual({ skipped: 'not_paid' });
    expect(f).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it('POSTs to the pixel with the token in the body', async () => {
    const f = okFetch();
    const r = await sendMetaPurchase(SESSION, { env: { META_CAPI_ACCESS_TOKEN: 'tok', META_TEST_EVENT_CODE: 'TEST9' }, fetchImpl: f, contentName: 'X' });
    expect(r).toEqual({ ok: true });
    const [url, init] = f.mock.calls[0];
    expect(url).toBe('https://graph.facebook.com/v21.0/3125499870991789/events');
    expect(url).toBe(META_CAPI_URL);
    const body = JSON.parse(init.body);
    expect(body.access_token).toBe('tok');
    expect(body.test_event_code).toBe('TEST9');
    expect(body.data[0].event_id).toBe(SESSION.id);
  });

  it('never throws on a Meta error, a network error or a timeout', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const env = { META_CAPI_ACCESS_TOKEN: 'tok' };
    const bad = vi.fn().mockResolvedValue({ ok: false, status: 400, text: async () => '{"error":"bad"}' });
    expect(await sendMetaPurchase(SESSION, { env, fetchImpl: bad })).toEqual({ ok: false, status: 400 });
    const down = vi.fn().mockRejectedValue(new Error('ECONNRESET'));
    expect(await sendMetaPurchase(SESSION, { env, fetchImpl: down })).toMatchObject({ ok: false, error: 'ECONNRESET' });
    const hang = (_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(new Error('aborted'))));
    expect(await sendMetaPurchase(SESSION, { env, fetchImpl: hang, timeoutMs: 10 })).toMatchObject({ ok: false, error: 'aborted' });
    err.mockRestore();
  });
});

describe('attributionMetadata', () => {
  it('keeps short strings only, and takes ip and user agent from the request', () => {
    const req = { headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1', 'user-agent': 'Mozilla/5.0' } };
    expect(attributionMetadata(req, { fbc: 'fb.1.1.ABC', fbp: '', utm_source: 'facebook', utm_term: 5, landing_page: 'x' })).toEqual({
      fbc: 'fb.1.1.ABC',
      utm_source: 'facebook',
      client_ip_address: '1.2.3.4',
      client_user_agent: 'Mozilla/5.0',
    });
    expect(attributionMetadata({}, null)).toEqual({});
    expect(attributionMetadata({ headers: { 'user-agent': 'x'.repeat(900) } }).client_user_agent).toHaveLength(500);
  });
});

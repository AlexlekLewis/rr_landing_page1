// Site-wide measurement helpers: Meta Pixel, first-touch attribution, UTM tagging.
// Runs in the plain Node test environment, so window / sessionStorage / document
// are stubbed per test.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { trackPageView, trackLead, trackCheckout, trackPurchase } from './metaPixel';
import { captureAttribution, getAttribution, fillAttribution, safePath, LEAD_ATTR_COLUMNS } from './attribution';
import { withUtm } from './utm';
import { trackPurchaseOnReturn, getReturnSessionId } from './purchaseOnReturn';

const memoryStorage = () => {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => { m.set(k, String(v)); },
    removeItem: (k: string) => { m.delete(k); },
    clear: () => m.clear(),
  };
};

const setUrl = (search: string, pathname = '/spin-club') => {
  (globalThis as any).window.location = { search, pathname, origin: 'https://rramelbourne.com', href: `https://rramelbourne.com${pathname}${search}` };
};

let fbq: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fbq = vi.fn();
  vi.stubGlobal('window', { fbq });
  vi.stubGlobal('sessionStorage', memoryStorage());
  vi.stubGlobal('document', { referrer: '' });
  setUrl('');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('metaPixel', () => {
  it('PageView, Lead and InitiateCheckout carry program/centre/price only', () => {
    trackPageView();
    trackLead({ program: 'Spin Club', centre: 'mickleham' });
    trackCheckout({ program: 'Sid junior session', value: 30 });
    expect(fbq).toHaveBeenNthCalledWith(1, 'track', 'PageView');
    expect(fbq).toHaveBeenNthCalledWith(2, 'track', 'Lead', { content_name: 'Spin Club', content_category: 'mickleham' });
    expect(fbq).toHaveBeenNthCalledWith(3, 'track', 'InitiateCheckout', { content_name: 'Sid junior session', value: 30, currency: 'AUD' });
  });

  it('Purchase fires once per Stripe session id, with eventID = session id', () => {
    expect(trackPurchase({ program: 'Academy Shop', value: 89, sessionId: 'cs_live_abc' })).toBe(true);
    expect(trackPurchase({ program: 'Academy Shop', value: 89, sessionId: 'cs_live_abc' })).toBe(false);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('track', 'Purchase', { content_name: 'Academy Shop', value: 89, currency: 'AUD' }, { eventID: 'cs_live_abc' });
    // A different session is a different sale.
    trackPurchase({ program: 'Academy Shop', value: 89, sessionId: 'cs_live_def' });
    expect(fbq).toHaveBeenCalledTimes(2);
  });

  it('never throws when fbq is missing, throws, or storage is blocked', () => {
    vi.stubGlobal('window', {});
    expect(() => { trackPageView(); trackLead({ program: 'x' }); trackCheckout({ program: 'x', value: 1 }); }).not.toThrow();
    expect(() => trackPurchase({ program: 'x', value: 1, sessionId: 'cs_test_1' })).not.toThrow();

    vi.stubGlobal('window', { fbq: () => { throw new Error('blocked'); } });
    vi.stubGlobal('sessionStorage', { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } });
    expect(() => trackPurchase({ program: 'x', value: 1, sessionId: 'cs_test_2' })).not.toThrow();
    expect(() => trackLead()).not.toThrow();
  });
});

describe('purchaseOnReturn', () => {
  it('fires nothing on a plain visit (no session_id)', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    expect(await trackPurchaseOnReturn({ program: 'Performance Squads trial', fallbackValue: 30 })).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('ignores an unreplaced Stripe template', () => {
    setUrl('?session_id={CHECKOUT_SESSION_ID}');
    expect(getReturnSessionId()).toBe('');
  });

  it('uses the Stripe amount when paid, and only once', async () => {
    setUrl('?session_id=cs_live_xyz');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ payment_status: 'paid', amount_total: 6000 }) })));
    expect(await trackPurchaseOnReturn({ program: 'Performance Squads trial', fallbackValue: 30 })).toBe(true);
    expect(await trackPurchaseOnReturn({ program: 'Performance Squads trial', fallbackValue: 30 })).toBe(false);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('track', 'Purchase', { content_name: 'Performance Squads trial', value: 60, currency: 'AUD' }, { eventID: 'cs_live_xyz' });
  });

  it('does not fire when Stripe says unpaid', async () => {
    setUrl('?session_id=cs_live_unpaid');
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ payment_status: 'unpaid' }) })));
    expect(await trackPurchaseOnReturn({ program: 'x', fallbackValue: 30 })).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
  });

  it('falls back to the known price when verification is unreachable', async () => {
    setUrl('?session_id=cs_live_down');
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    expect(await trackPurchaseOnReturn({ program: 'Power League Matches', fallbackValue: 196 })).toBe(true);
    expect(fbq).toHaveBeenCalledWith('track', 'Purchase', { content_name: 'Power League Matches', value: 196, currency: 'AUD' }, { eventID: 'cs_live_down' });
  });
});

describe('attribution (first touch)', () => {
  it('stores UTMs, click ids, landing page and referrer on first load', () => {
    setUrl('?utm_source=facebook&utm_medium=paid&utm_campaign=spin&fbclid=FB123&email=parent@example.com&key=SECRET', '/spin-club');
    (globalThis as any).document.referrer = 'https://l.instagram.com/';
    const a = captureAttribution();
    expect(a).toMatchObject({
      utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'spin', fbclid: 'FB123',
      landing_page: '/spin-club?utm_source=facebook&utm_medium=paid&utm_campaign=spin',
      first_referrer: 'https://l.instagram.com/',
    });
    // Personal details and secrets in the URL never reach the stored landing page.
    expect(a!.landing_page).not.toContain('email');
    expect(a!.landing_page).not.toContain('SECRET');
  });

  it('never overwrites the first touch later in the session', () => {
    setUrl('?utm_source=instagram', '/');
    captureAttribution();
    setUrl('?utm_source=email', '/junior-royals');
    captureAttribution();
    expect(getAttribution().utm_source).toBe('instagram');
    expect(getAttribution().landing_page).toBe('/?utm_source=instagram');
  });

  it('fills only empty, existing keys; the form URL wins', () => {
    setUrl('?utm_source=instagram&utm_campaign=t4');
    (globalThis as any).document.referrer = 'https://www.google.com/';
    captureAttribution();
    const row = fillAttribution({ name: 'x', utm_source: null, utm_medium: null, utm_campaign: 'from-form-url', page_referrer: null });
    expect(row).toEqual({ name: 'x', utm_source: 'instagram', utm_medium: null, utm_campaign: 'from-form-url', page_referrer: 'https://www.google.com/' });
    // No columns are invented when the row doesn't have them…
    expect(fillAttribution({ name: 'x' })).toEqual({ name: 'x' });
    // …unless the caller names columns the table is known to have.
    expect(fillAttribution({ name: 'x' }, LEAD_ATTR_COLUMNS)).toEqual({ name: 'x', utm_source: 'instagram', utm_campaign: 't4', page_referrer: 'https://www.google.com/' });
  });

  it('is a no-op without stored attribution or storage', () => {
    expect(fillAttribution({ utm_source: null })).toEqual({ utm_source: null });
    vi.stubGlobal('sessionStorage', { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } });
    expect(captureAttribution()).toBeNull();
    expect(getAttribution()).toEqual({});
  });

  it('safePath keeps only allow-listed params', () => {
    expect(safePath('/induction', '?program=Spin&phone=0400000000&utm_term=x')).toBe('/induction?utm_term=x&program=Spin');
    expect(safePath('/', '')).toBe('/');
  });
});

describe('withUtm', () => {
  it('adds utm tags to absolute and relative links', () => {
    expect(withUtm('https://rramelbourne.com/spin-club', { source: 'whatsapp', medium: 'share', campaign: 'spin-club' }))
      .toBe('https://rramelbourne.com/spin-club?utm_source=whatsapp&utm_medium=share&utm_campaign=spin-club');
    expect(withUtm('/sid-juniors?session=mickleham#form', { source: 'qr', medium: 'poster' }))
      .toBe('/sid-juniors?session=mickleham&utm_source=qr&utm_medium=poster#form');
  });

  it('keeps existing utm values and leaves mailto/tel alone', () => {
    expect(withUtm('https://rramelbourne.com/?utm_source=poster-mickleham', { source: 'qr', medium: 'poster' }))
      .toBe('https://rramelbourne.com/?utm_source=poster-mickleham&utm_medium=poster');
    expect(withUtm('mailto:info@rramelbourne.com', { source: 'email' })).toBe('mailto:info@rramelbourne.com');
    expect(withUtm('', { source: 'x' })).toBe('');
  });
});

import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { bookingPixelEvent, bookingPixelTarget } from './private-booking-pixel';

const id = 'a9640000-0000-4000-8000-000000000101';
const productionOrigin = 'https://rramelbourne.com';
const frameHtml = readFileSync(new URL('../../../public/private-booking-pixel.html', import.meta.url), 'utf8');

function frameHarness() {
  let receive: (event: { source: object; origin: string; data: unknown }) => void = () => {};
  const scripts: Array<{ src?: string }> = [];
  const parent = {};
  const frame: { parent: object; fbq?: { queue: Array<ArrayLike<unknown>> }; addEventListener: (event: string, handler: typeof receive) => void } = {
    parent,
    addEventListener: (event, handler) => { if (event === 'message') receive = handler; },
  };
  const document = { createElement: () => ({}), head: { appendChild: (script: { src?: string }) => scripts.push(script) } };
  const source = frameHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  if (!source) throw new Error('Missing pixel frame script');
  runInNewContext(source, { window: frame, document });
  return {
    scripts,
    send: (data: unknown, origin = productionOrigin, sender = parent) => receive({ data, origin, source: sender }),
    calls: () => frame.fbq?.queue.map(args => Array.from(args)) ?? [],
  };
}

describe('private booking analytics boundary', () => {
  it('captures events locally only on the exact protected test site', () => {
    expect(bookingPixelTarget('https://rra-coaching-test-web.vercel.app', 'test')).toBe('test');
    expect(bookingPixelTarget('https://other-preview.vercel.app', 'test')).toBeNull();
    expect(bookingPixelTarget(productionOrigin, 'test')).toBeNull();
    expect(bookingPixelTarget(productionOrigin, 'production')).toBe('meta');
    expect(bookingPixelTarget('http://localhost:5173', 'local')).toBeNull();
  });
  it('uses only a typed event, opaque ID and exact charged amount', () => {
    expect(bookingPixelEvent('Lead', id)).toEqual({ namespace: 'rra-private-booking-pixel', event: 'Lead', eventId: id });
    expect(bookingPixelEvent('Lead', 'someone@example.test')).toBeNull();
    expect(bookingPixelEvent('Purchase', id, 0)).toBeNull();
    expect(bookingPixelEvent('Purchase', id, 13000.5)).toBeNull();
    expect(bookingPixelEvent('Unexpected', id)).toBeNull();
  });

  it('refuses test hosts and any sender other than the frame parent', () => {
    const frame = frameHarness();
    frame.send(bookingPixelEvent('PageView'), 'https://rra-coaching-test-web.vercel.app');
    frame.send(bookingPixelEvent('PageView'), productionOrigin, {});
    expect(frame.scripts).toEqual([]);
    expect(frame.calls()).toEqual([]);
  });

  it('discards extra fields and keeps automatic configuration off', () => {
    const frame = frameHarness();
    frame.send({ ...bookingPixelEvent('Purchase', id, 13000), family_token: 'synthetic-do-not-forward', email: 'someone@example.test' });
    expect(frame.scripts.map(script => script.src)).toEqual(['https://connect.facebook.net/en_US/fbevents.js']);
    expect(frame.calls()).toEqual([
      ['set', 'autoConfig', false, '3125499870991789'],
      ['init', '3125499870991789'],
      ['track', 'Purchase', { value: 130, currency: 'AUD' }, { eventID: id }],
    ]);
  });
});

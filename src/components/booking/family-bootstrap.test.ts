import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { expect, it } from 'vitest';
import { createFamilyCapabilityMemory } from './family-capability';

const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const source = /<script id="private-family-bootstrap">([\s\S]*?)<\/script>/.exec(html)?.[1];
const marker = 'a'.repeat(64);
function bootstrap(path: string, refuseHistory = false) {
  const url = new URL(path, 'https://unit.example.test'), metas: { name?: string; content?: string }[] = [], states: unknown[] = [], redirects: string[] = [];
  const handlers = new Map<string, (() => void)[]>(); let reloads = 0;
  const location = { pathname: url.pathname, search: url.search, hash: url.hash, replace: (next: string) => redirects.push(next), reload: () => { reloads++; } };
  const window = { location, history: { replaceState: (state: unknown, _title: string, next: string) => {
    if (refuseHistory) throw Error('unit history unavailable');
    states.push(state); const clean = new URL(next, url); Object.assign(location, { pathname: clean.pathname, search: clean.search, hash: clean.hash });
  } }, addEventListener: (event: string, listener: () => void) => { handlers.set(event, [...(handlers.get(event) ?? []), listener]); } };
  Object.defineProperty(window, 'sessionStorage', { get: () => { throw Error('No browser storage'); } });
  Object.defineProperty(window, 'localStorage', { get: () => { throw Error('No browser storage'); } });
  expect(typeof source).toBe('string');
  vm.runInNewContext(source!, { window, document: { createElement: () => ({}), head: { appendChild: (meta: object) => metas.push(meta) } }, Symbol });
  const navigateHash = (next: string) => {
    const changed = new URL(next, url); Object.assign(location, { pathname: changed.pathname, search: changed.search, hash: changed.hash });
    for (const listener of handlers.get('hashchange') ?? []) listener();
  };
  return { window, location, states, metas, redirects, navigateHash, reloads: () => reloads, memory: createFamilyCapabilityMemory(window) };
}
it('captures the canonical fragment once and clears the address before external assets', () => {
  const result = bootstrap('/booking#token=' + marker);
  expect(result.location).toMatchObject({ pathname: '/booking', search: '', hash: '' });
  expect(result.states).toEqual([null]); expect(result.memory.has()).toBe(true);
  expect(result.memory.read() === marker).toBe(true);
  expect(createFamilyCapabilityMemory(result.window).has()).toBe(false);
  expect(JSON.stringify(result.metas).includes(marker)).toBe(false);
  expect(result.metas).toContainEqual({ name: 'referrer', content: 'no-referrer' });
  expect(result.metas).toContainEqual({ name: 'robots', content: 'noindex, nofollow, noarchive' });
  expect(html.indexOf('private-family-bootstrap')).toBeLessThan(html.indexOf('fonts.googleapis.com'));
});
it.each([
  { name: 'legacy query', path: '/manage?token=' + marker },
  { name: 'legacy path', path: '/booking/' + marker },
  { name: 'extra fragment field', path: '/booking#token=' + marker + '&other=1' },
  { name: 'query plus fragment', path: '/booking?other=1#token=' + marker },
  { name: 'uppercase token', path: '/booking#token=' + marker.toUpperCase() },
])('cleans and refuses ambiguous or legacy bearer input: $name', ({ path }) => {
  const result = bootstrap(path); expect(result.memory.has()).toBe(false);
  expect(result.location).toMatchObject({ pathname: '/booking', search: '', hash: '' });
});
it('does not retain access if URL cleanup fails', () => {
  const result = bootstrap('/booking#token=' + marker, true);
  expect(result.memory.has()).toBe(false); expect(result.redirects).toEqual(['/booking']);
});
it('starts a fresh document for a capability hash added to an already-open clean family page', () => {
  const current = bootstrap('/booking'); expect(current.memory.has()).toBe(false);
  current.navigateHash('/booking#token=' + marker);
  expect(current.reloads()).toBe(1);
  // The next document runs the early bootstrap before assets or application code.
  const next = bootstrap(current.location.pathname + current.location.search + current.location.hash);
  expect(next.memory.read() === marker).toBe(true);
  expect(next.location.hash).toBe(''); expect(next.reloads()).toBe(0);
  expect(JSON.stringify([...current.metas, ...next.metas]).includes(marker)).toBe(false);
});
it.each(['/booking#token=invalid', '/booking#other', '/booking#', '/manage#token=' + marker, '/manage/legacy#token=' + marker])('reloads and fails closed for a new malformed or legacy family hash: %s', path => {
  const current = bootstrap('/booking'); current.navigateHash(path);
  expect(current.reloads()).toBe(1);
  const next = bootstrap(current.location.pathname + current.location.search + current.location.hash);
  expect(next.memory.has()).toBe(false); expect(next.location.hash).toBe('');
});
it('checks the current route on hash navigation without reloading ordinary page anchors', () => {
  const current = bootstrap('/coaches'); current.navigateHash('/coaches#coach'); expect(current.reloads()).toBe(0);
  current.navigateHash('/booking#token=' + marker); expect(current.reloads()).toBe(1);
});
it('clears the memory capability and notifies without passing its value', () => {
  const result = bootstrap('/booking#token=' + marker); let calls = 0;
  result.memory.subscribe(() => { calls++; }); result.memory.clear(); result.memory.clear();
  expect(result.memory.has()).toBe(false); expect(result.memory.read()).toBeNull(); expect(calls).toBe(1);
});
it('keeps family pages uncacheable and blocks the noscript tracking image in deployment headers', () => {
  const config = JSON.parse(readFileSync(new URL('../../../vercel.json', import.meta.url), 'utf8'));
  for (const path of ['/booking/:path*', '/manage/:path*']) {
    const headers = Object.fromEntries(config.headers.find((rule: { source: string }) => rule.source === path).headers.map((header: { key: string; value: string }) => [header.key, header.value]));
    expect(headers['Cache-Control']).toBe('no-store'); expect(headers['Referrer-Policy']).toBe('no-referrer');
    expect(headers['X-Robots-Tag']).toContain('noindex'); expect(headers['Content-Security-Policy']).toBe("img-src 'self' data:;");
  }
});

const handoff = Symbol.for('rra.private.renewal.bootstrap.v1');
export const isRenewalMemoryToken = value => typeof value === 'string' && /^pro1\.[0-9a-f]{64}$/.exec(value)?.[0] === value;
export function createRenewalMemory(scope = globalThis.window ?? globalThis) {
  let token = null, locked = false, lock = () => {}; const listeners = new Set();
  try { const take = scope[handoff]; if (typeof take === 'function') { const packet = take(); token = packet?.token; if (typeof packet?.lock === 'function') lock = packet.lock; } } catch { /* No handoff grants no authority. */ }
  delete scope[handoff]; if (!isRenewalMemoryToken(token)) token = null;
  const memory = { has: () => token !== null, read: () => token, locked: () => locked,
    setLocked(value) { locked = value === true; lock(locked); },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    clear() { const had = token !== null; token = null; locked = false; lock(false); if (had) for (const listener of listeners) listener(); } };
  scope.addEventListener?.('pagehide', () => memory.clear(), { once: true }); return memory;
}
export const renewalMemory = createRenewalMemory();

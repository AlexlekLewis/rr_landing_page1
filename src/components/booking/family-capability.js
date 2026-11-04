const handoff = Symbol.for('rra.private.family.bootstrap.v1');
const valid = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);

export function createFamilyCapabilityMemory(scope = globalThis.window ?? globalThis) {
  let capability = null;
  try {
    const take = scope[handoff];
    if (typeof take === 'function') capability = take();
  } catch { /* An unavailable handoff never grants access. */ }
  delete scope[handoff];
  if (!valid(capability)) capability = null;
  const listeners = new Set();
  return {
    has: () => capability !== null,
    read: () => capability,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    clear() {
      if (capability === null) return;
      capability = null;
      for (const listener of listeners) listener();
    },
  };
}

// The inline head bootstrap hands off once; no token is exposed in React state.
export const familyCapabilityMemory = createFamilyCapabilityMemory();

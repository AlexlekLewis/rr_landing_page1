export const QA_SUPABASE_URL = 'https://tbdwfwgvzmieaehxnpzo.supabase.co';
export const QA_PUBLIC_ORIGIN = 'https://rra-coaching-test-web.vercel.app';

// Public configuration only. These literals admit one isolated TEST site/backend.
export function hostedBookingRuntime(env) {
  const backend = env.VITE_QA_SUPABASE_URL, origin = env.VITE_QA_PUBLIC_ORIGIN;
  if (backend === undefined && origin === undefined) return null;
  if (env.VITE_APP_ENV !== 'test' || backend !== QA_SUPABASE_URL || origin !== QA_PUBLIC_ORIGIN ||
    env.VITE_PRIVATE_BOOKING_URL !== `${backend}/functions/v1` || env.VITE_SUPABASE_URL !== backend)
    throw new Error('TEST booking configuration is unavailable');
  for (const key of [env.VITE_PRIVATE_BOOKING_KEY, env.VITE_SUPABASE_ANON_KEY]) {
    if (typeof key !== 'string' || !key || key.startsWith('sb_secret_')) throw new Error('TEST public key is unavailable');
    if (key.startsWith('eyJ')) {
      let payload; try { payload = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { throw new Error('TEST public key is unavailable'); }
      if (payload.role !== 'anon' || payload.ref !== undefined && payload.ref !== 'tbdwfwgvzmieaehxnpzo') throw new Error('TEST public key is unavailable');
    }
  }
  return Object.freeze({ backend, origin, local: true });
}

export function hostedCheckoutResult(value, enabled) {
  if (!enabled) return value;
  const pending = [value]; let count = 0;
  while (pending.length) {
    if (++count > 10000) throw new Error('TEST payment response is unavailable');
    const item = pending.pop();
    if (item === null || typeof item !== 'object') continue;
    for (const [key, nested] of Object.entries(item)) {
      if (key === 'checkout_url' && nested !== null && nested !== undefined) {
        if (typeof nested !== 'string') throw new Error('TEST payment response is unavailable');
        const url = new URL(nested);
        if (url.origin !== 'https://checkout.stripe.com' || url.username || url.password ||
          !/^\/c\/pay\/cs_test_[A-Za-z0-9]+$/.test(url.pathname)) throw new Error('TEST payment response is unavailable');
      } else if (nested !== null && typeof nested === 'object') pending.push(nested);
    }
  }
  return value;
}

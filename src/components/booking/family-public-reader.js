import { createPublicClient } from './public-client';

/** Public availability may be read during an unknown financial outcome. A429
 * from any private-visit API still pauses every subsequent visit API call. */
export function createFamilyPublicReader(gate, client = createPublicClient()) {
  const read = method => async (...args) => {
    gate?.assertReadable();
    try { return await client[method](...args); }
    catch (error) { if (error?.code === 'rate_limited') gate?.pause(); throw error; }
  };
  return { catalog: read('catalog'), slots: read('slots') };
}

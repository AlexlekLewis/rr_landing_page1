import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { isBookingFlowPath } from './booking-privacy';
import { familyCapabilityMemory } from './family-capability';
import { createFamilyClient } from './family-client';
import { FamilyContext } from './family-context';
import { createCreditClient } from './credit-client';
import { createFamilyOperationGate } from './family-operation-gate';

export default function FamilyCapabilityProvider({ children }) {
  const { pathname } = useLocation();
  const hasCapability = useSyncExternalStore(familyCapabilityMemory.subscribe, familyCapabilityMemory.has, () => false);
  const [{ client, creditClient, gate }] = useState(() => {
    const gate = createFamilyOperationGate();
    return { gate, client: createFamilyClient(import.meta.env, globalThis.fetch, familyCapabilityMemory, gate), creditClient: createCreditClient(import.meta.env, globalThis.fetch, familyCapabilityMemory, gate) };
  });
  const clear = useCallback(() => { client.clear(); creditClient.clear(); gate.clear(); familyCapabilityMemory.clear(); }, [client, creditClient, gate]);
  // No effect cleanup clears the capability: StrictMode rehearses cleanups on
  // mount. Leaving the private flow or the document explicitly clears memory.
  useLayoutEffect(() => { if (!isBookingFlowPath(pathname) || /^\/book\/invitation(?:\/|$)/i.test(pathname)) clear(); }, [pathname, clear]);
  useEffect(() => { window.addEventListener('pagehide', clear); return () => window.removeEventListener('pagehide', clear); }, [clear]);
  const value = useMemo(() => ({ hasCapability, client, creditClient, gate, creditEnabled: import.meta.env.VITE_PRIVATE_BOOKING_CREDIT_ENABLED === 'true', clear }), [hasCapability, client, creditClient, gate, clear]);
  return /^\/book\/invitation(?:\/|$)/i.test(pathname)?children:<FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { isBookingFlowPath } from './booking-privacy';
import { familyCapabilityMemory } from './family-capability';
import { createFamilyClient } from './family-client';
import { FamilyContext } from './family-context';

export default function FamilyCapabilityProvider({ children }) {
  const { pathname } = useLocation();
  const hasCapability = useSyncExternalStore(familyCapabilityMemory.subscribe, familyCapabilityMemory.has, () => false);
  const [client] = useState(() => createFamilyClient());
  const clear = useCallback(() => { client.clear(); familyCapabilityMemory.clear(); }, [client]);
  // No effect cleanup clears the capability: StrictMode rehearses cleanups on
  // mount. Leaving the private flow or the document explicitly clears memory.
  useLayoutEffect(() => { if (!isBookingFlowPath(pathname)) clear(); }, [pathname, clear]);
  useEffect(() => { window.addEventListener('pagehide', clear); return () => window.removeEventListener('pagehide', clear); }, [clear]);
  const value = useMemo(() => ({ hasCapability, client, clear }), [hasCapability, client, clear]);
  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

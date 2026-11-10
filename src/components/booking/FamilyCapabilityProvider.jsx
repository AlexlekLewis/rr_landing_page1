import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isBookingFlowPath } from './booking-privacy';
import { familyCapabilityMemory } from './family-capability';
import { createFamilyClient } from './family-client';
import { FamilyContext } from './family-context';
import { createCreditClient } from './credit-client';
import { createFamilyOperationGate } from './family-operation-gate';
import { createRecoveryClient, recoveryEnabled } from './recovery/recovery-client';
import { createRecoveryOperation } from './recovery/recovery-operation';

export default function FamilyCapabilityProvider({ children }) {
  const { pathname } = useLocation();
  const hasCapability = useSyncExternalStore(familyCapabilityMemory.subscribe, familyCapabilityMemory.has, () => false);
  const [{ client, creditClient, gate, recovery }] = useState(() => {
    const gate = createFamilyOperationGate();
    return { gate, client: createFamilyClient(import.meta.env, globalThis.fetch, familyCapabilityMemory, gate), creditClient: createCreditClient(import.meta.env, globalThis.fetch, familyCapabilityMemory, gate), recovery: createRecoveryOperation(createRecoveryClient(import.meta.env, globalThis.fetch, familyCapabilityMemory, gate), gate) };
  });
  const recoveryState = useSyncExternalStore(recovery.subscribe, recovery.getSnapshot, recovery.getSnapshot);
  const clear = useCallback(() => { if (recovery.locked()) return false; recovery.close(); client.clear(); creditClient.clear(); gate.clear(); familyCapabilityMemory.clear(); return true; }, [client, creditClient, gate, recovery]);
  // No effect cleanup clears the capability: StrictMode rehearses cleanups on
  // mount. Leaving the private flow or the document explicitly clears memory.
  useLayoutEffect(() => { if (!recovery.locked() && (!isBookingFlowPath(pathname) || /^\/book\/invitation(?:\/|$)/i.test(pathname))) clear(); }, [pathname, clear, recovery]);
  useEffect(() => { const leave = () => { recovery.dispose(); clear(); }; window.addEventListener('pagehide', leave); return () => window.removeEventListener('pagehide', leave); }, [clear, recovery]);
  useEffect(() => { const warn = event => { if (recovery.locked()) { event.preventDefault(); event.returnValue = ''; } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [recovery]);
  const value = useMemo(() => ({ hasCapability, client, creditClient, gate, recovery, recoveryEnabled: recoveryEnabled(import.meta.env), creditEnabled: import.meta.env.VITE_PRIVATE_BOOKING_CREDIT_ENABLED === 'true', clear }), [hasCapability, client, creditClient, gate, recovery, clear]);
  if (recoveryState.phase === 'unknown' && recovery.locked() && pathname !== '/booking') return <Navigate to="/booking" replace />;
  return /^\/book\/invitation(?:\/|$)/i.test(pathname)?children:<FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

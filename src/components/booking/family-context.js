import { createContext, useContext } from 'react';

export const FamilyContext = createContext(null);
export function useFamilyService() {
  const service = useContext(FamilyContext);
  if (!service) throw new Error('Private coaching context unavailable');
  return service;
}

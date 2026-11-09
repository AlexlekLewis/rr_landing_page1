import React, { useLayoutEffect, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { renewalMemory } from './renewal-memory';
export default function RenewalPrivacyBoundary({ children }) {
  const { pathname } = useLocation(), navigate = useNavigate();
  useLayoutEffect(() => { if (/^\/book\/renewal(?:\/|$)/i.test(pathname)) return; if (renewalMemory.locked()) { navigate('/book/renewal', { replace: true }); return; } renewalMemory.clear(); }, [pathname, navigate]);
  useEffect(() => { const clear = () => renewalMemory.clear(); window.addEventListener('pagehide', clear); return () => window.removeEventListener('pagehide', clear); }, []);
  return children;
}

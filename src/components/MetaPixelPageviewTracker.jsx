import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/metaPixel';

/**
 * Meta Pixel PageView for single-page-app navigation.
 * index.html's base code fires the FIRST PageView on load; React Router route
 * changes don't reload the page, so without this every page after the first
 * is invisible to Meta. Fires only when the pathname actually changes from the
 * last one seen — never for the first page (no double count, including under
 * React StrictMode's dev double-run of effects).
 */
export default function MetaPixelPageviewTracker() {
  const { pathname } = useLocation();
  const last = useRef(null);

  useEffect(() => {
    if (last.current === null || last.current === pathname) {
      last.current = pathname;
      return;
    }
    last.current = pathname;
    trackPageView();
  }, [pathname]);

  return null;
}

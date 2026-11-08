import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPixelPageView } from '../lib/metaPixel';

/**
 * Loads the Meta Pixel and sends PageView on each page change, except on the under-13
 * program routes listed in src/lib/metaPixel.js (there it does nothing).
 */
export default function MetaPixelTracker() {
    const { pathname } = useLocation();
    useEffect(() => {
        try { trackPixelPageView(); } catch { /* never let analytics break the page */ }
    }, [pathname]);
    return null;
}

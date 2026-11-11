import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPrivateBooking } from './private-booking-pixel';
// A Pixel already loaded by another page has its own automatic listeners. A
// clean private document is safer than queuing consent and later flushing it.
export default function PrivateBookingEntry({ children }) {
  const { pathname } = useLocation();
  const [needsDocument] = useState(() => typeof globalThis.fbq === 'function');
  useEffect(() => {
    if (needsDocument) globalThis.location.replace(globalThis.location.href);
    else trackPrivateBooking('PageView');
  }, [needsDocument, pathname]);
  return needsDocument ? <p className="min-h-screen bg-white p-8" role="status">Opening private coaching…</p> : children;
}

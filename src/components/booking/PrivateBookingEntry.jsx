import React, { useEffect, useState } from 'react';
// A Pixel already loaded by another page has its own automatic listeners. A
// clean private document is safer than queuing consent and later flushing it.
export default function PrivateBookingEntry({ children }) {
  const [needsDocument] = useState(() => typeof globalThis.fbq === 'function');
  useEffect(() => { if (needsDocument) globalThis.location.replace(globalThis.location.href); }, [needsDocument]);
  return needsDocument ? <p className="min-h-screen bg-white p-8" role="status">Opening private coaching…</p> : children;
}

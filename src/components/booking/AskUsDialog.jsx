import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
const candidates = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex]';
export default function AskUsDialog({ onClose, children }) {
  const container = useRef(null);
  useLayoutEffect(() => {
    const dialog = container.current, previousFocus = document.activeElement;
    const background = [...document.body.children].filter(node => !node.contains(dialog));
    const attributes = background.map(node => ({ node, inert: node.getAttribute('inert'), hidden: node.getAttribute('aria-hidden') }));
    for (const { node } of attributes) { node.setAttribute('inert', ''); node.setAttribute('aria-hidden', 'true'); }
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const initial = () => dialog.querySelector('[data-dialog-initial-focus]') ?? dialog;
    const focusables = () => [...dialog.querySelectorAll(candidates)].filter(node => node.tabIndex >= 0 && !node.hidden && !node.closest('[aria-hidden="true"],[hidden]'));
    initial().focus({ preventScroll: true });
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusables(), first = items[0], last = items.at(-1), current = document.activeElement;
      if (!first) { event.preventDefault(); initial().focus(); }
      else if (event.shiftKey && (current === first || current === initial() || !dialog.contains(current))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (current === last || !dialog.contains(current))) { event.preventDefault(); first.focus(); }
    };
    const focusin = event => { if (!dialog.contains(event.target)) initial().focus({ preventScroll: true }); };
    document.addEventListener('keydown', keydown, true); document.addEventListener('focusin', focusin);
    return () => {
      document.removeEventListener('keydown', keydown, true); document.removeEventListener('focusin', focusin);
      for (const { node, inert, hidden } of attributes) { if (inert === null) node.removeAttribute('inert'); else node.setAttribute('inert', inert); if (hidden === null) node.removeAttribute('aria-hidden'); else node.setAttribute('aria-hidden', hidden); }
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);
  return createPortal(<div className="booking-dialog" onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={container} role="dialog" aria-modal="true" aria-label="Ask the Academy about private coaching" tabIndex={-1}>{children}</div></div>, document.body);
}

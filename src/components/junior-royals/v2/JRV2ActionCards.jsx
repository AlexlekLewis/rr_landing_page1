import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import './jrV2.css';

// ─────────────────────────────────────────────────────────────
// The four core elements as action cards (Alex, 11 Oct 2026): a short summary on
// the page, the detail one hover or tap away, and a shimmer so they read as
// things to open.
//
// - Computer (a pointer that can hover): pointing at a card opens its panel
//   under the row of cards. Clicking a card, or anything inside the panel, pins
//   it open until Close, Esc or a click outside.
// - Phone or tablet (no hover): tapping a card opens a full-screen sheet with
//   Previous / Next. 80% of our visitors are here, so nothing depends on hover.
// - Keyboard: cards are buttons; focus opens the panel, Enter pins it, Esc closes.
// ─────────────────────────────────────────────────────────────

const useCanHover = () => {
    const [can, setCan] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
        const on = () => setCan(mq.matches);
        on();
        mq.addEventListener?.('change', on);
        return () => mq.removeEventListener?.('change', on);
    }, []);
    return can;
};

// Full-screen sheet for phones.
const Sheet = ({ items, index, onClose, onNav }) => {
    const it = items[index];
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    const onCloseRef = useRef(onClose);
    useEffect(() => { onCloseRef.current = onClose; });
    useEffect(() => {
        const opener = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKey = (e) => { if (e.key === 'Escape' && !document.querySelector('[data-jr-stage-modal]')) onCloseRef.current(); };
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; opener?.focus?.(); };
    }, []);
    useEffect(() => { panelRef.current?.scrollTo?.(0, 0); }, [index]);
    const prev = items[index - 1];
    const next = items[index + 1];
    return createPortal(
        <div className="fixed inset-0 z-[55] flex items-end justify-center">
            <div className="absolute inset-0 bg-rr-dark/80" onClick={onClose} aria-hidden="true" />
            <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="jr-sheet-title"
                className="jr-pop relative w-full h-[100dvh] overflow-y-auto bg-white">
                <div className="px-5 pt-5 pb-6" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-white text-xl font-bold">{it.n} of {items.length}</p>
                            <h2 id="jr-sheet-title" className="text-white text-3xl font-black uppercase leading-none mt-1">{it.title}</h2>
                        </div>
                        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close"
                            className="shrink-0 w-11 h-11 rounded-full bg-white text-rr-dark flex items-center justify-center">
                            <X className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                </div>
                <div className="px-5 py-6">{it.content}</div>
                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-between gap-2">
                    {prev ? (
                        <button type="button" onClick={() => onNav(-1)} className="inline-flex items-center gap-1.5 min-h-[44px] px-2 font-black text-xs uppercase tracking-wider text-rr-dark text-left">
                            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" /> Back
                        </button>
                    ) : <span />}
                    <button type="button" onClick={onClose} className="min-h-[44px] px-4 text-sm font-bold text-rr-charcoal underline underline-offset-4">Close</button>
                    {next ? (
                        <button type="button" onClick={() => onNav(1)} className="inline-flex items-center gap-1.5 min-h-[44px] px-2 font-black text-xs uppercase tracking-wider text-rr-dark text-right">
                            Next <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                        </button>
                    ) : <span />}
                </div>
            </div>
        </div>,
        document.body,
    );
};

// items: [{ id, n, title, summary, Icon, content }]
export const ActionCards = ({ items }) => {
    const canHover = useCanHover();
    const [active, setActive] = useState(null);   // index, or null
    const [pinned, setPinned] = useState(false);
    const wrapRef = useRef(null);
    const timer = useRef(null);
    const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
    const close = () => { clear(); setActive(null); setPinned(false); };

    // Pinned panel: Esc or a click outside closes it (unless a stage pop-up is open on top).
    useEffect(() => {
        if (active === null || !canHover) return undefined;
        const stageOpen = () => Boolean(document.querySelector('[data-jr-stage-modal]'));
        const onKey = (e) => { if (e.key === 'Escape' && !stageOpen()) close(); };
        const onDown = (e) => { if (pinned && !stageOpen() && wrapRef.current && !wrapRef.current.contains(e.target)) close(); };
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onDown);
        return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
    });
    useEffect(() => clear, []);

    const hoverIn = (i) => { if (!canHover) return; clear(); timer.current = setTimeout(() => setActive(i), 110); };
    const hoverOut = () => { if (!canHover || pinned) return; clear(); timer.current = setTimeout(() => setActive(null), 260); };
    const click = (i) => {
        clear();
        if (!canHover) { setActive(i); setPinned(true); return; }
        if (pinned && active === i) { close(); return; }
        setActive(i); setPinned(true);
        // Clicked to keep it open: bring the cards and the panel into view.
        requestAnimationFrame(() => {
            const top = wrapRef.current?.getBoundingClientRect().top ?? 0;
            if (top > 140 || top < 90) window.scrollBy({ top: top - 124, behavior: 'smooth' });
        });
    };

    const hint = canHover ? 'Hover or click to open' : 'Tap to open';
    const it = active !== null ? items[active] : null;

    return (
        <div ref={wrapRef} className="relative" onMouseLeave={hoverOut} onMouseEnter={() => { if (canHover && active !== null) clear(); }}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((c, i) => {
                    const on = active === i;
                    return (
                        <li key={c.id}>
                            <button type="button" id={c.id}
                                onMouseEnter={() => hoverIn(i)} onFocus={() => { if (canHover) setActive(i); }} onClick={() => click(i)}
                                aria-haspopup="dialog" aria-expanded={on}
                                style={{ backgroundImage: 'var(--image-gradient-rr)', '--jr-delay': `${i * 0.45}s` }}
                                className={`jr-shimmer w-full h-full text-left rounded-2xl p-4 min-h-[9.5rem] flex flex-col transition-transform duration-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-rr-pink ${on ? '-translate-y-1 ring-4 ring-rr-pink' : 'hover:-translate-y-1'}`}>
                                <span className="flex items-center justify-between">
                                    <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                                        <c.Icon className="w-5 h-5 text-rr-blue" aria-hidden="true" />
                                    </span>
                                    <span className="text-white text-3xl font-black leading-none" aria-hidden="true">{c.n}</span>
                                </span>
                                <span className="block text-white text-lg font-black uppercase leading-tight mt-3">{c.title}</span>
                                <span className="block text-white text-sm font-semibold leading-snug mt-1.5">{c.summary}</span>
                                <span className="mt-auto pt-3 inline-flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest">
                                    <span className="relative flex w-2.5 h-2.5">
                                        <span className="jr-pulse absolute inset-0 rounded-full bg-white" aria-hidden="true" />
                                        <span className="relative w-2.5 h-2.5 rounded-full bg-white" aria-hidden="true" />
                                    </span>
                                    {hint}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Computer: the panel under the cards */}
            {canHover && it && (
                <div role="dialog" aria-label={it.title} onClickCapture={() => setPinned(true)}
                    className="jr-pop absolute left-0 right-0 top-full z-30 pt-3">
                    <div className="rounded-2xl bg-white border-2 border-rr-dark max-h-[78vh] overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
                            <p className="text-xl font-black uppercase text-rr-dark"><span className="text-rr-pink mr-2">{it.n}</span>{it.title}</p>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-rr-charcoal">{pinned ? 'Pinned open' : 'Click to keep open'}</span>
                                <button type="button" onClick={close} aria-label="Close" className="w-10 h-10 rounded-full bg-rr-dark text-white flex items-center justify-center">
                                    <X className="w-5 h-5" strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-6">{it.content}</div>
                    </div>
                </div>
            )}

            {/* Phone: a full-screen sheet */}
            {!canHover && it && (
                <Sheet items={items} index={active} onClose={close}
                    onNav={(d) => setActive((x) => Math.min(items.length - 1, Math.max(0, x + d)))} />
            )}
        </div>
    );
};

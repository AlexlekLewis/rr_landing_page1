import React, { useEffect } from 'react';
import { OPEN_DAYS } from './openDaysData';

// Home-page modal announcing all three open training days to every visitor.
// Mickleham sits first (soonest — this Sunday) and is visually highlighted. Each
// row is a full-page <a href> to its landing page so the Meta Pixel PageView fires.
const OpenDaysModal = ({ open, onClose }) => {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Open Training Days">
            <div className="absolute inset-0 bg-rr-dark/80 backdrop-blur-sm" onClick={onClose} />

            <div
                className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[92vh] overflow-y-auto"
                style={{ background: 'linear-gradient(175deg,#00112f 0%,#0a1f5c 34%,#3a1566 66%,#8f1a6e 100%)' }}
            >
                {/* glows */}
                <div className="absolute -top-20 -right-16 w-64 h-64 bg-rr-pink/25 rounded-full blur-[90px] pointer-events-none" />

                {/* close */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* header */}
                <div className="relative px-6 pt-8 pb-5 text-center">
                    <img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" className="h-11 mx-auto brightness-0 invert mb-5" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-rr-light-pink mb-2">You're invited · Free entry</p>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">Open Training Days</h2>
                    <p className="text-white/70 font-medium text-sm mt-3 max-w-sm mx-auto">
                        Come and try at our academy centres — all skill levels, boys and girls. Pick your closest day below.
                    </p>
                </div>

                {/* centre rows */}
                <div className="px-4 sm:px-6 pb-4 space-y-3">
                    {OPEN_DAYS.map((d) => (
                        <a
                            key={d.slug}
                            href={`/PGP2026/${d.slug}`}
                            className={`group block rounded-2xl px-5 py-4 transition-all duration-300 ${d.highlight
                                ? 'bg-rr-pink/15 border border-rr-pink/50 hover:bg-rr-pink/25'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none">{d.name}</h3>
                                        {d.badge && (
                                            <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-white bg-rr-pink rounded-full px-2 py-0.5">{d.badge}</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-bold text-white/90">{d.date} · {d.time}</p>
                                    <p className="text-xs font-medium text-white/55 mt-0.5 truncate">{d.venue} · {d.region}</p>
                                </div>
                                <span className="shrink-0 w-9 h-9 rounded-full bg-white/10 group-hover:bg-rr-pink flex items-center justify-center text-white transition-colors">
                                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                <p className="px-6 pb-7 pt-1 text-center text-[11px] font-medium text-white/40">
                    Free to attend · Junior Royals (5–15) &amp; Elite trials · register on each page
                </p>
            </div>
        </div>
    );
};

export default OpenDaysModal;

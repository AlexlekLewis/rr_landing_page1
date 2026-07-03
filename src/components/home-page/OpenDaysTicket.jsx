import React from 'react';

// Ticket-style banner that appears under the nav once the visitor closes the
// OpenDaysModal. Rendered in normal flow directly beneath PowerGameTopBanner (so
// it sits "under the nav", like that banner). A horizontal ticket — pink stub +
// dashed perforation + white body — clicking it re-opens the modal; the × dismisses
// it for the session. Notches are punched via a CSS mask (graceful fallback).
const NOTCH = {
    WebkitMaskImage:
        'radial-gradient(circle 8px at 58px 0, transparent 98%, #000 100%), radial-gradient(circle 8px at 58px 100%, transparent 98%, #000 100%)',
    WebkitMaskComposite: 'source-in',
    maskImage:
        'radial-gradient(circle 8px at 58px 0, transparent 98%, #000 100%), radial-gradient(circle 8px at 58px 100%, transparent 98%, #000 100%)',
    maskComposite: 'intersect',
};

const OpenDaysTicket = ({ show, onOpen, onDismiss }) => {
    if (!show) return null;
    return (
        <div className="relative w-full bg-rr-dark px-4 py-3 flex items-center justify-center print:hidden">
            <style>{`
              @keyframes odTicketGlow { 0%,100% { box-shadow: 0 6px 20px rgba(0,0,0,0.35), 0 0 0 0 rgba(225,31,143,0); } 50% { box-shadow: 0 6px 20px rgba(0,0,0,0.35), 0 0 20px 2px rgba(225,31,143,0.65); } }
              @media (prefers-reduced-motion: reduce) { .od-ticket { animation: none !important; } }
            `}</style>

            <button
                onClick={onOpen}
                aria-label="See open training day dates"
                className="od-ticket group flex items-stretch overflow-hidden rounded-xl text-left w-full max-w-2xl"
                style={{ ...NOTCH, animation: 'odTicketGlow 2.4s ease-in-out infinite' }}
            >
                {/* pink stub */}
                <span className="flex items-center justify-center px-4 shrink-0" style={{ background: 'linear-gradient(160deg,#E11F8F,#a3126b)' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a2 2 0 012-2h12a2 2 0 012 2 2 2 0 000 4 2 2 0 010 4 2 2 0 01-2 2H6a2 2 0 01-2-2 2 2 0 000-4 2 2 0 010-4z" />
                    </svg>
                </span>
                {/* perforation */}
                <span className="w-px border-l-2 border-dashed border-slate-300 self-stretch" />
                {/* body */}
                <span className="flex-1 flex items-center justify-between gap-3 bg-white pl-4 pr-4 py-2.5">
                    <span className="min-w-0">
                        <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-rr-pink leading-none mb-1">Open Training Days · Free</span>
                        <span className="block text-sm sm:text-base font-black text-rr-dark uppercase tracking-tight leading-none truncate">
                            Mickleham this Sunday <span className="text-rr-charcoal/60">· +2 more</span>
                        </span>
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-1.5 bg-rr-pink group-hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-[10px] sm:text-xs px-3 sm:px-4 py-2 rounded-full transition-colors">
                        See dates
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </span>
                </span>
            </button>

            {/* dismiss */}
            <button
                onClick={onDismiss}
                aria-label="Dismiss"
                className="ml-2 shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 transition-colors"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export default OpenDaysTicket;

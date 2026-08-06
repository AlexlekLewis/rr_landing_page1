import React from 'react';
import { ANNOUNCEMENTS } from './openDaysData';

// News-style ticker under the nav announcing our current programs. Shows once the
// visitor closes the OpenDaysModal (rendered in flow beneath HomeTopBanner).
// A fixed "WHAT'S ON" label + a seamless right-to-left crawl (two identical copies
// so it loops without a seam) + See More CTA + dismiss. Clicking it re-opens the
// modal. CSS keyframes (pauses on hover / prefers-reduced-motion).

const SEP = (
    <span aria-hidden="true" className="mx-4 text-rr-pink/70 font-black">✦</span>
);

const TickerContent = () => (
    <span className="inline-flex items-center whitespace-nowrap align-middle">
        <span className="font-black uppercase tracking-wide text-rr-pink">Now on at Rajasthan Royals Academy Melbourne</span>
        {SEP}
        {ANNOUNCEMENTS.map((d, i) => (
            <span key={d.key} className="inline-flex items-center">
                <span className="font-black uppercase tracking-wide text-white">{d.name}</span>
                <span className="mx-2 font-semibold text-white/75">{d.tag}</span>
                {i < ANNOUNCEMENTS.length - 1 ? SEP : null}
            </span>
        ))}
        {SEP}
        <span className="font-bold uppercase tracking-wide text-white/90">Register now — pick your program</span>
        {SEP}
    </span>
);

const OpenDaysTicket = ({ show, onOpen, onDismiss }) => {
    if (!show) return null;
    return (
        <div className="relative w-full flex items-stretch border-y border-rr-pink/30 print:hidden" style={{ background: 'linear-gradient(90deg,#0a1230,#111921)' }}>
            <style>{`
              @keyframes odTickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              @keyframes odLabelPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
              .od-ticker-track { animation: odTickerScroll 32s linear infinite; }
              .od-ticker-viewport:hover .od-ticker-track { animation-play-state: paused; }
              @media (prefers-reduced-motion: reduce) { .od-ticker-track { animation: none !important; } .od-label-dot { animation: none !important; } }
            `}</style>

            {/* fixed label */}
            <button
                onClick={onOpen}
                className="shrink-0 flex items-center gap-2 px-3 sm:px-4 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs"
                style={{ background: 'linear-gradient(160deg,#E11F8F,#a3126b)' }}
                aria-label="What's on at the academy"
            >
                <span className="od-label-dot w-1.5 h-1.5 rounded-full bg-white" style={{ animation: 'odLabelPulse 1.4s ease-in-out infinite' }} />
                What's On
            </button>

            {/* scrolling crawl */}
            <button
                onClick={onOpen}
                aria-label="See our current programs"
                className="od-ticker-viewport group relative flex-1 overflow-hidden cursor-pointer"
            >
                <div className="od-ticker-track flex w-max items-center py-2 text-sm">
                    <TickerContent />
                    <TickerContent />
                </div>
                {/* edge fades */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8" style={{ background: 'linear-gradient(90deg,#0d1428,transparent)' }} />
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8" style={{ background: 'linear-gradient(270deg,#111921,transparent)' }} />
            </button>

            {/* CTA */}
            <button
                onClick={onOpen}
                className="hidden sm:inline-flex shrink-0 items-center gap-1.5 my-1.5 mr-1.5 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-[11px] px-4 rounded-full transition-colors"
            >
                See more
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* dismiss */}
            <button
                onClick={onDismiss}
                aria-label="Dismiss"
                className="shrink-0 w-9 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export default OpenDaysTicket;

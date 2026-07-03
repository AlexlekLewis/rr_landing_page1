import React from 'react';

// Ticket-style reminder that appears once the visitor closes the OpenDaysModal.
// Fixed bottom-left (clears the full-width sticky CTA and the bottom-right Text-Us
// button). Clicking it re-opens the modal; the little × dismisses it for the session.
// Shaped like a ticket: pink stub + dashed perforation + dark body, with notch
// cut-outs punched via a CSS mask (degrades gracefully to a plain rounded ticket).
const NOTCH = {
    WebkitMaskImage:
        'radial-gradient(circle 7px at 52px 0, transparent 98%, #000 100%), radial-gradient(circle 7px at 52px 100%, transparent 98%, #000 100%)',
    WebkitMaskComposite: 'source-in',
    maskImage:
        'radial-gradient(circle 7px at 52px 0, transparent 98%, #000 100%), radial-gradient(circle 7px at 52px 100%, transparent 98%, #000 100%)',
    maskComposite: 'intersect',
};

const OpenDaysTicket = ({ show, onOpen, onDismiss }) => {
    if (!show) return null;
    return (
        <div className="fixed bottom-24 left-4 z-40 print:hidden">
            <style>{`
              @keyframes ticketGlow { 0%,100% { box-shadow: 0 8px 24px rgba(0,0,0,0.35), 0 0 0 0 rgba(225,31,143,0); } 50% { box-shadow: 0 8px 24px rgba(0,0,0,0.35), 0 0 22px 2px rgba(225,31,143,0.7); } }
              @media (prefers-reduced-motion: reduce) { .od-ticket { animation: none !important; } }
            `}</style>
            <div className="relative">
                {/* dismiss */}
                <button
                    onClick={onDismiss}
                    aria-label="Dismiss"
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-rr-dark text-white border border-white/25 flex items-center justify-center shadow-lg hover:bg-black transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <button
                    onClick={onOpen}
                    className="od-ticket flex items-stretch overflow-hidden rounded-xl text-left"
                    style={{ ...NOTCH, animation: 'ticketGlow 2.2s ease-in-out infinite' }}
                >
                    {/* pink stub */}
                    <span className="flex items-center justify-center px-3 shrink-0" style={{ background: 'linear-gradient(160deg,#E11F8F,#a3126b)' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8a2 2 0 012-2h12a2 2 0 012 2 2 2 0 000 4 2 2 0 010 4 2 2 0 01-2 2H6a2 2 0 01-2-2 2 2 0 000-4 2 2 0 010-4z" />
                        </svg>
                    </span>
                    {/* perforation */}
                    <span className="w-px border-l-2 border-dashed border-white/25 self-stretch" />
                    {/* body */}
                    <span className="flex flex-col justify-center pl-3 pr-4 py-2.5 bg-rr-dark">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rr-light-pink leading-none mb-1">Open Training Days</span>
                        <span className="text-sm font-black text-white uppercase tracking-tight leading-none">Mickleham this Sun<span className="text-white/50"> +2 more</span></span>
                        <span className="text-[10px] font-bold text-white/60 mt-1 leading-none">Tap for dates &amp; venues →</span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default OpenDaysTicket;

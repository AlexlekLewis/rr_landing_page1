import React from 'react';

// Prominent special-announcement bar. Rendered directly AFTER <Navbar/> — which is
// position:fixed — so the outer div carries top padding (pt-20 md:pt-28) to clear
// the fixed navbar, and its pink gradient fills that space so it reads seamlessly
// from under the (also-pink) navbar. Mirrors the site's PowerGameTopBanner pattern.
//
// Animated to draw the eye: a light shimmer sweeps across, the bottom edge glows/
// breathes against the dark hero below, and the CTA pulses. All CSS keyframes (not
// JS/framer) so they run even where requestAnimationFrame is throttled.
const AnnouncementBanner = ({ label = 'Special Announcement', text, cta, ctaTarget }) => {
    const onCta = () => {
        const el = ctaTarget && document.getElementById(ctaTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div className="relative overflow-hidden pt-20 md:pt-28" style={{ background: 'linear-gradient(90deg,#E11F8F 0%,#a3126b 100%)' }}>
            <style>{`
              @keyframes annShimmer { 0% { transform: translateX(-130%) skewX(-18deg); } 55%, 100% { transform: translateX(360%) skewX(-18deg); } }
              @keyframes annBottomGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
              @keyframes annCtaGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); } 50% { box-shadow: 0 0 20px 2px rgba(255,255,255,0.75); } }
              @media (prefers-reduced-motion: reduce) {
                .ann-shimmer, .ann-bottom-glow, .ann-cta { animation: none !important; }
              }
            `}</style>

            {/* moving shimmer sweep */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="ann-shimmer absolute top-0 bottom-0 w-1/4"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)', animation: 'annShimmer 3.4s ease-in-out infinite' }}
                />
            </div>

            {/* pulsing glow line along the bottom edge (shows against the dark hero) */}
            <div
                aria-hidden="true"
                className="ann-bottom-glow pointer-events-none absolute left-0 right-0 bottom-0 h-[2px]"
                style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 0 14px 1px rgba(255,255,255,0.8)', animation: 'annBottomGlow 2s ease-in-out infinite' }}
            />

            <div className="relative max-w-5xl mx-auto px-5 py-3 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1.5 text-center">
                <span className="inline-flex items-center gap-2 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/90">{label}</span>
                </span>
                <p className="text-xs md:text-sm font-bold text-white leading-tight">{text}</p>
                {cta && (
                    <button
                        onClick={onCta}
                        className="ann-cta shrink-0 bg-white text-rr-pink font-black uppercase tracking-widest text-[11px] px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors"
                        style={{ animation: 'annCtaGlow 2s ease-in-out infinite' }}
                    >
                        {cta}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AnnouncementBanner;

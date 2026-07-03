import React from 'react';

// Prominent special-announcement bar. Rendered directly AFTER <Navbar/> — which is
// position:fixed — so the outer div carries top padding (pt-20 md:pt-28) to clear
// the fixed navbar, and its pink gradient fills that space so it reads seamlessly
// from under the (also-pink) navbar. Mirrors the site's PowerGameTopBanner pattern.
const AnnouncementBanner = ({ label = 'Special Announcement', text, cta, ctaTarget }) => {
    const onCta = () => {
        const el = ctaTarget && document.getElementById(ctaTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div className="relative overflow-hidden pt-20 md:pt-28" style={{ background: 'linear-gradient(90deg,#E11F8F 0%,#a3126b 100%)' }}>
            <div className="max-w-5xl mx-auto px-5 py-3 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-center">
                <span className="inline-flex items-center gap-2 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/90">{label}</span>
                </span>
                <p className="text-xs md:text-sm font-bold text-white leading-tight">{text}</p>
                {cta && (
                    <button
                        onClick={onCta}
                        className="shrink-0 bg-white text-rr-pink font-black uppercase tracking-widest text-[11px] px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors"
                    >
                        {cta}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AnnouncementBanner;

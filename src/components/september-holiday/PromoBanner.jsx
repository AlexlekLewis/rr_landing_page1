import React from 'react';

// Scrolling marquee promo banner for the Early Bird offer — sits at the very top of the page.
const PromoBanner = () => {
    const item = (
        <span className="inline-flex items-center gap-3 px-8">
            <span className="text-white font-black uppercase tracking-widest text-xs md:text-sm">🏏 Early Bird — $299</span>
            <span className="text-white/60 font-bold text-xs md:text-sm">·</span>
            <span className="text-white font-bold uppercase tracking-wide text-xs md:text-sm">Ends 11pm Sunday 30 August</span>
            <span className="text-white/60 font-bold text-xs md:text-sm">·</span>
            <span className="text-white font-bold uppercase tracking-wide text-xs md:text-sm">Reverts to $330</span>
            <span className="text-white/60 font-bold text-xs md:text-sm">·</span>
            <span className="text-white font-black uppercase tracking-widest text-xs md:text-sm">Places Limited — Don't Miss Out</span>
        </span>
    );

    return (
        <div className="relative overflow-hidden py-2.5" style={{ background: 'linear-gradient(90deg, #E11F8F, #1226AA, #E11F8F)' }}>
            <style>{`
                @keyframes promo-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .promo-track {
                    display: inline-flex;
                    white-space: nowrap;
                    animation: promo-scroll 22s linear infinite;
                }
            `}</style>
            <div className="promo-track">
                {item}{item}{item}{item}{item}{item}
            </div>
        </div>
    );
};

export default PromoBanner;

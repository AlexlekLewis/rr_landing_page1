import React from 'react';

// Scrolling marquee promo banner for the Early Bird offer — sits at the very top of the page.
const PromoBanner = () => {
    const item = (
        <span className="inline-flex items-center gap-3 px-8">
            <span className="text-white font-black uppercase tracking-widest text-xs md:text-sm">🏏 Junior Royals Holiday Program — $330</span>
            <span className="text-white/60 font-bold text-xs md:text-sm">·</span>
            <span className="text-white font-bold uppercase tracking-wide text-xs md:text-sm">September / October School Holidays</span>
            <span className="text-white/60 font-bold text-xs md:text-sm">·</span>
            <span className="text-white font-bold uppercase tracking-wide text-xs md:text-sm">Secure Your Place Now</span>
            <span className="text-white/60 font-bold text-xs md:text-sm">·</span>
            <span className="text-white font-black uppercase tracking-widest text-xs md:text-sm">12 Hours Across 3 Days</span>
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

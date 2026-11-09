import React, { useRef, useState } from 'react';

// Shared carousel for /tours (photos and videos): a horizontal scroll-snap track
// you can swipe on a phone, with arrows, a progress bar and an "n / total" counter.

export const useCarousel = (total) => {
    const trackRef = useRef(null);
    const [index, setIndex] = useState(0);

    const step = () => {
        const track = trackRef.current;
        const first = track?.querySelector('[data-slide]');
        if (!first) return 0;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first.getBoundingClientRect().width + gap;
    };
    const onScroll = () => {
        const w = step();
        if (w) setIndex(Math.min(total - 1, Math.round(trackRef.current.scrollLeft / w)));
    };
    const slideBy = (d) => {
        const w = step();
        if (w) trackRef.current.scrollBy({ left: d * w, behavior: 'smooth' });
    };
    return { trackRef, index, onScroll, slideBy };
};

export const CarouselTrack = ({ carousel, children, label }) => (
    <div
        ref={carousel.trackRef}
        onScroll={carousel.onScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
        {children}
    </div>
);

export const CarouselControls = ({ carousel, total, prevLabel, nextLabel, dark = false, idPrefix }) => {
    if (total < 2) return null;
    const { index, slideBy } = carousel;
    return (
        <div className="mt-5 flex items-center gap-4">
            <button
                type="button"
                onClick={() => slideBy(-1)}
                disabled={index === 0}
                aria-label={prevLabel}
                data-cta={`${idPrefix}-prev`}
                className={`w-12 h-12 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors disabled:opacity-30 ${
                    dark ? 'border-white/25 hover:border-rr-pink text-white' : 'border-rr-dark/15 hover:border-rr-pink text-rr-dark'
                }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
                type="button"
                onClick={() => slideBy(1)}
                disabled={index >= total - 1}
                aria-label={nextLabel}
                data-cta={`${idPrefix}-next`}
                className="w-12 h-12 shrink-0 rounded-full bg-rr-pink hover:bg-rr-light-pink text-white flex items-center justify-center transition-colors disabled:opacity-30"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className={`flex-1 h-1 rounded-full overflow-hidden ${dark ? 'bg-white/15' : 'bg-slate-200'}`} aria-hidden="true">
                <div className="h-full bg-rr-pink rounded-full transition-all duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
            <span className={`text-xs font-black uppercase tracking-widest tabular-nums ${dark ? 'text-white' : 'text-rr-dark'}`} aria-live="polite">
                {index + 1} / {total}
            </span>
        </div>
    );
};

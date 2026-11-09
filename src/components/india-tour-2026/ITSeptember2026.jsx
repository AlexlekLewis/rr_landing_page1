import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ITSectionHeader from './ITSectionHeader';
import ITRegisterButton from './ITRegisterButton';
import { SEPT_2026_MEDIA } from './itMedia';
import { CAMP_PDF } from './itCopy';

// Our first tour, September 2026, told mostly in pictures: a few numbers, a photo
// and video carousel (swipe or arrows, tap to enlarge), and the day-by-day plan behind a toggle so
// it is there for parents who want it without making the page a wall of text.
// Add photos or videos in itMedia.js.

const Thumb = ({ m, onOpen, className = '' }) => (
    <button
        type="button"
        onClick={onOpen}
        className={`group relative block w-full h-full overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/50 ${className}`}
        aria-label={`Enlarge: ${m.caption || m.alt || 'tour photo'}`}
    >
        {m.type === 'video' ? (
            <>
                <video src={m.src} poster={m.poster} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-rr-pink/90 flex items-center justify-center shadow-xl">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                </span>
            </>
        ) : (
            <img
                src={m.src}
                alt={m.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        )}
        {m.caption && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rr-navy/90 to-transparent px-4 pt-10 pb-3 text-left text-xs md:text-sm text-white font-semibold">
                {m.caption}
            </span>
        )}
    </button>
);

const ITSeptember2026 = ({ copy }) => {
    const c = copy.september;
    const days = copy.pricing.itineraryDays;
    const [open, setOpen] = useState(null);
    const [showDays, setShowDays] = useState(false);
    const [slide, setSlide] = useState(0);
    const trackRef = useRef(null);
    const touchX = useRef(null);
    const total = SEPT_2026_MEDIA.length;
    const step = (d) => setOpen((i) => (i + d + total) % total);

    useEffect(() => {
        if (open === null) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(null);
            if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % total);
            if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + total) % total);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, total]);

    // Carousel: which slide is at the left edge, and move one slide at a time.
    const slideWidth = () => {
        const first = trackRef.current?.querySelector('[data-slide]');
        if (!first) return 0;
        const gap = parseFloat(getComputedStyle(trackRef.current).columnGap) || 0;
        return first.getBoundingClientRect().width + gap;
    };
    const onTrackScroll = () => {
        const w = slideWidth();
        if (w) setSlide(Math.min(total - 1, Math.round(trackRef.current.scrollLeft / w)));
    };
    const slideBy = (d) => {
        const w = slideWidth();
        if (w) trackRef.current.scrollBy({ left: d * w, behavior: 'smooth' });
    };

    const current = open === null ? null : SEPT_2026_MEDIA[open];

    return (
        <section className="py-20 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <ITSectionHeader eyebrow={c.eyebrow} heading={c.heading} accent={c.headingAccent} lead={c.lead} />

                {/* The tour in numbers */}
                <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                    {c.stats.map((s) => (
                        <div key={s.label} className="rounded-2xl bg-rr-navy px-5 py-5">
                            <dt className="sr-only">{s.label}</dt>
                            <dd>
                                <span className="block text-3xl md:text-4xl font-black text-rr-pink leading-none">{s.value}</span>
                                <span className="block mt-2 text-xs font-bold text-white/75 uppercase tracking-widest leading-snug">{s.label}</span>
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* Carousel: swipe on phones, arrows on desktop, tap a photo to enlarge.
                    Takes any number of photos (they come from the folder in itMedia.js). */}
                {total > 0 && (
                    <div className="mt-8" role="region" aria-roledescription="carousel" aria-label={c.carouselLabel}>
                        <div
                            ref={trackRef}
                            onScroll={onTrackScroll}
                            className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {SEPT_2026_MEDIA.map((m, i) => (
                                <div
                                    key={i}
                                    data-slide
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${i + 1} / ${total}`}
                                    className="snap-start shrink-0 w-[82%] sm:w-[48%] lg:w-[calc((100%-2rem)/3)] aspect-[3/4]"
                                >
                                    <Thumb m={m} onOpen={() => setOpen(i)} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => slideBy(-1)}
                                disabled={slide === 0}
                                aria-label={c.prevLabel}
                                data-cta="september-carousel-prev"
                                className="w-12 h-12 shrink-0 rounded-full border-2 border-rr-dark/15 hover:border-rr-pink text-rr-dark flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:border-rr-dark/15"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => slideBy(1)}
                                disabled={slide >= total - 1}
                                aria-label={c.nextLabel}
                                data-cta="september-carousel-next"
                                className="w-12 h-12 shrink-0 rounded-full bg-rr-pink hover:bg-rr-light-pink text-white flex items-center justify-center transition-colors disabled:opacity-30"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <div className="flex-1 h-1 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                                <div
                                    className="h-full bg-rr-pink rounded-full transition-all duration-300"
                                    style={{ width: `${((slide + 1) / total) * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-black text-rr-dark uppercase tracking-widest tabular-nums" aria-live="polite">
                                {slide + 1} / {total}
                            </span>
                        </div>
                    </div>
                )}

                {/* Day-by-day, on request */}
                <div className="mt-10">
                    <button
                        type="button"
                        onClick={() => setShowDays((v) => !v)}
                        aria-expanded={showDays}
                        aria-controls="sept-days"
                        data-cta="september-day-by-day"
                        className="inline-flex items-center gap-2 text-sm font-black text-rr-dark uppercase tracking-widest border-2 border-rr-dark/15 hover:border-rr-pink rounded-full px-6 py-3 transition-colors"
                    >
                        {showDays ? c.dayByDayHide : c.dayByDayShow}
                        <svg className={`w-4 h-4 transition-transform ${showDays ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <AnimatePresence initial={false}>
                        {showDays && (
                            <motion.div
                                id="sept-days"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="mt-6 text-sm md:text-base text-rr-charcoal font-medium max-w-2xl">{c.dayByDayLead}</p>
                                <ol className="mt-6">
                                    {days.map((d, i) => (
                                        <li key={d.when} className="grid grid-cols-[auto_1fr] gap-x-5">
                                            <div className="flex flex-col items-center">
                                                <span className={`w-3 h-3 rounded-full shrink-0 mt-2 ${i === 0 || i === days.length - 1 ? 'bg-slate-300' : 'bg-rr-pink'}`} />
                                                {i < days.length - 1 && <span className="w-px flex-1 bg-slate-200 my-1" />}
                                            </div>
                                            <div className="pb-7">
                                                <p className="text-[11px] font-bold text-rr-charcoal/60 uppercase tracking-widest">{d.when}</p>
                                                <h3 className="text-base font-black text-rr-dark uppercase tracking-wide mt-1">{d.title}</h3>
                                                <p className="text-sm text-rr-charcoal font-medium leading-relaxed mt-1 max-w-2xl">{d.body}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                                {CAMP_PDF && (
                                    <a href={CAMP_PDF.href} download={CAMP_PDF.filename} data-cta="september-download-pdf" className="inline-block text-sm font-bold text-rr-pink uppercase tracking-widest">
                                        {copy.hero.downloadLabel} ({CAMP_PDF.sizeLabel})
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-10">
                    <ITRegisterButton label={copy.hero.cta} id="september-register" />
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {current && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label={current.caption || current.alt}
                        onClick={() => setOpen(null)}
                        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                        onTouchEnd={(e) => {
                            if (touchX.current === null) return;
                            const dx = e.changedTouches[0].clientX - touchX.current;
                            touchX.current = null;
                            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
                        }}
                    >
                        <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                            {current.type === 'video' ? (
                                <video key={open} src={current.src} poster={current.poster} controls autoPlay playsInline className="w-full max-h-[80vh] rounded-xl bg-black" />
                            ) : (
                                <img src={current.src} alt={current.alt} className="w-full max-h-[80vh] object-contain rounded-xl" />
                            )}
                            <figcaption className="mt-3 text-center text-sm text-white/80 font-medium">
                                {current.caption && <span className="block">{current.caption}</span>}
                                {total > 1 && <span className="block mt-1 text-xs text-white/50 font-bold tracking-widest">{open + 1} / {total}</span>}
                            </figcaption>
                        </figure>
                        {total > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); step(-1); }}
                                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center"
                                    aria-label={c.prevLabel}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); step(1); }}
                                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center"
                                    aria-label={c.nextLabel}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={() => setOpen(null)}
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                            aria-label={c.closeLabel}
                            autoFocus
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ITSeptember2026;

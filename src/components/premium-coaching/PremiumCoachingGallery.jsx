import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';
import { PHOTOS } from './premiumCoachingMedia';

// Photo carousel, the same one as /junior-royals and /tours (Andy, 13 Nov 2026: "photos
// need to be in a carousel option like all of the other recent pages"). Swipe on a phone,
// arrows + progress bar + "n / total", three across on desktop. Tap a photo for full
// screen (arrows, swipe, Esc). Photos and captions: PHOTOS in premiumCoachingMedia.js.

const MotionDiv = motion.div;

const Lightbox = ({ index, onClose, onStep }) => {
    const touchX = useRef(null);
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onStep(1);
            if (e.key === 'ArrowLeft') onStep(-1);
        };
        window.addEventListener('keydown', onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
    }, [onClose, onStep]);
    const p = PHOTOS[index];
    const btn = 'absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center';
    return (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-rr-dark/95 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label={p.caption}
            onClick={onClose}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
                touchX.current = null;
            }}>
            <figure className="max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <img src={p.src} alt={p.alt} className="max-h-[78vh] max-w-full rounded-2xl object-contain" />
                <figcaption className="text-center mt-4">
                    <p className="text-white font-black uppercase tracking-widest text-sm">{p.caption}</p>
                    <p className="text-white/60 text-xs font-medium mt-1">{p.where}</p>
                </figcaption>
            </figure>
            <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onStep(-1); }} className={`${btn} left-3 md:left-8`}><ChevronLeft className="w-6 h-6" /></button>
            <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onStep(1); }} className={`${btn} right-3 md:right-8`}><ChevronRight className="w-6 h-6" /></button>
            <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>
        </MotionDiv>
    );
};

const PremiumCoachingGallery = () => {
    const total = PHOTOS.length;
    const carousel = useCarousel(total);
    const [open, setOpen] = useState(null);
    const step = useCallback((d) => setOpen((i) => (i + d + total) % total), [total]);
    const close = useCallback(() => setOpen(null), []);

    return (
        <section className="bg-white py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-rr-pink">Photos</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] text-rr-dark mb-10">Every ball, up close</h2>

                <CarouselTrack carousel={carousel} label="Photos of Royals one-to-one coaching">
                    {PHOTOS.map((p, i) => (
                        <div key={p.caption} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                            className="snap-start shrink-0 w-[82%] sm:w-[48%] lg:w-[calc((100%-2rem)/3)] aspect-[3/4]">
                            <button type="button" onClick={() => setOpen(i)} aria-label={`Enlarge: ${p.caption}`}
                                className="group relative block w-full h-full overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/50">
                                <img src={p.src} alt={p.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rr-navy/90 to-transparent px-4 pt-10 pb-3 text-left">
                                    <span className="block text-xs md:text-sm text-white font-semibold">{p.caption}</span>
                                    <span className="block text-[11px] text-white/70 font-medium mt-0.5">{p.where}</span>
                                </span>
                            </button>
                        </div>
                    ))}
                </CarouselTrack>
                <CarouselControls carousel={carousel} total={total} prevLabel="Previous photo" nextLabel="Next photo" idPrefix="pc-photos" />
            </div>

            <AnimatePresence>
                {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
            </AnimatePresence>
        </section>
    );
};

export default PremiumCoachingGallery;

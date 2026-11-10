import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { JR_PHOTOS } from './jrTerm4Data';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';

// The scrolling photo strip directly under the hero (Andy, 10 Nov 2026: "a scrolling photo
// section below the hero section, as we have for the /tours page"). Same carousel as /tours
// (india-tour-2026/ITCarousel.jsx): swipe on a phone, arrows + progress bar + "n / total",
// three photos across on desktop. Tap a photo to see it full screen (arrows, swipe, Esc).
// Photos and captions: JR_PHOTOS.gallery in jrTerm4Data.js.
const photos = JR_PHOTOS.gallery;

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
    const p = photos[index];
    const btn = 'absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center';
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                <img src={p.src} alt={p.alt} className="max-h-[82vh] max-w-full rounded-2xl object-contain" />
                <figcaption className="text-white font-black uppercase tracking-widest text-sm mt-4">{p.caption}</figcaption>
            </figure>
            <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onStep(-1); }} className={`${btn} left-3 md:left-8`}><ChevronLeft className="w-6 h-6" /></button>
            <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onStep(1); }} className={`${btn} right-3 md:right-8`}><ChevronRight className="w-6 h-6" /></button>
            <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>
        </motion.div>
    );
};

const JRGallery = () => {
    const total = photos.length;
    const carousel = useCarousel(total);
    const [open, setOpen] = useState(null);
    const step = useCallback((d) => setOpen((i) => (i + d + total) % total), [total]);
    const close = useCallback(() => setOpen(null), []);

    return (
        <section className="py-16 md:py-20 bg-white" data-jr-gallery>
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-8">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Inside a session</p>
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                        This is <span className="text-rr-pink">Junior Royals</span>
                    </h2>
                </div>

                <CarouselTrack carousel={carousel} label="Photos from Junior Royals sessions">
                    {photos.map((p, i) => (
                        <div key={p.src} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                            className="snap-start shrink-0 w-[82%] sm:w-[48%] lg:w-[calc((100%-2rem)/3)] aspect-[3/4]">
                            <button type="button" onClick={() => setOpen(i)} aria-label={`Enlarge: ${p.caption}`}
                                className="group relative block w-full h-full overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/50">
                                <img src={p.src} srcSet={`${p.srcSm} 480w, ${p.src} 900w`} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 48vw, 82vw"
                                    alt={p.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rr-navy/90 to-transparent px-4 pt-10 pb-3 text-left text-xs md:text-sm text-white font-semibold">
                                    {p.caption}
                                </span>
                            </button>
                        </div>
                    ))}
                </CarouselTrack>
                <CarouselControls carousel={carousel} total={total} prevLabel="Previous photo" nextLabel="Next photo" idPrefix="jr-photos" />
            </div>

            <AnimatePresence>
                {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
            </AnimatePresence>
        </section>
    );
};

export default JRGallery;

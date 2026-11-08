import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { JR_PHOTOS } from './jrTerm4Data';

// "Inside a Junior Royals session": real photos from the nets (Andy, 8 Nov 2026).
// Phones: a swipe row (most visitors are on a phone). Desktop: a three-column photo
// wall. Tap any photo to see it full screen; the arrow buttons, arrow keys and Esc work there.
const photos = JR_PHOTOS.gallery;

const Lightbox = ({ index, onClose, onStep }) => {
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
            onClick={onClose}>
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

const Tile = ({ p, i, onOpen, className = '', eager = false }) => (
    <button type="button" onClick={() => onOpen(i)} aria-label={`Open photo: ${p.caption}`}
        className={`group relative block w-full overflow-hidden rounded-2xl bg-rr-dark text-left ${className}`}>
        <img src={p.src} srcSet={`${p.srcSm} 480w, ${p.src} 900w`} sizes="(min-width: 768px) 33vw, 75vw"
            alt={p.alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-rr-dark/85 to-transparent pointer-events-none" />
        <span className="absolute left-4 bottom-4 right-4 text-white font-black uppercase tracking-widest text-xs md:text-sm">{p.caption}</span>
    </button>
);

const JRGallery = () => {
    const [open, setOpen] = useState(null);
    const step = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), []);
    const close = useCallback(() => setOpen(null), []);

    return (
        <section className="py-24 bg-rr-dark relative overflow-hidden" data-jr-gallery>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Inside a session</motion.p>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-5">
                        This is <span className="text-rr-pink">Junior Royals</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                        className="text-lg text-white/75 font-medium max-w-2xl mx-auto leading-relaxed">
                        Real sessions at Mickleham and Cranbourne North: small groups, hands-on coaching, and plenty of time batting and bowling.
                    </motion.p>
                </div>
            </div>

            {/* Phones: swipe row */}
            <div className="md:hidden">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {photos.map((p, i) => (
                        <div key={p.src} className="snap-center shrink-0 w-[75vw] max-w-xs">
                            <Tile p={p} i={i} onOpen={setOpen} className="aspect-[3/4]" eager={i < 2} />
                        </div>
                    ))}
                </div>
                <p className="text-center text-white/50 text-xs font-semibold uppercase tracking-widest mt-2">Swipe for more · tap to enlarge</p>
            </div>

            {/* Desktop: photo wall */}
            <div className="hidden md:block max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-3 gap-4 pb-8">
                    {photos.map((p, i) => (
                        <motion.div key={p.src} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: (i % 3) * 0.08 }}>
                            <Tile p={p} i={i} onOpen={setOpen} className={i % 3 === 1 ? 'aspect-[3/4] md:translate-y-8' : 'aspect-[3/4]'} />
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
            </AnimatePresence>
        </section>
    );
};

export default JRGallery;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { HOME_PHOTOS, HOME_VIDEOS } from './homeMediaData';
import { VideoCard } from '../india-tour-2026/ITVideos';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';

// Photos and videos under the home page video (Andy, 13 Nov 2026), presented the way
// every other page does it: the photo strip from /junior-royals (JRGallery.jsx) and the
// video section from /junior-royals and /tours (JRVideos.jsx, ITVideos.jsx). Same
// carousel, same video player, same full-screen photo viewer. The photos and videos
// come from those pages' carousels: homeMediaData.js.

const photos = HOME_PHOTOS;

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
            className="fixed inset-0 z-[100] bg-rr-dark/95 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label={p.caption || p.alt}
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
                {p.caption && <figcaption className="text-white font-black uppercase tracking-widest text-sm mt-4 text-center">{p.caption}</figcaption>}
            </figure>
            <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onStep(-1); }} className={`${btn} left-3 md:left-8`}><ChevronLeft className="w-6 h-6" /></button>
            <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onStep(1); }} className={`${btn} right-3 md:right-8`}><ChevronRight className="w-6 h-6" /></button>
            <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>
        </motion.div>
    );
};

const HomePhotos = () => {
    const total = photos.length;
    const carousel = useCarousel(total);
    const [open, setOpen] = useState(null);
    const step = useCallback((d) => setOpen((i) => (i + d + total) % total), [total]);
    const close = useCallback(() => setOpen(null), []);
    if (total === 0) return null;

    return (
        <section className="py-16 md:py-20 bg-white" data-home-photos>
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-8">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Photos</p>
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                        Inside the <span className="text-rr-pink">Royals Academy</span>
                    </h2>
                </div>

                <CarouselTrack carousel={carousel} label="Photos from Rajasthan Royals Academy Melbourne programs">
                    {photos.map((p, i) => (
                        <div key={p.src} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                            className="snap-start shrink-0 w-[82%] sm:w-[48%] lg:w-[calc((100%-2rem)/3)] aspect-[3/4]">
                            <button type="button" onClick={() => setOpen(i)} aria-label={`Enlarge: ${p.caption || p.alt}`}
                                className="group relative block w-full h-full overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/50">
                                <img src={p.src} {...(p.srcSm ? { srcSet: `${p.srcSm} 480w, ${p.src} 900w`, sizes: '(min-width: 1024px) 33vw, (min-width: 640px) 48vw, 82vw' } : {})}
                                    alt={p.alt} loading="lazy" decoding="async"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                {p.caption && (
                                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rr-navy/90 to-transparent px-4 pt-10 pb-3 text-left text-xs md:text-sm text-white font-semibold">
                                        {p.caption}
                                    </span>
                                )}
                            </button>
                        </div>
                    ))}
                </CarouselTrack>
                <CarouselControls carousel={carousel} total={total} prevLabel="Previous photo" nextLabel="Next photo" idPrefix="home-photos" />
            </div>

            <AnimatePresence>
                {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
            </AnimatePresence>
        </section>
    );
};

const HomeVideos = () => {
    const total = HOME_VIDEOS.length;
    const carousel = useCarousel(total);
    const [activeId, setActiveId] = useState(null);
    if (total === 0) return null;

    return (
        <section className="py-16 md:py-20 bg-rr-dark overflow-hidden" data-home-videos>
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-8">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Watch a session</p>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                        Royals Academy <span className="text-rr-pink">in action</span>
                    </h2>
                </div>

                <CarouselTrack carousel={carousel} label="Videos from Rajasthan Royals Academy Melbourne programs">
                    {HOME_VIDEOS.map((v, i) => (
                        <div key={v.src || v.embed} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                            className="snap-start shrink-0 w-[72%] sm:w-[42%] md:w-[31%] lg:w-[calc((100%-3rem)/4)]">
                            <VideoCard v={v} id={i} activeId={activeId} setActiveId={setActiveId} />
                        </div>
                    ))}
                </CarouselTrack>
                <CarouselControls carousel={carousel} total={total} prevLabel="Previous video" nextLabel="Next video" dark idPrefix="home-videos" />
            </div>
        </section>
    );
};

const HomeMedia = () => (
    <>
        <HomePhotos />
        <HomeVideos />
    </>
);

export default HomeMedia;

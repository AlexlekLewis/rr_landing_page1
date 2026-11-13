import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ChevronDown, Camera, PlayCircle, ArrowRight } from 'lucide-react';
import { HOME_MEDIA } from './homeMediaData';
import { VideoCard } from '../india-tour-2026/ITVideos';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';

// "Inside the Academy": photos and videos from every program, under the home page
// video (Andy, 13 Nov 2026). One row per program; only one is open at a time, so a
// visitor explores a program, then moves to the next. A row's photos and videos are
// only loaded once it is opened, so the home page stays fast on a phone. Same carousel,
// video player and full-screen viewer as /junior-royals and /tours. Content:
// homeMediaData.js.

const count = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const Lightbox = ({ photos, index, onClose, onStep }) => {
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
    const ph = photos[index];
    const btn = 'absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center';
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-rr-dark/95 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label={ph.caption || ph.alt}
            onClick={onClose}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
                touchX.current = null;
            }}>
            <figure className="max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <img src={ph.src} alt={ph.alt} className="max-h-[80vh] max-w-full rounded-2xl object-contain" />
                <figcaption className="text-white font-bold text-sm mt-4 text-center max-w-xl">
                    {ph.caption}
                    <span className="block text-white/50 text-xs font-black uppercase tracking-widest mt-1 tabular-nums">{index + 1} / {photos.length}</span>
                </figcaption>
            </figure>
            {photos.length > 1 && <>
                <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onStep(-1); }} className={`${btn} left-3 md:left-8`}><ChevronLeft className="w-6 h-6" /></button>
                <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onStep(1); }} className={`${btn} right-3 md:right-8`}><ChevronRight className="w-6 h-6" /></button>
            </>}
            <button type="button" aria-label="Close" onClick={onClose} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"><X className="w-6 h-6" /></button>
        </motion.div>
    );
};

const Photos = ({ prog }) => {
    const { photos } = prog;
    const total = photos.length;
    const carousel = useCarousel(total);
    const [open, setOpen] = useState(null);
    const step = useCallback((d) => setOpen((i) => (i + d + total) % total), [total]);
    const close = useCallback(() => setOpen(null), []);
    if (total === 0) return null;
    return (
        <div>
            <CarouselTrack carousel={carousel} label={`Photos: ${prog.name}`}>
                {photos.map((ph, i) => (
                    <div key={ph.src} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                        className="snap-start shrink-0 w-[78%] sm:w-[46%] lg:w-[calc((100%-3rem)/4)] aspect-[4/5]">
                        <button type="button" onClick={() => setOpen(i)} aria-label={`Enlarge: ${ph.caption || ph.alt}`}
                            className="group relative block w-full h-full overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/50">
                            <img src={ph.src} {...(ph.srcSm ? { srcSet: `${ph.srcSm} 480w, ${ph.src} 900w`, sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 78vw' } : {})}
                                alt={ph.alt} loading="lazy" decoding="async"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            {ph.caption && (
                                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-rr-navy/90 to-transparent px-4 pt-10 pb-3 text-left text-xs md:text-sm text-white font-semibold">
                                    {ph.caption}
                                </span>
                            )}
                        </button>
                    </div>
                ))}
            </CarouselTrack>
            <CarouselControls carousel={carousel} total={total} prevLabel="Previous photo" nextLabel="Next photo" idPrefix={`home-media-${prog.key}-photos`} />
            <AnimatePresence>
                {open !== null && <Lightbox photos={photos} index={open} onClose={close} onStep={step} />}
            </AnimatePresence>
        </div>
    );
};

const Videos = ({ prog }) => {
    const { videos } = prog;
    const total = videos.length;
    const carousel = useCarousel(total);
    const [activeId, setActiveId] = useState(null);
    if (total === 0) return null;
    return (
        <div className="bg-rr-dark rounded-3xl px-6 py-7 md:px-8 md:py-8 overflow-hidden">
            <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-5">Watch · {count(total, 'video')}</p>
            <CarouselTrack carousel={carousel} label={`Videos: ${prog.name}`}>
                {videos.map((v, i) => (
                    <div key={v.src || v.embed} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                        className="snap-start shrink-0 w-[68%] sm:w-[40%] md:w-[30%] lg:w-[calc((100%-4rem)/5)]">
                        <VideoCard v={v} id={`${prog.key}-${i}`} activeId={activeId} setActiveId={setActiveId} />
                    </div>
                ))}
            </CarouselTrack>
            <CarouselControls carousel={carousel} total={total} prevLabel="Previous video" nextLabel="Next video" dark idPrefix={`home-media-${prog.key}-videos`} />
        </div>
    );
};

const ProgramRow = ({ prog, isOpen, onToggle }) => {
    const panelId = `home-media-panel-${prog.key}`;
    const cover = prog.photos[0] || { src: prog.videos[0]?.poster, alt: '' };
    return (
        <div className={`rounded-3xl border transition-colors duration-300 ${isOpen ? 'border-rr-pink/40 bg-white' : 'border-slate-200 bg-white hover:border-rr-pink/30'}`}>
            <button type="button" onClick={onToggle} aria-expanded={isOpen} aria-controls={panelId} data-cta={`home-media-${prog.key}`}
                className="w-full flex items-center gap-4 md:gap-6 p-3 md:p-4 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/40 rounded-3xl">
                <span className="relative shrink-0 w-20 h-20 md:w-28 md:h-24 rounded-2xl overflow-hidden bg-slate-200">
                    {cover.src && <img src={cover.srcSm || cover.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />}
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block text-lg md:text-2xl font-black text-rr-dark uppercase tracking-wide leading-tight">{prog.name}</span>
                    <span className="block text-sm text-rr-charcoal/70 font-medium mt-1 leading-snug">{prog.line}</span>
                    <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-black uppercase tracking-widest text-rr-blue">
                        {prog.photos.length > 0 && <span className="inline-flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" aria-hidden="true" />{count(prog.photos.length, 'photo')}</span>}
                        {prog.videos.length > 0 && <span className="inline-flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5" aria-hidden="true" />{count(prog.videos.length, 'video')}</span>}
                    </span>
                </span>
                <span className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-rr-pink text-white rotate-180' : 'bg-slate-100 text-rr-dark'}`} aria-hidden="true">
                    <ChevronDown className="w-5 h-5" />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div id={panelId} key="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }} className="overflow-hidden">
                        <div className="px-6 md:px-8 pb-7 md:pb-8 pt-2 space-y-8">
                            <Photos prog={prog} />
                            <Videos prog={prog} />
                            {prog.href && (
                                <a href={prog.href} data-cta={`home-media-${prog.key}-page`}
                                    className="inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-full px-6 py-3.5 transition-colors">
                                    {prog.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const HomeMedia = () => {
    // The first program starts open, so there is something to see straight away.
    const [openKey, setOpenKey] = useState(HOME_MEDIA[0]?.key ?? null);
    if (HOME_MEDIA.length === 0) return null;
    const totalPhotos = HOME_MEDIA.reduce((n, prog) => n + prog.photos.length, 0);
    const totalVideos = HOME_MEDIA.reduce((n, prog) => n + prog.videos.length, 0);

    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-12">
                    <span className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-1.5 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Photos &amp; videos</span>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide">
                        Inside the <span className="text-rr-pink">Academy</span>
                    </h2>
                    <p className="text-rr-charcoal font-medium mt-4 max-w-2xl mx-auto">
                        Real Junior Royals sessions in Melbourne, and our players at the Rajasthan Royals High Performance Centre in India. Choose a program to explore {totalPhotos} photos and {totalVideos} videos.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {HOME_MEDIA.map((prog) => (
                        <ProgramRow key={prog.key} prog={prog} isOpen={openKey === prog.key}
                            onToggle={() => setOpenKey((k) => (k === prog.key ? null : prog.key))} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeMedia;

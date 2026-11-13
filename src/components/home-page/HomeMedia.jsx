import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { HOME_MEDIA } from './homeMediaData';
import { useCarousel, CarouselTrack, CarouselControls } from '../india-tour-2026/ITCarousel';

// ONE carousel of photos and videos under the home page video (Andy, 13 Nov 2026: "all
// in the same scrolling section ... mixed up ... a nice looking carousel with everything
// pulling through"). Every slide is the same size, so photos and videos sit side by side;
// a video plays where it is (one at a time on the page) and a photo opens full screen.
// Built like the /junior-royals photo strip (same carousel, arrows, progress bar and
// counter). The media and the mix: homeMediaData.js.

const media = HOME_MEDIA;
const photos = media.filter((m) => m.type === 'image');

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

const Caption = ({ title, text }) => (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-rr-navy/90 via-rr-navy/40 to-transparent px-4 pt-12 pb-3 text-left">
        {title && <span className="block text-xs md:text-sm font-black text-white uppercase tracking-wide">{title}</span>}
        {text && <span className="block text-xs md:text-sm text-white font-semibold leading-snug">{text}</span>}
    </span>
);

const PhotoSlide = ({ p, onOpen }) => (
    <button type="button" onClick={onOpen} aria-label={`Enlarge: ${p.caption || p.alt}`}
        className="group relative block w-full h-full overflow-hidden rounded-2xl bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/50">
        <img src={p.src} {...(p.srcSm ? { srcSet: `${p.srcSm} 480w, ${p.src} 900w`, sizes: '(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 72vw' } : {})}
            alt={p.alt} loading="lazy" decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <Caption text={p.caption} />
    </button>
);

const VideoSlide = ({ v }) => {
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const toggle = () => {
        const el = ref.current;
        if (!el) return;
        if (!el.paused) { el.pause(); return; }
        // If a phone refuses to start it from our button, hand over to its own player.
        el.play().catch(() => { el.controls = true; });
    };
    const toggleMute = (e) => {
        e.stopPropagation();
        if (!ref.current) return;
        ref.current.muted = !muted;
        setMuted(!muted);
    };
    return (
        <div className="group relative w-full h-full overflow-hidden rounded-2xl bg-rr-dark">
            <video ref={ref} className="absolute inset-0 w-full h-full object-cover" playsInline preload="none" poster={v.poster}
                onPlay={() => {
                    setPlaying(true);
                    // One video at a time on the whole page.
                    document.querySelectorAll('video').forEach((other) => { if (other !== ref.current && !other.paused) other.pause(); });
                }}
                onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
                <source src={v.src} type="video/mp4" />
            </video>
            <button type="button" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'}: ${v.title || 'video'}`}
                className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/50 rounded-2xl">
                {!playing && (
                    <span className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full bg-rr-pink/90 flex items-center justify-center shadow-[0_0_50px_rgba(225,31,143,0.6)] group-hover:scale-110 group-hover:bg-rr-pink transition-all duration-300">
                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </span>
                )}
            </button>
            {playing && (
                <div className="absolute top-3 right-3 flex gap-2">
                    <button type="button" onClick={(e) => { e.stopPropagation(); toggle(); }} aria-label="Pause" className="w-9 h-9 rounded-full bg-rr-dark/60 hover:bg-rr-dark/80 flex items-center justify-center"><Pause className="w-4 h-4 text-white" fill="white" /></button>
                    <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className="w-9 h-9 rounded-full bg-rr-dark/60 hover:bg-rr-dark/80 flex items-center justify-center">
                        {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                </div>
            )}
            {!playing && (
                <>
                    <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 bg-rr-dark/60 rounded-full px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest">
                        <Play className="w-3 h-3" fill="white" aria-hidden="true" /> Video
                    </span>
                    <Caption title={v.title} text={v.caption} />
                </>
            )}
        </div>
    );
};

const HomeMedia = () => {
    const total = media.length;
    const carousel = useCarousel(total);
    const [open, setOpen] = useState(null);
    const step = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), []);
    const close = useCallback(() => setOpen(null), []);
    if (total === 0) return null;

    return (
        <section className="py-16 md:py-20 bg-white" data-home-media>
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-8">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Photos &amp; videos</p>
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                        Inside the <span className="text-rr-pink">Royals Academy</span>
                    </h2>
                </div>

                <CarouselTrack carousel={carousel} label="Photos and videos from Rajasthan Royals Academy Melbourne">
                    {media.map((m, i) => (
                        <div key={m.src} data-slide role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${total}`}
                            className="snap-start shrink-0 w-[72%] sm:w-[40%] lg:w-[calc((100%-3rem)/4)] aspect-[3/4]">
                            {m.type === 'video'
                                ? <VideoSlide v={m} />
                                : <PhotoSlide p={m} onOpen={() => setOpen(photos.indexOf(m))} />}
                        </div>
                    ))}
                </CarouselTrack>
                <CarouselControls carousel={carousel} total={total} prevLabel="Previous" nextLabel="Next" idPrefix="home-media" />
            </div>

            <AnimatePresence>
                {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
            </AnimatePresence>
        </section>
    );
};

export default HomeMedia;

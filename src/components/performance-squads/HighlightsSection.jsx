import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fadeUp, SectionHeading } from './shared';
import { HIGHLIGHT_PHOTOS, HIGHLIGHT_VIDEOS } from './highlightsData';

// ─────────────────────────────────────────────────────────────
// HIGHLIGHTS — /performance-squads. Match-day reels and photos in one section.
// Content lives in ./highlightsData.js.
//
// Kept light: a reel's player loads only when tapped, thumbnails are 720px and
// lazy, and on a phone only the first seven photos show until "Show all".
// ─────────────────────────────────────────────────────────────

const MOBILE_PHOTOS = 7; // the wide feature photo + three rows of two

const VideoCard = ({ v }) => {
    const [playing, setPlaying] = useState(false);
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="relative aspect-[4/5] bg-black">
                {playing ? (
                    <iframe
                        src={v.embed}
                        title={v.title}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setPlaying(true)}
                        className="group absolute inset-0 w-full h-full"
                        aria-label={`Play: ${v.title}`}
                    >
                        <img src={v.poster} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-14 h-14 rounded-full bg-rr-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                            </span>
                        </span>
                    </button>
                )}
            </div>
            <div className="px-4 py-3">
                <p className="text-white text-sm font-black uppercase leading-tight">{v.title}</p>
                <p className="text-white/50 text-xs font-medium mt-0.5">{v.event}</p>
            </div>
        </div>
    );
};

const Lightbox = ({ index, onClose, onStep }) => {
    const p = HIGHLIGHT_PHOTOS[index];
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onStep(1);
            if (e.key === 'ArrowLeft') onStep(-1);
        };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose, onStep]);

    const navBtn = 'absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-rr-pink flex items-center justify-center transition-colors';
    return (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
            <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-rr-pink flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-white" />
            </button>
            <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                <img src={p.src} alt={p.alt} className="w-full max-h-[78vh] object-contain rounded-lg" />
                <figcaption className="text-white/60 text-xs font-medium mt-3 text-center">
                    {p.event}{p.credit ? ` · Photo: ${p.credit}` : ''} · {index + 1} of {HIGHLIGHT_PHOTOS.length}
                </figcaption>
            </figure>
            <button type="button" onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous photo" className={`${navBtn} left-2 sm:left-6`}>
                <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next photo" className={`${navBtn} right-2 sm:right-6`}>
                <ChevronRight className="w-5 h-5 text-white" />
            </button>
        </div>
    );
};

const HighlightsSection = () => {
    const [open, setOpen] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const close = useCallback(() => setOpen(null), []);
    const step = useCallback((d) => setOpen((i) => (i + d + HIGHLIGHT_PHOTOS.length) % HIGHLIGHT_PHOTOS.length), []);

    return (
        <section className="py-14 sm:py-20 px-5 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto">
                <SectionHeading
                    eyebrow="Highlights"
                    title="Squads In Action"
                    sub="Our Performance Squads on Power League match days. Tap a reel to play it, or a photo to see it full size."
                />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    {HIGHLIGHT_VIDEOS.map((v) => <VideoCard key={v.id} v={v} />)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {HIGHLIGHT_PHOTOS.map((p, i) => (
                        <motion.button
                            key={p.slug}
                            type="button"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={(i % 4) * 0.05}
                            onClick={() => setOpen(i)}
                            aria-label={`Open photo: ${p.alt}`}
                            className={`relative aspect-[3/2] overflow-hidden rounded-xl bg-rr-navy group ${i === 0 ? 'col-span-2 sm:row-span-2 sm:aspect-auto' : ''} ${!showAll && i >= MOBILE_PHOTOS ? 'hidden sm:block' : ''}`}
                        >
                            <img
                                src={i === 0 ? p.src : p.thumb}
                                alt={p.alt}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </motion.button>
                    ))}
                </div>

                {!showAll && HIGHLIGHT_PHOTOS.length > MOBILE_PHOTOS && (
                    <div className="sm:hidden text-center mt-5">
                        <button type="button" onClick={() => setShowAll(true)}
                            className="inline-flex items-center justify-center border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-xs rounded-full px-6 py-3 transition-colors">
                            Show all {HIGHLIGHT_PHOTOS.length} photos
                        </button>
                    </div>
                )}
                <p className="text-white/40 text-xs font-medium text-center mt-5">September photos: JT Photography.</p>
            </div>
            {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}
        </section>
    );
};

export default HighlightsSection;

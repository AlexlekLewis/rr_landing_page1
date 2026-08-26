import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Hosted on the landing project's public `videos` bucket (same convention as the
// home and Power Game videos). preload="none" means the 58MB file is only fetched
// when a visitor actually clicks play — the poster image is all that loads up front.
const VIDEO_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/videos/careers/careers-coaches-alex-lewis-v1.mp4';
// The video's own branded title card, captured as a still — loads instantly with the page.
const POSTER = '/assets/careers-video-poster.jpg';

const VideoSection = () => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const startPlaying = () => {
        const v = videoRef.current;
        if (!v) return;
        v.play();
        setPlaying(true);
    };

    return (
        <section className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
            <div className="relative max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
                    >
                        Leadership
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6"
                    >
                        Hear From Our <span className="text-rr-pink">Leadership.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mx-auto mb-8 origin-center"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed max-w-3xl mx-auto"
                    >
                        Director of Cricket Andy Crook sits down with Head Coach Alex Lewis to talk through what coaching at RRA Melbourne actually involves — how we coach, the standard we hold coaches to, and who we're looking for.
                    </motion.p>
                </div>

                {/* Video player — poster loads immediately, the file only downloads on play */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative aspect-video w-full rounded-2xl overflow-hidden bg-rr-dark border border-slate-200 shadow-2xl"
                >
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={VIDEO_URL}
                        poster={POSTER}
                        preload="none"
                        controls={playing}
                        playsInline
                        onPlay={() => setPlaying(true)}
                    />

                    {/* Click-to-play overlay — hidden once the video starts */}
                    {!playing && (
                        <button
                            type="button"
                            onClick={startPlaying}
                            aria-label="Play the video: Andy Crook interviews Alex Lewis"
                            className="absolute inset-0 z-10 flex items-center justify-center group cursor-pointer"
                        >
                            {/* Light scrim only — the branded title card poster should stay visible */}
                            <div className="absolute inset-0 bg-rr-dark/20 group-hover:bg-rr-dark/10 transition-colors" />
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-rr-pink group-hover:bg-rr-light-pink flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-rr-dark/50">
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </button>
                    )}

                    {/* Subtle border accent */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
};

export default VideoSection;

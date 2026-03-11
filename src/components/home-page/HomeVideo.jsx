import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

// Replace VIDEO_URL with a real YouTube/Vimeo embed URL when ready
const VIDEO_URL = null; // e.g. "https://www.youtube.com/embed/YOUR_VIDEO_ID"

const HomeVideo = () => {
    const [playing, setPlaying] = useState(false);

    return (
        <section id="video" className="py-24 bg-rr-dark">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">See It In Action</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4">
                        THE ROYALS <span className="text-rr-pink">EXPERIENCE</span>
                    </h2>
                    <p className="text-lg text-white/70 font-medium max-w-2xl mx-auto">
                        Go behind the scenes at RRA Melbourne — world-class facilities, elite coaching, and cricketers built for the modern game.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-2xl overflow-hidden aspect-video bg-rr-charcoal"
                >
                    {VIDEO_URL && playing ? (
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`${VIDEO_URL}?autoplay=1`}
                            title="RRA Melbourne — The Royals Experience"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <>
                            {/* Poster / placeholder */}
                            <img
                                src="/assets/hero-celebration-new.jpg"
                                alt="RRA Melbourne video poster"
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-rr-dark/40" />

                            {/* Play button */}
                            <button
                                onClick={() => VIDEO_URL ? setPlaying(true) : null}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
                                title={VIDEO_URL ? 'Play video' : 'Video coming soon'}
                            >
                                <div className="w-20 h-20 rounded-full bg-rr-pink/90 flex items-center justify-center shadow-[0_0_40px_rgba(225,31,143,0.5)] group-hover:scale-110 group-hover:bg-rr-pink transition-all duration-300">
                                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                </div>
                                {!VIDEO_URL && (
                                    <span className="text-white/60 text-sm font-medium uppercase tracking-widest">Coming Soon</span>
                                )}
                            </button>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default HomeVideo;

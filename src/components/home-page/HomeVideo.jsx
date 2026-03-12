import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const HomeVideo = () => {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [started, setStarted] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        if (!started) setStarted(true);
        if (videoRef.current) {
            if (playing) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setPlaying(!playing);
        }
    };

    const handleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    const handleVideoEnd = () => setPlaying(false);

    return (
        <section id="video" className="py-24 bg-rr-dark">
            <div className="max-w-5xl mx-auto px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">From The Academy</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4">
                        INTRODUCING <span className="text-rr-pink">RRA MELBOURNE</span>
                    </h2>
                    <p className="text-lg text-white/60 font-medium max-w-2xl mx-auto">
                        Hear from Sid Lahiri, Head of International Talent Development, and Performance Coach for the Rajasthan Royals Group.
                    </p>
                </motion.div>

                {/* Video player */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-2xl overflow-hidden bg-black shadow-[0_32px_80px_rgba(0,0,0,0.6)] group"
                    style={{ aspectRatio: '16/9' }}
                >
                    {/* Video element */}
                    <video
                        ref={videoRef}
                        src="/assets/intro-video.mp4"
                        poster="/assets/intro-video-poster.jpg"
                        className="w-full h-full object-cover"
                        onEnded={handleVideoEnd}
                        playsInline
                        preload="metadata"
                    />

                    {/* Overlay — shown before play starts */}
                    {!started && (
                        <div className="absolute inset-0 bg-rr-dark/40" />
                    )}

                    {/* Big play button — centre, only when not playing */}
                    {!playing && (
                        <button
                            onClick={handlePlay}
                            className="absolute inset-0 flex items-center justify-center group/play"
                            aria-label="Play video"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-rr-pink/90 flex items-center justify-center shadow-[0_0_50px_rgba(225,31,143,0.5)] group-hover/play:scale-110 group-hover/play:bg-rr-pink transition-all duration-300">
                                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                            </div>
                        </button>
                    )}

                    {/* Controls bar — visible on hover when playing */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-rr-dark/80 to-transparent transition-opacity duration-300 flex items-center justify-between ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                        <button
                            onClick={handlePlay}
                            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors"
                            aria-label={playing ? 'Pause' : 'Play'}
                        >
                            {playing
                                ? <Pause className="w-4 h-4 text-white" fill="white" />
                                : <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                            }
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest hidden sm:block">Siddhartha Lahiri — Head of Academy</span>
                            <button
                                onClick={handleMute}
                                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors"
                                aria-label={muted ? 'Unmute' : 'Mute'}
                            >
                                {muted
                                    ? <VolumeX className="w-4 h-4 text-white" />
                                    : <Volume2 className="w-4 h-4 text-white" />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Brand corner tag */}
                    <div className="absolute top-4 left-4 pointer-events-none">
                        <div className="inline-flex items-center gap-2 bg-rr-dark/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                            <img src="/assets/MELBOURNE_OFFICIAL.png" alt="RRA" className="h-4 w-auto object-contain brightness-0 invert opacity-70" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default HomeVideo;

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VIDEO_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/sign/RRAM%20MAIN/General%20Coaching%20Edit%20RR%20Sid%20V2.mov?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YThjNjFiYi0yZDNiLTQ1OWUtOTcwMi0zMDU0Mjc4ODIwNWEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSUkFNIE1BSU4vR2VuZXJhbCBDb2FjaGluZyBFZGl0IFJSIFNpZCBWMi5tb3YiLCJpYXQiOjE3NzMzODY4MzYsImV4cCI6MTc3Mzk5MTYzNn0.WNJaP8kjoybJICTjVbyB8t3kYVoHaXjD2sBJAj-khKM';

const HomeVideo = () => {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [started, setStarted] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play().then(() => {
                setPlaying(true);
                setStarted(true);
            }).catch(err => console.error('Video play error:', err));
        }
    };

    const handleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    return (
        <section id="video" className="py-16 md:py-24 bg-rr-dark overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="order-2 lg:order-1"
                    >
                        <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">From The Academy</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6 leading-tight">
                            INTRODUCING <span className="text-rr-pink">RRA MELBOURNE</span>
                        </h2>

                        <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-6" />

                        <p className="text-lg text-white/60 font-medium leading-relaxed mb-8">
                            Hear from Sid Lahiri, Head of International Talent Development, and Performance Coach for the Rajasthan Royals Group.
                        </p>

                        {/* Speaker credit */}
                        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-rr-pink/40">
                                <img src="/assets/coaches/siddhartha-lahiri.jpg" alt="Siddhartha Lahiri" className="w-full h-full object-cover object-top" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase tracking-wide text-sm">Siddhartha Lahiri</p>
                                <p className="text-white/50 text-xs font-medium mt-0.5">Head of International Talent Development</p>
                                <p className="text-rr-pink text-xs font-bold mt-0.5">Rajasthan Royals Group</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Portrait video */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                        className="order-1 lg:order-2 flex justify-center relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-br from-rr-pink/20 to-rr-blue/10 rounded-3xl blur-2xl opacity-50 pointer-events-none" />

                        {/* 9:16 portrait container — constrained and centred on all screens */}
                        <div
                            className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] group bg-black mx-auto w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-sm"
                            style={{ aspectRatio: '9/16' }}
                        >
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                onEnded={() => setPlaying(false)}
                                playsInline
                                preload="metadata"
                                poster="/assets/intro-video-poster.jpg"
                            >
                                <source src={VIDEO_URL} type="video/mp4" />
                                <source src={VIDEO_URL} type="video/quicktime" />
                            </video>

                            {!started && <div className="absolute inset-0 bg-rr-dark/50" />}

                            {!playing && (
                                <button onClick={handlePlay} className="absolute inset-0 flex items-center justify-center group/play" aria-label="Play video">
                                    <div className="w-20 h-20 rounded-full bg-rr-pink/90 flex items-center justify-center shadow-[0_0_50px_rgba(225,31,143,0.6)] group-hover/play:scale-110 group-hover/play:bg-rr-pink transition-all duration-300">
                                        <Play className="w-9 h-9 text-white ml-1" fill="white" />
                                    </div>
                                </button>
                            )}

                            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-rr-dark/90 to-transparent transition-opacity duration-300 flex items-center justify-between ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                <button onClick={handlePlay} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
                                    {playing ? <Pause className="w-4 h-4 text-white" fill="white" /> : <Play className="w-4 h-4 text-white ml-0.5" fill="white" />}
                                </button>
                                <button onClick={handleMute} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-colors" aria-label={muted ? 'Unmute' : 'Mute'}>
                                    {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                                </button>
                            </div>

                            <div className="absolute top-4 left-4 pointer-events-none">
                                <div className="inline-flex items-center gap-2 bg-rr-dark/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                                    <img src="/assets/MELBOURNE_OFFICIAL.png" alt="RRA" className="h-4 w-auto object-contain brightness-0 invert opacity-70" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeVideo;

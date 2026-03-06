import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const TheDreamAndPathway = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section className="relative bg-rr-dark overflow-hidden" id="dream-pathway">
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

            {/* Subtle radial glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rr-pink/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rr-blue/5 rounded-full blur-[100px]" />
            </div>



            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">

                {/* Logo stamp — centred at top */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center mb-14"
                >
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src="/assets/rr-logo-blue.png"
                            alt="Rajasthan Royals"
                            className="h-16 md:h-20 w-auto object-contain"
                            onError={(e) => { e.target.src = '/assets/Logos/RR-Logo-2.png'; }}
                        />
                        <div className="flex items-center gap-3">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-rr-pink" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Official Rajasthan Royals Academy</span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-rr-blue" />
                        </div>
                    </div>
                </motion.div>

                {/* Two-column: text left, video right */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16 items-center">

                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">The Vision</p>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
                            The Dream<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">&amp; Pathway</span>
                        </h2>
                        <div className="w-12 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-6" />
                        <p className="text-white/60 font-medium text-base md:text-lg leading-relaxed">
                            Hear from Kumar Sangakkara, Director of Cricket at the Rajasthan Royals, on the vision behind the Academy and what it means for aspirational cricketers in Melbourne.
                        </p>

                        {/* Kumar credential card */}
                        <div className="mt-8 flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 w-fit">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0">
                                <span className="text-white font-black text-sm">KS</span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm leading-tight">Kumar Sangakkara</p>
                                <p className="text-white/40 text-xs font-medium mt-0.5">Director of Cricket · Rajasthan Royals</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Video */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                        className="relative"
                    >
                        {/* Glow behind video */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-rr-pink/20 to-rr-blue/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

                        {/* Video wrapper */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                controls={isPlaying}
                                playsInline
                                preload="metadata"
                                poster="/assets/video-poster-sangakkara.jpg"
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                            >
                                <source src="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Final%20Andy%20&%20Kumar%20Edit.mov" type="video/quicktime" />
                                <source src="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Final%20Andy%20&%20Kumar%20Edit.mov" type="video/mp4" />
                            </video>

                            {/* Play overlay */}
                            {!isPlaying && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
                                    style={{ background: 'linear-gradient(to top, rgba(17,25,33,0.85) 0%, rgba(17,25,33,0.3) 60%, transparent 100%)' }}
                                    onClick={handlePlay}
                                >
                                    {/* Play button */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-rr-pink rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                                            <svg className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Lower-third */}
                                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-white font-black text-base md:text-lg uppercase tracking-wide leading-tight">Kumar Sangakkara</p>
                                            <p className="text-white/60 text-xs font-medium mt-0.5">Director of Cricket · Rajasthan Royals</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-rr-pink/90 px-3 py-1 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Play</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom gradient accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue to-transparent" />

            {/* CTA */}
            <div className="relative z-10 flex flex-col items-center gap-4 pb-14">
                <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                    <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Entry closes 5pm · March 20 — or when full</span>
                </div>
                <a href="#checkout" className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-sm flex items-center gap-3">
                    Secure Your Place Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
            </div>
        </section>
    );
};

export default TheDreamAndPathway;

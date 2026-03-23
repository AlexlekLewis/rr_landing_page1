import React from 'react';
import { motion } from 'framer-motion';

const IPLQABanner = () => (
    <section className="relative bg-rr-dark overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue to-transparent" />

        {/* Ambient glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-rr-pink/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-rr-blue/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
            >
                {/* Left: Icon */}
                <div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue shadow-[0_0_40px_rgba(229,6,149,0.35)]">
                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                </div>

                {/* Centre: Copy */}
                <div className="flex-1 text-center md:text-left">
                    <span className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/30 rounded-full px-4 py-1.5 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-[10px] font-bold text-rr-pink uppercase tracking-[0.25em]">Exclusive Bonus — Clinic Attendees Only</span>
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-3">
                        Live Online Q&amp;A With a{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">
                            Rajasthan Royals IPL Player
                        </span>
                    </h2>
                    <p className="text-white/55 font-medium text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                        Every clinic attendee gets exclusive access to a live online Q&amp;A session with a current Rajasthan Royals IPL contracted player — ask your questions directly to someone playing at the highest level of T20 cricket in the world.
                    </p>
                </div>

                {/* Right: Badge */}
                <div className="shrink-0 flex flex-col items-center justify-center bg-white/4 border border-white/10 rounded-2xl px-6 py-5 text-center min-w-[130px]">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] mb-2">Valued At</p>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rr-pink to-rr-blue leading-none mb-1">FREE</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Included</p>
                </div>
            </motion.div>
        </div>
    </section>
);

export default IPLQABanner;

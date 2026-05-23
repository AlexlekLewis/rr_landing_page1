import React from 'react';
import { motion } from 'framer-motion';

const HallaBol = () => (
    <section className="relative bg-rr-dark overflow-hidden">
        {/* Top + bottom accent lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-0">

            {/* Left: Tagline */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex-1 text-center md:text-left z-10"
            >
                <p className="text-rr-pink text-xs font-black uppercase tracking-[0.3em] mb-4">
                    Rajasthan Royals · IPL
                </p>
                <h2 className="text-6xl md:text-8xl font-black text-white uppercase leading-none tracking-tight">
                    HALLA
                </h2>
                <h2 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tight"
                    style={{ WebkitTextStroke: '2px #E11F8F', color: 'transparent' }}>
                    BOL!
                </h2>
                <p className="text-white/50 text-sm font-semibold mt-6 max-w-xs mx-auto md:mx-0 leading-relaxed">
                    Train in the spirit of the Rajasthan Royals this July school holidays.
                </p>
            </motion.div>

            {/* Right: Players image */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="flex-1 flex justify-center md:justify-end relative md:-ml-16"
            >
                {/* Pink glow behind players */}
                <div className="absolute inset-0 bg-rr-pink/10 blur-3xl rounded-full pointer-events-none" />
                <img
                    src="/assets/halla-bol-players.png"
                    alt="Rajasthan Royals IPL Players — Halla Bol!"
                    className="relative z-10 w-full max-w-lg md:max-w-2xl object-contain drop-shadow-2xl"
                />
            </motion.div>

        </div>
    </section>
);

export default HallaBol;

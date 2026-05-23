import React from 'react';
import { motion } from 'framer-motion';

const HallaBol = () => (
    <section className="relative bg-rr-dark overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue to-transparent" />

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-0">

            {/* Left: Text */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex-1 text-center md:text-left z-10 pb-0 md:pb-10"
            >
                <p className="text-rr-pink text-xs font-black uppercase tracking-[0.3em] mb-5">
                    Rajasthan Royals · IPL
                </p>

                {/* HALLA BOL — all one consistent stroke style */}
                <div className="leading-none mb-6">
                    <p className="text-7xl md:text-9xl font-black text-white uppercase leading-none tracking-tight">
                        HALLA
                    </p>
                    <p className="text-7xl md:text-9xl font-black uppercase leading-none tracking-tight text-transparent"
                        style={{ WebkitTextStroke: '3px #E11F8F' }}>
                        BOL!
                    </p>
                </div>

                <p className="text-white/60 text-base md:text-lg font-semibold leading-relaxed max-w-sm mx-auto md:mx-0">
                    Where young cricketers train inside one of world cricket's most iconic brands.
                </p>
            </motion.div>

            {/* Right: Players — larger, anchored to bottom */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="flex-1 flex justify-center md:justify-end relative md:-mb-0"
            >
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-rr-pink/8 blur-3xl rounded-full pointer-events-none" />
                <img
                    src="/assets/halla-bol-players.png"
                    alt="Rajasthan Royals IPL Players — Halla Bol!"
                    className="relative z-10 w-full max-w-full md:max-w-full object-contain scale-[1.3] origin-bottom translate-y-16 translate-x-3 md:translate-x-0"
                />
            </motion.div>

        </div>
    </section>
);

export default HallaBol;

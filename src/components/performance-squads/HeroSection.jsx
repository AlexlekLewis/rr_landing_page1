import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, scrollTo } from './shared';

const HeroSection = () => (
    <section className="relative min-h-[92svh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-rr opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-rr-dark/90" />

        {/* Royals rampant lion — right-hand background mark. Decorative only.
            Line art, so it carries a higher opacity than a solid watermark would. */}
        <img
            src="/assets/rr-rampant-lion-white.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute z-0 right-[-10%] sm:right-[2%] lg:right-[6%] top-1/2 -translate-y-1/2 h-[70%] sm:h-[80%] lg:h-[88%] w-auto max-w-none opacity-[0.14] sm:opacity-[0.18] lg:opacity-25"
        />
        {/* Keeps copy legible over the mark on narrow screens */}
        <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/70 to-transparent lg:via-rr-dark/40" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 py-28">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="max-w-2xl text-left"
            >
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white bg-rr-pink rounded-full px-5 py-2 mb-6">
                    Rajasthan Royals Academy Melbourne
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6">
                    Performance<br />Squads
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-rr-light-pink mb-4">
                    Trial. Earn your spot. Represent the Royals Academy.
                </p>
                <p className="text-white/70 text-[15px] sm:text-lg font-medium leading-relaxed mb-10">
                    Our Performance Squads are the representative arm of the Rajasthan Royals Academy — squads of
                    like-skilled, like-motivated players who train together and compete together.
                    Every player earns their place at an open <span className="text-white font-bold">trial</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-start">
                    <button
                        onClick={() => scrollTo('trials')}
                        className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        Register for a Trial <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scrollTo('pathway')}
                        className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        How it works
                    </button>
                </div>
            </motion.div>
        </div>
    </section>
);

export default HeroSection;

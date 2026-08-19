import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, scrollTo } from './shared';

const HeroSection = () => (
    <section className="relative min-h-[92svh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-rr opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-rr-dark/90" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 py-28 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white bg-rr-pink rounded-full px-5 py-2 mb-6">
                    Rajasthan Royals Academy Melbourne
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6">
                    Performance<br />Squads
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-rr-light-pink mb-4">
                    Trial. Earn your spot. Represent the Royals.
                </p>
                <p className="text-white/70 text-[15px] sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                    Our Performance Squads are the representative arm of the Academy — squads of
                    like-skilled, like-motivated players who train together and compete together.
                    Players either <span className="text-white font-bold">trial</span> for their place
                    or are <span className="text-white font-bold">invited</span> by our coaching staff.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
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

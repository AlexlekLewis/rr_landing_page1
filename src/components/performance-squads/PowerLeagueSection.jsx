import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './shared';

// Reserved explanation section — placeholder copy, refine with Andy.
const PowerLeagueSection = () => (
    <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
            {/* Official Power League logo (same asset as the Power Cricket page) —
                white/pink on transparent, designed for dark backgrounds. */}
            <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-5">
                    Where Squads Compete
                </span>
                <h2 className="sr-only">The Power League</h2>
                <img
                    src="/assets/power-league-logo.png"
                    alt="The Power League"
                    className="h-24 sm:h-32 lg:h-36 w-auto mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                />
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10">
                <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                    The Power League is where the Academy Performance Squads compete head-to-head
                    against each other in T20, T10 and 100-ball matches, played at various times
                    from September 2026 through April 2027.
                </p>
                <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                    Each centre's First XI and additional squad teams (ages 10 to 20+) are selected
                    for Power League rounds, alongside fixtures against external opposition — so every
                    squad member competes in real, meaningful cricket throughout the season.
                </p>
                <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                    <span className="text-rr-light-pink font-bold">Performance Squad games commence in
                    late September</span> for certain age groups, with the remainder following through
                    the season.
                </p>
                <p className="text-white/45 text-xs font-medium italic">
                    Full Power League format, fixtures, and standings will be published here from time to time.
                </p>
            </motion.div>
        </div>
    </section>
);

export default PowerLeagueSection;

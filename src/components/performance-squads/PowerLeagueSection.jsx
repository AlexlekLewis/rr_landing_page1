import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './shared';

// Where the squads play. Evergreen: no season-specific dates, so the page stays
// true from one season to the next. Match count matches the membership section.
const PowerLeagueSection = () => (
    <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
            {/* Power League wordmark, RRA-pink variant of the Power Cricket logo —
                'LEAGUE' recoloured to rr-pink (#E11F8F) to match the page. The
                original fuchsia asset stays for the Power Cricket brand. */}
            <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-rr-pink mb-5">
                    Where Squads Compete
                </span>
                <h2 className="sr-only">The Power League</h2>
                <img
                    src="/assets/power-league-logo-rra.png"
                    alt="The Power League"
                    className="h-24 sm:h-32 lg:h-36 w-auto mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                />
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10">
                <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                    The Power League is where the Academy Performance Squads compete head-to-head
                    against each other in T20, T10 and 100-ball matches, played from September to
                    April each season.
                </p>
                <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                    Each centre's First XI and additional squad teams (ages 10 to 25) are selected
                    for Power League fixtures, alongside fixtures against external opposition in
                    showcase matches. The program is designed for every squad member to play real,
                    meaningful cricket through the season: 5 to 10 T20 match days, about one a month.
                </p>
                <p className="text-white/75 text-[15px] sm:text-base font-medium leading-relaxed mb-4">
                    <span className="text-rr-light-pink font-bold">Selection is at the coaching staff’s
                    discretion</span>, and not every player plays every game. We tell you the team before
                    each match.
                </p>
                <p className="text-white/45 text-xs font-medium italic">
                    Full Power League format, external showcase fixtures, and standings will be published here from time to time.
                </p>
            </motion.div>
        </div>
    </section>
);

export default PowerLeagueSection;

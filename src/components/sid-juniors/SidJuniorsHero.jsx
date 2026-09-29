import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, scrollTo } from '../performance-squads/shared';
import { HERO, CTA, SID_CAVEAT } from './sidJuniorsData';

// THE STANDARD HERO. Same background, lion mark, pill, type scale and buttons
// as ../performance-squads/HeroSection.jsx, which /performance-squads-open-trial
// renders — Andy asked (22 Sep 2026) for new pages to stop drifting from it.
//
// Not imported because that component's words are hard-coded to the squads
// ("Register for a Trial", "earns their place at an open trial"), and this
// page must never read as a trial. If the standard hero's styling changes,
// change it here too. Copy lives in sidJuniorsData.js.
//
// Two differences, both deliberate: the Sid caveat under the buttons, because
// this hero names him; and the text column is max-w-3xl, not max-w-2xl, so
// "With Sid Lahiri" sets on one line at desktop size instead of breaking the
// headline into four. The paragraphs keep the standard max-w-2xl measure.
const SidJuniorsHero = () => (
    <section className="relative min-h-[92svh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-rr opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-rr-dark/90" />

        {/* Royals rampant lion — right-hand background mark. Decorative only. */}
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
                className="max-w-3xl text-left"
            >
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white bg-rr-pink rounded-full px-5 py-2 mb-6">
                    {HERO.kicker}
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6">
                    {HERO.headlineTop}<br />{HERO.headlineBottom}
                </h1>
                {/* One line per session, so both dates are visible above the fold. */}
                <div className="mb-5 max-w-2xl space-y-1">
                    {HERO.taglines.map((t) => (
                        <p key={t.key} className="text-lg sm:text-2xl font-bold text-rr-light-pink leading-snug">
                            {t.lead} · <span className="whitespace-nowrap">{t.time}</span>
                        </p>
                    ))}
                </div>
                <p className="text-white/70 text-[15px] sm:text-lg font-medium leading-relaxed mb-10 max-w-2xl">
                    {HERO.body}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-start">
                    <button
                        type="button"
                        onClick={() => scrollTo('register-pay')}
                        className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        {CTA} <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollTo('session')}
                        className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        {HERO.secondaryCta}
                    </button>
                </div>
                <p className="text-white/50 text-xs sm:text-[13px] font-medium leading-relaxed mt-6 max-w-xl">
                    {SID_CAVEAT}
                </p>
            </motion.div>
        </div>
    </section>
);

export default SidJuniorsHero;

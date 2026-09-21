import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { fadeUp, scrollTo } from '../performance-squads/shared';
import { HERO, SID, DATES_CONFIRMED } from './openAgeData';

// Sid-led hero. The photo of him coaching Riyan Parag is the proof, so it sits
// beside the headline on desktop and directly under it on a phone.
//
// The primary button is DISABLED while openAgeData.TRIAL_SESSIONS is empty and
// says so honestly. No invented date is ever rendered as real.
const OpenAgeHero = () => (
    <section className="relative w-full overflow-hidden flex items-center py-24 sm:py-28">
        <div className="absolute inset-0 bg-gradient-rr opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-rr-dark/90" />
        <img
            src="/assets/rr-rampant-lion-white.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute z-0 right-[-14%] sm:right-[-6%] top-1/2 -translate-y-1/2 h-[70%] sm:h-[85%] w-auto max-w-none opacity-[0.10] sm:opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/70 to-transparent lg:via-rr-dark/40" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6">
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
                {/* Copy */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-left order-1">
                    <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-white bg-rr-pink rounded-full px-5 py-2 mb-6">
                        {HERO.kicker}
                    </span>
                    <h1 className="text-[2.1rem] leading-[1.02] sm:text-5xl lg:text-6xl font-black uppercase mb-5">
                        {HERO.headline}
                    </h1>
                    <p className="text-lg sm:text-2xl font-black uppercase tracking-wide text-rr-light-pink mb-5">
                        {HERO.tagline}
                    </p>
                    <p className="text-white/70 text-[15px] sm:text-lg font-medium leading-relaxed mb-9 max-w-xl">
                        {HERO.body}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-start">
                        {DATES_CONFIRMED ? (
                            <button
                                onClick={() => scrollTo('register-pay')}
                                className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                            >
                                {HERO.primaryCta} <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled
                                aria-disabled="true"
                                title="Trial dates have not been confirmed yet"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white/45 font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 cursor-not-allowed"
                            >
                                <CalendarClock className="w-4 h-4" /> {HERO.primaryCtaPending}
                            </button>
                        )}
                        {/* While booking is shut this is the ONLY live button in the
                            hero, so it must not land on the global opportunities list.
                            It goes to the three steps instead, which say plainly that
                            there are two competitive gates before any of that. */}
                        <button
                            onClick={() => scrollTo(DATES_CONFIRMED ? 'opportunity' : 'pathway')}
                            className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            {DATES_CONFIRMED ? HERO.secondaryCta : HERO.secondaryCtaPending}
                        </button>
                    </div>

                    {/* The hedge. This page takes money on the strength of one named
                        person turning up, so his attendance is never stated as a
                        certainty. Same line on the booking card and in the FAQ. */}
                    <p className="text-white/50 text-xs sm:text-[13px] font-medium leading-relaxed mt-6 max-w-xl">
                        {SID.attendance}
                    </p>
                </motion.div>

                {/* Sid. The photo IS the proof. */}
                <motion.figure
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={0.15}
                    className="order-2 relative rounded-3xl overflow-hidden border border-white/15 bg-rr-navy shadow-2xl"
                >
                    <img
                        src={SID.photo}
                        alt={SID.photoAlt}
                        width="900"
                        height="1349"
                        className="w-full h-auto object-cover aspect-[4/5] lg:aspect-[3/4] object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/10 to-transparent pointer-events-none" />
                    <figcaption className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                        <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-white bg-rr-pink rounded-full px-3 py-1.5 mb-3">
                            Scheduled to attend
                        </span>
                        <p className="text-2xl sm:text-3xl font-black uppercase leading-none mb-1.5">{SID.name}</p>
                        <p className="text-rr-light-pink text-xs sm:text-sm font-black uppercase tracking-wider">
                            {SID.titleLine}
                        </p>
                    </figcaption>
                </motion.figure>
            </div>
        </div>
    </section>
);

export default OpenAgeHero;

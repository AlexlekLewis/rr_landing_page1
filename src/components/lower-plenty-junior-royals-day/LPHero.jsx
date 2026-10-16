import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, scrollTo } from '../performance-squads/shared';
import { HERO, CTA, EVENT_NAME, DAY, SHORT_DAY, TIME, LOGOS, HERO_PHOTO, CLUB, FORM_ANCHOR } from './lpJrDayData';
import { placesLine } from './usePlaces';

// Dark photo hero, the one dark surface above the form (Alex, 12 Oct 2026:
// content sections stay light). On a 375px phone the first screen carries
// what, where (club line), when, cost, age, places left and the button; the
// fact grid underneath repeats them in full for anyone who scrolls.
const LPHero = ({ places }) => {
    const open = places.state === 'open';
    return (
        <section className="relative w-full overflow-hidden bg-rr-dark text-white">
            <img
                src={HERO_PHOTO}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-[70%_center] pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-rr-dark/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/85 to-rr-dark/40" />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 pt-28 sm:pt-40 pb-12 sm:pb-20">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="max-w-3xl">
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7">
                        <img
                            src={LOGOS.club}
                            alt={`${CLUB} logo`}
                            width="480"
                            height="412"
                            className="h-12 sm:h-20 w-auto shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.25em] text-rr-light-pink">
                                {HERO.kicker}
                            </p>
                            <p className="text-sm sm:text-base font-bold text-white mt-0.5">{HERO.withClub}</p>
                        </div>
                    </div>

                    <h1 className="text-[2.2rem] leading-[0.95] sm:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-3 sm:mb-5">
                        {EVENT_NAME}
                    </h1>
                    <p className="text-lg sm:text-3xl font-black text-rr-light-pink leading-snug">
                        <span className="sm:hidden">{SHORT_DAY}</span>
                        <span className="hidden sm:inline">{DAY}</span>
                        {' · '}<span className="whitespace-nowrap">{TIME}</span>
                    </p>
                    <p className="text-base sm:text-xl font-black text-white mt-1 mb-3 sm:mb-5">{HERO.keyLine}</p>
                    <p className="text-white/85 text-[15px] sm:text-lg font-medium leading-relaxed mb-6 max-w-2xl">
                        {HERO.why}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        {open ? (
                            <button
                                type="button"
                                onClick={() => scrollTo(FORM_ANCHOR)}
                                className="group inline-flex items-center justify-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider sm:tracking-widest text-sm rounded-full px-6 sm:px-8 py-4 transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                            >
                                <span>{CTA}<span className="hidden sm:inline"> · Free</span></span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <p className="text-lg font-black uppercase text-white">{placesLine(places)}</p>
                        )}
                        <button
                            type="button"
                            onClick={() => scrollTo('morning')}
                            className="hidden sm:inline text-white/80 hover:text-white text-sm font-bold uppercase tracking-wider underline underline-offset-4 decoration-white/30 hover:decoration-rr-pink py-2"
                        >
                            {HERO.secondaryCta}
                        </button>
                    </div>
                    {open && (
                        <p className="text-white/70 text-[13px] sm:text-sm font-medium leading-relaxed mt-3 max-w-xl">
                            <span className="text-white font-bold">{placesLine(places)}.</span> {HERO.closes}
                        </p>
                    )}

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4 max-w-2xl mt-9 sm:mt-10">
                        {HERO.facts.map((f) => (
                            <div key={f.label} className="border-t border-white/20 pt-2.5 grid grid-cols-[4.5rem_1fr] sm:block gap-3">
                                <dt className="text-[11px] font-black uppercase tracking-[0.2em] text-rr-light-pink sm:mb-1 pt-0.5">{f.label}</dt>
                                <dd className="text-white text-sm sm:text-[15px] font-semibold leading-snug">{f.value}</dd>
                            </div>
                        ))}
                    </dl>
                </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        </section>
    );
};

export default LPHero;

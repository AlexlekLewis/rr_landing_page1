import React from 'react';
import { motion } from 'framer-motion';
import heroTeamTalk from '../../assets/india-tour-2026/hero-team-talk.webp';
import heroTeamTalkSm from '../../assets/india-tour-2026/hero-team-talk-sm.webp';
import heroCafe from '../../assets/india-tour-2026/hero-royals-cafe.webp';
import { CAMP_PDF, TOUR_STATUS, REGISTRATIONS_CLOSE_AT } from './itCopy';
import ITCountdown from './ITCountdown';

const scrollToRegister = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const HERO_FEATURE_ALT =
    'Royals coaches talking to Rajasthan Royals Academy Melbourne players on the main ground at the ' +
    'Rajasthan Royals High Performance Centre in Nagpur, September 2026';
const HERO_INSET_ALT =
    'Our touring group at lunch in the Royals Cafe at the Rajasthan Royals High Performance Centre, under a wall of ' +
    'Royals legends';

const ITHero = ({ copy }) => {
    const c = copy.hero;
    const closed = TOUR_STATUS === 'closed';
    // The clock slot shows a countdown, or the closed notice. With no deadline
    // and the page open (a standing EOI) there is nothing to show, so no gap either.
    const showClock = closed || Boolean(REGISTRATIONS_CLOSE_AT);

    // Ordered as a flex column so the price band can jump ABOVE the intro
    // paragraph on phones. On a 375x812 screen the prices otherwise land right
    // on the fold, and on anything smaller they fall under it — which defeats
    // the point of putting costs in the hero. Desktop keeps the reading order:
    // intro first, then costs.
    const content = (
        <div className="max-w-3xl flex flex-col">
            {/* The headline for the April 2027 tour: coming soon, register now. Tapping
                it goes straight to the form. On a closed page it shows the closed badge. */}
            {closed ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="order-1 inline-flex items-center gap-2 bg-rr-pink rounded-full px-4 py-2.5 mb-6 self-start shadow-lg"
                >
                    <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{c.closedBadge}</span>
                </motion.div>
            ) : (
                <motion.button
                    type="button"
                    onClick={scrollToRegister}
                    data-cta="hero-coming-soon"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="order-1 group self-start text-left mb-6 md:mb-8 rounded-2xl bg-rr-pink hover:bg-rr-light-pink px-5 py-4 md:px-7 md:py-5 shadow-[0_0_40px_rgba(229,6,149,0.35)] transition-colors"
                >
                    <span className="flex items-center gap-2 text-[11px] md:text-xs font-black text-white/80 uppercase tracking-[0.25em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {c.comingSoonLabel}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                        {c.comingSoon}
                        <span aria-hidden="true" className="text-white/60">—</span>
                        <span className="inline-flex items-center gap-2">
                            {c.comingSoonAction}
                            <svg className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </span>
                </motion.button>
            )}

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
                className="order-2 text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.95]"
            >
                <span className="block text-xs md:text-sm font-bold text-white/60 tracking-[0.25em] mb-3">
                    {c.kicker}
                </span>
                {c.h1}
                <span className="block text-rr-pink">{c.h1Accent}</span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                className="order-3 flex items-center gap-3 mt-5"
            >
                <span className="h-px w-10 bg-gradient-to-r from-rr-pink to-rr-blue shrink-0" />
                <span className="text-base md:text-xl font-black text-white uppercase tracking-[0.22em]">
                    {c.dateline}
                </span>
            </motion.div>


            {showClock && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    className="order-4 mt-6"
                >
                    <ITCountdown copy={copy} />
                </motion.div>
            )}

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
                className="order-6 md:order-5 text-base md:text-xl text-white/80 font-medium leading-relaxed mt-5 max-w-xl"
            >
                {c.lead}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                className="order-7 mt-7 md:mt-8 self-start w-full"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {!closed && <button
                        onClick={scrollToRegister}
                        data-cta="hero-register"
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                    >
                        {c.cta}
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>}

                    {/* The official camp document. Size is stated up front — it is a big
                        file and a parent on mobile data deserves the warning. Hidden while
                        CAMP_PDF is null (the only booklet we have is the dated one). */}
                    {CAMP_PDF && <a
                        href={CAMP_PDF.href}
                        download={CAMP_PDF.filename}
                        data-cta="hero-download-pdf"
                        className="group inline-flex items-center gap-3 text-white border border-white/30 hover:border-rr-pink rounded-full px-6 py-4 transition-colors justify-center sm:justify-start"
                    >
                        <svg className="w-5 h-5 shrink-0 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                        </svg>
                        <span className="text-left">
                            <span className="block text-sm font-bold uppercase tracking-widest leading-tight">
                                {c.downloadLabel}
                            </span>
                            <span className="block text-xs text-white/60 font-medium normal-case tracking-normal mt-0.5">
                                {c.downloadSub(CAMP_PDF.sizeLabel)}
                            </span>
                        </span>
                    </a>}
                </div>
            </motion.div>
        </div>
    );

    // Hero layout follows the Junior Royals hero (Nov 2026): a real photo from our
    // September 2026 tour behind the words (stronger on phones, faint on desktop),
    // and on desktop two framed photos beside them telling the story: the team
    // talk on the ground with the Royals coaches, and lunch in the Royals Cafe.
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-rr-dark">
            <img
                src={heroTeamTalk}
                srcSet={`${heroTeamTalkSm} 800w, ${heroTeamTalk} 1600w`}
                sizes="100vw"
                alt=""
                aria-hidden="true"
                fetchPriority="high"
                className="absolute inset-0 w-full h-full object-cover object-[center_45%] opacity-50 lg:opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-rr-dark/90 via-rr-dark/75 to-rr-dark/95 lg:bg-gradient-to-br lg:from-rr-dark lg:via-rr-dark/85 lg:to-rr-navy/70" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rr-blue/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-20 container mx-auto px-6 pt-28 md:pt-32 pb-20 max-w-6xl lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:items-center">
                {content}

                {/* Desktop: two framed photos from the September 2026 tour. */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="hidden lg:block relative h-[560px]"
                >
                    <img
                        src={heroTeamTalk}
                        alt={HERO_FEATURE_ALT}
                        className="absolute right-0 top-0 w-[86%] h-[400px] object-cover object-[35%_50%] rounded-3xl border-4 border-white/10"
                    />
                    <img
                        src={heroCafe}
                        alt={HERO_INSET_ALT}
                        className="absolute left-0 bottom-0 w-[62%] h-[250px] object-cover object-[60%_50%] rounded-3xl border-4 border-rr-dark"
                    />
                    <span className="absolute right-4 bottom-20 bg-rr-pink text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                        {c.photoTag}
                    </span>
                </motion.div>
            </div>
        </section>
    );
};

export default ITHero;

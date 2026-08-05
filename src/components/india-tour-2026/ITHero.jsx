import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../../assets/india-tour-2026/hero-coaching.jpg';
import { getTiers, fmtAUD, FLIGHT_ESTIMATE_AUD } from './itCopy';

const scrollToRegister = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const scrollToPricing = () =>
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });

// The source is a 1280x720 video frame, so how much we stretch it decides how
// soft it looks. On phones we DON'T use it as a full-bleed background behind
// ~1200px of copy (that meant blowing 720px up to ~3600 device px). Instead the
// mobile hero is a contained 16:10 block: a 375pt-wide phone at 3x needs about
// 1125x703 device px, which the source covers almost 1:1.
//
// object-position keeps the demonstrating coach in the pink Royals top — the
// subject of the shot, sitting about a third of the way across — centred once
// the frame is cropped narrower than 16:9.
const FOCAL = '34% 42%';

const HERO_IMG_ALT =
    'A Rajasthan Royals Academy coach demonstrating a batting drill to players at the ' +
    'High Performance Centre in Nagpur';

const ITHero = ({ copy }) => {
    const tiers = getTiers(copy);
    const c = copy.hero;

    const priceBand = (
        <>
            <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.25em]">
                {c.costLabel}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {tiers.map((t, i) => (
                    <div key={t.key} className={i > 0 ? 'sm:pl-6 sm:border-l sm:border-white/20' : undefined}>
                        <p className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-black text-white leading-none">
                                {fmtAUD(t.price)}
                            </span>
                            <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
                                incl GST
                            </span>
                        </p>
                        <p className="text-sm text-white/75 font-medium leading-snug mt-2">{t.heroWho}</p>
                    </div>
                ))}
            </div>

            <p className="text-sm text-white/70 font-medium leading-relaxed mt-5">
                <strong className="text-white">{c.flightsLead}</strong> {c.flights}
                {FLIGHT_ESTIMATE_AUD && c.flightsEstimate && (
                    <> <span className="text-white">{c.flightsEstimate(FLIGHT_ESTIMATE_AUD)}</span></>
                )}
            </p>

            <button
                onClick={scrollToPricing}
                data-cta="hero-see-pricing"
                className="mt-4 text-sm font-bold text-rr-pink hover:text-white uppercase tracking-widest inline-flex items-center gap-2 transition-colors"
            >
                {c.seeIncluded}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>
        </>
    );

    // Ordered as a flex column so the price band can jump ABOVE the intro
    // paragraph on phones. On a 375x812 screen the prices otherwise land right
    // on the fold, and on anything smaller they fall under it — which defeats
    // the point of putting costs in the hero. Desktop keeps the reading order:
    // intro first, then costs.
    const content = (
        <div className="max-w-3xl flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="order-1 inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/40 rounded-full px-4 py-2 mb-4 md:mb-6 self-start"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-[0.25em]">{c.badge}</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
                className="order-2 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none"
            >
                India Tour
                <span className="block text-rr-pink">2026</span>
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

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
                className="order-5 md:order-4 text-base md:text-xl text-white/80 font-medium leading-relaxed mt-5 max-w-xl"
            >
                {c.lead}
            </motion.p>

            {/* Costs, up front. Each number carries its tier and the flights caveat —
                a bare "$2,100" here would mean nothing to someone reading cold. */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.32 }}
                className="order-4 md:order-5 mt-6 md:mt-7 pt-5 md:pt-6 border-t border-white/20 max-w-xl"
            >
                {priceBand}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                className="order-6 mt-7 md:mt-8 self-start w-full sm:w-auto"
            >
                <button
                    onClick={scrollToRegister}
                    data-cta="hero-register"
                    className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                    {c.cta}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </motion.div>
        </div>
    );

    // One DOM tree for both layouts — the image wrapper is in normal flow on
    // phones (contained 16:10 block above the copy) and becomes an absolute
    // full-bleed background from md up. Rendering the copy twice would put two
    // <h1>India Tour 2026</h1> in the document, which hurts SEO and screen
    // readers even when one copy is display:none.
    return (
        <section className="relative bg-rr-dark overflow-hidden md:flex md:items-center md:min-h-[88vh]">
            <div className="relative w-full aspect-[16/10] overflow-hidden md:absolute md:inset-0 md:w-auto md:h-full md:aspect-auto">
                <img
                    src={heroImg}
                    alt={HERO_IMG_ALT}
                    width={1280}
                    height={720}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: FOCAL }}
                />
                {/* Phones: short fade where the image meets the copy. */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-rr-dark to-transparent md:hidden" />
                {/* md+: darken the left so the copy stays legible over the photo. */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/80 to-transparent" />
            </div>

            <div className="hidden md:block absolute -top-24 -left-24 w-96 h-96 bg-rr-pink/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative px-6 pt-6 pb-14 md:container md:mx-auto md:py-24">{content}</div>
        </section>
    );
};

export default ITHero;

import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../../assets/india-tour-2026/hero-coaching.jpg';
import { getTiers, fmtAUD, FLIGHT_ESTIMATE_AUD, CAMP_PDF } from './itCopy';
import ITCountdown from './ITCountdown';

const scrollToRegister = () =>
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });

const scrollToPricing = () =>
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });

// The source is a 1280x720 video frame, so how much we stretch it decides how
// soft it looks. On phones we DON'T use it as a full-bleed background behind
// ~1200px of copy (that meant blowing 720px up to ~3600 device px, hence the
// blur). Instead the mobile hero is a contained 4:3 block sitting below the
// fixed navbar, so the source is barely scaled at all.
//
// object-position keeps the demonstrating coach in the pink Royals top — the
// subject of the shot, about a third of the way across — in frame once the
// image is cropped. The 4:3 box IS narrower than the 16:9 source, so this
// crops the sides and shows the full height of the photo: heads included.
const FOCAL = '34% 42%';

const HERO_IMG_ALT =
    'Sid Lahiri, Head of Global Academies for the Rajasthan Royals, demonstrating a batting ' +
    'drill to players at the High Performance Centre in Nagpur';

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
                className="mt-3 -ml-1 px-1 py-3 text-sm font-bold text-rr-pink hover:text-white uppercase tracking-widest inline-flex items-center gap-2 transition-colors"
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
                className="order-1 inline-flex items-center gap-2 bg-rr-pink rounded-full px-4 py-2.5 mb-4 md:mb-6 self-start shadow-lg"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{c.badge}</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
                className="order-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none"
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="order-4 mt-6"
            >
                <ITCountdown copy={copy} />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
                className="order-6 md:order-5 text-base md:text-xl text-white/80 font-medium leading-relaxed mt-5 max-w-xl"
            >
                {c.lead}
            </motion.p>

            {/* Costs, up front. Each number carries its tier and the flights caveat —
                a bare "$2,100" here would mean nothing to someone reading cold. */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.32 }}
                className="order-5 md:order-6 mt-6 md:mt-7 pt-5 md:pt-6 border-t border-white/20 max-w-xl"
            >
                {priceBand}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                className="order-7 mt-7 md:mt-8 self-start w-full"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

                    {/* The official camp document. Size is stated up front — it is a big
                        file and a parent on mobile data deserves the warning. */}
                    <a
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
                    </a>
                </div>
            </motion.div>
        </div>
    );

    // One DOM tree for both layouts — the image wrapper is in normal flow on
    // phones (contained 16:10 block above the copy) and becomes an absolute
    // full-bleed background from md up. Rendering the copy twice would put two
    // <h1>India Tour 2026</h1> in the document, which hurts SEO and screen
    // readers even when one copy is display:none.
    return (
        <section className="relative bg-rr-navy overflow-hidden md:flex md:items-center md:min-h-[88vh]">
            {/* The site navbar is position:fixed and 80px tall. This block starts at
                top:0, so the nav was covering the top 80px of a ~258px image — which is
                exactly where the players' heads are, leaving only legs visible. Push the
                image down clear of the nav on phones (mt-20 = the nav's 80px) and give it
                a little more height so the full bodies have room. Desktop is unaffected:
                there the image is a full-bleed background and the nav only overlaps sky. */}
            <div className="relative w-full mt-20 aspect-[4/3] overflow-hidden md:mt-0 md:absolute md:inset-0 md:w-auto md:h-full md:aspect-auto">
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
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-rr-navy to-transparent md:hidden" />
                {/* md+: darken the left so the copy stays legible over the photo. */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-rr-navy via-rr-navy/88 to-transparent" />
            </div>

            <div className="hidden md:block absolute -top-24 -left-24 w-96 h-96 bg-rr-pink/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative px-6 pt-6 pb-14 md:container md:mx-auto md:pt-40 md:pb-24">{content}</div>
        </section>
    );
};

export default ITHero;

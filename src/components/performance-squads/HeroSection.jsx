import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, scrollTo } from './shared';

// Every prop defaults to what this hero has always shown, so a page that
// renders <HeroSection /> with no props (the open age trial page) is unchanged.
// /performance-squads passes its own lines, an announcement and its buttons.
const HeroSection = ({
    tagline = 'Trial. Earn your spot. Represent the Royals Academy.',
    body = null,                // replaces the default paragraph when given
    announcement = null,        // { label, text, target } — a strip above the title
    primary = { label: 'Register for a Trial', target: 'trials' },
    secondary = { label: 'How it works', target: 'pathway' },
    eyebrow = 'Rajasthan Royals Academy Melbourne',
    priceLine = null,           // a facts line under the body (prices), when given
    buttonNote = null,          // a small line under the buttons, when given
}) => (
    <section className="relative min-h-[92svh] w-full overflow-hidden flex items-center">
        {/* bg-gradient-rr is a dead class; the gradient is a CSS variable. */}
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'var(--image-gradient-rr)' }} />
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
                {announcement && (
                    <button
                        onClick={() => scrollTo(announcement.target)}
                        className="group mb-6 flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-2 sm:gap-3 text-left bg-white/10 hover:bg-white/15 border border-rr-pink/50 rounded-2xl sm:rounded-full px-4 py-3 transition-colors"
                    >
                        <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-rr-pink rounded-full px-3 py-1.5">
                            {announcement.label}
                        </span>
                        <span className="text-white text-sm font-bold leading-snug">
                            {announcement.text}
                        </span>
                        <ArrowRight className="hidden sm:block w-4 h-4 text-rr-light-pink shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                )}
                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white bg-rr-pink rounded-full px-5 py-2 mb-6">
                    {eyebrow}
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6">
                    Performance<br />Squads
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-rr-light-pink mb-4">
                    {tagline}
                </p>
                <p className={`text-white/70 text-[15px] sm:text-lg font-medium leading-relaxed ${priceLine ? 'mb-5' : 'mb-10'}`}>
                    {body || (
                        <>
                            Our Performance Squads are the representative arm of the Rajasthan Royals Academy — squads of
                            like-skilled, like-motivated players who train together and compete together.
                            Every player earns their place at an open <span className="text-white font-bold">trial</span>.
                        </>
                    )}
                </p>
                {priceLine && (
                    <p className="text-white text-[15px] sm:text-lg font-bold leading-relaxed mb-10">
                        {priceLine}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-start">
                    <button
                        onClick={() => scrollTo(primary.target)}
                        className="inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        {primary.label} <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scrollTo(secondary.target)}
                        className="inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                    >
                        {secondary.label}
                    </button>
                </div>
                {buttonNote && (
                    <p className="text-white/60 text-sm font-medium leading-relaxed mt-4">
                        {buttonNote}
                    </p>
                )}
            </motion.div>
        </div>
    </section>
);

export default HeroSection;

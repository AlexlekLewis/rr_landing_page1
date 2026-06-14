import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

// Conversion-first hero for cold paid-Meta mobile traffic.
// Goal: confirm the offer + give a way to act WITHOUT scrolling.
// Rendered fully opaque by default (no opacity:0 gate) so it can never
// blank-flash in the Instagram / Facebook in-app browser.
const HeroSection = ({ onApply, onHowItWorks }) => {
    return (
        <section className="relative min-h-[94svh] w-full overflow-hidden flex items-end bg-rr-dark">
            {/* Real Royals power-hitting action shot */}
            <img
                src="/assets/jaiswal-power.webp"
                alt="Rajasthan Royals batter hitting with power under lights"
                className="absolute inset-0 w-full h-full object-cover object-[12%_center] sm:object-[8%_center]"
            />
            {/* Legibility scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/85 to-rr-dark/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-rr-dark/70 via-transparent to-transparent" />

            <div className="relative z-10 w-full max-w-2xl mx-auto sm:mx-0 px-5 pb-28 pt-28 sm:pb-14 sm:pt-36 sm:pl-10 lg:pl-16 text-center sm:text-left">
                {/* Eyebrow + small lockup */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-4">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-white/80 bg-white/10 border border-white/15 rounded-full px-3 py-1">
                        Rajasthan Royals Academy · Melbourne
                    </span>
                </div>

                {/* Headline — sentence case for mobile readability; power words in pink */}
                <h1 className="text-[2.1rem] leading-[1.05] sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
                    Start your pre-season the <span className="text-rr-pink">Royals way</span> — with real <span className="text-rr-pink">power</span>.
                </h1>

                {/* Sub-line — names the prize for an ambitious rep player */}
                <p className="text-[15px] sm:text-lg text-white/85 font-medium leading-snug max-w-xl mx-auto sm:mx-0 mb-5">
                    The 8-week Power Pre-Season for elite cricketers — whether you&apos;re chasing VMCU selection, Dowling Shield, Marg Jennings or Premier cricket and beyond. Build genuine power with bat, ball and in the field, and walk into round one ahead of the rest.
                </p>

                {/* Offer + risk reversal */}
                <div className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-sm font-bold mb-5">
                    <ShieldCheck className="w-4 h-4 text-rr-pink flex-shrink-0" strokeWidth={2.5} />
                    <span>From <span className="text-white">$989</span> · No payment until a coach confirms your spot</span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                    <button
                        onClick={onApply}
                        className="group inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-8 py-4 transition-all hover:shadow-[0_0_30px_rgba(229,6,149,0.5)]"
                    >
                        Apply now
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                        onClick={onHowItWorks}
                        className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full px-6 py-4 transition-all"
                    >
                        See how it works
                    </button>
                </div>

                {/* Honest scarcity — squads fill on a first-in basis */}
                <div className="inline-flex items-start gap-2 text-left bg-rr-pink/15 border border-rr-pink/40 rounded-xl px-3.5 py-2.5 max-w-md mx-auto sm:mx-0">
                    <span className="text-rr-pink text-base leading-none mt-0.5">★</span>
                    <span className="text-[12.5px] text-white/90 font-semibold leading-snug">
                        Squad spots are <span className="text-white font-black">limited at each centre</span> — squads are filling now, so apply early to lock yours in.
                    </span>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

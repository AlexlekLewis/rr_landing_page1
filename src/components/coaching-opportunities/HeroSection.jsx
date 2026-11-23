import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Hero for /careers (Andy, 23 Nov 2026: "let's have some nice images of people
// coaching at the top"). Our coaching photos are 720–900px wide, too small to
// stretch across a desktop screen without going soft, so they sit as a sharp
// three-photo collage: above the headline on a phone, beside it on desktop.
// No pulsing dot on the eyebrow (Andy, 23 Nov 2026).
const HERO_PHOTOS = [
    { src: '/junior-royals/videos/coaching-young-batter.jpg', alt: 'A Royals Academy coach kneeling beside a young batter in the nets, adjusting his stance', pos: 'object-[center_30%]' },
    { src: '/junior-royals/videos/sweep-shot.jpg', alt: 'A Royals Academy coach in academy kit demonstrating a shot to young batters in the indoor nets', pos: 'object-[center_25%]' },
    { src: '/assets/junior-royals/gallery/coach-demo-bat.webp', alt: 'A coach showing young players how to hold the bat in front of the Rajasthan Royals Academy banner', pos: 'object-[center_40%]' },
];

const fade = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});

const Collage = () => (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 md:gap-3 h-[300px] sm:h-[380px] md:h-[460px] lg:h-[540px]">
        {HERO_PHOTOS.map((p, i) => (
            <motion.div
                key={p.src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                className={`relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 ${
                    i === 0 ? 'col-span-2 row-span-2' : ''
                }`}
            >
                <img
                    src={p.src}
                    alt={p.alt}
                    fetchpriority={i === 0 ? 'high' : undefined}
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover ${p.pos}`}
                />
            </motion.div>
        ))}
    </div>
);

const HeroSection = () => {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section className="relative overflow-hidden bg-rr-dark">
            {/* Soft brand glow behind the photos */}
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-rr-pink/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-48 -left-40 w-[520px] h-[520px] rounded-full bg-rr-blue/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-40 pb-16 md:pb-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Photos: first on a phone, right-hand column on desktop */}
                <div className="md:order-2">
                    <Collage />
                </div>

                <div className="md:order-1">
                    <motion.div
                        {...fade(0)}
                        className="inline-flex items-center bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-5"
                    >
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">We're Hiring Coaches</span>
                    </motion.div>

                    <motion.h1
                        {...fade(0.15)}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-5"
                    >
                        COACH WITH<br />
                        <span className="text-rr-pink">RAJASTHAN ROYALS</span><br />
                        ACADEMY MELBOURNE
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="w-16 h-px bg-gradient-to-r from-rr-pink to-rr-blue mb-5 origin-left"
                    />

                    <motion.p
                        {...fade(0.4)}
                        className="text-base md:text-lg text-white/85 font-medium leading-relaxed max-w-xl mb-7"
                    >
                        Coach some of Melbourne's best young cricketers inside the Royals Group, with the chance to travel to the Rajasthan Royals High Performance Centre in India. Experienced coach or just starting out, there's a role for you.
                    </motion.p>

                    <motion.div {...fade(0.55)} className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => scrollTo('application-form')}
                            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 justify-center"
                        >
                            Apply to Coach
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollTo('benefits')}
                            className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center"
                        >
                            See the Benefits
                        </button>
                    </motion.div>
                    <button
                        type="button"
                        onClick={() => scrollTo('more-info')}
                        className="mt-5 text-sm text-white/80 hover:text-white font-semibold underline underline-offset-4 decoration-rr-pink"
                    >
                        Not ready to apply? Get more information
                    </button>
                </div>
            </div>

            <motion.button
                onClick={() => scrollTo('what-it-is')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50 hover:text-white transition-colors"
                aria-label="Scroll down"
            >
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </section>
    );
};

export default HeroSection;

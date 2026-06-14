import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// Timeline of training phases (cards) interleaved with match periods (banners).
// Update price/onSale as further phases go on sale.
const PHASES = [
    {
        num: '01',
        name: 'Power Pre-Season',
        window: 'Late July → Mid September',
        rate: '2 hours / week',
        price: 989,
        priceRate: '$62 per hour',
        onSale: true,
        tagline: 'A Powerful Start',
        description:
            "Our Academy players demonstrate rapid growth in their game. This Phase 1 is perfect timing to kick-start your season and get off to a flyer.",
        points: [
            'Minimum 2 hours per week for 8 weeks in your allocated squad',
            'Program content straight from the Royals development ecosystem designed to develop and understand power with bat, ball and in the field',
            'Top Royals Academy coaches with a mix of skills and experiences at the highest level, through to current players applying their skills in Melbourne and across the world',
            'A mix of 1:1 up to 1:4 coaches, through to small and large groups depending on the plan and focus of the session',
            'Invite to the Royals High Performance Centre September and March Camps',
            'Access to our world-first game & development management application, our Player Performance Portal',
            'Access to performance tracking with our Performance Partners Full Track AI and Str8 Bat',
            'Access to the Australian-first NeuroVision program built for Royals Academy',
            'Selection opportunities for our Power League match series played at various times from Sept 2026 - April 2027',
            'Exposure to clubs across Victoria scouting the next talent and marquee T20 player',
        ],
        accent: 'from-rr-blue to-rr-medium-blue',
    },
    {
        num: '02',
        name: 'Power Season',
        window: 'October → end of January',
        rate: '2 hours / week',
        price: 0, // TBC
        onSale: false,
        tagline: 'Apply Under Pressure',
        description:
            "Live feedback loop. Work on what the weekend's club matches revealed and develop it in real time.",
        points: [
            'Apply the methodology in real club matches',
            'Live feedback loop on what the weekend revealed',
            'Develop your game in real time across the season',
            'Build toward the Late January Carnival',
        ],
        accent: 'from-rr-pink to-rr-blue',
    },
    {
        num: '03',
        name: 'Power Finish',
        window: 'February → March',
        rate: '2 hours / week',
        price: 0, // TBC
        onSale: false,
        tagline: 'How You Finish Changes Everything',
        description:
            "How strong you finish the season can win finals, get you selected in squads, and kick-start an entire new level of cricket.",
        points: [
            'Address what didn\'t hold up at carnival',
            'Peak when it matters — win finals cricket',
            'Put yourself in front of squad selectors',
            'Kick-start an entire new level of cricket',
        ],
        accent: 'from-rr-pink to-rr-light-pink',
    },
];

// Do the maths — what an hour of coaching costs elsewhere vs here. Anchors the
// Phase 1 "$62 per hour" claim with proof, in one place. Other-program figures are
// typical local offers (not named); ours derives from $989 ÷ (8 weeks × 2 hrs) = 16 hrs.
const HOUR_MATHS = [
    { who: 'Other programs', price: '$900', detail: '6 weeks × 1.5 hrs = 9 hrs of coaching', perHour: '$100', us: false },
    { who: 'Other programs', price: '$800', detail: '7 weeks × 1 hr = 7 hrs of coaching', perHour: '$114', us: false },
    { who: 'The Power Game', price: '$989', detail: '8 weeks × 2 hrs = 16 hrs of coaching', perHour: '$62', us: true },
];

const formatPrice = (n) => (n > 0 ? `$${n.toLocaleString()}` : 'TBC');

const PhaseCard = ({ phase, idx }) => (
    <motion.div
        className={`relative backdrop-blur-sm rounded-2xl p-8 flex flex-col overflow-hidden transition-all duration-300 ${
            phase.onSale
                ? 'bg-white/[0.07] border-2 border-rr-pink shadow-[0_10px_50px_rgba(225,31,143,0.3)] md:-translate-y-3'
                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rr-pink/40'
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
    >
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.accent}`} />

        {phase.onSale && (
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-rr-pink rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">On Sale Now</span>
            </div>
        )}

        <div className="flex items-baseline justify-between mb-4">
            <span className="text-5xl font-black text-white/10 leading-none">{phase.num}</span>
            <span className="text-[10px] font-bold text-rr-pink uppercase tracking-widest bg-rr-pink/10 border border-rr-pink/30 rounded-full px-3 py-1">
                Phase {Number(phase.num)}
            </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-none mb-2">
            {phase.name}
        </h3>
        <div className="text-xs font-medium text-white/60 mb-1">{phase.window}</div>
        <div className="text-[11px] font-bold text-rr-pink uppercase tracking-widest mb-5">{phase.rate}</div>

        <div className="text-base md:text-lg font-black text-white uppercase tracking-wide mb-2">
            {phase.tagline}
        </div>
        <p className="text-sm text-white/75 font-medium leading-relaxed mb-5">
            {phase.description}
        </p>

        {phase.points && (
            <ul className="space-y-2.5 mb-6">
                {phase.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-rr-pink flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/85 font-medium leading-snug">{pt}</span>
                    </li>
                ))}
            </ul>
        )}

        <div className="pt-5 border-t border-white/10">
            <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Phase Price</div>
            <div className="text-3xl font-black text-white">{formatPrice(phase.price)}</div>
            {phase.priceRate && (
                <div className="text-xs font-medium text-white/50 mt-1">{phase.priceRate}</div>
            )}
            {phase.onSale ? (
                <a
                    href="#apply"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                >
                    Apply Now
                </a>
            ) : (
                <span
                    aria-disabled="true"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white/50 font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-full cursor-not-allowed select-none"
                >
                    Coming Soon
                </span>
            )}
        </div>
    </motion.div>
);

const PricingSection = () => {
    return (
        <section className="bg-rr-page py-24 md:py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(225,31,143,0.18) 0%, rgba(0,0,0,0) 55%)' }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            Three Training Phases
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        THE <span className="text-rr-pink">ROYALS</span> JOURNEY
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        An ongoing program from late July through finals cricket in March — two hours a week, bought one phase at a time. You start with <span className="text-white font-bold">Phase 1, the Power Pre-Season</span> (on sale now); Phases 2 and 3 open as the season unfolds.
                    </p>
                </motion.div>

                {/* Phases — vertical cards in a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_1fr] gap-6 md:gap-8 lg:items-start mb-12">
                    {PHASES.map((phase, idx) => (
                        <PhaseCard key={phase.name} phase={phase} idx={idx} />
                    ))}
                </div>

                {/* Do the maths — the value case for Phase 1, made once, right here. */}
                <motion.div
                    className="max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="text-center text-rr-pink font-black uppercase tracking-[0.25em] text-[11px] mb-4">Do the maths — cost per hour</div>
                    <div className="flex flex-col gap-2.5">
                        {HOUR_MATHS.map((r, i) => (
                            <div key={i} className={`flex items-center justify-between gap-3 rounded-xl px-5 py-3.5 border ${r.us ? 'bg-rr-pink/10 border-rr-pink/40' : 'bg-white/5 border-white/10'}`}>
                                <div>
                                    <div className={`text-sm md:text-base font-black uppercase tracking-wide ${r.us ? 'text-white' : 'text-white/70'}`}>{r.who} · {r.price}</div>
                                    <div className="text-[11px] md:text-xs text-white/45">{r.detail}</div>
                                </div>
                                <div className={`text-2xl md:text-3xl font-black ${r.us ? 'text-rr-light-pink' : 'text-white/55'}`}>{r.perHour}<span className="text-[10px] font-bold text-white/40">/hr</span></div>
                            </div>
                        ))}
                    </div>
                    <p className="text-white/55 text-sm text-center mt-4 font-medium">Nearly double the coaching hours — at the lowest cost per hour.</p>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;

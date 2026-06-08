import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trophy } from 'lucide-react';

// Timeline of training phases (cards) interleaved with match periods (banners).
// Update price/onSale as further phases go on sale.
const PHASES = [
    {
        num: '01',
        name: 'Preseason',
        window: 'Late July → September school hols',
        rate: '2 hours / week',
        price: 960,
        priceRate: '$60 per hour',
        onSale: true,
        tagline: 'Foundation & Identity',
        description:
            "Establish strengths and archetype. Build the game-intelligence toolset and the technical foundations.",
        points: [
            'Establish your batting, bowling or keeping archetype',
            'Build the game-intelligence toolset',
            'Lay the technical and physical foundations',
            'Prepare to perform in the September matches',
        ],
        accent: 'from-rr-blue to-rr-medium-blue',
    },
    {
        num: '02',
        name: 'In-Season',
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
        name: 'Finish Strong',
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

// Match periods sit between phases: after Phase 1 and after Phase 2.
const MATCH_PERIODS = {
    afterPhase: {
        1: {
            name: 'September Matches',
            description: 'During the September school holidays — the first competitive test of preseason work.',
        },
        2: {
            name: 'Late January Carnival',
            description: "The second match block — showcasing what's been built across the season.",
        },
    },
};

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
        <div className="text-[11px] font-bold text-rr-blue uppercase tracking-widest mb-5">{phase.rate}</div>

        <div className="text-base md:text-lg font-black text-white uppercase tracking-wide mb-2">
            {phase.tagline}
        </div>
        <p className="text-sm text-white/75 font-medium leading-relaxed mb-5 flex-1">
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
            {phase.onSale && (
                <a
                    href="#apply"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]"
                >
                    Apply Now
                </a>
            )}
        </div>
    </motion.div>
);

const MatchBanner = ({ match }) => (
    <motion.div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rr-navy via-rr-blue to-rr-pink p-6 md:p-7 border border-rr-pink/30"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
    >
        <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
            <div className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
                <div className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">Match Period</div>
                <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-wide leading-tight">
                    {match.name}
                </h4>
                <p className="text-sm text-white/85 font-medium mt-1 max-w-2xl">{match.description}</p>
            </div>
        </div>
    </motion.div>
);

const PricingSection = () => {
    return (
        <section className="bg-rr-dark py-24 md:py-32 relative overflow-hidden">
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
                            Three Training Blocks · Two Match Periods
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        THE <span className="text-rr-pink">POWER GAME</span> JOURNEY
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        An ongoing program from late July through finals cricket in March. Two hours per week, every week of each training block — with breaks during school holidays so your player has time to rest, recover, and be a kid.
                    </p>
                </motion.div>

                {/* Phases — vertical cards in a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {PHASES.map((phase, idx) => (
                        <PhaseCard key={phase.name} phase={phase} idx={idx} />
                    ))}
                </div>

                {/* Match periods between the training blocks */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rr-pink/40" />
                    <span className="text-xs md:text-sm font-black text-rr-pink uppercase tracking-widest text-center">
                        Two Match Periods
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rr-pink/40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.values(MATCH_PERIODS.afterPhase).map((match) => (
                        <MatchBanner key={match.name} match={match} />
                    ))}
                </div>

                <p className="text-center text-xs md:text-sm text-white/50 mt-12 font-medium uppercase tracking-widest">
                    In-Season &amp; Finish Strong pricing to be confirmed
                </p>
            </div>
        </section>
    );
};

export default PricingSection;

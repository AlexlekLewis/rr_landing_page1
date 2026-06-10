import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, TrendingUp, Crown, Repeat, Trophy, Target } from 'lucide-react';

// Who the Power Game Program is for — spanning emerging juniors through to
// established senior players. Language assumes players meet the minimum
// standard (VMCU / Country representative cricket or higher).
const AUDIENCE = [
    {
        icon: Sprout,
        tag: 'Ages 12–14',
        title: 'The Emerging Talent',
        description: 'Young representative players ready to discover their archetype and build genuine power foundations early in their journey.',
    },
    {
        icon: TrendingUp,
        tag: 'Ages 14–16',
        title: 'The Pathway Player',
        description: 'Rep cricketers pushing for academy, district and state-age honours who want to separate themselves with elite power skills.',
    },
    {
        icon: Crown,
        tag: 'Ages 17–Open',
        title: 'The Senior Performer',
        description: 'Premier and senior club players adding power dimensions to a proven game — and chasing the next level of cricket.',
    },
    {
        icon: Target,
        tag: 'Every Discipline',
        title: 'Batters, Bowlers & Keepers',
        description: 'Whatever your role, the program develops power your way — 360 hitting, power bowling with intent, and explosive fielding.',
    },
    {
        icon: Repeat,
        tag: 'All-Rounders',
        title: 'The Complete Cricketer',
        description: 'Multi-skilled players who want to build power across every facet of their game and become impossible to leave out.',
    },
    {
        icon: Trophy,
        tag: 'Driven to Compete',
        title: 'The Ambitious Player',
        description: 'Representative-standard cricketers who want exposure, selection opportunities, and a clear pathway to perform when it counts.',
    },
];

const FeaturesBenefits = () => {
    return (
        <section className="bg-rr-page pt-8 md:pt-12 pb-24 md:pb-32">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            Who It's For
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        IS THIS <span className="text-rr-pink">YOU</span>?
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        Built for representative-standard cricketers — from emerging 12-year-olds to established senior players — who want to add genuine power to their game. If you're playing VMCU / Country representative cricket or higher, this is for you.
                    </p>
                </motion.div>

                {/* Mobile: compact rows */}
                <div className="sm:hidden divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                    {AUDIENCE.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                className="flex items-start gap-3.5 p-4"
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.35, delay: Math.min(idx, 4) * 0.05, ease: 'easeOut' }}
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-rr-blue to-rr-pink flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-black text-rr-pink uppercase tracking-widest mb-0.5">{item.tag}</div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wide leading-tight mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-[13px] text-rr-charcoal font-medium leading-snug">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Tablet / desktop: card grid */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {AUDIENCE.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                className="group relative bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:border-rr-pink/40 hover:shadow-[0_10px_40px_rgba(225,31,143,0.12)] transition-all duration-300 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.45, delay: (idx % 3) * 0.08, ease: 'easeOut' }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-blue to-rr-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="flex items-center justify-between mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rr-blue to-rr-pink flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-[10px] font-black text-rr-pink uppercase tracking-widest bg-rr-pink/10 border border-rr-pink/30 rounded-full px-3 py-1">
                                        {item.tag}
                                    </span>
                                </div>
                                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wide leading-tight mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-rr-charcoal font-medium leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesBenefits;

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Target, Shield, Zap, Network, Activity, Trophy, Search } from 'lucide-react';

const INCLUSIONS = [
    {
        icon: Plane,
        title: 'September Nagpur HP Camp',
        description: 'Become eligible for selection to the Rajasthan Royals High Performance Camp in Nagpur this September.',
    },
    {
        icon: Target,
        title: '360° Power Hitting',
        description: 'A comprehensive power-hitting program that builds a 360 mentality and the skill set to access every area of the ground.',
    },
    {
        icon: Shield,
        title: 'Elite Power Fielding',
        description: 'Learn the techniques and develop the skills to become a genuine power fielder.',
    },
    {
        icon: Zap,
        title: 'Modern Matrix Power Bowling',
        description: 'Bowlers learn modern matrix power-bowling skills to dominate and dictate terms to batters.',
    },
    {
        icon: Network,
        title: 'Inside the Royals Ecosystem',
        description: 'Become part of the Rajasthan Royals ecosystem — connected to the people, methods, and pathway.',
    },
    {
        icon: Activity,
        title: 'Real-Time Performance Tracking',
        description: 'Have your development and performances tracked in real time by the most sophisticated system in the game.',
    },
    {
        icon: Trophy,
        title: 'Power League Selection',
        description: 'Put yourself up for selection for our Power League series — held at specific times from September through to April 2027.',
    },
    {
        icon: Search,
        title: 'Exposure to Victorian Clubs',
        description: 'Showcase your white-ball and T20 skills to clubs across Victoria looking for the next star T20 player.',
    },
];

const FeaturesBenefits = () => {
    return (
        <section className="bg-white pt-8 md:pt-12 pb-24 md:pb-32">
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
                            What's in the Program
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        WHAT YOU <span className="text-rr-pink">GET</span>
                    </h2>
                    <p className="text-base md:text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Every element of the Power Game Program — from elite skill development to real-world exposure and a pathway into the Royals system.
                    </p>
                </motion.div>

                {/* ===== Mobile: compact rows (icon + title + one-line desc) ===== */}
                <div className="sm:hidden divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                    {INCLUSIONS.map((item, idx) => {
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
                                    <h3 className="text-sm font-black text-rr-dark uppercase tracking-wide leading-tight mb-1">
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

                {/* ===== Tablet / desktop: card grid ===== */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {INCLUSIONS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                className="group relative bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:border-rr-pink/40 hover:shadow-[0_10px_40px_rgba(225,31,143,0.12)] transition-all duration-300 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.45, delay: (idx % 4) * 0.08, ease: 'easeOut' }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-blue to-rr-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rr-blue to-rr-pink flex items-center justify-center mb-5">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-base md:text-lg font-black text-rr-dark uppercase tracking-wide leading-tight mb-2">
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

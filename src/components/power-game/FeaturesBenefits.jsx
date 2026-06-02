import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy } from 'lucide-react';

const FEATURES = [
    'Power hitting framework for T20 and white-ball cricket',
    'Bowling speed and intent development with biomechanical analysis',
    'Athletic fielding sessions focused on explosive movement and throwing',
    'Strength &amp; conditioning programming tailored to power output',
    'Match-scenario training under pressure',
    'Video review and data tracking each session',
];

const BENEFITS = [
    'Hit further and clear the boundary with consistency',
    'Bowl faster with more intent across all phases',
    'Save runs and create wickets with elite fielding',
    'Build a body that holds up to elite training loads',
    'Develop the mindset to express power in big moments',
    'Walk away with clear data on your improvement',
];

const FeaturesBenefits = () => {
    return (
        <section className="bg-white pt-8 md:pt-12 pb-24 md:pb-32">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        WHAT YOU <span className="text-rr-pink">GET</span>
                    </h2>
                    <p className="text-base md:text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Inside the program — what each session delivers, and what you walk away with.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* FEATURES */}
                    <motion.div
                        className="bg-slate-50 border-l-4 border-rr-blue rounded-2xl p-8 md:p-10"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-rr-blue flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-wide">
                                Features
                            </h3>
                        </div>
                        <ul className="space-y-4">
                            {FEATURES.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rr-blue mt-2.5" />
                                    <span
                                        className="text-base md:text-lg text-rr-charcoal font-medium leading-snug"
                                        dangerouslySetInnerHTML={{ __html: feature }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* BENEFITS */}
                    <motion.div
                        className="bg-slate-50 border-l-4 border-rr-pink rounded-2xl p-8 md:p-10"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-rr-pink flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-wide">
                                Benefits
                            </h3>
                        </div>
                        <ul className="space-y-4">
                            {BENEFITS.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rr-pink mt-2.5" />
                                    <span className="text-base md:text-lg text-rr-charcoal font-medium leading-snug">
                                        {benefit}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesBenefits;

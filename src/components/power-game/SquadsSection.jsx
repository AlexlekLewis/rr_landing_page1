import React from 'react';
import { motion } from 'framer-motion';

const SQUADS = [
    {
        name: 'Squad 1',
        ageGroup: 'Under 13',
        tagline: 'Foundations of Power',
        description:
            'The entry point into the Power Game pathway — building athletic foundations, technical fundamentals, and the early skills required to express power across all disciplines.',
        accent: 'from-rr-pink to-rr-light-pink',
    },
    {
        name: 'Squad 2',
        ageGroup: 'Under 15',
        tagline: 'Developing Explosiveness',
        description:
            'A focused development environment where players sharpen power-hitting technique, build bowling speed, and start to apply explosive fielding into match scenarios.',
        accent: 'from-rr-blue to-rr-medium-blue',
    },
    {
        name: 'Squad 3',
        ageGroup: 'Under 17',
        tagline: 'Performance Pathway',
        description:
            'The performance squad — players training at elite intensity with biomechanical analysis, advanced strength &amp; conditioning, and competitive scenario-based sessions.',
        accent: 'from-rr-pink to-rr-blue',
    },
    {
        name: 'Squad 4',
        ageGroup: 'Open / Senior',
        tagline: 'Elite Power Players',
        description:
            'Our highest level — senior and elite players preparing for the demands of modern white-ball cricket, with full access to data-driven coaching and bespoke programming.',
        accent: 'from-rr-blue to-rr-pink',
    },
];

const SquadsSection = () => {
    return (
        <section className="bg-slate-50 py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
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
                            Four Squads
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        SELECT YOUR <span className="text-rr-pink">SQUAD</span>
                    </h2>
                    <p className="text-base md:text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Four squads, one pathway. Each is purpose-built around age, skill, and ambition.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {SQUADS.map((squad, idx) => (
                        <motion.div
                            key={squad.name}
                            className="group relative bg-white rounded-2xl p-8 md:p-10 border border-slate-200 hover:border-rr-pink/40 hover:shadow-[0_10px_40px_rgba(225,31,143,0.12)] transition-all duration-300 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                        >
                            {/* accent stripe */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${squad.accent}`} />

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-2">
                                        {squad.ageGroup}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-wide">
                                        {squad.name}
                                    </h3>
                                </div>
                                <div className="text-5xl md:text-6xl font-black text-slate-100 leading-none">
                                    0{idx + 1}
                                </div>
                            </div>

                            <div className="text-base md:text-lg font-bold text-rr-blue uppercase tracking-wide mb-4">
                                {squad.tagline}
                            </div>

                            <p
                                className="text-sm md:text-base text-rr-charcoal font-medium leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: squad.description }}
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    className="text-center text-xs md:text-sm text-rr-charcoal/70 mt-10 font-medium uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Squad names &amp; age groups — placeholder, to be confirmed
                </motion.p>
            </div>
        </section>
    );
};

export default SquadsSection;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PROGRAMS = [
    {
        label: 'Academy Elite Program',
        detail: 'Power Pre-Season · Ages 12–26',
        route: '/PGP2026',
    },
    {
        label: 'Junior Royals',
        detail: 'Term Program · Ages 5–12',
        route: '/junior-royals',
    },
];

const CoachesJoin = () => {
    return (
        <section
            className="py-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--color-rr-navy) 0%, var(--color-rr-blue) 100%)' }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
            <div className="absolute -bottom-24 right-0 w-96 h-96 bg-rr-pink/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
                        Train With Us
                    </h2>
                    <p className="text-white/80 font-medium max-w-2xl mx-auto mb-12">
                        Every program at the Academy is built and led by this coaching group —
                        the same standards from a player’s first session to their last.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
                        {PROGRAMS.map((p) => (
                            <Link
                                key={p.route}
                                to={p.route}
                                className="group bg-white/10 hover:bg-white/15 border border-white/20 hover:border-rr-pink/60 rounded-2xl p-6 md:p-8 transition-all duration-300 text-left"
                            >
                                <p className="text-xl font-black text-white uppercase tracking-wide mb-1">{p.label}</p>
                                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-4">{p.detail}</p>
                                <span className="inline-flex items-center gap-2 text-rr-pink text-xs font-bold uppercase tracking-widest">
                                    Explore
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <p className="text-white/60 text-sm font-medium">
                        A coach yourself?{' '}
                        <Link to="/coaching-opportunities" className="text-white font-bold underline decoration-rr-pink decoration-2 underline-offset-4 hover:text-rr-pink transition-colors">
                            Coach with the Academy
                        </Link>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CoachesJoin;

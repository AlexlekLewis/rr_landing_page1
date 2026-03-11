import React from 'react';
import { motion } from 'framer-motion';

const TheRoyalsWay = () => (
    <section className="py-24 bg-white text-rr-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink/30 to-transparent" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">Our Philosophy</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                        The Royals{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Way</span>
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-rr-pink to-rr-blue rounded-full mb-8" />
                    <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                        We believe cricket is a vehicle to shape confident, curious, resilient people. We back talent early and teach boldly. Our approach is holistic, valuing courage over comfort and curiosity over ego.
                    </p>
                    <p className="text-xl font-bold text-rr-dark leading-snug mb-10">
                        This is the Royals Way: discover, develop, and elevate — with purpose, integrity, and relentless optimism.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Entries close March 20 — or when full</span>
                        </div>
                    </div>
                    <a
                        href="#checkout"
                        className="group mt-4 inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] text-sm w-full sm:w-auto justify-center sm:justify-start"
                    >
                        Secure Your Place Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </motion.div>

                {/* Right: Image */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                    className="relative"
                >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative">
                        <img
                            src="/assets/lahiri-riyan-parag.jpg"
                            alt="Siddhartha Lahiri with Riyan Parag"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rr-blue" />
                    </div>
                </motion.div>

            </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-blue/30 to-transparent" />
    </section>
);

export default TheRoyalsWay;

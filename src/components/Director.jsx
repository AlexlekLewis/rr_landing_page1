import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const Director = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-rr-dark text-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-slate-800 p-8 rounded-3xl border border-slate-700 relative flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shrink-0">
                            <img
                                src="/assets/crook-powerhitting.webp"
                                alt="Steven Crook"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        <div className="flex-1 text-left relative">
                            <div className="text-6xl text-rr-pink absolute -top-8 -left-4 opacity-50">"</div>
                            <p className="text-base md:text-lg italic text-gray-300 leading-relaxed relative z-10 mb-4 pt-4">
                                My playing and coaching career has been an incredible journey. I built my game on impact — scoring quickly, taking key wickets and setting standards in the field — and I learned that real success comes from understanding the moments that matter and having the courage to execute under pressure.
                            </p>
                            <p className="text-base md:text-lg italic text-gray-300 leading-relaxed relative z-10 mb-8">
                                Now as a coach and mentor my focus is on the current and next generation. I'm passionate about developing complete cricketers — players who can change a game with bat or ball, raise the standard in the field, and lead through their actions. If we bring the same high-performance mindset, attention to detail and competitive edge, we won't just produce powerful players — we'll develop leaders who understand how to win.
                            </p>

                            <div>
                                <h4 className="text-xl font-bold text-white">STEVEN CROOK</h4>
                                <p className="text-rr-pink font-bold text-sm tracking-wider mb-2">Director of Talent, Rajasthan Royals Academy Melbourne</p>
                                <p className="text-slate-400 text-xs">2x Vitality Blast champion with Northamptonshire Steelbacks. <br />Sheffield Shield winning Assistant Coach. BBL Assistant Coach.</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12">
                        <Button onClick={scrollToForm} variant="primary">
                            APPLY NOW
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Director;

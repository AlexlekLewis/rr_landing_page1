import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

import { SideSlash } from './Decals';

const Director = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-white text-rr-dark relative overflow-hidden" id="director">
            <SideSlash />
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 relative flex flex-col md:flex-row items-center gap-8 md:gap-10 shadow-2xl ring-1 ring-slate-50"
                    >
                        <div className="w-full md:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shrink-0 shadow-lg">
                            <img
                                src="/assets/crook-powerhitting.webp"
                                alt="Steven Crook"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        <div className="flex-1 text-left relative flex flex-col justify-center">
                            <div className="text-6xl text-rr-pink absolute -top-8 -left-4 opacity-20 font-serif">"</div>
                            <p className="text-base md:text-lg italic text-slate-600 leading-relaxed relative z-10 mb-6 pt-4 font-medium">
                                My playing and coaching career has been an incredible journey. I built my game on impact — scoring quickly, taking key wickets and setting standards in the field — and I learned that real success comes from understanding the moments that matter and having the courage to execute under pressure.
                            </p>

                            <div>
                                <h4 className="text-xl font-bold text-rr-dark">STEVEN CROOK</h4>
                                <p className="text-rr-pink font-bold text-sm tracking-wider mb-2">Director of Talent, Rajasthan Royals Academy Melbourne</p>
                                <p className="text-slate-500 text-xs font-medium">2x Vitality Blast champion with Northamptonshire Steelbacks. <br />Sheffield Shield winning Assistant Coach. BBL Assistant Coach.</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-12">
                        <Button onClick={scrollToForm} variant="primary">
                            REGISTER INTEREST
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Director;

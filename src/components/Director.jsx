import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const Director = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-slate-800 p-12 rounded-3xl border border-slate-700 relative"
                    >
                        <div className="text-6xl text-pink-600 absolute top-8 left-8">"</div>
                        <p className="text-xl md:text-2xl font-serif italic text-gray-300 leading-relaxed relative z-10 mb-8">
                            I wish I had a program like this coming through the system. Who knows where my cricket would have ended up. It’s an incredible opportunity to develop the modern day skills required to star in the shortest of formats.
                        </p>

                        <div>
                            <h4 className="text-xl font-bold text-white">STEVEN CROOK</h4>
                            <p className="text-pink-500 font-bold text-sm tracking-wider mb-2">Director of Talent, Rajasthan Royals Academy Australia</p>
                            <p className="text-slate-400 text-xs">2x Vitality Blast champion with Northamptonshire Steelbacks. <br />Sheffield Shield winning Assistant Coach. BBL Assistant Coach.</p>
                        </div>
                    </motion.div>

                    <div className="mt-12">
                        <Button onClick={scrollToForm} variant="gold">
                            APPLY NOW
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Director;

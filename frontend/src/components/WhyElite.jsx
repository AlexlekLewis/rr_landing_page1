import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const WhyElite = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-white text-slate-900">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            THE WORLD'S BEST <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">T20 PLAYERS</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-pink-600 to-purple-600 mb-8" />
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            Have become global stars making millions a year. Those who are getting noticed and selected at representative levels and at the highest grades in the club system, are those that have a T20 skill set that they can adapt to situations within all formats of the game.
                        </p>
                        <p className="text-xl font-medium text-slate-800 mb-8">
                            So, if the game has already changed, are you prepared to do what it takes to put your name in the picture?
                        </p>
                        <Button onClick={scrollToForm} variant="primary">
                            APPLY NOW
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Abstract Graphic or Image Placeholder */}
                        <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden relative shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100" />
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-2xl rotate-[-45deg]">
                                ELITE MINDSET
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-10 right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />
                            <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-xl" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyElite;

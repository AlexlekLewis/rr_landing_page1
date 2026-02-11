import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const WhyElite = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-white text-rr-dark">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            THE ROYALS <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">WAY</span>
                        </h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-rr-pink to-rr-blue mb-8" />
                        <p className="text-lg text-rr-grey leading-relaxed mb-6">
                            We believe cricket is a vehicle to shape confident, curious, resilient people. We back talent early and teach boldly. Our approach is holistic, valuing courage over comfort and curiosity over ego.
                        </p>
                        <p className="text-xl font-medium text-rr-dark mb-8">
                            This is the Royals Way: discover, develop, and elevate—with purpose, integrity, and relentless optimism.
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
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-2xl">
                            <img
                                src="/assets/lahiri-riyan-parag.jpg"
                                alt="Lahiri speaks with Riyan Parag"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyElite;

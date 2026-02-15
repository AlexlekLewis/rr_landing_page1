import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const WhyElite = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white text-rr-dark relative overflow-hidden">
            {/* Subtle Background Pattern or Gradient Blur if needed, keeping it clean for now */}

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-rr-dark">
                            THE ROYALS <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">WAY</span>
                        </h2>
                        <div className="h-2 w-32 bg-gradient-to-r from-rr-pink to-rr-blue mb-8 rounded-full" />
                        <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                            We believe cricket is a vehicle to shape confident, curious, resilient people. We back talent early and teach boldly. Our approach is holistic, valuing courage over comfort and curiosity over ego.
                        </p>
                        <p className="text-xl font-bold text-rr-navy mb-8">
                            This is the Royals Way: discover, develop, and elevate—with purpose, integrity, and relentless optimism.
                        </p>
                        <Button onClick={scrollToForm} variant="primary">
                            APPLY TO JOIN THE FAMILY
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

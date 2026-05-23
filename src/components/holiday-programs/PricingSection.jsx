import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const included = [
    '3 full days of elite coaching (12 hours total)',
    'Official Rajasthan Royals Academy training shirt',
    'Structured basic cricket & T20 skills curriculum',
    'Small-group sessions with Royals certified coaches',
    'Special guest coaching slots with Royals Elite Academy Coaches',
    'Individual skill development to take away',
    'Entry is for both male and female cricketers',
];

const PricingSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white border-t-8" style={{ borderImage: 'linear-gradient(90deg, #1226AA, #E11F8F) 1' }}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-4"
                    >
                        PRICE &amp; <span className="text-rr-pink">INCLUSIONS</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {/* Price card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink rounded-2xl p-10 text-center text-white"
                    >
                        <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-4">Per Player</p>
                        <div className="flex items-start justify-center gap-1 mb-3">
                            <span className="text-3xl font-black mt-2">$</span>
                            <span className="text-8xl font-black leading-none">330</span>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-rr-medium-blue/20 border border-white/20 rounded-full px-4 py-2 mb-6">
                            <span className="text-white font-bold text-sm">$27.50 / hour across 12 hours</span>
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-8">Official Rajasthan Royals training shirt included in every registration.</p>
                        <div className="w-full bg-white/20 border border-white/30 text-white/60 font-black uppercase tracking-widest py-4 rounded-full text-center text-sm">
                            Registration Opening Soon
                        </div>
                    </motion.div>

                    {/* Inclusions */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-black text-rr-dark uppercase tracking-wide mb-6">What's Included</h3>
                        {included.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-rr-pink/10 border border-rr-pink/30 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-rr-pink" />
                                </div>
                                <p className="text-rr-charcoal font-medium leading-relaxed">{item}</p>
                            </motion.div>
                        ))}

                    </motion.div>

                    {/* Energy image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="hidden lg:block rounded-2xl overflow-hidden h-full min-h-[480px]"
                    >
                        <img
                            src="/assets/lahiri-riyan-parag.jpg"
                            alt="Royals coaching — Lahiri and Riyan Parag"
                            className="w-full h-full object-cover object-top"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;

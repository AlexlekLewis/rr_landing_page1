import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const included = [
    '3 full days of elite coaching (12 hours total)',
    'Structured basic cricket & T20 skills curriculum',
    'Small-group sessions with Royals certified coaches',
    'Special guest coaching slots with Royals Elite Academy Coaches',
    'Individual skill development to take away',
    'Entry is for both male and female cricketers',
];

const PricingSection = () => {
    const scrollToForm = () => {
        document.getElementById('secure-form')?.scrollIntoView({ behavior: 'smooth' });
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
                        className="bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink rounded-2xl p-8 text-center text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 bg-rr-pink py-2 px-4">
                            <p className="text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Early Bird — Ends 11pm Sunday 30 August
                            </p>
                        </div>

                        <div className="mt-10">
                            <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-3">Per Player</p>

                            <div className="flex items-start justify-center gap-1 mb-1">
                                <span className="text-3xl font-black mt-2">$</span>
                                <span className="text-8xl font-black leading-none">299</span>
                            </div>

                            <p className="text-white/40 text-sm font-bold line-through mb-3">$330 after Early Bird ends</p>

                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                                <span className="text-white font-bold text-sm">$24.90 / hour across 12 hours</span>
                            </div>

                            <button
                                onClick={scrollToForm}
                                className="w-full bg-white text-rr-pink font-black uppercase tracking-widest py-4 rounded-full text-sm hover:bg-white/90 transition-all duration-300"
                            >
                                Secure Your Place Now
                            </button>

                            <p className="text-white/40 text-xs mt-4 leading-relaxed">
                                Early Bird price of $299 ends 11pm Sunday 30 August, then reverts to $330. Includes 12 hours of elite coaching across 3 days. Training shirt purchased separately at $29.95. Don't miss out — places are limited.
                            </p>
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

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="hidden lg:block rounded-2xl overflow-hidden h-full min-h-[480px]"
                    >
                        <img
                            src="/assets/lahiri-riyan-parag.jpg"
                            alt="Royals coaching"
                            className="w-full h-full object-cover object-top"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;

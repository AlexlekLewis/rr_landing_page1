import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const included = [
    '12 weeks of structured performance coaching',
    'Advanced batting, bowling & fielding development',
    'Mental game & mindset training',
    'Leadership development sessions',
    'Game sense & tactical awareness drills',
    'Health, fitness & cricket-specific conditioning',
    '6 exclusive online seminars (incl. parent seminar)',
    'Dietitian insights on nutrition & performance',
    'Qualified, adaptable coaching team',
    'Max 30 participants — quality coaching guaranteed',
];

const PricingSection = () => {
    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white">
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
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium"
                    >
                        Everything included. No hidden extras.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
                    {/* Price card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink rounded-2xl p-10 text-center text-white"
                    >
                        <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-4">Per Participant</p>
                        <div className="flex items-start justify-center gap-1 mb-3">
                            <span className="text-3xl font-black mt-2">$</span>
                            <span className="text-8xl font-black leading-none">599</span>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                            <span className="text-white font-bold text-sm">12-Week Program</span>
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-8">
                            Qualified coaching team. Advanced skill development. Leadership, mindset, and performance seminars — all included.
                        </p>
                        <button
                            onClick={scrollToForm}
                            className="w-full bg-white text-rr-dark font-black uppercase tracking-widest py-4 rounded-full hover:bg-rr-light-pink hover:text-white transition-all duration-300"
                        >
                            Register Now
                        </button>
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
                                transition={{ delay: i * 0.06 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-rr-pink/10 border border-rr-pink/30 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-rr-pink" strokeWidth={3} />
                                </div>
                                <span className="text-rr-charcoal font-medium text-sm leading-relaxed">{item}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;

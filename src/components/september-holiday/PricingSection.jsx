import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// No price is shown while the camp is at the expression-of-interest stage — the
// cost is confirmed by email along with the dates, and nothing is charged on this
// page. Put the price card back when the camp goes on sale.
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
                        WHAT YOU <span className="text-rr-pink">GET</span>
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
                        <div className="mt-4 text-left">
                            <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-4 text-center">How it works</p>

                            <ol className="space-y-4 mb-7">
                                <li className="flex gap-3">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-xs font-black">1</span>
                                    <span className="text-white/90 text-sm font-medium leading-relaxed">
                                        You register your interest below. It takes a minute, costs nothing, and does not book a place.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-xs font-black">2</span>
                                    <span className="text-white/90 text-sm font-medium leading-relaxed">
                                        We set the dates around where the interest is — which centre, and which week of the holidays.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-xs font-black">3</span>
                                    <span className="text-white/90 text-sm font-medium leading-relaxed">
                                        We email you first, with the exact days, the daily start and finish times, the cost, and a link to book.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-xs font-black">4</span>
                                    <span className="text-white/90 text-sm font-medium leading-relaxed">
                                        You book if it suits. If it doesn't, you reply and we take you off the list — no obligation either way.
                                    </span>
                                </li>
                            </ol>

                            <button
                                onClick={scrollToForm}
                                className="w-full bg-white text-rr-pink font-black uppercase tracking-widest py-4 rounded-full text-sm hover:bg-white/90 transition-all duration-300"
                            >
                                Register Your Interest
                            </button>

                            {/* Fine print */}
                            <p className="text-white/50 text-xs mt-4 leading-relaxed text-center">
                                No payment is taken on this page. The cost is confirmed in that email, before you commit to anything.
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

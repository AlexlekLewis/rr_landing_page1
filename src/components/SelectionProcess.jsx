import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        num: 1,
        title: "Apply",
        desc: "Fill out the application form below.",
    },
    {
        num: 2,
        title: "Assess",
        desc: "Our team will assess your suitability. Places are limited.",
    },
    {
        num: 3,
        title: "Offer",
        desc: "Successful applicants will receive an offer based on criteria.",
    },
    {
        num: 4,
        title: "Alternative",
        desc: "Unsuccessful applicants may be offered a place in other Academy programs.",
    },
];

const SelectionProcess = () => {
    return (
        <section className="py-24 bg-rr-dark text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-black text-center mb-4">SELECTION PROCESS</h2>
                <p className="text-center text-slate-400 max-w-2xl mx-auto mb-16 text-lg">
                    The Rajasthan Royals Academy Melbourne selection process is designed to identify talented cricketers ready to take the next step. Here's how it works.
                </p>

                {/* Horizontal Timeline */}
                <div className="max-w-5xl mx-auto">
                    {/* Desktop: horizontal */}
                    <div className="hidden md:flex items-start justify-between relative">
                        {/* Connecting line */}
                        <div className="absolute top-8 left-12 right-12 h-0.5 bg-gradient-to-r from-rr-pink via-rr-blue to-rr-pink opacity-40" />

                        {steps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="flex flex-col items-center text-center relative z-10 w-1/4 px-4"
                            >
                                {/* Number circle */}
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-rr-pink/20 mb-4 shrink-0">
                                    {step.num}
                                </div>

                                {/* Arrow connector (not on last) */}
                                {i < steps.length - 1 && (
                                    <div className="absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)]">
                                        <svg viewBox="0 0 100 12" className="w-full h-3 text-rr-pink/40" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id={`arrow-grad-${i}`} x1="0" x2="1" y1="0" y2="0">
                                                    <stop offset="0%" stopColor="#E11F8F" stopOpacity="0.6" />
                                                    <stop offset="100%" stopColor="#1226AA" stopOpacity="0.6" />
                                                </linearGradient>
                                            </defs>
                                            <line x1="0" y1="6" x2="90" y2="6" stroke={`url(#arrow-grad-${i})`} strokeWidth="2" />
                                            <polygon points="88,2 98,6 88,10" fill="#1226AA" opacity="0.6" />
                                        </svg>
                                    </div>
                                )}

                                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile: vertical */}
                    <div className="md:hidden space-y-8 relative pl-10">
                        {/* Vertical line */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rr-pink via-rr-blue to-rr-pink opacity-40" />

                        {steps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="relative"
                            >
                                {/* Number circle */}
                                <div className="absolute -left-10 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center text-sm font-black text-white shadow-lg shadow-rr-pink/20">
                                    {step.num}
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 ml-4">
                                    <h3 className="text-lg font-bold mb-1 uppercase">{step.title}</h3>
                                    <p className="text-slate-400 text-sm">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SelectionProcess;

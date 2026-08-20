import React from 'react';
import { motion } from 'framer-motion';

const RegistrationComingSoon = () => (
    <section id="registration-form" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-rr-dark rounded-3xl p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #1226AA, #E11F8F)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rr-pink/8 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/30 rounded-full px-5 py-2 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-black text-rr-pink uppercase tracking-widest">Registration Opening Soon</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-6">
                        Dates & Venues<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">
                            Coming Shortly
                        </span>
                    </h2>

                    <p className="text-white/60 font-medium leading-relaxed mb-10 max-w-md mx-auto">
                        Junior Royals Holiday Program are coming to five Melbourne locations. Full details — including dates, venues, and registration — will be announced shortly.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                        {[
                            { label: 'Price', value: '$330 per camper' },
                            { label: 'Duration', value: '3 days · 12 hours' },
                            { label: 'Ages', value: '7 – 14 years' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-white font-black text-sm">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-white/40 text-xs font-medium">
                        Questions? Email us at{' '}
                        <a href="mailto:info@rramelbourne.com" className="text-rr-pink hover:underline font-bold">
                            info@rramelbourne.com
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

export default RegistrationComingSoon;

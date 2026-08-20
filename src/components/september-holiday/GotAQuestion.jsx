import React from 'react';
import { motion } from 'framer-motion';

const GotAQuestion = () => (
    <section className="py-24 bg-rr-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-rr-pink/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <p className="text-rr-pink text-xs font-black uppercase tracking-[0.3em] mb-5">
                    We're here to help
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-6">
                    Got a <span className="text-rr-pink">Question?</span>
                </h2>
                <p className="text-white/60 font-medium text-lg leading-relaxed mb-10">
                    Send us an email and our team will get back to you as soon as possible.
                </p>

                <a
                    href="mailto:info@rramelbourne.com?subject=Junior Royals Holiday Program Enquiry"
                    className="inline-flex items-center gap-3 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-10 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(229,6,149,0.5)] text-sm"
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@rramelbourne.com
                </a>
            </motion.div>
        </div>
    </section>
);

export default GotAQuestion;

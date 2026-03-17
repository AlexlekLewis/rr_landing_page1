import React from 'react';
import { motion } from 'framer-motion';

const ScreeningCallCTA = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-3xl mx-auto px-6 relative z-10"
            >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 md:p-12 text-center">
                    {/* Icon */}
                    <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-rr-blue/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-rr-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>

                    <p className="text-rr-pink font-bold uppercase tracking-widest text-xs mb-3">
                        Not sure yet?
                    </p>

                    <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-tight mb-4">
                        Book an Application Screening Call
                    </h3>

                    <p className="text-slate-600 font-medium leading-relaxed max-w-xl mx-auto mb-8">
                        Before committing, speak with our team to find out if the Elite Program is the right fit. We'll walk you through the program structure, answer your questions, and help you make an informed decision.
                    </p>

                    <a
                        href="https://calendly.com/whitewall-bys/royalsmelbourne-meeting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-rr-blue hover:bg-rr-navy text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Schedule Your Call
                    </a>

                    <p className="text-xs text-slate-400 mt-4 font-medium">
                        No obligation · 15-minute call · Speak directly with our team
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default ScreeningCallCTA;

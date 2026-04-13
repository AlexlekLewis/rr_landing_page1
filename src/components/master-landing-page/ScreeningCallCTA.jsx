import React from 'react';
import { motion } from 'framer-motion';

const ScreeningCallCTA = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
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
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-5 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink shrink-0" />
                        <span className="text-xs font-black text-rr-pink uppercase tracking-widest">Applications Closed</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-rr-dark uppercase tracking-tight mb-4">
                        Stay Connected
                    </h3>

                    <p className="text-slate-600 font-medium leading-relaxed max-w-xl mx-auto mb-8">
                        Applications for the Autumn T20 Elite Program are now closed. Stay connected to the Rajasthan Royals Academy Melbourne website for information about future elite programs.
                    </p>

                    <a
                        href="https://www.rramelbourne.com"
                        className="inline-block bg-rr-blue hover:bg-rr-navy text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        Visit RRA Melbourne
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default ScreeningCallCTA;

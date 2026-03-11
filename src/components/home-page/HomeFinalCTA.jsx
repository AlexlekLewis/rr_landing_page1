import React from 'react';
import { motion } from 'framer-motion';

const HomeFinalCTA = ({ onRegisterClick }) => {
    return (
        <section id="final-cta" className="py-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)' }}>
            {/* Background texture */}
            <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">2026 Programs — Limited Places</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6">
                        READY TO PLAY<br />
                        <span className="text-white/80">THE ROYALS WAY?</span>
                    </h2>

                    <p className="text-lg md:text-xl text-white/80 font-medium mb-10 leading-relaxed">
                        Join Melbourne's elite cricket academy. Whether you're booking a program today or want to be first to know about what's coming — register now.
                    </p>

                    <button
                        onClick={onRegisterClick}
                        data-cta="final-cta-register"
                        className="bg-white hover:bg-white/90 text-rr-pink font-black uppercase tracking-widest px-12 py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3 mx-auto group text-base"
                    >
                        Register Now
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                    <p className="text-white/50 text-sm font-medium mt-6">HALLA BOL!</p>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeFinalCTA;

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calculator } from 'lucide-react';

const YourInvestment = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-black border-t border-b border-white/5">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-5xl mx-auto"
            >
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Investment</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    <motion.p variants={fadeIn} className="text-lg text-slate-400 max-w-2xl mx-auto mt-6">
                        We don't do hidden fees, incremental charges, or confusing payment tiers.
                        The program is comprehensive, and the price is total.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rr-pink/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-rr-blue/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* Price Block */}
                    <motion.div variants={fadeIn} className="text-center lg:text-left relative z-10 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
                        <span className="inline-block px-4 py-2 rounded-full bg-rr-pink/20 text-rr-pink font-bold text-sm mb-6 tracking-wide uppercase shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                            All-Inclusive Program
                        </span>
                        <div className="flex items-end justify-center lg:justify-start gap-2 mb-2">
                            <span className="text-4xl text-slate-400 font-bold mb-2">$</span>
                            <span className="text-7xl font-black text-white tracking-tighter">2,995</span>
                        </div>
                        <p className="text-slate-400 font-medium mb-8">Includes GST & All Transaction Fees</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-rr-pink flex-shrink-0" />
                                <span className="text-slate-300">12 Weeks of Elite Coaching (2 on 1 & Squad)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-rr-pink flex-shrink-0" />
                                <span className="text-slate-300">Indoor & Outdoor Facilities Access</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-rr-pink flex-shrink-0" />
                                <span className="text-slate-300">Player DNA Profile & Individual Dev Plan</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-rr-pink flex-shrink-0" />
                                <span className="text-slate-300">Player Training Apparel Kit</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ROI / Value Breakdown */}
                    <motion.div variants={fadeIn} className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Calculator className="w-6 h-6 text-rr-blue" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">The ROI Breakdown</h3>
                                <p className="text-rr-blue font-medium">Value, not just cost.</p>
                            </div>
                        </div>

                        <div className="space-y-6 text-slate-300 leading-relaxed font-light">
                            <p>
                                Private specialist cricket coaching in Melbourne typically runs between $90 to $120+ per hour for a single coach.
                            </p>
                            <div className="bg-black/30 border border-white/5 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-rr-pink to-rr-blue" />
                                <p className="font-semibold text-white mb-2">
                                    Our program breaks down to approximately <span className="text-rr-pink text-xl">$55 per hour</span>.
                                </p>
                                <p className="text-sm text-slate-400">
                                    This isn't just one coach feeding balls. This includes access to our international coaching network, premium facilities, data monitoring, mental performance training, and S&C programming.
                                </p>
                            </div>
                            <p>
                                We believe in providing an unmatched high-performance ecosystem at a price point that makes elite development accessible to the best talent.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    );
};

export default YourInvestment;

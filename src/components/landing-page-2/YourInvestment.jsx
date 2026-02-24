import React from 'react';
import { motion } from 'framer-motion';

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

    const inclusions = [
        "12 Weeks of Elite Coaching",
        "Indoor & Outdoor Facilities Access",
        "Player DNA Profile",
        "Individual Development Plan",
        "Player Training Apparel Kit"
    ];

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-white border-t border-b border-slate-200" id="your-investment">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-5xl mx-auto"
            >
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Investment</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    <motion.p variants={fadeIn} className="text-lg text-slate-600 max-w-2xl mx-auto mt-6 font-medium">
                        Everything your child needs to train, develop and be assessed at the elite level — included in one transparent price.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-4xl mx-auto bg-white border border-slate-200 shadow-xl rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                    {/* Price Block */}
                    <motion.div variants={fadeIn} className="text-center lg:text-left relative z-10 border-b lg:border-b-0 lg:border-r border-slate-200 pb-8 lg:pb-0 lg:pr-8">
                        <span className="inline-block px-4 py-2 rounded-full bg-rr-pink/10 text-rr-pink font-bold text-sm mb-6 tracking-wide uppercase">
                            All-Inclusive Program
                        </span>
                        <div className="flex items-end justify-center lg:justify-start gap-2 mb-2">
                            <span className="text-4xl text-slate-400 font-bold mb-2">$</span>
                            <span className="text-7xl font-black text-rr-dark tracking-tighter">2,995</span>
                        </div>
                        <p className="text-slate-500 font-medium mb-2">Includes GST & All Transaction Fees</p>
                        <p className="text-slate-400 font-medium mb-8 text-sm italic">Payment plans are available</p>

                        <div className="space-y-4">
                            {inclusions.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="w-5 h-5 flex-shrink-0 rounded-full bg-rr-pink/10 flex items-center justify-center">
                                        <span className="text-rr-pink text-xs font-bold">✓</span>
                                    </span>
                                    <span className="text-slate-600 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ROI / Value Breakdown */}
                    <motion.div variants={fadeIn} className="relative z-10">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-rr-dark">What You're Getting</h3>
                            <p className="text-rr-blue font-medium">Premium development, one clear price.</p>
                        </div>

                        <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                            <p>
                                Private specialist cricket coaching in Melbourne typically runs between $90 to $120+ per hour for a single coach.
                            </p>
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-rr-pink to-rr-blue" />
                                <p className="font-bold text-rr-dark mb-2">
                                    Our Elite Program breaks down to approximately <span className="text-rr-pink text-xl">$55 per hour</span>.
                                </p>
                                <p className="text-sm text-slate-500">
                                    This includes access to our international coaching network, premium facilities, data monitoring, mental performance training, and S&C programming.
                                </p>
                            </div>
                            <p>
                                Our ecosystem is built around developing the skills that matter — helping young cricketers of all ages become more proficient in winning the key moments and big moments that define modern cricket.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    );
};

export default YourInvestment;

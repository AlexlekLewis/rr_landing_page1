import React from 'react';
import { motion } from 'framer-motion';

const TheRoyalsWay = () => {
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

    const principles = [
        "We develop problem solvers, not just cricket players.",
        "We train game awareness as intensely as technique.",
        "We build athletes who happen to play cricket.",
        "We measure success by progression, not just performance.",
        "We embrace the unorthodox if it's effective.",
        "We demand intensity in practice to simulate chaos in matches.",
        "We are building a community of elite performers."
    ];

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rr-pink/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-5xl mx-auto"
            >
                {/* Action Banner */}
                <motion.div variants={fadeIn} className="relative w-full h-44 md:h-64 rounded-2xl overflow-hidden mb-16 shadow-xl border border-slate-200">
                    <img
                        src="/assets/lp2/action/hetmyer-t20wc-fastest-fifty.jpg"
                        alt="Shimron Hetmyer — T20 World Cup Fastest Fifty"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-rr-pink/10 to-rr-blue/10 mix-blend-overlay" />
                </motion.div>

                {/* Quote Section */}
                <motion.div variants={fadeIn} className="mb-20 text-center relative max-w-4xl mx-auto">
                    <span className="text-7xl md:text-8xl text-rr-pink/10 absolute -top-6 -left-4 md:-left-8 font-serif select-none leading-none" aria-hidden="true">“</span>
                    <h3 className="text-3xl md:text-5xl font-black text-rr-dark leading-tight tracking-tight relative z-10">
                        "We don't wait for the finished product — we back talent early and <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">teach boldly</span>."
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-rr-navy mt-6">
                        "We value courage over comfort, curiosity over ego, and joy over jargon."
                    </p>
                    <span className="text-7xl md:text-8xl text-rr-blue/20 absolute -bottom-6 -right-4 md:-right-8 font-serif select-none leading-none" aria-hidden="true">”</span>
                </motion.div>

                {/* The Royals Way Title */}
                <div className="text-center mb-12">
                    <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                        The Royals Way
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {principles.map((principle, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className={`flex items-start gap-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 ${index === principles.length - 1 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''}`}
                        >
                            <span className="text-rr-pink font-black text-2xl leading-none mt-1">
                                {index + 1}.
                            </span>
                            <p className="text-lg text-slate-700 font-medium leading-relaxed">
                                {principle}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default TheRoyalsWay;

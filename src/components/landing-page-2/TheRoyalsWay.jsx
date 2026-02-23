import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

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
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-black overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rr-pink/5 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-5xl mx-auto"
            >
                {/* Quote Section */}
                <motion.div variants={fadeIn} className="mb-20 text-center relative max-w-4xl mx-auto">
                    <Quote className="w-16 h-16 text-rr-pink/20 absolute -top-8 -left-8 md:-left-12 rotate-180" />
                    <h3 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight relative z-10">
                        "We don't wait for the finished product — we back talent early and <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">teach boldly</span>."
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-slate-300 mt-6">
                        "We value courage over comfort, curiosity over ego, and joy over jargon."
                    </p>
                    <Quote className="w-16 h-16 text-rr-blue/20 absolute -bottom-8 -right-8 md:-right-12" />
                </motion.div>

                {/* The Royals Way Title */}
                <div className="text-center mb-12">
                    <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                        The Royals Way
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                </div>

                {/* Content with Player Image */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* List of Principles */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {principles.map((principle, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className={`flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 ${index === principles.length - 1 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''}`}
                            >
                                <span className="text-rr-pink font-black text-2xl leading-none mt-1">
                                    {index + 1}.
                                </span>
                                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                                    {principle}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Player Image Accent — Desktop Only */}
                    <motion.div
                        variants={fadeIn}
                        className="hidden lg:flex lg:col-span-4 justify-center items-start sticky top-24"
                    >
                        <div className="relative">
                            <img
                                src="/assets/riyan-parag-royals.png"
                                alt="Riyan Parag — Rajasthan Royals Captain"
                                className="w-72 rounded-2xl object-cover shadow-2xl shadow-rr-pink/10 border border-white/10"
                            />
                            <div className="absolute -bottom-3 -right-3 bg-rr-pink/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-rr-pink/30">
                                <p className="text-xs font-bold text-white tracking-wider uppercase">Riyan Parag</p>
                                <p className="text-[10px] text-rr-pink font-semibold">RR Captain</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default TheRoyalsWay;

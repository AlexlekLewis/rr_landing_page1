import React from 'react';
import { motion } from 'framer-motion';

const RrampDnaProfile = () => {
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

    const dnaBoxes = [
        { title: "Technical Mastery", desc: "Biomechanical efficiency and repeatable core skills." },
        { title: "Tactical Execution", desc: "Game awareness, field placement manipulation, and scenario planning." },
        { title: "Physical Conditioning", desc: "Cricket-specific endurance, strength, and explosive power." },
        { title: "Mental Resilience", desc: "Pressure management, routine building, and emotional control." },
        { title: "Athletic Fielding", desc: "Ground coverage, throwing speed and accuracy, and catching reliability." },
        { title: "Match Impact", desc: "Ability to influence the outcome of the game under pressure." },
        { title: "Power Hitting", desc: "Range hitting, boundary maximization, and scoring intent." },
        { title: "Self-Awareness", desc: "Understanding personal strengths, weaknesses, and learning styles." }
    ];

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-slate-50 border-t border-b border-slate-200">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-6xl mx-auto"
            >
                {/* Hero Intro with Player Accent */}
                <div className="mb-16 space-y-6 max-w-6xl mx-auto">
                    <div className="text-center space-y-4">
                        <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                            PLAYER <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">DNA PROFILE</span>
                        </motion.h2>
                        <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 gap-8 items-center mt-8">
                        <motion.div variants={fadeIn} className="space-y-4 max-w-3xl mx-auto text-center">
                            <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                                The Player DNA Profile is your roadmap to elite performance. It is a comprehensive, evidence-based assessment tool used to benchmark your current capabilities across the critical dimensions of cricket.
                            </p>
                            <p className="text-lg text-slate-600 font-medium">
                                Throughout the 12 weeks, we track your progression across these 8 core pillars to build a professional-grade blueprint of your T20 skillset.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* 8-Box Grid */}
                <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dnaBoxes.map((box, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:border-rr-pink/30 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            {/* Accent stripe */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-t-2xl" />
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue mb-3">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-lg font-bold text-rr-dark mb-2">{box.title}</h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{box.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default RrampDnaProfile;

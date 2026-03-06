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
        { title: "Technical Mastery", desc: "Consistent technique and repeatable core skills." },
        { title: "Tactical Execution", desc: "Game awareness, reading the field, and knowing what to do in every situation." },
        { title: "Physical Conditioning", desc: "Cricket-specific fitness, strength, and explosive power." },
        { title: "Mental Resilience", desc: "Handling pressure, building good routines, and staying composed." },
        { title: "Athletic Fielding", desc: "Ground coverage, throwing accuracy, and catching under pressure." },
        { title: "Match Impact", desc: "The ability to step up and influence the game when it matters." },
        { title: "Power Hitting", desc: "Range hitting, finding the boundary, and scoring with intent." },
        { title: "Self-Awareness", desc: "Understanding your own strengths, areas to improve, and how you learn best." }
    ];

    return (
        <section className="py-16 px-6 lg:px-8 relative z-10 bg-slate-50 border-t border-b border-slate-200">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-5xl mx-auto"
            >
                {/* Hero Intro with Player Accent */}
                <div className="mb-10 space-y-4 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                            PLAYER <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">DNA PROFILE</span>
                        </motion.h2>
                        <motion.div variants={fadeIn} className="w-16 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                    </div>

                    <div className="mt-4">
                        <motion.div variants={fadeIn} className="text-center">
                            <p className="text-base text-slate-700 leading-relaxed font-medium">
                                Designed by some of the brightest minds in the modern game, our world first Player DNA Profile is your roadmap to elite performance. It is a comprehensive, evidence-based assessment tool used to benchmark your current capabilities across the critical dimensions of cricket.
                            </p>
                            <p className="text-base text-slate-600 leading-relaxed font-medium mt-3">
                                Throughout the 12 weeks, we track your progression across these 8 core pillars to build a professional-grade blueprint of your T20 skillset.
                            </p>
                        </motion.div>
                    </div>
                </div>
                <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dnaBoxes.map((box, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 relative overflow-hidden group hover:-translate-y-1 hover:shadow-md hover:border-rr-pink/30 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            {/* Accent stripe */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rr-pink to-rr-blue rounded-t-xl" />
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue mb-2">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-sm font-bold text-rr-dark mb-1">{box.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{box.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

            </motion.div>
        </section>
    );
};

export default RrampDnaProfile;

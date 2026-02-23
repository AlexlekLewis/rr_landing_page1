import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, ShieldCheck, HeartPulse, BrainCircuit,
    Crosshair, Zap, Ruler, Trello
} from 'lucide-react';

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
        { title: "Technical Mastery", icon: Crosshair, desc: "Biomechanical efficiency and repeatable core skills." },
        { title: "Tactical Execution", icon: Trello, desc: "Game awareness, field placement manipulation, and scenario planning." },
        { title: "Physical Conditioning", icon: HeartPulse, desc: "Cricket-specific endurance, strength, and explosive power." },
        { title: "Mental Resilience", icon: BrainCircuit, desc: "Pressure management, routine building, and emotional control." },
        { title: "Athletic Fielding", icon: Activity, desc: "Ground coverage, throwing speed and accuracy, and catching reliability." },
        { title: "Match Impact", icon: ShieldCheck, desc: "Ability to influence the outcome of the game under pressure." },
        { title: "Power Hitting", icon: Zap, desc: "Range hitting, boundary maximization, and scoring intent." },
        { title: "Self-Awareness", icon: Ruler, desc: "Understanding personal strengths, weaknesses, and learning styles." }
    ];

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-black/60 border-t border-b border-white/5">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-6xl mx-auto"
            >
                {/* Hero Intro */}
                <div className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        RRAMP <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">DNA PROFILE</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />

                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 leading-relaxed font-light mt-8">
                        The RRAMP DNA Profile is your roadmap to elite performance. It is a comprehensive, evidence-based assessment tool used to benchmark your current capabilities across the critical dimensions of T20 cricket.
                    </motion.p>
                    <motion.p variants={fadeIn} className="text-lg text-slate-400 font-medium">
                        Throughout the 12 weeks, we track your progression across these 8 core pillars to build a professional-grade blueprint of you as a cricketer.
                    </motion.p>
                </div>

                {/* 8-Box Grid */}
                <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dnaBoxes.map((box, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 hover:border-rr-pink/30 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="w-14 h-14 bg-rr-pink/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rr-pink/20 transition-all duration-300">
                                <box.icon className="w-7 h-7 text-rr-pink" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{box.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{box.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default RrampDnaProfile;

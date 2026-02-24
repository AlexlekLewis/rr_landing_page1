import React from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, ShieldCheck } from 'lucide-react';

const PhaseEffectiveness = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const phases = [
        {
            number: "01",
            title: "Foundation & Execution",
            weeks: "Weeks 1-4",
            description: "Establishing technical baselines. Intense focus on repetitive skill execution under low-to-medium pressure to embed muscle memory and correct biomechanical inefficiencies.",
            icon: Target,
            color: "from-blue-500 to-rr-blue"
        },
        {
            number: "02",
            title: "Pressure Testing",
            weeks: "Weeks 5-8",
            description: "Elevating the environment. Introduction of constrained match scenarios and higher-velocity challenges to stress-test skills and measure decision-making under genuine pressure.",
            icon: Activity,
            color: "from-purple-500 to-rr-pink"
        },
        {
            number: "03",
            title: "Match Domination",
            weeks: "Weeks 9-12",
            description: "Full contextual immersion. High-intensity T20 match simulations. Players are tested on their ability to read the game, execute the Royals Way, and influence outcomes.",
            icon: ShieldCheck,
            color: "from-rr-pink to-orange-500"
        }
    ];

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-white overflow-hidden">
            {/* Background Player Image — desaturated per branding guidelines */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/assets/vaibhav.png"
                    alt=""
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto object-contain opacity-[0.03] mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-6xl mx-auto"
            >
                <div className="text-center mb-16 space-y-4 relative z-10">
                    <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Phase Effectiveness
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                    <motion.p variants={fadeIn} className="text-lg text-slate-600 font-medium max-w-2xl mx-auto mt-6">
                        The 12-week program is scientifically periodised into three distinct phases to ensure skills are not just learned, but weaponised for competition.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {phases.map((phase, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className="bg-white border border-slate-100 shadow-xl rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                        >
                            {/* Ambient Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${phase.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center p-[2px] shadow-sm`}>
                                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                                            <phase.icon className="w-6 h-6 text-rr-dark" />
                                        </div>
                                    </div>
                                    <span className="text-5xl font-black text-slate-100 tracking-tighter">
                                        {phase.number}
                                    </span>
                                </div>

                                <span className="text-rr-pink font-bold text-sm uppercase tracking-wider mb-2 block">
                                    {phase.weeks}
                                </span>
                                <h3 className="text-2xl font-bold text-rr-dark mb-4 group-hover:text-rr-pink transition-colors">
                                    {phase.title}
                                </h3>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    {phase.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default PhaseEffectiveness;

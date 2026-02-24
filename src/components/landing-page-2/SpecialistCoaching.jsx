import React from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Shield, Crosshair, Dumbbell, Brain } from 'lucide-react';

const SpecialistCoaching = () => {
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

    const specialties = [
        {
            title: "Spin Mastery & Variation",
            icon: RotateCw,
            desc: "Effective spin in T20 is about control, deception, and taking the game away from a batter at the right moment. Stock ball accuracy, flight and loop, wrong'uns, arm balls — and the tactical intelligence to know when and where each variation is the right weapon.",
            color: "from-blue-500 to-rr-blue"
        },
        {
            title: "Wicketkeeping Craft",
            icon: Shield,
            desc: "Modern T20 keeping demands explosive athleticism, technical precision, and match intelligence. Stance and footwork, standing-up skills, glove work in high-pressure moments, and reading bowlers and batters — separating good keepers from exceptional ones.",
            color: "from-amber-500 to-orange-600"
        },
        {
            title: "Game-Changing Fielding",
            icon: Crosshair,
            desc: "Elite fielders don't just save runs — they change the momentum of matches. Ground coverage, long-barrier and sliding technique, direct-hit accuracy, and high-pressure catching that turns half-chances into wickets. Millimetres matter and this is where they're trained.",
            color: "from-emerald-400 to-teal-600"
        },
        {
            title: "Strength & Conditioning",
            icon: Dumbbell,
            desc: "Cricket-specific athleticism built for T20 performance: explosive power for hitting, bowling endurance, speed and agility in the field, and recovery management across a full 12 weeks. S&C integrated to keep players performing at their peak throughout the program.",
            color: "from-purple-500 to-rr-pink"
        },
        {
            title: "Mental Performance & Mindset",
            icon: Brain,
            desc: "Elite T20 cricketers make better decisions faster, manage risk more accurately, and execute under pressure more consistently. Pre-performance routines, pressure management, acceptable risk decision-making, and the self-awareness to back your game when it matters most.",
            color: "from-rr-pink to-rose-600"
        }
    ];

    return (
        <section className="py-24 px-6 lg:px-8 relative z-10 bg-white border-t border-b border-slate-200 overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Specialist <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-rr-blue">Coaching</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-blue-400 to-rr-blue mx-auto rounded-full" />
                    <motion.p variants={fadeIn} className="text-lg text-slate-600 mt-6 font-medium">
                        Beyond core skills, the Elite Program provides access to highly specialized disciplines necessary for conquering the modern T20 game.
                    </motion.p>
                </div>

                {/* Hero Image Banner */}
                <motion.div
                    variants={fadeIn}
                    className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-12 border border-slate-200 shadow-lg"
                >
                    <img
                        src="/assets/hero-celebration.jpg"
                        alt="Rajasthan Royals Team Celebration"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark/90 via-rr-dark/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-rr-pink/20 to-rr-blue/20 mix-blend-overlay" />
                    <div className="absolute bottom-4 left-6">
                        <p className="text-xs font-bold text-white/90 tracking-widest uppercase">Elite Coaching • World-Class Resources</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specialties.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className={`
                                bg-white shadow-xl border border-slate-200 rounded-3xl p-8 
                                relative group hover:-translate-y-1 transition-all duration-300
                                ${index >= 3 ? 'lg:col-span-1.5' : ''} 
                            `}
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center p-[1px] mb-6 shadow-md`}>
                                    <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-slate-700" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-rr-dark mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm flex-grow font-medium">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default SpecialistCoaching;

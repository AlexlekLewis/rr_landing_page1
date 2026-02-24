import React from 'react';
import { motion } from 'framer-motion';

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
            desc: "Effective spin is about control, deception, and taking the game away from a batter at the right moment. Stock ball accuracy, flight and loop, wrong'uns, arm balls — and the tactical intelligence to know when and where each variation is the right weapon.",
            color: "from-rr-blue to-rr-pink"
        },
        {
            title: "Wicketkeeping Craft",
            desc: "Modern keeping demands explosive athleticism, technical precision, and match intelligence. Stance and footwork, standing-up skills, glove work in high-pressure moments, and reading bowlers and batters — separating good keepers from exceptional ones.",
            color: "from-rr-pink to-rr-blue"
        },
        {
            title: "Game-Changing Fielding",
            desc: "Elite fielders don't just save runs — they change the momentum of matches. Ground coverage, long-barrier and sliding technique, direct-hit accuracy, and high-pressure catching that turns half-chances into wickets. Millimetres matter and this is where they're trained.",
            color: "from-rr-blue to-rr-pink"
        },
        {
            title: "Strength & Conditioning",
            desc: "Cricket-specific athleticism built for elite performance: explosive power for hitting, bowling endurance, speed and agility in the field, and recovery management across a full 12 weeks. S&C integrated to keep players performing at their peak throughout the program.",
            color: "from-rr-pink to-rr-blue"
        },
        {
            title: "Mental Performance & Mindset",
            desc: "Elite cricketers make better decisions faster, manage risk more accurately, and execute under pressure more consistently. Pre-performance routines, pressure management, acceptable risk decision-making, and the self-awareness to back your game when it matters most.",
            color: "from-rr-blue to-rr-pink"
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
                        Specialist <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Coaching</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                    <motion.p variants={fadeIn} className="text-lg text-slate-600 mt-6 font-medium">
                        Beyond core skills, the Elite Program provides access to highly specialised disciplines necessary for dominating the modern game.
                    </motion.p>
                </div>

                {/* Player Portrait — LP1 Style */}
                <motion.div
                    variants={fadeIn}
                    className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden mb-12 border border-slate-200 shadow-xl group bg-gradient-to-br from-rr-dark via-rr-navy to-rr-dark"
                >
                    <img
                        src="/assets/lp2/sam-curran.png"
                        alt="Sam Curran — Rajasthan Royals"
                        className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
                            {/* Accent stripe at top */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} rounded-t-3xl`} />

                            <div className="relative z-10 flex flex-col h-full">
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

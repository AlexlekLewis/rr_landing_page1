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
            title: "Power and 360 Hitting",
            desc: "Modern T20 cricket demands batters who can score all around the ground and change gears when they need to. Ramp shots, reverse sweeps, and the ability to find the boundary from any position — these are the shots that win games.",
            color: "from-rr-blue to-rr-pink",
            coach: "Matthew Spoors & Jarryd Rogers"
        },
        {
            title: "Bowl to Control the Game",
            desc: "Bowling with intent is about more than taking wickets — it's about controlling pressure, limiting runs, and sticking to a plan. Accuracy under pressure, smart use of variations, and the ability to bowl to a field and force mistakes.",
            color: "from-rr-pink to-rr-blue",
            coach: "Pace Staff"
        },
        {
            title: "Spin Mastery & Variation",
            desc: "Effective spin is about control, deception, and taking the game away from the batter at the right moment. Consistent accuracy, flight and loop, wrong'uns, arm balls — and knowing exactly when to use each one.",
            color: "from-rr-blue to-rr-pink",
            coach: "Alex Lewis & Harkirat Bajwa"
        },
        {
            title: "Wicketkeeping Craft",
            desc: "Modern keeping demands quick reflexes, clean technique, and smart decision-making. Stance and footwork, standing up to the stumps, clean glovework under pressure, and learning to read the game — the details that separate good keepers from great ones.",
            color: "from-rr-pink to-rr-blue",
            coach: "Wicketkeeping Specialist"
        },
        {
            title: "Game-Changing Fielding",
            desc: "Elite fielders don't just save runs — they change matches. Ground coverage, sliding saves, accurate throwing, and high-pressure catching that turns half-chances into wickets. Small margins make big differences, and this is where they're trained.",
            color: "from-rr-blue to-rr-pink",
            coach: "Fielding Staff"
        },
        {
            title: "Strength & Conditioning",
            desc: "Cricket-specific fitness built for real performance: explosive power for hitting, bowling endurance, speed and agility in the field, and proper recovery across the full 12 weeks. Fitness coaching is woven into the program to keep players performing at their best.",
            color: "from-rr-pink to-rr-blue",
            coach: "High Performance Unit"
        },
        {
            title: "Mental Performance & Mindset",
            desc: "The best cricketers make better decisions faster and perform when it counts. Building pre-game routines, learning to handle pressure, knowing when to take risks, and having the confidence to trust your skills in the biggest moments.",
            color: "from-rr-blue to-rr-pink",
            coach: "Leadership Team"
        }
    ];

    const leaders = [
        { name: "Siddhartha Lahiri", role: "Global Head of International Player Talent Development" },
        { name: "Alex Lewis", role: "Head Coach" },
        { name: "Head Coach", role: "Head Coach" } // Using placeholder for 'Alex' as Head Coach as well, adjust as needed based on structure
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
                <div className="text-center mb-16 max-w-4xl mx-auto space-y-4">
                    <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                        Specialist <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Coaching</span>
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />

                    <motion.div variants={fadeIn} className="mt-6 mb-8 inline-block bg-rr-dark text-white font-bold uppercase tracking-wider text-sm px-6 py-2 rounded-full shadow-lg">
                        Coached by the best, no mums, no volunteers
                    </motion.div>

                    <motion.p variants={fadeIn} className="text-lg text-slate-600 font-medium">
                        Beyond the core work, players get access to specialist coaching across every discipline of the modern game — led by coaches who have done it at the highest level.
                    </motion.p>
                </div>

                {/* Leadership Structure */}
                <motion.div variants={fadeIn} className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {leaders.map((leader, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-xl font-black text-rr-dark mb-1 uppercase">{leader.name}</h4>
                                <p className="text-sm font-bold text-rr-pink uppercase tracking-widest">{leader.role}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Action Image */}
                <motion.div
                    variants={fadeIn}
                    className="relative w-full h-40 md:aspect-video md:h-auto rounded-2xl overflow-hidden mb-8 md:mb-12 border border-slate-200 shadow-xl group"
                >
                    <img
                        src="/assets/lp2/sooryavanshi-century-walkoff.avif"
                        alt="Vaibhav Sooryavanshi — Century Walkoff"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
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
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-rr-dark">{item.title}</h3>
                                    {item.coach && (
                                        <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mt-1">Lead: {item.coach}</p>
                                    )}
                                </div>
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

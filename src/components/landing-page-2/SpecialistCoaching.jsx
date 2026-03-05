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
            desc: "Modern T20 cricket demands batters who can score all around the ground, switch between gears, and accelerate at will. Range hitting, ramp shots, reverse sweeps, and the ability to manufacture boundaries under pressure from any position on the crease.",
            color: "from-rr-blue to-rr-pink",
            coach: "Matthew Spoors & Jarryd Rogers"
        },
        {
            title: "Bowl to Control the Game",
            desc: "Bowling with intent is about more than taking wickets — it's about controlling pressure, manipulating scoring zones, and executing plans that suffocate the opposition. Accuracy under pressure, variation sequencing, and the ability to bowl to fields and force mistakes.",
            color: "from-rr-pink to-rr-blue",
            coach: "Pace Staff"
        },
        {
            title: "Spin Mastery & Variation",
            desc: "Effective spin is about control, deception, and taking the game away from a batter at the right moment. Stock ball accuracy, flight and loop, wrong'uns, arm balls — and the tactical intelligence to know when and where each variation is the right weapon.",
            color: "from-rr-blue to-rr-pink",
            coach: "Alex Lewis & Harkirat Bajwa"
        },
        {
            title: "Wicketkeeping Craft",
            desc: "Modern keeping demands explosive athleticism, technical precision, and match intelligence. Stance and footwork, standing-up skills, glove work in high-pressure moments, and reading bowlers and batters — separating good keepers from exceptional ones.",
            color: "from-rr-pink to-rr-blue",
            coach: "Wicketkeeping Specialist"
        },
        {
            title: "Game-Changing Fielding",
            desc: "Elite fielders don't just save runs — they change the momentum of matches. Ground coverage, long-barrier and sliding technique, direct-hit accuracy, and high-pressure catching that turns half-chances into wickets. Millimetres matter and this is where they're trained.",
            color: "from-rr-blue to-rr-pink",
            coach: "Fielding Staff"
        },
        {
            title: "Strength & Conditioning",
            desc: "Cricket-specific athleticism built for elite performance: explosive power for hitting, bowling endurance, speed and agility in the field, and recovery management across a full 12 weeks. S&C integrated to keep players performing at their peak throughout the program.",
            color: "from-rr-pink to-rr-blue",
            coach: "High Performance Unit"
        },
        {
            title: "Mental Performance & Mindset",
            desc: "Elite cricketers make better decisions faster, manage risk more accurately, and execute under pressure more consistently. Pre-performance routines, pressure management, acceptable risk decision-making, and the self-awareness to back your game when it matters most.",
            color: "from-rr-blue to-rr-pink",
            coach: "Leadership Team"
        }
    ];

    const leaders = [
        { name: "Siddhartha Lahiri", role: "Global Head of International Player Talent Development" },
        { name: "Alex Lewis", role: "Director of Cricket" },
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
                        Beyond core skills, the Elite Program provides access to highly specialised disciplines necessary for dominating the modern game, led by a world-class coaching structure.
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

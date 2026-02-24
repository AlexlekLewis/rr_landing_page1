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

    const pillars = [
        {
            title: "Talent First",
            subtitle: "Discover · Back · Elevate",
            desc: "Identify potential before it's obvious and invest early. Selection skews toward growth, not pedigree. Stretch, then support."
        },
        {
            title: "Play the Future",
            subtitle: "Lead with Innovation",
            desc: "Technology and data inform decisions, not replace judgment. Short learning cycles. Experimentation is expected."
        },
        {
            title: "Learn by Doing",
            subtitle: null,
            desc: "Skills are forged in context — match simulations, scenarios, role reversals. \"Mistake → Lesson → Adjustment\" is the rhythm of our environment."
        },
        {
            title: "Play Bold",
            subtitle: null,
            desc: "Courage is a trainable skill. We reward intent and intelligent risk. We define \"positive\" by options created, not only outcomes achieved."
        },
        {
            title: "Joy, Curiosity & Lifelong Learning",
            subtitle: null,
            desc: "Keep the game fun and the mind open — curiosity accelerates mastery. Coaches stay students first."
        },
        {
            title: "Holistic Development",
            subtitle: null,
            desc: "Performance = Skills × Fitness × Mindset × Recovery × Life. We coach the person — nutrition, sleep, mental skills, character."
        },
        {
            title: "Fairness, Respect & Inclusion",
            subtitle: null,
            desc: "Every learner gets dignity of attention. No favourites, no shortcuts. Diverse backgrounds make us better and braver."
        }
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
                {/* Action Image — LP1 Style */}
                <motion.div variants={fadeIn} className="relative w-full aspect-video rounded-2xl overflow-hidden mb-16 shadow-xl border border-slate-200 group">
                    <img
                        src="/assets/lp2/jaiswal-power-hitting.webp"
                        alt="Yashasvi Jaiswal — Power Hitting"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </motion.div>

                {/* Our Belief — Quote Card */}
                <motion.div variants={fadeIn} className="mb-20 relative max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 relative overflow-hidden">
                        {/* Brand accent stripe */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rr-pink to-rr-blue rounded-t-3xl" />
                        {/* Left accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-rr-pink to-rr-blue rounded-l-3xl" />

                        <div className="text-center space-y-6">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-rr-pink/10 text-rr-pink font-bold text-sm tracking-wide uppercase">
                                Our Belief
                            </span>
                            <h3 className="text-xl md:text-3xl font-black text-rr-dark leading-tight tracking-tight">
                                Cricket is a vehicle to shape confident, curious, resilient people.
                            </h3>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
                                The Royals Way is a living philosophy that guides how we scout, coach, play, learn, and lead —{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue font-bold">
                                    from backyard to stadium
                                </span>.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* The 7 Pillars Title */}
                <div className="text-center mb-12">
                    <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                        The Royals Way
                    </motion.h2>
                    <motion.div variants={fadeIn} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full mt-4" />
                    <motion.p variants={fadeIn} className="text-lg text-slate-500 mt-4 font-bold uppercase tracking-widest">
                        The 7 Pillars
                    </motion.p>
                    <motion.p variants={fadeIn} className="text-base text-slate-600 mt-3 font-medium max-w-2xl mx-auto">
                        The philosophy that governs how we coach, develop and deliver our program.
                    </motion.p>
                </div>

                {/* Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className={`relative bg-white shadow-lg border border-slate-100 rounded-2xl p-6 overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${index === pillars.length - 1 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''}`}
                        >
                            {/* Accent stripe */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${index % 2 === 0 ? 'from-rr-pink to-rr-blue' : 'from-rr-blue to-rr-pink'} rounded-t-2xl`} />

                            <div className="flex items-start gap-4">
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-rr-pink to-rr-blue leading-none mt-1 shrink-0">
                                    {index + 1}.
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold text-rr-dark">
                                        {pillar.title}
                                    </h3>
                                    {pillar.subtitle && (
                                        <p className="text-sm font-bold text-rr-pink mb-2">{pillar.subtitle}</p>
                                    )}
                                    <p className="text-slate-600 font-medium leading-relaxed text-sm mt-1">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Our Promise */}
                <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-rr-pink to-rr-blue rounded-2xl p-[2px]">
                        <div className="bg-white rounded-[14px] p-8 md:p-10">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-rr-blue/10 text-rr-blue font-bold text-sm tracking-wide uppercase mb-4">
                                Our Promise
                            </span>
                            <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                                We will discover potential early, develop it holistically, and elevate it with opportunity.
                                We will keep cricket fun and futures open.{' '}
                                <span className="font-black text-rr-dark">That is the Royals Way.</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default TheRoyalsWay;

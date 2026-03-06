import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Coach Data ────────────────────────────────────────────────────────────────

const tiers = [
    {
        id: 'leadership',
        label: 'Program Leadership',
        accent: 'from-rr-pink to-rr-blue',
        coaches: [
            {
                name: "Andy Crook",
                role: "Director of Cricket, Rajasthan Royals Academy Melbourne",
                bio: "Andy runs the operations behind the program. His deep experience in cricket administration and coaching means every session is planned, every drill has a purpose, and every player gets the standard the Rajasthan Royals expect.",
            },
            {
                name: "Siddhartha Lahiri",
                role: "Rajasthan Royals Group Head of Int'l Player Development and Assistant Coach to Paarl, Rajasthan and Barbados Royals",
                bio: "Siddhartha runs the Rajasthan Royals' global talent network. He oversees player scouting and development across every Royals Academy in the world — meaning Melbourne's best young players have a direct line to one of the IPL's biggest franchises.",
            },
            {
                name: "Alex Lewis",
                role: "Rajasthan Royals Academy Melbourne Elite Program Head Coach",
                bio: "Over 20 years coaching cricketers through Premier Cricket and representative pathways. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors.",
            },
        ],
    },
    {
        id: 'elite',
        label: 'Elite Coaching Staff',
        accent: 'from-rr-blue to-rr-pink',
        coaches: [
            {
                name: "Matthew Spoors",
                role: "Batting — Power Hitting & 360",
                bio: "BBL star and T20 International centurion. From Perth Scorchers to Melbourne Renegades, Matthew has scored runs at the highest level under the most pressure. He brings firsthand knowledge of what it takes to perform on the big stage.",
            },
            {
                name: "Jarryd Rogers",
                role: "Batting — Power Hitting Mechanics",
                bio: "Victorian State Baseball batting coach and power hitting specialist. Jarryd brings a unique cross-sport perspective on how to generate bat speed and hit the ball harder — giving players a genuine, measurable edge at the crease.",
            },
            {
                name: "Harkirat Bajwa",
                role: "Bowling — Spin",
                bio: "Australian U19 representative and Premier Cricket competitor. A modern spinner who turns the ball both ways with real accuracy — teaching the variations and tactics that win matches.",
            },
            {
                name: "Adelaide Campion",
                role: "Program Coach",
                bio: "Inaugural captain of Carlton CC. Premiership winner with Ringwood. Malaysian Super Slam title holder. Member of Australia's Indoor World Cup-winning squads. Currently Head Coach of the Australian U18 Indoor Cricket Team. 15+ years at the highest level.",
            },
            {
                name: "Glenn Butterworth",
                role: "Program Coach",
                bio: "27 years of coaching excellence spanning two continents. Completed Level 2 Coaching at Lord's Cricket Ground and coached across Middlesex and the UK. Now driving female pathways development at Fitzroy Doncaster.",
            },
        ],
    },
    {
        id: 'program',
        label: 'Program Team',
        accent: 'from-rr-pink/60 to-rr-blue/60',
        coaches: [
            {
                name: "Joel Ried",
                role: "Program Coach",
                bio: "A passionate and technically sharp coach who thrives in developing young cricketers through structured, high-intensity sessions. Joel's energy on the training ground is infectious — he demands excellence and rewards effort in equal measure.",
            },
            {
                name: "Bret Cole",
                role: "Talent Scout",
                bio: "Decades of experience identifying and nurturing emerging talent across Victoria's cricket landscape. Bret's trained eye for potential means every player is being watched by someone who knows exactly what pathways and selectors are looking for.",
            },
            {
                name: "Zac Macciocca",
                role: "Program Assistant Coach",
                bio: "A Fitzroy Doncaster stalwart since 2017/18 and Dowling Shield coach for over six years. Zac combines club-cricket grit with genuine technical knowledge and a coaching presence that connects with young players from day one.",
            },
            {
                name: "Ikroop Dhanoa",
                role: "Program Assistant Coach",
                bio: "A dynamic young coach whose passion for player development is matched by his deep understanding of modern T20 cricket. Ikroop brings cultural diversity and fresh tactical thinking to the coaching group.",
            },
            {
                name: "Rittin Raman",
                role: "Program Assistant Coach",
                bio: "Driven by a genuine love for developing cricketers at every level. Rittin brings high energy, technical precision, and an unwavering commitment to helping young players unlock their potential.",
            },
        ],
    },
];

const specialties = [
    { title: "Power and 360 Hitting", coach: "Matthew Spoors & Jarryd Rogers", color: "from-rr-blue to-rr-pink", desc: "Ramp shots, reverse sweeps, and the ability to find the boundary from any position — the shots that win T20 games." },
    { title: "Bowl to Control the Game", coach: "Pace Staff", color: "from-rr-pink to-rr-blue", desc: "Accuracy under pressure, smart variations, and the discipline to bowl to a field and force mistakes." },
    { title: "Spin Mastery & Variation", coach: "Alex Lewis & Harkirat Bajwa", color: "from-rr-blue to-rr-pink", desc: "Control, deception, and flight — wrong'uns, arm balls, and knowing exactly when to use each one." },
    { title: "Wicketkeeping Craft", coach: "Wicketkeeping Specialist", color: "from-rr-pink to-rr-blue", desc: "Quick reflexes, clean technique, and smart decision-making — the details that separate good keepers from great ones." },
    { title: "Game-Changing Fielding", coach: "Fielding Staff", color: "from-rr-blue to-rr-pink", desc: "Ground coverage, sliding saves, accurate throwing, and high-pressure catching that turns half-chances into wickets." },
    { title: "Strength & Conditioning", coach: "High Performance Unit", color: "from-rr-pink to-rr-blue", desc: "Cricket-specific fitness: explosive power, bowling endurance, speed, agility, and proper recovery." },
    { title: "Mental Performance & Mindset", coach: "Leadership Team", color: "from-rr-blue to-rr-pink", desc: "Pre-game routines, pressure management, and the confidence to trust your skills in the biggest moments." },
];

// ─── Animations ────────────────────────────────────────────────────────────────

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' }
    }),
};

// ─── Tier Accordion ────────────────────────────────────────────────────────────

const TierBlock = ({ tier, index }) => {
    const [open, setOpen] = useState(index === 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border border-white/10 rounded-2xl overflow-hidden"
        >
            {/* Tier Header — always visible */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left group"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${tier.accent} shrink-0`} />
                    <span className="text-lg md:text-xl font-black text-white uppercase tracking-wide">
                        {tier.label}
                    </span>
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest hidden sm:inline">
                        {tier.coaches.length} coaches
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:border-rr-pink/60 transition-colors"
                >
                    <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14M5 12h14" />
                    </svg>
                </motion.div>
            </button>

            {/* Coach Cards */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="cards"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 md:px-8 md:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tier.coaches.map((coach, i) => (
                                <motion.div
                                    key={coach.name}
                                    custom={i}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3 hover:bg-white/10 hover:border-rr-pink/30 transition-all duration-300"
                                >
                                    <div className={`w-8 h-0.5 rounded-full bg-gradient-to-r ${tier.accent}`} />
                                    <div>
                                        <h4 className="text-base font-black text-white uppercase tracking-wide leading-tight">{coach.name}</h4>
                                        <p className="text-xs font-bold text-rr-pink mt-1 leading-snug">{coach.role}</p>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed">{coach.bio}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const SpecialistCoaching = () => (
    <section className="py-24 px-6 lg:px-8 relative z-10 bg-rr-dark overflow-hidden">

        {/* Watermark */}
        <img src="/assets/rr-lion-white.png" alt="" aria-hidden="true"
            className="absolute -right-24 top-1/2 -translate-y-1/2 h-[80%] w-auto object-contain opacity-[0.03] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16 max-w-3xl"
            >
                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">The Coaching Group</p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
                    Specialist<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Coaching</span>
                </h2>
                <p className="text-lg text-white/60 font-medium leading-relaxed max-w-xl">
                    Every coach is a paid professional with real cricket credentials — people who have played, coached, and competed at the highest levels.
                </p>
            </motion.div>

            {/* Tier Accordions */}
            <div className="space-y-3 mb-20">
                {tiers.map((tier, i) => (
                    <TierBlock key={tier.id} tier={tier} index={i} />
                ))}
            </div>

            {/* Specialist Areas Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-10"
            >
                <span className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] whitespace-nowrap">Specialist Areas</span>
                <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* Specialist Areas — horizontal scroll on mobile, grid on desktop */}
            <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
                {specialties.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="shrink-0 w-64 md:w-auto snap-start bg-white/5 border border-white/10 rounded-xl p-5 hover:border-rr-pink/30 hover:bg-white/8 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color}`} />
                        <h3 className="text-sm font-black text-white uppercase tracking-wide leading-tight mb-1">{item.title}</h3>
                        <p className="text-[10px] font-bold text-rr-pink uppercase tracking-widest mb-3">Lead: {item.coach}</p>
                        <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

        </div>
    </section>
);

export default SpecialistCoaching;

import React from 'react';
import { motion } from 'framer-motion';

// ─── Coach Data ────────────────────────────────────────────────────────────────

const leadershipCoaches = [
    {
        name: "Andy Crook",
        role: "Director of Cricket, Rajasthan Royals Academy Melbourne",
        tier: "Program Leadership",
        bio: "Andy runs the operations behind the program. His deep experience in cricket administration and coaching means every session is planned, every drill has a purpose, and every player gets the standard the Rajasthan Royals expect.",
    },
    {
        name: "Siddhartha Lahiri",
        role: "Rajasthan Royals Group Head of Int'l Player Development and Assistant Coach to Paarl, Rajasthan and Barbados Royals",
        tier: "Program Leadership",
        bio: "Siddhartha runs the Rajasthan Royals' global talent network. He oversees player scouting and development across every Royals Academy in the world — meaning Melbourne's best young players have a direct line to one of the IPL's biggest franchises.",
    },
    {
        name: "Alex Lewis",
        role: "Rajasthan Royals Academy Melbourne Elite Program Head Coach",
        tier: "Program Leadership",
        bio: "Over 20 years coaching cricketers through Premier Cricket and representative pathways. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors.",
    },
];

const eliteCoaches = [
    {
        name: "Matthew Spoors",
        role: "Batting — Power Hitting & 360",
        tier: "Elite Coaching Staff",
        bio: "BBL star and T20 International centurion. From Perth Scorchers to Melbourne Renegades, Matthew has scored runs at the highest level under the most pressure. He brings firsthand knowledge of what it takes to perform on the big stage — the kind of experience you simply can't get from textbooks.",
    },
    {
        name: "Jarryd Rogers",
        role: "Batting — Power Hitting Mechanics",
        tier: "Elite Coaching Staff",
        bio: "Victorian State Baseball batting coach and power hitting specialist. Jarryd brings a unique cross-sport perspective on how to generate bat speed and hit the ball harder. His approach gives players a genuine, measurable edge at the crease.",
    },
    {
        name: "Harkirat Bajwa",
        role: "Bowling — Spin",
        tier: "Elite Coaching Staff",
        bio: "Australian U19 representative and Premier Cricket competitor, Harkirat is a modern spinner who turns the ball both ways with real accuracy. He understands how spin bowling works inside and out, and teaches young bowlers the variations and tactics that win matches.",
    },
    {
        name: "Adelaide Campion",
        role: "Program Coach",
        tier: "Elite Coaching Staff",
        bio: "Inaugural captain of Carlton Cricket Club. Premiership winner with Ringwood. Malaysian Super Slam title holder. Member of Australia's Indoor World Cup-winning squads. Currently Head Coach of the Australian U18 Indoor Cricket Team and Victorian U18 Indoor Cricket Team. 15+ years of relentless commitment to the game at the highest level.",
    },
    {
        name: "Glenn Butterworth",
        role: "Program Coach",
        tier: "Elite Coaching Staff",
        bio: "27 years of coaching excellence spanning two continents. A Collingwood CC wicket keeper-batsman who won two HDCA batting averages, Glenn completed his Level 2 Coaching at Lord's Cricket Ground and coached across Middlesex and the UK. Now driving female pathways development at Fitzroy Doncaster.",
    },
];

const programTeam = [
    {
        name: "Joel Ried",
        role: "Program Coach",
        tier: "Program Team",
        bio: "A passionate and technically sharp coach who thrives in developing young cricketers through structured, high-intensity sessions. Joel's energy on the training ground is infectious — he demands excellence and rewards effort in equal measure.",
    },
    {
        name: "Bret Cole",
        role: "Talent Scout",
        tier: "Program Team",
        bio: "Decades of experience identifying and nurturing emerging talent across Victoria's cricket landscape. Bret's trained eye for potential means every player isn't just being coached — they're being watched by someone who knows exactly what pathways and selectors are looking for.",
    },
    {
        name: "Zac Macciocca",
        role: "Program Assistant Coach",
        tier: "Program Team",
        bio: "A Fitzroy Doncaster stalwart since 2017/18 and Dowling Shield coach for over six years. Zac combines club-cricket grit with genuine technical knowledge, bringing an energetic and relatable coaching presence that connects with young players from day one.",
    },
    {
        name: "Ikroop Dhanoa",
        role: "Program Assistant Coach",
        tier: "Program Team",
        bio: "A dynamic young coach whose passion for player development is matched by his deep understanding of modern T20 cricket. Ikroop brings cultural diversity and fresh tactical thinking to the coaching group, helping every athlete feel seen and supported.",
    },
    {
        name: "Rittin Raman",
        role: "Program Assistant Coach",
        tier: "Program Team",
        bio: "Driven by a genuine love for developing cricketers at every level. Rittin's enthusiasm is contagious — he brings high energy, technical precision, and an unwavering commitment to helping young players unlock their potential on and off the pitch.",
    },
];

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

// ─── Animation Variants ────────────────────────────────────────────────────────

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: 'easeOut' }
    }
};

const sectionHeaderVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// ─── Coach Card ────────────────────────────────────────────────────────────────

const tierAccent = {
    "Program Leadership": "from-rr-pink to-rr-blue",
    "Elite Coaching Staff": "from-rr-blue to-rr-pink",
    "Program Team": "from-slate-400 to-slate-600",
};

const CoachCard = ({ coach }) => (
    <motion.div
        variants={cardVariants}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col gap-3 relative overflow-hidden"
    >
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierAccent[coach.tier] || 'from-rr-pink to-rr-blue'} rounded-t-2xl`} />
        <div>
            <h4 className="text-base font-black text-rr-dark uppercase tracking-wide leading-tight">{coach.name}</h4>
            <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mt-1 leading-snug">{coach.role}</p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium flex-1">{coach.bio}</p>
    </motion.div>
);

// ─── Coach Group ───────────────────────────────────────────────────────────────

const CoachGroup = ({ label, coaches, cols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="mb-14"
    >
        <motion.div variants={sectionHeaderVariants} className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">{label}</span>
            <div className="flex-1 h-px bg-slate-200" />
        </motion.div>
        <div className={`grid ${cols} gap-5`}>
            {coaches.map((coach, i) => (
                <CoachCard key={i} coach={coach} />
            ))}
        </div>
    </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const SpecialistCoaching = () => (
    <section className="py-24 px-6 lg:px-8 relative z-10 bg-white border-t border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto">

            {/* Section Header */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={containerVariants}
                className="text-center mb-16 max-w-4xl mx-auto space-y-4"
            >
                <motion.h2 variants={sectionHeaderVariants} className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight">
                    Specialist <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Coaching</span>
                </motion.h2>
                <motion.div variants={sectionHeaderVariants} className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                <motion.p variants={sectionHeaderVariants} className="mt-6 text-lg text-slate-600 font-medium">
                    Every coach in this program is a paid professional with real cricket credentials — people who have played, coached, and competed at the highest levels.
                </motion.p>
            </motion.div>

            {/* Coach Groups */}
            <CoachGroup
                label="Program Leadership"
                coaches={leadershipCoaches}
                cols="grid-cols-1 md:grid-cols-3"
            />
            <CoachGroup
                label="Elite Coaching Staff"
                coaches={eliteCoaches}
                cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            />
            <CoachGroup
                label="Program Team"
                coaches={programTeam}
                cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            />

            {/* Specialist Areas */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={containerVariants}
            >
                <motion.div variants={sectionHeaderVariants} className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Specialist Areas</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specialties.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="bg-white shadow-md border border-slate-200 rounded-3xl p-8 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} rounded-t-3xl`} />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-3">
                                    <h3 className="text-base font-bold text-rr-dark">{item.title}</h3>
                                    {item.coach && (
                                        <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mt-1">Lead: {item.coach}</p>
                                    )}
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm flex-grow font-medium">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </div>
    </section>
);

export default SpecialistCoaching;

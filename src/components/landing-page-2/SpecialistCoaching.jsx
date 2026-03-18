import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Data ──────────────────────────────────────────────────────────────────────

const tiers = [
    {
        id: 'leadership',
        label: 'Program Leadership',
        coaches: [
            {
                name: "Siddhartha Lahiri",
                role: "Head of International Player Development",
                bio: "Performance coach of the Rajasthan Royals, as well as Assistant Coach of Paarl and Barbados Royals, Siddhartha runs the Rajasthan Royals' global talent network. He oversees player scouting and development across every Royals Academy in the world — meaning the Elite Program's best players have a direct line to one of the IPL's biggest franchises. Leading talent identification and performance globally for the Royals Group of franchises and the Royals Academy network.",
                tag: "Global Development",
            },
            {
                name: "Andy Crook",
                role: "Director of Cricket",
                bio: "Andy Crook has lived T20 cricket from the very beginning. A former AIS Commonwealth Bank Cricket Academy scholar, Andy played professionally for the South Australian Redbacks at the age of 17, and then went on to play for Lancashire County Cricket Club and Northamptonshire County Cricket Club. At Lancashire he played in a T20 Vitality Blast Final, held the List A highest score batting record for a decade and most recently was part of Australia's 2025 T20 Masters World Cup winning campaign in Pakistan. Andy was in English county grounds when T20 was first played and watched the game transform in real time after its 2003 launch. That experience shaped everything he believes about how the format should be developed and taught — that T20 is its own game, with its own skills, its own roles, and its own instincts, and that the best players are identified early and developed specifically for it. As the Director of Cricket at the Rajasthan Royals Academy in Australia, Andy combines his executive sports experience with working directly with players — supporting the reviewing footage, training and game play monitoring, and building individual development plans around each player's specific T20 role and skill set.",
                tag: "Executive & T20 Leader",
            },
            {
                name: "Alex Lewis",
                role: "Head Coach",
                bio: "As Elite Program Head Coach, and a key part of the Rajasthan Royals Academy Leadership Group, Alex manages the day to day program and has pulled together an exceptional group of coaches to change your T20 skillset.\n\nAlex has a superb background, and since being appointed by the Rajasthan Royals Academy leadership team, has been instrumental in creating a program with individual player requirements at its heart.\n\nFor over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors.\n\nCurrent premier cricket senior assistant coach, bowling coach and Academy director.",
                tag: "Head Coach",
            },
        ],
    },
    {
        id: 'elite',
        label: 'Elite Coaching Staff',
        coaches: [
            {
                name: "Matthew Spoors",
                role: "Batting — Power Hitting & 360",
                bio: "Matthew Spoors is the definition of a modern T20 cricketer. A right-handed top-order batter and attacking leg-spinner, Matthew announced himself on the international stage with an unbeaten 108 off 66 balls on his T20I debut for Canada — the highest individual score ever recorded on T20 International debut. From WA state age-group cricket and the Cricket Australia XI to the Big Bash League with the Perth Scorchers and Melbourne Renegades, and international franchise appearances in the Caribbean's Max60 League, Matthew has built his game around the demands of T20 cricket: clean ball-striking, explosive power, and the ability to finish innings under pressure. Using Rashid Khan as a blueprint for his leg-spin and continually refining his power-hitting craft, he represents exactly the kind of dual-threat, T20-specific player the Elite Program is designed to develop. His journey from WA Premier Cricket to the professional franchise circuit is a masterclass in reinvention, self-belief, and what happens when talent meets structured development.",
                tag: "Power Hitting",
            },
            {
                name: "Peter Hatzoglou",
                role: "Bowling — Specialist Coach",
                bio: "Melbourne-born leg-spinner Peter Hatzoglou is one of Australian cricket's true T20 specialists. From third-grade premier cricket to the global franchise circuit in just two years, Peter has played in the BBL, The Hundred, CPL, PSL, and T20 leagues across the UAE and the USA — winning two Big Bash titles along the way. Known for his unorthodox action, deceptive pace off the pitch, and an intelligent approach to the wrist-spin craft shaped by mentorship from Shane Warne, Peter brings a modern, tactical perspective to bowling that is perfectly aligned with the Elite Program's focus on developing T20-specific skills. His experience competing across conditions and cultures worldwide gives him a rare insight into what it takes to succeed as a bowler in the modern game.",
                tag: "T20 Bowling",
            },
            {
                name: "Jarryd Rogers",
                role: "Batting — Power Hitting Mechanics",
                bio: "Former Australian Baseball League (ABL) star and Victorian state baseball batting coach and power hitting specialist. Jarryd brings a unique cross-sport perspective on how to generate bat speed and hit the ball harder — giving players a genuine, measurable edge at the crease.",
                tag: "Bat Speed",
            },
            {
                name: "Harkirat Bajwa",
                role: "Bowling — Spin",
                bio: "Australian U19 representative and Premier Cricket competitor. A modern spinner who turns the ball both ways with real accuracy — teaching the variations and tactics that win matches.",
                tag: "Spin Bowling",
            },
            {
                name: "Simon Feros",
                role: "Bowling — Pace",
                bio: "Dr Simon Feros is one of Australia's most respected fast bowling coaches and the founder of Bowlstrong — a specialist coaching practice that has transformed pace bowlers from junior club level through to international cricket. A lecturer at Deakin University with a PhD in fast bowling performance, Simon brings over two decades of scientific research in biomechanics, physical preparation, and motor learning directly onto the training ground. His approach is unique: every technical change is grounded in evidence, every drill has a purpose, and every bowler receives a programme built around their body and their action. From run-up mechanics and front-leg bracing through to workload management and injury prevention, Simon's methods have helped fast bowlers add genuine pace, improve accuracy, and stay on the park longer. With over 32,000 followers on Instagram and endorsements from elite coaches and players across the country, he is widely regarded as a leading authority on what it takes to bowl fast and stay fit doing it.",
                tag: "Pace Bowling",
            },
        ],
    },
];

const specialties = [
    { title: "Power & 360 Hitting", coach: "Matthew Spoors & Jarryd Rogers", color: "from-rr-blue to-rr-pink", desc: "Power shots, ramp shots, reverse batting, and the ability to find the boundary from any position — the shots that win T20 games." },
    { title: "Bowl to Control the Game", coach: "Simon Feros (Bowlstrong)", color: "from-rr-pink to-rr-blue", desc: "Correct mechanics, pace, accuracy under pressure, smart variations, and the discipline to bowl to a field and force mistakes." },
    { title: "Spin Mastery & Variation", coach: "Alex Lewis & Harkirat Bajwa", color: "from-rr-blue to-rr-pink", desc: "Control, deception, and flight — wrong'uns, arm balls, and knowing exactly when to use each one." },
    { title: "Wicketkeeping Craft", coach: "Wicketkeeping Specialist", color: "from-rr-pink to-rr-blue", desc: "Quick reflexes, clean technique, and smart decision-making — the details that separate good keepers from great ones." },
    { title: "Game-Changing Fielding", coach: "Fielding Staff", color: "from-rr-blue to-rr-pink", desc: "Ground coverage, sliding saves, accurate throwing, and high-pressure catching that turns half-chances into wickets." },
    { title: "Strength & Conditioning", coach: "High Performance Unit", color: "from-rr-pink to-rr-blue", desc: "Cricket-specific fitness: explosive power, bowling endurance, speed, agility, and proper recovery." },
    { title: "Mental Performance & Mindset", coach: "Leadership Team", color: "from-rr-blue to-rr-pink", desc: "Pre-game routines, pressure management, and the confidence to trust your skills in the biggest moments." },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const allCoaches = tiers.flatMap(t => t.coaches.map(c => ({ ...c, tier: t.label })));

const tierAccent = {
    'Program Leadership': 'from-rr-pink to-rr-blue',
    'Elite Coaching Staff': 'from-rr-blue to-rr-pink',
    'Program Team': 'from-white/30 to-white/10',
};

const tierDot = {
    'Program Leadership': 'bg-rr-pink',
    'Elite Coaching Staff': 'bg-rr-blue',
    'Program Team': 'bg-white/30',
};

// ─── Initials Avatar ───────────────────────────────────────────────────────────

const Avatar = ({ name, tier, size = 'lg' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
    const gradient = tier === 'Program Leadership'
        ? 'from-rr-pink to-rr-blue'
        : tier === 'Elite Coaching Staff'
            ? 'from-rr-blue to-rr-pink'
            : 'from-white/20 to-white/10';
    const sz = size === 'lg' ? 'w-12 h-12 text-base' : 'w-8 h-8 text-xs';
    return (
        <div className={`${sz} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 font-black text-white`}>
            {initials}
        </div>
    );
};

// ─── Mobile: tap-to-expand list ───────────────────────────────────────────────

const MobileRoster = () => {
    const [open, setOpen] = useState(null);
    return (
        <div className="space-y-px">
            {tiers.map((tier, ti) => (
                <div key={tier.id}>
                    {/* Tier divider */}
                    <div className="flex items-center gap-3 py-3 px-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${tierDot[tier.label]}`} />
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">{tier.label}</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>
                    {tier.coaches.map((coach, ci) => {
                        const key = `${ti}-${ci}`;
                        const isOpen = open === key;
                        return (
                            <div key={coach.name} className="border-b border-white/5 last:border-0">
                                <button
                                    onClick={() => setOpen(isOpen ? null : key)}
                                    className={`w-full flex items-center gap-4 py-4 px-2 text-left transition-colors duration-200 ${isOpen ? 'bg-white/5 rounded-xl' : ''}`}
                                >
                                    <Avatar name={coach.name} tier={tier.label} size="sm" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-white uppercase tracking-wide truncate">{coach.name}</p>
                                        <p className="text-[10px] font-bold text-rr-pink truncate mt-0.5">{coach.tag}</p>
                                    </div>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-white/30 text-xl font-light shrink-0"
                                    >+</motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-2 pb-5 pt-1">
                                                <p className="text-xs font-bold text-white/40 mb-2 leading-snug">{coach.role}</p>
                                                <p className="text-sm text-white/60 leading-relaxed">{coach.bio}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// ─── Desktop: roster list + spotlight panel ───────────────────────────────────

const DesktopRoster = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const active = allCoaches[activeIdx];

    return (
        <div className="grid grid-cols-[300px_1fr] gap-0 min-h-[520px] border border-white/10 rounded-2xl overflow-hidden">

            {/* Left — scrollable name list */}
            <div className="border-r border-white/10 overflow-y-auto max-h-[600px] py-2">
                {tiers.map((tier, ti) => {
                    const startIdx = tiers.slice(0, ti).reduce((s, t) => s + t.coaches.length, 0);
                    return (
                        <div key={tier.id}>
                            {/* Tier label */}
                            <div className="flex items-center gap-2 px-5 py-3 sticky top-0 bg-rr-dark/95 backdrop-blur-sm z-10">
                                <span className={`w-1 h-1 rounded-full ${tierDot[tier.label]}`} />
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">{tier.label}</span>
                            </div>
                            {tier.coaches.map((coach, ci) => {
                                const idx = startIdx + ci;
                                const isActive = activeIdx === idx;
                                return (
                                    <button
                                        key={coach.name}
                                        onClick={() => setActiveIdx(idx)}
                                        className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all duration-200 relative group
                                            ${isActive ? 'bg-white/8' : 'hover:bg-white/4'}`}
                                    >
                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeBar"
                                                className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b ${tierAccent[tier.label]}`}
                                            />
                                        )}
                                        <Avatar name={coach.name} tier={tier.label} size="sm" />
                                        <div className="min-w-0">
                                            <p className={`text-sm font-black uppercase tracking-wide truncate transition-colors ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/75'}`}>
                                                {coach.name}
                                            </p>
                                            <p className={`text-[10px] font-bold truncate transition-colors ${isActive ? 'text-rr-pink' : 'text-white/20 group-hover:text-white/40'}`}>
                                                {coach.tag}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Right — spotlight panel */}
            <div className="relative overflow-hidden bg-white/[0.02]">
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-rr-pink/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rr-blue/10 rounded-full blur-3xl pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIdx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="relative z-10 p-10 h-full flex flex-col justify-between"
                    >
                        <div>
                            {/* Tier badge */}
                            <div className="flex items-center gap-3 mb-8">
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40`}>
                                    <span className={`w-1 h-1 rounded-full ${tierDot[active.tier]}`} />
                                    {active.tier}
                                </span>
                            </div>

                            {/* Name + avatar */}
                            <div className="flex items-start gap-5 mb-6">
                                <Avatar name={active.name} tier={active.tier} size="lg" />
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-2">
                                        {active.name}
                                    </h3>
                                    <div className={`w-10 h-0.5 rounded-full bg-gradient-to-r ${tierAccent[active.tier]} mb-3`} />
                                    <p className="text-xs font-bold text-rr-pink uppercase tracking-widest leading-snug max-w-xs">
                                        {active.role}
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-white/65 leading-relaxed text-base max-w-lg">
                                {active.bio}
                            </p>
                        </div>

                        {/* Specialty tag */}
                        <div className="mt-8">
                            <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r ${tierAccent[active.tier]} bg-opacity-20`}>
                                {active.tag}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Coach counter */}
                <div className="absolute bottom-4 right-5 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    {activeIdx + 1} / {allCoaches.length}
                </div>
            </div>
        </div>
    );
};

// ─── Main ──────────────────────────────────────────────────────────────────────

const SpecialistCoaching = () => (
    <section className="py-24 px-6 lg:px-8 relative z-10 bg-rr-dark overflow-hidden">

        <div className="max-w-6xl mx-auto">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
            >
                <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4">The Coaching Group</p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-5">
                    Specialist{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Coaching</span>
                </h2>
                <p className="text-lg text-white/50 font-medium leading-relaxed max-w-2xl mx-auto">
                    Our coaches are professionals with elite credentials — people who have played, coached, or competed at the highest levels. New coaches announced shortly.
                </p>
            </motion.div>

            {/* Desktop roster */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="hidden md:block mb-16"
            >
                <DesktopRoster />
            </motion.div>

            {/* Mobile roster */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:hidden mb-14"
            >
                <MobileRoster />
            </motion.div>

            {/* Specialist Disciplines — full cards */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] whitespace-nowrap">Specialist Disciplines</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {specialties.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-rr-pink/30 hover:bg-white/8 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Top gradient rule */}
                            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color}`} />
                            <h3 className="text-sm font-black text-white uppercase tracking-wide leading-tight mb-1">{item.title}</h3>
                            <p className="text-[10px] font-bold text-rr-pink uppercase tracking-widest mb-3">Lead: {item.coach}</p>
                            <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </div>
    </section>
);

export default SpecialistCoaching;

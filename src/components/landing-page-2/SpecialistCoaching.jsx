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
                role: "Rajasthan Royals Group Head of Int'l Player Development and Assistant Coach to Paarl, Rajasthan and Barbados Royals",
                bio: "Siddhartha runs the Rajasthan Royals' global talent network. He oversees player scouting and development across every Royals Academy in the world — meaning Melbourne's best young players have a direct line to one of the IPL's biggest franchises.",
                tag: "Global Development",
            },
            {
                name: "Andy Crook",
                role: "Director of Cricket, Rajasthan Royals Academy Melbourne",
                bio: "Andy runs the operations behind the program. His deep experience in cricket administration and coaching means every session is planned, every drill has a purpose, and every player gets the standard the Rajasthan Royals expect.",
                tag: "Operations & Leadership",
            },
            {
                name: "Alex Lewis",
                role: "Rajasthan Royals Academy Melbourne Elite Program Head Coach",
                bio: "Over 20 years coaching cricketers through Premier Cricket and representative pathways. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors.",
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
                bio: "BBL star and T20 International centurion. From Perth Scorchers to Melbourne Renegades, Matthew has scored runs at the highest level under the most pressure. He brings firsthand knowledge of what it takes to perform on the big stage.",
                tag: "Power Hitting",
            },
            {
                name: "Jarryd Rogers",
                role: "Batting — Power Hitting Mechanics",
                bio: "Victorian State Baseball batting coach and power hitting specialist. Jarryd brings a unique cross-sport perspective on how to generate bat speed and hit the ball harder — giving players a genuine, measurable edge at the crease.",
                tag: "Bat Speed",
            },
            {
                name: "Harkirat Bajwa",
                role: "Bowling — Spin",
                bio: "Australian U19 representative and Premier Cricket competitor. A modern spinner who turns the ball both ways with real accuracy — teaching the variations and tactics that win matches.",
                tag: "Spin Bowling",
            },
        ],
    },
    {
        id: 'program',
        label: 'Program Team',
        coaches: [
            {
                name: "Adelaide Campion",
                role: "Program Coach",
                bio: "Inaugural captain of Carlton CC. Premiership winner with Ringwood. Malaysian Super Slam title holder. Member of Australia's Indoor World Cup-winning squads. Currently Head Coach of the Australian U18 Indoor Cricket Team. 15+ years at the highest level.",
                tag: "All-Format",
            },
            {
                name: "Glenn Butterworth",
                role: "Program Coach",
                bio: "27 years of coaching excellence spanning two continents. Completed Level 2 Coaching at Lord's Cricket Ground and coached across Middlesex and the UK. Now driving female pathways development at Fitzroy Doncaster.",
                tag: "Wicketkeeping",
            },
            {
                name: "Joel Ried",
                role: "Program Coach",
                bio: "A passionate and technically sharp coach who thrives in developing young cricketers through structured, high-intensity sessions. Joel's energy on the training ground is infectious — he demands excellence and rewards effort in equal measure.",
                tag: "High Intensity",
            },
            {
                name: "Bret Cole",
                role: "Talent Scout",
                bio: "Decades of experience identifying and nurturing emerging talent across Victoria's cricket landscape. Bret's trained eye for potential means every player is being watched by someone who knows exactly what pathways and selectors are looking for.",
                tag: "Talent ID",
            },
            {
                name: "Zac Macciocca",
                role: "Program Assistant Coach",
                bio: "A Fitzroy Doncaster stalwart since 2017/18 and Dowling Shield coach for over six years. Zac combines club-cricket grit with genuine technical knowledge and a coaching presence that connects with young players from day one.",
                tag: "Club Pathways",
            },
            {
                name: "Ikroop Dhanoa",
                role: "Program Assistant Coach",
                bio: "A dynamic young coach whose passion for player development is matched by his deep understanding of modern T20 cricket. Ikroop brings cultural diversity and fresh tactical thinking to the coaching group.",
                tag: "T20 Tactics",
            },
            {
                name: "Rittin Raman",
                role: "Program Assistant Coach",
                bio: "Driven by a genuine love for developing cricketers at every level. Rittin brings high energy, technical precision, and an unwavering commitment to helping young players unlock their potential.",
                tag: "Player Development",
            },
        ],
    },
];

const specialties = [
    "Power & 360 Hitting", "Pace Bowling", "Spin Bowling", "Wicketkeeping",
    "Fielding & Athletics", "Strength & Conditioning", "Mental Performance",
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
    const sz = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-9 h-9 text-xs';
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
                    Every coach is a paid professional with real cricket credentials — people who have played, coached, and competed at the highest levels.
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

            {/* Specialist disciplines — pill tags */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] whitespace-nowrap">Specialist Disciplines</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {specialties.map((s, i) => (
                        <motion.span
                            key={s}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-white/50 uppercase tracking-widest hover:border-rr-pink/40 hover:text-white/80 transition-all duration-300 cursor-default"
                        >
                            {s}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

        </div>
    </section>
);

export default SpecialistCoaching;

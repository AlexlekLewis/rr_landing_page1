import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, MapPin, ChevronDown, CalendarClock, Target } from 'lucide-react';

const SQUAD_TEMPLATE = [
    { name: 'Pathway 14 · A', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
    { name: 'Pathway 16-18', ages: 'Ages 16 – 18', players: '24 players', builtFor: 'Premier Academy · Vic U17/U19 · 1st XI', tier: 'pathway' },
    { name: 'Pathway 14 · B', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
    { name: 'Performance Squad', ages: 'Ages 18+', players: '24 players', builtFor: 'Premier Cricket · VMCU rep · senior club season', tier: 'performance' },
];

const VENUES = [
    {
        id: 'bundoora',
        venue: 'Cutting Edge Cricket',
        suburb: 'Bundoora',
        region: 'North Melbourne',
        status: 'open',
        schedule: {
            'Pathway 14 · A': { day: 'Friday', time: '5:30 – 7:30 PM' },
            'Pathway 16-18': { day: 'Friday', time: '7:30 – 9:30 PM' },
            'Pathway 14 · B': { day: 'Saturday', time: '2:00 – 4:00 PM' },
            'Performance Squad': { day: 'Saturday', time: '4:00 – 6:00 PM' },
        },
    },
    {
        id: 'hallam',
        venue: 'Elite Cricket Centre',
        suburb: 'Hallam',
        region: 'South East Melbourne',
        status: 'coming-soon',
        schedule: {},
    },
    {
        id: 'williamstown',
        venue: 'The Netz',
        suburb: 'Williamstown',
        region: 'West Melbourne',
        status: 'coming-soon',
        schedule: {},
    },
];

const SquadAccordionRow = ({ squad, slot, isOpen, onToggle, idx }) => {
    const isPerformance = squad.tier === 'performance';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06, ease: 'easeOut' }}
            className={`rounded-xl overflow-hidden border transition-colors duration-300 ${
                isOpen
                    ? 'border-rr-pink/50 bg-white shadow-[0_8px_30px_rgba(225,31,143,0.12)]'
                    : 'border-slate-200 bg-white hover:border-rr-pink/30'
            }`}
        >
            {/* Header row — always visible */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center gap-4 px-5 md:px-6 py-5 text-left"
            >
                {/* Tier accent bar */}
                <span className={`flex-shrink-0 w-1.5 h-12 rounded-full ${isPerformance ? 'bg-gradient-to-b from-rr-pink to-rr-blue' : 'bg-gradient-to-b from-rr-blue to-rr-pink'}`} />

                {/* Name + ages */}
                <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg md:text-xl font-black text-rr-dark uppercase tracking-wide leading-tight">
                            {squad.name}
                        </span>
                        {isPerformance && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-rr-pink bg-rr-pink/10 border border-rr-pink/30 rounded-full px-2 py-0.5">
                                Elite
                            </span>
                        )}
                    </span>
                    <span className="block text-xs font-bold text-rr-blue uppercase tracking-widest mt-1">
                        {squad.ages}
                    </span>
                </span>

                {/* Day/time (or coming soon) — hidden on small screens to keep tidy */}
                <span className="hidden sm:flex flex-shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-widest text-rr-charcoal/70">
                    {slot ? (
                        <>
                            <Clock className="w-3.5 h-3.5 text-rr-pink" />
                            <span>{slot.day} · {slot.time}</span>
                        </>
                    ) : (
                        <span className="text-rr-charcoal/40">Schedule TBC</span>
                    )}
                </span>

                {/* Chevron */}
                <ChevronDown
                    className={`flex-shrink-0 w-5 h-5 text-rr-pink transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Expanded detail */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 md:px-6 pb-6 pt-1">
                            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {/* Schedule (also shown here for mobile) */}
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rr-charcoal/50 mb-2">
                                        <Clock className="w-3.5 h-3.5 text-rr-pink" /> Schedule
                                    </div>
                                    <div className="text-sm font-bold text-rr-dark uppercase tracking-wide">
                                        {slot ? `${slot.day} · ${slot.time}` : 'To be confirmed'}
                                    </div>
                                </div>
                                {/* Players */}
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rr-charcoal/50 mb-2">
                                        <Users className="w-3.5 h-3.5 text-rr-pink" /> Squad Size
                                    </div>
                                    <div className="text-sm font-bold text-rr-dark uppercase tracking-wide">
                                        {squad.players}
                                    </div>
                                </div>
                                {/* Built for */}
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rr-charcoal/50 mb-2">
                                        <Target className="w-3.5 h-3.5 text-rr-pink" /> Built For
                                    </div>
                                    <div className="text-sm font-semibold text-rr-charcoal leading-snug">
                                        {squad.builtFor}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const SquadsSection = () => {
    const [activeVenue, setActiveVenue] = useState('bundoora');
    const [openSquad, setOpenSquad] = useState(SQUAD_TEMPLATE[0].name); // first open by default
    const venue = VENUES.find((v) => v.id === activeVenue);

    const handleVenueChange = (id) => {
        setActiveVenue(id);
        setOpenSquad(SQUAD_TEMPLATE[0].name); // reset to first squad open
    };

    return (
        <section className="bg-slate-50 py-24 md:py-32">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            Three Venues · Four Squads
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        FIND YOUR SQUAD,<br className="hidden md:block" /> CLOSE TO <span className="text-rr-pink">HOME</span>
                    </h2>
                    <p className="text-base md:text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        The same elite program runs across three Melbourne venues. Pick your venue, then tap a squad to see the detail.
                    </p>
                </motion.div>

                {/* Venue tabs */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    {VENUES.map((v) => {
                        const active = v.id === activeVenue;
                        const open = v.status === 'open';
                        return (
                            <button
                                key={v.id}
                                type="button"
                                onClick={() => handleVenueChange(v.id)}
                                className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-300 text-left ${
                                    active
                                        ? 'bg-rr-dark border-rr-pink shadow-[0_8px_30px_rgba(225,31,143,0.25)]'
                                        : 'bg-white border-slate-200 hover:border-rr-pink/40'
                                }`}
                            >
                                <MapPin className={`w-5 h-5 flex-shrink-0 ${active ? 'text-rr-pink' : 'text-rr-blue'}`} />
                                <span className="flex-1 min-w-0">
                                    <span className={`block text-sm font-black uppercase tracking-wide leading-tight truncate ${active ? 'text-white' : 'text-rr-dark'}`}>
                                        {v.venue}
                                    </span>
                                    <span className={`block text-[11px] font-bold uppercase tracking-widest ${active ? 'text-rr-pink' : 'text-rr-charcoal/60'}`}>
                                        {v.suburb}
                                    </span>
                                </span>
                                <span className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                                    open
                                        ? (active ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700')
                                        : (active ? 'bg-white/15 text-white/70' : 'bg-slate-100 text-rr-charcoal/60')
                                }`}>
                                    {open ? (<><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Open</>) : 'Soon'}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Coming soon banner (only for TBC venues) */}
                {venue.status !== 'open' && (
                    <div className="relative rounded-xl overflow-hidden bg-rr-dark border border-rr-pink/30 px-6 py-5 mb-5 flex items-center gap-4">
                        <div
                            className="absolute inset-0 opacity-40 pointer-events-none"
                            style={{ background: 'radial-gradient(circle at 85% 30%, rgba(225,31,143,0.25) 0%, rgba(0,0,0,0) 55%)' }}
                        />
                        <div className="relative z-10 w-11 h-11 rounded-full bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center flex-shrink-0">
                            <CalendarClock className="w-5 h-5 text-rr-pink" />
                        </div>
                        <p className="relative z-10 text-sm md:text-base text-white/85 font-medium">
                            <span className="font-black text-white uppercase tracking-wide">Coming soon to {venue.suburb}.</span>{' '}
                            The same four squads below — days &amp; times are being finalised now.
                        </p>
                    </div>
                )}

                {/* Squad accordion */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={venue.id}
                        className="flex flex-col gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {SQUAD_TEMPLATE.map((squad, idx) => (
                            <SquadAccordionRow
                                key={venue.id + squad.name}
                                squad={squad}
                                slot={venue.schedule[squad.name]}
                                isOpen={openSquad === squad.name}
                                onToggle={() => setOpenSquad(openSquad === squad.name ? null : squad.name)}
                                idx={idx}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default SquadsSection;

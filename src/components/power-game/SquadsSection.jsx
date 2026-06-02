import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, MapPin, CalendarClock } from 'lucide-react';

// Same 4 squads offered at each venue. Bundoora is live; others coming soon.
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
        // schedule keyed by squad name
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

const SquadCard = ({ squad, schedule, idx }) => {
    const isPerformance = squad.tier === 'performance';
    const slot = schedule[squad.name];
    return (
        <motion.div
            className={`group relative rounded-2xl p-8 overflow-hidden transition-all duration-300 ${
                isPerformance
                    ? 'bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink border border-rr-pink/40 hover:shadow-[0_10px_50px_rgba(225,31,143,0.35)]'
                    : 'bg-white border border-slate-200 hover:border-rr-pink/40 hover:shadow-[0_10px_40px_rgba(225,31,143,0.12)]'
            }`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
        >
            {!isPerformance && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rr-blue to-rr-pink" />
            )}

            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5 ${
                isPerformance ? 'bg-white/15 border border-white/25' : 'bg-rr-pink/10 border border-rr-pink/30'
            }`}>
                <Clock className={`w-3.5 h-3.5 ${isPerformance ? 'text-white' : 'text-rr-pink'}`} />
                <span className={`text-xs font-bold uppercase tracking-widest ${isPerformance ? 'text-white' : 'text-rr-pink'}`}>
                    {slot.day} · {slot.time}
                </span>
            </div>

            <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-wide mb-3 ${
                isPerformance ? 'text-white' : 'text-rr-dark'
            }`}>
                {squad.name}
            </h3>

            <div className={`flex items-center gap-4 mb-6 text-sm font-bold uppercase tracking-wide ${
                isPerformance ? 'text-white/90' : 'text-rr-blue'
            }`}>
                <span>{squad.ages}</span>
                <span className={isPerformance ? 'text-white/40' : 'text-slate-300'}>•</span>
                <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {squad.players}
                </span>
            </div>

            <div className={`pt-5 border-t ${isPerformance ? 'border-white/20' : 'border-slate-100'}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${
                    isPerformance ? 'text-white/60' : 'text-rr-charcoal/60'
                }`}>
                    Built for
                </div>
                <div className={`text-sm md:text-base font-semibold leading-snug ${
                    isPerformance ? 'text-white' : 'text-rr-charcoal'
                }`}>
                    {squad.builtFor}
                </div>
            </div>
        </motion.div>
    );
};

// Compact squad row used in the Coming Soon panel — shows value without fake times.
const ComingSoonSquadRow = ({ squad, idx }) => {
    const isPerformance = squad.tier === 'performance';
    return (
        <motion.div
            className={`flex items-center justify-between gap-4 rounded-xl px-5 py-4 border ${
                isPerformance
                    ? 'bg-gradient-to-r from-rr-navy/80 to-rr-blue/60 border-rr-pink/30'
                    : 'bg-white border-slate-200'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.07, ease: 'easeOut' }}
        >
            <div className="min-w-0">
                <div className={`text-base md:text-lg font-black uppercase tracking-wide leading-tight ${isPerformance ? 'text-white' : 'text-rr-dark'}`}>
                    {squad.name}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${isPerformance ? 'text-rr-light-pink' : 'text-rr-blue'}`}>
                    {squad.ages} · {squad.players}
                </div>
            </div>
            <div className={`flex-shrink-0 text-xs font-bold uppercase tracking-widest ${isPerformance ? 'text-white/70' : 'text-rr-charcoal/50'}`}>
                {squad.builtFor.split(' · ')[0]}
            </div>
        </motion.div>
    );
};

const SquadsSection = () => {
    const [activeVenue, setActiveVenue] = useState('bundoora');
    const venue = VENUES.find((v) => v.id === activeVenue);
    const isOpen = venue.status === 'open';

    return (
        <section className="bg-slate-50 py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
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
                        The same elite program runs across three Melbourne venues — three Pathway Squads and one Performance Squad at each. Pick your venue to see its days and times.
                    </p>
                </motion.div>

                {/* Venue tabs */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
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
                                onClick={() => setActiveVenue(v.id)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 text-left ${
                                    active
                                        ? 'bg-rr-dark border-rr-pink shadow-[0_8px_30px_rgba(225,31,143,0.25)]'
                                        : 'bg-white border-slate-200 hover:border-rr-pink/40'
                                }`}
                            >
                                <MapPin className={`w-5 h-5 flex-shrink-0 ${active ? 'text-rr-pink' : 'text-rr-blue'}`} />
                                <span className="flex-1">
                                    <span className={`block text-sm md:text-base font-black uppercase tracking-wide leading-tight ${active ? 'text-white' : 'text-rr-dark'}`}>
                                        {v.venue}
                                    </span>
                                    <span className={`block text-xs font-bold uppercase tracking-widest ${active ? 'text-rr-pink' : 'text-rr-charcoal/60'}`}>
                                        {v.suburb}
                                    </span>
                                </span>
                                {/* status pill */}
                                <span className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                                    open
                                        ? (active ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700')
                                        : (active ? 'bg-white/15 text-white/70' : 'bg-slate-100 text-rr-charcoal/60')
                                }`}>
                                    {open ? (
                                        <>
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            Open
                                        </>
                                    ) : (
                                        'Soon'
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Active venue label */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rr-blue/40" />
                    <span className="text-xs md:text-sm font-black text-rr-blue uppercase tracking-widest text-center">
                        {venue.venue} · {venue.suburb} · {venue.region}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rr-blue/40" />
                </div>

                {/* Content — open venue shows full schedule; coming-soon shows panel */}
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key={venue.id}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {SQUAD_TEMPLATE.map((squad, idx) => (
                                <SquadCard key={venue.id + squad.name} squad={squad} schedule={venue.schedule} idx={idx} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={venue.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Coming soon banner */}
                            <div className="relative rounded-2xl overflow-hidden bg-rr-dark border border-rr-pink/30 p-8 md:p-10 mb-6">
                                <div
                                    className="absolute inset-0 opacity-40 pointer-events-none"
                                    style={{ background: 'radial-gradient(circle at 80% 30%, rgba(225,31,143,0.25) 0%, rgba(0,0,0,0) 55%)' }}
                                />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
                                    <div className="w-14 h-14 rounded-full bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center flex-shrink-0">
                                        <CalendarClock className="w-7 h-7 text-rr-pink" />
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-2 bg-rr-pink/15 border border-rr-pink/30 rounded-full px-3 py-1 mb-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                                            <span className="text-[10px] font-black text-rr-pink uppercase tracking-widest">Coming Soon</span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight mb-2">
                                            {venue.venue} · {venue.suburb}
                                        </h3>
                                        <p className="text-sm md:text-base text-white/75 font-medium max-w-2xl">
                                            The full Power Game Program — three Pathway Squads and one Performance Squad — is coming to {venue.suburb}. Days and times are being finalised now.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* The squads that will run here */}
                            <div className="grid grid-cols-1 gap-3">
                                {SQUAD_TEMPLATE.map((squad, idx) => (
                                    <ComingSoonSquadRow key={venue.id + squad.name} squad={squad} idx={idx} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default SquadsSection;

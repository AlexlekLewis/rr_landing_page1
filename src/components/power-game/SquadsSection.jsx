import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, MapPin } from 'lucide-react';

// Same 4 squads offered at each venue — only days/times differ per venue.
const VENUES = [
    {
        id: 'bundoora',
        venue: 'Cutting Edge Cricket',
        suburb: 'Bundoora',
        region: 'North Melbourne',
        flagship: true,
        squads: [
            { name: 'Pathway 14 · A', day: 'Friday', time: '5:30 – 7:30 PM', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
            { name: 'Pathway 16-18', day: 'Friday', time: '7:30 – 9:30 PM', ages: 'Ages 16 – 18', players: '24 players', builtFor: 'Premier Academy · Vic U17/U19 · 1st XI', tier: 'pathway' },
            { name: 'Pathway 14 · B', day: 'Saturday', time: '2:00 – 4:00 PM', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
            { name: 'Performance Squad', day: 'Saturday', time: '4:00 – 6:00 PM', ages: 'Ages 18+', players: '24 players', builtFor: 'Premier Cricket · VMCU rep · senior club season', tier: 'performance' },
        ],
    },
    {
        id: 'hallam',
        venue: 'Elite Cricket Centre',
        suburb: 'Hallam',
        region: 'South East Melbourne',
        squads: [
            { name: 'Pathway 14 · A', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
            { name: 'Pathway 16-18', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 16 – 18', players: '24 players', builtFor: 'Premier Academy · Vic U17/U19 · 1st XI', tier: 'pathway' },
            { name: 'Pathway 14 · B', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
            { name: 'Performance Squad', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 18+', players: '24 players', builtFor: 'Premier Cricket · VMCU rep · senior club season', tier: 'performance' },
        ],
    },
    {
        id: 'williamstown',
        venue: 'The Netz',
        suburb: 'Williamstown',
        region: 'West Melbourne',
        squads: [
            { name: 'Pathway 14 · A', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
            { name: 'Pathway 16-18', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 16 – 18', players: '24 players', builtFor: 'Premier Academy · Vic U17/U19 · 1st XI', tier: 'pathway' },
            { name: 'Pathway 14 · B', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 14 – 16', players: '24 players', builtFor: 'JG Craig · U16 academy & district trials', tier: 'pathway' },
            { name: 'Performance Squad', day: 'Day TBC', time: 'Time TBC', ages: 'Ages 18+', players: '24 players', builtFor: 'Premier Cricket · VMCU rep · senior club season', tier: 'performance' },
        ],
    },
];

const SquadCard = ({ squad, idx }) => {
    const isPerformance = squad.tier === 'performance';
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
                    {squad.day} · {squad.time}
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

const SquadsSection = () => {
    const [activeVenue, setActiveVenue] = useState('bundoora');
    const venue = VENUES.find((v) => v.id === activeVenue);

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
                                <span>
                                    <span className={`block text-sm md:text-base font-black uppercase tracking-wide leading-tight ${active ? 'text-white' : 'text-rr-dark'}`}>
                                        {v.venue}
                                    </span>
                                    <span className={`block text-xs font-bold uppercase tracking-widest ${active ? 'text-rr-pink' : 'text-rr-charcoal/60'}`}>
                                        {v.suburb}
                                    </span>
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

                {/* Squad cards for the active venue */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={venue.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {venue.squads.map((squad, idx) => (
                            <SquadCard key={venue.id + squad.name} squad={squad} idx={idx} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                <p className="text-center text-xs md:text-sm text-rr-charcoal/60 mt-10 font-medium uppercase tracking-widest">
                    Days &amp; times for Hallam and Williamstown to be confirmed
                </p>
            </div>
        </section>
    );
};

export default SquadsSection;

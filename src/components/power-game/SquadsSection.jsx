import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users } from 'lucide-react';

const PATHWAY_SQUADS = [
    {
        name: 'Pathway 14 · A',
        day: 'Friday',
        time: '5:30 – 7:30 PM',
        ages: 'Ages 14 – 16',
        players: '24 players',
        builtFor: 'JG Craig · U16 academy & district trials',
    },
    {
        name: 'Pathway 16-18',
        day: 'Friday',
        time: '7:30 – 9:30 PM',
        ages: 'Ages 16 – 18',
        players: '24 players',
        builtFor: 'Premier Academy · Vic U17/U19 · 1st XI',
    },
    {
        name: 'Pathway 14 · B',
        day: 'Saturday',
        time: '2:00 – 4:00 PM',
        ages: 'Ages 14 – 16',
        players: '24 players',
        builtFor: 'JG Craig · U16 academy & district trials',
    },
];

const PERFORMANCE_SQUAD = {
    name: 'Performance Squad',
    day: 'Saturday',
    time: '4:00 – 6:00 PM',
    ages: 'Ages 18+',
    players: '24 players',
    builtFor: 'Premier Cricket · VMCU rep · senior club season',
};

const SquadCard = ({ squad, idx, isPerformance = false }) => (
    <motion.div
        className={`group relative rounded-2xl p-8 overflow-hidden transition-all duration-300 ${
            isPerformance
                ? 'bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink border border-rr-pink/40 hover:shadow-[0_10px_50px_rgba(225,31,143,0.35)]'
                : 'bg-white border border-slate-200 hover:border-rr-pink/40 hover:shadow-[0_10px_40px_rgba(225,31,143,0.12)]'
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
    >
        {!isPerformance && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rr-blue to-rr-pink" />
        )}

        {/* Day + Time */}
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5 ${
            isPerformance ? 'bg-white/15 border border-white/25' : 'bg-rr-pink/10 border border-rr-pink/30'
        }`}>
            <Clock className={`w-3.5 h-3.5 ${isPerformance ? 'text-white' : 'text-rr-pink'}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${isPerformance ? 'text-white' : 'text-rr-pink'}`}>
                {squad.day} · {squad.time}
            </span>
        </div>

        {/* Squad name */}
        <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-wide mb-3 ${
            isPerformance ? 'text-white' : 'text-rr-dark'
        }`}>
            {squad.name}
        </h3>

        {/* Ages + players */}
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

        {/* Built for */}
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

const SquadsSection = () => {
    return (
        <section className="bg-slate-50 py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            The Squads · Phase 1 Schedule
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        THREE PATHWAY SQUADS.<br className="hidden md:block" /> ONE <span className="text-rr-pink">PERFORMANCE</span> SQUAD.
                    </h2>
                    <p className="text-base md:text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        96 players under one banner. Like-skilled, like-motivated. The Pathway Squads are on the journey. The Performance Squad is already there.
                    </p>
                </motion.div>

                {/* Pathway Squads band label */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rr-blue/40" />
                    <span className="text-xs md:text-sm font-black text-rr-blue uppercase tracking-widest text-center">
                        Pathway Squads · On the Journey · Ages 14–18
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rr-blue/40" />
                </motion.div>

                {/* Pathway squad cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {PATHWAY_SQUADS.map((squad, idx) => (
                        <SquadCard key={squad.name + idx} squad={squad} idx={idx} />
                    ))}
                </div>

                {/* Performance Squad band label */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rr-pink/40" />
                    <span className="text-xs md:text-sm font-black text-rr-pink uppercase tracking-widest text-center">
                        Performance Squad · Already There · Ages 18+
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rr-pink/40" />
                </motion.div>

                {/* Performance squad — full width feature */}
                <div className="max-w-2xl mx-auto">
                    <SquadCard squad={PERFORMANCE_SQUAD} idx={0} isPerformance />
                </div>
            </div>
        </section>
    );
};

export default SquadsSection;

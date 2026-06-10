import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowDown } from 'lucide-react';

// Centres & weekly session times — informational context only. The apply funnel
// below matches each applicant to the sessions that fit their age group & ability,
// so these are shown to set expectations, not as a picker.
// Sessions run in 2-hour blocks; 4-hour windows from the "8 Week Power Game
// Program Planning" sheet are listed as consecutive 2-hour blocks.
const CENTRES = [
    {
        suburb: 'Williamstown',
        venue: 'The Netz',
        region: 'West Melbourne',
        accent: 'bg-gradient-to-br from-rr-pink to-rr-blue',
        sessions: [
            { day: 'Fri', time: '7:30 – 9:30pm' },
            { day: 'Sat', time: '2:00 – 4:00pm' },
            { day: 'Sat', time: '4:00 – 6:00pm' },
        ],
    },
    {
        suburb: 'Hallam',
        venue: 'Elite Cricket Centre',
        region: 'South East Melbourne',
        accent: 'bg-rr-pink',
        sessions: [
            { day: 'Sat', time: '12:00 – 2:00pm' },
            { day: 'Sat', time: '2:00 – 4:00pm' },
            { day: 'Sat', time: '4:00 – 6:00pm' },
        ],
    },
    {
        suburb: 'TBC',
        venue: 'New venue — coming soon',
        region: 'North Melbourne',
        accent: 'bg-rr-blue',
        sessions: [],
    },
];

const CentresSection = () => {
    return (
        <section className="bg-rr-page py-20 md:py-28 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />

            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="text-rr-pink font-black uppercase tracking-[0.3em] text-xs mb-3">
                        Centres &amp; Sessions
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-5">
                        TRAIN ACROSS <span className="text-rr-pink">MELBOURNE</span>
                    </h2>
                    <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium">
                        These are our Power Game centres and their weekly session times. When you
                        apply below, you&apos;ll be offered the sessions that fit your age group and
                        ability — then you pick the centre and time that work for you.
                    </p>
                </motion.div>

                {/* Centre cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {CENTRES.map((centre, idx) => (
                        <motion.div
                            key={centre.suburb}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 md:p-8 hover:bg-white/10 hover:border-rr-pink/40 transition-all duration-300 overflow-hidden flex flex-col"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 ${centre.accent}`} />

                            <div className="flex items-start justify-between gap-3 mb-6">
                                <div>
                                    <div className="text-[11px] font-bold text-rr-pink uppercase tracking-widest mb-2">
                                        {centre.region}
                                    </div>
                                    <h3 className="text-2xl md:text-[1.75rem] font-black text-white uppercase tracking-wide leading-none mb-1.5">
                                        {centre.suburb}
                                    </h3>
                                    <div className="text-sm font-bold text-white/50 uppercase tracking-wide">
                                        {centre.venue}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-rr-pink" />
                                </div>
                            </div>

                            {/* Session times */}
                            <div className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-5">
                                {centre.sessions.length === 0 && (
                                    <div className="text-sm font-bold text-white/40 uppercase tracking-wide">Days &amp; times to be confirmed</div>
                                )}
                                {centre.sessions.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-12 text-center text-[11px] font-black uppercase tracking-widest text-rr-pink bg-rr-pink/10 border border-rr-pink/25 rounded-md py-1">
                                            {s.day}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm font-bold text-white/85 uppercase tracking-wide">
                                            <Clock className="w-3.5 h-3.5 text-white/30" />
                                            {s.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tie-in to the funnel below */}
                <motion.div
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full pl-5 pr-6 py-3">
                        <ArrowDown className="w-4 h-4 text-rr-pink animate-bounce" />
                        <span className="text-sm font-medium text-white/70">
                            Your matched options appear when you{' '}
                            <span className="font-black text-white uppercase tracking-wide">apply below</span>.
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CentresSection;

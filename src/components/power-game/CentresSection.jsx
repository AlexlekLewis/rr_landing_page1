import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowDown, Calendar, CalendarRange } from 'lucide-react';

// Centres & weekly session times — informational context only. The apply funnel
// below matches each applicant to the sessions that fit their age group & ability,
// so these are shown to set expectations, not as a picker.
//
// DERIVED from src/lib/booking/squads.ts (single source of truth) — this section
// can never disagree with the funnel's selector again. To change days/times or
// add a venue, edit squads.ts only.
import { CENTRES as GRID_CENTRES, SQUADS, SESSION_DATES } from '../../lib/booking/squads';

const ACCENTS = {
    williamstown: 'bg-gradient-to-br from-rr-pink to-rr-blue',
    hallam: 'bg-rr-pink',
};
const DEFAULT_ACCENT = 'bg-rr-blue';

const shortDay = (d) => (d || '').slice(0, 3);
// "5:30pm" + "7:30pm" → "5:30 – 7:30pm" (matches the existing chip style)
const blockTime = (start, end) => `${String(start).replace(/am|pm/i, '')} – ${end}`;

// Per-day 8-week windows come from squads.ts (SESSION_DATES) — single source, so
// these cards and the funnel's time picker always show the same dates.
const dayRange = (day) => {
    const d = SESSION_DATES[day];
    return d ? `${d.start} – ${d.end}` : null;
};

const CENTRES = GRID_CENTRES.map((c) => {
    const seen = new Set();
    const sessions = SQUADS
        .filter((s) => s.centre === c.slug)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .filter((s) => (seen.has(s.blockId) ? false : (seen.add(s.blockId), true)))
        .map((s) => ({ day: shortDay(s.day), time: blockTime(s.startTime, s.endTime), dates: dayRange(shortDay(s.day)) }));
    // Centre window = earliest start → latest end across its session days.
    const days = sessions.map((s) => SESSION_DATES[s.day]).filter(Boolean);
    const first = days.length ? days.reduce((a, b) => (b.order < a.order ? b : a)) : null;
    const last = days.length ? days.reduce((a, b) => (b.order > a.order ? b : a)) : null;
    return {
        suburb: c.comingSoon ? 'TBC' : c.suburb,
        venue: c.comingSoon ? 'New venue — coming soon' : c.name,
        region: c.region,
        dateRange: c.dateRange,
        accent: ACCENTS[c.slug] || DEFAULT_ACCENT,
        sessions,
        dateRange: !c.comingSoon && first && last ? `${first.start} – ${last.end}` : null,
    };
});

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

                    {/* Program shape — cadence only; the dates live on each centre card below */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
                        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-4 py-2">
                            <CalendarRange className="w-4 h-4 text-rr-medium-blue" />
                            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">8-week pre-season</span>
                        </span>
                        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-4 py-2">
                            <Calendar className="w-4 h-4 text-rr-medium-blue" />
                            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">Once a week</span>
                        </span>
                        <span className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-4 py-2">
                            <Clock className="w-4 h-4 text-rr-medium-blue" />
                            <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">2 hours each</span>
                        </span>
                    </div>

                    <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-medium">
                        Same squad, same day, same time, every week. Each centre card below shows its
                        <span className="text-rr-medium-blue font-bold"> session times and dates</span>. Apply
                        and we&apos;ll offer you the sessions that fit your age and ability — then you pick the centre and time that suit you.
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
                                    {centre.dateRange && (
                                        <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-black text-rr-medium-blue uppercase tracking-widest">
                                            <CalendarRange className="w-3.5 h-3.5" />
                                            {centre.dateRange}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-rr-pink" />
                                </div>
                            </div>

                            {/* Session times */}
                            <div className="mt-auto flex flex-col gap-2.5 border-t border-white/10 pt-5">
                                {centre.dateRange && (
                                    <div className="inline-flex items-center gap-1.5 self-start bg-rr-blue/15 border border-rr-blue/30 rounded-full px-3 py-1 mb-1">
                                        <Calendar className="w-3.5 h-3.5 text-rr-blue" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest">{centre.dateRange}</span>
                                    </div>
                                )}
                                {centre.sessions.length > 0 && (
                                    <p className="text-[11px] text-white/45 font-medium leading-snug mb-1.5">
                                        2 hours per week, at a defined location of your choice, and at a time of your choosing.
                                    </p>
                                )}
                                {centre.sessions.length === 0 && (
                                    <div className="text-sm font-bold text-white/40 uppercase tracking-wide">Days &amp; times to be confirmed</div>
                                )}
                                {centre.sessions.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-12 text-center text-[11px] font-black uppercase tracking-widest text-rr-pink bg-rr-pink/10 border border-rr-pink/25 rounded-md py-1">
                                            {s.day}
                                        </span>
                                        <span className="flex flex-col gap-0.5">
                                            <span className="flex items-center gap-1.5 text-sm font-bold text-white/85 uppercase tracking-wide">
                                                <Clock className="w-3.5 h-3.5 text-white/30" />
                                                {s.time}
                                            </span>
                                            {s.dates && (
                                                <span className="pl-5 text-[11px] font-bold text-rr-medium-blue/85 tracking-wide">
                                                    {s.dates}
                                                </span>
                                            )}
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

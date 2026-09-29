import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Ticket, ArrowRight, Navigation, Clock } from 'lucide-react';
import { fadeUp, SectionHeading } from '../performance-squads/shared';
import {
    SESSION_VIEW, SESSION_SECTION, STATE_BADGE, OLDER_PLAYERS,
} from './sidJuniorsData';

// One card per session: when, where, what it costs, and whether it is taking
// bookings. Every value comes from sidJuniorsData.js.
const badgeClass = {
    open: 'bg-rr-pink text-white',
    closed: 'bg-white/10 text-white/70',
    full: 'bg-amber-400/15 text-amber-200',
};

const Row = ({ icon: Icon, children }) => (
    <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-rr-pink shrink-0 mt-1" />
        <div className="text-white/70 text-[15px] font-medium leading-relaxed">{children}</div>
    </div>
);

const SessionCard = ({ s, delay }) => (
    <motion.article
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={delay}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col"
        aria-label={`${s.centreName} session`}
    >
        <div className="flex items-start justify-between gap-3 mb-5">
            <div>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-rr-pink mb-2">{s.shortDay}</p>
                <h3 className="text-2xl sm:text-3xl font-black uppercase leading-none">{s.centreName}</h3>
            </div>
            <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider rounded-full px-3 py-1.5 ${badgeClass[s.state]}`}>
                {STATE_BADGE[s.state]}
            </span>
        </div>

        <div className="space-y-3.5">
            <Row icon={CalendarDays}>
                <span className="text-white font-bold">{s.dateLabel}</span>
            </Row>
            <Row icon={Clock}>
                {s.timeLabel}, {s.durationLabel}.
            </Row>
            <Row icon={MapPin}>
                <span className="text-white font-bold">{s.venue}</span>, {s.address}.
                {s.lanesNote && <> {s.lanesNote}</>}
                <a
                    href={s.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-rr-light-pink hover:text-white text-sm font-bold mt-2 underline underline-offset-4 w-fit"
                >
                    <Navigation className="w-3.5 h-3.5" /> Get directions
                </a>
            </Row>
            <Row icon={Ticket}>
                <span className="text-white font-bold">{s.priceLabel}</span>
            </Row>
        </div>

        {/* The trial shares this centre and this time, so say so on the card
            itself. The safeguarding detail is in the next section. */}
        {s.alongsideTrial && (
            <p className="text-white/55 text-[13px] font-medium leading-relaxed mt-5 pt-4 border-t border-white/10">
                The open age trial runs in the same centre at the same time. Junior players have their
                own lanes, their own coaches and a separate sign-in.
            </p>
        )}
    </motion.article>
);

const SidJuniorsSession = () => (
    <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading eyebrow={SESSION_SECTION.eyebrow} title={SESSION_SECTION.title} sub={SESSION_SECTION.sub} />

            <div className="grid md:grid-cols-2 gap-5">
                {SESSION_VIEW.map((s, i) => (
                    <SessionCard key={s.key} s={s} delay={i * 0.06} />
                ))}
            </div>

            <p className="text-white/50 text-sm font-medium leading-relaxed text-center mt-6">
                {SESSION_SECTION.costNote}
            </p>

            {/* For families with an older player too. Links out and says no more:
                who is at the trial is that page's to say, not this one's. */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0.15}
                className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            >
                <p className="text-white/55 text-sm font-medium leading-relaxed flex-1">{OLDER_PLAYERS.text}</p>
                <Link
                    to={OLDER_PLAYERS.href}
                    className="inline-flex items-center gap-2 text-white font-black uppercase tracking-wider text-xs border-2 border-white/20 hover:border-rr-pink rounded-full px-5 py-2.5 transition-colors self-start sm:self-auto shrink-0"
                >
                    {OLDER_PLAYERS.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </motion.div>
        </div>
    </section>
);

export default SidJuniorsSession;

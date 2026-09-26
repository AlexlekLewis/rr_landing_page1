import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star, CalendarDays, CalendarClock, Clock } from 'lucide-react';
import { BatIcon } from '../performance-squads/CricketIcons';
import { fadeUp, scrollTo, SectionHeading } from '../performance-squads/shared';
import {
    TRIAL_CENTRES, TRIALS_HEADING, DATES_CONFIRMED, SID, sidIsAt,
    TRIAL_PRICE, ALL_SESSIONS_FULL, getSessionsForCentre, getOpenTrialSessions,
    getSelectableSessionCount, isCentreFull, arrivalLine,
} from './openAgeData';

// One card per centre. Everything a card says comes from openAgeData: its
// sessions, whether they are full, and whether Sid is scheduled there.
//
// SID IS ON BOTH CARDS, because he is scheduled at both sessions (Alex, 26
// September 2026). It is still read per centre through sidIsAt, so a card only
// ever claims him where the data says he is.
const CentreCard = ({ centre, delay }) => {
    const sessions = getSessionsForCentre(centre.slug);
    const full = isCentreFull(centre.slug);
    const open = getOpenTrialSessions(centre.slug);
    const selectable = getSelectableSessionCount(centre.slug);
    const hasSid = sidIsAt(centre.slug);

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={delay}
            className="bg-white/5 border border-white/10 rounded-2xl p-7 sm:p-8 flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-3 py-1.5 ${full ? 'text-amber-300 bg-amber-300/10 border border-amber-300/25' : 'text-rr-pink bg-rr-pink/10'}`}>
                    {full ? 'Trials Full' : 'Now Trialling'}
                </span>
                <BatIcon className="w-5 h-5 text-white/30" />
            </div>

            <h3 className="text-2xl font-black uppercase mb-5">{centre.name}</h3>

            <div className="space-y-3 mb-7">
                <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                    <span className="text-white/75 text-sm font-medium">
                        {centre.venue}, {centre.suburb}
                    </span>
                </div>
                <div className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                    <span className="text-white/75 text-sm font-medium">
                        {centre.coachTitle}: <span className="text-white font-bold">{centre.coach}</span>.
                        {hasSid && (
                            <>
                                {' '}<span className="text-white font-bold">{SID.name}</span> is scheduled to be at this session.
                            </>
                        )}
                    </span>
                </div>
                <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                        {/* A session that books out keeps its row and is struck
                            through. It is never deleted: everyone already booked
                            would lose the date off their confirmation and off the
                            coach's sheet. */}
                        {sessions.map((sess, n) => (
                            <div key={sess.id} className={`text-sm font-medium ${sess.full ? 'text-white/35' : 'text-white/75'}`}>
                                <span className={`font-bold ${sess.full ? 'text-white/35' : 'text-rr-light-pink'}`}>Trial {n + 1}</span>
                                {' — '}
                                <span className={sess.full ? 'line-through' : ''}>{sess.label}</span>
                                {sess.full && (
                                    <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-amber-300">
                                        {sess.badge || 'Full'}
                                    </span>
                                )}
                            </div>
                        ))}
                        {open.length > selectable && (
                            <div className="text-white/45 text-xs font-medium pt-0.5">
                                Attend up to {selectable} of the {open.length} sessions still open at this centre.
                            </div>
                        )}
                    </div>
                </div>
                {/* Sign-in time. Only a session that carries an arrival rule shows one. */}
                {sessions.filter((s) => arrivalLine(s)).map((s) => (
                    <div key={`arrive-${s.id}`} className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span className="text-white/75 text-sm font-medium">{arrivalLine(s)}</span>
                    </div>
                ))}
            </div>

            {full ? (
                <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white/45 font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 cursor-not-allowed"
                >
                    Every session is full
                </button>
            ) : (
                <button
                    onClick={() => scrollTo('register-pay')}
                    className="mt-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors"
                >
                    Book your trial place <ArrowRight className="w-4 h-4" />
                </button>
            )}

            <p className="text-white/40 text-xs font-medium text-center mt-4">
                ${TRIAL_PRICE} per player, per session.
            </p>
            {/* The attendance hedge, in the same words as the Sid section and the
                FAQ, beside the booking control for the session he is at — because
                that is where the money is committed on the strength of it. */}
            {hasSid && (
                <p className="text-white/45 text-xs font-medium leading-relaxed text-center mt-3 pt-3 border-t border-white/10">
                    {SID.attendance}
                </p>
            )}
        </motion.div>
    );
};

// While openAgeData.TRIAL_SESSIONS is empty the section says so in plain words
// and the booking button is disabled. Nothing here can render a date that does
// not exist, because the dates come from that array alone.
const OpenAgeTrialsSection = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading {...TRIALS_HEADING} />

            {!DATES_CONFIRMED ? (
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} custom={0}
                    className="bg-white/5 border border-white/10 rounded-2xl p-7 sm:p-9 max-w-2xl mx-auto"
                >
                    <div className="flex items-start gap-3 mb-6">
                        <CalendarClock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span className="text-white/75 text-sm font-medium">
                            Dates and times are still being confirmed. They go up on this page the
                            moment they are set, and nothing can be booked until then.
                        </span>
                    </div>
                    {/* Not a dead end: this goes to the "tell me when the dates are
                        announced" panel, which is what #register-pay renders while
                        the dates are pending. */}
                    <button
                        type="button"
                        onClick={() => scrollTo('register-pay')}
                        className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors"
                    >
                        <CalendarClock className="w-4 h-4" /> Tell me when the dates land
                    </button>
                </motion.div>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 gap-5">
                        {TRIAL_CENTRES.map((centre, i) => (
                            <CentreCard key={centre.slug} centre={centre} delay={i * 0.08} />
                        ))}
                    </div>
                    {!ALL_SESSIONS_FULL && (
                        <p className="text-white/45 text-xs font-medium text-center mt-5">
                            Book at one centre. The two are about 70 km apart, and each one has its
                            own squad and head coach.
                        </p>
                    )}
                </>
            )}
        </div>
    </section>
);

export default OpenAgeTrialsSection;

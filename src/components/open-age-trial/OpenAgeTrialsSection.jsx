import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star, CalendarDays, CalendarClock } from 'lucide-react';
import { BatIcon } from '../performance-squads/CricketIcons';
import { fadeUp, scrollTo, SectionHeading } from '../performance-squads/shared';
import {
    CENTRE, TRIALS_HEADING, TRIAL_SESSIONS, DATES_CONFIRMED,
    SID, TRIAL_PRICE, ALL_SESSIONS_FULL, getSelectableSessionCount,
    getOpenTrialSessions,
} from './openAgeData';

// One centre, one card. While openAgeData.TRIAL_SESSIONS is empty the card says
// so in plain words and the booking button is disabled. Nothing here can render
// a date that does not exist, because the dates come from that array alone.
const OpenAgeTrialsSection = () => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
            <SectionHeading {...TRIALS_HEADING} />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 sm:p-9 flex flex-col"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-3 py-1.5 ${DATES_CONFIRMED ? 'text-rr-pink bg-rr-pink/10' : 'text-amber-300 bg-amber-300/10 border border-amber-300/25'}`}>
                        {!DATES_CONFIRMED ? 'Dates To Be Confirmed' : ALL_SESSIONS_FULL ? 'Trials Full' : 'Now Trialling'}
                    </span>
                    <BatIcon className="w-5 h-5 text-white/30" />
                </div>

                <h3 className="text-2xl font-black uppercase mb-5">{CENTRE.name}</h3>

                <div className="space-y-3 mb-7">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                        <span className="text-white/75 text-sm font-medium">
                            {CENTRE.venue}, {CENTRE.suburb}
                        </span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                        {/* Sid's attendance is stated of the TRIAL, not of a session,
                            and never as a certainty. Until Alex confirms whether he
                            is at every session, no line here may attach him to one. */}
                        <span className="text-white/75 text-sm font-medium">
                            {CENTRE.coachTitle}: <span className="text-white font-bold">{CENTRE.coach}</span>.{' '}
                            <span className="text-white font-bold">{SID.name}</span> is scheduled to be at this trial.
                        </span>
                    </div>
                    <div className="flex items-start gap-3">
                        {DATES_CONFIRMED ? (
                            <>
                                <CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                <div className="space-y-1.5">
                                    {/* A session that has booked out keeps its row and is
                                        struck through. It is never deleted from the array:
                                        everyone already booked into it would lose their date
                                        off their confirmation and off the coach's sheet. */}
                                    {TRIAL_SESSIONS.map((sess, n) => (
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
                                    {getOpenTrialSessions().length > getSelectableSessionCount() && (
                                        <div className="text-white/45 text-xs font-medium pt-0.5">
                                            Attend up to {getSelectableSessionCount()} of the {getOpenTrialSessions().length} sessions still open.
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <CalendarClock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                                <span className="text-white/75 text-sm font-medium">
                                    Dates and times are still being confirmed. They go up on this page the
                                    moment they are set, and nothing can be booked until then.
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {DATES_CONFIRMED && !ALL_SESSIONS_FULL ? (
                    <button
                        onClick={() => scrollTo('register-pay')}
                        className="mt-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors"
                    >
                        Book your trial place <ArrowRight className="w-4 h-4" />
                    </button>
                ) : ALL_SESSIONS_FULL ? (
                    <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="mt-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white/45 font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 cursor-not-allowed"
                    >
                        Every session is full
                    </button>
                ) : (
                    /* Not a dead end: this goes to the "tell me when the dates are
                       announced" panel, which is what #register-pay renders while
                       the dates are pending. */
                    <button
                        type="button"
                        onClick={() => scrollTo('register-pay')}
                        className="mt-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors"
                    >
                        <CalendarClock className="w-4 h-4" /> Tell me when the dates land
                    </button>
                )}

                <p className="text-white/40 text-xs font-medium text-center mt-4">
                    ${TRIAL_PRICE} per player, per session.
                </p>
                {/* The attendance hedge, in the same words as the hero, the Sid
                    section and the FAQ. It belongs beside the booking control
                    because that is where the money is committed. */}
                <p className="text-white/45 text-xs font-medium leading-relaxed text-center mt-3 pt-3 border-t border-white/10">
                    {SID.attendance}
                </p>
            </motion.div>
        </div>
    </section>
);

export default OpenAgeTrialsSection;

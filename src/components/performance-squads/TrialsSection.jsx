import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, CalendarDays, Star, Bell } from 'lucide-react';
import { BatIcon } from './CricketIcons';
import { fadeUp, scrollTo, SectionHeading } from './shared';
import { CENTRES, ACTIVE_CENTRES, TRIAL_PRICE, getCentre, money } from './data';
import {
    getUpcomingTrials,
    getBookableOpenAgeTrials,
    OPEN_AGE_AGE_LINE,
    OPEN_AGE_TRIAL_ROUTE,
    SQUAD_AGE_LINE,
    dayOf,
    timeOf,
} from './trialCalendar';

// ─────────────────────────────────────────────────────────────
// TRIAL DATES — /performance-squads only.
//
// This page is permanent, so this section always says where trials stand:
// the next dates when they are set, "to be confirmed" when they are not, and
// a register-your-interest route for everyone a current trial does not cover.
// Nothing here is typed by hand — every date comes from ./trialCalendar.js.
// ─────────────────────────────────────────────────────────────

const primaryBtn = 'inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors';
const secondaryBtn = 'inline-flex items-center justify-center gap-2 border-2 border-white/25 hover:border-rr-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors';

const TrialsSection = ({ onChooseCentre, now = new Date() }) => {
    const upcoming = getUpcomingTrials(now);
    const openAge = getBookableOpenAgeTrials(now);
    const openAgeOn = openAge.length > 0;

    return (
        <section className="py-20 px-5 bg-white/[0.02]">
            <div className="max-w-5xl mx-auto">
                <SectionHeading
                    eyebrow="Trial Dates"
                    title={upcoming.length ? 'Next Trials' : 'Next Trials: Dates To Be Confirmed'}
                    sub="Trial dates for both centres. We post new dates here as soon as they are set."
                />

                {/* The trial running right now, said plainly before anything else. */}
                {openAgeOn && (
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                        className="bg-gradient-to-br from-rr-pink/25 via-rr-navy to-rr-dark border border-rr-pink/50 rounded-2xl p-6 sm:p-9 mb-5">
                        <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white bg-rr-pink rounded-full px-4 py-1.5 mb-4">
                            Trials open now
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase mb-3">Open Age Trial</h3>
                        <p className="text-white/80 text-[15px] sm:text-base font-medium leading-relaxed mb-5">
                            The trial running right now is the Open Age Trial, for players {OPEN_AGE_AGE_LINE}.
                            It costs {money(TRIAL_PRICE)} per player and is booked on its own page.
                        </p>
                        <div className="space-y-2.5 mb-6">
                            {openAge.map((t) => {
                                const c = getCentre(t.centre);
                                return (
                                    <div key={t.id} className="flex items-start gap-3">
                                        <CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-1" />
                                        <p className="text-white/80 text-[15px] font-medium leading-snug">
                                            <span className="text-white font-black">{dayOf(t.label)}</span>
                                            {timeOf(t.label) && <>, {timeOf(t.label)}</>}
                                            {' '}at {c.venue}, {c.suburb}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <a href={OPEN_AGE_TRIAL_ROUTE} className={primaryBtn}>
                            Book the Open Age Trial <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                )}

                {/* Everyone the current trial does not cover. */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.05}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-5">
                    <Bell className="w-8 h-8 text-rr-pink shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-black uppercase mb-1.5">
                            {openAgeOn ? 'Not 16 to 25, or can’t make these dates?' : 'Be first to hear about the next trial'}
                        </h3>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed">
                            {openAgeOn
                                ? 'There is no trial open for other ages yet. Register your interest and we will let you know as soon as the next trial opens. There is nothing to pay.'
                                : 'Register your interest and we will let you know as soon as the next trial dates are set. There is nothing to pay.'}
                        </p>
                    </div>
                    <button onClick={() => scrollTo('register-pay')} className={`${primaryBtn} shrink-0`}>
                        Register Your Interest <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>

                {/* Each centre: where it is, who runs it, and its next trial. */}
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                    {ACTIVE_CENTRES.map((c, i) => {
                        const trials = upcoming.filter((t) => t.centre === c.slug);
                        const openAgeHere = trials.some((t) => t.kind === 'open-age' && !t.full);
                        const squadHere = trials.some((t) => t.kind === 'squad' && !t.full);
                        return (
                            <motion.div key={c.slug} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                                className="bg-white/5 border border-white/10 hover:border-rr-pink/50 rounded-2xl p-7 flex flex-col transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-3 py-1.5 ${trials.length ? 'text-rr-pink bg-rr-pink/10' : 'text-white/50 bg-white/5'}`}>
                                        {trials.length ? 'Next trial set' : 'Dates to be confirmed'}
                                    </span>
                                    <BatIcon className="w-5 h-5 text-white/30" />
                                </div>
                                <h3 className="text-2xl font-black uppercase mb-4">{c.name}</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                        <span className="text-white/75 text-sm font-medium">
                                            {c.venue}{c.suburb ? `, ${c.suburb}` : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Star className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                        <span className="text-white/75 text-sm font-medium">
                                            {c.coachTitle}: <span className="text-white font-bold">{c.coach}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                        {trials.length ? (
                                            <div className="space-y-2">
                                                {trials.map((t) => (
                                                    <div key={t.id} className={`text-sm font-medium ${t.full ? 'text-white/35' : 'text-white/75'}`}>
                                                        <span className={t.full ? 'line-through decoration-white/30' : undefined}>
                                                            <span className={`font-bold ${t.full ? 'text-rr-light-pink/50' : 'text-rr-light-pink'}`}>
                                                                {t.kind === 'open-age' ? 'Open Age Trial' : 'Squad Trial'}
                                                            </span>
                                                            {' — '}{t.label}
                                                        </span>
                                                        {t.full && (
                                                            <span className="ml-2 text-[10px] font-black uppercase tracking-wider rounded-full px-2 py-0.5 text-red-300 bg-red-500/15 border border-red-400/40">
                                                                Full
                                                            </span>
                                                        )}
                                                        <div className="text-white/45 text-xs mt-0.5">
                                                            For players {t.kind === 'open-age' ? OPEN_AGE_AGE_LINE : SQUAD_AGE_LINE}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-white/75 text-sm font-medium">
                                                Next trial: <span className="text-white font-bold">dates to be confirmed</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-auto flex flex-col gap-3">
                                    {openAgeHere && (
                                        <a href={OPEN_AGE_TRIAL_ROUTE} className={primaryBtn}>
                                            Book the Open Age Trial <ArrowRight className="w-4 h-4" />
                                        </a>
                                    )}
                                    {squadHere && (
                                        <button onClick={() => onChooseCentre(c.slug)} className={primaryBtn}>
                                            Register for Trial <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onChooseCentre(c.slug)}
                                        className={openAgeHere || squadHere ? secondaryBtn : primaryBtn}
                                    >
                                        Register Your Interest {!(openAgeHere || squadHere) && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Future centres */}
                <div className="grid sm:grid-cols-2 gap-5">
                    {CENTRES.filter((c) => !c.active).map((c) => (
                        <div key={c.slug} className="bg-white/[0.03] border border-dashed border-white/15 rounded-2xl p-7 opacity-60">
                            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 bg-white/5 rounded-full px-3 py-1.5 mb-4">
                                Coming 2027
                            </span>
                            <h3 className="text-2xl font-black uppercase mb-2 text-white/70">{c.name}</h3>
                            <p className="text-white/40 text-sm font-medium">{c.venue}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrialsSection;

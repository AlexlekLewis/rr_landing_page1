import React, { useState } from 'react';
import { MapPin, ChevronDown, CalendarClock } from 'lucide-react';
import {
    CENTRES, FOCUS_FILTERS, AVAILABILITY_NOTE, coachesAt, tierOf, centreOf, perSession, money,
} from './premiumCoachingData';
import { useAllAvailability, groupByNight, nightLabel, timeLabel } from './useCoachAvailability';

// "Find your coach" (Andy, 18 Nov 2026: "a lot more customer friendly", on a big screen
// and on a phone). Three plain steps:
//   1. Where do you train?  (centre tabs, each with the suburbs it is near)
//   2. What does your player want to work on?  (Batting / Bowling / Wicketkeeping)
//   3. Pick a coach: photo, specialty, a one-line coach type, price, next available time,
//      one big Book button; the bio is one tap away.
// Times come live from the coach's availability. Book only works when the coach has open
// times: families choose from the coach's times, they don't send us times that suit.

const TIER_ORDER = { head: 0, performance: 1, academy: 2 };
const firstName = (n) => n.split(' ')[0];

const Step = ({ n, children }) => (
    <p className="flex items-center gap-2.5 text-sm md:text-base font-black text-rr-dark uppercase tracking-wide mb-3">
        <span className="w-7 h-7 rounded-full text-white text-xs flex items-center justify-center shrink-0" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{n}</span>
        {children}
    </p>
);

const Photo = ({ c }) => (
    c.img
        ? <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover object-top" />
        : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{c.name.split(' ').map((p) => p[0]).join('')}</div>
);

const CoachCard = ({ c, centre, onBook }) => {
    const [more, setMore] = useState(false);
    const { slots, loaded } = useAllAvailability();
    const times = groupByNight(slots, c.slug, centre).flatMap((n) => n.slots);
    const canBook = c.bookable && times.length > 0;
    const tier = tierOf(c.tier);
    const elite = c.tier === 'head';
    const others = c.centres.filter((x) => x !== centre).map((x) => centreOf(x).suburb);

    return (
        <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col" data-coach={c.slug}>
            <div className="flex sm:block">
                <div className="relative w-28 sm:w-full shrink-0 sm:aspect-square bg-slate-100 overflow-hidden"><Photo c={c} /></div>
                <div className="p-4 sm:px-5 sm:pt-4 sm:pb-0 min-w-0">
                    {tier && (
                        <p className="text-[11px] font-black uppercase tracking-widest">
                            <span className={elite ? 'text-rr-pink' : 'text-rr-blue'}>{tier.name}</span>
                            <span className="text-slate-400 font-bold normal-case tracking-normal"> · {tier.plain}</span>
                        </p>
                    )}
                    <h3 className="mt-1 text-xl font-black text-rr-dark uppercase tracking-tight leading-tight">{c.name}</h3>
                    <p className="mt-1 text-sm font-bold text-rr-charcoal leading-snug">{c.specialism || 'Coaches all aspects of the game'}</p>
                </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between gap-3 border-t border-slate-100 pt-3">
                    <p className="text-sm text-rr-charcoal font-semibold">
                        {c.bookable ? <>From <span className="text-lg font-black text-rr-dark">{money(perSession(c.tier, 5))}</span> a session</> : 'Price coming soon'}
                    </p>
                    {c.bookable && <p className="text-[11px] text-slate-500 font-semibold text-right">{money(perSession(c.tier, 1))} for one session<br />incl. GST</p>}
                </div>

                {c.bookable && (
                    <div className={`mt-3 rounded-xl px-3 py-2.5 flex items-center gap-2 ${times.length ? 'bg-rr-pink/10' : 'bg-slate-50'}`}>
                        <CalendarClock className={`w-4 h-4 shrink-0 ${times.length ? 'text-rr-pink' : 'text-slate-400'}`} />
                        <p className="text-xs font-bold text-rr-dark leading-snug">
                            {!loaded ? 'Checking times…'
                                : times.length
                                    ? <>Next available: {nightLabel(times[0].date)}, {timeLabel(times[0].start)}{times.length > 1 && <span className="text-slate-500 font-semibold"> · {times.length - 1} more time{times.length > 2 ? 's' : ''}</span>}</>
                                    : <span className="text-slate-500">New times coming soon</span>}
                        </p>
                    </div>
                )}

                {more && (
                    <div className="mt-3 text-sm text-rr-charcoal font-medium leading-relaxed space-y-2">
                        <p>{c.bio || 'Full profile coming soon.'}</p>
                        <p className="text-xs font-semibold">{c.allAspects}</p>
                        {others.length > 0 && <p className="text-xs text-slate-500 font-semibold">Also coaches at {others.join(' and ')}, never two centres on the same night.</p>}
                    </div>
                )}

                <div className="mt-auto pt-4">
                    <button type="button" data-cta={`book-${c.slug}`} onClick={() => onBook(centre, c.slug)} disabled={!canBook}
                        className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:bg-slate-100 disabled:text-slate-400 text-white font-black uppercase tracking-widest text-sm px-4 py-3.5 rounded-full transition-colors">
                        {canBook ? `Book ${firstName(c.name)}` : c.bookable ? 'Times coming soon' : 'Coming soon'}
                    </button>
                    <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more}
                        className="w-full mt-2 inline-flex items-center justify-center gap-1 text-rr-dark font-bold text-xs py-1.5 hover:text-rr-pink transition-colors">
                        {more ? 'Show less' : `Read more about ${firstName(c.name)}`} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${more ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </article>
    );
};

const CoachFinder = ({ onBook }) => {
    const [centreSlug, setCentreSlug] = useState(CENTRES[0].slug);
    const [focus, setFocus] = useState('all');
    const centre = centreOf(centreSlug);
    const here = coachesAt(centreSlug).sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
    const matches = focus === 'all' ? here : here.filter((c) => c.focus.includes(focus));
    const shown = matches.length ? matches : here;
    const noSpecialist = focus !== 'all' && matches.length === 0;
    const focusLabel = FOCUS_FILTERS.find((f) => f.key === focus)?.label.toLowerCase();

    return (
        <section className="bg-slate-50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="max-w-2xl mb-10">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-rr-pink">Find your coach</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] text-rr-dark mb-4">Meet our coaches</h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed">Pick the centre near you, tell us what your player wants to work on, then choose a coach and book one of their times.</p>
                </div>

                {/* 1. Centre */}
                <Step n={1}>Where do you train?</Step>
                <div role="tablist" aria-label="Centre" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                    {CENTRES.map((c) => {
                        const on = c.slug === centreSlug;
                        return (
                            <button key={c.slug} type="button" role="tab" aria-selected={on} onClick={() => { setCentreSlug(c.slug); setFocus('all'); }}
                                className={`text-left rounded-2xl border-2 px-4 py-3.5 transition-colors ${on ? 'border-rr-dark bg-rr-dark text-white' : 'border-slate-200 bg-white text-rr-dark hover:border-rr-dark/40'}`}>
                                <span className="flex items-center justify-between gap-2">
                                    <span className="text-lg font-black uppercase tracking-tight leading-tight">{c.suburb}</span>
                                    {c.badge && <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${on ? 'bg-rr-pink text-white' : 'bg-rr-pink/10 text-rr-pink'}`}>{c.badge}</span>}
                                </span>
                                <span className={`block text-xs font-semibold mt-0.5 ${on ? 'text-white/70' : 'text-slate-500'}`}>Near {c.near}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs font-semibold text-rr-charcoal flex items-start gap-1.5 mb-9">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rr-pink" />
                    <span>{centre.name}{centre.address ? `, ${centre.address}` : `, ${centre.suburb}`}</span>
                </p>

                {/* 2. Focus */}
                <Step n={2}>What does your player want to work on?</Step>
                <div className="flex flex-wrap gap-2 mb-2" aria-label="What to work on">
                    {FOCUS_FILTERS.map((f) => (
                        <button key={f.key} type="button" onClick={() => setFocus(f.key)} aria-pressed={focus === f.key}
                            className={`text-sm font-bold px-4 py-2 rounded-full border-2 transition-colors ${focus === f.key ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-200 bg-white text-rr-dark hover:border-rr-pink/60'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500 font-medium mb-9">
                    {noSpecialist
                        ? `No ${focusLabel} specialist at ${centre.suburb} yet, but every coach here coaches all aspects of the game.`
                        : 'Every coach coaches all aspects of the game. This shows who specialises.'}
                </p>

                {/* 3. Coach */}
                <Step n={3}>Choose your coach</Step>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
                    {shown.map((c) => <CoachCard key={`${centreSlug}-${c.slug}`} c={c} centre={centreSlug} onBook={onBook} />)}
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-2xl mt-6">{AVAILABILITY_NOTE}</p>
            </div>
        </section>
    );
};

export default CoachFinder;

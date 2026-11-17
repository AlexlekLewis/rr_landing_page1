import React, { useState } from 'react';
import { MapPin, ChevronDown, CalendarClock } from 'lucide-react';
import {
    CENTRES, TIERS, AVAILABILITY_NOTE, coachesAt, tierOf, centreOf, perSession, money,
} from './premiumCoachingData';
import { useAllAvailability, groupByNight, nightLabel, timeLabel } from './useCoachAvailability';

// "Find your coach" (Andy, 18 Nov 2026: "stage and select the coaches in a better way ...
// consumer friendly ... across the web side, a larger screen, then down onto a mobile").
//   1. Pick a centre (one tap; the West shows "Bookings open").
//   2. Optional: filter by coach type (Elite / Performance / Academy).
//   3. Compact cards: photo, type, name, specialty, price, next open times, Book.
//      Phone: one slim row per coach. Tablet/desktop: a grid of cards.
//      The full bio is one tap away ("About <name>").
// Times come live from the coach's availability (useCoachAvailability); a coach is never
// offered at two centres on the same night.

const TIER_ORDER = { head: 0, performance: 1, academy: 2 };
const firstName = (n) => n.split(' ')[0];

const Photo = ({ c, className }) => (
    <div className={`overflow-hidden bg-slate-100 ${className}`}>
        {c.img
            ? <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover object-top" />
            : <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{c.name.split(' ').map((p) => p[0]).join('')}</div>}
    </div>
);

const TypeBadge = ({ tier }) => {
    const t = tierOf(tier);
    if (!t) return <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Royals Coach</span>;
    const elite = tier === 'head';
    return (
        <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${elite ? 'text-white' : 'bg-rr-dark text-white'}`}
            style={elite ? { backgroundImage: 'var(--image-gradient-rr)' } : undefined}>{t.name}</span>
    );
};

const NextTimes = ({ c, centre }) => {
    const { slots, loaded } = useAllAvailability();
    const nights = groupByNight(slots, c.slug, centre);
    const next = nights.flatMap((n) => n.slots).slice(0, 3);
    return (
        <div className="mt-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-rr-dark mb-1.5 flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5 text-rr-pink" /> Next open times</p>
            {!loaded && <p className="text-xs text-slate-400 font-medium">Loading…</p>}
            {loaded && next.length === 0 && <p className="text-xs text-rr-charcoal font-medium">New times each week. Book and tell us what suits.</p>}
            {next.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {next.map((s) => (
                        <span key={`${s.date}${s.start}`} className="text-[11px] font-bold text-rr-dark bg-rr-pink/10 border border-rr-pink/30 rounded-md px-2 py-1">{nightLabel(s.date)} · {timeLabel(s.start)}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

const CoachCard = ({ c, centre, onBook }) => {
    const [open, setOpen] = useState(false);
    const others = c.centres.filter((x) => x !== centre).map((x) => centreOf(x).suburb);
    return (
        <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col" data-coach={c.slug}>
            <div className="flex sm:flex-col">
                <Photo c={c} className="w-28 shrink-0 self-stretch sm:w-full sm:aspect-[4/3]" />
                <div className="p-4 sm:p-5 flex-1 min-w-0">
                    <TypeBadge tier={c.tier} />
                    <h3 className="mt-1.5 text-lg font-black text-rr-dark uppercase tracking-wide leading-tight">{c.name}</h3>
                    <p className="text-xs font-bold text-slate-500">{c.role}</p>
                    <p className="mt-2 text-sm font-black text-rr-pink leading-snug">{c.specialism || 'All aspects of the game'}</p>
                    <p className="mt-2 text-sm text-rr-dark">
                        {c.bookable
                            ? <><span className="font-black">{money(perSession(c.tier, 1))}</span> <span className="text-slate-500 font-medium">a session · from {money(perSession(c.tier, 5))}</span></>
                            : <span className="text-slate-500 font-semibold">Price coming soon</span>}
                    </p>
                </div>
            </div>
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex-1 flex flex-col">
                {c.bookable && <NextTimes c={c} centre={centre} />}
                {open && (
                    <div className="mt-3 text-sm text-rr-charcoal font-medium leading-relaxed space-y-2">
                        <p>{c.bio || 'Full profile coming soon.'}</p>
                        <p className="text-xs font-semibold">{c.allAspects}</p>
                        {others.length > 0 && <p className="text-xs text-slate-500 font-semibold">Also coaches at {others.join(' and ')}, never two centres on the same night.</p>}
                    </div>
                )}
                <div className="mt-auto pt-4 flex gap-2">
                    <button type="button" data-cta={`book-${c.slug}`} onClick={() => onBook(centre, c.slug)}
                        className="flex-1 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-xs px-4 py-3 rounded-full transition-colors">
                        {c.bookable ? `Book ${firstName(c.name)}` : `Request ${firstName(c.name)}`}
                    </button>
                    <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
                        className="inline-flex items-center gap-1 text-rr-dark font-black uppercase tracking-widest text-xs px-4 py-3 rounded-full border-2 border-slate-200 hover:border-rr-dark transition-colors">
                        About <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </article>
    );
};

const CoachFinder = ({ onBook }) => {
    const [centreSlug, setCentreSlug] = useState(CENTRES[0].slug);
    const [type, setType] = useState('all');
    const centre = centreOf(centreSlug);
    const here = coachesAt(centreSlug).sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
    const typesHere = TIERS.filter((t) => here.some((c) => c.tier === t.key));
    const shown = type === 'all' ? here : here.filter((c) => c.tier === type);
    const pickCentre = (slug) => { setCentreSlug(slug); setType('all'); };

    return (
        <section className="bg-white py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-rr-pink">Find your coach</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] text-rr-dark mb-4">Choose your centre, then your coach</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-2xl mb-8">{AVAILABILITY_NOTE}</p>

                {/* 1. Centre */}
                <div role="tablist" aria-label="Centre" className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-5">
                    {CENTRES.map((c) => {
                        const on = c.slug === centreSlug;
                        return (
                            <button key={c.slug} type="button" role="tab" aria-selected={on} onClick={() => pickCentre(c.slug)}
                                className={`rounded-xl px-2 py-3 sm:py-4 text-center transition-colors ${on ? 'bg-rr-dark text-white' : 'text-rr-dark hover:bg-white'}`}>
                                <span className="block text-[12px] sm:text-lg font-black uppercase tracking-tight leading-tight break-words">{c.suburb}</span>
                                <span className={`block text-[10px] sm:text-xs font-bold mt-0.5 ${on ? 'text-white/70' : 'text-slate-500'}`}>
                                    {c.badge ? <span className={on ? 'text-rr-light-pink' : 'text-rr-pink'}>● {c.badge}</span> : c.region.split(' ·')[0]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <p className="text-sm font-semibold text-rr-charcoal flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rr-pink" />
                        <span><b className="text-rr-dark">{centre.name}</b>{centre.address ? ` · ${centre.address}` : `, ${centre.suburb}`}<span className="block text-slate-500 font-medium">{centre.note}</span></span>
                    </p>
                    {/* 2. Coach type */}
                    {typesHere.length > 1 && (
                        <div className="flex flex-wrap gap-2" aria-label="Coach type">
                            {[{ key: 'all', name: 'All coaches' }, ...typesHere].map((t) => (
                                <button key={t.key} type="button" onClick={() => setType(t.key)} aria-pressed={type === t.key}
                                    className={`text-xs font-black uppercase tracking-widest px-3.5 py-2 rounded-full border-2 transition-colors ${type === t.key ? 'border-rr-pink bg-rr-pink text-white' : 'border-slate-200 text-rr-dark hover:border-rr-pink/60'}`}>
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Coaches */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
                    {shown.map((c) => <CoachCard key={`${centreSlug}-${c.slug}`} c={c} centre={centreSlug} onBook={onBook} />)}
                </div>

                <div className="mt-8 text-center">
                    <button type="button" data-cta={`centre-${centreSlug}`} onClick={() => onBook(centreSlug, 'match-me')}
                        className="text-rr-dark font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full border-2 border-rr-dark hover:bg-rr-dark hover:text-white transition-colors">
                        Not sure? Match me with a coach in {centre.suburb}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CoachFinder;

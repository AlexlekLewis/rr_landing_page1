import React, { useState } from 'react';
import { MapPin, ChevronDown, CalendarClock } from 'lucide-react';
import { CENTRES, COACHES, AVAILABILITY_NOTE, centreOf } from './premiumCoachingData';
import { useAllAvailability, groupByNight, nightLabel, timeLabel } from './useCoachAvailability';

// "Meet our coaches", a marketplace (Andy, 18 Nov 2026): no prices and no coach hierarchy
// on the page. Families can start from a location ("Your preferred location") or browse
// every coach ("All locations"). Each card: photo, name, specialty, where they coach, next
// available time, Book, and the bio under "Read more". Coaches are listed A–Z.
// The price only appears in the booking form, once a coach and times are chosen.
// Book only works when the coach has open times (families choose from the coach's times).

const firstName = (n) => n.split(' ')[0];
const ALL = 'all';

const Photo = ({ c }) => (
    c.img
        ? <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover object-top" />
        : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{c.name.split(' ').map((p) => p[0]).join('')}</div>
);

const CoachCard = ({ c, location, onBook }) => {
    const [more, setMore] = useState(false);
    const { slots, loaded } = useAllAvailability();
    // Next open times at the chosen location, or anywhere this coach coaches.
    const places = location === ALL ? c.centres : [location];
    const times = places.flatMap((p) => groupByNight(slots, c.slug, p).flatMap((n) => n.slots)).sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
    const canBook = c.bookable && times.length > 0;
    // Book at the chosen location; from "All locations", at the centre of the next open time.
    const bookAt = location !== ALL ? location : (times[0]?.centre || (c.centres.length === 1 ? c.centres[0] : ''));

    return (
        <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col" data-coach={c.slug}>
            <div className="flex sm:block">
                <div className="w-28 sm:w-full shrink-0 sm:aspect-square bg-slate-100 overflow-hidden"><Photo c={c} /></div>
                <div className="p-4 sm:px-5 sm:pt-4 sm:pb-0 min-w-0">
                    <h3 className="text-xl font-black text-rr-dark uppercase tracking-tight leading-tight">{c.name}</h3>
                    <p className="mt-1 text-sm font-bold text-rr-pink leading-snug">{c.specialism || 'Coaches all aspects of the game'}</p>
                    <p className="mt-1.5 text-xs font-semibold text-slate-500 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 mt-px shrink-0" />{c.centres.map((x) => centreOf(x).suburb).join(' · ')}
                    </p>
                </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 flex-1 flex flex-col">
                <div className={`rounded-xl px-3 py-2.5 flex items-center gap-2 ${times.length ? 'bg-rr-pink/10' : 'bg-slate-50'}`}>
                    <CalendarClock className={`w-4 h-4 shrink-0 ${times.length ? 'text-rr-pink' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold text-rr-dark leading-snug">
                        {!loaded ? 'Checking times…'
                            : times.length
                                ? <>Next available: {nightLabel(times[0].date)}, {timeLabel(times[0].start)}{location === ALL && c.centres.length > 1 ? ` at ${centreOf(times[0].centre).suburb}` : ''}{times.length > 1 && <span className="text-slate-500 font-semibold"> · {times.length - 1} more</span>}</>
                                : <span className="text-slate-500">New times coming soon</span>}
                    </p>
                </div>

                {more && (
                    <div className="mt-3 text-sm text-rr-charcoal font-medium leading-relaxed space-y-2">
                        <p>{c.bio || 'Full profile coming soon.'}</p>
                        <p className="text-xs font-semibold">{c.allAspects}</p>
                    </div>
                )}

                <div className="mt-auto pt-4">
                    <button type="button" data-cta={`book-${c.slug}`} onClick={() => onBook(bookAt, c.slug)} disabled={!canBook}
                        className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:bg-slate-100 disabled:text-slate-400 text-white font-black uppercase tracking-widest text-sm px-4 py-3.5 rounded-full transition-colors">
                        {canBook ? `Book ${firstName(c.name)}` : 'Times coming soon'}
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
    const [location, setLocation] = useState(ALL);
    const centre = location === ALL ? null : centreOf(location);
    const shown = COACHES.filter((c) => location === ALL || c.centres.includes(location)).sort((a, b) => a.name.localeCompare(b.name));
    const chip = (on) => `text-left rounded-2xl border-2 px-4 py-3 transition-colors ${on ? 'border-rr-dark bg-rr-dark text-white' : 'border-slate-200 bg-white text-rr-dark hover:border-rr-dark/40'}`;

    return (
        <section className="bg-slate-50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="max-w-2xl mb-10">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-rr-pink">Find your coach</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] text-rr-dark mb-4">Meet our coaches</h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed">Every one a Royals Academy coach, trained on all our tools, coaching every part of the game. Choose your location, find a coach, then book one of their times.</p>
                </div>

                <p className="text-sm font-black text-rr-dark uppercase tracking-wide mb-3">Your preferred location</p>
                <div role="tablist" aria-label="Location" className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3">
                    <button type="button" role="tab" aria-selected={location === ALL} onClick={() => setLocation(ALL)} className={chip(location === ALL)}>
                        <span className="block text-base sm:text-lg font-black uppercase tracking-tight leading-tight">All locations</span>
                        <span className={`block text-xs font-semibold mt-0.5 ${location === ALL ? 'text-white/70' : 'text-slate-500'}`}>Every coach</span>
                    </button>
                    {CENTRES.map((c) => {
                        const on = c.slug === location;
                        return (
                            <button key={c.slug} type="button" role="tab" aria-selected={on} onClick={() => setLocation(c.slug)} className={chip(on)}>
                                <span className="flex items-center justify-between gap-2">
                                    <span className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">{c.suburb}</span>
                                    {c.badge && <span className={`hidden xl:inline whitespace-nowrap text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${on ? 'bg-rr-pink text-white' : 'bg-rr-pink/10 text-rr-pink'}`}>{c.badge}</span>}
                                </span>
                                <span className={`block text-xs font-semibold mt-0.5 ${on ? 'text-white/70' : 'text-slate-500'}`}>Near {c.near.split(', ').slice(0, 2).join(', ')}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs font-semibold text-rr-charcoal flex items-start gap-1.5 mb-8 min-h-[1rem]">
                    {centre && <><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rr-pink" /><span>{centre.name}{centre.address ? `, ${centre.address}` : `, ${centre.suburb}`}</span></>}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
                    {shown.map((c) => <CoachCard key={`${location}-${c.slug}`} c={c} location={location} onBook={onBook} />)}
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-2xl mt-6">{AVAILABILITY_NOTE}</p>
            </div>
        </section>
    );
};

export default CoachFinder;

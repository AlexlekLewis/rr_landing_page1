import React, { useState } from 'react';
import { MapPin, CalendarClock } from 'lucide-react';
import { CENTRES, COACHES, AVAILABILITY_NOTE, centreOf } from './premiumCoachingData';
import { useAllAvailability, groupByNight, nightLabel, timeLabel } from './useCoachAvailability';

// "Meet our coaches", a marketplace (Andy, 18 Nov 2026): no prices and no coach hierarchy
// on the page; coaches shown by location, A–Z. Each card: photo, name, next available time
// (no description under the photo, Andy 20 Nov 2026). Tapping a coach opens their profile (CoachBooking.jsx): their own rate card
// (1-to-1 or 1-to-2, 1, 3 or 5 sessions), their times, details, pay.


const Photo = ({ c }) => (
    c.img
        ? <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover object-top" />
        : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black" style={{ backgroundImage: 'var(--image-gradient-rr)' }}>{c.name.split(' ').map((p) => p[0]).join('')}</div>
);

const CoachCard = ({ c, location, onOpen }) => {
    const { slots, loaded } = useAllAvailability();
    const times = groupByNight(slots, c.slug, location).flatMap((n) => n.slots);
    return (
        <button type="button" onClick={() => onOpen(c.slug, location)} data-coach={c.slug} data-cta={`open-${c.slug}`}
            className="group text-left bg-white border border-slate-200 hover:border-rr-pink rounded-2xl overflow-hidden flex flex-col transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/40">
            <div className="flex sm:block w-full">
                <div className="w-28 sm:w-full shrink-0 sm:aspect-square bg-slate-100 overflow-hidden"><Photo c={c} /></div>
                <div className="p-4 sm:px-5 sm:pt-4 sm:pb-0 min-w-0">
                    <h3 className="text-xl font-black text-rr-dark uppercase tracking-tight leading-tight">{c.name}</h3>
                    {c.centres.length > 1 && <p className="mt-1.5 text-xs font-semibold text-slate-500">Also at {c.centres.filter((x) => x !== location).map((x) => centreOf(x).suburb).join(', ')}</p>}
                </div>
            </div>
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 w-full flex-1 flex flex-col">
                <div className={`rounded-xl px-3 py-2.5 flex items-center gap-2 ${times.length ? 'bg-rr-pink/10' : 'bg-slate-50'}`}>
                    <CalendarClock className={`w-4 h-4 shrink-0 ${times.length ? 'text-rr-pink' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold text-rr-dark leading-snug">
                        {!loaded ? 'Checking times…'
                            : times.length
                                ? <>Next available: {nightLabel(times[0].date)}, {timeLabel(times[0].start)}{times.length > 1 && <span className="text-slate-500 font-semibold"> · {times.length - 1} more</span>}</>
                                : <span className="text-slate-500">New times coming soon</span>}
                    </p>
                </div>
                <span className="mt-auto pt-4">
                    <span className="block w-full text-center bg-rr-pink group-hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm px-4 py-3.5 rounded-full transition-colors">
                        View times &amp; book
                    </span>
                </span>
            </div>
        </button>
    );
};

const CoachFinder = ({ onOpen }) => {
    const [location, setLocation] = useState(CENTRES[0].slug);
    const centre = centreOf(location);
    const shown = COACHES.filter((c) => c.centres.includes(location)).sort((a, b) => a.name.localeCompare(b.name));
    const chip = (on) => `text-left rounded-2xl border-2 px-4 py-3 transition-colors ${on ? 'border-rr-dark bg-rr-dark text-white' : 'border-slate-200 bg-white text-rr-dark hover:border-rr-dark/40'}`;

    return (
        <section className="bg-slate-50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="max-w-2xl mb-10">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-rr-pink">Find your coach</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] text-rr-dark mb-4">Meet our coaches</h2>
                    <p className="text-rr-charcoal font-medium leading-relaxed">Every one a Royals Academy coach, trained on all our tools, coaching every part of the game. Choose your location, then tap a coach to see their times and book.</p>
                </div>

                <p className="text-sm font-black text-rr-dark uppercase tracking-wide mb-3">Your preferred location</p>
                <div role="tablist" aria-label="Location" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3">
                    {CENTRES.map((c) => {
                        const on = c.slug === location;
                        return (
                            <button key={c.slug} type="button" role="tab" aria-selected={on} onClick={() => setLocation(c.slug)} className={chip(on)}>
                                <span className="flex items-center justify-between gap-2">
                                    <span className="text-base sm:text-lg font-black uppercase tracking-tight leading-tight">{c.suburb}</span>
                                    {c.badge && <span className={`hidden md:inline whitespace-nowrap text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${on ? 'bg-rr-pink text-white' : 'bg-rr-pink/10 text-rr-pink'}`}>{c.badge}</span>}
                                </span>
                                <span className={`block text-xs font-semibold mt-0.5 ${on ? 'text-white/70' : 'text-slate-500'}`}>Near {c.near}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs font-semibold text-rr-charcoal flex items-start gap-1.5 mb-8 min-h-[1rem]">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rr-pink" /><span>{centre.name}{centre.address ? `, ${centre.address}` : `, ${centre.suburb}`}</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
                    {shown.map((c) => <CoachCard key={`${location}-${c.slug}`} c={c} location={location} onOpen={onOpen} />)}
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-2xl mt-6">{AVAILABILITY_NOTE}</p>
            </div>
        </section>
    );
};

export default CoachFinder;

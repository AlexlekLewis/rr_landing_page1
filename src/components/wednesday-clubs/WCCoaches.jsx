import React from 'react';
import { VENUE } from './wcOptions';

const WCCoaches = ({ club }) => {
    const { coachesSection: s } = club;
    const single = club.coaches.length === 1;
    const firstName = club.coaches[0].name.split(' ')[0];

    return (
        <section className="bg-slate-50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                    {s.kicker}
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                    {s.headline}
                </h2>
                <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-12">
                    {club.name} is open to {club.players} aged {club.ages} at any standard.{' '}
                    <strong className="text-rr-dark">Places are limited.</strong> {s.intro}
                </p>

                <div className={`grid grid-cols-1 gap-6 ${single ? 'max-w-4xl' : 'md:grid-cols-2'}`}>
                    {club.coaches.map((coach) => (
                        <div
                            key={coach.name}
                            className={`bg-white rounded-3xl border border-slate-200 overflow-hidden flex ${
                                single ? 'flex-col md:flex-row' : 'flex-col'
                            }`}
                        >
                            {/* Studio headshots: Royals Academy kit against the pink wall. */}
                            <div className={`bg-rr-pink ${single ? 'md:w-2/5 shrink-0' : ''}`}>
                                <img
                                    src={coach.photo}
                                    alt={`${coach.name}, ${club.coachTitle}`}
                                    className={`w-full object-cover object-[50%_32%] ${
                                        single ? 'h-96 md:h-full' : 'h-96 md:h-[26rem]'
                                    }`}
                                />
                            </div>

                            <div className="flex flex-col flex-1">
                                <div className="px-8 py-7 flex-1">
                                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-2">
                                        {club.coachTitle} &mdash; {club.name}
                                    </p>
                                    <p className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-3">
                                        {coach.name}
                                    </p>
                                    <p className="text-[13px] font-bold text-rr-dark/60 uppercase tracking-wide mb-4 pb-4 border-b border-slate-200">
                                        {coach.plays}
                                    </p>
                                    <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">
                                        {coach.line}
                                    </p>
                                </div>

                                <div className="px-8 py-5 border-t border-slate-200 bg-slate-50">
                                    <p className="text-[13px] text-rr-dark/60 font-medium">
                                        {club.day}s, {club.time} &middot; {VENUE.name}, {VENUE.suburb}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* All the dates, once they are set, so nobody counts Wednesdays off a calendar. */}
                <div className="mt-8 bg-white border border-slate-200 rounded-3xl px-6 py-6 md:px-8">
                    <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-3">
                        The {club.weeks} nights
                    </p>
                    {club.startDate ? (
                        <>
                            <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed mb-4">
                                {club.weeks} Wednesdays at {VENUE.name}, starting{' '}
                                <strong className="text-rr-dark">{club.startDate}</strong>.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {club.nights.map((n, i) => (
                                    <span
                                        key={n}
                                        className={`text-[13px] font-bold rounded-full px-3.5 py-1.5 ${
                                            i === 0 ? 'bg-rr-pink text-white' : 'bg-slate-100 text-rr-dark/70'
                                        }`}
                                    >
                                        {n}
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">
                            {club.weeks} Wednesdays at {VENUE.name}, {club.time}.{' '}
                            <strong className="text-rr-dark">The start date is not set yet.</strong>{' '}
                            Register your interest and we will tell you the dates before anyone is
                            offered a place.
                        </p>
                    )}
                </div>

                <p className="text-[13px] text-rr-dark/50 font-medium mt-6 max-w-3xl">
                    {single ? `${firstName} plays` : 'Both coaches play'} Premier Cricket through the
                    season, so on the few nights {single ? 'he is' : 'either of them is'} away with
                    {single ? ' his' : ' their'} own cricket, another Academy coach runs the session.
                    We tell you in advance when that happens.
                </p>
            </div>
        </section>
    );
};

export default WCCoaches;

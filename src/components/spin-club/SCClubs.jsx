import React from 'react';
import { CLUBS, PROGRAM, EVERY_SPIN } from './scOptions';

const SCClubs = () => (
    <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                Two clubs, two Royal Spin Coaches
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                Pick the one closest to you
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-6">
                Both clubs run on the same night at the same time, and both are open to spin bowlers
                aged {PROGRAM.ages} at any standard. <strong className="text-rr-dark">Each centre
                takes a limited number of places.</strong> The Royal Spin Coach named below mentors that
                centre&rsquo;s group and picks it.
            </p>

            {/* Said plainly, because "Off spin" under a venue name reads as a restriction. */}
            <div className="bg-white border-l-4 border-rr-pink rounded-r-2xl px-6 py-5 max-w-3xl mb-12">
                <p className="text-sm font-black text-rr-dark uppercase tracking-wide mb-2">
                    {EVERY_SPIN.short}
                </p>
                <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">
                    {EVERY_SPIN.long}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CLUBS.map((club) => (
                    <div
                        key={club.key}
                        className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col"
                    >
                        <div className="bg-rr-dark px-8 py-6">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
                                {club.name}
                            </h3>
                            <p className="text-sm text-white/60 font-medium mt-2">
                                {club.venue}, {club.suburb} &middot; {club.region}
                            </p>
                        </div>

                        <div className="px-8 py-7 flex-1">
                            <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-2">
                                {club.coach.role}
                            </p>
                            <p className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-3">
                                {club.coach.name}
                            </p>
                            <p className="text-[13px] font-bold text-rr-dark/60 uppercase tracking-wide mb-4 pb-4 border-b border-slate-200">
                                Bowls {club.coach.spin.toLowerCase()} &middot; coaches every kind
                            </p>
                            <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">
                                {club.coach.line}
                            </p>
                        </div>

                        <div className="px-8 py-5 border-t border-slate-200 bg-slate-50">
                            <p className="text-[13px] text-rr-dark/60 font-medium">
                                {PROGRAM.day}s, {PROGRAM.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-[13px] text-rr-dark/50 font-medium mt-6 max-w-3xl">
                Both coaches play and train through the season, so on the few nights either of them
                is away with their own cricket, another Academy spin coach runs the session. We tell
                you in advance when that happens.
            </p>
        </div>
    </section>
);

export default SCClubs;

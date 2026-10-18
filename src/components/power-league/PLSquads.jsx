import React from 'react';
import { SQUAD_GIVES, PATHWAY, WHO_FOR, CENTRES } from './plOptions';

// The lead-magnet half: a player who came for one match sees the whole program.
const PLSquads = () => (
    <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                Where this leads
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                Performance Squads:<br className="hidden md:block" /> a season of training and matches
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-12">
                The representative arm of the Rajasthan Royals Academy &mdash; squads of like-skilled
                players aged 10 to 25 who train together every week and play matches together from
                September to April. <strong className="text-rr-dark">Every player earns their place at a trial.</strong>
                {' '}This match day is a chance to see what that looks like from the inside.
            </p>

            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-6">
                What a squad place gives you
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {SQUAD_GIVES.map(([title, body]) => (
                    <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6">
                        <p className="text-sm font-black text-rr-dark uppercase tracking-wide mb-2">{title}</p>
                        <p className="text-[14px] text-rr-dark/65 font-medium leading-relaxed">{body}</p>
                    </div>
                ))}
            </div>

            <div className="bg-rr-dark rounded-3xl p-8 md:p-12 text-white mb-16">
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">The Royals pathway</p>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-5">
                    A squad place puts you inside the Royals system
                </h3>
                <p className="text-[15px] md:text-base text-white/80 font-medium leading-relaxed max-w-3xl mb-7">
                    T20 has torn up the old route to professional cricket, and the Royals run a global
                    system. A squad place puts you inside it. Four of our players have already been put
                    forward to the <strong className="text-white">Paarl Royals</strong> in the SA20, and
                    Royals academies have sent players to the{' '}
                    <strong className="text-white">Barbados Royals</strong> as training partners.
                </p>
                <div className="flex flex-wrap gap-3">
                    {PATHWAY.map((p) => (
                        <span key={p} className="border-2 border-white/30 text-white text-xs font-black uppercase tracking-widest rounded-full px-4 py-2">
                            {p}
                        </span>
                    ))}
                </div>
            </div>

            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-6">Who it is for</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {WHO_FOR.map(([title, body]) => (
                    <div key={title} className="border-l-4 border-rr-pink/70 pl-5 py-1">
                        <p className="text-base font-black text-rr-dark uppercase tracking-wide mb-2">{title}</p>
                        <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">{body}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CENTRES.map((c) => (
                    <div key={c.region} className="bg-white rounded-2xl border border-slate-200 p-7">
                        <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-2">{c.region}</p>
                        <p className="text-xl font-black text-rr-dark uppercase tracking-tight mb-1.5">{c.venue}</p>
                        <p className="text-[14px] text-rr-dark/60 font-medium">Head Coach: {c.coach}</p>
                    </div>
                ))}
            </div>

            <p className="text-[15px] text-rr-dark/60 font-medium leading-relaxed mt-10 max-w-3xl">
                Trial dates for the next squad intake are not set yet. Nominate for the match and we
                will tell you first when they are.
            </p>
        </div>
    </section>
);

export default PLSquads;

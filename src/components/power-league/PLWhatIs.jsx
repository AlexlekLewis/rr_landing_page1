import React from 'react';
import { WHAT_IS, MATCH } from './plOptions';

const PLWhatIs = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">The match day</p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                What Power League<br className="hidden md:block" /> actually is
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-12">
                It is the match program that sits underneath our Performance Squads. For this one we
                are opening places to players from any club, so you do not need to be in the Academy
                to put your hand up.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
                {WHAT_IS.map(([title, body]) => (
                    <div key={title} className="border-l-4 border-rr-pink/70 pl-5 py-1">
                        <p className="text-base font-black text-rr-dark uppercase tracking-wide mb-2">{title}</p>
                        <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">{body}</p>
                    </div>
                ))}
            </div>

            <div className="bg-rr-dark rounded-3xl p-8 md:p-10 text-white">
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-5">How it runs</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                    {[
                        ['When', `${MATCH.date}`, MATCH.time],
                        ['Where', MATCH.venues[0], MATCH.venues[1]],
                        ['Cost', `${MATCH.fee} a game`, 'Paid only if you are picked'],
                        ['Ages', '10 to 25', 'Tell us the age and we will place them'],
                    ].map(([k, a, b]) => (
                        <div key={k}>
                            <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">{k}</p>
                            <p className="text-lg font-black uppercase tracking-tight leading-tight">{a}</p>
                            <p className="text-[13px] text-white/60 font-medium mt-1 leading-snug">{b}</p>
                        </div>
                    ))}
                </div>
                <p className="text-[15px] text-white/80 font-semibold leading-relaxed mt-8 pt-7 border-t border-white/15">
                    Nominations close <strong className="text-white">{MATCH.closes}</strong>. {MATCH.picked}
                </p>
            </div>
        </div>
    </section>
);

export default PLWhatIs;

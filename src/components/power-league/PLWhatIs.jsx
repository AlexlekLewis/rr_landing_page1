import React from 'react';
import { WHAT_IS, MATCH, STEPS } from './plOptions';

const PLWhatIs = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">Where squads compete</p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                Our T20 match program,<br className="hidden md:block" /> open to any club
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-12">
                The Power League is where the Academy&rsquo;s Performance Squads play each other in T20
                matches, from September to April. For this game we are opening places to players from
                any club, so you do not need to be in the Academy to put your hand up.
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
                <h3 className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-5">Match day details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                    {[
                        ['When', MATCH.date, MATCH.timeDetail],
                        ['Where', MATCH.where, MATCH.whereDetail],
                        ['Cost', `${MATCH.fee}`, 'Per player, for the one game. Paid only if the player is picked.'],
                        ['Ages', MATCH.ages, 'Age on match day. Players from any club, in or out of the Academy.'],
                    ].map(([k, a, b]) => (
                        <div key={k}>
                            <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">{k}</p>
                            <p className="text-lg font-black uppercase tracking-tight leading-tight">{a}</p>
                            <p className="text-[13px] text-white/60 font-medium mt-1 leading-snug">{b}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-7 border-t border-white/15">
                    <h3 className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-5">What happens after you nominate</h3>
                    <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {STEPS.map(([title, body], i) => (
                            <li key={title} className="flex gap-4">
                                <span className="text-rr-pink text-2xl font-black leading-none w-6 shrink-0">{i + 1}</span>
                                <span>
                                    <span className="block text-base font-black uppercase tracking-tight leading-tight mb-1">{title}</span>
                                    <span className="block text-[14px] text-white/70 font-medium leading-relaxed">{body}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    </section>
);

export default PLWhatIs;

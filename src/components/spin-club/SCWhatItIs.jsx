import React from 'react';
import { PROGRAM } from './scOptions';

const PILLARS = [
    {
        title: 'Technical',
        body: 'Your grip, your action, your release. The work that makes the ball spin hard and land where you meant it to.',
    },
    {
        title: 'Mental',
        body: 'What you do after you get hit. Spin is the one job in cricket where doing it right can still cost you runs, so we train how you handle that.',
    },
    {
        title: 'Tactical',
        body: 'Reading the batter, setting them up, picking the next ball, and knowing what your field is really for.',
    },
];

const NIGHT = [
    ['Talk', 'What happened in your last game, and what you are working on.'],
    ['The skill', 'One thing about your grip, your action or your release, worked on properly.'],
    ['The challenge', 'A target to beat, with your Royal Spin Coach taking one bowler aside at a time.'],
    ['The game', 'Bowling at batters, with runs and wickets that count.'],
];

const SCWhatItIs = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                Why Spin Club exists
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                The hardest part of spin<br className="hidden md:block" /> is knowing if you bowled well
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 mb-16">
                <div className="lg:col-span-3">
                    <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed mb-5">
                        In season is the trickiest time to be a spinner. You can bowl beautifully and
                        still go for runs. You can bowl average and take five. Most spinners are left
                        to sort that out on their own, in the car on the way home.
                    </p>
                    <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed mb-5">
                        Spin Club exists to put those problems in one room. Spinners bring the night
                        they had, and the group shares it, learns from it, works on it and solves it
                        together. That is the whole idea: a community of spinners who explore the
                        game with each other, rather than alone.
                    </p>
                    <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed mb-5">
                        It is deliberately player-led. The spinners set what the night is about and
                        the coaches support it, with Callum Stow and Harkirat Bajwa mentoring the
                        group rather than running drills at it.
                    </p>
                    <p className="text-base md:text-lg text-rr-dark font-semibold leading-relaxed">
                        We want to change how spinners prepare for games, and how we develop them —
                        with a real balance between the technical work, the mental side and the
                        tactical understanding.
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-slate-50 border-l-4 border-rr-pink rounded-r-2xl p-7 h-full flex flex-col justify-center">
                        <p className="text-lg md:text-xl text-rr-dark font-bold leading-relaxed mb-5">
                            &ldquo;Growing up, the thing I wanted most was a group of spinners to work
                            with and explore the game with. That is what we are building here.&rdquo;
                        </p>
                        <p className="text-sm font-black text-rr-dark uppercase tracking-widest">
                            Alex Lewis
                        </p>
                        <p className="text-sm text-rr-dark/60 font-medium">
                            Director of Cricket, Rajasthan Royals Academy Melbourne
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-6">
                What we work on
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PILLARS.map((b, i) => (
                    <div key={b.title} className="border-t-2 border-rr-pink/30 pt-5">
                        <p className="text-5xl font-black text-rr-pink/20 leading-none mb-3">
                            {String(i + 1).padStart(2, '0')}
                        </p>
                        <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-3">
                            {b.title}
                        </h3>
                        <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">{b.body}</p>
                    </div>
                ))}
            </div>

            <div className="mt-14 bg-rr-dark rounded-3xl p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-5">
                    A Wednesday night, start to finish
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {NIGHT.map(([t, d]) => (
                        <div key={t}>
                            <p className="text-sm font-black text-rr-pink uppercase tracking-widest mb-2">{t}</p>
                            <p className="text-[14px] text-white/70 font-medium leading-relaxed">{d}</p>
                        </div>
                    ))}
                </div>
                <p className="text-[13px] text-white/50 font-medium mt-6">
                    {PROGRAM.time} on a {PROGRAM.day} night. {PROGRAM.sessionLength} on the floor,
                    for {PROGRAM.weeks} weeks, then straight on through January, February and March.
                </p>
            </div>
        </div>
    </section>
);

export default SCWhatItIs;

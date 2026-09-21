import React from 'react';
import { PROGRAM } from './scOptions';

const BLOCKS = [
    {
        title: 'Talk about your last game',
        body: 'Every night starts with the overs you bowled on the weekend. What worked, what got hit, and what you would do differently. Everyone in the room has been there.',
    },
    {
        title: 'Learn what only spinners know',
        body: 'Field settings, changing your pace, bowling to a left-hander, bowling on a day when it is not turning. The parts of the game a spinner usually has to work out alone.',
    },
    {
        title: 'Give it a rip',
        body: 'A ball you toss up and spin is the right ball, even when it goes for six. We coach the next one, instead of teaching you to bowl flat and safe.',
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
                What Spin Club is
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                Spinners, together,<br className="hidden md:block" /> every Wednesday
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-5">
                Spin Club brings Melbourne&rsquo;s spinners together under Callum Stow and Harkirat
                Bajwa, to train, to talk and to work things out with each other. It runs during the
                season, so the night is about the cricket you are actually playing: the overs you
                bowled on the weekend, what the batter did to you, what you would try next time, and
                the tactics only another spinner really understands.
            </p>
            <p className="text-base md:text-lg text-rr-dark font-semibold leading-relaxed max-w-3xl mb-14">
                It is as much a support network as it is a training night. It runs for{' '}
                {PROGRAM.weeks} weeks across the school term, then keeps going through January,
                February and March.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {BLOCKS.map((b, i) => (
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
                    {PROGRAM.time} on a {PROGRAM.day} night. {PROGRAM.sessionLength} on the floor.
                </p>
            </div>
        </div>
    </section>
);

export default SCWhatItIs;

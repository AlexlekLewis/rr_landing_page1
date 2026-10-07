import React from 'react';
import { Check, RotateCcw, Flag, ArrowDown } from 'lucide-react';
import { SESSION, BLOCK, CUES, TERM_8, wednesdays2027 } from './jrV2Facts';

// ─────────────────────────────────────────────────────────────
// Visual explainers for /junior-royals version 2 (experience-design brief, 7 Oct 2026).
// Each should make sense in about 5 seconds on a phone (402px median width).
// - Colour key, the same everywhere: pink = batting, blue = bowling, dark = games.
//   Colour is never the only signal: every segment also has a word.
// - Pink is only used for big numbers, headings (19px+ bold), lines and shapes —
//   small pink text fails contrast. Blue sits on white only (it vanishes on dark).
// - Lines, numbers and ticks; no boxes, drop-shadows or pills.
// - Live text and inline SVG, never images, so phone translation and screen
//   readers work.
// ─────────────────────────────────────────────────────────────

export const KIND = {
    bat: { bg: 'bg-rr-pink', border: 'border-rr-pink', label: 'Batting' },
    bowl: { bg: 'bg-rr-blue', border: 'border-rr-blue', label: 'Bowling' },
    game: { bg: 'bg-rr-dark', border: 'border-rr-dark', label: 'Games' },
    break: { bg: 'bg-slate-400', border: 'border-slate-400', label: 'Break' },
};

// 1 ── Train, play, train again: three stops with a loop back to the start.
export const LoopVisual = ({ steps }) => (
    <div className="relative">
        <ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-6 pl-10 sm:pl-0">
            {/* Mobile: the line down the left, with the arrow back to the top */}
            <span className="sm:hidden absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-300" aria-hidden="true" />
            {steps.map((s) => (
                <li key={s.n} className="relative sm:border-t-4 sm:border-rr-pink sm:pt-5">
                    <span className="absolute -left-10 sm:static flex sm:inline-flex w-8 h-8 rounded-full bg-rr-pink text-white font-black items-center justify-center" aria-hidden="true">{s.n}</span>
                    <p className="text-xs font-black uppercase tracking-widest text-rr-charcoal sm:mt-3">{s.when}</p>
                    <p className="text-2xl font-black uppercase text-rr-dark leading-tight">{s.title}</p>
                    <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-1">{s.body}</p>
                </li>
            ))}
        </ol>
        <p className="mt-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-rr-dark">
            <RotateCcw className="w-5 h-5 text-rr-pink shrink-0" aria-hidden="true" />
            Then back to step 1
        </p>
    </div>
);

// 2a ── One night: the three numbers that matter.
export const HourNumbers = ({ items }) => (
    <dl className="grid grid-cols-3 border-y border-slate-300 divide-x divide-slate-300">
        {items.map((x) => (
            <div key={x.label} className="py-5 px-2 text-center">
                <dt className="sr-only">{x.label}</dt>
                <dd>
                    <span className="block text-4xl sm:text-5xl font-black text-rr-dark leading-none">{x.n}<span className="text-lg ml-0.5">{x.unit}</span></span>
                    <span className={`block mx-auto mt-2 w-10 h-1 ${KIND[x.kind].bg}`} aria-hidden="true" />
                    <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-rr-charcoal mt-2">{x.label}</span>
                </dd>
            </div>
        ))}
    </dl>
);

// 2b ── One night: the hour to scale (a vertical ribbon on phones).
export const HourRibbon = () => (
    <figure aria-label="The 60-minute plan for every session">
        <ol className="space-y-0">
            {SESSION.map((s) => (
                <li key={s.from} className="grid grid-cols-[3.25rem_8px_1fr] gap-3">
                    <span className="text-sm font-black text-rr-dark tabular-nums pt-0.5">{s.from}–{s.to}</span>
                    <span className={`${KIND[s.kind].bg} rounded-sm`} style={{ minHeight: `${(s.to - s.from) * 7}px` }} aria-hidden="true" />
                    <span className="pb-3 text-[15px] leading-snug">
                        <span className="font-bold text-rr-dark">{s.name}.</span>{' '}
                        <span className="text-rr-charcoal font-medium">{s.note}</span>
                    </span>
                </li>
            ))}
        </ol>
    </figure>
);

// 2c ── A lane from above: the net, the stumps, the coach and the players.
export const LaneDots = ({ players, label }) => (
    <figure className="flex flex-col items-center">
        <svg viewBox="0 0 120 220" className="w-24 h-44" role="img" aria-label={`${label}: one lane with ${players} players and a coach`}>
            <rect x="6" y="6" width="108" height="208" rx="6" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />
            {[52, 60, 68].map((x) => <line key={x} x1={x} y1="16" x2={x} y2="30" stroke="#111921" strokeWidth="3" />)}
            <circle cx="60" cy="70" r="9" fill="none" stroke="#E11F8F" strokeWidth="4" />
            {Array.from({ length: players }).map((_, i) => {
                const cols = 2, row = Math.floor(i / cols), col = i % cols;
                return <circle key={i} cx={42 + col * 36} cy={115 + row * 30} r="9" fill="#111921" />;
            })}
        </svg>
        <figcaption className="text-center mt-2">
            <span className="block text-sm font-black text-rr-dark">{label}</span>
            <span className="block text-sm font-medium text-rr-charcoal">{players} players, 1 coach</span>
        </figcaption>
    </figure>
);

// 3 ── How a skill sticks: Learn it → Own it → Use it.
export const SkillSteps = () => (
    <ol className="grid sm:grid-cols-3 gap-6">
        {BLOCK.map((b, i) => (
            <li key={b.week} className="border-t-4 border-rr-pink pt-4">
                <p className="text-xs font-black uppercase tracking-widest text-rr-charcoal">Week {b.week}</p>
                <p className="text-2xl font-black uppercase text-rr-dark mt-1">{b.name}</p>
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-2">{b.does}</p>
                {i < BLOCK.length - 1 && <ArrowDown className="sm:hidden mt-3 w-5 h-5 text-rr-pink" aria-hidden="true" />}
            </li>
        ))}
    </ol>
);

export const Cues = () => (
    <ul className="grid sm:grid-cols-3 gap-5">
        {CUES.map((c) => (
            <li key={c.cue} className="border-l-4 border-rr-pink pl-4">
                <p className="text-2xl font-black text-rr-dark leading-tight">“{c.cue}”</p>
                <p className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-1">{c.means}</p>
            </li>
        ))}
    </ul>
);

// 4 ── One term: eight Wednesdays, Benchmark Game first and last.
export const TermRows = () => (
    <ol className="relative border-l-2 border-slate-300 ml-2">
        {TERM_8.map((t) => (
            <li key={t.date} className="relative pl-6 pb-4 last:pb-0">
                <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ${t.flag ? 'bg-rr-pink' : 'bg-white border-2 border-slate-400'}`} aria-hidden="true" />
                <span className="text-sm font-black text-rr-dark tabular-nums">{t.date}</span>
                <span className="block text-[15px] leading-snug">
                    {t.flag && <Flag className="inline w-4 h-4 text-rr-pink mr-1 -mt-0.5" aria-hidden="true" />}
                    <span className={`font-bold ${t.flag ? 'text-rr-dark' : 'text-rr-charcoal'}`}>{t.label}</span>
                    <span className="text-rr-charcoal font-medium">{t.note ? ` · ${t.note}` : ''}</span>
                </span>
            </li>
        ))}
    </ol>
);

export const Scoreboards = ({ first, last, note }) => (
    <figure>
        <div className="flex items-center gap-3">
            {[first, last].map((label, i) => (
                <React.Fragment key={label}>
                    {i === 1 && <span className="text-2xl font-black text-rr-pink" aria-hidden="true">→</span>}
                    <div className="flex-1 border-2 border-rr-dark rounded-lg py-4 text-center">
                        <span className="block text-xs font-black uppercase tracking-widest text-rr-charcoal">{label}</span>
                        <span className="block text-3xl font-black text-slate-300 mt-1" aria-hidden="true">—</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
        <figcaption className="text-[15px] text-rr-charcoal font-medium leading-relaxed mt-3">{note}</figcaption>
    </figure>
);

// 6 ── A year: one square per Wednesday. Filled = a training week you pay for.
export const YearStrip = () => {
    const weeks = wednesdays2027();
    return (
        <figure aria-label="2027: 40 Wednesday sessions and 12 school-holiday weeks">
            <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] sm:grid-cols-[repeat(26,minmax(0,1fr))] gap-1 max-w-xl" aria-hidden="true">
                {weeks.map((w) => (
                    <div key={w.iso} className={`aspect-square rounded-[3px] ${w.term ? 'bg-rr-dark' : 'border-[1.5px] border-slate-500'}`} />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm font-bold text-rr-dark">
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-rr-dark" />Wednesday with a session (you pay)</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm border-[1.5px] border-slate-500" />School holidays (nothing to pay)</span>
            </div>
            <figcaption className="text-xs text-rr-charcoal font-medium mt-2">2027, one square for each Wednesday, January to December.</figcaption>
        </figure>
    );
};

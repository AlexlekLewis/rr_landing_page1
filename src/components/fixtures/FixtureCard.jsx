import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { TEAMS, shortDay, timeLabel } from './fixturesData';

// One match: date block, competition and grade, the two teams, time, ground and suburb,
// and the result once it's played. Same card on the home page and on /fixtures.
const Badge = ({ id }) => {
    const t = TEAMS[id];
    return (
        <span className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-[11px] font-black text-white tracking-wide" style={{ background: t?.colour || '#111921' }} aria-hidden="true">
            {t?.short || '?'}
        </span>
    );
};

const FixtureCard = ({ f }) => {
    const d = shortDay(f.startsAt);
    const home = TEAMS[f.home]; const away = TEAMS[f.away];
    return (
        <article className="relative flex overflow-hidden rounded-2xl border border-slate-200 bg-white" data-fixture={f.id}>
            {f.sample && <span className="absolute top-2 right-2 z-10 text-[9px] font-black uppercase tracking-[0.14em] bg-amber-400 text-rr-dark rounded px-1.5 py-0.5">Sample</span>}
            <div className="shrink-0 w-[72px] md:w-20 flex flex-col items-center justify-center text-white py-4" style={{ background: 'linear-gradient(180deg,#E50695 0%,#1226AA 100%)' }}>
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">{d.dow}</span>
                <span className="text-3xl font-black leading-none my-0.5">{d.day}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-90">{d.month}</span>
            </div>
            <div className="flex-1 min-w-0 p-4 md:p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rr-pink mb-2">
                    {f.competition}{f.grade ? ` · ${f.grade}` : ''}
                </p>
                <div className="space-y-1.5">
                    <p className="flex items-center gap-2.5 min-w-0"><Badge id={f.home} /><span className="font-black text-rr-dark text-sm md:text-base leading-tight">{home?.name}</span></p>
                    <p className="pl-[3px] text-[10px] font-black uppercase tracking-widest text-rr-charcoal/50">vs</p>
                    <p className="flex items-center gap-2.5 min-w-0"><Badge id={f.away} /><span className="font-black text-rr-dark text-sm md:text-base leading-tight">{away?.name}</span></p>
                </div>
                {f.result && <p className="mt-3 text-sm font-bold text-rr-blue">{f.result}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-rr-charcoal/75">
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" aria-hidden="true" />{timeLabel(f.startsAt)}</span>
                    {f.mapUrl
                        ? <a href={f.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-rr-pink underline-offset-2 hover:underline" data-cta={`fixture-map-${f.id}`}><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{f.venue}, {f.suburb}</a>
                        : <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{f.venue}, {f.suburb}</span>}
                </div>
                {f.link && (
                    <a href={f.link.href} className="mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-rr-pink hover:underline" data-cta={`fixture-link-${f.id}`}>
                        {f.link.label} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                )}
            </div>
        </article>
    );
};

export default FixtureCard;

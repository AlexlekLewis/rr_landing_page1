import React from 'react';
import { Check } from 'lucide-react';
import { SQUADS } from '../../lib/booking/squads';

// Availability for ONE centre — squads GROUPED BY DAY, each shown as a small box
// with its TIME and a clearly-labelled AGE GROUP ("Ages 12–14"). Two modes:
//   • browse (no eligibleBand)  → all boxes neutral, informational.
//   • funnel (eligibleBand set)  → the applicant's age group LIGHTS UP and is
//     selectable; every other age group DIMS OUT and is non-interactive.
// Single source of truth: src/lib/booking/squads.ts (SQUADS). No times live here.

const enDash = '–';
const DAY_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const fullDay = (d) => DAY_FULL[(d || '').slice(0, 3)] || d;
const fmtAge = (b) => `Ages ${String(b).replace('-', enDash)}`; // "12-14" → "Ages 12–14" · "17+" → "Ages 17+"
// "5:30pm"+"7:30pm" → "5:30–7:30pm" · drop the start meridiem when it matches the end.
const fmtTime = (start, end) => {
    const sM = (String(start).match(/am|pm/i) || [''])[0];
    const eM = (String(end).match(/am|pm/i) || [''])[0];
    const s = sM && eM && sM.toLowerCase() === eM.toLowerCase() ? String(start).replace(/am|pm/i, '') : start;
    return `${s}${enDash}${end}`;
};

// Group a centre's squads by day, preserving sortOrder (day-then-time).
function groupByDay(squads) {
    const groups = [];
    for (const s of squads) {
        let g = groups.find((x) => x.day === s.day);
        if (!g) { g = { day: s.day, items: [] }; groups.push(g); }
        g.items.push(s);
    }
    return groups;
}

export default function CentreAvailabilityGrid({
    centreSlug,
    eligibleBand = null,
    selectedId = null,
    onPick = null,
    spotsLeftFor = null,
    className = '',
}) {
    const squads = SQUADS
        .filter((s) => s.centre === centreSlug)
        .sort((a, b) => a.sortOrder - b.sortOrder);

    if (squads.length === 0) {
        return (
            <div className="text-sm font-bold text-white/40 uppercase tracking-wide py-2">
                Days &amp; times to be confirmed
            </div>
        );
    }

    const filtering = !!eligibleBand;
    const days = groupByDay(squads);

    return (
        <div className={className}>
            {filtering && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-[10px] font-black uppercase tracking-widest">
                    <span className="inline-flex items-center gap-1.5 text-rr-pink">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rr-pink" /> Your age group ({String(eligibleBand).replace('-', enDash)})
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-white/35">
                        <span className="w-2.5 h-2.5 rounded-sm bg-white/15" /> Other age groups
                    </span>
                </div>
            )}

            <div className="space-y-4">
                {days.map((group) => (
                    <div key={group.day}>
                        <div className="flex items-center gap-2.5 mb-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-rr-medium-blue">{fullDay(group.day)}</span>
                            <span className="flex-1 h-px bg-white/10" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {group.items.map((s) => {
                                const eligible = !filtering || s.band === eligibleBand;
                                const left = eligible && spotsLeftFor ? spotsLeftFor(s.id) : null;
                                const full = left != null && left <= 0;
                                const selected = selectedId === s.id;
                                const clickable = filtering && eligible && !full && typeof onPick === 'function';

                                let box;
                                if (filtering && !eligible) {
                                    box = 'bg-white/[0.02] border-white/[0.06] opacity-40 grayscale';
                                } else if (selected) {
                                    box = 'bg-rr-pink border-rr-pink text-white shadow-lg shadow-rr-pink/30';
                                } else if (filtering && eligible) {
                                    box = full
                                        ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                                        : 'bg-rr-pink/10 border-rr-pink/70 ring-1 ring-rr-pink/40 hover:bg-rr-pink/20 hover:border-rr-pink cursor-pointer';
                                } else {
                                    box = 'bg-white/[0.04] border-white/[0.12]';
                                }

                                const Tag = clickable ? 'button' : 'div';
                                return (
                                    <Tag
                                        key={s.id}
                                        {...(clickable
                                            ? { type: 'button', onClick: () => onPick(s), 'data-testid': `slot-${s.id}` }
                                            : {})}
                                        className={`relative text-left rounded-xl border px-2.5 py-2.5 transition-all duration-200 ${box}`}
                                    >
                                        <div className={`text-[13px] font-bold tracking-tight leading-none ${selected || eligible ? 'text-white' : 'text-white/40'}`}>
                                            {fmtTime(s.startTime, s.endTime)}
                                        </div>
                                        <div className={`mt-1.5 inline-block text-[9.5px] font-black uppercase tracking-wide rounded px-1.5 py-0.5 ${selected ? 'bg-white/25 text-white' : 'bg-white/10 text-white/55'}`}>
                                            {fmtAge(s.band)}
                                        </div>
                                        {filtering && eligible && left != null && (
                                            <div className={`mt-1.5 text-[9px] font-black uppercase tracking-widest ${full ? 'text-white/40' : left <= 3 ? 'text-rr-pink' : 'text-green-400'}`}>
                                                {full ? 'Full' : `${left} left`}
                                            </div>
                                        )}
                                        {selected && (
                                            <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white" strokeWidth={3} />
                                        )}
                                    </Tag>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

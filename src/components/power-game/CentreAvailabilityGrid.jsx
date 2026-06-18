import React from 'react';
import { Check } from 'lucide-react';
import { SQUADS } from '../../lib/booking/squads';

// Compact availability grid for ONE centre — every squad shown as a small box:
// DAY · TIME · AGE BAND, nothing more. Used in two modes:
//   • browse (no eligibleBand)  → all boxes neutral, informational.
//   • funnel (eligibleBand set)  → the applicant's age band LIGHTS UP and is
//     selectable; every other band DIMS OUT and is non-interactive.
// Single source of truth: src/lib/booking/squads.ts (SQUADS). No times live here.

const enDash = '–';
const shortDay = (d) => (d || '').slice(0, 3);
const fmtBand = (b) => String(b).replace('-', enDash); // "12-14" → "12–14"
// "5:30pm"+"7:30pm" → "5:30–7:30pm" · drop the start meridiem when it matches the end.
const fmtTime = (start, end) => {
    const sM = (String(start).match(/am|pm/i) || [''])[0];
    const eM = (String(end).match(/am|pm/i) || [''])[0];
    const s = sM && eM && sM.toLowerCase() === eM.toLowerCase() ? String(start).replace(/am|pm/i, '') : start;
    return `${s}${enDash}${end}`;
};

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

    return (
        <div className={className}>
            {filtering && (
                <div className="flex items-center gap-4 mb-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="inline-flex items-center gap-1.5 text-rr-pink">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rr-pink" /> Your squad ({fmtBand(eligibleBand)})
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-white/35">
                        <span className="w-2.5 h-2.5 rounded-sm bg-white/15" /> Other age groups
                    </span>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {squads.map((s) => {
                    const eligible = !filtering || s.band === eligibleBand;
                    const left = eligible && spotsLeftFor ? spotsLeftFor(s.id) : null;
                    const full = left != null && left <= 0;
                    const selected = selectedId === s.id;
                    const clickable = filtering && eligible && !full && typeof onPick === 'function';

                    // Visual state
                    let box;
                    if (filtering && !eligible) {
                        box = 'bg-white/[0.02] border-white/[0.06] opacity-40 grayscale'; // dimmed
                    } else if (selected) {
                        box = 'bg-rr-pink border-rr-pink text-white shadow-lg shadow-rr-pink/30';
                    } else if (filtering && eligible) {
                        box = full
                            ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                            : 'bg-rr-pink/10 border-rr-pink/70 ring-1 ring-rr-pink/40 hover:bg-rr-pink/20 hover:border-rr-pink cursor-pointer';
                    } else {
                        box = 'bg-white/[0.04] border-white/[0.12]'; // neutral / browse
                    }

                    const Tag = clickable ? 'button' : 'div';
                    return (
                        <Tag
                            key={s.id}
                            {...(clickable
                                ? { type: 'button', onClick: () => onPick(s), 'data-testid': `slot-${s.id}` }
                                : {})}
                            className={`relative text-left rounded-xl border px-2.5 py-2 transition-all duration-200 ${box}`}
                        >
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${selected ? 'text-white' : eligible ? 'text-rr-pink' : 'text-white/40'}`}>
                                    {shortDay(s.day)}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-wider rounded px-1.5 py-0.5 ${selected ? 'bg-white/25 text-white' : 'bg-white/10 text-white/60'}`}>
                                    {fmtBand(s.band)}
                                </span>
                            </div>
                            <div className={`text-[13px] font-bold tracking-tight leading-none ${selected || eligible ? 'text-white' : 'text-white/40'}`}>
                                {fmtTime(s.startTime, s.endTime)}
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
    );
}

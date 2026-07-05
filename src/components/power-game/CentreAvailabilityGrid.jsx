import React from 'react';
import { Check } from 'lucide-react';
import { SQUADS, sessionWindow } from '../../lib/booking/squads';

// Availability for ONE centre — OPEN SESSIONS grouped BY DAY, each a small box
// with its TIME (and spots-left when in picker mode). No age bands: any 12–26
// player may pick any session. Two modes:
//   • browse (no onPick)   → boxes are neutral, informational.
//   • picker (onPick set)   → every session is selectable; full ones disable.
// Single source of truth: src/lib/booking/squads.ts (SQUADS). No times live here.

const enDash = '–';
const DAY_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const fullDay = (d) => DAY_FULL[(d || '').slice(0, 3)] || d;
// "5:30pm"+"7:30pm" → "5:30–7:30pm" · drop the start meridiem when it matches the end.
const fmtTime = (start, end) => {
    const sM = (String(start).match(/am|pm/i) || [''])[0];
    const eM = (String(end).match(/am|pm/i) || [''])[0];
    const s = sM && eM && sM.toLowerCase() === eM.toLowerCase() ? String(start).replace(/am|pm/i, '') : start;
    return `${s}${enDash}${end}`;
};

// Group a centre's sessions by day, preserving sortOrder (day-then-time).
function groupByDay(sessions) {
    const groups = [];
    for (const s of sessions) {
        let g = groups.find((x) => x.day === s.day);
        if (!g) { g = { day: s.day, items: [] }; groups.push(g); }
        g.items.push(s);
    }
    return groups;
}

export default function CentreAvailabilityGrid({
    centreSlug,
    selectedId = null,
    onPick = null,
    spotsLeftFor = null,
    className = '',
}) {
    const sessions = SQUADS
        .filter((s) => s.centre === centreSlug)
        .sort((a, b) => a.sortOrder - b.sortOrder);

    if (sessions.length === 0) {
        return (
            <div className="text-sm font-bold text-white/40 uppercase tracking-wide py-2">
                Days &amp; times to be confirmed
            </div>
        );
    }

    const picker = typeof onPick === 'function';
    const days = groupByDay(sessions);

    return (
        <div className={className}>
            <div className="space-y-4">
                {days.map((group) => (
                    <div key={group.day}>
                        <div className="flex items-center gap-2.5 mb-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-rr-medium-blue">{fullDay(group.day)}</span>
                            {sessionWindow(group.day) && (
                                <span className="text-[10px] font-bold text-white/40 tracking-wide whitespace-nowrap">{sessionWindow(group.day).start} – {sessionWindow(group.day).end} · 8 wks</span>
                            )}
                            <span className="flex-1 h-px bg-white/10" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {group.items.map((s) => {
                                const left = spotsLeftFor ? spotsLeftFor(s.id) : null;
                                const full = left != null && left <= 0;
                                const selected = selectedId === s.id;
                                const clickable = picker && !full;

                                let box;
                                if (selected) {
                                    box = 'bg-rr-pink border-rr-pink text-white shadow-lg shadow-rr-pink/30';
                                } else if (picker) {
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
                                        <div className="text-[13px] font-bold tracking-tight leading-none text-white">
                                            {fmtTime(s.startTime, s.endTime)}
                                        </div>
                                        {picker && full && (
                                            <div className="mt-1.5 text-[9px] font-black uppercase tracking-widest text-white/40">
                                                Full
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

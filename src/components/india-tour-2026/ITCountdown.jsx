import React, { useEffect, useState } from 'react';
import { REGISTRATIONS_CLOSE_AT, TOUR_STATUS } from './itCopy';

// Seven-day clock on the India Tour registrations. Reads the single deadline in
// itCopy.js, ticks every second, and swaps to a plain "closed" message once it
// passes rather than sitting on 00:00:00 or counting into negatives.
//
// The deadline is an absolute instant with a +10:00 offset, so the same moment is
// shown wherever the viewer is — a family in Perth or Dubai sees the real time
// remaining, not a figure skewed by their own clock.

const useTimeLeft = (deadlineIso) => {
    const deadline = new Date(deadlineIso).getTime();
    const compute = () => Math.max(0, deadline - Date.now());
    const [ms, setMs] = useState(compute);

    useEffect(() => {
        // Re-sync on mount and then tick. Also recompute when the tab regains
        // focus, since background tabs throttle timers and can drift.
        setMs(compute());
        const id = setInterval(() => setMs(compute()), 1000);
        const onFocus = () => setMs(compute());
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onFocus);
        return () => {
            clearInterval(id);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onFocus);
        };
    }, [deadlineIso]);

    const total = Math.floor(ms / 1000);
    return {
        expired: ms <= 0,
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
    };
};

const pad = (n) => String(n).padStart(2, '0');

const ITCountdown = ({ copy }) => {
    const c = copy.hero;
    const t = useTimeLeft(REGISTRATIONS_CLOSE_AT);

    if (TOUR_STATUS === 'closed' || t.expired) {
        return (
            <div className="border border-white/20 rounded-2xl px-5 py-4">
                <p className="text-sm font-black text-white uppercase tracking-wide">{c.countdownClosed}</p>
                <p className="text-sm text-white/70 font-medium leading-relaxed mt-2">{c.countdownClosedNote}</p>
            </div>
        );
    }

    const cells = [
        { v: t.days, label: c.countdownUnits.days, padded: false },
        { v: t.hours, label: c.countdownUnits.hours, padded: true },
        { v: t.minutes, label: c.countdownUnits.minutes, padded: true },
        { v: t.seconds, label: c.countdownUnits.seconds, padded: true },
    ];

    return (
        <div>
            <p className="text-[11px] font-bold text-rr-pink uppercase tracking-[0.25em]">
                {c.countdownLabel}
            </p>
            <div className="flex items-start gap-1.5 mt-2 max-w-[230px]" role="timer" aria-live="off">
                {cells.map((cell, i) => (
                    <React.Fragment key={cell.label}>
                        {i > 0 && (
                            <span className="text-xl md:text-3xl font-black text-white/30 leading-none pt-0.5">:</span>
                        )}
                        <span className="flex flex-col items-center min-w-[38px] md:min-w-[46px]">
                            <span className="text-2xl md:text-3xl font-black text-white leading-none tabular-nums">
                                {cell.padded ? pad(cell.v) : cell.v}
                            </span>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                                {cell.label}
                            </span>
                        </span>
                    </React.Fragment>
                ))}
            </div>
            <p className="text-sm text-white/70 font-medium leading-relaxed mt-3 max-w-md">
                {c.countdownNote}
            </p>
        </div>
    );
};

export default ITCountdown;

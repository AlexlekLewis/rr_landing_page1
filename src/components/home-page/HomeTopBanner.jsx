import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// The full-width banner directly under the nav on the home page — the single
// loudest slot on the site. It promotes ONE thing at a time, and that thing has
// to be currently open. Was the School Holiday Camp until 26 Sep 2026, when the
// open age trial took the slot as a dated special event (Alex).
// If what it points at closes, change it or delete it the same day.
// REVIEW 6 OCT 2026 — the day after the last session. It must not outlive it.
//
// WHAT THIS BANNER HAS TO SAY, because for many visitors it is the only line
// they read (Alex, 26 Sep 2026):
//   1. it is a trial for the PERFORMANCE SQUADS, not a stand-alone event
//   2. it is for OPEN AGE players, 16 to 25
//   3. it runs at BOTH CENTRES — Mickleham and Cranbourne North
//   4. Sid is at the CRANBOURNE NORTH session. He is not scheduled at Mickleham,
//      so no line here may read as him being at both.
//
// The glow pulses to catch the eye, in the Royals' original gold (Alex asked
// for it by name on 26 Sep 2026). NOTE: the brand spec in reference material
// says "no gold anywhere" because gold belongs to another sub-brand — this
// banner is Alex's deliberate exception, not a precedent for other pages.
// The status light is green and flashes. Both stop for anyone who asks for
// reduced motion, the same rule the What's On ticker follows.
const HomeTopBanner = () => {
    return (
        <div className="pt-20 md:pt-28 bg-rr-dark">
            <style>{`
              @keyframes rrEventGlow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.0), inset 0 0 0 0 rgba(255,255,255,0.0); }
                50%      { box-shadow: 0 0 34px 7px rgba(212,175,55,0.62), inset 0 0 26px 0 rgba(255,255,255,0.12); }
              }
              @keyframes rrEventDot {
                0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 9px 2px rgba(34,197,94,0.95); }
                50%      { opacity: 0.4; transform: scale(0.72); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
              }
              .rr-event-glow { animation: rrEventGlow 2.6s ease-in-out infinite; }
              .rr-event-dot  { animation: rrEventDot 1.3s ease-in-out infinite; }
              @media (prefers-reduced-motion: reduce) {
                .rr-event-glow, .rr-event-dot { animation: none !important; }
              }
            `}</style>

            <div className="rr-event-glow relative w-full bg-gradient-to-r from-rr-blue via-rr-blue to-rr-pink text-white px-3 sm:px-4 py-2.5 sm:py-3.5">
                <div className="max-w-6xl mx-auto flex items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 flex-wrap text-center">
                    <span className="inline-flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px] sm:text-xs bg-white/15 rounded-full px-2.5 py-0.5 sm:py-1">
                        <span className="rr-event-dot w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                        Special Event
                    </span>

                    {/* What it is, and who it is for. */}
                    <span className="font-black uppercase tracking-wide text-[13px] sm:text-base leading-tight">
                        Performance Squads <span className="text-white/70">·</span>{' '}
                        <span className="text-rr-pink">Open Age Trial</span>{' '}
                        <span className="text-white/70">·</span> Ages 16 to 25
                    </span>

                    <Link
                        to="/performance-squads-open-trial"
                        className="group inline-flex items-center gap-2 bg-white text-rr-pink hover:bg-rr-dark hover:text-white font-black uppercase tracking-widest text-[13px] sm:text-base px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md transition-all duration-300 hover:shadow-[0_0_22px_rgba(255,255,255,0.35)]"
                    >
                        Book Your Place
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* Both centres, each with its own date, then Sid against his own
                    session. Second row so the first row stays readable on a phone. */}
                <div className="max-w-6xl mx-auto mt-1 flex items-center justify-center gap-x-2.5 gap-y-0.5 flex-wrap text-center leading-snug">
                    <span className="font-bold uppercase tracking-wide text-[10px] sm:text-xs">
                        Both centres — Mickleham Mon 5 Oct <span className="text-white/60">·</span> Cranbourne North Sun 4 Oct
                    </span>
                    <span className="font-medium text-[10px] sm:text-xs text-white/80">
                        Sid Lahiri, Rajasthan Royals Performance Coach, at the Cranbourne North session
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HomeTopBanner;

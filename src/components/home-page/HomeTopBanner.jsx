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
// TWO THINGS THIS BANNER HAS TO SAY, because it is the only line many visitors
// read: who the trial is open for (16 to 25), and that Sid is at the CRANBOURNE
// NORTH session, not both. He is not scheduled at Mickleham.
const HomeTopBanner = () => {
    return (
        <div className="pt-20 md:pt-28 bg-rr-dark">
            <div className="w-full bg-gradient-to-r from-rr-blue via-rr-blue to-rr-pink text-white px-4 py-3 flex items-center justify-center gap-x-4 gap-y-1.5 flex-wrap text-center">
                <span className="font-black uppercase tracking-widest text-[11px] sm:text-xs bg-white/15 rounded-full px-2.5 py-0.5">
                    Special Event
                </span>
                <span className="font-bold uppercase tracking-wide text-xs sm:text-sm">
                    <span className="text-rr-pink">Open Age T20 Trial</span> · Ages 16 to 25 · Sun 4 &amp; Mon 5 Oct
                </span>
                <span className="w-full sm:w-auto font-medium normal-case text-[11px] sm:text-xs text-white/85">
                    Sid Lahiri, Rajasthan Royals Performance Coach, is at the Cranbourne North session
                </span>
                <Link
                    to="/performance-squads-open-trial"
                    className="group inline-flex items-center gap-2 bg-white text-rr-pink hover:bg-rr-dark hover:text-white font-black uppercase tracking-widest text-sm sm:text-base px-6 py-2.5 rounded-full shadow-md transition-all duration-300 hover:shadow-[0_0_22px_rgba(255,255,255,0.35)]"
                >
                    Book Your Place
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </div>
    );
};

export default HomeTopBanner;

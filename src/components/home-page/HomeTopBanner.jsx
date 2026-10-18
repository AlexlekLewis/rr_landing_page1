import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BANNER, LP_JR_DAY_ROUTE, lpJrDayOpen } from '../lower-plenty-junior-royals-day/lpJrDayPromo';
import usePlaces, { placesLine } from '../lower-plenty-junior-royals-day/usePlaces';

// The full-width banner directly under the nav on the home page — the single
// loudest slot on the site. It promotes ONE thing at a time, and that thing has
// to be currently open. History: the School Holiday Camp until 26 Sep 2026, then
// the open age trial and Sid's junior sessions (finished 4–5 Oct, banner off
// 16 Oct). Since 19 Oct 2026 (Alex): Junior Royals are coming to Lower Plenty,
// as the home page's special event.
//
// It switches itself off when registrations close (Fri 23 Oct 2026, 9:00pm —
// lpJrDayOpen), leaving only the spacer that keeps the What's On ticker clear
// of the fixed nav. REVIEW 26 OCT 2026: point it at the next event, or leave
// the spacer and delete the rest.
//
// For many visitors this is the only line they read, so it says what it is,
// who it's for, when and where, what it costs and when registrations close.
// The places count comes from the database (counts only), so it is never stale.
//
// The glow is the brand pink (the gold on the trial banner was Alex's one-off
// exception). Both animations stop for anyone who asks for reduced motion.

const Spacer = () => <div className="pt-20 md:pt-28 bg-rr-dark" />;

const LowerPlentyBanner = () => {
    const places = usePlaces();
    // "60 places" until someone books, then "54 of 60 places left".
    const placesText = places.left == null ? null
        : places.state === 'open' && places.left >= places.capacity ? `${places.capacity} places`
        : placesLine(places);

    return (
        <div className="pt-20 md:pt-28 bg-rr-dark">
            <style>{`
              @keyframes rrEventGlow {
                0%, 100% { box-shadow: 0 0 0 0 rgba(225,31,143,0.0), inset 0 0 0 0 rgba(255,255,255,0.0); }
                50%      { box-shadow: 0 0 34px 7px rgba(225,31,143,0.55), inset 0 0 26px 0 rgba(255,255,255,0.12); }
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
                        {BANNER.title} <span className="text-white/70">·</span> {BANNER.ages}
                    </span>

                    <Link
                        to={LP_JR_DAY_ROUTE}
                        className="group inline-flex items-center gap-2 bg-white text-rr-pink hover:bg-rr-dark hover:text-white font-black uppercase tracking-widest text-[13px] sm:text-base px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md transition-all duration-300 hover:shadow-[0_0_22px_rgba(255,255,255,0.35)]"
                    >
                        {BANNER.cta}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* When, where, cost — then the deadline and the real places count. */}
                <div className="max-w-6xl mx-auto mt-1 text-center leading-snug">
                    <p className="font-medium text-[11px] sm:text-sm text-white/90">{BANNER.what}</p>
                    <p className="font-black uppercase tracking-wide text-[10px] sm:text-xs mt-0.5">
                        {BANNER.closes}
                        {placesText && <span className="text-white/80"> · {placesText}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};

const HomeTopBanner = () => (lpJrDayOpen() ? <LowerPlentyBanner /> : <Spacer />);

export default HomeTopBanner;

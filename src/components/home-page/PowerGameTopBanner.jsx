import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PowerGameTopBanner = () => {
    return (
        <div className="pt-20 md:pt-28 bg-rr-dark">
            <div className="w-full bg-gradient-to-r from-rr-blue via-rr-blue to-rr-pink text-white px-4 py-3 flex items-center justify-center gap-x-4 gap-y-2 flex-wrap text-center">
                <span className="font-black uppercase tracking-widest text-[11px] sm:text-xs bg-white/15 rounded-full px-2.5 py-0.5">
                    Enrolling Now
                </span>
                <span className="font-bold uppercase tracking-wide text-xs sm:text-sm">
                    Elite Academy — Power <span className="text-rr-pink">Pre-Season</span> Program · Melbourne, July 2026
                </span>
                <Link
                    to="/elite-royals"
                    className="group inline-flex items-center gap-2 bg-white text-rr-pink hover:bg-rr-dark hover:text-white font-black uppercase tracking-widest text-sm sm:text-base px-6 py-2.5 rounded-full shadow-md transition-all duration-300 hover:shadow-[0_0_22px_rgba(255,255,255,0.35)]"
                >
                    Secure Your Place
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </div>
    );
};

export default PowerGameTopBanner;

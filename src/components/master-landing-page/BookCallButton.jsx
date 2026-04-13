import React from 'react';

// Compact inline button — dark section variant
export const BookCallButtonDark = () => (
    <a
        href="https://www.rramelbourne.com"
        className="group border-2 border-white/20 hover:border-rr-blue/60 text-white hover:bg-rr-blue/10 font-bold uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto"
    >
        Stay Connected
    </a>
);

// Compact inline button — light section variant
export const BookCallButtonLight = () => (
    <a
        href="https://www.rramelbourne.com"
        className="group border-2 border-rr-dark/15 hover:border-rr-blue/50 text-rr-dark hover:bg-rr-blue/5 font-bold uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto"
    >
        Stay Connected
    </a>
);

export default BookCallButtonDark;

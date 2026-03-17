import React from 'react';

const CALENDLY_URL = 'https://calendly.com/whitewall-bys/royalsmelbourne-meeting';

// Compact inline button — dark section variant
export const BookCallButtonDark = () => (
    <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group border-2 border-white/20 hover:border-rr-blue/60 text-white hover:bg-rr-blue/10 font-bold uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto"
    >
        <svg className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Book Pre-Application Call
    </a>
);

// Compact inline button — light section variant
export const BookCallButtonLight = () => (
    <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group border-2 border-rr-dark/15 hover:border-rr-blue/50 text-rr-dark hover:bg-rr-blue/5 font-bold uppercase tracking-wide sm:tracking-widest px-5 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 justify-center w-full sm:w-auto"
    >
        <svg className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Book Pre-Application Call
    </a>
);

export default BookCallButtonDark;

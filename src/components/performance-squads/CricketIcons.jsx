import React from 'react';

// Lightweight cricket-themed line icons, drawn to match lucide's conventions:
// 24×24 viewBox, currentColor stroke, 2px weight, round caps/joins. Drop-in
// replacements for the generic icons that were reading as stock/AI clip-art.
const base = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

// Cricket bat — for "compete / squad place".
export const BatIcon = ({ className }) => (
    <svg {...base} className={className} aria-hidden="true">
        {/* handle */}
        <path d="M19 5 L15.5 8.5" />
        {/* blade */}
        <path d="M15 8 L8 15 a2 2 0 0 1-2.8 0 l-0.2-0.2 a2 2 0 0 1 0-2.8 L12 5 a2 2 0 0 1 2.8 0 l0.2 0.2 a2 2 0 0 1 0 2.8 Z" />
        {/* ball */}
        <circle cx="18.5" cy="17.5" r="2.5" />
    </svg>
);

// Ball with seam — for "the short format / T20".
export const BallIcon = ({ className }) => (
    <svg {...base} className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.2 4.4 A8.5 8.5 0 0 0 8.2 19.6" />
        <path d="M6.4 7 h3.6 M6.4 12 h3.6 M6.4 17 h3.6" />
    </svg>
);

// Stumps + bails — for "trial / assessment".
export const StumpsIcon = ({ className }) => (
    <svg {...base} className={className} aria-hidden="true">
        <path d="M7 7 V20 M12 7 V20 M17 7 V20" />
        <path d="M5.5 7 h5 M13.5 7 h5" />
    </svg>
);

// Bat + ball crossed — for "who this is for / built for T20".
export const BatBallIcon = ({ className }) => (
    <svg {...base} className={className} aria-hidden="true">
        <path d="M19.5 4.5 L16 8" />
        <path d="M15.5 7.5 L9 14 a1.9 1.9 0 0 1-2.7 0 l-0.3-0.3 a1.9 1.9 0 0 1 0-2.7 L12.5 4.5 a1.9 1.9 0 0 1 2.7 0 l0.3 0.3 a1.9 1.9 0 0 1 0 2.7 Z" />
        <circle cx="6" cy="18" r="2.6" />
    </svg>
);

// Target / batting pads-style shield — for "selection standard".
export const SelectionIcon = ({ className }) => (
    <svg {...base} className={className} aria-hidden="true">
        <path d="M12 2.5 L19.5 5.5 V11 c0 4.6-3.2 7.9-7.5 10.5 C7.7 18.9 4.5 15.6 4.5 11 V5.5 Z" />
        <path d="M8.5 11.5 L11 14 L15.5 9" />
    </svg>
);

// Globe with a seam, tying "global" back to the ball — for the opportunity list.
export const GlobalBallIcon = ({ className }) => (
    <svg {...base} className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12 h18 M12 3 a13 13 0 0 1 0 18 a13 13 0 0 1 0-18" />
    </svg>
);

// Trophy variant kept for standings/compete accents.
export const TrophyIcon = ({ className }) => (
    <svg {...base} className={className} aria-hidden="true">
        <path d="M7 4 h10 v4 a5 5 0 0 1-10 0 Z" />
        <path d="M7 6 H4.5 a2.5 2.5 0 0 0 2.5 2.5 M17 6 h2.5 a2.5 2.5 0 0 1-2.5 2.5" />
        <path d="M12 13 v3 M9 20 h6 M10 20 c0-2 4-2 4 0" />
    </svg>
);

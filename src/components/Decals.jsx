import React from 'react';

export const TopRightCurve = ({ className = "" }) => (
    <div className={`absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none ${className}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 right-0 w-[80%] md:w-[50%] h-[80%] md:h-[100%] fill-rr-pink/5">
            <path d="M100 0 L100 100 C 50 100 20 50 50 0 Z" />
        </svg>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 right-0 w-[70%] md:w-[45%] h-[70%] md:h-[90%] fill-rr-blue/5">
            <path d="M100 0 L100 100 C 60 100 30 50 60 0 Z" />
        </svg>
    </div>
);

export const BottomLeftDiagonal = ({ className = "" }) => (
    <div className={`absolute bottom-0 left-0 w-full h-full overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-tr from-rr-blue/5 via-transparent to-transparent transform -skew-y-6 origin-bottom-left" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rr-pink/10 rounded-full blur-3xl" />
    </div>
);

export const RoyalsWave = ({ className = "" }) => (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none opacity-30 ${className}`}>
        <svg className="absolute w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#004685" fillOpacity="0.03" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
    </div>
);

export const SideSlash = ({ className = "" }) => (
    <div className={`absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-rr-pink/5 to-transparent skew-x-12 origin-bottom pointer-events-none ${className}`} />
);

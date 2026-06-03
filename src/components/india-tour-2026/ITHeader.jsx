import React from 'react';
import { Link } from 'react-router-dom';

// Minimal, focused header for the private India Tour page — the site's pink
// brand bar + inverted logo, without the public site's program nav.
const ITHeader = () => (
    <header className="sticky top-0 left-0 right-0 z-50">
        <div className="relative shadow-lg" style={{ background: 'var(--color-rr-pink)' }}>
            <div className="container mx-auto px-6 flex justify-between items-center py-2">
                <Link to="/" className="flex items-center">
                    <img
                        src="/assets/MELBOURNE_OFFICIAL.png"
                        alt="Rajasthan Royals Academy Melbourne"
                        className="h-14 md:h-20 w-auto object-contain brightness-0 invert"
                    />
                </Link>
                <span className="hidden sm:inline-flex items-center gap-2 text-white/90 text-[11px] font-bold uppercase tracking-[0.25em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    By Invitation
                </span>
            </div>
        </div>
    </header>
);

export default ITHeader;

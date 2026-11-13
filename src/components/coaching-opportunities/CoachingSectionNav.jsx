import React, { useEffect, useRef, useState } from 'react';

// Sticky section bar for /careers. Every label refers to coaching (Andy, 13 Nov 2026:
// "make sure that a person navigates the different sections on the page with
// reference to coaching"). It sits under the fixed pink Navbar and highlights the
// section currently on screen; on a phone it scrolls sideways.
export const COACHING_SECTIONS = [
    { id: 'what-it-is', label: 'What Coaching Here Is' },
    { id: 'benefits', label: 'Coaching Benefits' },
    { id: 'coaches-at-work', label: 'Coaches in Action' },
    { id: 'how-to-join', label: 'How to Become a Coach' },
];

const CoachingSectionNav = () => {
    const [active, setActive] = useState(null);
    const barRef = useRef(null);

    useEffect(() => {
        const ids = [...COACHING_SECTIONS.map((s) => s.id), 'application-form'];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    // Keep the active chip in view on narrow screens.
    useEffect(() => {
        if (!active || !barRef.current) return;
        const chip = barRef.current.querySelector(`[data-section="${active}"]`);
        if (!chip) return;
        const bar = barRef.current;
        const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2;
        bar.scrollTo({ left, behavior: 'smooth' });
    }, [active]);

    const go = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav
            aria-label="Coaching page sections"
            className="sticky top-[80px] md:top-[112px] z-40 bg-rr-dark border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 md:px-6">
                <div
                    ref={barRef}
                    className="flex-1 flex items-center gap-1 md:gap-1.5 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {COACHING_SECTIONS.map((s) => {
                        const isActive = active === s.id;
                        return (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                data-section={s.id}
                                onClick={(e) => { e.preventDefault(); go(s.id); }}
                                aria-current={isActive ? 'true' : undefined}
                                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                                    isActive ? 'bg-white text-rr-dark' : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {s.label}
                            </a>
                        );
                    })}
                </div>
                <a
                    href="#application-form"
                    onClick={(e) => { e.preventDefault(); go('application-form'); }}
                    className={`shrink-0 hidden sm:inline-flex rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-white transition-colors ${
                        active === 'application-form' ? 'bg-rr-light-pink' : 'bg-rr-pink hover:bg-rr-light-pink'
                    }`}
                >
                    Apply to Coach
                </a>
            </div>
        </nav>
    );
};

export default CoachingSectionNav;

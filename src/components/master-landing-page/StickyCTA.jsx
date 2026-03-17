import React, { useState, useEffect } from 'react';

const StickyCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show after scrolling down 500px, but hide if near the bottom footer
            if (window.pageYOffset > 500 && window.pageYOffset < (document.body.scrollHeight - window.innerHeight - 800)) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToForm = () => {
        document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full p-3 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 md:hidden flex gap-2 justify-center transform transition-transform duration-300">
            <button
                onClick={scrollToForm}
                className="flex-1 max-w-[200px] bg-rr-pink text-white font-bold uppercase tracking-wide px-4 py-3.5 rounded-full shadow-lg active:scale-95 transition-transform text-xs"
            >
                Secure Your Place
            </button>
            <a
                href="https://calendly.com/whitewall-bys/royalsmelbourne-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 max-w-[200px] border-2 border-rr-dark/15 text-rr-dark font-bold uppercase tracking-wide px-4 py-3.5 rounded-full active:scale-95 transition-transform text-xs text-center flex items-center justify-center gap-1.5"
            >
                <svg className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Book a Call
            </a>
        </div>
    );
};

export default StickyCTA;

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
                href="https://www.rramelbourne.com"
                className="flex-1 max-w-[200px] border-2 border-rr-dark/15 text-rr-dark font-bold uppercase tracking-wide px-4 py-3.5 rounded-full active:scale-95 transition-transform text-xs text-center flex items-center justify-center gap-1.5"
            >
                Visit Website
            </a>
        </div>
    );
};

export default StickyCTA;

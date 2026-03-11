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
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 md:hidden flex justify-center transform transition-transform duration-300">
            <button
                onClick={scrollToForm}
                className="w-full max-w-sm bg-rr-pink text-white font-bold uppercase tracking-wide sm:tracking-widest px-6 py-4 rounded-full shadow-lg active:scale-95 transition-transform text-xs sm:text-sm"
            >
                Secure Your Place
            </button>
        </div>
    );
};

export default StickyCTA;

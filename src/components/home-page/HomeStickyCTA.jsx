import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeStickyCTA = ({ onRegisterClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggle = () => {
            const scrolled = window.pageYOffset;
            const total = document.body.scrollHeight - window.innerHeight;
            setIsVisible(scrolled > 400 && scrolled < total - 600);
        };
        window.addEventListener('scroll', toggle, { passive: true });
        return () => window.removeEventListener('scroll', toggle);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 w-full z-50 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
                >
                    <div className="max-w-sm mx-auto flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-rr-charcoal uppercase tracking-widest truncate">Ready to play the Royals Way?</p>
                        </div>
                        <button
                            onClick={onRegisterClick}
                            data-cta="sticky-register"
                            className="shrink-0 bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.4)] text-xs"
                        >
                            Register Now
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HomeStickyCTA;

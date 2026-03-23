import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickyCTA = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const hero = document.getElementById('hero');
            const form = document.getElementById('registration-form');

            if (!hero || !form) return;

            const heroHeight = hero.offsetHeight;
            const formBottom = form.getBoundingClientRect().bottom + window.scrollY;
            const scrollY = window.scrollY;

            const pastHero = scrollY > heroHeight * 0.6;
            const beforeFormEnd = scrollY < formBottom - window.innerHeight;

            setVisible(pastHero && beforeFormEnd);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-rr-dark border-t border-white/10 px-4 py-4"
                >
                    <button
                        onClick={scrollToForm}
                        className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3 text-sm"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Register Now — Female Empowerment Program
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyCTA;

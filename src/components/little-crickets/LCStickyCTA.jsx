import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LCStickyCTA = () => {
    const [visible, setVisible] = useState(false);
    const [pastForm, setPastForm] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = window.innerHeight * 0.6;
            const formEl = document.getElementById('registration-form');
            const formBottom = formEl ? formEl.getBoundingClientRect().bottom + window.scrollY : Infinity;

            setVisible(window.scrollY > heroHeight);
            setPastForm(window.scrollY + window.innerHeight > formBottom);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {visible && !pastForm && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3 bg-gradient-to-t from-rr-dark/95 to-transparent"
                >
                    <div className="max-w-lg mx-auto">
                        <button
                            onClick={scrollToForm}
                            className="w-full bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3 text-sm"
                        >
                            Register Now — Term 2, 2026
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LCStickyCTA;

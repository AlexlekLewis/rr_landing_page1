import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const handleNavClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { label: 'PROGRAM OVERVIEW', id: 'program-overview' },
        { label: 'COACHING & LEADERSHIP', id: 'coaches' },
        { label: 'FAQ', id: 'faq' },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300">
                {/* Background layer */}
                <div
                    className="absolute inset-0 shadow-lg"
                    style={{
                        background: 'var(--color-rr-pink)',
                    }}
                />

                <div className="relative container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img
                            src="/assets/MELBOURNE_OFFICIAL.png"
                            alt="Rajasthan Royals Academy Melbourne"
                            className="h-16 md:h-24 w-auto object-contain brightness-0 invert"
                        />
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
                                className="text-sm font-semibold text-white hover:text-pink-300 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Button onClick={scrollToForm} variant="blue" className="text-sm px-6 py-2">
                            APPLY NOW
                        </Button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-white p-2 focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[55] pt-20"
                        style={{
                            background: 'linear-gradient(180deg, var(--color-rr-navy) 0%, var(--color-rr-blue) 50%, var(--color-rr-pink) 100%)',
                        }}
                    >
                        <div className="flex flex-col items-center space-y-8 pt-12">
                            {navLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
                                    className="text-2xl font-bold text-white hover:text-pink-300 transition-colors tracking-wider"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Button onClick={scrollToForm} variant="blue" className="text-lg px-10 py-4 mt-4">
                                APPLY NOW
                            </Button>
                            <a
                                href="https://www.rajasthanroyals.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-white/60 hover:text-white transition-colors mt-8"
                            >
                                rajasthanroyals.com
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const handleNavClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { label: 'THE PROGRAM', id: 'program' },
        { label: 'COACHES', id: 'coaches' },
        { label: 'FAQ', id: 'faq' },
    ];

    return (
        <>
            {/* Pink accent bar */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-1" style={{ background: '#E11F8F' }} />

            <nav
                className={`fixed top-1 left-0 right-0 z-50 transition-[padding] duration-500 ${scrolled
                    ? 'py-4'
                    : 'py-6'
                    }`}
            >
                {/* Background layer with opacity fade-in */}
                <div
                    className="absolute inset-0 shadow-lg"
                    style={{
                        background: '#E11F8F',
                        opacity: 1,
                        pointerEvents: 'none',
                    }}
                />

                <div className="relative container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#E11F8F] px-4 pt-1 pb-2 rounded-b-xl -mt-4 shadow-lg">
                            <img
                                src="/assets/MELBOURNE.png"
                                alt="Rajasthan Royals Academy Melbourne"
                                className="h-24 md:h-32 w-auto object-contain mt-2"
                            />
                        </div>

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
                        <Button onClick={scrollToForm} variant="primary" className="text-sm px-6 py-2">
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
                            background: 'linear-gradient(180deg, #001D48 0%, #1226AA 50%, #E11F8F 100%)',
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
                            <Button onClick={scrollToForm} variant="primary" className="text-lg px-10 py-4 mt-4">
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

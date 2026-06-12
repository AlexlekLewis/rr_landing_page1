import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

const LP1_NAV = [
    { label: 'PROGRAM OVERVIEW', id: 'program-overview' },
    { label: 'COACHING & LEADERSHIP', id: 'coaches' },
    { label: 'FAQ', id: 'faq' },
];

const LP2_NAV = [
    { label: 'THE PROGRAM', id: 'program-at-a-glance' },
    { label: 'PRICING', id: 'pricing' },
];

const LC_NAV = [
    { label: 'PROGRAM', id: 'program-overview' },
    { label: 'COACHES', id: 'coaches' },
    { label: 'LOCATIONS', id: 'locations' },
];

const HOME_NAV = [
    { label: 'About', id: 'about' },
    { label: 'Coaches', id: 'coaches' },
    { label: 'FAQ', id: 'faq' },
];

const PROGRAMS_DROPDOWN = [
    { label: 'Junior Royals Holiday Camps', route: '/junior-royals-holiday', badge: 'Selling Fast', badgeColor: 'bg-orange-500' },
    { label: 'Power Game Program', route: '/PGP2026', badge: 'Enrolling Now', badgeColor: 'bg-rr-pink' },
];

const Navbar = ({ variant = 'lp1', onRegisterClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [programsOpen, setProgramsOpen] = useState(false);
    const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isLP2 = variant === 'lp2';
    const isLP3 = variant === 'lp3';
    const isHoliday = variant === 'holiday';
    const isHome = variant === 'home';
    const isLittleCrickets = variant === 'junior-royals';
    const isShop = variant === 'shop';
    const isPowerGame = variant === 'power-game';

    const navLinks = (isLP3 || isHoliday || isShop || isPowerGame) ? [] : isHome ? HOME_NAV : isLittleCrickets ? LC_NAV : (isLP2 ? LP2_NAV : LP1_NAV);
    const showProgramsDropdown = isHome;
    const showCTA = !isShop && !isPowerGame;
    const showHamburger = !isShop;

    const ctaLabel = isHome ? 'REGISTER NOW' : (isLP2 || isHoliday || isLittleCrickets) ? 'SECURE YOUR PLACE NOW' : 'REGISTER INTEREST';
    const ctaTarget = isLP2 ? 'checkout' : (isHoliday || isLittleCrickets) ? 'registration-form' : 'apply-form';

    const scrollToForm = () => {
        if (isHome && onRegisterClick) {
            onRegisterClick();
            setMobileMenuOpen(false);
            return;
        }
        document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const handleNavClick = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProgramsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300">
                <div
                    className="absolute inset-0 shadow-lg"
                    style={{ background: 'var(--color-rr-pink)' }}
                />

                <div className="relative container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-4">
                        <img
                            src="/assets/MELBOURNE_OFFICIAL.png"
                            alt="Rajasthan Royals Academy Melbourne"
                            className="h-16 md:h-24 w-auto object-contain brightness-0 invert"
                        />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Programs dropdown */}
                        {showProgramsDropdown && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProgramsOpen(o => !o)}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-pink-200 transition-colors"
                                >
                                    PROGRAMS
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${programsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {programsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]"
                                        >
                                            {PROGRAMS_DROPDOWN.map((p, i) => {
                                                const borderClass = i < PROGRAMS_DROPDOWN.length - 1 ? 'border-b border-slate-100' : '';
                                                if (p.comingSoon) {
                                                    return (
                                                        <div
                                                            key={p.label}
                                                            className={`flex items-center justify-between px-5 py-4 ${borderClass}`}
                                                        >
                                                            <p className="font-black text-rr-dark text-sm uppercase tracking-wide">{p.label}</p>
                                                            <span className="shrink-0 px-2.5 py-1 rounded-full bg-rr-pink/10 text-rr-pink text-[10px] font-bold uppercase tracking-wider">
                                                                {p.badge}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <Link
                                                        key={p.route}
                                                        to={p.route}
                                                        onClick={() => setProgramsOpen(false)}
                                                        className={`flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group ${borderClass}`}
                                                    >
                                                        <div>
                                                            <p className="font-black text-rr-dark text-sm uppercase tracking-wide">{p.label}</p>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <span className={`w-1.5 h-1.5 rounded-full ${p.badgeColor}`} />
                                                                <span className="text-xs font-bold text-rr-charcoal/60 uppercase tracking-wide">{p.badge}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronDown className="w-4 h-4 text-rr-charcoal/30 -rotate-90 group-hover:text-rr-pink group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                );
                                            })}
                                            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                                                <Link
                                                    to="/#programs"
                                                    onClick={() => { setProgramsOpen(false); setTimeout(() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                                                    className="text-xs font-bold text-rr-pink hover:text-rr-light-pink uppercase tracking-widest transition-colors"
                                                >
                                                    View All Programs →
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
                                className="text-sm font-semibold text-white hover:text-pink-300 transition-colors"
                            >
                                {link.label.toUpperCase()}
                            </a>
                        ))}

                        {/* Shop link */}
                        <Link
                            to="/academy-shop"
                            className="flex items-center gap-1.5 text-sm font-black text-white bg-rr-blue hover:bg-rr-dark px-4 py-1.5 rounded-full transition-all duration-200 uppercase tracking-widest"
                        >
                            🛒 Shop
                        </Link>

                        {!isLP3 && showCTA && (
                            <Button onClick={scrollToForm} variant={isHome ? "white" : "blue"} className="text-sm px-6 py-2">
                                {ctaLabel}
                            </Button>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    {!isLP3 && showHamburger && (
                        <button
                            className="md:hidden text-white p-2 focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[55] pt-20 overflow-y-auto"
                        style={{
                            background: 'linear-gradient(180deg, var(--color-rr-navy) 0%, var(--color-rr-blue) 50%, var(--color-rr-pink) 100%)',
                        }}
                    >
                        <div className="flex flex-col items-center space-y-6 pt-10 px-6">
                            {/* Programs section in mobile */}
                            {showProgramsDropdown && (
                                <div className="w-full max-w-xs">
                                    <button
                                        onClick={() => setMobileProgramsOpen(o => !o)}
                                        className="flex items-center justify-center gap-2 text-2xl font-bold text-white tracking-wider w-full"
                                    >
                                        PROGRAMS
                                        <ChevronDown className={`w-5 h-5 transition-transform ${mobileProgramsOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {mobileProgramsOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden mt-4 space-y-3"
                                            >
                                                {PROGRAMS_DROPDOWN.map(p => (
                                                    p.comingSoon ? (
                                                        <div
                                                            key={p.label}
                                                            className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-4 py-3"
                                                        >
                                                            <p className="text-white font-bold text-sm uppercase tracking-wide">{p.label}</p>
                                                            <span className="shrink-0 px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-wider">
                                                                {p.badge}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <Link
                                                            key={p.route}
                                                            to={p.route}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl px-4 py-3"
                                                        >
                                                            <div>
                                                                <p className="text-white font-bold text-sm uppercase tracking-wide">{p.label}</p>
                                                                <p className="text-white/60 text-xs font-medium">{p.badge}</p>
                                                            </div>
                                                            <ChevronDown className="w-4 h-4 text-white/40 -rotate-90" />
                                                        </Link>
                                                    )
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
                                    className="text-2xl font-bold text-white hover:text-pink-300 transition-colors tracking-wider"
                                >
                                    {link.label.toUpperCase()}
                                </a>
                            ))}

                            {/* Shop link */}
                            <Link
                                to="/academy-shop"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-black text-rr-pink tracking-wider"
                            >
                                🛒 SHOP
                            </Link>

                            {showCTA && (
                                <Button onClick={scrollToForm} variant="blue" className="text-lg px-10 py-4 mt-4">
                                    {ctaLabel}
                                </Button>
                            )}

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

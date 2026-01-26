import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/assets/rr_academy_logo.png" alt="Royals Academy" className="h-12 md:h-16 w-auto object-contain" />
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#program" className={`text-sm font-semibold hover:text-pink-600 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}>THE PROGRAM</a>
                    <a href="#coaches" className={`text-sm font-semibold hover:text-pink-600 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}>COACHES</a>
                    <a href="#faq" className={`text-sm font-semibold hover:text-pink-600 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}>FAQ</a>
                    <Button onClick={scrollToForm} variant={'primary'} className="text-sm px-6 py-2">
                        APPLY NOW
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

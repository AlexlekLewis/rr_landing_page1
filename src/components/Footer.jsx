import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer
            className="text-white py-6 relative overflow-hidden"
            style={{
                background: 'linear-gradient(90deg, #E11F8F 0%, #001D48 100%)'
            }}
        >
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <img
                        src="/assets/MELBOURNE_OFFICIAL.png"
                        alt="Rajasthan Royals Academy Melbourne"
                        className="h-12 w-auto object-contain brightness-0 invert"
                    />
                    <div className="flex gap-6 text-xs text-white/80">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <span className="hidden md:inline">|</span>
                        <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
                    </div>
                </div>

                <p className="text-xs text-white/60 text-center md:text-right">
                    &copy; {new Date().getFullYear()} Rajasthan Royals Academy Australia. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

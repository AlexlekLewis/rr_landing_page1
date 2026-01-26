import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <h4 className="text-white font-bold text-lg mb-2">ROYALS ACADEMY</h4>
                    <p className="text-sm">Australia Elite Program</p>
                </div>
                <div className="text-sm">
                    &copy; {new Date().getFullYear()} Rajasthan Royals Academy Australia. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-rr-dark text-slate-400 py-12 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <img
                            src="/assets/rra-melbourne-logo.png"
                            alt="Rajasthan Royals Academy Melbourne"
                            className="h-12 w-auto object-contain"
                        />
                        <div>
                            <h4 className="text-white font-bold text-lg">ROYALS ACADEMY</h4>
                            <p className="text-sm">Melbourne Elite Program</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm mb-2">
                            Part of the{' '}
                            <a
                                href="https://www.rajasthanroyals.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-rr-pink hover:underline font-semibold transition-colors hover:text-rf-pink"
                            >
                                Rajasthan Royals
                            </a>
                            {' '}global cricket network
                        </p>
                        <p className="text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} Rajasthan Royals Academy Melbourne. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

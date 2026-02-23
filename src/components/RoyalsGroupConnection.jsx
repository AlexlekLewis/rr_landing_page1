import React from 'react';
import { motion } from 'framer-motion';

const RoyalsGroupConnection = () => {
    return (
        <div className="text-center">
            <p className="text-rr-pink uppercase text-xs tracking-[0.25em] font-bold mb-6">Part of the Royals Group</p>

            {/* Mobile: 2x2 circular logo grid */}
            <div className="grid grid-cols-2 gap-6 md:hidden px-6">
                {[
                    { href: "https://www.rajasthanroyals.com", logo: "/assets/rajasthan-royals-logo.png", name: "Rajasthan Royals", league: "IPL" },
                    { href: "https://www.paarlroyals.com", logo: "/assets/paarl-royals-logo.png", name: "Paarl Royals", league: "SA20" },
                    { href: "https://www.barbadosroyals.com", logo: "/assets/barbados-royals-logo.png", name: "Barbados Royals", league: "CPL" },
                    { href: "https://www.rajasthanroyals.com/cricket-academies", logo: "/assets/Basic logo.png", name: "RR Academy", league: "GLOBAL" },
                ].map((item) => (
                    <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-md rounded-xl px-3 py-3 hover:border-rr-pink/40 transition-colors duration-300 h-full">
                            <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-lg object-contain shrink-0" />
                            <div className="text-left min-w-0">
                                <span className="text-[10px] sm:text-xs font-bold text-rr-dark block leading-tight truncate">{item.name}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-rr-pink tracking-wider">{item.league}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Desktop: horizontal pill layout */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-5">
                {/* Rajasthan Royals */}
                <a href="https://www.rajasthanroyals.com" target="_blank" rel="noopener noreferrer">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                    >
                        <img src="/assets/rajasthan-royals-logo.png" alt="Rajasthan Royals" className="w-10 h-10 rounded-lg object-cover" />
                        <div className="text-left">
                            <span className="text-sm font-bold text-rr-dark block leading-tight">Rajasthan Royals</span>
                            <span className="text-xs font-bold text-rr-pink tracking-wider">IPL</span>
                        </div>
                    </motion.div>
                </a>

                {/* Paarl Royals */}
                <a href="https://www.paarlroyals.com" target="_blank" rel="noopener noreferrer">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                    >
                        <img src="/assets/paarl-royals-logo.png" alt="Paarl Royals" className="w-10 h-10 rounded-lg object-cover" />
                        <div className="text-left">
                            <span className="text-sm font-bold text-rr-dark block leading-tight">Paarl Royals</span>
                            <span className="text-xs font-bold text-rr-pink tracking-wider">SA20</span>
                        </div>
                    </motion.div>
                </a>

                {/* Barbados Royals */}
                <a href="https://www.barbadosroyals.com" target="_blank" rel="noopener noreferrer">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                    >
                        <img src="/assets/barbados-royals-logo.png" alt="Barbados Royals" className="w-10 h-10 rounded-lg object-cover" />
                        <div className="text-left">
                            <span className="text-sm font-bold text-rr-dark block leading-tight">Barbados Royals</span>
                            <span className="text-xs font-bold text-rr-pink tracking-wider">CPL</span>
                        </div>
                    </motion.div>
                </a>

                {/* RR Academy Global */}
                <a href="https://www.rajasthanroyals.com/cricket-academies" target="_blank" rel="noopener noreferrer">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                    >
                        <img src="/assets/Basic logo.png" alt="RR Academy" className="w-10 h-10 rounded-lg object-contain" />
                        <div className="text-left">
                            <span className="text-sm font-bold text-rr-dark block leading-tight">RR Academy</span>
                            <span className="text-xs font-bold text-rr-pink tracking-wider">GLOBAL</span>
                        </div>
                    </motion.div>
                </a>
            </div>
        </div>
    );
};

export default RoyalsGroupConnection;

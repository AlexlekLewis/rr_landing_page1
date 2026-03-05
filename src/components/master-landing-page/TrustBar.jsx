import React from 'react';
import { motion } from 'framer-motion';

const TrustBar = () => {
    return (
        <section className="bg-white py-6 md:py-8 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">

                    {/* Item 1: Partner Logo */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/assets/rr-logo-blue.png"
                            alt="Rajasthan Royals Logo"
                            className="h-16 md:h-20 w-auto object-contain"
                            onError={(e) => {
                                // Fallback if blue logo doesn't exist, try pink or default
                                e.target.src = "/assets/Logos/RR-Logo-2.png";
                            }}
                        />
                        <div className="h-10 w-px bg-slate-200 hidden md:block mx-2"></div>
                        <p className="text-rr-dark font-semibold text-sm md:text-base leading-tight">
                            Official Academy of the<br />Rajasthan Royals
                        </p>
                    </div>

                    {/* Mobile Divider */}
                    <div className="w-full h-px bg-slate-100 block md:hidden"></div>

                    {/* Item 2: Social Proof Stat */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="text-3xl font-black text-rr-pink tracking-tight leading-none mb-1">
                            35+
                        </span>
                        <span className="text-rr-charcoal font-medium text-sm">
                            Families enrolled for Season 1
                        </span>
                    </div>



                </div>
            </div>
        </section>
    );
};

export default TrustBar;

import React from 'react';
import { motion } from 'framer-motion';

const TrustBar = () => {
    return (
        <section className="bg-white py-6 md:py-8 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-center items-center">
                    {/* Item 1: Partner Logo Only */}
                    <img
                        src="/assets/rr-logo-blue.png"
                        alt="Rajasthan Royals Logo"
                        className="h-16 md:h-20 w-auto object-contain"
                        onError={(e) => {
                            e.target.src = "/assets/Logos/RR-Logo-2.png";
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default TrustBar;

import React from 'react';
import { motion } from 'framer-motion';

const MasterHero = () => {
    const scrollToForm = () => {
        document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-[90vh] w-full flex items-center bg-rr-dark overflow-hidden pt-24 pb-16">

            {/* Background Video / Image Layer */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Background Image */}
                <img
                    src="/assets/sooryavanchi-arms-raised.jpg"
                    alt="RR Training"
                    className="w-full h-full object-cover object-center opacity-70"
                />

                {/* Brand Gradients overlays per V2 blueprint */}
                <div className="absolute inset-0 bg-gradient-rr opacity-60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-dark-overlay opacity-90"></div>

                {/* Subtle Lion Watermark */}
                <img
                    src="/assets/rr-lion-white.png"
                    alt=""
                    className="absolute inset-0 w-auto h-[120%] -top-[10%] -right-[10%] object-contain opacity-5 pointer-events-none"
                    aria-hidden="true"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
                <div className="max-w-3xl">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <p className="inline-block px-4 py-1.5 rounded-full bg-rr-pink/20 border border-rr-pink/30 text-rr-pink font-bold text-xs tracking-wide uppercase mb-6 shadow-sm">
                            THE FUTURE OF T20 DEVELOPMENT STARTS HERE
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-wide leading-tight drop-shadow-lg">
                            READY TO DOMINATE THE T20 GAME?
                        </h1>
                        <p className="text-xl md:text-2xl text-white shadow-black drop-shadow-md font-semibold mb-4 leading-relaxed">
                            Modern cricket demands more than tradition. We develop explosive skills, sharp thinking and elite habits.
                        </p>
                        <p className="text-base md:text-lg text-white/90 mb-8 font-medium leading-relaxed max-w-2xl drop-shadow-md">
                            Designed and guided by one of the biggest cricket brands on the planet, the Elite program draws on decades of global T20 experience. At Rajasthan Royals Academy, Melbourne, we deliver a one of a kind high performance training focused on developing complete cricketers.
                        </p>
                    </motion.div>



                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                    >
                        <button
                            onClick={scrollToForm}
                            className="bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-colors duration-300 w-full sm:w-auto text-center"
                        >
                            SECURE YOUR CHILD'S SPOT
                        </button>
                        <p className="text-sm text-white/80 font-medium ml-2 sm:ml-4">
                            Join 35+ families already enrolled.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator Arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white opacity-50 hidden md:block"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
            </motion.div>

        </section>
    );
};

export default MasterHero;

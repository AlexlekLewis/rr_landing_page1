import React from 'react';
import { motion } from 'framer-motion';

const MasterHero = () => {
    const scrollToForm = () => {
        document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen w-full flex items-center bg-rr-dark overflow-hidden">

            {/* Background Video / Image Layer */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Background Image Layer - Mobile */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[center_top] md:hidden"
                    style={{
                        backgroundImage: "url('/assets/Hero.jpeg')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/60 to-transparent" />
                </div>

                {/* Background Image Layer - Desktop */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-no-repeat hidden md:block"
                    style={{
                        backgroundImage: "url('/assets/hero-final.jpeg')",
                        backgroundPosition: "center 20%"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-rr-dark via-rr-dark/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-transparent to-transparent" />
                </div>


            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full container mx-auto px-6 h-full flex flex-col justify-center text-left pt-32">
                <div className="max-w-3xl">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-200 mb-6 uppercase tracking-tighter leading-none drop-shadow-2xl">
                            READY TO DOMINATE<br />THE T20 GAME?
                        </h1>
                        <p className="text-xl md:text-2xl text-white shadow-black drop-shadow-md font-semibold mb-4 leading-relaxed mt-4">
                            Modern cricket demands more than tradition. We develop explosive skills, sharp thinking and elite habits.
                        </p>
                        <p className="text-base md:text-lg text-white/90 mb-8 font-medium leading-relaxed max-w-2xl drop-shadow-md">
                            Designed and guided by one of the biggest cricket brands on the planet, the Elite Program draws on decades of global T20 experience. At Rajasthan Royals Academy, Melbourne, we deliver a one of a kind high performance training focused on developing complete cricketers.
                        </p>
                    </motion.div>



                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 items-start pb-16 md:pb-24"
                    >
                        <button
                            onClick={scrollToForm}
                            className="bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-colors duration-300 w-full sm:w-auto text-center"
                        >
                            SECURE YOUR PLACE NOW
                        </button>
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

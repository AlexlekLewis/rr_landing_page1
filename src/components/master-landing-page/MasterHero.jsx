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
                    src="/assets/Hero.jpeg"
                    alt="RR Training"
                    className="w-full h-full object-cover object-[center_top] opacity-70"
                />

                {/* Brand Gradients overlays per V2 blueprint */}
                <div className="absolute inset-0 bg-gradient-rr opacity-60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-dark-overlay opacity-90"></div>


            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
                <div className="max-w-3xl">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
<<<<<<< HEAD
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-200 mb-6 uppercase tracking-tighter leading-none drop-shadow-2xl">
                            READY TO DOMINATE<br />THE T20 GAME?
=======
                        <p className="inline-block px-4 py-1.5 rounded-full bg-rr-pink/20 border border-rr-pink/30 text-rr-pink font-bold text-xs tracking-wide uppercase mb-6 shadow-sm">
                            THE FUTURE OF T20 DEVELOPMENT STARTS HERE
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-200 mb-4 uppercase tracking-tighter leading-none drop-shadow-2xl">
                            READY TO DOMINATE THE T20 GAME?
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)
                        </h1>
                        <p className="text-lg md:text-2xl text-white shadow-black drop-shadow-md font-semibold mb-4 leading-relaxed mt-4">
                            Modern cricket demands more than tradition. We develop explosive skills, sharp thinking and elite habits.
                        </p>
                        <p className="text-sm md:text-lg text-white/50 mb-8 font-medium leading-relaxed max-w-2xl drop-shadow-md">
                            Designed and guided by one of the biggest cricket brands on the planet, the Elite Program draws on decades of global T20 experience. At Rajasthan Royals Academy, Melbourne, the T20 Elite Program delivers a one of a kind performance training environment designed to develop a modern day skill set.
                        </p>
                    </motion.div>



                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
<<<<<<< HEAD
                        className="flex flex-col items-start gap-4 pb-16 md:pb-24"
=======
                        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
>>>>>>> fc99057 (fix: replace custom success page nav with shared Navbar component to match LP1/LP2 header)
                    >
                        {/* Deadline badge */}
                        <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse shrink-0" />
                            <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                                Entry closes 5pm · March 20 — or when full
                            </span>
                        </div>
                        <button
                            onClick={scrollToForm}
                            className="group bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-8 md:px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            SECURE YOUR PLACE NOW
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
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

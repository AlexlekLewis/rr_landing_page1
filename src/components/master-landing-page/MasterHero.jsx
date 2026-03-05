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
                {/* Desktop: Video (Fallback to image if needed) */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center hidden md:block opacity-70"
                >
                    <source src="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Final%20Andy%20%26%20Kumar%20Edit.mov" type="video/mp4" />
                </video>

                {/* Mobile Fallback Image */}
                <img
                    src="/assets/sooryavanchi-arms-raised.jpg"
                    alt="RR Training"
                    className="w-full h-full object-cover object-center block md:hidden opacity-70"
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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-wide leading-tight">
                            MELBOURNE'S ONLY IPL-BACKED T20 PROGRAM
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-8 font-normal leading-relaxed">
                            A 12-week structured program for young cricketers ready to train with purpose. Specialist coaching. Individual performance tracking. A pathway beyond club cricket.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="mb-8"
                    >
                        {/* Urgency Element */}
                        <div className="inline-block bg-rr-dark/60 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 mb-2 shadow-xl">
                            <p className="text-white font-semibold text-sm md:text-base">
                                Season 1 Intake: 40 players per cohort. <span className="text-rr-pink font-black">20</span> spots remaining.
                            </p>
                        </div>
                        <p className="text-xs md:text-sm text-slate-300 ml-2">
                            Applications close March 15th or when spots are filled — whichever comes first.
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

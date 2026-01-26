import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const Hero = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-slate-900">

            {/* Background Image Layer (Right Side) */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
                style={{
                    backgroundImage: "url('/assets/Hero.jpeg')",
                    backgroundPosition: "25% center"
                }}
            >
                <div className="absolute inset-0 bg-black/40 lg:bg-transparent" /> {/* Mobile Overlay */}
            </div>

            {/* Angled Dark Cutout Layer (Left Side) - Reduced to ~30-40% width */}
            <div
                className="absolute inset-y-0 left-0 w-full lg:w-[40%] bg-slate-900 z-10 hidden lg:block shadow-2xl"
                style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
            />

            {/* Mobile Dark Gradient (Alternative to Cutout) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent lg:hidden z-10" />

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center text-left">
                <div className="max-w-2xl lg:max-w-md xl:max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]"
                    >
                        BECOME A <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                            T20 STAR
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-sm"
                    >
                        Traditional methods aren’t cutting it for the modern day game.
                        The Royals Academy brings a whole new perspective.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button onClick={scrollToForm} variant="gold" className="text-base px-8 py-3 shadow-yellow-500/20">
                            START JOURNEY
                        </Button>
                        <Button
                            onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
                            variant="secondary"
                            className="text-base px-8 py-3 border-slate-700 text-white hover:bg-white/10 hover:text-white"
                        >
                            LEARN MORE
                        </Button>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default Hero;

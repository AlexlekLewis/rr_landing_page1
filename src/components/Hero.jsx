import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { TopRightCurve } from './Decals';

const Hero = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative min-h-screen w-full flex items-center bg-white overflow-hidden">
            {/* Decal Background */}
            <TopRightCurve className="z-0" />

            {/* Background Image Layer - Mobile */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[center_top] md:hidden z-0 opacity-20"
                style={{
                    backgroundImage: "url('/assets/Hero.jpeg')",
                }}
            />

            {/* Background Image Layer - Desktop */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-no-repeat hidden md:block z-0"
                style={{
                    backgroundImage: "url('/assets/hero-final.jpeg')",
                    backgroundPosition: "center 20%",
                    maskImage: "linear-gradient(to right, transparent, black 40%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 40%)"
                }}
            />
            {/* White Gradient Fade for Desktop integration */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 hidden md:block" />


            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center text-left pt-32">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-rr-dark mb-6 tracking-tighter leading-none drop-shadow-sm">
                            READY TO DOMINATE<br />THE T20 GAME?
                        </h1>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-700 mb-4 leading-snug normal-case tracking-normal">
                            Modern cricket demands more than tradition.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">We develop explosive skills, sharp thinking and elite habits.</span>
                        </h2>
                        <p className="text-sm md:text-base text-rr-pink font-bold tracking-[0.15em] uppercase mb-8">
                            The future of T20 development starts here.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-10 max-w-2xl"
                    >
                        <p>
                            Designed and managed by one of the <strong className="text-rr-dark">biggest cricket brands on the planet</strong>, the Elite program draws on decades of global T20 experience.
                        </p>
                        <p>
                            We provide opportunities previously not available in Australia. The Royals know how to uncover T20 talent like nobody else.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 pb-16 md:pb-24"
                    >
                        <Button onClick={scrollToForm} variant="primary" className="text-base px-8 py-4 text-lg shadow-xl shadow-rr-pink/20">
                            APPLY TO SECURE YOUR PLACE
                        </Button>
                        <Button
                            onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
                            variant="secondary"
                            className="text-base px-8 py-4 text-lg bg-white border-slate-200 text-rr-dark hover:bg-slate-50"
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

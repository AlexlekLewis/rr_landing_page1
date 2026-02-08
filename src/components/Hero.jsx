import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const Hero = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative min-h-screen w-full flex items-center bg-rr-dark overflow-hidden">

            {/* Background Image Layer - using Vaibhav image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-center"
                style={{
                    backgroundImage: "url('/assets/sooryavanchi-arms-raised.jpg')",
                    backgroundPosition: "center 20%" // Adjust to focus on face/upper body if needed
                }}
            >
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-transparent to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center text-left pt-20">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Program badge */}
                        <div className="inline-block mb-6">
                            <span
                                className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] text-white py-2 px-4 rounded-full border border-white/30 backdrop-blur-sm"
                                style={{ background: 'linear-gradient(135deg, rgba(18,38,170,0.6) 0%, rgba(225,31,143,0.6) 100%)' }}
                            >
                                RAJASTHAN ROYALS ACADEMY MELBOURNE — ELITE PROGRAM
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 tracking-tighter leading-none">
                            READY TO OWN<br />THE T20 GAME?
                        </h1>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mb-4 leading-snug normal-case tracking-normal">
                            Modern cricket demands more than tradition.<br className="hidden md:block" />
                            <span className="text-rr-pink">We develop explosive skills, sharp thinking and elite habits.</span>
                        </h2>
                        <p className="text-sm md:text-base text-slate-400 font-bold tracking-[0.15em] uppercase mb-8">
                            The future of T20 development starts here.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="space-y-6 text-lg md:text-xl text-slate-300 leading-relaxed font-light mb-10 max-w-2xl"
                    >
                        <p>
                            Designed and managed by one of the <strong className="text-white">biggest cricket brands on the planet</strong>, the Elite program draws on decades of global T20 experience.
                        </p>
                        <p>
                            We provide opportunities previously not available in Australia. The Royals know how to uncover T20 talent like nobody else.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button onClick={scrollToForm} variant="gold" className="text-base px-8 py-4 text-lg">
                            APPLY TO SECURE YOUR PLACE
                        </Button>
                        <Button
                            onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
                            variant="secondary"
                            className="text-base px-8 py-4 text-lg"
                        >
                            LEARN MORE
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Image caption */}
            <div className="absolute bottom-6 right-6 z-20 text-right hidden md:block">
                <p className="text-xs text-white/40 font-medium tracking-wider">VAIBHAV SOORYAVANSHI</p>
                <p className="text-[10px] text-white/25 tracking-wider">Royals Academy Star</p>
            </div>

        </div>
    );
};

export default Hero;

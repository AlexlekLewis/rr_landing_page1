import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const Hero = () => {
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-slate-900">

            {/* Background Image Layer */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
                style={{
                    backgroundImage: "url('/assets/lhuan-pretorius.jpg')",
                    backgroundPosition: "center top"
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center text-left">
                <div className="max-w-3xl lg:max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]"
                    >
                        WANT TO STAR IN <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-ra-blue">
                            THE T20 GAME?
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-gray-200 mb-10 font-light leading-relaxed max-w-2xl"
                    >
                        Traditional methods aren't cutting it. Whether you're aiming for club success or professional pathways, we provide the elite skills and mindset to help you dominate the modern game.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button onClick={scrollToForm} variant="primary" className="text-base px-8 py-3">
                            START JOURNEY
                        </Button>
                        <Button
                            onClick={() => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' })}
                            variant="secondary"
                            className="text-base px-8 py-3"
                        >
                            LEARN MORE
                        </Button>
                    </motion.div>
                </div>
            </div>

        </div >
    );
};

export default Hero;

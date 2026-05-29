import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Subtle radial glow for depth */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(circle at 50% 40%, rgba(225,31,143,0.18) 0%, rgba(0,0,0,0) 60%)',
                }}
            />

            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
                <motion.img
                    src="/assets/powergame/power-game-logo.png"
                    alt="The Power Game Program"
                    className="w-full max-w-md md:max-w-2xl lg:max-w-3xl h-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />

                <motion.p
                    className="mt-10 text-base md:text-xl text-white/85 font-medium max-w-2xl uppercase tracking-widest"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                >
                    Elite power development across batting, bowling &amp; fielding
                </motion.p>

                <motion.div
                    className="mt-16 flex flex-col items-center text-white/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1, ease: 'easeOut' }}
                >
                    <span className="text-xs font-bold uppercase tracking-widest mb-2">
                        Discover the Program
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;

import React from 'react';
import { motion } from 'framer-motion';

const ComingSoonSplash = () => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #001D48 0%, #000C1F 50%, #0A0A14 100%)' }}
        >
            {/* Ambient glow behind logo */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #E11F8F 0%, #1226AA 60%, transparent 100%)' }}
            />

            {/* Subtle grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 md:mb-14"
                >
                    <img
                        src="/assets/Logo_White_Transparent.png"
                        alt="Rajasthan Royals Academy Melbourne"
                        className="w-48 md:w-64 lg:w-72 drop-shadow-[0_0_60px_rgba(225,31,143,0.3)]"
                    />
                </motion.div>

                {/* Accent line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                    className="w-24 md:w-32 h-[2px] mb-8 md:mb-10 origin-center"
                    style={{ background: 'linear-gradient(90deg, transparent, #E11F8F, transparent)' }}
                />

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-6 md:mb-8"
                    style={{
                        background: 'linear-gradient(180deg, #FFFFFF 30%, #94A3B8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    THE ROYALS<br />
                    ARE COMING<br />
                    TO MELBOURNE
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
                    className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-white/40"
                >
                    Coming Soon
                </motion.p>

                {/* Bottom accent line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
                    className="w-16 md:w-20 h-[1px] mt-8 md:mt-10 origin-center"
                    style={{ background: 'linear-gradient(90deg, transparent, #E11F8F, transparent)' }}
                />
            </div>

            {/* Bottom branding strip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute bottom-8 left-0 right-0 text-center"
            >
                <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/20 font-medium">
                    Rajasthan Royals Academy Melbourne
                </p>
            </motion.div>
        </div>
    );
};

export default ComingSoonSplash;

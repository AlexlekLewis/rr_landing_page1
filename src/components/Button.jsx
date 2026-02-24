import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
    const baseStyle = "px-8 py-3 rounded-full font-bold text-lg transition-transform transform shadow-lg";
    const variants = {
        primary: "bg-rr-pink text-white hover:bg-rr-light-pink shadow-rr-pink/30",
        secondary: "bg-transparent text-white border-2 border-white hover:bg-white/10",
        gold: "bg-rr-blue text-white hover:bg-rr-admiral-blue shadow-rr-blue/30", // Mapped old gold/royal blue to new RR blue
        blue: "bg-rr-blue text-white hover:bg-rr-admiral-blue shadow-rr-blue/30",
        white: "bg-white text-rr-blue hover:bg-slate-100 shadow-xl"
    };

    return (
        <motion.button
            whileTap={disabled ? {} : { scale: 0.95 }}
            whileHover={disabled ? {} : { scale: 1.05 }}
            className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

export default Button;

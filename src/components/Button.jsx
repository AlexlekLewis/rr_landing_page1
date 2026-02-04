import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', variant = 'primary' }) => {
    const baseStyle = "px-8 py-3 rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-lg";
    const variants = {
        primary: "bg-rr-pink text-white hover:bg-rf-pink shadow-rr-pink/30",
        secondary: "bg-transparent text-white border-2 border-white hover:bg-white/10",
        gold: "bg-ra-blue text-white hover:bg-rr-blue shadow-ra-blue/30",
        white: "bg-white text-ra-blue hover:bg-slate-100 shadow-xl"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }
            }
            className={`${baseStyle} ${variants[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.button >
    );
};

export default Button;

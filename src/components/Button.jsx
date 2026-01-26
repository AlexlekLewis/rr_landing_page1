import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', variant = 'primary' }) => {
    const baseStyle = "px-8 py-3 rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-lg";
    const variants = {
        primary: "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-pink-500/50",
        secondary: "bg-white text-purple-900 border-2 border-purple-900 hover:bg-purple-50",
        gold: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-yellow-500/50"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
};

export default Button;

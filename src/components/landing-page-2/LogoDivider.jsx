import React from 'react';
import { motion } from 'framer-motion';

const LogoDivider = () => {
    return (
        <div className="relative py-8 flex items-center justify-center overflow-hidden bg-transparent">
            {/* Gradient lines */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-rr-pink/30 to-transparent" />
            <div className="absolute left-0 right-0 top-1/2 translate-y-0.5 h-px bg-gradient-to-r from-transparent via-rr-blue/20 to-transparent" />

            {/* Logo circle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-16 h-16 rounded-full bg-rr-dark border border-white/10 flex items-center justify-center shadow-lg shadow-rr-pink/10"
            >
                <img
                    src="/assets/MELBOURNE.ai.png"
                    alt="RRA Melbourne"
                    className="w-11 h-11 object-contain drop-shadow-md"
                />
            </motion.div>
        </div>
    );
};

export default LogoDivider;

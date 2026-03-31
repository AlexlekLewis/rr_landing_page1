import React from 'react';
import { motion } from 'framer-motion';

const ActionImage = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative w-full overflow-hidden"
    >
        <img
            src="/assets/holiday-clinic-action.jpg"
            alt="Development Opportunities for Young Cricketers"
            className="w-full h-64 md:h-96 object-cover object-center"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 md:px-10 md:py-8">
            <p className="text-white font-black text-lg md:text-2xl uppercase tracking-wide leading-tight">
                Development Opportunities for Young Cricketers
            </p>
            <div className="w-12 h-0.5 bg-rr-pink mt-2" />
        </div>
    </motion.div>
);

export default ActionImage;

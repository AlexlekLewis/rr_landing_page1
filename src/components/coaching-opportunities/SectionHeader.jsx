import React from 'react';
import { motion } from 'framer-motion';

// One heading style for every /careers section: eyebrow, two-tone title, short intro.
const SectionHeader = ({ eyebrow, title, accent, intro, dark = false, center = false }) => (
    <div className={`max-w-3xl mb-10 md:mb-12 ${center ? 'mx-auto text-center' : ''}`}>
        <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-4"
        >
            {eyebrow}
        </motion.p>
        <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className={`text-3xl md:text-5xl font-black uppercase tracking-tight leading-none ${dark ? 'text-white' : 'text-rr-dark'} ${intro ? 'mb-6' : ''}`}
        >
            {title} <span className="text-rr-pink">{accent}</span>
        </motion.h2>
        {intro && (
            <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
                className={`text-base md:text-lg font-medium leading-relaxed ${dark ? 'text-white/70' : 'text-rr-charcoal'}`}
            >
                {intro}
            </motion.p>
        )}
    </div>
);

export default SectionHeader;

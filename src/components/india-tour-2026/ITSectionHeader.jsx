import React from 'react';
import { motion } from 'framer-motion';

// Eyebrow + two-tone heading + lead, the same on every /tours section.
const ITSectionHeader = ({ eyebrow, heading, accent, lead, dark = false, center = false }) => (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
        >
            {eyebrow}
        </motion.p>
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className={`text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-5 ${dark ? 'text-white' : 'text-rr-dark'}`}
        >
            {heading} <span className="text-rr-pink">{accent}</span>
        </motion.h2>
        {lead && (
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`text-base md:text-lg font-medium leading-relaxed ${dark ? 'text-white/75' : 'text-rr-charcoal'}`}
            >
                {lead}
            </motion.p>
        )}
    </div>
);

export default ITSectionHeader;

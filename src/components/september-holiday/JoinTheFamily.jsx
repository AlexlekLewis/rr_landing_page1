import React from 'react';
import { motion } from 'framer-motion';

const JoinTheFamily = () => (
    <section className="relative overflow-hidden">
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
        >
            <img
                src="/assets/join-the-royals-family.png"
                alt="Join the Royals Family"
                className="w-full h-auto block"
            />
        </motion.div>
    </section>
);

export default JoinTheFamily;

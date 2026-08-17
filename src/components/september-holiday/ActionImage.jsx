import React from 'react';
import { motion } from 'framer-motion';

const ActionImage = () => (
    <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-slate-100"
            >
                <img
                    src="/assets/holiday-clinic-action.jpg"
                    alt="Development Opportunities for Young Cricketers"
                    className="w-full h-auto block"
                />
                {/* Caption bar */}
                <div className="bg-rr-dark px-6 py-4 flex items-center gap-4">
                    <div className="w-1 h-8 bg-rr-pink rounded-full shrink-0" />
                    <p className="text-white font-black text-sm md:text-base uppercase tracking-widest">
                        Development Opportunities for Young Cricketers
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

export default ActionImage;

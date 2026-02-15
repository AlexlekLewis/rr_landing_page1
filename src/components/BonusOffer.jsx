import React from 'react';
import { motion } from 'framer-motion';

import { RoyalsWave } from './Decals';

const BonusOffer = () => {
    return (
        <section className="py-20 relative overflow-hidden bg-white">
            <RoyalsWave />

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block bg-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-slate-200 text-rr-pink shadow-sm">
                        Defining Success
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-rr-dark">
                        YOUR PATHWAY STARTS HERE
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-4 mb-10">
                        <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed">
                            The Elite Program is designed to improve your game, help you excel, and get noticed on your current pathway.
                        </p>
                        <p className="text-base text-slate-600 leading-relaxed font-medium">
                            Every participant gains early visibility within the Royals global scouting network.
                            Our coaches will work with you to develop the skills, mindset and match awareness
                            needed to perform at higher levels — whether that's at club, representative or professional level.
                        </p>
                        <p className="text-base text-slate-600 leading-relaxed font-medium">
                            For those who consistently meet the benchmarks set by the Royals Group, opportunities
                            arise to display your skills in front of franchise decision makers in{' '}
                            <strong className="text-rr-dark">Australia, India, Barbados or South Africa</strong>.
                        </p>
                        <p className="text-base text-slate-600 leading-relaxed font-medium">
                            This is about momentum, development and genuine opportunity.
                        </p>
                    </div>

                </motion.div>
            </div>
        </section >
    );
};

export default BonusOffer;

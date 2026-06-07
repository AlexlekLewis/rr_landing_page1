import React from 'react';
import { motion } from 'framer-motion';

const OverviewSection = () => {
    return (
        <section className="bg-white pt-24 md:pt-32 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            The Program
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-8">
                        WHAT IS THE <span className="text-rr-pink">POWER GAME</span>?
                    </h2>

                    <div className="space-y-5 text-base md:text-lg text-rr-charcoal font-medium leading-relaxed">
                        <p>
                            Following the huge success of the Rajasthan Royals intensive 12-week T20 Elite Program, the Power Game Program is the next iteration of the elite program.
                        </p>
                        <p>
                            The Power Game Program is an elite training environment built around one idea: developing the ability to generate power on demand, across every discipline and format of the modern game.
                        </p>
                        <p>
                            From 360 power hitting, full spectrum of bowling, and explosive fielding, players learn how to reach for power when the situation demands it — backed by biomechanics, data, and the coaching methodology that drives the Royals Way.
                        </p>
                        <p className="text-rr-dark font-semibold">
                            This is where like-skilled, like-motivated players train together to find a way to win from anywhere. Perfect for preparing for your best season yet, securing your place in a representative squad, moving up through the grades at your club or putting yourself on the radar of selectors.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OverviewSection;

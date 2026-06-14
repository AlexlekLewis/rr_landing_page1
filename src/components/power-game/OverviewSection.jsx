import React from 'react';
import { motion } from 'framer-motion';

const OverviewSection = () => {
    return (
        <section className="bg-rr-page pt-24 md:pt-32 pb-8 md:pb-12">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <img
                        src="/assets/powergame/power-game-logo-transparent.png"
                        alt="The Power Game"
                        className="h-16 md:h-24 w-auto mx-auto mb-7"
                    />
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            The Program
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-8">
                        WHAT IS THE <span className="text-rr-pink">POWER GAME</span> PROGRAM?
                    </h2>

                    <div className="space-y-5 text-base md:text-lg text-white/80 font-medium leading-relaxed">
                        <p>
                            Following the success of the Rajasthan Royals Academy's intensive 12-week T20 Elite Program, the Power Game Program is its evolution — an elite environment built around one idea: generating power on demand, across every discipline and format of the modern game.
                        </p>
                        <p>
                            Through 360 power hitting, the full spectrum of bowling, and explosive fielding, players learn to reach for power when the situation demands it — backed by biomechanics, data, and the coaching methodology that drives the Royals Way.
                        </p>
                        <p className="text-white font-semibold">
                            This is where like-skilled, like-motivated players train together to win from anywhere — preparing for your best season yet, earning a representative squad spot, moving up the grades, or landing on selectors' radars. It begins with the 8-week <span className="text-rr-pink">Power Pre-Season</span>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OverviewSection;

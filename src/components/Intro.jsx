import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Intro = () => {
    return (
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Video Placeholder */}
                <div className="flex justify-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full max-w-4xl aspect-video bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl flex items-center justify-center group cursor-pointer relative overflow-hidden"
                    >
                        <img src="/assets/academy_vision.png" alt="Academy Vision" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/40 to-royal-blue/40" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 z-10">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                        <p className="absolute bottom-6 left-6 text-sm font-medium tracking-wider text-slate-400">WATCH: THE ACADEMY VISION</p>
                    </motion.div>
                </div>

                {/* Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <blockquote className="text-2xl md:text-4xl font-serif italic leading-relaxed text-gray-300">
                        "You’ve heard from Sid. A man at the cutting edge. T20 has already changed the game."
                    </blockquote>
                    <cite className="block mt-8 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 not-italic">
                        — Siddhartha Lahiri, Royals Group Head of International Player Development
                    </cite>

                    <div className="mt-12 space-y-6 text-lg font-light text-gray-300 md:text-xl max-w-3xl mx-auto leading-relaxed">
                        <p>
                            The World’s best T20 players have become global stars making millions a year, and those who are getting noticed and selected at representative levels and at the highest grades in the club system, are those that have a T20 skill set that they can adapt to situations within all formats of the game.
                        </p>
                        <p>
                            So, if the game has already changed, are you prepared to do what it takes to put your name in the picture to be scouted and selected at higher levels?
                        </p>
                        <p className="font-bold text-white">
                            Here’s your chance. Apply to secure your place NOW.
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Intro;

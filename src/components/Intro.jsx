import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const Intro = () => {
    return (
        <section className="py-20 bg-rr-dark text-white relative overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Video Placeholder */}
                <div className="flex justify-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full max-w-4xl aspect-video bg-rr-grey rounded-2xl border border-rr-grey shadow-2xl flex items-center justify-center group cursor-pointer relative overflow-hidden"
                    >
                        <img src="/assets/academy_vision.png" alt="Academy Vision" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-rr-pink/40 to-rr-blue/40" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-rr-pink/20 to-ra-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                    <cite className="block mt-8 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-ra-blue not-italic">
                        — Siddhartha Lahiri, Royals Group Head of International Player Development
                    </cite>

                    <div className="mt-12 space-y-6 text-lg font-light text-gray-300 md:text-xl max-w-3xl mx-auto leading-relaxed">
                        <p>
                            We are delighted to invite you to be part of an exciting new opportunity for aspiring cricketers in Australia, the <strong className="text-white">Rajasthan Royals Academy - Elite Program</strong>, beginning in Melbourne in early April 2026.
                        </p>
                        <p>
                            You have been identified by our scouting network as an emerging young talent and this unique opportunity with one of the world’s biggest and most successful cricket franchises can help take your game to the next level.
                        </p>
                        <p>
                            For the first time, cricketers within Australia will have direct access to developing their T20 skills from within the Rajasthan Royals global organisation and their player development system, helping put you on a pathway to success.
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Intro;

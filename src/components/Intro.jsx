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
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-ra-blue">Invitation to Apply</span>
                    </h2>

                    <div className="mt-12 space-y-6 text-lg font-light text-gray-300 md:text-xl max-w-3xl mx-auto leading-relaxed">
                        <p>
                            We are delighted to invite you to be part of an exciting new opportunity for aspiring cricketers in Melbourne, the <strong className="text-white">Rajasthan Royals Academy - Elite Program</strong>, beginning in early April 2026.
                        </p>
                        <p>
                            You have been identified by our scouting network as an emerging young talent and this unique opportunity with one of the world’s biggest and most successful cricket franchises can help take your game to the next level.
                        </p>
                        <p>
                            For the first time, cricketers within Australia will have direct access to developing their T20 skills from within the Rajasthan Royals global organisation and their player development system, helping put you on a pathway to success.
                        </p>
                    </div>

                    {/* Franchise Strip */}
                    <div className="mt-14">
                        <p className="text-slate-400 uppercase text-xs tracking-[0.25em] font-medium mb-6">Part of the Royals Group</p>
                        <div className="flex flex-wrap items-center justify-center gap-5">
                            {/* Rajasthan Royals */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-colors duration-300"
                            >
                                <img src="/assets/rajasthan-royals-logo.png" alt="Rajasthan Royals" className="w-10 h-10 rounded-lg object-cover" />
                                <div className="text-left">
                                    <span className="text-sm font-semibold text-white block leading-tight">Rajasthan Royals</span>
                                    <span className="text-xs font-bold text-rr-pink tracking-wider">IPL</span>
                                </div>
                            </motion.div>

                            {/* Paarl Royals */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-colors duration-300"
                            >
                                <img src="/assets/paarl-royals-logo.png" alt="Paarl Royals" className="w-10 h-10 rounded-lg object-cover" />
                                <div className="text-left">
                                    <span className="text-sm font-semibold text-white block leading-tight">Paarl Royals</span>
                                    <span className="text-xs font-bold text-rr-pink tracking-wider">SA20</span>
                                </div>
                            </motion.div>

                            {/* Barbados Royals */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-colors duration-300"
                            >
                                <img src="/assets/barbados-royals-logo.png" alt="Barbados Royals" className="w-10 h-10 rounded-lg object-cover" />
                                <div className="text-left">
                                    <span className="text-sm font-semibold text-white block leading-tight">Barbados Royals</span>
                                    <span className="text-xs font-bold text-rr-pink tracking-wider">CPL</span>
                                </div>
                            </motion.div>

                            {/* Royals Academy */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-colors duration-300"
                            >
                                <img src="/assets/rra-australia-logo.png" alt="Royals Academy" className="w-10 h-10 rounded-lg object-contain" />
                                <div className="text-left">
                                    <span className="text-sm font-semibold text-white block leading-tight">Royals Academy</span>
                                    <span className="text-xs font-bold text-rr-pink tracking-wider">AUSTRALIA</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Intro;

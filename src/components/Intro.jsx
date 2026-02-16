import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Button from './Button';
import { RoyalsWave } from './Decals';

const YOUTUBE_VIDEO_ID = 'gqDVw9Idktw';

const Intro = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-white text-rr-dark relative overflow-hidden">
            <RoyalsWave />
            <div className="container mx-auto px-6 relative z-10">

                {/* Video Section */}
                <div className="flex justify-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full max-w-4xl aspect-video bg-white rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden ring-4 ring-slate-50"
                    >
                        {isPlaying ? (
                            <video
                                src="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Landing%20Page%20Full%20Edit%20v1.1.mov"
                                title="Kumar Sangakkara Director of Cricket Rajasthan Royals"
                                className="absolute inset-0 w-full h-full rounded-2xl object-cover"
                                controls
                                autoPlay
                                playsInline
                                preload="metadata"
                                poster={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                            />
                        ) : (
                            <div
                                className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                                onClick={() => setIsPlaying(true)}
                            >
                                <img
                                    src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                                    alt="Academy Vision"
                                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-rr-pink/20 to-rr-blue/20" />
                                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 z-10 shadow-lg">
                                    <Play className="w-8 h-8 text-rr-pink fill-current ml-1" />
                                </div>
                                <p className="absolute bottom-6 left-6 text-sm font-bold tracking-wider text-white drop-shadow-md">KUMAR SANGAKKARA — DIRECTOR OF CRICKET, RAJASTHAN ROYALS</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-rr-dark">
                        INVITATION TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">APPLY</span>
                    </h2>

                    <div className="mt-12 space-y-6 text-lg font-medium text-slate-600 md:text-xl max-w-3xl mx-auto leading-relaxed">
                        <p>
                            We are delighted to invite you to be part of an exciting new opportunity for aspiring cricketers in Melbourne, the <strong className="text-rr-dark">Rajasthan Royals Academy - Elite Program</strong>, beginning in early April 2026.
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
                        <p className="text-rr-pink uppercase text-xs tracking-[0.25em] font-bold mb-6">Part of the Royals Group</p>

                        {/* Mobile: 2x2 circular logo grid */}
                        <div className="grid grid-cols-2 gap-6 md:hidden">
                            {[
                                { href: "https://www.rajasthanroyals.com", logo: "/assets/rajasthan-royals-logo.png", name: "Rajasthan Royals", league: "IPL" },
                                { href: "https://www.paarlroyals.com", logo: "/assets/paarl-royals-logo.png", name: "Paarl Royals", league: "SA20" },
                                { href: "https://www.barbadosroyals.com", logo: "/assets/barbados-royals-logo.png", name: "Barbados Royals", league: "CPL" },
                                { href: "https://rajasthanroyalsacademy.com", logo: "/assets/Basic logo.png", name: "RR Academy", league: "GLOBAL" },
                            ].map((item) => (
                                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer">
                                    <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-md rounded-xl px-3 py-3 hover:border-rr-pink/40 transition-colors duration-300 h-full">
                                        <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-lg object-contain shrink-0" />
                                        <div className="text-left min-w-0">
                                            <span className="text-[10px] sm:text-xs font-bold text-rr-dark block leading-tight truncate">{item.name}</span>
                                            <span className="text-[9px] sm:text-[10px] font-bold text-rr-pink tracking-wider">{item.league}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Desktop: horizontal pill layout */}
                        <div className="hidden md:flex flex-wrap items-center justify-center gap-5">
                            {/* Rajasthan Royals */}
                            <a href="https://www.rajasthanroyals.com" target="_blank" rel="noopener noreferrer">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                                >
                                    <img src="/assets/rajasthan-royals-logo.png" alt="Rajasthan Royals" className="w-10 h-10 rounded-lg object-cover" />
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-rr-dark block leading-tight">Rajasthan Royals</span>
                                        <span className="text-xs font-bold text-rr-pink tracking-wider">IPL</span>
                                    </div>
                                </motion.div>
                            </a>

                            {/* Paarl Royals */}
                            <a href="https://www.paarlroyals.com" target="_blank" rel="noopener noreferrer">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                                >
                                    <img src="/assets/paarl-royals-logo.png" alt="Paarl Royals" className="w-10 h-10 rounded-lg object-cover" />
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-rr-dark block leading-tight">Paarl Royals</span>
                                        <span className="text-xs font-bold text-rr-pink tracking-wider">SA20</span>
                                    </div>
                                </motion.div>
                            </a>

                            {/* Barbados Royals */}
                            <a href="https://www.barbadosroyals.com" target="_blank" rel="noopener noreferrer">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                                >
                                    <img src="/assets/barbados-royals-logo.png" alt="Barbados Royals" className="w-10 h-10 rounded-lg object-cover" />
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-rr-dark block leading-tight">Barbados Royals</span>
                                        <span className="text-xs font-bold text-rr-pink tracking-wider">CPL</span>
                                    </div>
                                </motion.div>
                            </a>

                            {/* RR Academy Global */}
                            <a href="https://rajasthanroyalsacademy.com" target="_blank" rel="noopener noreferrer">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="flex items-center gap-3 bg-white border border-slate-100 shadow-lg rounded-xl px-5 py-3 hover:border-rr-pink/40 transition-all duration-300 cursor-pointer"
                                >
                                    <img src="/assets/Basic logo.png" alt="RR Academy" className="w-10 h-10 rounded-lg object-contain" />
                                    <div className="text-left">
                                        <span className="text-sm font-bold text-rr-dark block leading-tight">RR Academy</span>
                                        <span className="text-xs font-bold text-rr-pink tracking-wider">GLOBAL</span>
                                    </div>
                                </motion.div>
                            </a>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center mt-12">
                    <Button onClick={scrollToForm} variant="primary" className="text-base px-8 py-4 shadow-xl shadow-rr-blue/20">
                        APPLY NOW
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default Intro;

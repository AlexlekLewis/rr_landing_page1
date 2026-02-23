import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Button from './Button';
import { RoyalsWave } from './Decals';

const VIDEO_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Final%20Andy%20%26%20Kumar%20Edit.mov';

const Intro = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        setIsPlaying(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 bg-white text-rr-dark relative overflow-hidden" id="intro">
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
                        {/* Video element - always rendered, shows poster when paused */}
                        <video
                            ref={videoRef}
                            src={VIDEO_URL}
                            title="Kumar Sangakkara"
                            className="absolute inset-0 w-full h-full rounded-2xl object-cover"
                            controls={isPlaying}
                            playsInline
                            preload="auto"
                            poster="/assets/Kumar_Poster_Image.jpg"
                            onEnded={() => setIsPlaying(false)}
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                        />

                        {/* Play button overlay - shown when dormant */}
                        {!isPlaying && (
                            <div
                                className="absolute inset-0 flex items-center justify-center group cursor-pointer z-10"
                                onClick={handlePlay}
                            >
                                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Play className="w-8 h-8 text-rr-pink fill-current ml-1" />
                                </div>
                                <p className="absolute bottom-6 left-6 text-sm font-bold tracking-wider text-white drop-shadow-md">KUMAR SANGAKKARA</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Quote Layout */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* Left Column - Logo & Accent */}
                        <div className="lg:col-span-4 flex flex-col items-center justify-start pt-6 lg:pt-0 lg:mt-[5.5rem] lg:sticky lg:top-24 pb-8 lg:pb-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <img src="/assets/MELBOURNE.ai.png" alt="Rajasthan Royals Academy Melbourne" className="w-[16.5rem] md:w-[19rem] max-w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                            </motion.div>
                            <div className="mt-8 hidden lg:block text-center space-y-2">
                                <p className="text-xs font-black tracking-[0.2em] text-rr-pink uppercase">Foundation Intake</p>
                                <p className="text-sm font-bold text-rr-dark uppercase tracking-widest">April 2026</p>
                            </div>
                        </div>

                        {/* Right Column - Content */}
                        <div className="lg:col-span-8">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-rr-dark text-left mb-10">
                                INVITATION TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">APPLY</span>
                            </h2>

                            <div className="space-y-6 text-lg font-medium text-slate-600 leading-relaxed text-left">
                                <p className="text-xl text-rr-dark font-bold border-l-4 border-rr-pink pl-5 py-1 bg-gradient-to-r from-rr-pink/5 to-transparent rounded-r-xl">
                                    We are delighted to invite you to be part of an exciting new opportunity for aspiring cricketers in Melbourne, the <strong className="text-rr-dark">Rajasthan Royals Academy - Elite Program</strong>, beginning in early April 2026.
                                </p>

                                <p>
                                    You will have received this invitation to apply to the Rajasthan Royals Academy Elite Program by someone who knows your game well, and thought you should consider the opportunity. This may be a coach, a player scout or a teammate. No matter how this invitation found its way to you, this unique opportunity with one of the world's biggest and most successful cricket franchises could help take your game to the next level.
                                </p>

                                <p>
                                    For the first time, cricketers in Australia will have opportunities to learn and develop their T20 skills from some of the best T20 coaches in the Royals ecosystem. And, never before have the opportunities been so great and the potential rewards so high for those who develop an elite level T20 skillset.
                                </p>

                                <p>
                                    As it is the first time an IPL franchise has opened its doors in such a way to emerging cricketers in Melbourne, the Rajasthan Royals Academy have made sure the resources and opportunities are provided to make a meaningful difference to your development trajectory.
                                </p>

                                {/* Highlighted Event Panel */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg shadow-rr-blue/5 relative overflow-hidden my-10 group hover:border-rr-pink/30 transition-colors duration-300">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-rr-pink to-rr-blue"></div>
                                    <div className="flex flex-col sm:flex-row items-start gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-rr-pink/10 flex items-center justify-center shrink-0 group-hover:bg-rr-pink/20 transition-colors duration-300">
                                            <svg className="w-7 h-7 text-rr-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-black text-rr-pink uppercase tracking-widest bg-rr-pink/10 px-3 py-1 rounded-full">Assessment Session</span>
                                            </div>
                                            <p className="text-[17px] text-slate-600 leading-relaxed font-medium">
                                                On the afternoon of <strong className="text-rr-dark">Sunday March 1st</strong>, Siddhartha Lahiri (Royals Head of International Player Development, Rajasthan Royals Performance Coach & Assistant Coach of Paarl and Barbados Royals) will be in Melbourne to hold an assessment session as a part of the selection process for the Elite Program. Siddhartha is a key person responsible for identifying talent across the Royals global network of franchises and Academy's, and as such this will be an important step in offers being made to players to join the foundation intake of the Elite Program.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p>
                                    If you're serious about your cricket, and would like to be a part of the foundation intake, simply apply through the form below. Our selection team will be considering all applications however places are strictly limited for the foundation intake.
                                </p>

                                <p>
                                    To find out more about the Elite Program and the selection process, please browse through the information below.
                                </p>

                                <p>
                                    We look forward to receiving your application.
                                </p>

                                <div className="pt-6 mt-6 border-t border-slate-100">
                                    <p className="font-bold text-rr-dark">
                                        Best wishes,<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Rajasthan Royals Academy Melbourne Team</span>
                                    </p>
                                </div>
                            </div>
                        </div>
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
                                { href: "https://www.rajasthanroyals.com/cricket-academies", logo: "/assets/Basic logo.png", name: "RR Academy", league: "GLOBAL" },
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
                            <a href="https://www.rajasthanroyals.com/cricket-academies" target="_blank" rel="noopener noreferrer">
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

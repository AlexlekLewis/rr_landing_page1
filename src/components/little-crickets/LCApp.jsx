import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const LCApp = () => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    const handlePause = () => {
        setPlaying(false);
    };

    return (
        <section id="app" className="py-24 bg-rr-dark relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rr-pink/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rr-blue/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Section header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Now Available</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4"
                    >
                        The Junior Royals <span className="text-rr-pink">App</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/70 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        The Rajasthan Royals Academy Management App — our first AI-enabled platform keeping parents connected to their child's academy journey.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Video */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="relative rounded-2xl overflow-hidden bg-black shadow-[0_0_60px_rgba(225,31,143,0.2)]"
                    >
                        {/* Gradient border */}
                        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-rr-pink via-rr-pink/60 to-rr-blue pointer-events-none z-10" />

                        <video
                            ref={videoRef}
                            src="/assets/jr-app-intro.mp4"
                            className="w-full rounded-2xl"
                            controls
                            playsInline
                            poster=""
                            onPlay={() => setPlaying(true)}
                            onPause={handlePause}
                            onEnded={handlePause}
                        />

                        {/* Play overlay — shown before first play */}
                        {!playing && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-rr-dark/60 cursor-pointer z-20 rounded-2xl"
                                onClick={handlePlay}
                            >
                                <div className="w-20 h-20 rounded-full bg-rr-pink flex items-center justify-center shadow-[0_0_40px_rgba(225,31,143,0.6)] hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Features */}
                        <div className="space-y-4 mb-10">
                            {[
                                { icon: '📋', title: 'Track Attendance', desc: 'Monitor your child\'s session attendance in real time.' },
                                { icon: '💬', title: 'Coach Feedback', desc: 'Receive direct feedback from coaches after every session.' },
                                { icon: '📈', title: 'Progress Tracking', desc: 'Get a clear picture of your child\'s development over time.' },
                                { icon: '🤖', title: 'AI-Enabled', desc: 'The first AI-powered academy management platform in Australia.' },
                            ].map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4"
                                >
                                    <span className="text-2xl shrink-0">{f.icon}</span>
                                    <div>
                                        <p className="font-black text-white uppercase tracking-wide text-sm mb-0.5">{f.title}</p>
                                        <p className="text-white/60 text-sm font-medium">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Download buttons */}
                        <div className="mb-8">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Download the App</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="https://apps.apple.com/us/app/rr-academy/id6504992448"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-5 py-3.5 transition-all duration-200 group"
                                >
                                    <svg className="w-7 h-7 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                    </svg>
                                    <div>
                                        <p className="text-white/50 text-xs font-medium">Download on the</p>
                                        <p className="text-white font-black text-sm uppercase tracking-wide">App Store</p>
                                    </div>
                                </a>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.RRAcademy.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-5 py-3.5 transition-all duration-200 group"
                                >
                                    <svg className="w-7 h-7 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.18 23.76c.3.17.64.22.98.14l12.76-7.37-2.82-2.82-10.92 10.05zM.54 1.96C.2 2.3 0 2.83 0 3.54v16.91c0 .71.2 1.24.55 1.58l.08.07 9.47-9.47v-.22L.62 1.89l-.08.07zM20.12 10.52l-2.7-1.56-3.14 3.14 3.14 3.14 2.72-1.57c.78-.45.78-1.17-.02-1.15zM3.18.23L15.94 7.6l-2.82 2.82L2.2.37c.3-.17.66-.2.98-.14z"/>
                                    </svg>
                                    <div>
                                        <p className="text-white/50 text-xs font-medium">Get it on</p>
                                        <p className="text-white font-black text-sm uppercase tracking-wide">Google Play</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Login instructions */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-4">How to Log In</p>
                            <ol className="space-y-2">
                                {[
                                    'Download the app using the links above',
                                    'Open the app and tap Forgot Password',
                                    'Enter your registered email address',
                                    'Enter the OTP sent to your email',
                                    'Reset your password and log in',
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-rr-pink to-rr-blue flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-white font-black text-xs">{i + 1}</span>
                                        </span>
                                        <span className="text-white/70 text-sm font-medium leading-relaxed">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </motion.div>
                </div>

                {/* Halla Bol sign-off */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-white/20 font-black uppercase tracking-[0.4em] text-xs mt-16"
                >
                    Halla Bol
                </motion.p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        </section>
    );
};

export default LCApp;

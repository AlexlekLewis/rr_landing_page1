import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const VideoPlayer = ({ url, poster }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        setIsPlaying(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    return (
        <div className="w-full aspect-video rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden bg-black group">
            <video ref={videoRef} src={url} className="absolute inset-0 w-full h-full object-cover" controls={isPlaying} playsInline poster={poster} onEnded={() => setIsPlaying(false)} />
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-black/40 hover:bg-black/20 transition-all duration-300" onClick={handlePlay}>
                    <div className="w-16 h-16 bg-rr-pink/90 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 shadow-lg transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1"><polygon points="5,3 19,12 5,21" /></svg>
                    </div>
                </div>
            )}
        </div>
    );
};

const AcceptanceHero = ({ acceptStatus, setAcceptStatus }) => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <section id="lp3-hero" className="relative pt-32 pb-20 px-6 lg:px-8 bg-rr-dark text-white overflow-hidden min-h-[80vh] flex flex-col justify-center">
            {/* Background styling */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/sooryavanchi-arms-raised.jpg"
                    alt="Celebration"
                    className="w-full h-full object-cover object-[center_30%] opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/80 to-rr-dark/60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-rr-dark/80 via-transparent to-rr-dark/90"></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 max-w-4xl mx-auto w-full text-center"
            >
                <div className="space-y-10 mb-16">
                    <motion.div variants={fadeIn}>
                        <h1 className="text-4xl md:text-6xl font-black tracking-wide leading-[1.1] uppercase font-heading bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-md mb-8">
                            Elite Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Offer</span>
                        </h1>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex justify-center w-full mb-10">
                        <img
                            src="/assets/MELBOURNE_OFFICIAL.png"
                            alt="Rajasthan Royals Academy Melbourne"
                            className="h-32 md:h-40 lg:h-48 w-auto object-contain mx-auto brightness-0 invert"
                        />
                    </motion.div>

                    <motion.div variants={fadeIn} className="space-y-6 text-lg md:text-xl text-slate-200 leading-relaxed font-light max-w-4xl mx-auto">
                        <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl mb-12">
                            <p className="mb-6">
                                Following our selection process, we are delighted to be able to offer you a position in the inaugural Rajasthan Royals Academy Melbourne Elite Program.
                            </p>
                            <p className="font-semibold text-white text-xl md:text-2xl italic">
                                In accepting this offer you will become a foundation member of this world first Royals program.
                            </p>
                        </div>

                        {/* Exclusive Videos */}
                        <div className="mb-16 space-y-8">
                            {/* Sid RR Intro */}
                            <div className="bg-white/5 border border-white/20 p-4 md:p-6 rounded-3xl shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-4">Welcome from <span className="text-rr-pink">Siddhartha Lahiri</span></h3>
                                <p className="text-sm md:text-base text-slate-300 mb-6 max-w-2xl mx-auto">Head of Global Academies, Rajasthan Royals</p>
                                <VideoPlayer url="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/%20Sid%20RR%20Intro%20V2.mp4" />
                            </div>

                            {/* Kumar Interview */}
                            <div className="bg-white/5 border border-white/20 p-4 md:p-6 rounded-3xl shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-4">Insights from <span className="text-rr-pink">Kumar Sangakkara</span></h3>
                                <p className="text-sm md:text-base text-slate-300 mb-6 max-w-2xl mx-auto">Director of Cricket, Rajasthan Royals</p>
                                <VideoPlayer url="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Kumar%20Interview.mp4" poster="/assets/Kumar_Poster_Image.jpg" />
                            </div>
                        </div>

                        {/* FOMO / Value Reaffirmation Section */}
                        <div className="text-left mb-12">
                            <h3 className="text-2xl font-black uppercase tracking-widest text-rr-pink mb-8 text-center drop-shadow-sm">Your Elite Program Invitation Secures:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Value Item 1 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col gap-4 shadow-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-black text-white uppercase tracking-wide text-lg">World-Class<br /><span className="text-rr-pink">T20 Coaching</span></h4>
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                                        <span className="font-bold text-white">48 hours+ (Extras)</span> of elite contact time across 12 weeks. Experience dedicated <span className="font-bold text-white">2-on-1 coaching</span>, intensive squad match simulations, and exclusive access to <span className="font-bold text-white">IPL Masterclasses</span>.
                                    </p>
                                </div>

                                {/* Value Item 2 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col gap-4 shadow-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-black text-white uppercase tracking-wide text-lg">The<br /><span className="text-rr-blue">DNA PROFILE</span></h4>
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                                        Your <span className="font-bold text-white">Player DNA Profile</span> features a proprietary Player Development Plan (IDP) tracked via your dedicated portal. We utilize Full Track video analysis and IPL-standard metrics to explicitly map and accelerate your growth.
                                    </p>
                                </div>

                                {/* Value Item 3 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col gap-4 shadow-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-black text-white uppercase tracking-wide text-lg">360° Player<br /><span className="text-rr-pink">Development</span></h4>
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                                        Look beyond the nets. Benefit from high-performance sessions in <span className="font-bold text-white">T20 mental performance, nutrition, and strength & conditioning</span>, building daily professional habits.
                                    </p>
                                </div>

                                {/* Value Item 4 */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col gap-4 shadow-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-black text-white uppercase tracking-wide text-lg">Full Elite<br /><span className="text-rr-blue">Apparel Kit</span></h4>
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                                        Look the part in official Rajasthan Royals Academy gear. You will receive a premium <span className="font-bold text-white">training shirt, functional shorts, and academy cap</span> upon induction.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tech Partners / Powered By */}
                        <div className="flex flex-col items-center justify-center pt-8 pb-4 border-t border-white/10 mt-8 mb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-6">World-Class Technology Partners</p>
                            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                                <a href="https://fulltrack.ai/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                                    <img src="/assets/fulltrack-logo.png" alt="Fulltrack AI" className="h-24 md:h-32 lg:h-40 w-auto object-contain" />
                                </a>
                                <a href="https://www.str8bat.com/" target="_blank" rel="noopener noreferrer" className="brightness-0 invert opacity-70 hover:opacity-100 transition-opacity">
                                    <img src="/assets/str8bat-logo.png" alt="str8bat" className="h-6 md:h-8 w-auto object-contain" />
                                </a>
                            </div>
                        </div>

                        <p className="font-semibold text-white mt-8 mb-4">
                            Please take the time to work through the below information to confirm and accept your place in the Elite Program.
                        </p>
                    </motion.div>
                </div>

                {/* Offer Acceptance Toggle - No Decline */}
                <motion.div variants={fadeIn} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-rr-dark max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-wide">Do you accept the offer to the Rajasthan Royals Academy Melbourne Elite Program?</h2>

                    <button
                        onClick={() => setAcceptStatus('yes')}
                        className={`w-full py-6 px-10 rounded-2xl font-black tracking-wide uppercase text-xl md:text-2xl transition-all duration-300 border-2 ${acceptStatus === 'yes'
                            ? 'bg-rr-pink border-rr-pink text-white shadow-xl shadow-rr-pink/20 scale-105'
                            : 'bg-gradient-to-r from-rr-pink to-rr-blue border-transparent text-white hover:shadow-xl hover:shadow-rr-pink/20 hover:scale-105'
                            }`}
                    >
                        {acceptStatus === 'yes' ? 'OFFER ACCEPTED ✓' : 'YES, I ACCEPT'}
                    </button>

                    {/* Add celebration text when accepted */}
                    {acceptStatus === 'yes' && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 text-rr-pink font-bold text-lg"
                        >
                            Scroll down to complete your Elite Program Administration details.
                        </motion.p>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default AcceptanceHero;

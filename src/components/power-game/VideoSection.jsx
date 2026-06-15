import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection = ({
    badge = "The Game's Changed",
    heading = (<>WHAT HAS <span className="text-rr-pink">SOORYAVANSHI</span> DONE?</>),
    description = "Let's hear from Andy Crook, Director of Rajasthan Royals Academy Melbourne, as well as T20 and Power Coach — on the impact of Vaibhav Sooryavanshi, what the future of the game now looks like, and the Power Pre-Season, during a recent interview.",
    videoSrc = '/assets/powergame/andy-crook-video.mp4',
    posterSrc = '/assets/powergame/andy-crook-poster.jpg',
}) => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    return (
        <section className="bg-rr-page py-24 md:py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rr" />

            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            {badge}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        {heading}
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        {description}
                    </p>
                </motion.div>

                <motion.div
                    className="relative mx-auto w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_60px_rgba(225,31,143,0.15)]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        poster={posterSrc}
                        controls={playing}
                        playsInline
                        preload="metadata"
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {!playing && (
                        <button
                            type="button"
                            onClick={handlePlay}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 hover:bg-black/20 transition-all duration-300 group"
                            aria-label="Play video"
                        >
                            <span className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-rr-pink group-hover:bg-rr-light-pink transition-all duration-300 flex items-center justify-center shadow-[0_0_40px_rgba(225,31,143,0.6)] group-hover:scale-110">
                                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                            </span>
                        </button>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default VideoSection;

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const ExclusiveVideo = ({ applicantName }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    // Placeholder video URL (replace with secure Blob mechanism when real video is ready)
    const videoSrc = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4";

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            setProgress((video.currentTime / video.duration) * 100);
        };

        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Video Protection: Disable right-click
    const handleContextMenu = (e) => {
        e.preventDefault();
    };

    return (
        <section id="video-section" className="py-24 bg-rr-dark relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-rr-pink/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-6"
                    >
                        [Language TBC]
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        [Language TBC]
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative rounded-3xl overflow-hidden aspect-video bg-black shadow-2xl shadow-rr-pink/10 border border-white/10 group"
                >
                    {/* Watermark Overlay (Security feature) */}
                    <div className="absolute inset-0 z-20 pointer-events-none flex flex-wrap opacity-[0.03] select-none text-white text-2xl font-black uppercase tracking-widest overflow-hidden">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <span key={i} className="m-4 -rotate-12 whitespace-nowrap">
                                {applicantName} // CONFIDENTIAL
                            </span>
                        ))}
                    </div>

                    <video
                        ref={videoRef}
                        src={videoSrc}
                        className="w-full h-full object-cover"
                        onContextMenu={handleContextMenu}
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                    />

                    {/* Custom Controls Overlay */}
                    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                        {/* Big Play Pause Center (when paused) */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={togglePlay}
                                    className="w-20 h-20 bg-rr-pink/90 rounded-full flex items-center justify-center text-white hover:bg-rr-pink transition-transform hover:scale-110 shadow-xl shadow-rr-pink/20"
                                >
                                    <Play className="w-10 h-10 ml-2" fill="currentColor" />
                                </button>
                            </div>
                        )}

                        <div className="p-6">
                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 overflow-hidden">
                                <div
                                    className="h-full bg-rr-pink transition-all duration-100 ease-linear"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={togglePlay}
                                    className="text-white hover:text-rr-pink transition-colors"
                                >
                                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                </button>

                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-rr-pink transition-colors"
                                >
                                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        [Language TBC]
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ExclusiveVideo;

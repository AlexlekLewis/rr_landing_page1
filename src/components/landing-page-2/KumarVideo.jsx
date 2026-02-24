import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VIDEO_URL = 'https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Final%20Andy%20%26%20Kumar%20Edit.mov';

const KumarVideo = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        setIsPlaying(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    return (
        <section className="py-20 px-6 lg:px-8 relative z-10 bg-white">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">
                        A Message from <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">Kumar Sangakkara</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto rounded-full" />
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
                        Director of Cricket for the Rajasthan Royals and one of the greatest batsmen in cricket history.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full aspect-video rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden"
                >
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

                    {!isPlaying && (
                        <div
                            className="absolute inset-0 flex items-center justify-center group cursor-pointer z-10"
                            onClick={handlePlay}
                        >
                            <div className="w-20 h-20 bg-rr-dark/60 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-rr-dark/80 transition-all duration-300 shadow-lg">
                                <Play className="w-8 h-8 text-white fill-current ml-1" />
                            </div>
                            <p className="absolute bottom-6 left-6 text-sm font-bold tracking-wider text-white drop-shadow-md uppercase">Kumar Sangakkara</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default KumarVideo;

import React, { useState, useRef } from 'react';

const TheDreamAndPathway = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section className="py-24 px-6 lg:px-8 bg-slate-50 relative z-10 text-center border-b border-slate-200 overflow-hidden" id="dream-pathway">
            {/* Subtle Pink Logo Watermark */}
            <img
                src="/assets/rr-logo-pink.png"
                alt=""
                className="absolute -right-16 top-1/2 -translate-y-1/2 w-auto h-[80%] object-contain opacity-[0.03] pointer-events-none z-0"
                aria-hidden="true"
            />
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                {/* Text Content */}
                <div className="flex-1 text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase mb-6 leading-tight">The Dream & Pathway</h2>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed mb-6">
                        Hear directly from the coaching team about the vision behind the Rajasthan Royals Academy Melbourne — and the pathway it creates for emerging cricketers ready to take their game to the next level.
                    </p>
                </div>

                {/* Video Container */}
                <div className="w-full md:w-1/2 aspect-video bg-rr-dark rounded-xl overflow-hidden shadow-2xl relative group border-4 border-white">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        controls={isPlaying}
                        playsInline
                        preload="metadata"
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                    >
                        <source src="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Final%20Andy%20&%20Kumar%20Edit.mov" type="video/quicktime" />
                        <source src="https://pudldzgmluwoocwxtzhw.supabase.co/storage/v1/object/public/Kumar%20Video%20Landing/Final%20Andy%20&%20Kumar%20Edit.mov" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Play button overlay — hidden once playing */}
                    {!isPlaying && (
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-rr-dark/50 cursor-pointer hover:bg-rr-dark/40 transition-colors"
                            onClick={handlePlay}
                        >
                            <div className="w-20 h-20 bg-rr-pink rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default TheDreamAndPathway;

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection = () => {
    return (
        <section className="bg-rr-dark py-24 md:py-32 relative overflow-hidden">
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
                            Watch the Program
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        SEE THE <span className="text-rr-pink">POWER</span> IN ACTION
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-medium">
                        Watch how we develop explosive skills across every discipline of the modern game.
                    </p>
                </motion.div>

                <motion.div
                    className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_60px_rgba(225,31,143,0.15)]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    {/* Placeholder video poster */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <button
                            type="button"
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-rr-pink hover:bg-rr-light-pink transition-all duration-300 flex items-center justify-center shadow-[0_0_40px_rgba(225,31,143,0.6)] hover:scale-110"
                            aria-label="Play video"
                        >
                            <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                        </button>
                        <div className="mt-6 text-white/70 text-xs font-bold uppercase tracking-widest">
                            Video Placeholder — TBC
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VideoSection;

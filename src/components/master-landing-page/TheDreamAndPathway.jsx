import React from 'react';

const TheDreamAndPathway = () => {
    return (
        <section className="py-24 px-6 lg:px-8 bg-slate-50 relative z-10 text-center border-b border-slate-200" id="dream-pathway">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                {/* Text Content */}
                <div className="flex-1 text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase mb-6 leading-tight">The Dream & Pathway</h2>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed mb-6">
                        [PLACEHOLDER: Pending copy from production team regarding alumni outcomes, prestige, and elite pathways.]
                    </p>
                </div>

                {/* Video Container */}
                <div className="w-full md:w-1/2 aspect-video bg-rr-dark rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer border-4 border-white">
                    {/* Placeholder for Video Player - Will add actual src when confirmed */}
                    <div className="absolute inset-0 flex items-center justify-center bg-rr-dark/80 group-hover:bg-rr-dark/60 transition-colors">
                        <div className="w-16 h-16 bg-rr-pink rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TheDreamAndPathway;

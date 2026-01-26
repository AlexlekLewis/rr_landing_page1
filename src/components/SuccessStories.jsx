import React from 'react';

const SuccessStories = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark mb-6">UNCOVERING TALENT</h2>
                    <p className="text-lg text-rr-grey">
                        Rajasthan Royals have developed a reputation for uncovering and developing talent that others miss. Siddhartha Lahiri and his network leave no stone unturned.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="group relative rounded-2xl overflow-hidden shadow-xl aspect-video cursor-pointer">
                        <img
                            src="/assets/jaiswal-100.webp"
                            alt="Yashasvi Jaiswal"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                            <h3 className="text-2xl font-bold text-white mb-1">YASHASVI JAISWAL</h3>
                            <p className="text-rr-pink font-medium">Global T20 Superstar</p>
                        </div>
                    </div>

                    <div className="group relative rounded-2xl overflow-hidden shadow-xl aspect-video cursor-pointer">
                        <img
                            src="/assets/kwena-maphaka.webp"
                            alt="Kwena Maphaka"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                            <h3 className="text-2xl font-bold text-white mb-1">KWENA MAPHAKA</h3>
                            <p className="text-rr-pink font-medium">U19 World Cup Sensation</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;

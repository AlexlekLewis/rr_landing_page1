import React from 'react';

const SuccessStories = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">UNCOVERING TALENT</h2>
                    <p className="text-lg text-slate-600">
                        Rajasthan Royals have developed a reputation for uncovering and developing talent that others miss. Siddhartha Lahiri and his network leave no stone unturned.
                    </p>
                </div>

                {/* Placeholder for Success Stories Carousel or Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-100 rounded-xl p-8 aspect-video flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-200">
                            [SUCCESS STORY {i}]
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;

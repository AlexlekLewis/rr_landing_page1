import React from 'react';

const SelectionProcess = () => {
    const steps = [
        { title: "Apply", desc: "Fill out the application form below." },
        { title: "Assess", desc: "Our team will assess your suitability. Places are limited." },
        { title: "Offer", desc: "Successful applicants will receive an offer based on criteria." },
        { title: "Alternative", desc: "Unsuccessful applicants may be offered a place in other Academy programs." }
    ];

    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-black text-center mb-16">SELECTION PROCESS</h2>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((s, i) => (
                        <div key={i} className="relative p-6 pt-12 border-l-2 border-slate-700 hover:border-pink-500 transition-colors bg-slate-800/30 rounded-r-xl">
                            <span className="absolute top-0 left-0 -ml-[19px] w-10 h-10 bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center font-bold text-sm text-pink-500 shadow-lg">
                                {i + 1}
                            </span>
                            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                            <p className="text-slate-400 text-sm">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SelectionProcess;

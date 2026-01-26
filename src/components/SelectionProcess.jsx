import React from 'react';

const SelectionProcess = () => {
    const steps = [
        { title: "Apply", desc: "Fill out the application form below." },
        { title: "Assess", desc: "Our team will assess your suitability. Places are limited." },
        { title: "Offer", desc: "Successful applicants will receive an offer based on criteria." },
        { title: "Alternative", desc: "Unsuccessful applicants may be offered a place in other Academy programs." }
    ];

    return (
        <section className="py-24 bg-rr-dark text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-black text-center mb-16">SELECTION PROCESS</h2>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((s, i) => (
                        <div key={i} className="relative p-6 pt-12 border-l-2 border-rr-grey hover:border-rr-pink transition-colors bg-rr-grey/30 rounded-r-xl">
                            <span className="absolute top-0 left-0 -ml-[19px] w-10 h-10 bg-rr-dark border-4 border-rr-dark rounded-full flex items-center justify-center font-bold text-sm text-rr-pink shadow-lg">
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

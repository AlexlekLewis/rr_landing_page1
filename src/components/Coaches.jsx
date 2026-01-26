import React from 'react';

const CoachProfile = ({ name, role, bio }) => (
    <div className="text-center group">
        <div className="w-40 h-40 bg-slate-200 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border-4 border-white">
            {/* Placeholder for Image */}
            <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold text-2xl">
                {name.charAt(0)}
            </div>
        </div>
        <h3 className="text-xl font-black text-rr-dark">{name}</h3>
        <p className="text-rr-pink font-bold text-xs uppercase tracking-widest mb-3">{role}</p>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">{bio}</p>
    </div>
);

const Coaches = () => {
    const coaches = [
        { name: "Sid Lahiri", role: "Head of Int. Player Dev", bio: "Expert in identifying high performance talent globally for the Royals franchise." },
        { name: "Andy", role: "Senior Coach", bio: "Spins specialist with a wealth of T20 tactical knowledge." },
        { name: "Steve Crook", role: "Director of Talent", bio: "Former pro with extensive coaching experience in the BBL and UK county circuit." },
        { name: "Alex", role: "High Performance Manager", bio: "Ensures athletes reach their peak physical condition for elite competition." }
    ];

    return (
        <section className="py-24 bg-slate-50" id="coaches">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-black text-center text-rr-dark mb-16">
                    WORLD CLASS <span className="text-rr-pink">MENTORS</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {coaches.map((c, i) => <CoachProfile key={i} {...c} />)}
                </div>
            </div>
        </section>
    );
};

export default Coaches;

import React from 'react';
import { motion } from 'framer-motion';

const defaultCoaches = [
    {
        name: "Siddhartha Lahiri",
        role: "Head of Global Academies",
        image: "/assets/Coaches/Sid_Lahiri.jpg",
        bio: "Leading talent identification and performance globally for the Royals Group of franchises and the Royals Academy network.",
        tier: 1
    },
    {
        name: "Alex Lewis",
        role: "Head Coach",
        image: "/assets/Headshot.png",
        bio: "An experienced Academy Director with over 20 years developing players for Premier Cricket and representative pathways.",
        tier: 1
    },
    {
        name: "Matthew Spoors",
        role: "Batting — Power Hitting & 360",
        image: "/assets/placeholder-coach.jpg",
        bio: "Globally experienced (BBL/International). Unpacks the mechanics of powerplay dominance with direct access to elite-level technical knowledge and match-day execution strategies.",
        tier: 1
    },
    {
        name: "Jarryd Rogers",
        role: "Batting — Power Hitting Mechanics",
        image: "/assets/placeholder-coach.jpg",
        bio: "Victorian State Baseball batting coach and power hitting mechanics expert, supporting foundation technical elements and testing key power metrics including bat speed and ball exit velocity.",
        tier: 1
    },
    {
        name: "Harkirat Bajwa",
        role: "Bowling — Spin",
        image: "/assets/placeholder-coach.jpg",
        bio: "Australian U19 and Premier Cricket young gun, considered a modern 'mystery spinner' capable of spinning the ball both ways.",
        tier: 1
    }
];

const CoachCard = ({ coach }) => {
    return (
        <div className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg">
            {/* Background Image - Desaturated by default, coloured on hover */}
            <img
                src={coach.image}
                alt={coach.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                onError={(e) => { e.target.src = '/assets/placeholder-coach.jpg'; }}
            />

            {/* Gradient Overlay for text readability at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>

            {/* Default State Content (Name & Role) */}
            <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500 group-hover:translate-y-4 group-hover:opacity-0">
                <h3 className="text-2xl font-black text-white uppercase tracking-wide leading-none mb-1">{coach.name}</h3>
                <p className="text-rr-pink font-bold text-sm tracking-widest uppercase">{coach.role}</p>
            </div>

            {/* Hover State Overlay (Bio) */}
            <div className="absolute inset-0 bg-rr-dark/90 backdrop-blur-sm p-8 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-8 group-hover:translate-y-0 text-center">
                <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2">{coach.name}</h3>
                <p className="text-rr-pink font-bold text-xs tracking-widest uppercase mb-4 pb-4 border-b border-white/20 inline-block mx-auto">{coach.role}</p>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                    {coach.bio}
                </p>
                <div className="mt-6 flex justify-center">
                    <span className="h-1 w-12 bg-rr-blue rounded-full"></span>
                </div>
            </div>
        </div>
    );
};

const CoachesSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        COACHED BY THE BEST.<br />
                        <span className="text-rr-blue">NO AMATEURS. NO VOLUNTEERS.</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Your child's development is guided by elite professionals mapped directly to the Rajasthan Royals IPL coaching hierarchy.
                    </p>
                </div>

                {/* Tier 1 Coaches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {defaultCoaches.map((coach, index) => (
                        <CoachCard key={index} coach={coach} />
                    ))}
                </div>

                {/* Facility & Safety Credentials */}
                <div className="mt-20 bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-rr-dark uppercase mb-4">Elite Environment</h3>
                        <p className="text-rr-charcoal mb-6">
                            We train exclusively at the Cutting Edge Cricket Centre. State-of-the-art netting, precise lighting, and professional-grade surfaces.
                        </p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-rr-dark">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                WWCC Certified Coaches
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Maximum 1:8 Coach Ratio
                            </span>
                        </div>
                    </div>
                    {/* Facility Image */}
                    <div className="flex-1 w-full h-64 rounded-xl overflow-hidden shadow-md relative">
                        <div className="absolute inset-0 bg-image-gradient-rr opacity-20 mix-blend-multiply z-10"></div>
                        <img
                            src="/assets/PANA0988.JPG"
                            alt="Training Facility"
                            className="w-full h-full object-cover grayscale"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CoachesSection;

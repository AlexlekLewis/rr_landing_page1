import React from 'react';
import { motion } from 'framer-motion';

const CoachProfile = ({ name, role, bio, image }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center group"
    >
        <div className="w-40 h-40 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border-4 border-white relative">
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
            />
            {/* Pink overlay on hover */}
            <div className="absolute inset-0 bg-rr-pink/0 group-hover:bg-rr-pink/20 transition-colors duration-300 rounded-full" />
        </div>
        <h3 className="text-xl font-black text-rr-dark">{name}</h3>
        <p className="text-rr-pink font-bold text-xs uppercase tracking-widest mb-3">{role}</p>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">{bio}</p>
    </motion.div>
);

const Coaches = () => {
    const coaches = [
        {
            name: "Siddhartha Lahiri",
            role: "Head of International Player Development",
            bio: "Expert in identifying high performance talent globally for the Royals franchise.",
            image: "/assets/rra/headcoach-lahiri.png"
        },
        {
            name: "Andy Crook",
            role: "Managing Director",
            bio: "Former Director of Cricket Australia with extensive global experience.",
            image: "/assets/rra/coaching-strategy.png"
        },
        {
            name: "Steven Crook",
            role: "Director of Talent",
            bio: "Former professional with over 330 matches, known for his power-hitting and coaching success with the Adelaide Strikers.",
            image: "/assets/rra/coaching-nets.png"
        },
        {
            name: "Alex Lewis",
            role: "Head Coach",
            bio: "A highly successful academy builder with 22 years of experience in developing Victorian talent.",
            image: "/assets/rra/coaching-fielding.png"
        }
    ];

    return (
        <section className="py-24 bg-slate-50" id="coaches">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-black text-center text-rr-dark mb-4">
                    WORLD CLASS <span className="text-rr-pink">MENTORS</span>
                </h2>
                <p className="text-center text-slate-500 mb-16 max-w-2xl mx-auto">
                    Learn from coaches with direct connections to the Rajasthan Royals global franchise network
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {coaches.map((c, i) => <CoachProfile key={i} {...c} />)}
                </div>
            </div>
        </section>
    );
};

export default Coaches;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const coaches = [
    {
        name: "Siddhartha Lahiri",
        role: "Head of International Player Development",
        bio: "Expert in identifying high performance talent globally for the Royals franchise.",
        image: "/assets/rra/headcoach-lahiri.png",
        fullBio: "A key figure in the Royals Group's global scouting network, Siddhartha has been instrumental in identifying and developing world-class talent across India, South Africa, the Caribbean and beyond. His eye for raw potential has helped unearth some of the most exciting names in modern T20 cricket."
    },
    {
        name: "Andy Crook",
        role: "Director of Cricket, Australia",
        bio: "Former Director of Cricket Australia with extensive global experience.",
        image: "/assets/rra/coaching-strategy.png",
        fullBio: "With decades of experience at the highest levels of Australian cricket administration, Andy brings unparalleled organisational expertise and a deep understanding of player development pathways. His network and vision are driving the Rajasthan Royals Academy's Melbourne operations."
    },
    {
        name: "Steven Crook",
        role: "Director of Talent",
        bio: "Former professional with over 330 matches, known for power-hitting and coaching success.",
        image: "/assets/rra/coaching-nets.png",
        fullBio: "2x Vitality Blast champion with Northamptonshire Steelbacks. Sheffield Shield winning Assistant Coach. BBL Assistant Coach with Adelaide Strikers. Steven brings first-hand elite T20 experience and a passion for developing the next generation of power players."
    },
    {
        name: "Alex Lewis",
        role: "Head Coach",
        bio: "22 years of experience developing Victorian cricket talent.",
        image: "/assets/rra/coaching-fielding.png",
        fullBio: "A highly successful academy builder with over two decades of hands-on coaching experience in Victorian cricket. Alex has a proven track record of identifying emerging talent and creating development environments where young cricketers thrive and progress to representative honours."
    }
];

const CoachProfile = ({ coach }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="text-center group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHovered(!isHovered)}
        >
            <div className="w-40 h-40 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border-4 border-white relative">
                <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-rr-pink/0 group-hover:bg-rr-pink/20 transition-colors duration-300 rounded-full" />
            </div>
            <h3 className="text-xl font-black text-rr-dark">{coach.name}</h3>
            <p className="text-rr-pink font-bold text-xs uppercase tracking-widest mb-3">{coach.role}</p>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">{coach.bio}</p>

            {/* Hover Lightbox */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 z-30 w-72 md:w-80"
                    >
                        <div
                            className="rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                            style={{ background: 'linear-gradient(180deg, #001D48 0%, #1226AA 100%)' }}
                        >
                            <div className="p-6 text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rr-pink shrink-0">
                                        <img
                                            src={coach.image}
                                            alt={coach.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-base">{coach.name}</h4>
                                        <p className="text-rr-pink text-xs font-bold uppercase tracking-wider">{coach.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{coach.fullBio}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Coaches = () => {
    return (
        <section className="py-24 bg-slate-50" id="coaches">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-black text-center text-rr-dark mb-4">
                    ELITE <span className="text-rr-pink">LEADERSHIP</span>
                </h2>
                <p className="text-center text-slate-500 mb-16 max-w-2xl mx-auto">
                    World-class insight from coaches with direct connections to the Rajasthan Royals global franchise network
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {coaches.map((c) => <CoachProfile key={c.name} coach={c} />)}
                </div>
            </div>
        </section>
    );
};

export default Coaches;

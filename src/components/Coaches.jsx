import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const coaches = [
    {
        name: "Siddhartha Lahiri",
        role: "Head of International Player Development",
        bio: "Leading talent identification and performance globally for the Royals Group of franchises and the Royals Academy network.",
        image: "/assets/rra/headcoach-lahiri.png",
        fullBio: "Sid oversees the Rajasthan Royals Academy system within his portfolio, including the Rajasthan Royals Academy Melbourne. As well as an assistant or performance coach to Rajasthan, Paarl and Barbados Royals, he is a key figure in the global scouting network for the Royals Group and an expert in identifying performance talent. His eye for raw talent has unearthed some of the most exciting names in modern T20 cricket."
    },
    {
        name: "Andy Crook",
        role: "Director of Cricket",
        bio: "Leading the development of the Royals Academy system in Australia, providing opportunities to talented cricketers.",
        image: "/assets/rra/headcoach-andy.png",
        imagePosition: "object-[center_20%]",
        fullBio: "Andy brings to the Royals Academy decades of executive experience at the highest levels of sport, including leading such sports leagues as Australia's National Basketball League and Super Netball. A former professional who played for South Australia, Northamptonshire and Lancashire, Andy's connection with the game has remained strong, playing for Victoria at Masters level, and recently being a part of Australia's 2025 T20 Masters World Cup winning campaign in Pakistan. Charged driving the Rajasthan Royals Academy in Australia, his network and vision for T20 cricket and player development has led to creating a world first pathway of opportunities for talented youngsters to put themselves in front of global leaders of the T20 game."
    },

    {
        name: "Alex Lewis",
        role: "Head Coach",
        bio: "For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills.",
        image: "/assets/rra/headcoach-alex.png",
        fullBio: "With over two decades of hands-on coaching experience, Alex has a proven track record of identifying emerging talent and creating development environments where cricketers thrive and progress to representative honours. Selected by the Rajasthan Royals Academy to lead the Melbourne Elite Program, Alex will ensure that no stone is left unturned in maximising a players return from their time in the Elite Program. Alex will oversee a group of coaches and mentors who have been appointed to coach and mentor players through development of specific skills."
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
            <div className="w-56 h-56 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border-4 border-white relative">
                <img
                    src={coach.image}
                    alt={coach.name}
                    className={`w-full h-full object-cover ${coach.imagePosition || 'object-[center_15%]'}`}
                />
                <div className="absolute inset-0 bg-rr-pink/0 group-hover:bg-rr-pink/20 transition-colors duration-300 rounded-full" />
            </div>
            <h3 className="text-xl font-black text-rr-dark">{coach.name}</h3>
            <p className="text-rr-pink font-bold text-xs uppercase tracking-widest mb-3">{coach.role}</p>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto font-medium">{coach.bio}</p>

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
    const scrollToForm = () => {
        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-24 bg-white relative" id="coaches">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-rr-blue/5 to-transparent rounded-bl-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-center text-rr-dark mb-4">
                    ELITE <span className="text-transparent bg-clip-text bg-gradient-to-r from-rr-pink to-rr-blue">LEADERSHIP</span>
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-rr-pink to-rr-blue mx-auto mb-12 rounded-full" />
                <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto font-medium text-lg">
                    Rajasthan Royals Academy Melbourne Elite Program leadership group has been assembled to take your T20 game to the next level and provide a direct connection into the Royals global network.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {coaches.map((c) => <CoachProfile key={c.name} coach={c} />)}
                </div>
            </div>
        </section>
    );
};

export default Coaches;

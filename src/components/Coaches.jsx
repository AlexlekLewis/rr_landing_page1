import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const coaches = [
    {
        name: "Siddhartha Lahiri",
        role: "Head of International Player Development",
        bio: "Leading talent identification and performance globally for the Royals Group of franchises and the Royals Academy network.",
        image: "/assets/rra/headcoach-lahiri.png",
        fullBio: "Sid oversees the Rajasthan Royals Academy system within his portfolio, including the Rajasthan Royals Academy Melbourne. As well as an assistant or performance coach to Rajasthan, Paarl and Barbados Royals, he is a key figure in the global scouting network for the Royals Group and an expert in identifying performance talent. His eye for raw talent has unearthed some of the most exciting names in modern T20 cricket. Sid has also recently been appointed as an Assistant Coach of the Birmingham Phoenix in England's The Hundred franchise."
    },
    {
        name: "Andy Crook",
        role: "Director of Cricket",
        bio: "Leading the development of the Royals Academy system in Australia, providing opportunities to talented cricketers.",
        image: "/assets/rra/headcoach-andy.png",
        fullBio: "Andy brings to the Royals Academy decades of executive experience at the highest levels of sport, including leading such sports leagues as Australia's National Basketball League and Super Netball. A former professional who played for South Australia, Northamptonshire and Lancashire, Andy's connection with the game has remained strong, playing for Victoria at Masters level, and recently being a part of Australia's 2025 T20 Masters World Cup winning campaign in Pakistan. Charged driving the Rajasthan Royals Academy in Australia, his network and vision for T20 cricket and player development has led to creating a world first pathway of opportunities for talented youngsters to put themselves in front of global leaders of the T20 game."
    },
    {
        name: "Steven Crook",
        role: "Director of Talent",
        bio: "One of the original T20 power hitting allrounders, 330 professional games, 2x T20 champion, Sheffield Shield winning and BBL Assistant Coach.",
        image: "/assets/rra/headcoach-steven.png",
        fullBio: "Steven was one of the original T20 power hitting allrounders. Regularly reaching speeds of 150km/ph+ and known for demolishing teams at the back end of a T20 innings with his 6 hitting capability, his 330 professional game career at Lancashire, Middlesex and Northamptonshire saw him take part in 4 Vitality Blast Finals Days, claiming 2 Championships with Northamptonshire Steelbacks, one of which he claimed a man of the match performance. Now, Steven has made his mark in the coaching World. Head Coach of the Adelaide Strikers Academy that won the Top End T20 Series in 2024, Assistant Coach to Ryan Harris during the victorious 2025/26 Sheffield Shield winning season for South Australia, and Assistant Coach to Tim Paine at the Adelaide Strikers, Steven brings first-hand and modern day elite T20 experience and a passion for developing the next generation of T20 cricketers."
    },
    {
        name: "Alex Lewis",
        role: "Head Coach",
        bio: "For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills.",
        image: "/assets/rra/headcoach-alex.png",
        fullBio: "With over two decades of hands-on coaching experience in Victorian cricket system, Alex has a proven track record of identifying emerging talent and creating development environments where cricketers thrive and progress to representative honours. Selected by the Rajasthan Royals Academy to lead the Melbourne Elite Program, Alex will ensure that no stone is left unturned in maximising a players return from their time in the Elite Program. Academy Director as well as Assistant Coach at Fitzroy Doncaster Cricket Club, Alex operates at the cutting edge of the games development pathway, and will oversee a group of coaches and mentors who have been appointed to coach and mentor players through development of specific skills."
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
                    className="w-full h-full object-cover object-[center_15%]"
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
                    Rajasthan Royals Academy Melbourne ELITE PROGRAM leadership group has been assembled to take your T20 game to the next level and provide a direct connection into the Royals global network.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {coaches.map((c) => <CoachProfile key={c.name} coach={c} />)}
                </div>
            </div>
        </section>
    );
};

export default Coaches;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const coaches = [
    {
        name: 'Alex Lewis',
        role: 'Head Coach — Mickleham Indoor Sports Centre',
        location: 'Northern Melbourne',
        bio: 'For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills.',
        fullBio: 'For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors. Current premier cricket senior assistant coach, bowling coach and Academy director.',
        img: '/assets/coaches/alex-lewis.jpg',
        imgPosition: 'object-[center_15%]',
    },
    {
        name: 'Alex Thornhill',
        role: 'Head Coach — Elite Cricket Centre',
        location: 'South-Eastern Melbourne',
        bio: 'A high quality coach and a key part of the Rajasthan Royals Academy Elite Program, Alex oversees the curriculum and content development for the Junior Royals program.',
        fullBio: 'A high quality coach and a key part of the Rajasthan Royals Academy Elite Program, Alex oversees the curriculum and content development for the Junior Royals program, assisted by experienced lead coaches who deliver the program in each location. A batting specialist with coaching experience across two continents — UK county cricket and the Australian premier system. Alex currently coaches within the Fitzroy Doncaster Academy and leads the cricket program at Xavier College.',
        img: '/assets/coaches/alex-thornhill.jpg',
        imgPosition: 'object-[center_10%]',
    },
    {
        name: 'Andrew Walton',
        role: 'Head Coach — The Netz',
        location: 'Western Melbourne',
        bio: 'A Cricket Australia Level 3 High Performance accredited coach with over a decade of Premier Cricket Head Coach experience.',
        fullBio: 'A Cricket Australia Level 3 High Performance accredited coach with over a decade of Premier Cricket Head Coach experience. Andrew has developed players through to Sheffield Shield, BBL and international honours, working with the likes of Glenn Maxwell, Chris Rogers and Sam Harper. Currently Director of Coaching at Scotch College, Andrew brings a rare blend of technical excellence and data-driven performance thinking to the Rajasthan Royals Academy.',
        img: '/assets/coaches/andrew-walton.jpg',
        imgPosition: 'object-[center_10%]',
    },
];

const CoachCard = ({ coach, i }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="text-center relative group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setHovered(h => !h)}
        >
            {/* Circular photo */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full mx-auto mb-6 overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300 relative">
                <img
                    src={coach.img}
                    alt={coach.name}
                    className={`w-full h-full object-cover ${coach.imgPosition}`}
                />
                <div className="absolute inset-0 bg-rr-pink/0 group-hover:bg-rr-pink/20 transition-colors duration-300 rounded-full" />
            </div>

            <h3 className="text-xl font-black text-white mb-1">{coach.name}</h3>
            <p className="text-rr-pink font-bold text-xs uppercase tracking-widest mb-2">{coach.role}</p>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/60 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {coach.location}
            </span>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto font-medium">{coach.bio}</p>

            {/* Hover lightbox */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 z-30 w-72 md:w-80"
                    >
                        <div className="rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                            style={{ background: 'linear-gradient(180deg, #001D48 0%, #1226AA 100%)' }}>
                            <div className="p-6 text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-rr-pink shrink-0">
                                        <img src={coach.img} alt={coach.name} className={`w-full h-full object-cover ${coach.imgPosition}`} />
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
        </motion.div>
    );
};

const JRT3Coaches = () => (
    <section id="coaches" className="py-24 bg-rr-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-rr-pink/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-rr-blue/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Coaching Staff</motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                    YOUR <span className="text-rr-pink">COACHES</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                    className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
                    Each Junior Royals venue is led by a dedicated Head Coach — certified, experienced, and committed to the Royals Way. Tap a coach to read more.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                {coaches.map((coach, i) => (
                    <CoachCard key={coach.name} coach={coach} i={i} />
                ))}
            </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
    </section>
);

export default JRT3Coaches;

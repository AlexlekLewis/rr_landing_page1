import React from 'react';
import { motion } from 'framer-motion';

const venues = [
    {
        venue: 'Northern Centre',
        location: 'Mickleham Indoor Sports Centre',
        color: 'from-rr-pink to-rr-blue',
        coaches: [{
            name: 'Alex Lewis',
            role: 'Head Coach — Northern Centre',
            bio: 'For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors. Current premier cricket senior assistant coach, bowling coach and Academy director.',
            img: '/assets/coaches/alex-lewis.jpg',
        }],
    },
    {
        venue: 'South-East Centre',
        location: 'Elite Cricket Centre, Hallam',
        color: 'from-rr-blue to-rr-pink',
        coaches: [{
            name: 'Alex Thornhill',
            role: 'Head Coach — South-East Centre',
            bio: 'A high quality coach and a key part of the Rajasthan Royals Academy Elite Program, Alex oversees the curriculum and content development for each session across the year for the Junior Royals program, assisted by experienced lead coaches who deliver the program in each location. With a well rounded coaching skill set, Alex is primarily a batting specialist with coaching experience across two continents — UK county cricket and the Australian premier system. Alex currently coaches within the Fitzroy Doncaster Academy and leads the cricket program at Xavier College. His technical approach combines video analysis with deep knowledge of what batting looks like at the next level.',
            img: '/assets/coaches/alex-thornhill.jpg',
        }],
    },
    {
        venue: 'Western Centre',
        location: 'The Netz, Williamstown',
        color: 'from-rr-pink to-rr-blue',
        coaches: [{
            name: 'Andrew Walton',
            role: 'Head Coach — Western Centre',
            bio: 'Bio coming soon.',
            img: null,
        }],
    },
];

const CoachCard = ({ coach, i }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="h-56 overflow-hidden bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink">
            {coach.img ? (
                <img src={coach.img} alt={coach.name} className="w-full h-full object-cover object-top" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                    </div>
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Photo Coming Soon</span>
                </div>
            )}
        </div>
        <div className="p-6">
            <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-1">{coach.name}</h3>
            <p className="text-rr-pink font-bold text-sm uppercase tracking-widest mb-4">{coach.role}</p>
            <p className="text-rr-charcoal text-sm font-medium leading-relaxed">{coach.bio}</p>
        </div>
    </motion.div>
);

const JRT3Coaches = () => (
    <section id="coaches" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Coaching Staff</motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6">
                    YOUR <span className="text-rr-pink">COACHES</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                    className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                    Each Junior Royals venue is led by a dedicated Head Coach — certified, experienced, and committed to the Royals Way.
                </motion.p>
            </div>

            <div className="space-y-16">
                {venues.map((v, vi) => (
                    <div key={v.venue}>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="flex items-center gap-4 mb-8">
                            <div className={`h-1 w-12 bg-gradient-to-r ${v.color} rounded-full`} />
                            <div>
                                <p className="text-xs font-bold text-rr-pink uppercase tracking-widest">{v.venue}</p>
                                <p className="text-sm font-bold text-rr-dark">{v.location}</p>
                            </div>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {v.coaches.map((coach, ci) => (
                                <CoachCard key={coach.name} coach={coach} i={ci} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default JRT3Coaches;

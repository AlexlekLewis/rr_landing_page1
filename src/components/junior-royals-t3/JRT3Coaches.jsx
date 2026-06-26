import React from 'react';
import { motion } from 'framer-motion';

const coaches = [
    {
        name: 'Alex Lewis',
        role: 'Head Coach — Mickleham Indoor Sports Centre',
        location: 'Northern Melbourne',
        bio: 'For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors. Current premier cricket senior assistant coach, bowling coach and Academy director.',
        img: '/assets/rra/headcoach-alex.png',
        portrait: true,
        role: 'Head Coach — Elite Cricket Centre',
        location: 'South-Eastern Melbourne',
        bio: 'A high quality coach and a key part of the Rajasthan Royals Academy Elite Program, Alex oversees the curriculum and content development for the Junior Royals program, assisted by experienced lead coaches who deliver the program in each location. A batting specialist with coaching experience across two continents — UK county cricket and the Australian premier system. Alex currently coaches within the Fitzroy Doncaster Academy and leads the cricket program at Xavier College.',
        img: '/assets/coaches/alex-thornhill.jpg',
    },
    {
        name: 'Andrew Walton',
        role: 'Head Coach — The Netz',
        location: 'Western Melbourne',
        bio: 'A Cricket Australia Level 3 High Performance accredited coach with over a decade of Premier Cricket Head Coach experience, Andrew has led athlete development programs at Melbourne Cricket Club and Prahran Cricket Club — overseeing Sheffield Shield and BBL player debuts, and working directly with the development of players including Glenn Maxwell, Chris Rogers and Sam Harper. Currently Director of Coaching at Scotch College and a specialist coach at the Karnataka Institute of Cricket in India, Andrew brings a rare blend of technical excellence and data-driven performance methodology to the Junior Royals program.',
        img: null,
    },
];

const JRT3Coaches = () => (
    <section id="coaches" className="py-24 bg-slate-50">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {coaches.map((coach, i) => (
                    <motion.div key={coach.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        <div className="overflow-hidden bg-gradient-to-br from-rr-navy via-rr-blue to-rr-pink"
                            style={{ height: coach.portrait ? '320px' : '224px' }}>
                            {coach.img ? (
                                <img src={coach.img} alt={coach.name}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: 'center top' }}
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-4xl">👤</span>
                                    </div>
                                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Photo Coming Soon</span>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-1">{coach.name}</h3>
                            <p className="text-rr-pink font-bold text-sm uppercase tracking-widest mb-2">{coach.role}</p>
                            <span className="inline-flex items-center gap-1.5 bg-rr-blue/10 border border-rr-blue/20 text-rr-blue text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {coach.location}
                            </span>
                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed">{coach.bio}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default JRT3Coaches;

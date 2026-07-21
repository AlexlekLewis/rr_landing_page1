import React from 'react';
import { motion } from 'framer-motion';
import { ALL_COACHES } from './coachData';

const CoachesBios = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">Coach Profiles</p>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                        Meet the Coaches
                    </h2>
                    <p className="text-lg text-rr-charcoal font-medium max-w-2xl mx-auto">
                        The careers, credentials and coaching behind the program.
                    </p>
                </div>

                <div className="space-y-16 md:space-y-20">
                    {ALL_COACHES.map((coach, i) => (
                        <motion.div
                            key={coach.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className={`grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start ${
                                i % 2 === 1 ? 'md:[direction:rtl]' : ''
                            }`}
                        >
                            <div className="md:[direction:ltr]">
                                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm border border-slate-200">
                                    <img
                                        src={coach.img}
                                        alt={coach.name}
                                        className={`absolute inset-0 w-full h-full object-cover ${coach.imgPosition}`}
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-rr-dark/70 to-transparent" />
                                    <p className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold uppercase tracking-widest">
                                        {coach.centre}
                                    </p>
                                </div>
                            </div>

                            <div className="md:[direction:ltr]">
                                <h3 className="text-3xl font-black text-rr-dark uppercase tracking-tight mb-2">{coach.name}</h3>
                                <p className="text-sm font-bold text-rr-pink uppercase tracking-widest mb-6">{coach.role}</p>
                                {coach.bio.map((para, j) => (
                                    <p key={j} className="text-rr-charcoal font-medium leading-relaxed mb-4">
                                        {para}
                                    </p>
                                ))}
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {coach.credentials.map((c) => (
                                        <span
                                            key={c}
                                            className="bg-slate-100 text-rr-charcoal text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                                        >
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoachesBios;

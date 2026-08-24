import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, CalendarDays, Star } from 'lucide-react';
import { BatIcon } from './CricketIcons';
import { fadeUp, SectionHeading } from './shared';
import { CENTRES, ACTIVE_CENTRES } from './data';

const TrialsSection = ({ onChooseCentre }) => (
    <section className="py-20 px-5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="Our Centres"
                title="Choose Your Centre to Trial"
                sub="Two Performance Squads are live now, with two more centres arriving in 2027."
            />
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
                {ACTIVE_CENTRES.map((c, i) => (
                    <motion.div key={c.slug} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                        className="bg-white/5 border border-white/10 hover:border-rr-pink/50 rounded-2xl p-7 flex flex-col transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-3 py-1.5 ${c.trialSessions.length ? 'text-rr-pink bg-rr-pink/10' : 'text-white/50 bg-white/5'}`}>
                                {c.trialSessions.length ? 'Now Trialling' : 'Trials Coming Soon'}
                            </span>
                            <BatIcon className="w-5 h-5 text-white/30" />
                        </div>
                        <h3 className="text-2xl font-black uppercase mb-4">{c.name}</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                <span className="text-white/75 text-sm font-medium">
                                    {c.venue}{c.suburb ? `, ${c.suburb}` : ''}
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Star className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                <span className="text-white/75 text-sm font-medium">
                                    {c.coachTitle}: <span className="text-white font-bold">{c.coach}</span>
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <CalendarDays className="w-4 h-4 text-rr-pink shrink-0 mt-0.5" />
                                {c.trialSessions.length ? (
                                    <div className="space-y-1.5">
                                        {c.trialSessions.map((sess, n) => (
                                            <div key={sess.id} className="text-white/75 text-sm font-medium">
                                                <span className="text-rr-light-pink font-bold">Trial {n + 1}</span>
                                                {' — '}{sess.label}
                                            </div>
                                        ))}
                                        {c.maxTrialSessions < c.trialSessions.length && (
                                            <div className="text-white/45 text-xs font-medium pt-0.5">
                                                Attend up to {c.maxTrialSessions} of these {c.trialSessions.length} sessions.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-white/75 text-sm font-medium">Trials Coming Soon</span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => onChooseCentre(c.slug)}
                            className="mt-auto inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-6 py-3.5 transition-colors"
                        >
                            {c.trialSessions.length ? 'Register for Trial' : 'Register Your Interest'} <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
            {/* Future centres */}
            <div className="grid sm:grid-cols-2 gap-5">
                {CENTRES.filter((c) => !c.active).map((c) => (
                    <div key={c.slug} className="bg-white/[0.03] border border-dashed border-white/15 rounded-2xl p-7 opacity-60">
                        <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-white/50 bg-white/5 rounded-full px-3 py-1.5 mb-4">
                            Coming 2027
                        </span>
                        <h3 className="text-2xl font-black uppercase mb-2 text-white/70">{c.name}</h3>
                        <p className="text-white/40 text-sm font-medium">{c.venue}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default TrialsSection;

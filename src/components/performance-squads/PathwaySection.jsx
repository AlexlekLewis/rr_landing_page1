import React from 'react';
import { motion } from 'framer-motion';
import { StumpsIcon, SelectionIcon, BatIcon, BallIcon } from './CricketIcons';
import { fadeUp, scrollTo, SectionHeading } from './shared';

const PathwaySection = () => (
    <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="The Pathway"
                title="Trial. Get Selected. Compete."
                sub="Performance Squad players earn their place at open trials and through performances. Players who are part of our T20 Elite and Pre-Season Programs are also eligible for Performance Squad and match selections."
            />
            <div className="grid sm:grid-cols-3 gap-5 mb-14">
                {[
                    {
                        n: '01',
                        icon: StumpsIcon,
                        title: 'Trial',
                        body: "Register, pay your trial fee, and take part at your centre. Our coaches assess skill, athleticism and attitude across the session.",
                    },
                    {
                        n: '02',
                        icon: SelectionIcon,
                        title: 'Selection',
                        body: 'Successful players are offered a squad place once the trial period closes. You will be told where you stand either way.',
                    },
                    {
                        n: '03',
                        icon: BatIcon,
                        title: 'Compete',
                        body: 'Pay your Registration Fee, train weekly with your squad, and go into selection for Power League rounds and external fixtures.',
                    },
                ].map((step, i) => (
                    <motion.div key={step.n} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.1}
                        className="bg-white/5 border border-white/10 rounded-2xl p-7">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl font-black text-rr-pink/30 leading-none">{step.n}</span>
                            <step.icon className="w-7 h-7 text-rr-pink" />
                        </div>
                        <h3 className="text-xl font-black uppercase mb-2">{step.title}</h3>
                        <p className="text-white/65 text-sm font-medium leading-relaxed">{step.body}</p>
                    </motion.div>
                ))}
            </div>

            {/* Squad structure */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10">
                <div className="flex items-start gap-4">
                    <BallIcon className="w-9 h-9 text-rr-pink shrink-0 mt-1" />
                    <div>
                        <h3 className="text-2xl font-black uppercase mb-3">How Each Squad Is Built</h3>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-3">
                            North Melbourne and South-East Melbourne Royals Academy Performance Squads field a{' '}
                            <span className="text-white font-bold">First XI</span> —
                            the squad's premier representative team. Alongside the First XI, additional
                            teams at various age groups and skill levels are assembled from the squad for fixtures in the{' '}
                            <button onClick={() => scrollTo('power-league')} className="text-rr-light-pink font-bold underline underline-offset-2 hover:text-rr-pink transition-colors">
                                RRA Power League
                            </button>{' '}
                            and matches against external opposition in showcase fixtures.
                        </p>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed">
                            That means every player in the squad gets meaningful game time at their
                            level — approximately 5-6 across the cricket season, with a clear pathway to
                            push for First XI selection and selection in Royals Group opportunities.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default PathwaySection;

import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Mail, Shield } from 'lucide-react';
import { fadeUp, scrollTo, SectionHeading } from './shared';

const PathwaySection = () => (
    <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
            <SectionHeading
                eyebrow="The Pathway"
                title="Two Ways In. One Standard."
                sub="Every Performance Squad player earns their place — through an open trial at their nearest centre, or by direct invitation from our coaches."
            />
            <div className="grid sm:grid-cols-2 gap-5 mb-14">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                    className="bg-white/5 border border-white/10 rounded-2xl p-7">
                    <ClipboardCheck className="w-8 h-8 text-rr-pink mb-4" />
                    <h3 className="text-xl font-black uppercase mb-2">Open Trial</h3>
                    <p className="text-white/65 text-sm font-medium leading-relaxed">
                        Register below, pay the trial fee, and show us what you've got at your
                        centre's trial session. Our coaches assess skill, athleticism, and attitude —
                        and successful players are offered a squad place.
                    </p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
                    className="bg-white/5 border border-white/10 rounded-2xl p-7">
                    <Mail className="w-8 h-8 text-rr-pink mb-4" />
                    <h3 className="text-xl font-black uppercase mb-2">By Invitation</h3>
                    <p className="text-white/65 text-sm font-medium leading-relaxed">
                        Standout players from our programs, clubs, and scouting network are invited
                        directly into a squad. If you've been invited, select "Invited" when you
                        register and include your invite reference if you were given one.
                    </p>
                </motion.div>
            </div>

            {/* Squad structure */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="bg-gradient-to-br from-rr-navy to-rr-dark border border-white/10 rounded-2xl p-7 sm:p-10">
                <div className="flex items-start gap-4">
                    <Shield className="w-9 h-9 text-rr-pink shrink-0 mt-1" />
                    <div>
                        <h3 className="text-2xl font-black uppercase mb-3">How Each Squad Is Built</h3>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed mb-3">
                            Every Performance Squad centre fields a <span className="text-white font-bold">First XI</span> —
                            the squad's premier representative team. Alongside the First XI, additional
                            teams are assembled from the squad for fixtures in the{' '}
                            <button onClick={() => scrollTo('power-league')} className="text-rr-light-pink font-bold underline underline-offset-2 hover:text-rr-pink transition-colors">
                                Power League
                            </button>{' '}
                            and matches against external opposition.
                        </p>
                        <p className="text-white/70 text-[15px] font-medium leading-relaxed">
                            That means every player in the squad gets meaningful game time at their
                            level — with a clear pathway to push for First XI selection.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

export default PathwaySection;

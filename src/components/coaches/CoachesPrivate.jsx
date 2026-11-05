import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COACH_ORDER, COACH_PROFILES, CENTRES } from '../coach-profile/coachProfiles';
import { Photo } from '../coach-profile/CPShared';

// "Private coaching with our coaches" on /coaches: the way into each coach's
// own page. Rendered only when VITE_COACH_PAGES=on (see CoachesPage.jsx).
const CoachesPrivate = () => (
    <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid gap-4 mb-10 max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide leading-[1.05] text-rr-dark">
                    Private coaching <span className="block text-rr-pink">with our coaches</span>
                </h2>
                <p className="text-lg font-medium text-rr-charcoal">
                    Book one-on-one or small-group sessions at Mickleham or Cranbourne North. Every Academy coach is a development coach first. Pick the one whose strengths fit what the player wants to work on.
                </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-7">
                {COACH_ORDER.map((slug) => {
                    const c = COACH_PROFILES[slug];
                    return (
                        <Link key={slug} to={`/coaches/${slug}`} className="group grid gap-2 min-w-0">
                            <Photo profile={c} className="rounded-xl aspect-[3/4]" />
                            <h3 className="mt-1 text-[17px] font-black uppercase tracking-wide text-rr-dark">{c.name}</h3>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-rr-pink">{c.card.strengths}</p>
                            <p className="text-sm font-medium text-rr-charcoal">{CENTRES[c.homeCentre].short}</p>
                            <span className="text-[13px] font-extrabold text-rr-blue group-hover:underline">See {c.first}’s page and free times →</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    </section>
);

export default CoachesPrivate;

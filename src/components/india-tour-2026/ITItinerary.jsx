import React from 'react';
import { motion } from 'framer-motion';
import { CAMP_PDF } from './itCopy';

// ---------------------------------------------------------------------------
// Day-by-day itinerary + the four support pillars, from the camp document.
//
// Neither was on the site before — the itinerary is the single most concrete
// thing a parent can read ("what does my kid actually do for six days?"), so it
// carries a lot of the selling. The document download sits at the bottom of this
// section too, where someone who has just read the detail is most likely to want
// the full booklet.
// ---------------------------------------------------------------------------

const ITItinerary = ({ copy }) => {
    const c = copy.pricing;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* ---------- The four support pillars ---------- */}
                <div className="max-w-3xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        {c.pillarsEyebrow}
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5"
                    >
                        {c.pillarsHeading} <span className="text-rr-pink">{c.pillarsHeadingAccent}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                    >
                        {c.pillarsLead}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                    {c.pillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.06 * i }}
                            className="bg-rr-navy rounded-2xl p-6"
                        >
                            <h3 className="text-base font-black text-white uppercase tracking-wide">
                                {p.title}
                            </h3>
                            <div className="w-8 h-px bg-rr-pink mt-3 mb-4" />
                            <p className="text-sm text-white/75 font-medium leading-relaxed">{p.body}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ---------- Day by day ---------- */}
                <div className="max-w-3xl mt-24">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3"
                    >
                        {c.itineraryEyebrow}
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5"
                    >
                        {c.itineraryHeading}{' '}
                        <span className="text-rr-pink">{c.itineraryHeadingAccent}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-rr-charcoal font-medium leading-relaxed"
                    >
                        {c.itineraryLead}
                    </motion.p>
                </div>

                <ol className="mt-10 space-y-0">
                    {c.itineraryDays.map((d, i) => {
                        const isTravel = i === 0 || i === c.itineraryDays.length - 1;
                        return (
                            <motion.li
                                key={d.when}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.03 * i }}
                                className="grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-8"
                            >
                                {/* Rail: a marker per day, joined by a line. */}
                                <div className="flex flex-col items-center">
                                    <span
                                        className={`w-3 h-3 rounded-full shrink-0 mt-2 ${
                                            isTravel ? 'bg-slate-300' : 'bg-rr-pink'
                                        }`}
                                    />
                                    {i < c.itineraryDays.length - 1 && (
                                        <span className="w-px flex-1 bg-slate-200 my-1" />
                                    )}
                                </div>
                                <div className="pb-8">
                                    <p className="text-[11px] font-bold text-rr-charcoal/60 uppercase tracking-widest">
                                        {d.when}
                                    </p>
                                    <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mt-1">
                                        {d.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-rr-charcoal font-medium leading-relaxed mt-2 max-w-2xl">
                                        {d.body}
                                    </p>
                                </div>
                            </motion.li>
                        );
                    })}
                </ol>

                {/* ---------- The full document ---------- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 bg-rr-navy rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">
                            {copy.hero.downloadLabel}
                        </h3>
                        <p className="text-sm text-white/70 font-medium leading-relaxed mt-2 max-w-xl">
                            {copy.hero.downloadSub(CAMP_PDF.sizeLabel)} It is a large file, so on a phone
                            you may want to be on wi-fi.
                        </p>
                    </div>
                    <a
                        href={CAMP_PDF.href}
                        download={CAMP_PDF.filename}
                        data-cta="itinerary-download-pdf"
                        className="group bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 inline-flex items-center gap-3 justify-center shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                        </svg>
                        Download PDF
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default ITItinerary;

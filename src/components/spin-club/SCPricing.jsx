import React from 'react';
import { PRICES, INCLUDED, HOW_PAYING_WORKS, PROGRAM, GST_NOTE, SQUAD_NOTE } from './scOptions';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

// 9 Oct 2026: the 8-night block prices came off. One night at a time is the only
// thing sold from this page now, and Performance Squad members are sent to their
// head coach rather than being given a price here.
const SCPricing = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                What it costs
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                One price,<br className="hidden md:block" /> one night at a time
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-4">
                You pay for each Wednesday you come to. There is no block to buy and nothing to
                commit to up front — come to one night, or come to all {PROGRAM.weeks} of them.
            </p>
            {/* ACL: a consumer page must show the total payable, so the big number
                is GST-inclusive and this says so once, up front. */}
            <p className="text-sm font-black text-rr-dark uppercase tracking-wide mb-12">
                {GST_NOTE}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start mb-8">
                {PRICES.map((p) => (
                    <div
                        key={p.key}
                        className="lg:col-span-2 rounded-3xl p-8 md:p-10 flex flex-col bg-rr-dark text-white ring-4 ring-rr-pink"
                    >
                        <p className="text-sm font-black uppercase tracking-widest text-rr-pink mb-5">
                            {p.question}
                        </p>
                        <p className="text-6xl font-black tracking-tight leading-none mb-2">
                            {p.headline}
                        </p>
                        <p className="text-[15px] font-bold text-white mb-1.5">{p.unit}</p>
                        <p className="text-[13px] font-semibold text-white/55 mb-5">
                            {p.exGst} &middot; GST included above
                        </p>
                        <p className="text-[15px] font-semibold text-white/85 mb-4">{p.perNight}</p>
                        <p className="text-[14px] font-medium leading-relaxed text-white/60 mb-7">
                            {p.who}
                        </p>
                        <button
                            onClick={() => scrollTo('apply')}
                            className="mt-auto w-full bg-rr-pink hover:bg-rr-light-pink text-white font-bold uppercase tracking-widest px-6 py-4 rounded-full transition-colors duration-300"
                        >
                            Sign up for a night
                        </button>
                    </div>
                ))}

                {/* The asterisk. Squad members never buy from this page. */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <div className="rounded-3xl border-2 border-rr-pink/35 bg-rr-pink/5 p-8">
                        <p className="text-sm font-black text-rr-pink uppercase tracking-widest mb-3">
                            * In a Performance Squad?
                        </p>
                        <p className="text-[15px] text-rr-dark/80 font-semibold leading-relaxed">
                            {SQUAD_NOTE.members}
                        </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
                        <p className="text-base font-black text-rr-dark uppercase tracking-wide mb-2">
                            {SQUAD_NOTE.joiners}
                        </p>
                        <p className="text-[14px] text-rr-dark/65 font-medium leading-relaxed mb-5">
                            Performance Squads are our season-long training groups. Spin Club sits
                            alongside them — it does not replace them.
                        </p>
                        <a
                            href={SQUAD_NOTE.href}
                            className="inline-flex items-center gap-2 text-rr-blue hover:text-rr-pink font-black uppercase tracking-widest text-sm transition-colors duration-300"
                        >
                            {SQUAD_NOTE.linkLabel}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-6 mt-14">
                What you get for it
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
                {INCLUDED.map(([title, detail]) => (
                    <div key={title} className="border-t-2 border-rr-pink/30 pt-4">
                        <p className="text-base font-black text-rr-dark uppercase tracking-wide mb-1.5">
                            {title}
                        </p>
                        <p className="text-[14px] text-rr-dark/65 font-medium leading-relaxed">{detail}</p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-black text-rr-dark uppercase tracking-tight mb-2">
                    How signing up works
                </h3>
                <p className="text-[15px] text-rr-dark/70 font-medium mb-7 max-w-2xl">
                    Sign up, pay for the night, turn up. There is nothing to commit to beyond the
                    Wednesday you picked.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {HOW_PAYING_WORKS.map(([title, detail], i) => (
                        <div key={title}>
                            <p className="text-3xl font-black text-rr-pink/25 leading-none mb-2">
                                {String(i + 1).padStart(2, '0')}
                            </p>
                            <p className="text-sm font-black text-rr-dark uppercase tracking-wide mb-1.5">
                                {title}
                            </p>
                            <p className="text-[13.5px] text-rr-dark/65 font-medium leading-relaxed">{detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

export default SCPricing;

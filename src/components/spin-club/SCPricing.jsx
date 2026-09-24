import React from 'react';
import { PRICES, INCLUDED, HOW_PAYING_WORKS, PROGRAM } from './scOptions';

const SCPricing = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                What it costs
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                Two prices, plus one<br className="hidden md:block" /> for a single night
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-12">
                You pay for the whole block of {PROGRAM.weeks} Wednesday nights. Players already in
                a Royals Academy Performance Squad pay less. If you would rather try one night
                first, you can do that instead.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {PRICES.map((p) => (
                    <div
                        key={p.key}
                        className={`rounded-3xl p-8 flex flex-col ${
                            p.feature
                                ? 'bg-rr-dark text-white ring-4 ring-rr-pink'
                                : 'bg-slate-50 border border-slate-200 text-rr-dark'
                        }`}
                    >
                        <p className="text-sm font-black uppercase tracking-widest text-rr-pink mb-5 min-h-[2.5rem]">
                            {p.question}
                        </p>
                        <p className="text-5xl font-black tracking-tight leading-none mb-2">
                            {p.headline}
                        </p>
                        <p className={`text-[15px] font-bold mb-4 ${p.feature ? 'text-white' : 'text-rr-dark'}`}>
                            {p.unit}
                        </p>
                        <p className={`text-[15px] font-semibold mb-4 ${p.feature ? 'text-white/85' : 'text-rr-dark/70'}`}>
                            {p.perNight}
                        </p>
                        <p className={`text-[14px] font-medium leading-relaxed mt-auto ${p.feature ? 'text-white/60' : 'text-rr-dark/55'}`}>
                            {p.who}
                        </p>
                    </div>
                ))}
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
                    When do I actually pay?
                </h3>
                <p className="text-[15px] text-rr-dark/70 font-medium mb-7 max-w-2xl">
                    Not yet. Nothing is charged until you have been offered a place and said yes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

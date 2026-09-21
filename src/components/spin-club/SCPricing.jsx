import React from 'react';
import { PRICES, PROGRAM } from './scOptions';

const SCPricing = () => (
    <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                What it costs
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                Three ways to pay
            </h2>
            <p className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed max-w-3xl mb-12">
                Each night is {PROGRAM.sessionLength} on the floor. Players already in a Royals
                Academy Performance Squad pay the lower rate. You can also pay for one night at a
                time if you would rather try it first.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRICES.map((p) => (
                    <div
                        key={p.key}
                        className={`rounded-3xl p-8 flex flex-col ${
                            p.key === 'squad'
                                ? 'bg-rr-dark text-white'
                                : 'bg-slate-50 border border-slate-200 text-rr-dark'
                        }`}
                    >
                        <p
                            className={`text-xs font-black uppercase tracking-widest mb-4 ${
                                p.key === 'squad' ? 'text-rr-pink' : 'text-rr-pink'
                            }`}
                        >
                            {p.label}
                        </p>
                        <p className="text-4xl font-black tracking-tight leading-none mb-1">
                            {p.perSession}
                        </p>
                        <p
                            className={`text-sm font-bold mb-5 ${
                                p.key === 'squad' ? 'text-white/60' : 'text-rr-dark/50'
                            }`}
                        >
                            per night &middot; {p.perHour}
                        </p>
                        <p
                            className={`text-[15px] font-semibold mb-3 ${
                                p.key === 'squad' ? 'text-white' : 'text-rr-dark'
                            }`}
                        >
                            {p.block}
                        </p>
                        <p
                            className={`text-[14px] font-medium leading-relaxed ${
                                p.key === 'squad' ? 'text-white/70' : 'text-rr-dark/60'
                            }`}
                        >
                            {p.who}
                        </p>
                    </div>
                ))}
            </div>

            <p className="text-[13px] text-rr-dark/50 font-medium mt-6 max-w-3xl">
                Nothing is paid now. You are applying for a place, and we will send you the payment
                details once the head coach has picked the group and you have told us you want it.
            </p>
        </div>
    </section>
);

export default SCPricing;

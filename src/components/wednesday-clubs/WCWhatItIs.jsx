import React from 'react';

const WCWhatItIs = ({ club }) => {
    const { why } = club;

    return (
        <section className="bg-white py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">
                    {why.kicker}
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-6">
                    {why.headline[0]}<br className="hidden md:block" /> {why.headline[1]}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 mb-16">
                    <div className="lg:col-span-3">
                        {why.body.map((p, i) => (
                            <p key={i} className="text-base md:text-lg text-rr-dark/70 font-medium leading-relaxed mb-5">
                                {p}
                            </p>
                        ))}
                        <p className="text-base md:text-lg text-rr-dark font-semibold leading-relaxed">
                            {why.close}
                        </p>
                    </div>

                    {/* How this club sits next to Spin Club on the same Wednesday night. */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-50 border-l-4 border-rr-pink rounded-r-2xl p-7 h-full flex flex-col justify-center">
                            <p className="text-sm font-black text-rr-pink uppercase tracking-widest mb-3">
                                {why.aside.title}
                            </p>
                            <p className="text-lg md:text-xl text-rr-dark font-bold leading-relaxed mb-5">
                                {why.aside.body}
                            </p>
                            <a
                                href="/spin-club"
                                className="text-sm font-black text-rr-dark uppercase tracking-widest underline underline-offset-4 hover:text-rr-pink transition-colors"
                            >
                                See Spin Club
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-6">
                    What we work on
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {club.pillars.map((b, i) => (
                        <div key={b.title} className="border-t-2 border-rr-pink/30 pt-5">
                            <p className="text-5xl font-black text-rr-pink/20 leading-none mb-3">
                                {String(i + 1).padStart(2, '0')}
                            </p>
                            <h3 className="text-lg font-black text-rr-dark uppercase tracking-wide mb-3">
                                {b.title}
                            </h3>
                            <p className="text-[15px] text-rr-dark/70 font-medium leading-relaxed">{b.body}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 bg-rr-dark rounded-3xl p-8 md:p-10">
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-5">
                        A Wednesday night, start to finish
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {club.night.map(([t, d]) => (
                            <div key={t}>
                                <p className="text-sm font-black text-rr-pink uppercase tracking-widest mb-2">{t}</p>
                                <p className="text-[14px] text-white/70 font-medium leading-relaxed">{d}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-[13px] text-white/50 font-medium mt-6">
                        {club.time} on a {club.day} night. {club.sessionLength} on the floor,
                        for {club.weeks} weeks.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WCWhatItIs;

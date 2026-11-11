import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { money } from '../booking/booking-model';
import { createPublicClient } from '../booking/public-client';

export default function PCPricing() {
    const [catalog, setCatalog] = useState(undefined);

    useEffect(() => {
        const controller = new AbortController();
        createPublicClient().catalog(controller.signal)
            .then(result => { if (!controller.signal.aborted) setCatalog(result); })
            .catch(() => { if (!controller.signal.aborted) setCatalog(null); });
        return () => controller.abort();
    }, []);

    return (
        <section className="bg-slate-50 py-16 md:py-24" aria-labelledby="centre-session-prices">
            <div className="mx-auto max-w-6xl px-6">
                <h2 id="centre-session-prices" className="mb-3 text-3xl font-black tracking-tight text-rr-dark md:text-5xl">Session prices</h2>
                {catalog ? (
                    <>
                        <p className="mb-6 text-rr-charcoal">All prices incl. GST.</p>
                        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                <dt className="font-bold text-rr-dark">One-on-one</dt>
                                <dd className="mt-2 text-rr-charcoal">
                                    {catalog.prices.one_on_one_hour_cents == null ? 'Check current prices in booking.' : `${money(catalog.prices.one_on_one_hour_cents)} per hour`}
                                </dd>
                            </div>
                            {catalog.group_sizes.map(size => (
                                <div key={size} className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <dt className="font-bold text-rr-dark">Group of {size}</dt>
                                    <dd className="mt-2 text-rr-charcoal">
                                        {catalog.prices.group_player_hour_cents[size] == null ? 'Check current prices in booking.' : `${money(catalog.prices.group_player_hour_cents[size])} per player per hour`}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        {catalog.block_discount.percent > 0 && (
                            <p className="mt-6 font-semibold text-rr-dark">
                                {catalog.block_discount.percent}% off every session when you book {catalog.block_discount.min_sessions} or more together.
                            </p>
                        )}
                    </>
                ) : (
                    <p role="status" className="text-rr-charcoal">
                        {catalog === undefined ? 'Loading session prices…' : 'Open booking to see current session prices.'}
                    </p>
                )}
                <Link className="mt-6 inline-flex min-h-11 items-center font-bold text-rr-dark underline underline-offset-4" to="/book?centre=mickleham">
                    Check times and prices at Mickleham
                </Link>
            </div>
        </section>
    );
}

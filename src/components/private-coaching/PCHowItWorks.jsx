import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
    {
        title: 'Choose a time or a coach',
        detail: 'Pick a one-on-one session or bring a group of two to four players. Sessions run for 1, 1½ or 2 hours.',
    },
    {
        title: 'Request your sessions',
        detail: 'Choose a single session or several weekly sessions. You’ll see the dates and total price before you send the request. The Academy confirms your booking after checking with the centre.',
    },
    {
        title: 'Meet your coach',
        detail: 'Your first session with a coach is a consultation at the usual session price. Your coach will use it to understand what you want to work on.',
    },
];

export default function PCHowItWorks() {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="mb-8 text-3xl font-black tracking-tight text-rr-dark md:text-5xl">How to request a session</h2>
                <ol className="grid gap-8 md:grid-cols-3">
                    {steps.map(({ title, detail }) => (
                        <li key={title} className="border-t-2 border-slate-200 pt-4">
                            <h3 className="mb-2 text-xl font-bold text-rr-dark">{title}</h3>
                            <p className="leading-relaxed text-rr-charcoal">{detail}</p>
                        </li>
                    ))}
                </ol>
                <p className="mt-8 leading-relaxed text-rr-charcoal">A parent or guardian is required for players under 18.</p>
                <p className="mt-3 leading-relaxed text-rr-charcoal">
                    Private coaching is also available at{' '}
                    <Link className="inline-flex min-h-11 items-center font-bold text-rr-dark underline underline-offset-4" to="/book?centre=cranbourne-north">
                        Cranbourne North
                    </Link>.
                </p>
            </div>
        </section>
    );
}

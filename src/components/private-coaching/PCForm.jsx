import React from 'react';
import AskUs from '../booking/AskUs';
export default function PCForm() {
    return <section className="bg-rr-dark px-5 py-16 md:py-24 ph-no-capture"><div className="mx-auto max-w-2xl"><AskUs centre="mickleham" sourcePage="/mickleham" /><p className="mt-6 text-center text-white"><a href="/book?centre=mickleham" className="inline-flex min-h-12 items-center font-bold underline underline-offset-4">Or find a private-coaching time at Mickleham →</a></p></div></section>;
}

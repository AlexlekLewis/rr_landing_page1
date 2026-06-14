import React from 'react';
import { ArrowRight } from 'lucide-react';

// "From the head coach" manifesto — the validation beat for players/parents who
// already get it. Voice: Alex Lewis, 15 years in rep cricket — warm, direct,
// club-insider, NOT clipped AI fragments. Thesis: the conservative-player epidemic,
// the hidden truth that individuality (done well) is celebrated, and the dare to
// redefine the game like the modern greats. Speaks to the player AND the paying parent.
const ManifestoSection = ({ onApply }) => {
    return (
        <section className="relative bg-rr-dark text-white py-16 md:py-24 overflow-hidden">
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 15% 30%, rgba(225,31,143,0.16) 0%, rgba(0,0,0,0) 55%)' }}
            />
            <div className="relative z-10 max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
                {/* Copy */}
                <div className="order-2 md:order-1">
                    <div className="text-rr-pink font-black uppercase tracking-[0.25em] text-[11px] mb-4">From the head coach</div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.05] mb-6">
                        The future of the game belongs to the <span className="text-rr-pink">brave</span>.
                    </h2>
                    <div className="space-y-4 text-white/75 text-[15px] md:text-base leading-relaxed">
                        <p>
                            Fifteen years in rep cricket taught me a truth no one says out loud: there&apos;s an epidemic of
                            conservative players — good cricketers, talented kids — who never become who they could be, because
                            they&apos;re too afraid of getting out to express who they really are.
                        </p>
                        <p>
                            Yes, there are laws you can&apos;t escape. Playing straight against the red ball will always be
                            non-negotiable. But here&apos;s the hidden truth: <span className="text-white font-semibold">individuality, done
                            really well, is always celebrated.</span> Be the best version of you — and make the runs and take the
                            wickets to back it — and you don&apos;t just make teams, you redefine them. Sooryavanshi did it. Smith did
                            it. Warner did it. And they&apos;re only the tip of the iceberg of the modern cricketer.
                        </p>
                        <p>
                            The Power Game is where you build it — <span className="text-white font-semibold">power on demand, a 360&deg;
                            game, and the confidence to use it when it matters.</span> The Royals way. Eight weeks of Power Pre-Season, while
                            everyone else is still waiting for the season to start.
                        </p>
                    </div>
                    <div className="mt-6 text-white/55 text-sm font-semibold italic">— Alex Lewis, Head Coach · Rajasthan Royals Academy Melbourne</div>
                    <button
                        onClick={onApply}
                        className="mt-7 group inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-sm rounded-full px-7 py-3.5 transition-all hover:shadow-[0_0_24px_rgba(229,6,149,0.45)]"
                    >
                        Claim your spot
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Proof image */}
                <div className="order-1 md:order-2">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 max-w-sm mx-auto md:max-w-none">
                        <img
                            src="/assets/vaibhav-100-celebration.jpg"
                            alt="Vaibhav Sooryavanshi celebrating a century for the Rajasthan Royals"
                            className="w-full object-cover aspect-[4/5]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="text-white font-black uppercase tracking-wide text-sm">Vaibhav Sooryavanshi</div>
                            <div className="text-white/65 text-xs font-semibold">Rajasthan Royals — living proof of the power method</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManifestoSection;

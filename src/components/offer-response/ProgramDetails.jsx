import React from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Map, ArrowRight, ShieldCheck, Calendar, Clock } from 'lucide-react';

// Reusable animated section component
const DetailSection = ({ title, prefix, children, align = 'left', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay }}
        className={`flex flex-col ${align === 'center' ? 'items-center text-center' : ''} mb-32`}
    >
        {prefix && (
            <span className="text-rr-pink font-bold tracking-widest uppercase text-sm mb-4 block">
                {prefix}
            </span>
        )}
        <h3 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-widest leading-tight mb-8">
            {title}
        </h3>
        <div className={`text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-4xl space-y-6 ${align === 'center' ? 'mx-auto' : ''}`}>
            {children}
        </div>
    </motion.div>
);

const ProgramDetails = () => {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 border border-slate-100"></div>
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-rr-pink/5 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">

                <div className="mb-32 text-center max-w-3xl mx-auto">
                    <p className="text-xl text-slate-500 font-medium leading-relaxed italic bg-emerald-500/20 text-emerald-900 px-4 py-2 rounded-xl border border-emerald-500/30">
                        "So that you can begin to prepare for both the assessment session and the possibility of being offered a place, please find below details of the program including program content, training days & times and the cost of this premium program."
                    </p>
                </div>

                <DetailSection title={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">EXPLORE &bull; CHALLENGE &bull; EXECUTE</span>} prefix={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">The Philosophy</span>}>
                    <p><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block">We believe that when you want to learn a skill, you first learn the full range of everything you're capable of. Then you learn how to use decision-making and match awareness to apply those skills. Then you perform under pressure.</span></p>
                    <p><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block">Cricket provides the perfect environment for this. Our framework gives young players the space to discover what they can do, the structure to sharpen when and why, and the competitive pressure to prove they can deliver.</span></p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {[
                            { title: 'EXPLORE', weeks: 'Weeks 1–4', sub: 'Learn your full range.', text: 'New shots, new deliveries, creative freedom. Build the complete toolkit without fear of failure.' },
                            { title: 'CHALLENGE', weeks: 'Weeks 5–8', sub: 'Sharpen your decisions.', text: 'Tactical constraints, match awareness, game plans. Learn when and why to use each skill.' },
                            { title: 'EXECUTE', weeks: 'Weeks 9–12', sub: 'Prove it under pressure.', text: 'Match scenarios, live bowling, scoreboard pressure. Perform when it matters.' }
                        ].map((phase, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:border-rr-pink/50 transition-colors">
                                <h4 className="text-rr-blue font-black uppercase tracking-wider mb-2"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">{phase.title}</span></h4>
                                <span className="text-xs font-bold text-rr-pink bg-amber-500/30 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-widest">{phase.weeks}</span>
                                <p className="font-bold text-rr-dark mt-6 mb-2"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">{phase.sub}</span></p>
                                <p className="text-sm text-slate-600"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">{phase.text}</span></p>
                            </div>
                        ))}
                    </div>
                </DetailSection>

                <DetailSection title={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">Direct Access to the Rajasthan Royals</span>} prefix={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">The Exclusivity</span>} align="left">
                    <p><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block">This isn't a franchise that licensed its name and walked away. The Rajasthan Royals are actively embedded in this program — reviewing players, visiting Melbourne, and providing access that doesn't exist through any other pathway in Australia.</span></p>

                    <ul className="space-y-6 mt-8">
                        {[
                            { title: 'Siddhartha Lahiri', text: "The Royals Group Head of International Player Development visits Melbourne twice per year to assess players, review coaching quality and oversee the program first-hand. His first visit is March 2026 for the program's inaugural player assessment." },
                            { title: 'In-Person Masterclasses', text: "Rajasthan Royals franchise coaches travel to Melbourne to deliver masterclass sessions directly to our players. These are not online webinars — they are hands-on, in-person sessions with coaches from the IPL ecosystem." },
                            { title: 'Current Royals Player', text: "A live session with a current Rajasthan Royals contracted player during the IPL, SA20 or CPL season — connecting your child directly to someone playing at the highest level of T20 cricket in the world." },
                            { title: 'Paarl & Barbados DOC', text: "A session with the Director of Cricket or Head Coach from Paarl Royals (SA20) and Barbados Royals (CPL) — providing exposure to the wider Royals Group network beyond the IPL." }
                        ].map((item, i) => (
                            <li key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                                <ShieldCheck className="w-8 h-8 text-rr-pink shrink-0 mt-1" />
                                <div>
                                    <h5 className="text-xl font-bold text-rr-dark mb-2"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">{item.title}</span></h5>
                                    <p className="text-base text-slate-600"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">{item.text}</span></p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </DetailSection>

                <DetailSection title={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">The Player DNA Card</span>} prefix={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">The Innovation</span>}>
                    <p className="font-bold text-2xl text-rr-dark mb-4"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Who is your child as a cricketer?</span></p>
                    <p><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Most academies tell you your child is "going well" or "needs to work on their batting." That's not a development plan. That's a guess.</span></p>
                    <p><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Within the first two weeks of the program, every player receives a Player DNA Card — a proprietary assessment system exclusive to the Rajasthan Royals Academy Melbourne. Built by our coaching team, it paints a complete picture of who your child is as a cricketer right now, and where they're heading. No other academy in Australia offers this.</span></p>

                    <div className="bg-gradient-to-br from-rr-blue to-rr-dark rounded-3xl p-8 md:p-12 text-white mt-12 shadow-2xl relative overflow-hidden">
                        <Activity className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
                        <h4 className="text-2xl font-black uppercase tracking-widest mb-6"><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">What the DNA Card captures:</span></h4>
                        <ul className="space-y-4 text-slate-300">
                            <li className="flex items-start gap-3"><ArrowRight className="w-5 h-5 text-rr-pink shrink-0" /> <span><strong className="text-white">A batting archetype</strong> — is your child a Firestarter who dominates the Powerplay? An Accumulator who builds innings? An Enforcer? A Game Manager? A Dual Threat?</span></li>
                            <li className="flex items-start gap-3"><ArrowRight className="w-5 h-5 text-rr-pink shrink-0" /> <span><strong className="text-white">A bowling archetype</strong> — Wicket Hunter, Weapon, Squeeze, or Developer. Not just "medium-pacer" — a defined role with purpose.</span></li>
                            <li className="flex items-start gap-3"><ArrowRight className="w-5 h-5 text-rr-pink shrink-0" /> <span><strong className="text-white">T20 phase effectiveness</strong> — how they perform specifically in the Powerplay, Middle Overs and Death Overs, with both bat and ball. This is where modern cricket is won and lost.</span></li>
                            <li className="flex items-start gap-3"><ArrowRight className="w-5 h-5 text-rr-pink shrink-0" /> <span><strong className="text-white">Skill domain scores</strong> across Technical, Game IQ, Mental Performance and Physical Attributes.</span></li>
                            <li className="flex items-start gap-3"><ArrowRight className="w-5 h-5 text-rr-pink shrink-0" /> <span><strong className="text-white">Top 3 strengths and top 3 development priorities</strong> — specific, actionable, and honest.</span></li>
                        </ul>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-lg italic font-medium"><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">"This is how IPL franchises evaluate talent. The Player DNA Card brings that same framework to your child — and it's only available through the Rajasthan Royals Academy Melbourne."</span></p>
                        </div>
                    </div>
                </DetailSection>

                <DetailSection title={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">Individual Development Plans</span>} prefix={<span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">The Roadmap</span>}>
                    <p><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">The DNA Card isn't a report card that goes on the fridge. It's the starting point for a personalised <strong className="text-rr-dark underline decoration-rr-pink decoration-2 underline-offset-4">Individual Development Plan (IDP)</strong> — a written, measurable, week-by-week plan that tells your child exactly what they're working on, why it matters, and how they'll know when they've improved.</span></p>
                    <p className="mt-4 font-bold text-rr-blue"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">No other cricket program in Australia provides this.</span></p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                        <div>
                            <Map className="w-10 h-10 text-rr-blue mb-4" />
                            <h5 className="text-xl font-black text-rr-dark uppercase mb-2"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Targeted Growth</span></h5>
                            <p className="text-base text-slate-600"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">The DNA Card reveals where the gaps are. If a player's technical skills are strong but their T20 game intelligence is low, the IDP doesn't say "improve batting." It says "technical foundation is solid — the priority is learning when and where to use those skills under match pressure."</span></p>
                        </div>
                        <div>
                            <Target className="w-10 h-10 text-rr-blue mb-4" />
                            <h5 className="text-xl font-black text-rr-dark uppercase mb-2"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Archetype Trajectory</span></h5>
                            <p className="text-base text-slate-600"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Archetype profiling sets the direction. A player's current archetype and their target archetype create a trajectory. The IDP maps exactly what needs to change — technically, tactically and mentally — to get there.</span></p>
                        </div>
                    </div>
                </DetailSection>

                {/* THE COMMITMENT & PRICE BLOCK */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 border-4 border-rr-dark p-8 md:p-16 rounded-3xl bg-white shadow-2xl relative"
                >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rr-dark text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-xl">
                        <span className="bg-amber-500/30 text-amber-200 px-2 rounded border border-amber-500/30 inline-block">The Commitment</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-3xl font-black text-rr-dark uppercase mb-6"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Your Weekly Structure</span></h3>
                            <p className="text-lg text-slate-600 mb-8"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Each player trains for two hours, twice per week — one weekday session and one weekend session. Squads are allocated to a consistent block across the 12 weeks.</span></p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                        <Calendar className="w-6 h-6 text-rr-pink" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-rr-dark"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Tuesday & Thursday (Weekday)</span></p>
                                        <p className="text-sm text-slate-500"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">5:30 – 9:30pm (Allocated Slot)</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-rr-pink" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-rr-dark"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">Saturday & Sunday (Weekend)</span></p>
                                        <p className="text-sm text-slate-500"><span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">2:00 – 6:00pm (Allocated Slot)</span></p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-rr-blue mt-6 uppercase tracking-wider">
                                <span className="bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded inline-block px-1">48 HOURS ACROSS 12 WEEKS</span>
                            </p>
                        </div>

                        <div className="bg-rr-dark text-white rounded-2xl p-8 text-center h-full flex flex-col justify-center">
                            <h3 className="text-2xl font-black uppercase tracking-wider mb-8 text-rr-pink"><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">Program Investment</span></h3>

                            <div className="text-6xl md:text-7xl font-black mb-4">
                                <span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-2">$3,990</span>
                            </div>
                            <p className="text-xl font-bold uppercase tracking-wider text-slate-300 mb-8"><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">Inc. GST</span></p>

                            <p className="text-lg text-slate-400 font-medium max-w-sm mx-auto">
                                <span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">All Included. Nothing Extra.</span>
                            </p>

                            <div className="mt-8 pt-8 border-t border-white/10 text-sm text-slate-400 space-y-2">
                                <p><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">48 hours of coaching.</span></p>
                                <p><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">DNA profiling & Individual development plans.</span></p>
                                <p><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">In-person masterclasses with Royals coaches.</span></p>
                                <p><span className="bg-amber-500/50 text-amber-100 border border-amber-500/30 rounded inline-block px-1">Official Royals apparel.</span></p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-32 text-center pb-12">
                    <h3 className="text-3xl font-black text-rr-dark uppercase mb-6"><span className="bg-amber-500/20 text-amber-900 px-2 rounded border border-amber-500/30 inline-block">Discover. Develop. Elevate.</span></h3>
                </div>

            </div>
        </section>
    );
};

export default ProgramDetails;

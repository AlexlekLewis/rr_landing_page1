import React from 'react';
import { motion } from 'framer-motion';

const leadershipCoaches = [
    {
        name: "Siddhartha Lahiri",
        role: "Rajasthan Royals Group Head of Int'l Player Development & Assistant Coach to Paarl, Rajasthan and Barbados Royals",
        image: "/assets/rra/headcoach-lahiri.png",
        bio: "Siddhartha runs the Rajasthan Royals' global talent network. He oversees player scouting and development across every Royals Academy in the world — meaning Melbourne's best young players have a direct line to one of the IPL's biggest franchises.",
    },
    {
        name: "Andy Crook",
        role: "Director of Cricket, Rajasthan Royals Academy Melbourne",
        image: "/assets/coaches/andy-crook.jpg",
        bio: "Andy runs the operations behind the program. His deep experience in professional cricket, the business of sport and coaching means every session is planned, every drill has a purpose, and every player gets the standard the Rajasthan Royals expect.",
    },
    {
        name: "Alex Lewis",
        role: "Rajasthan Royals Academy Melbourne Elite Program Head Coach",
        image: "/assets/coaches/alex-lewis.jpg",
        bio: "Over 20 years coaching cricketers through Premier Cricket and representative pathways. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors.",
    },
];

const eliteCoaches = [
    {
        name: "Matthew Spoors",
        role: "Batting — Power Hitting & 360",
        image: "/assets/coaches/matthew-spoors.jpg",
        bio: "BBL star and T20 International centurion. From Perth Scorchers to Melbourne Renegades, Matthew has scored runs at the highest level under the most pressure. He brings firsthand knowledge of what it takes to perform on the big stage — the kind of experience you simply can't get from textbooks.",
    },
    {
        name: "Jarryd Rogers",
        role: "Batting — Power Hitting Mechanics",
        image: "/assets/coaches/jarryd-rogers.jpg",
        bio: "Victorian State Baseball batting coach and power hitting specialist. Jarryd brings a unique cross-sport perspective on how to generate bat speed and hit the ball harder. His approach gives players a genuine, measurable edge at the crease.",
    },
    {
        name: "Harkirat Bajwa",
        role: "Bowling — Spin",
        image: "/assets/coaches/harkirat-bajwa.jpg",
        bio: "Australian U19 representative and Premier Cricket competitor, Harkirat is a modern spinner who turns the ball both ways with real accuracy. He understands how spin bowling works inside and out, and teaches young bowlers the variations and tactics that win matches.",
    },
    {
        name: "Adelaide Campion",
        role: "Program Coach",
        image: "/assets/coaches/adelaide-campion.jpg",
        bio: "Inaugural captain of Carlton Cricket Club. Premiership winner with Ringwood. Malaysian Super Slam title holder. Member of Australia's Indoor World Cup-winning squads. Currently Head Coach of the Australian U18 Indoor Cricket Team and Victorian U18 Indoor Cricket Team. 15+ years of relentless commitment to the game at the highest level.",
    },
    {
        name: "Glenn Butterworth",
        role: "Program Coach",
        image: "/assets/coaches/glenn-butterworth.jpg",
        bio: "27 years of coaching excellence spanning two continents. A Collingwood CC wicket keeper-batsman who won two HDCA batting averages, Glenn completed his Level 2 Coaching at Lord's Cricket Ground and coached across Middlesex and the UK. Now driving female pathways development at Fitzroy Doncaster.",
    },
];

const programTeam = [
    {
        name: "Joel Ried",
        role: "Program Coach",
        image: "/assets/coaches/joel-ried.jpg",
        bio: "A passionate and technically sharp coach who thrives in developing young cricketers through structured, high-intensity sessions. Joel's energy on the training ground is infectious — he demands excellence and rewards effort in equal measure.",
    },
    {
        name: "Bret Cole",
        role: "Talent Scout",
        image: "/assets/coaches/bret-cole.jpg",
        bio: "Decades of experience identifying and nurturing emerging talent across Victoria's cricket landscape. Bret's trained eye for potential means every player isn't just being coached — they're being watched by someone who knows exactly what pathways and selectors are looking for.",
    },
    {
        name: "Zac Macciocca",
        role: "Program Assistant Coach",
        image: "/assets/coaches/zac-macciocca.jpg",
        bio: "A Fitzroy Doncaster stalwart since 2017/18 and Dowling Shield coach for over six years. Zac combines club-cricket grit with genuine technical knowledge, bringing an energetic and relatable coaching presence that connects with young players from day one.",
    },
    {
        name: "Ikroop Dhanoa",
        role: "Program Assistant Coach",
        image: "/assets/coaches/ikroop-dhanoa.jpg",
        bio: "A dynamic young coach whose passion for player development is matched by his deep understanding of modern T20 cricket. Ikroop brings cultural diversity and fresh tactical thinking to the coaching group, helping every athlete feel seen and supported.",
    },
    {
        name: "Rittin Raman",
        role: "Program Assistant Coach",
        image: "/assets/coaches/rittin-raman.jpg",
        bio: "Driven by a genuine love for developing cricketers at every level. Rittin's enthusiasm is contagious — he brings high energy, technical precision, and an unwavering commitment to helping young players unlock their potential on and off the pitch.",
    },
];

const CoachCard = ({ coach, size = 'default' }) => {
    const sizeClasses = size === 'large'
        ? 'aspect-[3/4]'
        : 'aspect-[3/4]';

    return (
        <div className={`group relative w-full ${sizeClasses} rounded-2xl overflow-hidden cursor-pointer shadow-lg`}>
            {/* Background Image - Desaturated by default, coloured on hover */}
            <img
                src={coach.image}
                alt={coach.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-rr-dark', 'to-rr-blue/80');
                }}
            />

            {/* Gradient Overlay for text readability at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>

            {/* Default State Content (Name & Role) */}
            <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500 group-hover:translate-y-4 group-hover:opacity-0">
                <h3 className="text-2xl font-black text-white uppercase tracking-wide leading-none mb-1">{coach.name}</h3>
                <p className="text-rr-pink font-bold text-sm tracking-widest uppercase">{coach.role}</p>
            </div>

            {/* Hover State Overlay (Bio) */}
            <div className="absolute inset-0 bg-rr-dark/90 backdrop-blur-sm p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-8 group-hover:translate-y-0 text-center overflow-y-auto">
                <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2">{coach.name}</h3>
                <p className="text-rr-pink font-bold text-xs tracking-widest uppercase mb-4 pb-4 border-b border-white/20 inline-block mx-auto">{coach.role}</p>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                    {coach.bio}
                </p>
                <div className="mt-4 flex justify-center">
                    <span className="h-1 w-12 bg-rr-blue rounded-full"></span>
                </div>
            </div>
        </div>
    );
};

const CoachesSection = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle Pink Logo Watermark */}
            <img
                src="/assets/rr-logo-pink.png"
                alt=""
                className="absolute -left-20 top-40 w-auto h-[60%] object-contain opacity-[0.03] pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        SPECIALIST COACHING
                    </h2>
                    <p className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Every coach in this program is a paid professional with real cricket credentials. Players are coached by people who have played, coached, and competed at the highest levels.
                    </p>
                </div>

                {/* Leadership Team */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {leadershipCoaches.map((coach, index) => (
                        <CoachCard key={index} coach={coach} size="large" />
                    ))}
                </div>

                {/* Elite Specialist Coaches */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-rr-charcoal/50 uppercase tracking-[0.3em] mb-6 text-center">Elite Coaching Staff</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {eliteCoaches.map((coach, index) => (
                            <CoachCard key={index} coach={coach} />
                        ))}
                    </div>
                </div>

                {/* Program Team */}
                <div>
                    <h3 className="text-xs font-bold text-rr-charcoal/50 uppercase tracking-[0.3em] mb-6 text-center">Program Team</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {programTeam.map((coach, index) => (
                            <CoachCard key={index} coach={coach} />
                        ))}
                    </div>
                </div>

                {/* Facility & Safety Credentials */}
                <div className="mt-20 bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-rr-dark uppercase mb-4">Elite Environment</h3>
                        <p className="text-rr-charcoal mb-6">
                            We train exclusively at the Cutting Edge Cricket Centre. State-of-the-art netting, precise lighting, and professional-grade surfaces.
                        </p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-rr-dark">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                WWCC Certified Coaches
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Maximum 1:8 Coach Ratio
                            </span>
                        </div>
                    </div>
                    {/* Facility Image */}
                    <div className="flex-1 w-full h-64 rounded-xl overflow-hidden shadow-md relative">
                        <div className="absolute inset-0 bg-image-gradient-rr opacity-20 mix-blend-multiply z-10"></div>
                        <img
                            src="/assets/PANA0988.JPG"
                            alt="Training Facility"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CoachesSection;

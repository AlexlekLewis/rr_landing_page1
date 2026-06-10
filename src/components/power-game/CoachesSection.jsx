import React from 'react';
import { motion } from 'framer-motion';

const leadershipCoaches = [
    {
        name: "Siddhartha Lahiri",
        role: "Performance Coach — Rajasthan & Paarl Royals",
        image: "/assets/rra/headcoach-lahiri.png",
        bio: "Performance coach for the Rajasthan and Paarl Royals, and head of the Royals' global talent network. He oversees player development across every Royals Academy worldwide — giving the program's best players a direct line to one of the IPL's biggest franchises.",
    },
    {
        name: "Andy Crook",
        role: "Academy Director — T20 & Power Hitting Specialist",
        image: "/assets/coaches/andy-crook.jpg",
        bio: "Former South Australian Redback (debut at 17), Lancashire and Northamptonshire player, and part of Australia's 2025 T20 Masters World Cup-winning squad. Andy watched T20 transform from the inside and now builds individual development plans around each player's T20 role and skill set.",
    },
    {
        name: "Alex Lewis",
        role: "Head Coach",
        image: "/assets/coaches/alex-lewis.jpg",
        bio: "Over 20 years coaching cricketers through representative pathways. Alex puts technique and the player first — building better cricketers, sharper athletes and tougher competitors. Current premier cricket senior assistant coach, bowling coach and Academy director.",
    },
];

const eliteCoaches = [
    {
        name: "Matthew Spoors",
        role: "Batting — Power Hitting & 360",
        image: "/assets/coaches/matthew-spoors.jpg",
        bio: "A modern T20 batter who scored an unbeaten 108 off 66 on T20I debut for Canada — the highest score ever on debut. BBL experience with the Perth Scorchers and Melbourne Renegades, built on clean ball-striking and explosive power.",
    },
    {
        name: "Jarryd Rogers",
        role: "Batting — Power Hitting Mechanics",
        image: "/assets/coaches/jarryd-rogers.jpg",
        bio: "Former Australian Baseball League star and Victorian state baseball batting coach. Jarryd brings a cross-sport edge on generating bat speed and hitting the ball harder — a genuine, measurable advantage at the crease.",
    },
    {
        name: "Harkirat Bajwa",
        role: "Bowling — Spin",
        image: "/assets/coaches/harkirat-bajwa.jpg",
        bio: "Australian U19 representative and Premier Cricket competitor. A modern spinner who turns it both ways with accuracy, Harkirat teaches the variations and tactics that win matches.",
    },
];

const programTeam = [
    {
        name: "Joel Ried",
        role: "Program Coach",
        image: "/assets/coaches/joel-ried.jpg",
        bio: "A technically sharp coach who thrives in high-intensity sessions. Joel's energy on the training ground is infectious — he demands excellence and rewards effort in equal measure.",
    },
    {
        name: "Alex Thornhill",
        role: "Program Coach",
        image: "/assets/coaches/alex-thornhill.jpg",
        bio: "A batting specialist with England County and Australian premier experience. Alex coaches the Fitzroy Doncaster Academy and leads the cricket program at Xavier College, combining practical coaching with deep technical knowledge.",
    },
    {
        name: "Adelaide Campion",
        role: "Program Coach",
        image: "/assets/coaches/adelaide-campion.jpg",
        bio: "Inaugural captain of Carlton CC, premiership winner, and member of Australia's Indoor World Cup-winning squads. Currently Head Coach of the Australian and Victorian U18 Indoor teams — 15+ years at the highest level.",
    },
    {
        name: "Glenn Butterworth",
        role: "Program Coach",
        image: "/assets/coaches/glenn-butterworth.jpg",
        bio: "27 years of coaching across two continents. Completed his Level 2 Coaching at Lord's and coached across Middlesex and the UK. Now driving female pathways development at Fitzroy Doncaster.",
    },
    {
        name: "Zac Macciocca",
        role: "Program Assistant Coach",
        image: "/assets/coaches/zac-macciocca.jpg",
        bio: "A Fitzroy Doncaster stalwart and Dowling Shield coach of 6+ years. Zac combines club-cricket grit with technical knowledge and a relatable presence that connects with young players from day one.",
    },
    {
        name: "Ikroop Dhanoa",
        role: "Program Assistant Coach",
        image: "/assets/coaches/ikroop-dhanoa.jpg",
        bio: "A dynamic young coach with a deep understanding of modern T20 cricket. Ikroop brings fresh tactical thinking and helps every athlete feel seen and supported.",
    },
    {
        name: "Rittin Raman",
        role: "Program Assistant Coach",
        image: "/assets/coaches/rittin-raman.jpg",
        bio: "Driven by a genuine love for developing cricketers. Rittin brings high energy, technical precision, and an unwavering commitment to helping young players unlock their potential.",
    },
];

const CoachCard = ({ coach }) => (
    <div className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg">
        <img
            src={coach.image}
            alt={coach.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('bg-gradient-to-br', 'from-rr-dark', 'to-rr-blue/80');
            }}
        />

        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Default state — name + role */}
        <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500 group-hover:translate-y-4 group-hover:opacity-0">
            <h3 className="text-2xl font-black text-white uppercase tracking-wide leading-none mb-1">{coach.name}</h3>
            <p className="text-rr-pink font-bold text-sm tracking-widest uppercase">{coach.role}</p>
        </div>

        {/* Hover state — bio */}
        <div className="absolute inset-0 bg-rr-dark/90 backdrop-blur-sm p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform translate-y-8 group-hover:translate-y-0 text-center overflow-y-auto">
            <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2">{coach.name}</h3>
            <p className="text-rr-pink font-bold text-xs tracking-widest uppercase mb-4 pb-4 border-b border-white/20 inline-block mx-auto">{coach.role}</p>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
                {coach.bio}
            </p>
            <div className="mt-4 flex justify-center">
                <span className="h-1 w-12 bg-rr-blue rounded-full" />
            </div>
        </div>
    </div>
);

const CoachesSection = () => {
    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Subtle pink logo watermark */}
            <img
                src="/assets/rr-logo-pink.png"
                alt=""
                className="absolute -left-20 top-40 w-auto h-[60%] object-contain opacity-[0.03] pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            The Coaching Group
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-rr-dark uppercase tracking-wide mb-6">
                        MEET YOUR <span className="text-rr-pink">COACHES</span>
                    </h2>
                    <p className="text-lg text-rr-charcoal max-w-2xl mx-auto font-medium">
                        Every coach in this program is a paid professional with real cricket credentials. Players are coached by people who have played, coached, and competed at the highest levels.
                    </p>
                </motion.div>

                {/* Leadership */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10 max-w-4xl mx-auto">
                    {leadershipCoaches.map((coach, index) => (
                        <CoachCard key={index} coach={coach} />
                    ))}
                </div>

                {/* Specialist coaches */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-rr-charcoal/50 uppercase tracking-[0.3em] mb-6 text-center">Specialist Coaching Staff</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {eliteCoaches.map((coach, index) => (
                            <CoachCard key={index} coach={coach} />
                        ))}
                    </div>
                </div>

                {/* Program team */}
                <div>
                    <h3 className="text-xs font-bold text-rr-charcoal/50 uppercase tracking-[0.3em] mb-6 text-center">Program Team</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {programTeam.map((coach, index) => (
                            <CoachCard key={index} coach={coach} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoachesSection;

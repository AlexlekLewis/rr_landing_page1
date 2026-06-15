import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Leadership keeps headshot cards (the marquee trio). The rest of the roster —
// a lot of coaches — is a compact two-column list of name rows that open to a
// bio on hover (desktop) or tap (mobile, ~96% of this page's traffic).

const leadership = [
    {
        name: "Siddhartha Lahiri",
        role: "Royals Group Performance Coach — Head of Global Academies",
        image: "/assets/coaches/siddhartha-lahiri.jpg",
        bio: "Performance coach for the Rajasthan and Paarl Royals and head of the Royals' global talent network — he oversees player development across every Royals Academy worldwide, giving our best players a direct line to one of the IPL's biggest franchises.",
    },
    {
        name: "Andy Crook",
        role: "Director of Cricket — T20 & Power Hitting",
        image: "/assets/coaches/andy-crook.jpg",
        bio: "Former South Australian Redback (debut at 17), Lancashire and Northamptonshire player, and part of Australia's 2025 T20 Masters World Cup-winning squad. He was in county grounds when T20 was born and has built his coaching around it ever since.",
    },
    {
        name: "Alex Lewis",
        role: "Rajasthan Royals Academy — Head Coach",
        image: "/assets/coaches/alex-lewis.jpg",
        bio: "Over 20 years coaching cricketers through representative pathways. A current premier-cricket senior assistant and bowling coach — technique-first, player-first, building sharper athletes and tougher competitors.",
    },
];

const specialists = [
    {
        name: "Matthew Spoors",
        role: "Batting — Power Hitting & 360",
        bio: "A modern T20 batter who scored an unbeaten 108 off 66 on T20I debut for Canada — the highest score ever on debut. BBL experience with the Perth Scorchers and Melbourne Renegades, built on clean ball-striking and explosive power.",
    },
    {
        name: "Peter Hatzoglou",
        role: "Bowling — Leg-spin",
        bio: "A Big Bash leg-spinner for the Melbourne Renegades and Perth Scorchers who rose from Melbourne club cricket to the BBL in barely two years. His quick, hard-to-read wrist-spin is built for the modern T20 game — and he teaches the variations that make it dangerous.",
    },
    {
        name: "Jarryd Rogers",
        role: "Batting — Power Hitting Mechanics",
        bio: "Former Australian Baseball League star and Victorian state baseball batting coach. Jarryd brings a cross-sport edge on generating bat speed and hitting the ball harder — a genuine, measurable advantage at the crease.",
    },
    {
        name: "Callum Stow",
        role: "Victoria & Renegades — Spin / Batting",
        bio: "A Victoria and Melbourne Renegades cricketer from Geelong, Callum is a left-arm wrist-spinner and hard-hitting right-hand bat who came through Cricket Victoria's elite pathway — a current pro bringing the modern T20 skill set straight to the program.",
    },
    {
        name: "Harkirat Bajwa",
        role: "Bowling — Spin",
        bio: "Australian U19 representative and Premier Cricket competitor. A modern spinner who turns it both ways with accuracy, Harkirat teaches the variations and tactics that win matches.",
    },
];

const performance = [
    {
        name: "Ikroop Dhanoa",
        role: "Performance Coach — 360 Batting",
        bio: "A First XI batter for Essendon in Victorian Premier Cricket and a full Victorian pathway player up to the Under-19s. Ikroop's game is powerful, adaptive and built for 360° T20 — and he brings that modern attacking method and sharp tactical thinking to every player he coaches.",
    },
    {
        name: "Rittin Raman",
        role: "Performance Coach — Wicketkeeping",
        bio: "An emerging pathway talent and state-level representative, Rittin is a wicketkeeper-batter playing First XI cricket for Melbourne Cricket Club. Still climbing the pathway himself, he coaches with high energy, technical precision and a genuine drive to help players unlock their potential.",
    },
    {
        name: "Zac Parr",
        role: "Performance Coach — Pace Bowling",
        bio: "A current First XI opening fast bowler for Fitzroy Doncaster in Victorian Premier Cricket, Zac brings genuine pace-bowling craft and the competitive edge of live Premier Cricket to the program's quicks.",
    },
    {
        name: "Alex Thornhill",
        role: "Performance Coach — Batting",
        bio: "A batting specialist with England County and Australian premier experience. Alex coaches the Fitzroy Doncaster Academy and leads the cricket program at Xavier College, combining practical coaching with deep technical knowledge.",
    },
    {
        name: "Adelaide Campion",
        role: "Performance Coach",
        bio: "Inaugural captain of Carlton CC, premiership winner, and member of Australia's Indoor World Cup-winning squads. Currently Head Coach of the Australian and Victorian U18 Indoor teams — 15+ years at the highest level.",
    },
    {
        name: "Glenn Butterworth",
        role: "Performance Coach",
        bio: "27 years of coaching across two continents. Completed his Level 2 Coaching at Lord's and coached across Middlesex and the UK. Now driving female pathways development at Fitzroy Doncaster.",
    },
    {
        name: "Joel Ried",
        role: "Performance Coach",
        bio: "A technically sharp coach who thrives in high-intensity sessions. Joel's energy on the training ground is infectious — he demands excellence and rewards effort in equal measure.",
    },
    {
        name: "Zac Macciocca",
        role: "Performance Coach",
        bio: "A Fitzroy Doncaster stalwart and Dowling Shield coach of 6+ years. Zac combines club-cricket grit with technical knowledge and a relatable presence that connects with young players from day one.",
    },
];

// Leadership — headshot card with name/role default, bio on hover or tap.
const LeaderCard = ({ coach }) => {
    const [open, setOpen] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden text-left shadow-lg"
        >
            <img
                src={coach.image}
                alt={coach.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('bg-gradient-to-br', 'from-rr-blue/80', 'to-rr-dark'); }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rr-dark via-rr-dark/20 to-transparent opacity-85" />

            <div className={`absolute bottom-0 left-0 p-4 md:p-5 w-full transition-opacity duration-300 ${open ? 'opacity-0' : 'group-hover:opacity-0'}`}>
                <h4 className="text-lg md:text-2xl font-black text-white uppercase tracking-wide leading-none">{coach.name}</h4>
                <p className="text-rr-pink font-bold text-[10px] md:text-xs tracking-widest uppercase mt-1.5">{coach.role}</p>
            </div>

            <div className={`absolute inset-0 bg-rr-dark/92 backdrop-blur-sm p-4 md:p-5 flex flex-col justify-center transition-opacity duration-300 overflow-y-auto ${open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-wide leading-tight">{coach.name}</h4>
                <p className="text-rr-pink font-bold text-[10px] tracking-widest uppercase mt-1.5 mb-3 pb-3 border-b border-white/15">{coach.role}</p>
                <p className="text-white/85 text-xs md:text-sm leading-relaxed font-medium">{coach.bio}</p>
            </div>
        </button>
    );
};

// Roster — compact name row, bio opens on hover or tap.
const CompactRow = ({ coach }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="group border-b border-white/10">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-3 py-3 text-left"
            >
                <span className="min-w-0">
                    <span className="block text-base sm:text-lg font-black text-white uppercase tracking-wide leading-tight transition-colors duration-200 group-hover:text-rr-pink">{coach.name}</span>
                    <span className="block text-[10px] font-bold text-rr-pink/90 uppercase tracking-[0.12em] mt-1">{coach.role}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-rr-pink flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''} group-hover:rotate-180`} strokeWidth={2.5} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-out ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'} group-hover:max-h-80 group-hover:opacity-100`}>
                <p className="text-white/65 text-[13px] leading-relaxed font-medium pb-4 pr-1">{coach.bio}</p>
            </div>
        </div>
    );
};

// A tier of compact rows, split into two independent columns so expanding one
// never pushes the other column around.
const RowTier = ({ label, coaches }) => {
    const mid = Math.ceil(coaches.length / 2);
    const columns = [coaches.slice(0, mid), coaches.slice(mid)];
    return (
        <div className="mb-12 last:mb-0">
            <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1 border-b border-white/10 pb-3">
                {label} <span className="text-white/25">· {coaches.length}</span>
            </h3>
            <div className="grid md:grid-cols-2 md:gap-x-12">
                {columns.map((col, ci) => (
                    <div key={ci}>
                        {col.map((coach, i) => (
                            <CompactRow key={i} coach={coach} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CoachesSection = () => {
    return (
        <section className="py-24 md:py-32 bg-rr-dark relative overflow-hidden">
            <img
                src="/assets/rr-logo-pink.png"
                alt=""
                className="absolute -right-24 top-32 w-auto h-[55%] object-contain opacity-[0.04] pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">The Coaching Group</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wide mb-6">
                        MEET YOUR <span className="text-rr-pink">COACHES</span>
                    </h2>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
                        Coaching the Royals Way. Every coach is connected to the Rajasthan Royals' global system — people who have played, coached and competed at the highest levels. <span className="text-white/90 font-bold">Tap any name to meet them.</span>
                    </p>
                </div>

                {/* Leadership — headshots */}
                <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em] mb-5 text-center">Leadership</h3>
                <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-3xl mx-auto mb-14">
                    {leadership.map((coach, i) => (
                        <LeaderCard key={i} coach={coach} />
                    ))}
                </div>

                {/* Roster — compact two-column rows */}
                <RowTier label="Specialist Coaches" coaches={specialists} />
                <RowTier label="Elite Performance Coaches" coaches={performance} />
            </div>
        </section>
    );
};

export default CoachesSection;

import React from 'react';
import { motion } from 'framer-motion';

const leadershipCoaches = [
    {
        name: "Siddhartha Lahiri",
        role: "Rajasthan Royals Group Head of Int'l Player Development & Assistant Coach to Paarl, Rajasthan and Barbados Royals",
        image: "/assets/rra/headcoach-lahiri.png",
        bio: "Performance coach of the Rajasthan Royals, as well as Assistant Coach of Paarl and Barbados Royals, Siddhartha runs the Rajasthan Royals' global talent network. He oversees player scouting and development across every Royals Academy in the world — meaning the program's best players have a direct line to one of the IPL's biggest franchises.",
    },
    {
        name: "Andy Crook",
        role: "Director of Cricket, Rajasthan Royals Academy Melbourne",
        image: "/assets/coaches/andy-crook.jpg",
        bio: "Andy Crook has lived T20 cricket from the very beginning. A former AIS Commonwealth Bank Cricket Academy scholar, Andy played professionally for the South Australian Redbacks at the age of 17, and then went on to play for Lancashire County Cricket Club and Northamptonshire County Cricket Club. At Lancashire he played in a T20 Vitality Blast Final, held the List A highest score batting record for a decade and most recently was part of Australia's 2025 T20 Masters World Cup winning campaign in Pakistan. Andy was in English county grounds when T20 was first played and watched the game transform in real time after its 2003 launch. That experience shaped everything he believes about how the format should be developed and taught — that T20 is its own game, with its own skills, its own roles, and its own instincts, and that the best players are identified early and developed specifically for it. As the Director of Cricket at the Rajasthan Royals Academy in Australia, Andy combines his executive sports experience with working directly with players — supporting the reviewing footage, training and game play monitoring, and building individual development plans around each player's specific T20 role and skill set.",
    },
    {
        name: "Alex Lewis",
        role: "Rajasthan Royals Academy Melbourne Head Coach",
        image: "/assets/coaches/alex-lewis.jpg",
        bio: "Over 20 years coaching cricketers through representative pathways. Alex is committed to getting the technique right and putting the player first — building not just better cricketers, but sharper athletes and tougher competitors. Current premier cricket senior assistant coach, bowling coach and Academy director.",
    },
];

const eliteCoaches = [
    {
        name: "Matthew Spoors",
        role: "Batting — Power Hitting & 360",
        image: "/assets/coaches/matthew-spoors.jpg",
        bio: "Matthew Spoors is the definition of a modern T20 cricketer. A right-handed top-order batter and attacking leg-spinner, Matthew announced himself on the international stage with an unbeaten 108 off 66 balls on his T20I debut for Canada — the highest individual score ever recorded on T20 International debut. From WA state age-group cricket and the Cricket Australia XI to the Big Bash League with the Perth Scorchers and Melbourne Renegades, and international franchise appearances in the Caribbean's Max60 League, Matthew has built his game around the demands of T20 cricket: clean ball-striking, explosive power, and the ability to finish innings under pressure. His journey from WA Premier Cricket to the professional franchise circuit is a masterclass in reinvention, self-belief, and what happens when talent meets structured development.",
    },
    {
        name: "Jarryd Rogers",
        role: "Batting — Power Hitting Mechanics",
        image: "/assets/coaches/jarryd-rogers.jpg",
        bio: "Former Australian Baseball League (ABL) star and Victorian state baseball batting coach and power hitting specialist. Jarryd brings a unique cross-sport perspective on how to generate bat speed and hit the ball harder — giving players a genuine, measurable edge at the crease.",
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// The pathway — makes the cross-links between programs visible so no page is a
// dead end. Holiday feeds Junior Royals; Junior climbs to Power Game; Power Game
// leads to the Elite squad. Each step links to that program's page.
const STEPS = [
    { k: 'Holiday Camps', n: 'Try it', role: 'School-holiday clinics', route: '/junior-royals-holiday', tone: 'entry' },
    { k: 'Junior Royals', n: 'Grow · ages 6–16', role: 'Weekly coaching, level by level', route: '/junior-royals', tone: 'mid' },
    { k: 'Power Game', n: 'Earn your place', role: 'Elite pre-season', route: '/elite-royals', tone: 'mid' },
    { k: 'Elite Squad', n: 'Compete', role: 'Matches · Tours · Talent ID', route: '/elite-royals', tone: 'peak' },
];

const toneBg = {
    entry: 'linear-gradient(135deg,#323E48,#111921)',
    mid: 'linear-gradient(135deg,#001D48 0%,#1226AA 45%,#E11F8F 100%)',
    peak: 'linear-gradient(135deg,#E11F8F,#a3126b)',
};

const HomePathway = () => (
    <section id="pathway" className="py-16 md:py-24 bg-rr-dark text-white">
        <style>{`
          @media(min-width:768px){
            .hme-path__step{clip-path:polygon(0 0,90% 0,100% 50%,90% 100%,0 100%,10% 50%);border-radius:0;}
            .hme-path__step--first{clip-path:polygon(0 0,90% 0,100% 50%,90% 100%,0 100%);}
          }
        `}</style>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
            >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-rr-pink">The Pathway</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide mt-3">
                    How the programs <span className="text-rr-pink">connect.</span>
                </h2>
                <p className="text-white/70 font-medium max-w-2xl mt-3">
                    Wherever you start, there's a next step — and a way back down. Every program links to the one above and below it.
                </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                {STEPS.map((s, i) => (
                    <motion.div
                        key={s.k}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="flex-1 min-w-0"
                    >
                        <Link
                            to={s.route}
                            className={`hme-path__step${i === 0 ? ' hme-path__step--first' : ''} block h-full text-white px-5 py-6 md:pl-5 md:pr-7 transition-transform duration-200 hover:-translate-y-1 rounded-xl`}
                            style={{ background: toneBg[s.tone] }}
                        >
                            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">{s.n}</span>
                            <span className="block text-lg md:text-xl font-black uppercase tracking-wide mt-1">{s.k}</span>
                            <span className="block text-[12px] font-medium text-white/85 mt-1">{s.role}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8">
                <p className="text-sm text-white/70 font-medium max-w-[30ch]"><span className="text-rr-pink font-black">↑</span>&nbsp; A holiday-camp family is one click from booking a Junior Royals term.</p>
                <p className="text-sm text-white/70 font-medium max-w-[30ch]"><span className="text-rr-pink font-black">↑</span>&nbsp; A standout junior is invited up to Power Game when they're ready.</p>
                <p className="text-sm text-white/70 font-medium max-w-[30ch]"><span className="text-rr-pink font-black">↓</span>&nbsp; Not ready for Elite yet? Every page offers a "start smaller" route down.</p>
            </div>
        </div>
    </section>
);

export default HomePathway;

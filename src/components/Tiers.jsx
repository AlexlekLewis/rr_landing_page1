import React from 'react';
import { motion } from 'framer-motion';

const TierCard = ({ title, features, recommendedFor, color }) => (
    <div className={`bg-white p-8 rounded-2xl shadow-xl border-t-8 ${color}`}>
        <h3 className="text-2xl font-black text-rr-dark mb-2">{title}</h3>
        <p className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">{recommendedFor}</p>
        <ul className="space-y-4">
            {features.map((feat, i) => (
                <li key={i} className="flex items-start">
                    <span className={`mr-3 mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${color.replace('border-', 'bg-')}`}>✓</span>
                    <span className="text-slate-700">{feat}</span>
                </li>
            ))}
        </ul>
    </div>
);

const Tiers = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-black text-center text-rr-dark mb-16">
                    ELITE PROGRAMME <span className="text-ra-blue">TIERS</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <TierCard
                        title="TIER 1"
                        color="border-ra-blue"
                        recommendedFor="High Performance / Representative"
                        features={[
                            "Comprehensive Technical Analysis",
                            "Advanced Power Hitting Modules",
                            "1-on-1 Mentoring with Sid Lahiri",
                            "Access to Royals franchise network",
                            "Full biometric screening",
                            "Priority selection for India camps"
                        ]}
                    />
                    <TierCard
                        title="TIER 2"
                        color="border-rf-pink"
                        recommendedFor="Emerging Talent / Club Cricket"
                        features={[
                            "Core Technical Skills Development",
                            "T20 Strategy Workshops",
                            "Group training sessions",
                            "Performance tracking app access",
                            "Fitness & conditioning plans",
                            "Opportunity for Tier 1 upgrade"
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

export default Tiers;

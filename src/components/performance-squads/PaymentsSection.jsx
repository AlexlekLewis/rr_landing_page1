import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { fadeUp, SectionHeading, Label, Chevron, selectClass } from './shared';
import { ACTIVE_CENTRES, PAYMENT_LINKS, PAYMENT_OPTIONS, FINANCIAL_CONDITION } from './data';

const PaymentsSection = () => {
    const [payCentre, setPayCentre] = useState(ACTIVE_CENTRES[0].slug);
    const [payType, setPayType] = useState('trial');

    const payLink = PAYMENT_LINKS[payCentre]?.[payType] || null;
    const payOption = useMemo(() => PAYMENT_OPTIONS.find((o) => o.key === payType), [payType]);
    const payCentreName = useMemo(() => ACTIVE_CENTRES.find((c) => c.slug === payCentre)?.name, [payCentre]);

    const sc = (key) => selectClass({}, key);

    return (
        <section className="py-20 px-5 bg-white/[0.02]">
            <div className="max-w-2xl mx-auto">
                <SectionHeading
                    eyebrow="Step 2"
                    title="Payments"
                    sub="Choose your centre and what you're paying for — trial fees, match fees, or your annual fee."
                />
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-9">
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <Label required>Centre</Label>
                            <div className="relative">
                                <select value={payCentre} onChange={(e) => setPayCentre(e.target.value)} className={sc('pay_centre')}>
                                    {ACTIVE_CENTRES.map((c) => (
                                        <option key={c.slug} value={c.slug}>{c.name}</option>
                                    ))}
                                </select>
                                <Chevron />
                            </div>
                        </div>
                        <div>
                            <Label required>Payment Type</Label>
                            <div className="relative">
                                <select value={payType} onChange={(e) => setPayType(e.target.value)} className={sc('pay_type')}>
                                    {PAYMENT_OPTIONS.map((o) => (
                                        <option key={o.key} value={o.key}>{o.label}</option>
                                    ))}
                                </select>
                                <Chevron />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-black uppercase tracking-wider">{payCentreName} — {payOption.label}</span>
                            <span className="text-rr-light-pink font-black text-lg">{payOption.price}</span>
                        </div>
                        <p className="text-white/55 text-xs font-medium leading-relaxed">{payOption.desc}</p>
                    </div>
                    {payLink ? (
                        <a
                            href={payLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" /> Pay Securely with Stripe
                        </a>
                    ) : (
                        <button
                            disabled
                            className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white/40 font-black uppercase tracking-wider text-sm rounded-full px-8 py-4 cursor-not-allowed"
                        >
                            <CreditCard className="w-4 h-4" /> Payment link coming soon
                        </button>
                    )}
                    <p className="text-white/40 text-xs font-medium text-center mt-4">
                        Payments are processed securely by Stripe. Register first if you haven't already.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default PaymentsSection;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

// ── Omtex shirt sizing data ──────────────────────────────────
const SHIRT_SIZES_JUNIOR = [
    { label: '18',       halfChest: '11 – 11.5', length: '16' },
    { label: '20',       halfChest: '11 – 12',   length: '17' },
    { label: '22',       halfChest: '12.5 – 13', length: '18' },
    { label: '24',       halfChest: '13.5 – 14', length: '19' },
    { label: '26',       halfChest: '14.5 – 15', length: '21' },
    { label: '28',       halfChest: '15.5 – 16', length: '22' },
    { label: '30',       halfChest: '16.5 – 17', length: '23' },
    { label: '32',       halfChest: '17.5 – 18', length: '24.5' },
    { label: '34 (XXS)', halfChest: '18.5 – 19', length: '25' },
];
const SHIRT_SIZES_SENIOR = [
    { label: 'XS (36)',  halfChest: '19.5 – 20', length: '27' },
    { label: 'S (38)',   halfChest: '20.5 – 21', length: '28' },
    { label: 'M (40)',   halfChest: '21.5 – 22', length: '29' },
    { label: 'L (42)',   halfChest: '22.5 – 23', length: '30' },
    { label: 'XL (44)',  halfChest: '23.5 – 24', length: '31' },
];
const ALL_SHIRT_SIZES = [...SHIRT_SIZES_JUNIOR, ...SHIRT_SIZES_SENIOR];

const KIDS_AGE_CHART = [
    { age: '7/8 yrs',   top: '26' },
    { age: '9/10 yrs',  top: '28' },
    { age: '11/12 yrs', top: '30' },
    { age: '13/14 yrs', top: '32' },
    { age: '15/16 yrs', top: '34 (XXS)' },
];

const inputClass = (err) =>
    `w-full bg-white border ${err ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rr-pink/40 focus:border-rr-pink transition-all`;

const labelClass = 'block text-rr-dark font-bold text-xs uppercase tracking-widest mb-2';

const emptyForm = {
    parent_name: '', parent_email: '', parent_phone: '',
    player_name: '', player_age: '', player_gender: '',
    primary_club: '', suburb: '', location: '',
    has_shirt: false, shirt_size: '',
    accept_terms: false, accept_player_code: false,
    accept_parent_code: false, accept_social_media: false,
};

const JulyRegistrationForm = () => {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showSizeChart, setShowSizeChart] = useState(false);

    // Capture UTM params from URL
    const getUTM = () => {
        const p = new URLSearchParams(window.location.search);
        return {
            utm_source:   p.get('utm_source')   || null,
            utm_medium:   p.get('utm_medium')   || null,
            utm_campaign: p.get('utm_campaign') || null,
            utm_content:  p.get('utm_content')  || null,
            utm_term:     p.get('utm_term')     || null,
            page_referrer: document.referrer    || null,
        };
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(e => ({ ...e, [name]: null }));
    };

    const validate = () => {
        const e = {};
        if (!form.parent_name.trim())  e.parent_name  = 'Required';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email required';
        if (!form.parent_phone.trim()) e.parent_phone = 'Required';
        if (!form.player_name.trim())  e.player_name  = 'Required';
        if (!form.player_age)          e.player_age   = 'Required';
        if (parseInt(form.player_age) < 7 || parseInt(form.player_age) > 15) e.player_age = 'Must be 7–15';
        if (!form.player_gender)       e.player_gender = 'Required';
        if (!form.primary_club.trim()) e.primary_club = 'Required';
        if (!form.suburb.trim())       e.suburb       = 'Required';
        if (!form.location)            e.location     = 'Please select a location';
        if (!form.has_shirt && !form.shirt_size) e.shirt_size = 'Please select a size or confirm you already have a shirt';
        if (!form.accept_terms)        e.accept_terms = 'Required';
        if (!form.accept_player_code)  e.accept_player_code = 'Required';
        if (!form.accept_parent_code)  e.accept_parent_code = 'Required';
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSubmitting(true);
        try {
            const utm = getUTM();
            const { error } = await supabase
                .from('junior_royals_july_holidays_registrations')
                .insert([{
                    parent_name:      form.parent_name.trim(),
                    parent_email:     form.parent_email.trim().toLowerCase(),
                    parent_phone:     form.parent_phone.trim(),
                    player_name:      form.player_name.trim(),
                    player_age:       parseInt(form.player_age),
                    player_gender:    form.player_gender,
                    primary_club:     form.primary_club.trim(),
                    suburb:           form.suburb.trim(),
                    location:         form.location,
                    has_shirt:        form.has_shirt,
                    shirt_size:       form.has_shirt ? null : form.shirt_size,
                    accept_terms:     form.accept_terms,
                    accept_player_code: form.accept_player_code,
                    accept_parent_code: form.accept_parent_code,
                    accept_social_media: form.accept_social_media,
                    on_waitlist:      false,
                    ...utm,
                }]);
            if (error) throw error;
            window.location.href = 'https://buy.stripe.com/aFa8wPfY54yhfpO33t9Zm0h';
        } catch (err) {
            setErrors({ form: `Something went wrong. Please try again or email info@rramelbourne.com` });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <section id="registration-form" className="py-24 bg-slate-50">
                <div className="max-w-xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10"
                    >
                        <div className="w-16 h-16 rounded-full bg-rr-pink/10 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-rr-dark uppercase tracking-tight mb-4">Registration Received</h2>
                        <p className="text-rr-charcoal font-medium leading-relaxed mb-6">
                            Thanks for registering for the Junior Royals Holiday Camp. We'll be in touch shortly with payment details and everything you need ahead of the camp.
                        </p>
                        <p className="text-slate-400 text-sm">Questions? <a href="mailto:info@rramelbourne.com" className="text-rr-pink font-bold hover:underline">info@rramelbourne.com</a></p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="registration-form" className="py-24 bg-slate-50">
            <div className="max-w-2xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-5 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-black text-rr-pink uppercase tracking-widest">Secure Your Place</span>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-rr-dark uppercase tracking-tight mb-4">
                        Secure Your Place Now
                    </h2>
                    <p className="text-rr-charcoal font-medium">Fill in your details below to secure your place in the Junior Royals Holiday Camp.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-10"
                >
                    {/* ── PARENT DETAILS ── */}
                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Parent / Guardian Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <input name="parent_name" value={form.parent_name} onChange={handleChange} className={inputClass(errors.parent_name)} placeholder="Jane Smith" />
                            {errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={inputClass(errors.parent_email)} placeholder="jane@email.com" />
                            {errors.parent_email && <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Phone Number</label>
                            <input name="parent_phone" value={form.parent_phone} onChange={handleChange} className={inputClass(errors.parent_phone)} placeholder="04XX XXX XXX" />
                            {errors.parent_phone && <p className="text-red-500 text-xs mt-1">{errors.parent_phone}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Suburb</label>
                            <input name="suburb" value={form.suburb} onChange={handleChange} className={inputClass(errors.suburb)} placeholder="Bundoora" />
                            {errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>}
                        </div>
                    </div>

                    {/* ── PLAYER DETAILS ── */}
                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Player Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <div>
                            <label className={labelClass}>Player Name</label>
                            <input name="player_name" value={form.player_name} onChange={handleChange} className={inputClass(errors.player_name)} placeholder="Alex Smith" />
                            {errors.player_name && <p className="text-red-500 text-xs mt-1">{errors.player_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Player Age</label>
                            <select name="player_age" value={form.player_age} onChange={handleChange} className={inputClass(errors.player_age)}>
                                <option value="">Select age</option>
                                {[7,8,9,10,11,12,13,14,15].map(a => <option key={a} value={a}>{a} years old</option>)}
                            </select>
                            {errors.player_age && <p className="text-red-500 text-xs mt-1">{errors.player_age}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Gender</label>
                            <select name="player_gender" value={form.player_gender} onChange={handleChange} className={inputClass(errors.player_gender)}>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.player_gender && <p className="text-red-500 text-xs mt-1">{errors.player_gender}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Primary Cricket Club</label>
                            <input name="primary_club" value={form.primary_club} onChange={handleChange} className={inputClass(errors.primary_club)} placeholder="Bundoora CC / None" />
                            {errors.primary_club && <p className="text-red-500 text-xs mt-1">{errors.primary_club}</p>}
                        </div>
                    </div>

                    {/* ── LOCATION ── */}
                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Camp Location</p>
                    <div className="mb-8">
                        <label className={labelClass}>Select Location</label>
                        <select name="location" value={form.location} onChange={handleChange} className={inputClass(errors.location)}>
                            <option value="">Select a location</option>
                            <option value="bundoora">Cutting Edge Cricket — Bundoora | 30 June – 2 July</option>
                            <option value="hallam">Hallam | 7 – 9 July</option>
                            <option value="the-netz">The Netz — Williamstown North | 6 – 8 July (1:30 PM – 5:30 PM)</option>
                        </select>
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>

                    {/* ── SHIRT ── */}
                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-3 pb-2 border-b border-slate-100">Training Shirt — $29.95</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
                        <p className="text-amber-800 text-sm font-bold mb-1">⚠️ Please take care when selecting your shirt size</p>
                        <p className="text-amber-700 text-xs font-medium leading-relaxed">Shirts are ordered specifically for each participant and cannot be exchanged after purchase. We strongly recommend using the Omtex size chart below to measure your child before selecting. Choosing the wrong size is a common mistake — please don't guess.</p>
                    </div>
                    <div className="mb-8">
                        {/* Already have shirt checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer mb-5">
                            <input type="checkbox" name="has_shirt" checked={form.has_shirt} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-rr-pink shrink-0" />
                            <span className="text-sm font-medium text-rr-charcoal">My child already has a Rajasthan Royals Academy training shirt — I don't need to purchase one</span>
                        </label>

                        {/* Size selector — only shown if they don't already have a shirt */}
                        <AnimatePresence>
                            {!form.has_shirt && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <label className={labelClass}>Select Shirt Size</label>
                                    <select name="shirt_size" value={form.shirt_size} onChange={handleChange} className={inputClass(errors.shirt_size)}>
                                        <option value="">Select a size</option>
                                        <optgroup label="Junior Sizes">
                                            {SHIRT_SIZES_JUNIOR.map(s => <option key={s.label} value={s.label}>{s.label} — half chest {s.halfChest}"</option>)}
                                        </optgroup>
                                        <optgroup label="Senior Sizes">
                                            {SHIRT_SIZES_SENIOR.map(s => <option key={s.label} value={s.label}>{s.label} — half chest {s.halfChest}"</option>)}
                                        </optgroup>
                                    </select>
                                    {errors.shirt_size && <p className="text-red-500 text-xs mt-1">{errors.shirt_size}</p>}

                                    {/* Size chart toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setShowSizeChart(v => !v)}
                                        className="mt-3 text-xs font-bold text-rr-pink hover:underline flex items-center gap-1"
                                    >
                                        <svg className={`w-3 h-3 transition-transform ${showSizeChart ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        {showSizeChart ? 'Hide' : 'View'} Omtex Size Chart
                                    </button>

                                    <AnimatePresence>
                                        {showSizeChart && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">How to measure</p>
                                                    <p className="text-xs text-slate-600 mb-4">Lay the shirt flat and measure across the chest. Use the half-chest column to find the correct size.</p>

                                                    {/* Age guide */}
                                                    <p className="text-xs font-bold text-rr-dark uppercase tracking-widest mb-2">Age Guide (approximate)</p>
                                                    <table className="w-full text-xs mb-5 border-collapse">
                                                        <thead>
                                                            <tr className="bg-rr-dark text-white">
                                                                <th className="px-3 py-2 text-left rounded-tl-lg">Age</th>
                                                                <th className="px-3 py-2 text-center rounded-tr-lg">Recommended Size</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {KIDS_AGE_CHART.map((r, i) => (
                                                                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                                    <td className="px-3 py-2 font-medium">{r.age}</td>
                                                                    <td className="px-3 py-2 text-center font-bold text-rr-pink">{r.top}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    {/* Full size chart */}
                                                    <p className="text-xs font-bold text-rr-dark uppercase tracking-widest mb-2">Full Size Chart — Omtex Training Shirt</p>
                                                    <table className="w-full text-xs border-collapse">
                                                        <thead>
                                                            <tr className="bg-rr-dark text-white">
                                                                <th className="px-3 py-2 text-left rounded-tl-lg">Size</th>
                                                                <th className="px-3 py-2 text-center">Half Chest (inches)</th>
                                                                <th className="px-3 py-2 text-center rounded-tr-lg">Length (inches)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ALL_SHIRT_SIZES.map((s, i) => (
                                                                <tr
                                                                    key={i}
                                                                    className={`cursor-pointer transition-colors ${form.shirt_size === s.label ? 'bg-rr-pink/10 font-bold' : i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}`}
                                                                    onClick={() => { setForm(f => ({ ...f, shirt_size: s.label })); if (errors.shirt_size) setErrors(e => ({ ...e, shirt_size: null })); }}
                                                                >
                                                                    <td className="px-3 py-2 font-bold text-rr-pink">{s.label}</td>
                                                                    <td className="px-3 py-2 text-center">{s.halfChest}"</td>
                                                                    <td className="px-3 py-2 text-center">{s.length}"</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <p className="text-xs text-slate-400 mt-3 italic">Tap a row to select that size.</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── COMPLIANCE ── */}
                    <p className="text-xs font-black text-rr-pink uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Agreements</p>
                    <div className="space-y-4 mb-10">
                        {[
                            { name: 'accept_terms',       label: 'I agree to the Terms & Conditions and Privacy Policy of Rajasthan Royals Academy Melbourne.' },
                            { name: 'accept_player_code', label: 'I confirm my child has read and agrees to the Player Code of Conduct.' },
                            { name: 'accept_parent_code', label: 'I agree to the Parent / Guardian Code of Conduct.' },
                            { name: 'accept_social_media', label: 'I consent to my child being photographed or filmed for use in RRA Melbourne social media and marketing content.' },
                        ].map(item => (
                            <label key={item.name} className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" name={item.name} checked={form[item.name]} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-rr-pink shrink-0" />
                                <span className={`text-sm font-medium ${errors[item.name] ? 'text-red-500' : 'text-rr-charcoal'}`}>{item.label}</span>
                            </label>
                        ))}
                        {(errors.accept_terms || errors.accept_player_code || errors.accept_parent_code) && (
                            <p className="text-red-500 text-xs font-medium">Please tick all required boxes above.</p>
                        )}
                    </div>

                    {errors.form && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
                            <p className="text-red-600 text-sm font-medium">{errors.form}</p>
                        </div>
                    )}

                    <div className="bg-rr-pink/10 border border-rr-pink/30 rounded-xl px-5 py-4 mb-5 text-center">
                        <p className="text-rr-pink font-black text-sm uppercase tracking-wide">🏏 Early Bird Price — $299</p>
                        <p className="text-rr-charcoal text-xs font-medium mt-1">Offer ends Midnight Sunday 8 June 2026. Price increases to $330 after.</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest py-5 rounded-full transition-all duration-300 hover:shadow-[0_0_32px_rgba(229,6,149,0.5)] text-sm"
                    >
                        {submitting ? 'Submitting...' : 'Secure My Place — Go to Checkout'}
                    </button>

                    <p className="text-center text-slate-400 text-xs mt-4">
                        Questions? <a href="mailto:info@rramelbourne.com" className="text-rr-pink font-bold hover:underline">info@rramelbourne.com</a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default JulyRegistrationForm;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import SessionChangeNotice from '../SessionChangeNotice';

const EARLY_BIRD_END = new Date('2026-07-15T13:00:00Z');
const isEarlyBird = () => new Date() < EARLY_BIRD_END;

const SESSION_OPTIONS = {
    mickleham: {
        'ages-7-9':   [
            { value: 'tue-6pm', label: 'Tuesdays 6:00pm – 7:00pm (28 Jul – 15 Sep)' },
            { value: 'fri-6pm', label: 'Fridays 6:00pm – 7:00pm (31 Jul – 18 Sep)' },
        ],
        'ages-10-12': [
            { value: 'tue-7pm', label: 'Tuesdays 7:00pm – 8:00pm (28 Jul – 15 Sep)' },
            { value: 'fri-7pm', label: 'Fridays 7:00pm – 8:00pm (31 Jul – 18 Sep)' },
        ],
        'ages-13-15': [
            { value: 'tue-8pm', label: 'Tuesdays 8:00pm – 9:00pm (28 Jul – 15 Sep)' },
            { value: 'fri-8pm', label: 'Fridays 8:00pm – 9:00pm (31 Jul – 18 Sep)' },
        ],
        'ages-5-6':   [{ value: 'tbc', label: 'Session times coming soon' }],
        'ages-16-17': [{ value: 'tbc', label: 'Session times coming soon' }],
    },
    hallam: {
        'ages-7-9':   [{ value: 'sat-12pm', label: 'Saturdays 12:00pm – 1:00pm (1 Aug – 19 Sep)' }],
        'ages-10-12': [
            { value: 'sat-12pm-g1', label: 'Saturdays 12:00pm – 1:00pm Group 1 (1 Aug – 19 Sep)' },
            { value: 'sat-1pm-g2',  label: 'Saturdays 1:00pm – 2:00pm Group 2 (1 Aug – 19 Sep)' },
        ],
        'ages-13-15': [{ value: 'sat-1pm', label: 'Saturdays 1:00pm – 2:00pm (1 Aug – 19 Sep)' }],
        'ages-5-6':   [{ value: 'tbc', label: 'Session times coming soon' }],
        'ages-16-17': [{ value: 'tbc', label: 'Session times coming soon' }],
    },
    williamstown: {
        'ages-7-9':   [{ value: 'sat-2pm', label: 'Saturdays 2:00pm – 3:00pm (1 Aug – 19 Sep)' }],
        'ages-10-12': [
            { value: 'sat-3pm', label: 'Saturdays 3:00pm – 4:00pm Group 1 (1 Aug – 19 Sep)' },
            { value: 'sat-4pm', label: 'Saturdays 4:00pm – 5:00pm Group 2 (1 Aug – 19 Sep)' },
        ],
        'ages-13-15': [{ value: 'sat-5pm', label: 'Saturdays 5:00pm – 6:00pm (1 Aug – 19 Sep)' }],
        'ages-5-6':   [{ value: 'tbc', label: 'Session times coming soon' }],
        'ages-16-17': [{ value: 'tbc', label: 'Session times coming soon' }],
    },
};

const EARLY_BIRD_STRIPE_LINK = 'https://buy.stripe.com/aFa8wPfY54yhfpO33t9Zm0h';
const STANDARD_STRIPE_LINKS = {
    mickleham:    'https://buy.stripe.com/00waEX9zH8OxelKfQf9Zm0f',
    hallam:       'https://buy.stripe.com/00waEX9zH8OxelKfQf9Zm0f',
    williamstown: 'https://buy.stripe.com/00waEX9zH8OxelKfQf9Zm0f',
};
const getStripeLink = (location) =>
    isEarlyBird() ? EARLY_BIRD_STRIPE_LINK : STANDARD_STRIPE_LINKS[location];

// Stamp the payment link with client_reference_id (jrt3-{centre}-{recordId}) and
// the parent's email. The Stripe webhook uses the reference to flip the exact
// jr_term3_* row to completed — the links don't redirect back to our success
// page, so payment tracking can't rely on the browser returning.
const buildStripeUrl = (baseUrl, recordId, location, email) => {
    try {
        const u = new URL(baseUrl);
        if (recordId && location) u.searchParams.set('client_reference_id', `jrt3-${location}-${recordId}`);
        if (email) u.searchParams.set('prefilled_email', email);
        return u.toString();
    } catch {
        return baseUrl;
    }
};

const SUPABASE_TABLE = {
    mickleham:    'jr_term3_mickleham',
    hallam:       'jr_term3_hallam',
    williamstown: 'jr_term3_williamstown',
};

// Term 3 filled every place across all three centres (30 Jul 2026). Flip to
// false (and update the Stripe links/pricing) when Term 4 registration opens.
const TERM3_SOLD_OUT = true;

const SoldOutPanel = () => (
    <section id="registration-form" className="py-24 bg-rr-dark">
        <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-rr-pink" />
                <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">Term 3, 2026 — Sold Out</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                TERM 3 IS <span className="text-rr-pink">SOLD OUT</span>
            </h2>
            <p className="text-white/80 font-medium leading-relaxed mb-4">
                Every place at all three centres — Mickleham, Hallam and Williamstown — has been filled for Term 3 (July – September 2026), and registrations are now closed.
            </p>
            <p className="text-white/80 font-medium leading-relaxed mb-8">
                Already registered? You don't need to do anything — your place is secure, and your session day and time are in your confirmation email.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-left">
                <p className="text-sm font-bold text-white/90 mb-2">Want a place in Term 4?</p>
                <p className="text-sm text-white/70 leading-relaxed">
                    Email <a href="mailto:info@rramelbourne.com?subject=Junior%20Royals%20Term%204%20%E2%80%94%20Register%20My%20Interest" className="text-rr-pink font-bold hover:underline">info@rramelbourne.com</a> with your player's name, age and preferred centre, and we'll contact you before Term 4 registration opens to the public.
                </p>
            </div>
        </div>
    </section>
);

const AGE_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 7); // 7–15

// Omtex sizing data
const SHIRT_SIZES_JUNIOR = [
    { value: '18',       label: 'Size 18  (Half Chest 11–11.5", Length 16")' },
    { value: '20',       label: 'Size 20  (Half Chest 11–12", Length 17")' },
    { value: '22',       label: 'Size 22  (Half Chest 12.5–13", Length 18")' },
    { value: '24',       label: 'Size 24  (Half Chest 13.5–14", Length 19")' },
    { value: '26',       label: 'Size 26  (Half Chest 14.5–15", Length 21") — Age 7/8' },
    { value: '28',       label: 'Size 28  (Half Chest 15.5–16", Length 22") — Age 9/10' },
    { value: '30',       label: 'Size 30  (Half Chest 16.5–17", Length 23") — Age 11/12' },
    { value: '32',       label: 'Size 32  (Half Chest 17.5–18", Length 24.5") — Age 13/14' },
    { value: '34-XXS',   label: 'Size 34/XXS  (Half Chest 18.5–19", Length 25") — Age 15/16' },
];
const SHIRT_SIZES_SENIOR = [
    { value: 'XS-36',   label: 'XS (36)  (Half Chest 19.5–20", Length 27")' },
    { value: 'S-38',    label: 'S (38)  (Half Chest 20.5–21", Length 28")' },
    { value: 'M-40',    label: 'M (40)  (Half Chest 21.5–22", Length 29")' },
    { value: 'L-42',    label: 'L (42)  (Half Chest 22.5–23", Length 30")' },
    { value: 'XL-44',   label: 'XL (44)  (Half Chest 23.5–24", Length 31")' },
];

const SizingChart = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="mt-3">
            <button type="button" onClick={() => setOpen(o => !o)}
                className="text-xs font-bold text-rr-pink uppercase tracking-wide hover:underline flex items-center gap-1">
                {open ? '▲ Hide' : '▼ View'} Full Omtex Sizing Chart
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden text-xs">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-rr-dark text-white">
                                        <th className="px-3 py-2 text-left font-bold">Size</th>
                                        <th className="px-3 py-2 text-left font-bold">Half Chest (inches)</th>
                                        <th className="px-3 py-2 text-left font-bold">Length (inches)</th>
                                        <th className="px-3 py-2 text-left font-bold">Age Guide</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { size: '18', chest: '11 – 11.5', len: '16', age: '' },
                                        { size: '20', chest: '11 – 12', len: '17', age: '' },
                                        { size: '22', chest: '12.5 – 13', len: '18', age: '' },
                                        { size: '24', chest: '13.5 – 14', len: '19', age: '' },
                                        { size: '26', chest: '14.5 – 15', len: '21', age: '7/8 yrs' },
                                        { size: '28', chest: '15.5 – 16', len: '22', age: '9/10 yrs' },
                                        { size: '30', chest: '16.5 – 17', len: '23', age: '11/12 yrs' },
                                        { size: '32', chest: '17.5 – 18', len: '24.5', age: '13/14 yrs' },
                                        { size: '34 (XXS)', chest: '18.5 – 19', len: '25', age: '15/16 yrs' },
                                        { size: 'XS (36)', chest: '19.5 – 20', len: '27', age: '' },
                                        { size: 'S (38)', chest: '20.5 – 21', len: '28', age: '' },
                                        { size: 'M (40)', chest: '21.5 – 22', len: '29', age: '' },
                                        { size: 'L (42)', chest: '22.5 – 23', len: '30', age: '' },
                                        { size: 'XL (44)', chest: '23.5 – 24', len: '31', age: '' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-3 py-2 font-bold text-rr-dark">{row.size}</td>
                                            <td className="px-3 py-2 text-rr-charcoal">{row.chest}</td>
                                            <td className="px-3 py-2 text-rr-charcoal">{row.len}</td>
                                            <td className="px-3 py-2 text-rr-pink font-semibold">{row.age}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="bg-slate-50 px-3 py-2 border-t border-slate-200">
                                <p className="text-slate-500 text-xs">Measurements are half-chest (chest ÷ 2). We recommend measuring your child and choosing accordingly. If between sizes, size up.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ComplianceCheckbox = ({ checked, onChange, error, children }) => (
    <div className="mb-4">
        <label className="flex items-start gap-3 cursor-pointer group">
            <div onClick={() => onChange(!checked)}
                className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-rr-pink border-rr-pink' : 'border-slate-300 bg-white group-hover:border-rr-pink'}`}>
                {checked && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-rr-charcoal text-sm font-medium leading-relaxed">{children}</span>
        </label>
        {error && <p className="text-red-500 text-xs font-medium mt-1 ml-8">{error}</p>}
    </div>
);

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source') || null, utm_medium: p.get('utm_medium') || null, utm_campaign: p.get('utm_campaign') || null };
};

// Meta Pixel — fire a Lead conversion on successful registration submit, so Junior Royals Term 3
// sign-ups are attributable/optimisable in Meta Ads (same pattern as the Power Game funnel).
const fireLeadEvent = (location) => {
    try {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
            window.fbq('track', 'Lead', {
                content_name: 'Junior Royals Term 3',
                content_category: location ? `junior-royals-term3-${location}` : 'junior-royals-term3',
            });
        }
    } catch (_) { /* never let analytics block the submit */ }
};

const JRT3RegistrationForm = () => {
    const earlyBird = isEarlyBird();
    if (TERM3_SOLD_OUT) return <SoldOutPanel />;
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPlayerCode, setAcceptPlayerCode] = useState(false);
    const [acceptParentCode, setAcceptParentCode] = useState(false);
    const [acceptSocialMedia, setAcceptSocialMedia] = useState(false);
    const [form, setForm] = useState({
        parent_name: '', parent_email: '', parent_phone: '',
        player_name: '', player_age: '', player_gender: '', suburb: '',
        location: '', group_selection: '', time_slot: '',
        requires_shirt: '', shirt_size: '',
    });

    const availableSessions = form.location && form.group_selection
        ? (SESSION_OPTIONS[form.location]?.[form.group_selection] || [])
        : [];
    const allTBC = availableSessions.every(s => s.value === 'tbc');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'location') setForm(p => ({ ...p, location: value, group_selection: '', time_slot: '' }));
        else if (name === 'group_selection') setForm(p => ({ ...p, group_selection: value, time_slot: '' }));
        else if (name === 'requires_shirt') setForm(p => ({ ...p, requires_shirt: value, shirt_size: value === 'no' ? '' : p.shirt_size }));
        else setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.parent_name.trim()) e.parent_name = 'Required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email required.';
        if (!form.parent_phone.trim()) e.parent_phone = 'Required.';
        if (!form.player_name.trim()) e.player_name = 'Required.';
        if (!form.player_age) e.player_age = 'Required.';
        if (!form.player_gender) e.player_gender = 'Required.';
        if (!form.suburb.trim()) e.suburb = 'Required.';
        if (!form.location) e.location = 'Please select a location.';
        if (!form.group_selection) e.group_selection = 'Please select an age group.';
        if (availableSessions.length > 0 && !allTBC && !form.time_slot) e.time_slot = 'Please select a session time.';
        if (!form.requires_shirt) e.requires_shirt = 'Please indicate whether you require a training shirt.';
        if (form.requires_shirt === 'yes' && !form.shirt_size) e.shirt_size = 'Please select a shirt size.';
        if (!acceptTerms) e.acceptTerms = 'Required.';
        if (!acceptPlayerCode) e.acceptPlayerCode = 'Required.';
        if (!acceptParentCode) e.acceptParentCode = 'Required.';
        if (!acceptSocialMedia) e.acceptSocialMedia = 'Required.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const utmParams = getUTMParams();
            const table = SUPABASE_TABLE[form.location];
            const payload = {
                accept_terms: acceptTerms, accept_player_code: acceptPlayerCode,
                accept_parent_code: acceptParentCode, accept_social_media: acceptSocialMedia,
                parent_name: form.parent_name.trim(), parent_email: form.parent_email.trim(),
                parent_phone: form.parent_phone.trim(), player_name: form.player_name.trim(),
                player_age: parseInt(form.player_age, 10), player_gender: form.player_gender,
                suburb: form.suburb.trim(), location: form.location,
                group_selection: form.group_selection, time_slot: form.time_slot || 'tbc',
                requires_shirt: form.requires_shirt === 'yes',
                shirt_size: form.shirt_size || null,
                source: `junior-royals-term3-${form.location}`,
                page_referrer: document.referrer || null, ...utmParams,
            };
            const { data, error: insertError } = await supabase.from(table).insert([payload]).select('id').single();
            if (insertError) throw insertError;
            try {
                await supabase.from('applications').insert([{
                    first_name: form.player_name.trim().split(' ')[0],
                    last_name: form.player_name.trim().split(' ').slice(1).join(' '),
                    email: form.parent_email.trim(), phone: form.parent_phone.trim(),
                    source: `junior-royals-term3-${form.location}`, program_type: 'Junior Royals Term 3',
                    ...utmParams, page_referrer: document.referrer || null,
                }]);
            } catch (_) {}
            if (data?.id) { localStorage.setItem('jr_record_id', data.id); localStorage.setItem('jr_location_t3', form.location); }
            fireLeadEvent(form.location);
            const stripeLink = getStripeLink(form.location);
            window.location.href = stripeLink
                ? buildStripeUrl(stripeLink, data?.id, form.location, form.parent_email.trim())
                : '/junior-royals/success';
        } catch (err) {
            console.error(err);
            setErrors({ form: 'Something went wrong. Please try again or email info@rramelbourne.com' });
            setSubmitting(false);
        }
    };

    const ic = (field) => `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;
    const lc = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    return (
        <section id="registration-form" className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">
                            {earlyBird ? 'Early Bird — $299 · Increases to $330 After 11pm 15 July' : 'Now Enrolling — Term 3, 2026'}
                        </span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-4">
                        SECURE YOUR <span className="text-rr-pink">PLACE</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="text-white/70 font-medium">
                        Fill in your details below, and to ensure you secure your place, payment for your preferred program is required.
                    </motion.p>
                </div>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-8 md:p-10">
                    <form onSubmit={handleSubmit} noValidate>

                        {/* Parent details */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Parent / Guardian Details</h3>
                            <div className="space-y-5">
                                <div><label className={lc}>Full Name *</label><input name="parent_name" value={form.parent_name} onChange={handleChange} className={ic('parent_name')} placeholder="e.g. Jane Smith" />{errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}</div>
                                <div><label className={lc}>Email Address *</label><input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={ic('parent_email')} placeholder="e.g. jane@email.com" />{errors.parent_email && <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>}</div>
                                <div><label className={lc}>Phone Number *</label><input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={ic('parent_phone')} placeholder="e.g. 0412 345 678" />{errors.parent_phone && <p className="text-red-500 text-xs mt-1">{errors.parent_phone}</p>}</div>
                            </div>
                        </div>

                        {/* Player details */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Player Details</h3>
                            <div className="space-y-5">
                                <div><label className={lc}>Player Full Name *</label><input name="player_name" value={form.player_name} onChange={handleChange} className={ic('player_name')} placeholder="e.g. Liam Smith" />{errors.player_name && <p className="text-red-500 text-xs mt-1">{errors.player_name}</p>}</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className={lc}>Player Age *</label>
                                        <select name="player_age" value={form.player_age} onChange={handleChange} className={ic('player_age')}>
                                            <option value="">Select age</option>
                                            {AGE_OPTIONS.map(a => <option key={a} value={a}>{a} years old</option>)}
                                        </select>{errors.player_age && <p className="text-red-500 text-xs mt-1">{errors.player_age}</p>}
                                    </div>
                                    <div><label className={lc}>Cricket Type *</label>
                                        <select name="player_gender" value={form.player_gender} onChange={handleChange} className={ic('player_gender')}>
                                            <option value="">Select</option>
                                            <option value="male">Male Cricket</option>
                                            <option value="female">Female Cricket</option>
                                        </select>{errors.player_gender && <p className="text-red-500 text-xs mt-1">{errors.player_gender}</p>}
                                    </div>
                                </div>
                                <div><label className={lc}>Suburb Travelling From *</label><input name="suburb" value={form.suburb} onChange={handleChange} className={ic('suburb')} placeholder="e.g. Mickleham" />{errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>}</div>
                            </div>
                        </div>

                        {/* Program selection */}
                        <div className="mb-8">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">Program Selection</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={lc}>Location *</label>
                                    <select name="location" value={form.location} onChange={handleChange} className={ic('location')}>
                                        <option value="">Select a location</option>
                                        <option value="mickleham">Mickleham Indoor Sports Centre</option>
                                        <option value="hallam">Elite Cricket Centre — Hallam</option>
                                        <option value="williamstown">The Netz — Williamstown</option>
                                    </select>
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                                {form.location && (
                                    <div>
                                        <label className={lc}>Age Group *</label>
                                        <select name="group_selection" value={form.group_selection} onChange={handleChange} className={ic('group_selection')}>
                                            <option value="">Select an age group</option>
                                            <option value="ages-7-9">Ages 7–9</option>
                                            <option value="ages-10-12">Ages 10–12</option>
                                            <option value="ages-13-15">Ages 13–15</option>
                                        </select>
                                        {errors.group_selection && <p className="text-red-500 text-xs mt-1">{errors.group_selection}</p>}
                                    </div>
                                )}
                                {form.location && form.group_selection && (
                                    allTBC ? (
                                        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
                                            <p className="text-amber-700 text-sm font-bold">⏰ Session times &amp; dates are coming soon.</p>
                                            <p className="text-amber-600 text-sm font-medium mt-1">Register now to secure your place. We will confirm your session time and start date via email once finalised.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className={lc}>Session Time *</label>
                                            <select name="time_slot" value={form.time_slot} onChange={handleChange} className={ic('time_slot')}>
                                                <option value="">Select a session</option>
                                                {availableSessions.map(s => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                            {errors.time_slot && <p className="text-red-500 text-xs mt-1">{errors.time_slot}</p>}
                                        </div>
                                    )
                                )}
                                {form.location && form.group_selection && (
                                    <SessionChangeNotice tone="light" />
                                )}
                            </div>
                        </div>

                        {/* Shirt */}
                        <div className="mb-8">
                            <div className="bg-rr-pink/5 border border-rr-pink/20 rounded-xl p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <span className="text-lg shrink-0">👕</span>
                                    <p className="text-rr-charcoal text-sm font-medium leading-relaxed">
                                        <span className="font-black text-rr-dark">Royals training shirt required.</span> A Rajasthan Royals training shirt must be worn at all Junior Royals sessions. Shirts can be purchased as an addition to your registration.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className={lc}>Do you require a Rajasthan Royals Academy Training Shirt? *</label>
                                        <select name="requires_shirt" value={form.requires_shirt} onChange={handleChange} className={ic('requires_shirt')}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes — I need to purchase a shirt</option>
                                            <option value="no">No — I already have one</option>
                                        </select>
                                        {errors.requires_shirt && <p className="text-red-500 text-xs mt-1">{errors.requires_shirt}</p>}
                                    </div>
                                    {form.requires_shirt === 'yes' && (
                                        <div>
                                            <label className={lc}>Shirt Size *</label>
                                            <select name="shirt_size" value={form.shirt_size} onChange={handleChange} className={ic('shirt_size')}>
                                                <option value="">Select a size</option>
                                                <optgroup label="Junior Sizes">
                                                    {SHIRT_SIZES_JUNIOR.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </optgroup>
                                                <optgroup label="Senior Sizes">
                                                    {SHIRT_SIZES_SENIOR.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </optgroup>
                                            </select>
                                            {errors.shirt_size && <p className="text-red-500 text-xs mt-1">{errors.shirt_size}</p>}
                                            <SizingChart />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Agreements */}
                        <div className="mb-8 pt-6 border-t border-slate-100">
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-6">Agreements &amp; Consent</h3>
                            <ComplianceCheckbox checked={acceptTerms} onChange={setAcceptTerms} error={errors.acceptTerms}>
                                I have read and agree to the <a href="/terms-conditions" target="_blank" className="text-rr-pink hover:underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" className="text-rr-pink hover:underline">Privacy Policy</a>. I confirm all information provided is accurate. I understand session times and session allocation may change in line with clause 11 of those terms.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptPlayerCode} onChange={setAcceptPlayerCode} error={errors.acceptPlayerCode}>
                                I have read and agree to the <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" className="text-rr-pink hover:underline">Player Code of Conduct</a>.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptParentCode} onChange={setAcceptParentCode} error={errors.acceptParentCode}>
                                I have read and agree to the <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" className="text-rr-pink hover:underline">Parent/Guardian Code of Conduct</a>.
                            </ComplianceCheckbox>
                            <ComplianceCheckbox checked={acceptSocialMedia} onChange={setAcceptSocialMedia} error={errors.acceptSocialMedia}>
                                I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne's social media and marketing channels.
                            </ComplianceCheckbox>
                        </div>

                        {errors.form && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"><p className="text-red-600 text-sm font-medium">{errors.form}</p></div>}

                        <button type="submit" disabled={submitting}
                            className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)] flex items-center justify-center gap-3">
                            {submitting ? (
                                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Submitting...</>
                            ) : (
                                <>{earlyBird ? `Register & Pay — Early Bird $299` : `Register & Pay — $330`}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default JRT3RegistrationForm;

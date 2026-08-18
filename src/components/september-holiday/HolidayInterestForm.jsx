import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

// Expression-of-interest form for the September/October school holiday camp at
// Centres across Melbourne. NO payment is taken here — the camp dates,
// daily times and cost are not locked yet, so this form exists to (a) let families
// put their hand up and (b) tell us which centre and which week they want, which
// is what decides the final schedule. Entries land in holiday_camp_interest
// (anon INSERT only — a parent can submit, but nobody can read the list back
// without an admin login). Replace with a paid registration form once dates,
// times and price are confirmed.

const CENTRES = [
    { value: 'mickleham',    label: 'Mickleham Indoor Sports Centre (northern Melbourne)' },
    { value: 'cranbourne-north', label: 'Elite Cricket Centre — Cranbourne North (south-east Melbourne)' },
    { value: 'williamstown', label: 'The Netz — Williamstown (western Melbourne)' },
    { value: 'any',          label: 'Any of the three — we can travel' },
];

const WEEKS = [
    { value: 'week-1', label: 'First week of the holidays (21 – 25 September)' },
    { value: 'week-2', label: 'Second week of the holidays (28 September – 2 October)' },
    { value: 'either', label: 'Either week works for us' },
];

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
    };
};

const HolidayInterestForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        parent_name: '', parent_email: '', parent_phone: '',
        player_name: '', player_age: '', preferred_centre: '', preferred_week: '', notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.parent_name.trim()) e.parent_name = 'Please tell us your name.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'We need a valid email — that is how we send you the dates.';
        if (!form.player_name.trim()) e.player_name = 'Please tell us the player\'s name.';
        if (!form.player_age) e.player_age = 'Please select an age.';
        if (!form.preferred_centre) e.preferred_centre = 'Please pick the centre you would come to.';
        if (!form.preferred_week) e.preferred_week = 'Please pick the week that suits you.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const { error } = await supabase.from('holiday_camp_interest').insert([{
                parent_name: form.parent_name.trim(),
                parent_email: form.parent_email.trim(),
                parent_phone: form.parent_phone.trim() || null,
                player_name: form.player_name.trim(),
                player_age: parseInt(form.player_age, 10),
                preferred_centre: form.preferred_centre,
                preferred_week: form.preferred_week,
                notes: form.notes.trim() || null,
                source: 'holiday-camp-interest',
                page_referrer: document.referrer || null,
                ...getUTMParams(),
            }]);
            if (error) throw error;
            try {
                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                    window.fbq('track', 'Lead', {
                        content_name: 'Junior Royals Holiday Camp — Interest',
                        content_category: `holiday-camp-${form.preferred_centre}`,
                    });
                }
            } catch (_) { /* never let analytics block the submit */ }
            setDone(true);
        } catch (err) {
            console.error(err);
            setErrors({ form: 'Something went wrong and your details were not saved. Please try again, or email info@rramelbourne.com and we will add you to the list ourselves.' });
            setSubmitting(false);
        }
    };

    const ic = (field) => `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;
    const lc = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';

    const centreLabel = CENTRES.find(c => c.value === form.preferred_centre)?.label || 'your preferred centre';

    return (
        <section className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-rr-pink/10 border border-rr-pink/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                        <span className="text-xs font-bold text-rr-pink uppercase tracking-widest">September / October School Holidays</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                        REGISTER YOUR <span className="text-rr-pink">INTEREST</span>
                    </h2>
                    <p className="text-white/80 font-medium leading-relaxed">
                        We are running the Junior Royals Holiday Camp again over the September / October school
                        holidays, at our centres across Melbourne. Tell us which
                        centre you would come to and which week suits your family, and that is what we build the
                        schedule from.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-10">
                    {done ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-rr-pink/10 border-2 border-rr-pink flex items-center justify-center mx-auto mb-5">
                                <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-3">You're on the list</h3>
                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed max-w-md mx-auto">
                                We have {form.player_name.trim() || 'your player'} down for the holiday camp at {centreLabel}.
                                No payment has been taken and no place is booked yet — this tells us you want in.
                                Once we lock the dates we will email you first, with the exact days, the daily start
                                and finish times, the cost, and a link to book. If your plans change before then,
                                just reply to that email.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-2">Tell us you're interested</h3>
                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed mb-6">
                                This takes about a minute. <span className="font-black text-rr-dark">No payment is taken now
                                and this does not book a place.</span> When the dates are confirmed we email everyone on
                                this list first — with the days, the times, the cost, and a booking link — before the
                                camp goes on sale to anyone else.
                            </p>
                            <div className="space-y-5">
                                <div>
                                    <label className={lc}>Parent / Guardian Full Name *</label>
                                    <input name="parent_name" value={form.parent_name} onChange={handleChange} className={ic('parent_name')} placeholder="e.g. Jane Smith" />
                                    {errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={lc}>Email Address *</label>
                                        <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={ic('parent_email')} placeholder="e.g. jane@email.com" />
                                        {errors.parent_email && <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>}
                                    </div>
                                    <div>
                                        <label className={lc}>Phone Number</label>
                                        <input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={ic('parent_phone')} placeholder="e.g. 0412 345 678" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={lc}>Player Full Name *</label>
                                        <input name="player_name" value={form.player_name} onChange={handleChange} className={ic('player_name')} placeholder="e.g. Liam Smith" />
                                        {errors.player_name && <p className="text-red-500 text-xs mt-1">{errors.player_name}</p>}
                                    </div>
                                    <div>
                                        <label className={lc}>Player Age *</label>
                                        <select name="player_age" value={form.player_age} onChange={handleChange} className={ic('player_age')}>
                                            <option value="">Select age</option>
                                            {Array.from({ length: 9 }, (_, i) => i + 7).map(a => <option key={a} value={a}>{a} years old</option>)}
                                        </select>
                                        {errors.player_age && <p className="text-red-500 text-xs mt-1">{errors.player_age}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className={lc}>Which centre would you come to? *</label>
                                    <select name="preferred_centre" value={form.preferred_centre} onChange={handleChange} className={ic('preferred_centre')}>
                                        <option value="">Select a centre</option>
                                        {CENTRES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                    {errors.preferred_centre && <p className="text-red-500 text-xs mt-1">{errors.preferred_centre}</p>}
                                </div>
                                <div>
                                    <label className={lc}>Which week suits you? *</label>
                                    <select name="preferred_week" value={form.preferred_week} onChange={handleChange} className={ic('preferred_week')}>
                                        <option value="">Select a week</option>
                                        {WEEKS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                                    </select>
                                    <p className="text-rr-charcoal/70 text-xs font-medium mt-2">
                                        Victorian school holidays run Saturday 19 September to Sunday 4 October 2026. The camp
                                        runs on three days inside one of those two weeks — your answer helps us choose which.
                                    </p>
                                    {errors.preferred_week && <p className="text-red-500 text-xs mt-1">{errors.preferred_week}</p>}
                                </div>
                                <div>
                                    <label className={lc}>Anything we should know? <span className="text-rr-charcoal/50 font-bold normal-case tracking-normal">(optional)</span></label>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className={ic('notes')}
                                        placeholder="A question about the camp, a sibling you'd like to bring, days you definitely can't do, an injury or medical need — anything at all."
                                    />
                                </div>
                            </div>

                            {errors.form && <p className="text-red-500 text-sm font-medium mt-5">{errors.form}</p>}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-7 bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full text-sm transition-all duration-300 hover:shadow-[0_0_24px_rgba(229,6,149,0.45)]"
                            >
                                {submitting ? 'Sending…' : 'Register My Interest'}
                            </button>
                            <p className="text-center text-rr-charcoal/60 text-xs font-medium mt-4 leading-relaxed">
                                No payment now. We use these details only to contact you about the holiday camp.
                                Questions in the meantime: <a href="mailto:info@rramelbourne.com" className="text-rr-pink font-bold hover:underline">info@rramelbourne.com</a>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HolidayInterestForm;

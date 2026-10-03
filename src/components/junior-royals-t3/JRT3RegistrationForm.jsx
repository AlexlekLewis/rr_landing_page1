import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { JR_T4 } from './jrTerm4Data';

// Junior Royals — Term 4 entry form. Entries land in jr_term4_waitlist
// (anon INSERT only — parents can enter but nobody can read the list back
// without an admin login). No payment is taken and no place is held.
//
// The old Term 3 paid form (early-bird $299/$330, Term 3 Stripe links, the
// jr_term3_* inserts) was deleted on 3 Oct 2026 so no switch can resell
// Term 3. The jr_term3_* tables and their sheet sync are untouched.
//
// TERM 4 RUNS AT TWO CENTRES: Mickleham Indoor Sports Centre, Mickleham, and
// the Elite Cricket Centre, 30 Medley Dr, Cranbourne North. The south-east
// program MOVED from Hallam to Cranbourne North (Alex, 30 Sep 2026); it did
// not close. Do not put a centre on this list without a booking behind it.
//
// WEDNESDAY IS THE ONLY NIGHT (Alex, 3 Oct 2026). The form no longer asks
// which night; every entry is sent with preferred_day 'wednesday' so the
// Junior Royals sheet sync (api/sync-program-signups.js) labels it correctly.

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return { utm_source: p.get('utm_source') || null, utm_medium: p.get('utm_medium') || null, utm_campaign: p.get('utm_campaign') || null };
};

const AGE_OPTIONS = Array.from({ length: JR_T4.ageMax - JR_T4.ageMin + 1 }, (_, i) => i + JR_T4.ageMin); // 7–15

export const JR_T4_CONFIRMATION =
    `We've got your Term 4 entry. No payment has been taken and no place is held yet. We'll email you the price and how to book before the first session on ${JR_T4.firstSessionLong}.`;

const JRT3RegistrationForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        parent_name: '', parent_email: '', parent_phone: '',
        player_name: '', player_age: '', preferred_centre: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.parent_name.trim()) e.parent_name = 'Required.';
        if (!form.parent_email.trim() || !/\S+@\S+\.\S+/.test(form.parent_email)) e.parent_email = 'Valid email required.';
        if (!form.player_name.trim()) e.player_name = 'Required.';
        if (!form.player_age) e.player_age = 'Required.';
        if (!form.preferred_centre) e.preferred_centre = 'Please pick a centre.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const utm = getUTMParams();
            const { error } = await supabase.from('jr_term4_waitlist').insert([{
                parent_name: form.parent_name.trim(),
                parent_email: form.parent_email.trim(),
                parent_phone: form.parent_phone.trim() || null,
                player_name: form.player_name.trim(),
                player_age: parseInt(form.player_age, 10),
                preferred_centre: form.preferred_centre,
                preferred_day: 'wednesday',
                source: 'junior-royals-term4-entry',
                page_referrer: document.referrer || null,
                ...utm,
            }]);
            if (error) throw error;
            try {
                if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
                    window.fbq('track', 'Lead', {
                        content_name: 'Junior Royals Term 4 Entry',
                        content_category: `junior-royals-term4-${form.preferred_centre}`,
                    });
                }
            } catch (_) { /* never let analytics block the submit */ }
            setDone(true);
        } catch (err) {
            console.error(err);
            setErrors({ form: 'Something went wrong — please try again, or email info@rramelbourne.com and we\'ll enter you manually.' });
            setSubmitting(false);
        }
    };

    const ic = (field) => `w-full bg-slate-50 border ${errors[field] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink transition-colors duration-200 text-sm`;
    const lc = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
    const [mickleham, cranbourne] = JR_T4.centres;

    return (
        <section id="registration-form" className="py-24 bg-rr-dark">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-10">
                    <p className="text-xs font-bold text-rr-pink uppercase tracking-widest mb-6">Junior Royals — {JR_T4.term}</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wide mb-6">
                        REGISTER YOUR <span className="text-rr-pink">INTEREST</span>
                    </h2>
                    <p className="text-white/80 font-medium leading-relaxed mb-4">
                        Term 4 runs on <span className="font-black text-white">Wednesday nights, {JR_T4.datesLong}</span>, at <span className="font-black text-white">{mickleham.venue}, {mickleham.suburb}</span> and the <span className="font-black text-white">{cranbourne.venue}, {cranbourne.suburb}</span>. Each player trains for one hour a week, in the 6:00pm or 7:00pm group. If your player did Junior Royals last term, nothing carries over automatically, so please register below.
                    </p>
                    <p className="text-white/80 font-medium leading-relaxed">{JR_T4.noPaymentLine}</p>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-10">
                    {done ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-rr-pink/10 border-2 border-rr-pink flex items-center justify-center mx-auto mb-5">
                                <svg className="w-8 h-8 text-rr-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-rr-dark uppercase tracking-wide mb-3">Your Term 4 entry is in</h3>
                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed max-w-md mx-auto">{JR_T4_CONFIRMATION}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <h3 className="text-base font-black text-rr-dark uppercase tracking-widest mb-2">Term 4 entry</h3>
                            <p className="text-rr-charcoal text-sm font-medium leading-relaxed mb-6">
                                Term 4 is Wednesday nights only. Fill in the details below and pick the centre your player can get to every week.
                            </p>
                            <div className="space-y-5">
                                <div><label className={lc}>Parent / Guardian Full Name *</label><input name="parent_name" value={form.parent_name} onChange={handleChange} className={ic('parent_name')} placeholder="e.g. Jane Smith" />{errors.parent_name && <p className="text-red-500 text-xs mt-1">{errors.parent_name}</p>}</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><label className={lc}>Email Address *</label><input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={ic('parent_email')} placeholder="e.g. jane@email.com" />{errors.parent_email && <p className="text-red-500 text-xs mt-1">{errors.parent_email}</p>}</div>
                                    <div><label className={lc}>Phone Number</label><input name="parent_phone" type="tel" value={form.parent_phone} onChange={handleChange} className={ic('parent_phone')} placeholder="e.g. 0412 345 678" /></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><label className={lc}>Player Full Name *</label><input name="player_name" value={form.player_name} onChange={handleChange} className={ic('player_name')} placeholder="e.g. Liam Smith" />{errors.player_name && <p className="text-red-500 text-xs mt-1">{errors.player_name}</p>}</div>
                                    <div><label className={lc}>Player Age *</label>
                                        <select name="player_age" value={form.player_age} onChange={handleChange} className={ic('player_age')}>
                                            <option value="">Select age</option>
                                            {AGE_OPTIONS.map(a => <option key={a} value={a}>{a} years old</option>)}
                                        </select>{errors.player_age && <p className="text-red-500 text-xs mt-1">{errors.player_age}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className={lc}>Centre *</label>
                                    <select name="preferred_centre" value={form.preferred_centre} onChange={handleChange} className={ic('preferred_centre')}>
                                        <option value="">Select a centre</option>
                                        {JR_T4.centres.map(c => <option key={c.value} value={c.value}>{c.venue}, {c.suburb}</option>)}
                                    </select>
                                    {errors.preferred_centre && <p className="text-red-500 text-xs mt-1">{errors.preferred_centre}</p>}
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed mt-2">{JR_T4.centresApart}</p>
                                </div>
                            </div>
                            {errors.form && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6"><p className="text-red-600 text-sm font-medium">{errors.form}</p></div>}
                            <button type="submit" disabled={submitting}
                                className="mt-8 w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_28px_rgba(229,6,149,0.45)]">
                                {submitting ? 'Sending…' : JR_T4.ctaLabel}
                            </button>
                            <p className="text-slate-500 text-xs text-center mt-4">{JR_T4.noPaymentLine}</p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default JRT3RegistrationForm;

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

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

const QuickRegister = () => {
    const [form, setForm] = useState({ parent_name: '', parent_email: '', parent_phone: '', location: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async () => {
        if (!form.parent_name.trim() || !/\S+@\S+\.\S+/.test(form.parent_email) || !form.parent_phone.trim()) {
            setError('Please fill in your name, a valid email and phone number.');
            return;
        }
        setSaving(true);
        try {
            const { data: inserted, error: insErr } = await supabase
                .from('junior_royals_sept_holidays_registrations')
                .insert([{
                    parent_name: form.parent_name.trim(),
                    parent_email: form.parent_email.trim().toLowerCase(),
                    parent_phone: form.parent_phone.trim(),
                    location: form.location || null,
                    status: 'lead',
                    ...getUTM(),
                }])
                .select('id')
                .single();
            if (insErr) throw insErr;
            // Hand details to the full form
            sessionStorage.setItem('jr_sept_lead', JSON.stringify({ id: inserted.id, ...form }));
            document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
        } catch (e) {
            // Even on failure, still take them to the form
            sessionStorage.setItem('jr_sept_lead', JSON.stringify({ id: null, ...form }));
            document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    const input = 'w-full bg-white/10 border border-white/25 rounded-xl px-4 py-3 text-white placeholder-white/40 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rr-pink/60 focus:border-rr-pink transition-all';

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-7 max-w-md w-full">
            <p className="text-white font-black uppercase tracking-wide text-lg mb-1">Register Your Interest</p>
            <p className="text-white/50 text-xs font-medium mb-5">Free — takes 20 seconds. We'll hold your details while you decide.</p>
            <div className="space-y-3 mb-4">
                <input name="parent_name" value={form.parent_name} onChange={handleChange} className={input} placeholder="Parent / Guardian name" />
                <input name="parent_email" type="email" value={form.parent_email} onChange={handleChange} className={input} placeholder="Email address" />
                <input name="parent_phone" value={form.parent_phone} onChange={handleChange} className={input} placeholder="Phone number" />
                <select name="location" value={form.location} onChange={handleChange} className={input + ' [&>option]:text-rr-dark'}>
                    <option value="">Location of interest (optional)</option>
                    <option value="mickleham">Mickleham — Sept 23–25</option>
                    <option value="cranbourne-north">Cranbourne North — Sept 30 – Oct 2</option>
                    <option value="western-melbourne">Western Melbourne (Coming Soon)</option>
                    <option value="eastern-melbourne">Eastern Melbourne (Coming Soon)</option>
                </select>
            </div>
            {error && <p className="text-rr-pink text-xs font-bold mb-3">{error}</p>}
            <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-black uppercase tracking-widest py-4 rounded-full text-sm transition-all duration-300 hover:shadow-[0_0_28px_rgba(225,31,143,0.55)]"
            >
                {saving ? 'Saving...' : 'Register Your Interest'}
            </button>
            <p className="text-white/35 text-[10px] text-center mt-3">No payment required at this step.</p>
        </div>
    );
};

export default QuickRegister;

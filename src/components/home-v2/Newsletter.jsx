import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// "Register for more information": the Academy newsletter sign-up (Andy, 24 Nov 2026: "a data capture
// simple style component that is elegant and fits in with our new design"). Saves to
// newsletter_subscribers (migration 20261124090000): insert only from the site, one row per email.
// Used on the home page and /programs. No personal details go to analytics, only the click.

const INTERESTS = ['Everything', 'Junior Royals', 'Performance Squads', 'Private Coaching', 'Spin Club', 'High Performance Camp · India'];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const Newsletter = ({ source = 'home' }) => {
    const [form, setForm] = useState({ first_name: '', email: '', interest: 'Everything', consent: false });
    const [state, setState] = useState('idle'); // idle | sending | done | already | error
    const [msg, setMsg] = useState('');
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        const email = form.email.trim();
        if (!EMAIL_RE.test(email)) { setState('error'); setMsg('Please enter a valid email address.'); return; }
        if (!form.consent) { setState('error'); setMsg('Please tick the box so we can email you.'); return; }
        setState('sending'); setMsg('');
        const q = new URLSearchParams(window.location.search);
        const { error } = await supabase.from('newsletter_subscribers').insert([{
            first_name: form.first_name.trim() || null,
            email,
            interest: form.interest,
            consent: true,
            source_page: `${window.location.pathname}#${source}`.slice(0, 200),
            utm_source: q.get('utm_source'),
            utm_medium: q.get('utm_medium'),
            utm_campaign: q.get('utm_campaign'),
        }]);
        if (!error) { setState('done'); return; }
        if (error.code === '23505') { setState('already'); return; }
        setState('error'); setMsg('Something went wrong. Please try again, or email info@rramelbourne.com.');
    };

    const finished = state === 'done' || state === 'already';
    return (
        <section className="strip nl-wrap" id="newsletter">
            <div className="wrap">
                <div className="nlbox">
                    <div className="nl-copy">
                        <span className="eyebrow">Register for more information</span>
                        <h2>THE ACADEMY NEWSLETTER</h2>
                        <p>New programs, trial dates, tour news and player stories from Rajasthan Royals Academy Melbourne, straight to your inbox.</p>
                    </div>
                    {finished ? (
                        <div className="nl-done" role="status">
                            <span className="nl-tick"><Check /></span>
                            <div>
                                <b>{state === 'done' ? `You're on the list${form.first_name.trim() ? `, ${form.first_name.trim()}` : ''}!` : "You're already on the list."}</b>
                                <span>Look out for our next update. You can unsubscribe at any time.</span>
                            </div>
                        </div>
                    ) : (
                        <form className="nl-form" onSubmit={submit} noValidate>
                            <div className="nl-row">
                                <label className="nl-field"><span>First name</span>
                                    <input type="text" autoComplete="given-name" maxLength={80} value={form.first_name} onChange={set('first_name')} placeholder="Your first name" />
                                </label>
                                <label className="nl-field"><span>Email *</span>
                                    <input type="email" inputMode="email" autoComplete="email" required maxLength={254} value={form.email} onChange={set('email')} placeholder="you@email.com" />
                                </label>
                            </div>
                            <label className="nl-field"><span>Most interested in</span>
                                <select value={form.interest} onChange={set('interest')}>
                                    {INTERESTS.map((i) => <option key={i}>{i}</option>)}
                                </select>
                            </label>
                            <label className="nl-consent">
                                <input type="checkbox" checked={form.consent} onChange={set('consent')} />
                                <span>I'm happy to receive emails from Rajasthan Royals Academy Melbourne. Unsubscribe any time. <Link to="/privacy-policy">Privacy Policy</Link></span>
                            </label>
                            {state === 'error' && <p className="nl-err" role="alert">{msg}</p>}
                            <button className="btn nl-btn" type="submit" disabled={state === 'sending'} data-cta={`newsletter-signup-${source}`}>
                                {state === 'sending' ? 'Signing up…' : <>Sign Up <ArrowRight /></>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;

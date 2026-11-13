import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import DateOfBirthInput from '../DateOfBirthInput';
import { MATCH, ROLES, LEVELS, STEPS, nominationsClosed, ageOnMatchDay } from './plOptions';

// Power League nomination form (Alex, 19 Oct 2026).
//
// Writes to `applications` with program_type 'Power League', exactly as the
// first version did, so the existing Google Sheets and pipeline triggers keep
// firing and api/sync-program-signups.js puts every row on the "Power League"
// tab. No schema change: dob, experience_level, history and the four accept_*
// columns already exist on the table.
//
//   • date of birth, not a typed age: the age shown and saved is the age ON
//     MATCH DAY, which is what the 10 to 25 band means
//   • club and highest weekend level are required — the coaches pick sides on them
//   • under 18 the contact details are the PARENT OR GUARDIAN's, and only they
//     can accept the parent code of conduct
//   • it is a FILMED EVENT (Alex, 19 Oct 2026), so consent to filming is
//     required to take part: footage can be shared beyond our control
//   • the form closes itself at MATCH.closesAt
const PROGRAM_TYPE = 'Power League';
const SOURCE = 'power-league-nomination';

// ── Anti-bot. Every insert into `applications` fires a Zapier webhook, which is
// billed per task, so scripted junk costs money as well as cluttering the
// coaches' sheet. A honeypot plus a per-browser throttle stops the cheap kind.
const THROTTLE_KEY = 'pl_nominate_last_submit';
const THROTTLE_MS = 20 * 1000;
const HOURLY_KEY = 'pl_nominate_submits_hour';
const HOURLY_CAP = 6;

const throttleCheck = () => {
    try {
        const now = Date.now();
        const last = Number(window.localStorage.getItem(THROTTLE_KEY) || 0);
        if (now - last < THROTTLE_MS) return 'That went through a moment ago. Give it a few seconds before trying again.';
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]').filter((t) => now - t < 3600 * 1000);
        if (recent.length >= HOURLY_CAP) return 'That is a lot of nominations from one device. Email alex.lewis@rramelbourne.com and we will add the rest by hand.';
        return null;
    } catch {
        return null; // storage blocked: never turn a real player away over it
    }
};

const throttleRecord = () => {
    try {
        const now = Date.now();
        window.localStorage.setItem(THROTTLE_KEY, String(now));
        const recent = JSON.parse(window.localStorage.getItem(HOURLY_KEY) || '[]').filter((t) => now - t < 3600 * 1000);
        window.localStorage.setItem(HOURLY_KEY, JSON.stringify([...recent, now]));
    } catch { /* ignore */ }
};

const getUTMParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
        utm_source: p.get('utm_source') || null,
        utm_medium: p.get('utm_medium') || null,
        utm_campaign: p.get('utm_campaign') || null,
    };
};

const EMPTY = {
    first_name: '', last_name: '', dob: '', club: '', level: '', grade: '', role: '',
    parent_name: '', email: '', phone: '', medical: '', notes: '',
    available: false, squad_interest: false,
    accept_terms: false, accept_player_code: false, accept_parent_code: false, accept_social_media: false,
    website: '', // honeypot: people never see it, scripts fill it in
};

const Tick = ({ checked, onChange, children }) => (
    <label className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 cursor-pointer">
        <input type="checkbox" className="mt-1 w-5 h-5 accent-rr-pink shrink-0" checked={checked} onChange={onChange} />
        <span className="text-[15px] text-rr-dark font-semibold leading-relaxed">{children}</span>
    </label>
);

const PLForm = () => {
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const set = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.value }));
    const tick = (f) => (e) => setForm((s) => ({ ...s, [f]: e.target.checked }));

    const age = ageOnMatchDay(form.dob);
    const isMinor = age !== null && age < 18;
    const closed = nominationsClosed();

    const validate = () => {
        if (!form.first_name.trim() || !form.last_name.trim()) return 'Please give the player’s first and last name.';
        if (age === null) return 'Please give the player’s date of birth.';
        if (age < 10 || age > 25) return `Power League is for players aged 10 to 25 on ${MATCH.date}. This date of birth makes the player ${age}.`;
        if (!form.club.trim()) return 'Please tell us the club they play for on weekends (write "None" if they do not play for one).';
        if (!form.level) return 'Please choose the highest level they have played on a weekend.';
        if (!form.role) return 'Please tell us what the player does.';
        if (isMinor && !form.parent_name.trim()) return 'For players under 18, please give a parent or guardian’s name.';
        if (!form.email.trim() || !form.email.includes('@')) return 'Please give an email address we can reply to.';
        if (form.phone.replace(/\D/g, '').length < 8) return 'Please give a phone number we can call or text.';
        if (!form.available) return `Please confirm the player can play at either start time on ${MATCH.date}.`;
        if (!form.accept_terms) return 'Please agree to the Terms & Conditions and Privacy Policy.';
        if (!form.accept_player_code) return 'Please agree to the Player Code of Conduct.';
        if (isMinor && !form.accept_parent_code) return 'The parent or guardian needs to agree to the Parent/Guardian Code of Conduct.';
        if (!form.accept_social_media) return 'This is a filmed event, so we need consent to film the player before they can play.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nominationsClosed()) { setError(`Nominations closed ${MATCH.closes}.`); return; }
        const problem = validate();
        if (problem) { setError(problem); return; }
        if (form.website) { setSubmitted(true); return; } // honeypot tripped: look done, save nothing
        const held = throttleCheck();
        if (held) { setError(held); return; }
        setError(''); setSubmitting(true);

        const email = form.email.trim().toLowerCase();
        const phone = form.phone.trim();
        const bio = [
            `Nominated for Power League, ${MATCH.date}`,
            `Plays: ${form.role}`,
            `Highest weekend level: ${form.level}${form.grade.trim() ? ` (${form.grade.trim()})` : ''}`,
            `Available for any afternoon start from 1pm: yes`,
            form.medical.trim() ? `Medical or injuries: ${form.medical.trim()}` : '',
            form.squad_interest ? 'Also wants to hear about Performance Squad trials: yes' : '',
            form.notes.trim() ? `Notes: ${form.notes.trim()}` : '',
        ].filter(Boolean).join('\n\n');

        const { error: insertError } = await supabase.from('applications').insert([{
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            dob: form.dob,
            age,
            email,
            phone,
            club: form.club.trim(),
            experience_level: form.level,
            history: form.grade.trim() || null,
            cricket_type: form.role,
            parent1_name: isMinor ? form.parent_name.trim() : null,
            parent1_email: isMinor ? email : null,
            parent1_phone: isMinor ? phone : null,
            program_type: PROGRAM_TYPE,
            program: `Power League — ${MATCH.date}`,
            source: SOURCE,
            payment_option_selected: `${MATCH.fee} ${MATCH.feeUnit}, only if picked`,
            accept_terms: form.accept_terms,
            accept_player_code: form.accept_player_code,
            accept_parent_code: isMinor ? form.accept_parent_code : null,
            accept_social_media: form.accept_social_media,
            bio,
            page_referrer: document.referrer || null,
            ...getUTMParams(),
        }]);

        setSubmitting(false);
        if (insertError) {
            console.error(insertError);
            setError('Something went wrong sending your nomination. Please try again, or email alex.lewis@rramelbourne.com and we will add the player by hand.');
            return;
        }
        throttleRecord();
        try {
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'Lead', { content_name: 'Power League Nomination', content_category: 'power-league-2026-10-25' });
            }
        } catch { /* analytics never blocks a nomination */ }
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="bg-rr-dark py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rr-pink to-transparent" />
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-5">
                        Nomination in
                    </h2>
                    <p className="text-base text-white/80 font-medium leading-relaxed mb-4">
                        <strong className="text-white">{`${form.first_name} ${form.last_name}`.trim()}</strong> is
                        nominated for <strong className="text-white">{MATCH.date}</strong>. We contact picked
                        players by <strong className="text-white">{MATCH.notifyBy}</strong> with their side, the
                        ground, the start time and a link to pay the {MATCH.fee}. If you have not heard from us
                        by then, the player has not been picked for this game.
                    </p>
                    <p className="text-sm text-white/55 font-medium">
                        Nothing has been charged and no place is held yet. Questions:{' '}
                        <span className="text-rr-pink">alex.lewis@rramelbourne.com</span>.
                    </p>
                </div>
            </section>
        );
    }

    if (closed) {
        return (
            <section className="bg-white py-20 md:py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">Nominations closed</p>
                    <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                        Nominations for {MATCH.date} have closed
                    </h2>
                    <p className="text-base text-rr-dark/70 font-medium leading-relaxed">
                        They closed {MATCH.closes}. If you nominated a player, we contact picked players by{' '}
                        <strong className="text-rr-dark">{MATCH.notifyBy}</strong>. To hear about the next
                        Power League game or Performance Squad trials, email{' '}
                        <span className="text-rr-pink font-bold">alex.lewis@rramelbourne.com</span>.
                    </p>
                </div>
            </section>
        );
    }

    const ic = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-rr-dark font-medium focus:outline-none focus:border-rr-pink';
    const lc = 'block text-xs font-black text-rr-dark uppercase tracking-widest mb-2';
    const opt = <span className="text-rr-dark/40 font-bold normal-case tracking-normal">(optional)</span>;
    const link = 'text-rr-pink underline font-bold';

    return (
        <section className="bg-white py-20 md:py-28">
            <div className="max-w-3xl mx-auto px-6">
                <p className="text-xs font-black text-rr-pink uppercase tracking-[0.3em] mb-4">Closes {MATCH.closes}</p>
                <h2 className="text-3xl md:text-5xl font-black text-rr-dark uppercase tracking-tight leading-none mb-5">
                    Nominate a player
                </h2>
                <p className="text-base text-rr-dark/70 font-medium leading-relaxed mb-4">
                    Players can nominate themselves, or a coach or parent can do it for them. You do
                    not need any connection to the Academy. One form per player.
                </p>
                <div className="border-l-4 border-rr-pink pl-5 py-1 mb-9">
                    <p className="text-sm font-black text-rr-pink uppercase tracking-widest mb-2">What happens next</p>
                    <p className="text-[15px] text-rr-dark/80 font-semibold leading-relaxed">
                        Nominations close <strong className="text-rr-dark">{MATCH.closes}</strong>. {STEPS[1][1]}{' '}
                        The <strong className="text-rr-dark">{MATCH.fee}</strong> match fee is only paid if the
                        player is picked — nothing is taken on this page.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="hidden" aria-hidden="true">
                        <label htmlFor="pl-website">Leave this empty</label>
                        <input id="pl-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                    </div>

                    <p className="text-[11px] font-black text-rr-pink uppercase tracking-[0.25em] pt-2">The player</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="pl-first">First name</label>
                            <input id="pl-first" className={ic} autoComplete="given-name" value={form.first_name} onChange={set('first_name')} />
                        </div>
                        <div>
                            <label className={lc} htmlFor="pl-last">Last name</label>
                            <input id="pl-last" className={ic} autoComplete="family-name" value={form.last_name} onChange={set('last_name')} />
                        </div>
                    </div>

                    <div>
                        <DateOfBirthInput value={form.dob} onChange={(v) => setForm((s) => ({ ...s, dob: v }))} required />
                        {age !== null && (
                            <p className={`-mt-3 text-sm font-bold ${age < 10 || age > 25 ? 'text-red-600' : 'text-rr-dark/60'}`}>
                                Age on {MATCH.date}: {age}{age < 10 || age > 25 ? ' — Power League is for players 10 to 25' : ''}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="pl-club">Club they play for on weekends</label>
                            <input id="pl-club" className={ic} value={form.club} onChange={set('club')} placeholder='e.g. Lower Plenty CC, or "None"' />
                        </div>
                        <div>
                            <label className={lc} htmlFor="pl-role">What do they do?</label>
                            <select id="pl-role" className={ic} value={form.role} onChange={set('role')}>
                                <option value="">Choose one</option>
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={lc} htmlFor="pl-level">Highest level they have played on a weekend</label>
                        <select id="pl-level" className={ic} value={form.level} onChange={set('level')}>
                            <option value="">Choose one</option>
                            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <p className="text-[13px] text-rr-dark/55 font-medium mt-2">Pick the highest, even if it was only a few games.</p>
                    </div>

                    <div>
                        <label className={lc} htmlFor="pl-grade">Which grade or team? {opt}</label>
                        <input id="pl-grade" className={ic} value={form.grade} onChange={set('grade')} placeholder="e.g. Under 14 Division 1, or 2nd XI" />
                    </div>

                    <p className="text-[11px] font-black text-rr-pink uppercase tracking-[0.25em] pt-4">
                        {isMinor ? 'Parent or guardian — the person we contact' : 'Contact details'}
                    </p>
                    {isMinor && (
                        <div>
                            <label className={lc} htmlFor="pl-parent">Parent or guardian’s name</label>
                            <input id="pl-parent" className={ic} autoComplete="name" value={form.parent_name} onChange={set('parent_name')} />
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={lc} htmlFor="pl-email">{isMinor ? 'Parent’s email' : 'Email'}</label>
                            <input id="pl-email" type="email" className={ic} autoComplete="email" inputMode="email" value={form.email} onChange={set('email')} />
                        </div>
                        <div>
                            <label className={lc} htmlFor="pl-phone">{isMinor ? 'Parent’s mobile' : 'Mobile'}</label>
                            <input id="pl-phone" type="tel" className={ic} autoComplete="tel" inputMode="tel" value={form.phone} onChange={set('phone')} />
                        </div>
                    </div>
                    {age === null && (
                        <p className="text-[13px] text-rr-dark/55 font-medium -mt-2">For players under 18 we ask for a parent or guardian’s details once you enter the date of birth.</p>
                    )}

                    <div>
                        <label className={lc} htmlFor="pl-medical">Injuries or medical conditions the coaches should know about {opt}</label>
                        <textarea id="pl-medical" rows={2} className={ic} value={form.medical} onChange={set('medical')} placeholder="e.g. asthma (brings a puffer), recovering from a side strain" />
                    </div>

                    <div>
                        <label className={lc} htmlFor="pl-notes">Anything else? {opt}</label>
                        <textarea id="pl-notes" rows={2} className={ic} value={form.notes} onChange={set('notes')} placeholder="What they are working on, or a teammate they would like to play with." />
                    </div>

                    <Tick checked={form.available} onChange={tick('available')}>
                        They can play at any afternoon start time on {MATCH.date}, from 1pm.
                        <span className="block text-rr-dark/60 font-medium mt-1">
                            We set the start time when we pick the sides, so we need to know any afternoon start works.
                        </span>
                    </Tick>

                    <Tick checked={form.squad_interest} onChange={tick('squad_interest')}>
                        Tell me when Performance Squad trials are announced. <span className="text-rr-dark/50 font-medium">(Optional)</span>
                        <span className="block text-rr-dark/60 font-medium mt-1">
                            Dates are not set yet. Nothing to pay.
                        </span>
                    </Tick>

                    <p className="text-[11px] font-black text-rr-pink uppercase tracking-[0.25em] pt-4">Agreements &amp; consent</p>
                    <Tick checked={form.accept_terms} onChange={tick('accept_terms')}>
                        I have read and agree to the{' '}
                        <a href="/terms-conditions" target="_blank" rel="noreferrer" className={link}>Terms &amp; Conditions</a> and{' '}
                        <a href="/privacy-policy" target="_blank" rel="noreferrer" className={link}>Privacy Policy</a>, and the
                        details above are correct.
                    </Tick>
                    <Tick checked={form.accept_player_code} onChange={tick('accept_player_code')}>
                        The player agrees to the{' '}
                        <a href="/assets/RRA_Player_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={link}>Player Code of Conduct</a>.
                    </Tick>
                    {isMinor && (
                        <Tick checked={form.accept_parent_code} onChange={tick('accept_parent_code')}>
                            I am the player’s parent or guardian. I agree to the{' '}
                            <a href="/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf" target="_blank" rel="noreferrer" className={link}>Parent/Guardian Code of Conduct</a>{' '}
                            and give permission for the player to take part.
                        </Tick>
                    )}
                    <Tick checked={form.accept_social_media} onChange={tick('accept_social_media')}>
                        <strong>This is a filmed event.</strong> I agree to the player being filmed and photographed,
                        knowing footage may be shared online and the Academy can’t control where it ends up.
                    </Tick>

                    {error && (
                        <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                    )}

                    <button type="submit" disabled={submitting}
                        className="w-full sm:w-auto bg-rr-pink hover:bg-rr-light-pink disabled:opacity-60 text-white font-bold uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300">
                        {submitting ? 'Sending…' : 'Nominate this player'}
                    </button>
                    <p className="text-[13px] text-rr-dark/55 font-medium">Nothing is charged when you nominate.</p>
                </form>
            </div>
        </section>
    );
};

export default PLForm;

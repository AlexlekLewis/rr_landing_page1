import React from 'react';
import { AU_STATES } from '../../lib/homeAddress';

// "Home Address": the required street / suburb / state / postcode block on every
// program sign-up (src/lib/homeAddress.js). Controlled:
//   <HomeAddressFields value={address} onChange={setAddress} errors={errors} />
// value = { home_street, home_suburb, home_state, home_postcode } (EMPTY_ADDRESS to start)
// errors = the form's errors object; keys match (addressErrors() fills them).
// theme="dark" for forms on a dark background.

const HomeAddressFields = ({ value, onChange, errors = {}, theme = 'light', note }) => {
    const dark = theme === 'dark';
    const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
    const label = `block text-xs font-bold uppercase tracking-widest mb-2 ${dark ? 'text-white/70' : 'text-rr-charcoal'}`;
    const input = (k) => `w-full rounded-xl px-4 py-3 text-base outline-none transition-colors ${dark
        ? `bg-white/5 text-white placeholder-white/30 border ${errors[k] ? 'border-red-400' : 'border-white/15 focus:border-rr-pink'}`
        : `bg-white text-rr-dark placeholder-slate-400 border ${errors[k] ? 'border-red-400' : 'border-slate-200 focus:border-rr-pink'}`}`;
    const err = (k) => errors[k] && <p className="text-red-500 text-xs font-medium mt-1">{errors[k]}</p>;

    return (
        <div className={`mb-8 pt-6 border-t ${dark ? 'border-white/10' : 'border-slate-100'}`} data-home-address>
            <h3 className={`text-base font-black ${dark ? 'text-white' : 'text-rr-dark'} uppercase tracking-widest mb-2`}>Home Address</h3>
            <p className={`text-sm mb-5 ${dark ? 'text-white/60' : 'text-slate-500'}`}>
                {note || 'Where we can post or drop off anything for the player, such as kit.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="sm:col-span-6" id="address-home_street">
                    <label className={label} htmlFor="home_street">Street address *</label>
                    <input id="home_street" name="home_street" autoComplete="address-line1" value={value.home_street} onChange={set('home_street')} className={input('home_street')} placeholder="e.g. 12 Smith Street" />
                    {err('home_street')}
                </div>
                <div className="sm:col-span-3" id="address-home_suburb">
                    <label className={label} htmlFor="home_suburb">Suburb *</label>
                    <input id="home_suburb" name="home_suburb" autoComplete="address-level2" value={value.home_suburb} onChange={set('home_suburb')} className={input('home_suburb')} placeholder="e.g. Mickleham" />
                    {err('home_suburb')}
                </div>
                <div className="sm:col-span-1" id="address-home_state">
                    <label className={label} htmlFor="home_state">State *</label>
                    <select id="home_state" name="home_state" autoComplete="address-level1" value={value.home_state} onChange={set('home_state')} className={input('home_state')}>
                        {AU_STATES.map((s) => <option key={s} value={s} className="text-rr-dark">{s}</option>)}
                    </select>
                    {err('home_state')}
                </div>
                <div className="sm:col-span-2" id="address-home_postcode">
                    <label className={label} htmlFor="home_postcode">Postcode *</label>
                    <input id="home_postcode" name="home_postcode" autoComplete="postal-code" inputMode="numeric" maxLength={4} value={value.home_postcode} onChange={set('home_postcode')} className={input('home_postcode')} placeholder="3064" />
                    {err('home_postcode')}
                </div>
            </div>
        </div>
    );
};

export default HomeAddressFields;

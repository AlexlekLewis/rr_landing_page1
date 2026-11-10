import React from 'react';
import { PLAYER_CODE_URL, PARENT_CODE_URL } from '../../lib/governance';

// "Agreements & Consent": the four required governance boxes for every paid program
// sign-up (src/lib/governance.js). Same look and wording as the Holiday Programs and
// Junior Royals Term 2 forms. Controlled:
//   <GovernanceConsents value={consents} onChange={setConsents} errors={errors} />
// value = { accept_terms, accept_player_code, accept_parent_code, accept_social_media }
// errors = the form's errors object; keys match (consentErrors() fills them).
// theme="dark" for forms on a dark background. adult: player is 18+ (no Parent/Guardian Code box).

const ComplianceCheckbox = ({ checked, onChange, error, dark, children }) => (
    <div className="mb-4">
        <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div
                aria-hidden="true"
                className={`mt-0.5 w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${checked ? 'bg-rr-pink border-rr-pink' : `${dark ? 'border-white/40 bg-transparent' : 'border-slate-300 bg-white'} group-hover:border-rr-pink`}`}
            >
                {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className={`${dark ? 'text-white/80' : 'text-rr-charcoal'} text-sm font-medium leading-relaxed`}>{children}</span>
        </label>
        {error && <p className="text-red-500 text-xs font-medium mt-1 ml-8">{error}</p>}
    </div>
);

const GovernanceConsents = ({ value, onChange, errors = {}, theme = 'light', adult = false }) => {
    const dark = theme === 'dark';
    const link = dark ? 'text-rr-light-pink underline hover:text-white' : 'text-rr-pink hover:underline';
    const box = (key, children) => (
        <div id={`consent-${key}`}>
            <ComplianceCheckbox checked={!!value[key]} onChange={(v) => onChange({ ...value, [key]: v })} error={errors[key]} dark={dark}>
                {children}
            </ComplianceCheckbox>
        </div>
    );
    return (
        <div className={`mb-8 pt-6 border-t ${dark ? 'border-white/10' : 'border-slate-100'}`} data-governance>
            <h3 className={`text-base font-black ${dark ? 'text-white' : 'text-rr-dark'} uppercase tracking-widest mb-6`}>Agreements &amp; Consent</h3>
            {box('accept_terms', <>I have read and agree to the <a href="/terms-conditions" target="_blank" rel="noreferrer" className={link}>Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank" rel="noreferrer" className={link}>Privacy Policy</a>. I confirm all information provided is accurate.</>)}
            {box('accept_player_code', <>I have read, understood, and agree to the <a href={PLAYER_CODE_URL} target="_blank" rel="noreferrer" className={link}>Player Code of Conduct</a>.</>)}
            {!adult && box('accept_parent_code', <>I have read, understood, and agree to the <a href={PARENT_CODE_URL} target="_blank" rel="noreferrer" className={link}>Parent/Guardian Code of Conduct</a>.</>)}
            {box('accept_social_media', <>I am happy for photos and videos from the program featuring the player to be used on Rajasthan Royals Academy Melbourne&apos;s social media and marketing channels.</>)}
        </div>
    );
};

export default GovernanceConsents;

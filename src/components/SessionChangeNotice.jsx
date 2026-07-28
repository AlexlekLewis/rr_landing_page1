import React from 'react';

/**
 * One-line session-change disclaimer shown at every booking point (Junior Royals + Elite
 * Royals). Deliberately short — the substance (why we may move a player, and that we
 * consult the family first) lives in clause 11 of the Terms & Conditions, which the
 * booking consent checkbox binds the family to.
 *
 * tone="light" for the white Junior Royals form, tone="dark" for the Elite/Power Game UI.
 */
const SessionChangeNotice = ({ tone = 'light', className = '' }) => {
    const dark = tone === 'dark';
    const body = dark ? 'text-white/40 text-[11px] leading-relaxed' : 'text-rr-charcoal/70 text-xs leading-relaxed';

    return (
        <p className={`${body} ${className}`}>
            Session times are subject to change in line with our{' '}
            <a href="/terms-conditions" target="_blank" rel="noreferrer" className="text-rr-pink hover:underline">
                Terms &amp; Conditions
            </a>.
        </p>
    );
};

export default SessionChangeNotice;

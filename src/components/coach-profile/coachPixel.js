// Meta Pixel events for the coach pages, in one place (rr-page-generator
// meta-pixel.md). Every call is guarded, so a missing or switched-off Pixel
// never breaks the page (PR #158 relies on exactly this: where the Pixel is off,
// `fbq` doesn't exist and these do nothing).
//
// If a site-wide helper lands (PRs #122 and #150 each propose src/lib/metaPixel.js),
// point these two functions at it.
//
// PRIVACY: the coach's name and the centre only. Never a player's or parent's
// name, age, email, phone or note.
//
// What the coach page fires: ViewContent on load, Lead when an "Ask us" enquiry is sent.
//
// /book, /booking and the request-received / confirmed states belong to Codex's
// booking build. As read on 9 Nov 2026 that branch switches the Pixel OFF on those
// paths (index.html guard). Alex's rule (9 Nov) is the opposite: the Pixel fires on
// every success page. Required change for Codex: Coach Pages Addendum §7 and §11.
const fbq = (...args) => {
    try {
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') window.fbq(...args);
    } catch { /* never block the page */ }
};

export const trackCoachPageView = (profile) =>
    fbq('track', 'ViewContent', { content_name: profile.name, content_category: 'coach-page' });

export const trackCoachEnquiry = (profile, centre) =>
    fbq('track', 'Lead', { content_name: `Private coaching enquiry: ${profile.name}`, content_category: centre || 'private-coaching' });

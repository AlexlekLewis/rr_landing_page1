// The coach pages stay hidden until the private-coaching booking system is live
// (Alex, 3 Nov 2026). Turn them on with VITE_COACH_PAGES=on, set at the same
// time as VITE_PRIVATE_BOOKING_URL. Until then /coaches/<slug> redirects to /coaches.
export const coachPagesEnabled = env => env?.VITE_COACH_PAGES === 'on';
// The Node SEO build reads only this same explicit public switch; no dotenv is loaded.
const environment = import.meta.env ?? { VITE_COACH_PAGES: globalThis.process?.env?.VITE_COACH_PAGES };
export const COACH_PAGES_ENABLED = coachPagesEnabled(environment);

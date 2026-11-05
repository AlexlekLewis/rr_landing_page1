// The coach pages stay hidden until the private-coaching booking system is live
// (Alex, 3 Nov 2026). Turn them on with VITE_COACH_PAGES=on, set at the same
// time as VITE_PRIVATE_BOOKING_URL. Until then /coaches/<slug> redirects to /coaches.
export const COACH_PAGES_ENABLED = import.meta.env.VITE_COACH_PAGES === 'on';

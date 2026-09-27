// ============================================================
// /api/india-tour-intake — RETIRED. Rejects every request with 410 Gone.
//
// This used to take the open India Tour 2026 intake form (no login) and write
// players' passport, visa, medical and parent-ID details into
// india_tour_2026_travellers with the service-role key. Alex ordered that form
// off on 7 Aug 2026; tour paperwork now happens behind the Player Portal login.
// The page itself (/india-tour-intake.html) is 410 via api/gone.js.
//
// Deliberately holds no database client and reads no keys: nothing sent here
// is stored, whatever the method or body.
// ============================================================

export default function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    return res.status(410).json({
        error: 'gone',
        message:
            'The India Tour intake form has closed. Tour forms are now completed in the Player Portal. ' +
            'Questions: info@rramelbourne.com',
    });
}

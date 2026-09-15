// POST /api/performance-squad-lookup  { email, mobile }
// A family that confirmed in Step 1 earlier (or on another device) and comes
// back to check out. Returns their latest unpaid confirmation so the kit +
// checkout step can carry on under that registration. Email AND mobile must
// both match the row — a guess at an email alone reveals nothing.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const digits = (v) => String(v || '').replace(/\D/g, '');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const mobile = digits(req.body?.mobile);
        if (!email || mobile.length < 8) return res.status(400).json({ error: 'Enter the email and mobile you used in Step 1' });

        const { data, error } = await supabase
            .from('performance_squads_registrations')
            .select('id, first_name, last_name, parent_name, email, phone, centre_slug, paid_at, created_at')
            .eq('source', 'performance-squads-welcome')
            .ilike('email', email)
            .order('created_at', { ascending: false })
            .limit(10);
        if (error) throw error;

        const match = (data || []).find((r) => digits(r.phone) === mobile || digits(r.phone).endsWith(mobile.slice(-8)));
        if (!match) return res.status(404).json({ error: 'We could not find a confirmation with that email and mobile. Please complete Step 1.' });
        if (match.paid_at) return res.status(409).json({ error: 'This confirmation has already been paid for. Email us if you need to order more kit.' });

        return res.status(200).json({
            registration_id: match.id,
            first_name: match.first_name,
            last_name: match.last_name,
            parent_name: match.parent_name || '',
            email: match.email,
            mobile: match.phone,
            region: match.centre_slug,
        });
    } catch (e) {
        console.error('performance-squad-lookup error:', e);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
}

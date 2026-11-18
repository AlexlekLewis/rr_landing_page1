// ============================================================
// Royals Private Coaching — the "you've been booked" message to a coach
// (Andy, 18 Nov 2026). Pure functions, no network: the email, the text message and
// the one-tap contact links. Used by api/notify-private-coaching-bookings.js and
// tested in api/_tests/privateCoachingAlert.test.js.
// ============================================================

export const CENTRE_NAMES = {
    'cranbourne-north': 'Elite Cricket Centre, Cranbourne North',
    mickleham: 'Mickleham Indoor Sports Centre',
    ravenhall: 'M9 Sports Centre, Ravenhall',
};

const FOCUS = {
    batting: 'Batting', pace: 'Pace bowling', spin: 'Spin bowling', wicketkeeping: 'Wicketkeeping',
    'all-round': 'All-round', 'not-sure': 'Not sure yet',
};

const LEVEL = {
    starting: 'Just starting out', 'junior-club': 'Junior club cricket', rep: 'Representative or pathway squads',
    'senior-club': 'Senior club cricket', premier: 'Premier Cricket',
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (n) => (n == null ? null : `$${Number(n) % 1 ? Number(n).toFixed(2) : Number(n)}`);
const firstName = (n) => String(n || '').trim().split(' ')[0];

// Australian mobile → international digits for wa.me / Twilio: "0412 345 678" → "61412345678".
export const auMobileDigits = (phone) => {
    const d = String(phone || '').replace(/\D/g, '');
    if (!d) return null;
    if (d.startsWith('61')) return d;
    if (d.startsWith('0')) return `61${d.slice(1)}`;
    if (d.length === 9 && d.startsWith('4')) return `61${d}`;
    return d;
};

const nightTime = (s) => {
    const dt = new Date(`${s.date}T12:00:00`);
    const day = dt.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
    const [h, m] = String(s.start).split(':').map(Number);
    return `${day} ${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}${h >= 12 ? 'pm' : 'am'}`;
};

// One booking row (+ the coach row, if any) → everything the alert needs.
export const buildAlert = (r, coach, partner = null) => {
    const player = `${r.player_first_name} ${r.player_last_name}`.trim();
    const contactName = r.parent_name || player;
    const centre = CENTRE_NAMES[r.centre] || r.centre;
    const fmt = r.format === '1-2' ? `1-to-2 with ${r.other_players || 'a training partner'}` : '1-to-1';
    const pkg = r.package_sessions
        ? `${r.package_sessions} session${r.package_sessions > 1 ? 's' : ''}${r.price_per_session != null ? ` × ${money(r.price_per_session)} = ${money(r.package_total)} incl. GST` : ''}`
        : null;
    const times = Array.isArray(r.selected_slots) && r.selected_slots.length ? r.selected_slots.map(nightTime).join(', ') : null;
    const paid = r.payment_status === 'paid' ? `Paid in full${r.amount_paid_cents ? ` (${money(r.amount_paid_cents / 100)} incl. GST)` : ''}` : 'Not paid';
    const wa = auMobileDigits(r.phone);
    const firstNamePlayer = r.player_first_name;
    const hello = coach?.name ? `Hi ${firstName(coach.name)},` : 'Hi team,';
    const lead = coach
        ? `${contactName} has booked and paid for private coaching with you. Please contact them within 24 hours to confirm the times, then confirm the lane with the centre.`
        : r.coach_slug
            ? `A family has booked ${r.coach_slug} for private coaching, but there are no contact details on file for that coach in private_coaching_coaches. Please pass this on.`
            : 'A family has asked us to match them with a coach. Please choose a coach and contact the family.';

    const links = {
        call: `tel:${String(r.phone || '').replace(/[^\d+]/g, '')}`,
        sms: `sms:${String(r.phone || '').replace(/[^\d+]/g, '')}`,
        whatsapp: wa ? `https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${firstName(contactName)}, it's ${coach?.name || 'the Royals Academy'} from Rajasthan Royals Academy Melbourne about ${firstNamePlayer}'s private coaching.`)}` : null,
        email: `mailto:${r.email}?subject=${encodeURIComponent(`Royals Private Coaching: ${firstNamePlayer}`)}`,
    };

    const rows = [
        ['Player', `${player}${r.player_age ? ` (${r.player_age})` : ''}`],
        ['Wants to work on', FOCUS[r.focus] || r.focus],
        ['Level / club', [LEVEL[r.playing_level] || r.playing_level, r.club].filter(Boolean).join(' · ')],
        ['Centre', centre],
        ['Format', fmt],
        ['Package', pkg],
        ['Times chosen', times],
        ['Other times that suit', r.availability],
        ['Notes for the coach', r.notes],
        ['Training shirt', r.shirt_size ? `Ordering size ${r.shirt_size}` : 'Has one'],
        ['Payment', paid],
        ['Training partner form', partner ? (partner.done ? 'Completed' : `NOT completed yet. The partner must complete it before the first session: ${partner.link}`) : null],
        ['Contact', contactName],
        ['Mobile', r.phone],
        ['Email', r.email],
    ].filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '');

    const subject = coach
        ? `New private coaching booking: ${player}, ${r.centre === 'cranbourne-north' ? 'Cranbourne North' : centre.split(',').pop().trim().replace('Mickleham Indoor Sports Centre', 'Mickleham')}. Please contact the family`
        : r.coach_slug
            ? `Private coaching booking for ${r.coach_slug}: no coach contact on file`
            : `Private coaching: match ${player} with a coach`;

    const btn = (href, label, bg) => (href ? `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 18px;border-radius:999px;background:${bg};color:#fff;font-weight:700;font-size:14px;text-decoration:none">${label}</a>` : '');
    const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px;color:#111">
<p style="margin:0 0 4px;font-size:12px;color:#E11F8F;font-weight:700;text-transform:uppercase;letter-spacing:.1em">Royals Private Coaching: new booking</p>
<p style="margin:0 0 6px;font-size:16px">${esc(hello)}</p>
<p style="margin:0 0 16px;font-size:15px;line-height:1.5">${esc(lead)}</p>
<div style="margin:0 0 16px">${btn(links.call, `Call ${esc(firstName(contactName))}`, '#111921')}${btn(links.sms, 'Text', '#1226AA')}${btn(links.whatsapp, 'WhatsApp', '#1A9E52')}${btn(links.email, 'Email', '#E11F8F')}</div>
<table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;font-size:14px">${esc(v)}</td></tr>`).join('')}</table>
<p style="margin:16px 0 0;font-size:12px;color:#666">Every session is subject to lane availability at the centre and confirmation. Sent automatically by rramelbourne.com.</p></div>`;

    const sms = `Royals Private Coaching: ${contactName} booked you for ${player}${r.player_age ? ` (${r.player_age})` : ''}, ${fmt}${r.package_sessions ? `, ${r.package_sessions} session${r.package_sessions > 1 ? 's' : ''}` : ''} at ${CENTRE_NAMES[r.centre]?.split(',').pop().trim() || r.centre}. Please contact them: ${r.phone}. Full details in your email.`;

    return { subject, html, sms, links };
};

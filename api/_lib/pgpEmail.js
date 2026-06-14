// ============================================================
// Power Game — paid-confirmation email (Resend).
// Sent ONCE, server-side, right after a paid power_game_applications row is
// created (api/power-game-webhook, with api/power-game-verify-session as backstop).
// Mirrors api/_lib/orderEmail.js: same env + graceful skip when unconfigured.
//   RESEND_API_KEY, RESEND_FROM_EMAIL (optional), RESEND_BCC (optional)
// ============================================================

const FROM_DEFAULT = 'Royals Melbourne Academy <onboarding@resend.dev>';

const fmtAUD = (cents) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format((cents || 0) / 100);

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function sendPgpConfirmation({
  to, playerName, centreName, sessionDay, sessionTime, ageGroup, amountCents, ref,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn('RESEND_API_KEY not set — skipping PGP confirmation email'); return { skipped: true }; }
  if (!to) { console.warn('PGP confirmation: no recipient email'); return { skipped: true }; }

  const from = process.env.RESEND_FROM_EMAIL || FROM_DEFAULT;
  const bcc = process.env.RESEND_BCC || undefined;
  const first = (playerName || '').trim().split(/\s+/)[0] || 'there';

  const rows = [
    ['Player', playerName],
    ['Program', 'The Power Game — Power Pre-Season (Phase 1)'],
    centreName && ['Centre', centreName],
    (sessionDay || sessionTime) && ['Session', [sessionDay, sessionTime].filter(Boolean).join(' · ')],
    ageGroup && ['Squad', ageGroup],
    amountCents != null && ['Paid', fmtAUD(amountCents)],
    ref && ['Reference', ref],
  ].filter(Boolean);

  const rowsHtml = rows.map(([k, v]) =>
    `<tr><td style="padding:7px 0;border-bottom:1px solid #eee;color:#777;font-size:13px">${esc(k)}</td>` +
    `<td style="padding:7px 0;border-bottom:1px solid #eee;color:#0a0a14;font-size:14px;font-weight:600;text-align:right">${esc(v)}</td></tr>`,
  ).join('');

  const html = `
  <div style="background:#0e0f12;padding:32px 0;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
      <div style="height:5px;background:linear-gradient(90deg,#E11F8F,#1226AA)"></div>
      <div style="padding:32px">
        <p style="margin:0 0 4px;color:#E11F8F;font-weight:800;letter-spacing:.18em;font-size:11px;text-transform:uppercase">Payment confirmed</p>
        <h1 style="margin:0 0 12px;color:#0a0a14;font-size:26px;font-weight:800">You're in, ${esc(first)}!</h1>
        <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.55">
          Your spot in <strong>The Power Game</strong> Power Pre-Season is locked in and paid. Welcome to the Rajasthan Royals Academy — we can't wait to see you train.
        </p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 22px">${rowsHtml}</table>
        <p style="margin:0 0 6px;color:#0a0a14;font-size:14px;font-weight:700">What happens next</p>
        <p style="margin:0 0 18px;color:#555;font-size:14px;line-height:1.55">
          We'll confirm your squad, training day and times shortly. Turn up to your first session at your chosen centre — bring your kit and you're set.
        </p>
        <p style="margin:0;color:#888;font-size:13px;line-height:1.55">
          Questions about your booking? Just reply to this email or contact
          <a href="mailto:info@rramelbourne.com" style="color:#1226AA">info@rramelbourne.com</a>.
        </p>
      </div>
    </div>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      ...(bcc ? { bcc } : {}),
      reply_to: 'info@rramelbourne.com',
      subject: `You're in, ${first} — The Power Game Program`,
      html,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Resend API ${res.status}: ${t}`);
  }
  return res.json().catch(() => ({ ok: true }));
}

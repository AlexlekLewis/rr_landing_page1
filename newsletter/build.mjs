// The Royals Report: builds one issue of the Academy Director's fortnightly newsletter.
//
//   node newsletter/build.mjs newsletter/issues/001-2026-12-01.json
//
// Writes three files to newsletter/out/:
//   <name>.html          the email to send: absolute image URLs, UTM-tagged links,
//                        the email service's unsubscribe tag. Paste/upload this to the ESP.
//   <name>.txt           plain-text part (sent alongside the HTML; helps inbox placement).
//   <name>.preview.html  the proof: same email with every image embedded, so it renders
//                        anywhere (approval page, Drive, a browser) before it is deployed.
//
// Email-client rules followed here (don't "modernise" them away):
//   tables for layout, inline styles, 600px max, width attributes on every <img>,
//   bulletproof buttons (padded <td>, not images), real text not text-in-images,
//   web-safe font stack after Montserrat, dark-mode colours set explicitly,
//   no JavaScript, no forms, no background images that carry meaning, total < 102 KB
//   so Gmail never clips the footer (where the unsubscribe link lives).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { basename, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://rramelbourne.com';
// Resend Broadcasts replaces this tag with the recipient's one-click unsubscribe link.
const UNSUBSCRIBE = '{{{RESEND_UNSUBSCRIBE_URL}}}';
// Spam Act 2003 / CAN-SPAM: a real way to identify and contact the sender. Andy to confirm.
const POSTAL = process.env.NEWSLETTER_POSTAL || 'Rajasthan Royals Academy Melbourne · [POSTAL ADDRESS, ABN — Andy to confirm]';

const C = {
  pink: '#E50695', pinkDark: '#950460', blue: '#1226AA', navy: '#021D45', dark: '#111921',
  page: '#F6F6F9', card: '#FFFFFF', ink: '#1B1B27', muted: '#5C5C6E', line: '#E3E3EC', soft: '#FDEBF5',
};
const FONT = "Montserrat,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function build(issue, { preview = false } = {}) {
  const link = (href, slot) => {
    const url = new URL(href, SITE);
    if (url.hostname.endsWith('rramelbourne.com')) {
      url.searchParams.set('utm_source', 'newsletter');
      url.searchParams.set('utm_medium', 'email');
      url.searchParams.set('utm_campaign', issue.campaign);
      if (slot) url.searchParams.set('utm_content', slot);
    }
    return esc(url.toString());
  };
  const img = (src) => {
    if (!preview) return esc(new URL(src, SITE).toString());
    const file = join(ROOT, 'public', src);
    if (!existsSync(file)) return esc(new URL(src, SITE).toString());
    const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }[extname(file).toLowerCase()];
    return `data:${mime};base64,${readFileSync(file).toString('base64')}`;
  };

  const button = (cta, slot, { bg = C.pink, full = false } = {}) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0"${full ? ' width="100%"' : ''}><tr>
<td align="center" bgcolor="${bg}" style="border-radius:6px;mso-padding-alt:14px 24px;">
<a href="${link(cta.href, slot)}" style="display:inline-block;padding:14px 24px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:6px;">${esc(cta.label)}&nbsp;&rarr;</a>
</td></tr></table>`;
  const textLink = (cta, slot) => `<a href="${link(cta.href, slot)}" style="font-family:${FONT};font-size:15px;font-weight:700;color:${C.pink};text-decoration:none;">${esc(cta.label)}&nbsp;&rarr;</a>`;
  const kicker = (t, color = C.pink) => `<p class="kick" style="margin:0 0 6px;font-family:${FONT};font-size:12px;line-height:16px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${color};">${esc(t)}</p>`;
  const h2 = (t) => `<h2 class="t-ink" style="margin:0 0 10px;font-family:${FONT};font-size:24px;line-height:30px;font-weight:800;color:${C.ink};">${esc(t)}</h2>`;
  const p = (t, extra = '') => `<p class="t-body" style="margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:25px;color:${C.ink};${extra}">${esc(t)}</p>`;
  const section = (inner, { bg = C.card, pad = '32px 32px', cls = 'card' } = {}) =>
    `<tr><td class="${cls} px" bgcolor="${bg}" style="background:${bg};padding:${pad};">${inner}</td></tr>`;
  const spacer = (h = 12) => `<tr><td class="bg-page" style="height:${h}px;line-height:${h}px;font-size:0;background:${C.page};">&nbsp;</td></tr>`;

  const i = issue;
  const preheaderPad = '&zwnj;&nbsp;'.repeat(90);

  const masthead = `
<tr><td bgcolor="${C.blue}" style="background:${C.blue};background-image:linear-gradient(115deg,${C.pink} 0%,#7E1291 55%,${C.blue} 100%);padding:28px 32px 26px;" class="px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="64" valign="middle" style="width:64px;"><img src="${img('/assets/Logo_White_Transparent.png')}" width="64" height="64" alt="Rajasthan Royals Academy Melbourne" style="display:block;width:64px;height:64px;border:0;"></td>
    <td valign="middle" style="padding-left:16px;">
      <p style="margin:0;font-family:${FONT};font-size:12px;line-height:16px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FFD3EC;">From the Academy Director</p>
      <h1 style="margin:2px 0 0;font-family:${FONT};font-size:30px;line-height:34px;font-weight:900;color:#FFFFFF;">The Royals Report</h1>
      <p style="margin:4px 0 0;font-family:${FONT};font-size:13px;line-height:18px;color:#E7E9FF;">Issue ${i.issue} · ${esc(i.monthLabel)}</p>
    </td>
  </tr></table>
</td></tr>`;

  const letter = section(`
${p(i.greeting, 'font-weight:700;')}
${i.intro.map((t) => p(t)).join('')}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;"><tr>
  <td width="56" valign="middle"><img src="${img(i.signoff.photo)}" width="56" height="56" alt="${esc(i.signoff.name)}" style="display:block;width:56px;height:56px;border-radius:28px;border:2px solid ${C.pink};"></td>
  <td valign="middle" style="padding-left:14px;">
    <p class="t-ink" style="margin:0;font-family:${FONT};font-size:16px;line-height:20px;font-weight:800;color:${C.ink};">${esc(i.signoff.name)}</p>
    <p class="t-muted" style="margin:2px 0 0;font-family:${FONT};font-size:14px;line-height:18px;color:${C.muted};">${esc(i.signoff.role)}, Rajasthan Royals Academy Melbourne</p>
  </td>
</tr></table>`);

  const f = i.feature;
  const feature = `
<tr><td class="card" bgcolor="${C.card}" style="background:${C.card};padding:0;">
  <a href="${link(f.cta.href, f.slot)}"><img src="${img(f.image)}" width="600" alt="${esc(f.alt)}" class="fluid" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a>
</td></tr>
${section(`${kicker(f.kicker)}${h2(f.title)}${p(f.body)}${button(f.cta, f.slot)}`, { pad: '24px 32px 32px' })}`;

  const card = (c) => `
<a href="${link(c.cta.href, c.slot)}"><img src="${img(c.image)}" width="260" alt="${esc(c.alt)}" class="fluid" style="display:block;width:100%;max-width:260px;height:auto;border:0;border-radius:6px;"></a>
<h3 class="t-ink" style="margin:14px 0 6px;font-family:${FONT};font-size:18px;line-height:23px;font-weight:800;color:${C.ink};">${esc(c.title)}</h3>
<p class="t-body" style="margin:0 0 10px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};">${esc(c.body)}</p>
${textLink(c.cta, c.slot)}`;
  const pl = i.players;
  const players = section(`${kicker(pl.kicker)}${h2(pl.title)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;"><tr>
  <td class="col" width="260" valign="top" style="width:260px;padding-right:12px;">${card(pl.cards[0])}</td>
  <td class="col col-2" width="260" valign="top" style="width:260px;padding-left:12px;">${card(pl.cards[1])}</td>
</tr></table>`);

  const pr = i.programs;
  const programs = section(`${kicker(pr.kicker)}${h2(pr.title)}
${pr.items.map((it, n) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:${n ? 12 : 6}px;"><tr>
<td class="prog" style="border:1px solid ${C.line};border-left:4px solid ${n % 2 ? C.blue : C.pink};border-radius:6px;padding:18px 20px;">
  <p class="t-muted" style="margin:0 0 4px;font-family:${FONT};font-size:12px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${esc(it.tag)}</p>
  <h3 class="t-ink" style="margin:0 0 6px;font-family:${FONT};font-size:19px;line-height:24px;font-weight:800;color:${C.ink};">${esc(it.title)}</h3>
  <p class="t-body" style="margin:0 0 12px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};">${esc(it.body)}</p>
  ${button(it.cta, it.slot, { bg: n % 2 ? C.blue : C.pink })}
</td></tr></table>`).join('')}`);

  const s = i.story;
  const story = `
<tr><td bgcolor="${C.navy}" style="background:${C.navy};padding:0;">
  <a href="${link(s.cta.href, s.slot)}"><img src="${img(s.image)}" width="600" alt="${esc(s.alt)}" class="fluid" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a>
</td></tr>
<tr><td class="px" bgcolor="${C.navy}" style="background:${C.navy};padding:24px 32px 32px;">
  ${kicker(s.kicker, '#FF8FD0')}
  <h2 style="margin:0 0 10px;font-family:${FONT};font-size:24px;line-height:30px;font-weight:800;color:#FFFFFF;">${esc(s.title)}</h2>
  <p style="margin:0 0 18px;font-family:${FONT};font-size:16px;line-height:25px;color:#E7E9FF;">${esc(s.body)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:22px;"><tr>
  ${s.stats.map((st) => `<td class="stat" width="33%" valign="top" style="padding:0 6px 0 0;">
    <p style="margin:0;font-family:${FONT};font-size:34px;line-height:38px;font-weight:900;color:${C.pink};">${esc(st.n)}</p>
    <p style="margin:2px 0 0;font-family:${FONT};font-size:13px;line-height:17px;color:#C9CDF2;">${esc(st.l)}</p></td>`).join('')}
  </tr></table>
  ${button(s.cta, s.slot)}
</td></tr>`;

  const t = i.tip;
  const tip = section(`
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="tip" bgcolor="${C.soft}" style="background:${C.soft};border-radius:8px;padding:22px 24px;">
  ${kicker(t.kicker, C.pinkDark)}
  <h3 class="t-ink" style="margin:0 0 8px;font-family:${FONT};font-size:19px;line-height:24px;font-weight:800;color:${C.ink};">${esc(t.title)}</h3>
  <p class="t-body" style="margin:0;font-family:${FONT};font-size:15px;line-height:23px;color:${C.ink};">${esc(t.body)}</p>
</td></tr></table>`, { pad: '28px 32px' });

  const sh = i.shop;
  const shop = section(`${kicker(sh.kicker)}${h2(sh.title)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px;"><tr>
${sh.items.map((it) => `<td class="shopcol" width="33%" valign="top" align="center" style="padding:0 4px;">
  <a href="${link(sh.cta.href, sh.slot)}"><img src="${img(it.image)}" width="160" alt="${esc(it.name)}" class="fluid" style="display:block;width:100%;max-width:160px;height:auto;border:0;background:${C.page};border-radius:6px;"></a>
  <p class="t-ink" style="margin:10px 0 2px;font-family:${FONT};font-size:14px;line-height:18px;font-weight:700;color:${C.ink};">${esc(it.name)}</p>
  <p style="margin:0;font-family:${FONT};font-size:14px;line-height:18px;font-weight:800;color:${C.pink};">${esc(it.price)}</p>
  ${it.note ? `<p class="t-muted" style="margin:2px 0 0;font-family:${FONT};font-size:12px;line-height:16px;color:${C.muted};">${esc(it.note)}</p>` : ''}
</td>`).join('')}
</tr></table>
${button(sh.cta, sh.slot, { bg: C.blue })}`);

  const contact = section(`
<h3 class="t-ink" style="margin:0 0 8px;font-family:${FONT};font-size:19px;line-height:24px;font-weight:800;color:${C.ink};">Questions? Just reply.</h3>
<p class="t-body" style="margin:0;font-family:${FONT};font-size:15px;line-height:23px;color:${C.ink};">Replies come straight to me. You can also text us on <a href="sms:0421261825" style="color:${C.pink};font-weight:700;text-decoration:none;">0421&nbsp;261&nbsp;825</a> or email <a href="mailto:info@rramelbourne.com" style="color:${C.pink};font-weight:700;text-decoration:none;">info@rramelbourne.com</a>.</p>`, { pad: '28px 32px' });

  const footer = `
<tr><td class="px" bgcolor="${C.dark}" style="background:${C.dark};padding:28px 32px 32px;" align="center">
  <p style="margin:0 0 14px;font-family:${FONT};font-size:13px;line-height:18px;">
    <a href="${link('/', 'footer-site')}" style="color:#FFFFFF;font-weight:700;text-decoration:none;">rramelbourne.com</a>
    &nbsp;·&nbsp;<a href="https://www.instagram.com/rramelbourne" style="color:#FFFFFF;font-weight:700;text-decoration:none;">Instagram</a>
    &nbsp;·&nbsp;<a href="https://www.facebook.com/share/1HsxoaRXWP/" style="color:#FFFFFF;font-weight:700;text-decoration:none;">Facebook</a>
    &nbsp;·&nbsp;<a href="${link('/news', 'footer-news')}" style="color:#FFFFFF;font-weight:700;text-decoration:none;">News</a>
  </p>
  <p style="margin:0 0 10px;font-family:${FONT};font-size:12px;line-height:18px;color:#A9ADBD;">You’re receiving this because you registered for, enquired about or bought from a Rajasthan Royals Academy Melbourne program. We send it every second Tuesday.</p>
  <p style="margin:0 0 10px;font-family:${FONT};font-size:12px;line-height:18px;color:#A9ADBD;"><a href="${UNSUBSCRIBE}" style="color:#FFFFFF;text-decoration:underline;">Unsubscribe</a> &nbsp;·&nbsp; <a href="${link('/privacy-policy', 'footer-privacy')}" style="color:#FFFFFF;text-decoration:underline;">Privacy policy</a></p>
  <p style="margin:0;font-family:${FONT};font-size:12px;line-height:18px;color:#7F8496;">${esc(POSTAL)}</p>
</td></tr>`;

  const html = `<!doctype html>
<html lang="en-AU" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>The Royals Report · Issue ${i.issue}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap');
body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
img{-ms-interpolation-mode:bicubic}
a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
@media only screen and (max-width:620px){
  .wrap{width:100%!important}
  .px{padding-left:20px!important;padding-right:20px!important}
  .col{display:block!important;width:100%!important;padding:0!important}
  .col-2{padding-top:28px!important}
  .fluid{max-width:100%!important}
  .shopcol{padding:0 3px!important}
}
@media (prefers-color-scheme:dark){
  .bg-page,body,.outer{background:#0B0F16!important}
  .card{background:#161C27!important}
  .t-ink,.t-body{color:#F2F3F7!important}
  .t-muted{color:#B5B9C8!important}
  .prog{border-top-color:#2A3244!important;border-right-color:#2A3244!important;border-bottom-color:#2A3244!important}
  .tip{background:#2A1426!important}
}
[data-ogsc] .card{background:#161C27!important}
[data-ogsc] .t-ink,[data-ogsc] .t-body{color:#F2F3F7!important}
</style>
</head>
<body class="bg-page" style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.page};opacity:0;">${esc(i.preheader)}${preheaderPad}</div>
<table role="presentation" class="outer bg-page" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page};">
<tr><td align="center" style="padding:16px 8px 24px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
${masthead}
${letter}
${spacer()}
${feature}
${spacer()}
${players}
${spacer()}
${programs}
${spacer()}
${story}
${spacer()}
${tip}
${spacer()}
${shop}
${spacer()}
${contact}
${footer}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body>
</html>`;
  return html.replace(/\n\s*\n/g, '\n');
}

export function buildText(i) {
  const u = (href, slot) => `${new URL(href, SITE)}?utm_source=newsletter&utm_medium=email&utm_campaign=${i.campaign}&utm_content=${slot}`;
  const L = [];
  L.push(`THE ROYALS REPORT · Issue ${i.issue} · ${i.monthLabel}`, 'From the Academy Director', '', i.greeting, '', ...i.intro.flatMap((t) => [t, '']), `${i.signoff.name}, ${i.signoff.role}`, '');
  const f = i.feature; L.push('---', f.kicker.toUpperCase(), f.title, f.body, `${f.cta.label}: ${u(f.cta.href, f.slot)}`, '');
  L.push('---', i.players.kicker.toUpperCase(), ...i.players.cards.flatMap((c) => [c.title, c.body, `${c.cta.label}: ${u(c.cta.href, c.slot)}`, '']));
  L.push('---', i.programs.kicker.toUpperCase(), ...i.programs.items.flatMap((p) => [`${p.title} (${p.tag})`, p.body, `${p.cta.label}: ${u(p.cta.href, p.slot)}`, '']));
  const s = i.story; L.push('---', s.kicker.toUpperCase(), s.title, s.body, `${s.cta.label}: ${u(s.cta.href, s.slot)}`, '');
  L.push('---', i.tip.kicker.toUpperCase(), i.tip.title, i.tip.body, '');
  L.push('---', i.shop.kicker.toUpperCase(), ...i.shop.items.map((x) => `${x.name} ${x.price}${x.note ? ` (${x.note})` : ''}`), `${i.shop.cta.label}: ${u(i.shop.cta.href, i.shop.slot)}`, '');
  L.push('---', 'Questions? Just reply. Text us on 0421 261 825 or email info@rramelbourne.com.', '', 'Unsubscribe: ' + UNSUBSCRIBE, POSTAL);
  return L.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const file = process.argv[2];
  if (!file) { console.error('usage: node newsletter/build.mjs newsletter/issues/<issue>.json'); process.exit(1); }
  const issue = JSON.parse(readFileSync(file, 'utf8'));
  const name = basename(file, '.json');
  const out = join(ROOT, 'newsletter', 'out');
  mkdirSync(out, { recursive: true });
  const html = build(issue);
  writeFileSync(join(out, `${name}.html`), html);
  writeFileSync(join(out, `${name}.txt`), buildText(issue));
  writeFileSync(join(out, `${name}.preview.html`), build(issue, { preview: true }));
  const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`${name}.html ${kb} KB${kb > 100 ? '  ⚠ over Gmail’s 102 KB clip limit' : ''}`);
  if (issue.tip?.needsApproval) console.log('note: tip copy flagged for Andy’s approval');
}

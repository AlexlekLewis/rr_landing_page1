// The Royals Report: sync the audience and schedule an approved issue on Resend Broadcasts.
//
//   node newsletter/send.mjs sync                      # audience Supabase → Resend, unsubscribes/bounces Resend → Supabase
//   node newsletter/send.mjs schedule <issue.json> [--wave=1|2] [--go]
//
// Dry run unless --go is passed. Needs:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   read newsletter_audience, write newsletter_suppressions
//   RESEND_API_KEY                            (Resend → API keys; "Full access" for broadcasts)
//   RESEND_AUDIENCE_ID_WAVE1 / _WAVE2         two Resend audiences: active in the last 6 months / older
//
// Rules this script enforces (see newsletter/README.md):
//   - never schedules an issue whose newsletter_issues.status is not 'approved'
//   - always pulls unsubscribes, bounces and complaints back into newsletter_suppressions BEFORE pushing contacts
//   - From is Andy, Reply-To is Andy, so replies reach a person
//   - addresses never leave Supabase/Resend: nothing is printed except counts
import { readFileSync } from 'node:fs';
import { build, buildText, POSTAL } from './build.mjs';

const FROM = process.env.NEWSLETTER_FROM || 'Andy Crook | Royals Academy <andy.crook@rramelbourne.com>';
const REPLY_TO = process.env.NEWSLETTER_REPLY_TO || 'andy.crook@rramelbourne.com';
const GO = process.argv.includes('--go');
const env = (k) => { const v = process.env[k]; if (!v) throw new Error(`missing ${k}`); return v; };

const sb = async (path, init = {}) => {
  const res = await fetch(`${env('SUPABASE_URL')}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal', ...init.headers },
  });
  if (!res.ok) throw new Error(`supabase ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 || res.status === 201 ? null : res.json();
};
const rs = async (path, init = {}) => {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.resend.com/${path}`, { ...init, headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json', ...init.headers } });
    if (res.status === 429 && attempt < 5) { await new Promise((r) => setTimeout(r, 1200 * (attempt + 1))); continue; }
    if (!res.ok) throw new Error(`resend ${path}: ${res.status} ${await res.text()}`);
    return res.json();
  }
};
const pause = () => new Promise((r) => setTimeout(r, 550)); // Resend default limit: 2 requests/second

async function sync() {
  const audiences = { 1: env('RESEND_AUDIENCE_ID_WAVE1'), 2: env('RESEND_AUDIENCE_ID_WAVE2') };
  // 1. Pull back everyone Resend has marked unsubscribed (bounces/complaints also unsubscribe the contact).
  const suppressed = [];
  const known = new Map();
  for (const id of Object.values(audiences)) {
    const { data = [] } = await rs(`audiences/${id}/contacts`);
    for (const c of data) {
      known.set(c.email.toLowerCase(), { id: c.id, audience: id });
      if (c.unsubscribed) suppressed.push({ email: c.email.toLowerCase(), reason: 'unsubscribed', source: 'resend' });
    }
  }
  if (suppressed.length && GO) await sb('newsletter_suppressions?on_conflict=email', { method: 'POST', body: JSON.stringify(suppressed), headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' } });
  // 2. Push the current audience, split into waves by recency.
  const cutoff = Date.now() - 183 * 864e5;
  const people = await sb('newsletter_recipients?select=email,last_seen');
  let added = 0;
  for (const p of people) {
    if (known.has(p.email)) continue;
    const wave = p.last_seen && Date.parse(p.last_seen) > cutoff ? 1 : 2;
    if (GO) { await rs(`audiences/${audiences[wave]}/contacts`, { method: 'POST', body: JSON.stringify({ email: p.email, unsubscribed: false }) }); await pause(); }
    added++;
  }
  console.log(`${GO ? '' : '[dry run] '}audience ${people.length}; new contacts pushed ${added}; unsubscribes pulled back ${suppressed.length}`);
}

async function schedule(file) {
  const issue = JSON.parse(readFileSync(file, 'utf8'));
  if (POSTAL.includes('[')) throw new Error('footer postal address/ABN is still a placeholder: set NEWSLETTER_POSTAL (Spam Act sender identification)');
  if (issue.tip?.needsApproval) throw new Error('tip copy is still flagged needsApproval');
  const wave = Number((process.argv.find((a) => a.startsWith('--wave=')) || '--wave=1').split('=')[1]);
  const [row] = await sb(`newsletter_issues?issue_no=eq.${issue.issue}&select=*`);
  if (!row) throw new Error(`issue ${issue.issue} is not in newsletter_issues`);
  if (row.status !== 'approved' && row.status !== 'scheduled') throw new Error(`issue ${issue.issue} is '${row.status}', not approved. Andy must approve the proof first.`);
  // Wave 2 (older contacts) goes 24 h after wave 1, so a problem shows on the engaged half first.
  const sendAt = new Date(Date.parse(row.send_at) + (wave === 2 ? 864e5 : 0));
  const subject = row.subject || issue.subjects[0];
  const body = { audience_id: env(`RESEND_AUDIENCE_ID_WAVE${wave}`), from: FROM, reply_to: REPLY_TO, subject, html: build(issue), text: buildText(issue), name: `Royals Report #${issue.issue} wave ${wave}` };
  if (!GO) { console.log(`[dry run] would schedule '${subject}' to wave ${wave} at ${sendAt.toISOString()}`); return; }
  const created = await rs('broadcasts', { method: 'POST', body: JSON.stringify(body) });
  await rs(`broadcasts/${created.id}/send`, { method: 'POST', body: JSON.stringify({ scheduled_at: sendAt.toISOString() }) });
  await sb(`newsletter_issues?issue_no=eq.${issue.issue}`, { method: 'PATCH', body: JSON.stringify({ status: 'scheduled', esp_broadcast_id: [row.esp_broadcast_id, created.id].filter(Boolean).join(','), updated_at: new Date().toISOString() }) });
  console.log(`scheduled broadcast ${created.id} for ${sendAt.toISOString()}`);
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'sync') await sync();
else if (cmd === 'schedule' && arg) await schedule(arg);
else { console.error('usage: node newsletter/send.mjs sync | schedule <issue.json> [--wave=1|2] [--go]'); process.exit(1); }

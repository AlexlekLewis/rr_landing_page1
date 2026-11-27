// The Royals Report cover: renders the magazine-cover image for an issue ("direction C",
// chosen by Andy 27 Nov 2026) from the issue's `cover` block.
//
//   node newsletter/cover.mjs newsletter/issues/002-2026-12-15.json
//   → newsletter/out/002-2026-12-15.cover.jpg  (1200 × 1560, JPEG, aim < 250 KB)
//
// The cover is ONE image because email clients (Outlook above all) can't reliably lay text over
// a photo. Everything on it is repeated as live text straight underneath ("In this issue"), so
// the email still reads when images are off. Rules: a real Academy photo only (no AI-made
// players), Montserrat 900, RR Pink for the highlights, cover lines are facts from the issue.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function coverHtml(issue) {
  const c = issue.cover;
  const file = join(ROOT, 'public', c.photo);
  const mime = extname(file).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
  const photo = `data:${mime};base64,${readFileSync(file).toString('base64')}`;
  const [t1, t2] = c.masthead || ['Royals', 'Report'];
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;width:600px;height:780px;font-family:Montserrat,Arial,sans-serif;color:#fff;background:#021d45}
.c{position:relative;width:600px;height:780px;overflow:hidden}
.ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(c.position || '50% 50%')};filter:saturate(.85) contrast(1.05)}
.sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,29,69,.88) 0%,rgba(2,29,69,.12) 32%,rgba(2,29,69,.18) 52%,rgba(17,25,33,.96) 100%)}
.top{position:absolute;left:0;right:0;top:0;padding:26px 28px 0}
.row{display:flex;justify-content:space-between;font-size:11px;font-weight:800;letter-spacing:.2em}
.row b{color:#ff8fd0;font-weight:800}
h1{margin:6px 0 0;font-size:84px;line-height:.9;font-weight:900;letter-spacing:-.045em;text-transform:uppercase}
h1 span{color:#e50695}
.bot{position:absolute;left:0;right:0;bottom:0;padding:0 28px 30px}
.k{margin:0;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#ff8fd0}
.t{margin:4px 0 0;font-size:36px;line-height:38px;font-weight:900;max-width:470px}
.lines{display:grid;grid-template-columns:repeat(${(c.lines || []).length || 3},1fr);gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.35)}
.lines p{margin:0;font-size:15px;line-height:19px;font-weight:900}.lines em{font-style:normal;color:#e50695;display:block}
</style></head><body><div class="c">
<img class="ph" src="${photo}" alt="">
<div class="sh"></div>
<div class="top"><div class="row"><span>RAJASTHAN ROYALS ACADEMY MELBOURNE</span><b>NO. ${String(issue.issue).padStart(2, '0')} · ${esc(issue.monthShort || issue.monthLabel).toUpperCase()}</b></div>
<h1>${esc(t1)}<br><span>${esc(t2)}</span></h1></div>
<div class="bot"><p class="k">${esc(c.kicker || 'COVER STORY')}</p><p class="t">${esc(c.title)}</p>
<div class="lines">${(c.lines || []).map((l) => `<p><em>${esc(l.hi)}</em>${esc(l.text)}</p>`).join('')}</div></div>
</div></body></html>`;
}

export async function renderCover(issue, outFile) {
  const require = createRequire(import.meta.url);
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 600, height: 780 }, deviceScaleFactor: 2 });
    await page.setContent(coverHtml(issue), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const shot = await page.screenshot({ type: 'jpeg', quality: 78, clip: { x: 0, y: 0, width: 600, height: 780 } });
    writeFileSync(outFile, shot);
    return shot.length;
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const file = process.argv[2];
  if (!file) { console.error('usage: node newsletter/cover.mjs newsletter/issues/<issue>.json'); process.exit(1); }
  const issue = JSON.parse(readFileSync(file, 'utf8'));
  if (!issue.cover) { console.error('this issue has no cover block'); process.exit(1); }
  const out = join(ROOT, 'newsletter', 'out');
  mkdirSync(out, { recursive: true });
  const target = join(out, `${basename(file, '.json')}.cover.jpg`);
  const bytes = await renderCover(issue, target);
  console.log(`${basename(target)} ${(bytes / 1024).toFixed(0)} KB${bytes > 250 * 1024 ? '  ⚠ over 250 KB: pick a simpler photo or lower quality' : ''}`);
}

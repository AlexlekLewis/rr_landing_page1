#!/usr/bin/env node
// Build the developer hand-off PDF.
//
//   node build_pdf.mjs --brief brief.json --shots <capture out dir> --images <images out dir> --out handoff.pdf
//
// brief.json is written for each change (schema in SKILL.md). Screenshots come from
// capture.mjs (shots.json), images from images.mjs (images.json). Sections shown
// before/after side by side; new sections and removed sections are labelled.
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => {
    if (v.startsWith('--')) a.push([v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return a;
}, []));
for (const k of ['brief', 'shots', 'images', 'out']) if (typeof args[k] !== 'string') { console.error(`--${k} is required`); process.exit(1); }
const brief = JSON.parse(fs.readFileSync(args.brief, 'utf8'));
const shotsDir = path.resolve(args.shots);
const shots = JSON.parse(fs.readFileSync(path.join(shotsDir, 'shots.json'), 'utf8'));
const imgDir = path.resolve(args.images);
const imgs = JSON.parse(fs.readFileSync(path.join(imgDir, 'images.json'), 'utf8'));
const work = path.join(path.dirname(path.resolve(args.out)), '.handoff-pdf');
fs.mkdirSync(work, { recursive: true });

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// **bold** and `code` in brief text, nothing else.
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
const fileUrl = (p) => `file://${p}`;
const shot = (version, viewport, section) => shots.shots.find((s) => s.version === version && s.viewport === viewport && s.section === section);
const human = (id) => (brief.sections || []).find((s) => s.id === id)?.label || id.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const kb = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

// Every picture goes into the PDF as a small JPEG, so the file stays easy to email.
let shrinkN = 0;
const shrink = (src, maxW, quality = 70) => {
    shrinkN += 1;
    const dest = path.join(work, `img-${shrinkN}.jpg`);
    execSync(`python3 -c "
from PIL import Image
im=Image.open('${src}').convert('RGB')
if im.width>${maxW}: im=im.resize((${maxW},round(im.height*${maxW}/im.width)),Image.LANCZOS)
im.save('${dest}',quality=${quality},optimize=True)"`);
    return dest;
};

// Long phone screenshot → slices that fit a landscape page, four to a row.
const slices = (file) => {
    if (!file) return [];
    const src = path.join(shotsDir, file);
    const stem = path.join(work, path.basename(file, '.jpg'));
    const n = execSync(`python3 -c "
from PIL import Image
im=Image.open('${src}').convert('RGB');im=im.resize((360,round(im.height*360/im.width)));w,h=im.size;H=int(w*2.05);n=0
for y in range(0,h,H):
  im.crop((0,y,w,min(h,y+H))).save('${stem}-%d.jpg'%n,quality=68,optimize=True);n+=1
print(n)"`).toString().trim();
    return Array.from({ length: +n }, (_, i) => `${stem}-${i}.jpg`);
};

// Section order: the "after" page's order, with removed sections (only in "before") at the end.
const order = (version) => shots.shots.filter((s) => s.version === version && s.viewport === 'desktop' && s.section !== 'full').map((s) => s.section);
const afterIds = order('after');
const beforeIds = shots.newPage ? [] : order('before');
const sectionIds = [...afterIds, ...beforeIds.filter((id) => !afterIds.includes(id))];
const sectionNote = (id) => (brief.sections || []).find((s) => s.id === id)?.note;

const sectionPages = sectionIds.map((id) => {
    const b = shot('before', 'desktop', id); const a = shot('after', 'desktop', id); const m = shot('after', 'mobile', id);
    const tag = shots.newPage ? 'New page' : !b ? 'New section' : !a ? 'Removed' : 'Changed';
    const pic = (s, w) => `<img src="${fileUrl(shrink(path.join(shotsDir, s.file), w))}">`;
    return `<section class="page wide">
      <div class="sec-head"><h2>${esc(human(id))}</h2><span class="tag tag-${tag.split(' ')[0].toLowerCase()}">${tag}</span></div>
      ${sectionNote(id) ? `<p class="note">${md(sectionNote(id))}</p>` : ''}
      <div class="ba ${a && m ? 'with-mobile' : ''}">
        ${shots.newPage ? '' : `<figure><figcaption>Before (live site)</figcaption>${b ? pic(b, 1100) : '<div class="empty">Not on the live page</div>'}</figure>`}
        <figure><figcaption>After (desktop)</figcaption>${a ? pic(a, 1100) : '<div class="empty">Removed from the page</div>'}</figure>
        ${a && m ? `<figure class="phone"><figcaption>After (phone)</figcaption>${pic(m, 390)}</figure>` : ''}
      </div>
    </section>`;
}).join('');

const phone = slices(shot('after', 'mobile', 'full')?.file);
const phonePages = [];
for (let i = 0; i < phone.length; i += 4) {
    phonePages.push(`<section class="page wide"><div class="sec-head"><h2>Whole page on a phone${phone.length > 4 ? ` (${i / 4 + 1} of ${Math.ceil(phone.length / 4)})` : ''}</h2><span class="tag tag-changed">After</span></div>
      <div class="strip">${phone.slice(i, i + 4).map((p) => `<img src="${fileUrl(p)}">`).join('')}</div></section>`);
}

// One row per picture: "name.webp" and its phone size "name-sm.webp" together.
const groups = [];
for (const im of imgs.images) {
    const key = im.repoPath.replace(/-sm(\.\w+)$/, '$1');
    let g = groups.find((x) => x.key === key);
    if (!g) groups.push(g = { key, files: [] });
    g.files.push(im);
}
const imageRows = groups.map((g) => {
    const main = g.files.find((f) => f.repoPath === g.key) || g.files[0];
    const used = [...new Set(g.files.flatMap((f) => f.usedIn))];
    return `<tr>
    <td class="thumb"><img src="${fileUrl(shrink(path.join(imgDir, 'drive', main.drivePath), 180, 65))}"></td>
    <td><span class="tag tag-${main.status === 'new' ? 'new' : 'changed'}">${main.status}</span>
      ${g.files.map((f) => `<br><code>${esc(f.repoPath)}</code> <span class="small">${f.width ? `${f.width}×${f.height}px, ` : ''}${kb(f.bytes)}</span>`).join('')}
      ${brief.imageNotes?.[main.repoPath] ? `<div class="small">${md(brief.imageNotes[main.repoPath])}</div>` : ''}</td>
    <td class="small">${used.length ? used.slice(0, 3).map((u) => `<code>${esc(u)}</code>`).join('<br>') + (used.length > 3 ? `<br>+${used.length - 3} more` : '') : '—'}</td>
  </tr>`;
}).join('');

const drive = brief.driveFolder || {};
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 14mm 12mm 16mm; }
  :root { --pink:#E11F8F; --blue:#1226AA; --navy:#001D48; --dark:#111921; --char:#323E48; --line:#E2E8F0; }
  * { box-sizing: border-box; }
  body { font-family: Montserrat, Arial, sans-serif; color: var(--dark); font-size: 10pt; line-height: 1.45; margin: 0; }
  @page wide { size: A4 landscape; margin: 12mm 12mm 14mm; }
  .page { page-break-after: always; }
  .page.wide { page: wide; }
  .page:last-child { page-break-after: auto; }
  h1 { font-size: 30pt; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; line-height: 1.05; margin: 0 0 6mm; }
  h2 { font-size: 15pt; font-weight: 900; text-transform: uppercase; margin: 0; }
  h3 { font-size: 11pt; font-weight: 900; text-transform: uppercase; margin: 6mm 0 2mm; color: var(--navy); }
  code { font-family: Menlo, Consolas, monospace; font-size: 8pt; background: #F1F5F9; padding: 0 3px; border-radius: 3px; word-break: break-all; }
  .small { font-size: 8pt; color: var(--char); }
  .eyebrow { color: var(--pink); font-weight: 700; letter-spacing: 3px; text-transform: uppercase; font-size: 8pt; margin-bottom: 4mm; }
  .cover { height: 262mm; display: flex; flex-direction: column; }
  .band { height: 8mm; background: linear-gradient(90deg, var(--navy), var(--blue) 40%, var(--pink)); border-radius: 3px; margin-bottom: 14mm; }
  .meta { display: grid; grid-template-columns: 38mm 1fr; gap: 2mm 6mm; margin: 6mm 0; }
  .meta div:nth-child(odd) { color: var(--char); font-weight: 700; text-transform: uppercase; font-size: 8pt; padding-top: 1px; }
  .lead { font-size: 12pt; font-weight: 500; max-width: 165mm; }
  .status { margin-top: auto; border: 2px solid var(--pink); border-radius: 4mm; padding: 5mm 6mm; }
  .status b { color: var(--pink); }
  table { width: 100%; border-collapse: collapse; margin-top: 3mm; }
  th { text-align: left; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 1px; color: var(--char); border-bottom: 2px solid var(--dark); padding: 2mm; }
  td { border-bottom: 1px solid var(--line); padding: 2mm; vertical-align: top; }
  tr { page-break-inside: avoid; }
  td.thumb img { width: 22mm; height: 28mm; object-fit: cover; border-radius: 2mm; display: block; }
  ol.steps { padding-left: 6mm; } ol.steps li { margin-bottom: 2.5mm; }
  .sec-head { display: flex; align-items: center; gap: 4mm; border-bottom: 2px solid var(--dark); padding-bottom: 2mm; margin-bottom: 3mm; }
  .tag { font-size: 7pt; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 1mm 2.5mm; border-radius: 10mm; color: #fff; background: var(--char); white-space: nowrap; }
  .tag-new { background: var(--pink); } .tag-changed { background: var(--blue); } .tag-removed { background: #94A3B8; }
  .note { margin: 0 0 3mm; color: var(--char); }
  .ba { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; align-items: start; }
  .ba.with-mobile { grid-template-columns: 1fr 1fr 0.42fr; }
  figure { margin: 0; } figcaption { font-size: 7pt; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: var(--char); margin-bottom: 1.5mm; }
  figure img { width: 100%; max-height: 138mm; object-fit: contain; object-position: top; border: 1px solid var(--line); border-radius: 2mm; display: block; }
  .empty { border: 2px dashed var(--line); border-radius: 2mm; padding: 10mm 4mm; text-align: center; color: #94A3B8; font-weight: 700; font-size: 8pt; }
  .strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5mm; align-items: start; } .strip img { width: 100%; border: 1px solid var(--line); border-radius: 2mm; }
  ul.checks, ul.open { padding-left: 5mm; } ul.checks li, ul.open li { margin-bottom: 2mm; }
  ul.open { list-style: none; padding-left: 0; } ul.open li::before { content: "☐  "; color: var(--pink); font-weight: 900; }
</style></head><body>

<section class="page cover">
  <div class="band"></div>
  <div class="eyebrow">Rajasthan Royals Academy Melbourne · Website hand-off</div>
  <h1>${esc(brief.title)}</h1>
  <p class="lead">${md(brief.summary)}</p>
  <div class="meta">
    <div>Page</div><div><code>rramelbourne.com${esc(brief.route)}</code></div>
    <div>Prepared</div><div>${esc(brief.date)}${brief.preparedBy ? ` by ${esc(brief.preparedBy)}` : ''}</div>
    <div>For</div><div>${esc(brief.preparedFor || 'The development team')}</div>
    <div>Code</div><div><code>${esc(brief.repo)}</code>, branch <code>${esc(brief.branch || shots.branch)}</code>, commit <code>${esc(shots.commit)}</code></div>
    ${brief.pr ? `<div>Pull request</div><div>#${esc(brief.pr.number)}: ${esc(brief.pr.url)}</div>` : ''}
    <div>Files</div><div>Google Drive: <b>${esc(drive.path || drive.name || 'not set')}</b>${drive.url ? `<br><span class="small">${esc(drive.url)}</span>` : ''}</div>
  </div>
  <div class="status">${brief.live ? '<b>Live.</b> These changes are on the live site.' : '<b>Not live yet.</b> Nothing changes on rramelbourne.com until the pull request is merged and deployed. Don\'t point posters, QR codes or emails at the new page before then.'}</div>
</section>

<section class="page">
  <div class="sec-head"><h2>What to do</h2></div>
  <ol class="steps">${(brief.steps || []).map((s) => `<li>${md(s)}</li>`).join('')}</ol>
  <h3>Where the files are</h3>
  <p>All images are in the Google Drive folder <b>${esc(drive.path || drive.name || '')}</b>${drive.url ? ` (${esc(drive.url)})` : ''}.
  <b>01 Images (web-ready)</b> mirrors the repository: each file goes at the same path in the code (for example <code>public/assets/…</code>).
  ${imgs.originals.length ? '<b>02 Images (originals)</b> holds the photos as supplied, full size.' : ''}
  This PDF and the screenshots are in the same folder.</p>
  <h3>What changed</h3>
  <table><tr><th style="width:20%">Area</th><th style="width:35%">Before</th><th>Now</th></tr>
    ${(brief.changes || []).map((c) => `<tr><td><b>${md(c.area)}</b></td><td>${md(c.before)}</td><td>${md(c.now)}</td></tr>`).join('')}
  </table>
</section>

${imgs.images.length ? `<section class="page">
  <div class="sec-head"><h2>Images</h2><span class="tag tag-new">${groups.length} images, ${imgs.images.length} files</span></div>
  <p class="note">Each file is in the Drive folder under <b>01 Images (web-ready)</b>, at the same path it takes in the repository (e.g. <code>01 Images (web-ready)/public/assets/…</code>). Put it at that path in the code. "Used in" is where the code refers to it.</p>
  <table><tr><th></th><th>File in the code (and in the Drive folder)</th><th>Used in</th></tr>${imageRows}</table>
</section>` : ''}

${sectionPages}
${phonePages.join('')}

<section class="page">
  <div class="sec-head"><h2>Checks and open items</h2></div>
  ${(brief.checks || []).length ? `<h3>Checks already run</h3><ul class="checks">${brief.checks.map((c) => `<li>${md(c)}</li>`).join('')}</ul>` : ''}
  ${(brief.openItems || []).length ? `<h3>Still to do</h3><ul class="open">${brief.openItems.map((o) => `<li>${md(o.item)}${o.owner ? ` <span class="small">(${esc(o.owner)})</span>` : ''}</li>`).join('')}</ul>` : ''}
</section>
</body></html>`;

const htmlPath = path.join(work, 'handoff.html');
fs.writeFileSync(htmlPath, html);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(fileUrl(htmlPath), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => page.goto(fileUrl(htmlPath)));
await page.pdf({
    path: path.resolve(args.out), printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: `<div style="font-family:Arial;font-size:7pt;color:#64748B;width:100%;padding:0 12mm;display:flex;justify-content:space-between"><span>${esc(brief.title)} · ${esc(brief.date)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
});
await browser.close();
console.log(`PDF: ${path.resolve(args.out)} (${kb(fs.statSync(path.resolve(args.out)).size)})`);

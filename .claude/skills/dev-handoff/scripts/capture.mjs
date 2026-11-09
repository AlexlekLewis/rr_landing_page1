#!/usr/bin/env node
// Before/after screenshots of one page for a developer hand-off.
//
//   node capture.mjs --route /junior-royals --out <dir> [--base origin/main] [--sections hero,benefits]
//
// AFTER  = this checkout (the branch with the changes), served by `vite` on :5181.
// BEFORE = a temporary git worktree of --base (default origin/main), served on :5182.
//          If the route doesn't exist there (a new page), "before" is skipped.
// For each version and viewport (desktop 1440, mobile 390) it saves a full-page
// shot and one shot per section, as JPEG, plus shots.json describing them.
// Sections = --sections ids if given, else every direct child of <main> that has an id.
import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => {
    if (v.startsWith('--')) a.push([v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return a;
}, []));
const route = args.route;
if (!route) { console.error('--route is required, e.g. --route /junior-royals'); process.exit(1); }
const out = path.resolve(args.out || 'handoff-shots');
const base = args.base || 'origin/main';
const repo = execSync('git rev-parse --show-toplevel').toString().trim();
const wanted = typeof args.sections === 'string' ? args.sections.split(',').map((s) => s.trim()) : null;
const VIEWPORTS = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
];
fs.mkdirSync(out, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const startVite = async (cwd, port) => {
    const p = spawn('npx', ['vite', '--port', String(port), '--strictPort'], { cwd, stdio: 'ignore', detached: true });
    for (let i = 0; i < 60; i += 1) {
        try { const r = await fetch(`http://localhost:${port}/`); if (r.ok) return p; } catch { /* not up yet */ }
        await sleep(500);
    }
    throw new Error(`vite did not start on :${port} in ${cwd}`);
};
const stop = (p) => { try { process.kill(-p.pid); } catch { /* already gone */ } };

// Scroll the whole page so scroll-triggered animations (framer-motion whileInView) run.
const settle = async (page) => {
    await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
        window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
};
const isNotFound = (page) => page.evaluate(() => /page not found|404/i.test(document.querySelector('h1')?.textContent || ''));

const shoot = async (browser, url, version) => {
    const shots = [];
    for (const vp of VIEWPORTS) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
        await page.waitForTimeout(1500);
        if (await isNotFound(page)) { await page.close(); return null; }
        await settle(page);
        const full = `${version}-${vp.name}-full.jpg`;
        await page.screenshot({ path: path.join(out, full), fullPage: true, type: 'jpeg', quality: 70 });
        shots.push({ version, viewport: vp.name, section: 'full', file: full });
        // Section shots without floating buttons or the fixed nav over them.
        await page.addStyleTag({ content: '.fixed, [style*="position: fixed"] { visibility: hidden !important; }' });
        const ids = await page.evaluate((w) => (w || [...document.querySelectorAll('main > [id], main > section[id]')].map((e) => e.id)), wanted);
        for (const id of ids) {
            const el = await page.$(`[id="${id}"]`);
            if (!el) continue;
            const box = await el.boundingBox();
            if (!box || box.height < 20) continue;
            const file = `${version}-${vp.name}-${id}.jpg`;
            await el.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 70 });
            shots.push({ version, viewport: vp.name, section: id, file });
        }
        await page.close();
    }
    return shots;
};

let after; let before; let tmp;
const browser = await chromium.launch();
try {
    after = await startVite(repo, 5181);
    const result = { route, base, branch: execSync('git branch --show-current').toString().trim(), commit: execSync('git rev-parse --short HEAD').toString().trim(), shots: [] };
    result.shots.push(...(await shoot(browser, `http://localhost:5181${route}`, 'after')) || []);
    if (!result.shots.length) throw new Error(`${route} renders "not found" on this branch`);

    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'handoff-base-'));
    execSync(`git worktree add --detach "${tmp}" ${base}`, { stdio: 'ignore' });
    fs.symlinkSync(path.join(repo, 'node_modules'), path.join(tmp, 'node_modules'));
    before = await startVite(tmp, 5182);
    const b = await shoot(browser, `http://localhost:5182${route}`, 'before');
    result.newPage = !b;
    if (b) result.shots.push(...b);

    fs.writeFileSync(path.join(out, 'shots.json'), JSON.stringify(result, null, 2));
    console.log(`${result.shots.length} screenshots in ${out}${result.newPage ? ' (new page: no "before")' : ''}`);
} finally {
    await browser.close();
    if (after) stop(after);
    if (before) stop(before);
    if (tmp) { try { execSync(`git worktree remove --force "${tmp}"`, { stdio: 'ignore' }); } catch { /* leave it */ } }
}

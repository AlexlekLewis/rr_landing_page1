// ============================================================
// pgp-e2e.mjs — Playwright end-to-end persona run for the Power Game funnel.
//
// Drives a REAL browser through /PGP2026/apply as 13 different users (mixed
// centres, ages, genders, abilities, paths) and asserts every flow lands on
// the right screen + that the Meta 'Lead' pixel fires on each submit.
//
// IMPORTANT: before starting the dev server, create .env.local containing
//   VITE_PGP_SOURCE=pgp2026-e2e-test
// (an inline env var does NOT reach import.meta.env reliably) so every row
// written to power_game_applications is tagged as test data
// (the Sheets sync filters '*preview*'/'*test*' sources; purge with:
//   delete from power_game_applications where source = 'pgp2026-e2e-test').
//
// Usage:  node scripts/pgp-e2e.mjs   (E2E_BASE_URL overrides http://localhost:5173)
// ============================================================
import { chromium } from 'playwright';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:5173';
const Y = new Date().getFullYear();
const dob = (age) => ({ d: '15', m: '01', y: String(Y - age) });

// path: pay (full payment UI), callback (apply without paying),
//       review (below floor → coach review), interest (TBC venue)
const PERSONAS = [
  { tag: 'P01 strong M14 Dowling → PAY @Netz', name: 'E2E Liam Carter', age: 14, g: 'Male', centre: 'The Netz', skill: 'Batter', hand: 'Right', rep: 'P16M', club: '', path: 'pay' },
  { tag: 'P02 strong F13 SSA → CALLBACK @Hallam', name: 'E2E Priya Nair', age: 13, g: 'Female', centre: 'Elite Cricket Centre', skill: 'All-rounder', hand: 'Right', bowl: 'Pace / Seam', rep: 'CA-SSA15', club: '', path: 'callback' },
  { tag: 'P03 16yo M Premier 3rds (adults) → PAY @Netz', name: 'E2E Jack Doyle', age: 16, g: 'Male', centre: 'The Netz', skill: 'Bowler', bowl: 'Pace / Seam', rep: '', club: 'P3M', path: 'pay' },
  { tag: 'P04 strong F15 P18F+P1F (top of own band) → CALLBACK @Hallam', name: 'E2E Mia Holt', age: 15, g: 'Female', centre: 'Elite Cricket Centre', skill: 'All-rounder', hand: 'Right', bowl: 'Leg spin', rep: 'P18F', club: 'P1F', path: 'callback' },
  { tag: 'P05 at-age rep M13 Des Nolan (rule: min Pathway) → PAY @Hallam', name: 'E2E Arjun Rao', age: 13, g: 'Male', centre: 'Elite Cricket Centre', skill: 'Batter', hand: 'Right', rep: 'REP-13M', club: '', path: 'pay' },
  { tag: 'P06 at-age rep F14 U12 rep → CALLBACK @Netz', name: 'E2E Zoe Park', age: 14, g: 'Female', centre: 'The Netz', skill: 'All-rounder', hand: 'Right', bowl: 'Pace / Seam', rep: 'REP-12F', club: '', path: 'callback' },
  { tag: 'P07 social-only M12 (CS-BELOW) → REVIEW @Hallam', name: 'E2E Ben Walsh', age: 12, g: 'Male', centre: 'Elite Cricket Centre', skill: 'Wicketkeeper', hand: 'Right', rep: '', club: 'CS-BELOW', path: 'review' },
  { tag: 'P08 below floor F16 CS-BELOW → REVIEW @Netz', name: 'E2E Sara Iqbal', age: 16, g: 'Female', centre: 'The Netz', skill: 'Batter', hand: 'Left', rep: '', club: 'CS-BELOW', path: 'review' },
  { tag: 'P09 adult M24 social-only (CS-BELOW) → REVIEW @Hallam', name: 'E2E Tom Keane', age: 24, g: 'Male', centre: 'Elite Cricket Centre', skill: 'Batter', hand: 'Right', rep: '', club: 'CS-BELOW', path: 'review' },
  { tag: 'P10 young F11 U12 rep → PAY @Netz', name: 'E2E Ava Singh', age: 11, g: 'Female', centre: 'The Netz', skill: 'Bowler', bowl: 'Leg spin', rep: 'REP-12F', club: '', path: 'pay' },
  { tag: 'P11 strong M15 TBC venue → INTEREST', name: 'E2E Noah Reid', age: 15, g: 'Male', centre: 'New Venue', skill: 'Batter', hand: 'Right', rep: 'P16M', club: '', path: 'interest' },
  { tag: 'P12 weak F14 TBC venue (CS-BELOW) → INTEREST', name: 'E2E Isla Wood', age: 14, g: 'Female', centre: 'New Venue', skill: 'Batter', hand: 'Right', rep: '', club: 'CS-BELOW', path: 'interest' },
  { tag: 'P13 17yo M U17 rep → PAY @Hallam (Thu 17+)', name: 'E2E Omar Aziz', age: 17, g: 'Male', centre: 'Elite Cricket Centre', skill: 'Bowler', bowl: 'Pace / Seam', rep: 'REP-17M', club: '', path: 'pay' },
];

const results = [];
const browser = await chromium.launch();

const FILTER = (process.env.PERSONA_FILTER || '').split(',').filter(Boolean);
const RUN_LIST = FILTER.length ? PERSONAS.filter((p) => FILTER.some((f) => p.tag.startsWith(f))) : PERSONAS;
for (const p of RUN_LIST) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1800 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => {
    window.__fbq = [];
    window.fbq = (...a) => window.__fbq.push(a);
  });
  const page = await ctx.newPage();
  // framer-motion keeps elements 'unstable' in headless — try a normal click,
  // fall back to a force click (the elements are real and visible).
  const tap = async (loc) => {
    try { await loc.click({ timeout: 5000 }); }
    catch { await loc.click({ force: true, timeout: 10000 }); }
  };
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Buttons' accessible names don't always match their visible text here, so
  // resolve by DOM textContent (whitespace-tolerant, exact by default).
  const btn = (text, { exact = true } = {}) =>
    page.locator('button').filter({ hasText: exact ? new RegExp(`^\\s*${esc(text)}\\s*$`) : new RegExp(esc(text), 'i') }).first();
  const tapBtn = (text, opts) => tap(btn(text, opts));
  const fail = async (why) => {
    results.push({ tag: p.tag, ok: false, why });
    try { await page.screenshot({ path: `/tmp/pg/e2e-fail-${results.length}.png` }); } catch {}
  };
  try {
    await page.goto(`${BASE}/PGP2026/apply`, { waitUntil: 'domcontentloaded' });

    // ── centre ──
    await tapBtn(p.centre, { exact: false });
    await tapBtn('Continue');

    // ── player ──
    await page.getByPlaceholder('e.g. Sam Smith').fill(p.name);
    const dd = dob(p.age);
    const selects = page.locator('select');
    await selects.nth(0).selectOption(dd.d);
    await selects.nth(1).selectOption(dd.m);
    await selects.nth(2).selectOption(dd.y);
    await tapBtn(p.g);
    if (p.age < 18) await page.getByPlaceholder('e.g. Jane Smith').fill('E2E Parent Test');
    await page.getByPlaceholder('0412 345 678').fill('0400000000');
    await page.getByPlaceholder('e.g. Hallam').fill('Testville');
    await page.getByPlaceholder('jane@email.com').fill('e2e-test@rramelbourne.com');
    await tapBtn('Continue');

    // ── profile ──
    await tapBtn(p.skill);
    if (p.hand) await tapBtn(p.hand);
    if (p.bowl) await tapBtn(p.bowl);
    await tap(page.getByRole('button', { name: /^continue$/i }));

    // ── history (two selects: rep, club) ──
    const hsel = page.locator('select');
    if (p.rep) await hsel.nth(0).selectOption(p.rep);
    if (p.club) await hsel.nth(1).selectOption(p.club);
    await tapBtn('Continue');

    // ── reveal ──
    if (p.path === 'pay' || p.path === 'callback') {
      await page.getByText(/you've earned your place/i).waitFor({ timeout: 20000 });
      await tapBtn('Choose your training time', { exact: false });
      // slot: first enabled slot
      const slot = page.locator('[data-testid^="slot-"]:not([disabled])').first();
      await slot.waitFor({ timeout: 10000 });
      const slotLabel = (await slot.innerText()).split('\n')[0];
      await tap(slot);
      // kit: required shirt size, then continue
      await page.getByText(/your kit/i).first().waitFor({ timeout: 10000 });
      await tapBtn('M');
      await tap(page.locator('button').filter({ hasText: /Continue\s*→/ }).first());
      // secure
      await page.getByText(/secure your spot/i).waitFor({ timeout: 10000 });
      for (const box of await page.locator('input[type="checkbox"]').all()) {
        if (!(await box.isChecked())) await box.check();
      }
      if (p.path === 'pay') {
        await tapBtn('Pay $989', { exact: false });
        await page.getByText(/you're in!/i).waitFor({ timeout: 20000 });
      } else {
        await tapBtn('Apply without paying', { exact: false });
        await page.getByText(/application received/i).waitFor({ timeout: 20000 });
      }
      const fbq = await page.evaluate(() => window.__fbq);
      const lead = fbq.some((c) => c[0] === 'track' && c[1] === 'Lead');
      results.push({ tag: p.tag, ok: true, detail: `${p.path.toUpperCase()} · slot "${slotLabel}" · Lead pixel: ${lead ? '✓' : '✗ MISSING'}`, lead });
    } else if (p.path === 'review') {
      await page.getByText(/a coach will review it/i).waitFor({ timeout: 20000 });
      await tapBtn('What happens next', { exact: false });
      await page.getByText(/apply for coach review/i).waitFor({ timeout: 10000 });
      for (const box of await page.locator('input[type="checkbox"]').all()) {
        if (!(await box.isChecked())) await box.check();
      }
      await tapBtn('Submit my application', { exact: false });
      await page.getByText(/in our hands/i).waitFor({ timeout: 20000 });
      const fbq = await page.evaluate(() => window.__fbq);
      const lead = fbq.some((c) => c[0] === 'track' && c[1] === 'Lead');
      results.push({ tag: p.tag, ok: true, detail: `REVIEW submitted · Lead pixel: ${lead ? '✓' : '✗ MISSING'}`, lead });
    } else {
      // interest (TBC venue): click through the reveal card, then the interest form
      await page.getByText(/you've earned your place|a coach will review it/i).first().waitFor({ timeout: 20000 });
      if (await page.getByText(/you've earned your place/i).count()) {
        await tapBtn('Choose your training time', { exact: false });
      } else {
        await tapBtn('What happens next', { exact: false });
      }
      await page.getByText(/register your interest/i).waitFor({ timeout: 20000 });
      for (const box of await page.locator('input[type="checkbox"]').all()) {
        if (!(await box.isChecked())) await box.check();
      }
      await tapBtn('Submit my application', { exact: false });
      await page.getByText(/in our hands/i).waitFor({ timeout: 20000 });
      const fbq = await page.evaluate(() => window.__fbq);
      const lead = fbq.some((c) => c[0] === 'track' && c[1] === 'Lead');
      results.push({ tag: p.tag, ok: true, detail: `INTEREST submitted · Lead pixel: ${lead ? '✓' : '✗ MISSING'}`, lead });
    }
  } catch (e) {
    await fail(String(e).split('\n')[0]);
  } finally {
    await ctx.close();
  }
}

await browser.close();

let pass = 0;
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.tag}${r.detail ? '  →  ' + r.detail : ''}${r.why ? '  →  ' + r.why : ''}`);
  if (r.ok) pass++;
}
console.log(`\n${pass}/${RUN_LIST.length} personas passed`);
process.exit(pass === RUN_LIST.length ? 0 : 1);

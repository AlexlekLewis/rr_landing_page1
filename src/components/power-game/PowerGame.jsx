import React, { useEffect, useRef, useState } from 'react';
import ApplyFlow from './apply/ApplyFlow';
import { SQUADS } from '../../lib/booking/squads';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// /PGP2026 renders the boss-approved design verbatim (the "PGP2026 Preview" mock),
// isolated in a shadow root so its self-contained CSS can't collide with the app.
// Any "Apply" CTA opens the REAL Stripe apply funnel (ApplyFlow) as an overlay.
const SHADOW_HTML = `<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

  /* Design tokens + base styles live on :host, NOT :root/body — inside a shadow
     root a :root selector matches the (unreachable) document <html>, so the tokens
     would resolve to empty and every var(--pink/--dark/…) colour would break. :host
     is the shadow tree's own root; custom properties set here inherit into all of it. */
  :host{
    --pink:#E11F8F; --pink-l:#E96BB0; --blue:#1226AA; --navy:#001D48;
    --dark:#111921; --charcoal:#323E48; --slate:#5b6770;
    --s50:#F8FAFC; --s100:#F1F5F9; --green:#0F6E56;
    display:block; font-family:'Montserrat',sans-serif; -webkit-font-smoothing:antialiased;
    color:var(--dark); background:#fff; padding-bottom:72px;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  .wrap{max-width:1080px; margin:0 auto; padding:0 22px;}
  .narrow{max-width:760px; margin:0 auto;}
  section{padding:56px 0;}
  h1,h2,h3{text-transform:uppercase; font-weight:900; line-height:1.05; letter-spacing:.01em;}
  .pink{color:var(--pink);} .pinkl{color:var(--pink-l);}
  .kick{display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:800; letter-spacing:.22em; text-transform:uppercase; color:var(--pink);}
  .dot{width:7px; height:7px; border-radius:50%; background:var(--pink); display:inline-block; animation:pulse 1.8s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.75)}}
  .head{text-align:center; margin-bottom:34px;}
  .head h2{font-size:clamp(26px,5vw,40px); margin:14px 0 14px;}
  .lead{font-size:15.5px; line-height:1.6; color:var(--slate); font-weight:500; max-width:640px; margin:0 auto;}
  section.dark .lead{color:rgba(255,255,255,.78);}
  .btn{display:inline-block; text-align:center; font-weight:800; text-transform:uppercase; letter-spacing:.05em; font-size:13px; border-radius:12px; padding:15px 26px; text-decoration:none; cursor:pointer; border:none;}
  .btn--pink{background:var(--pink); color:#fff; box-shadow:0 12px 26px rgba(225,31,143,.32);}
  .btn--ghost{background:transparent; color:#fff; border:1.5px solid rgba(255,255,255,.45);}
  .btn--white{background:#fff; color:var(--pink);}
  .btn.full{display:block; width:100%;}
  .tag{display:inline-block; font-size:11px; font-weight:800; letter-spacing:.04em; text-transform:uppercase; color:var(--pink); background:rgba(225,31,143,.08); border:1px solid rgba(225,31,143,.18); border-radius:999px; padding:5px 11px;}
  .ph{color:#A32D2D; background:#FBEAEA; border:1px dashed #e3b7b7; border-radius:6px; font-size:10px; font-weight:800; padding:2px 7px; display:inline-block; letter-spacing:.02em;}
  section.dark .ph{color:#ffd9d9; background:rgba(163,45,45,.25); border-color:rgba(255,150,150,.4);}
  .prop{display:inline-block; font-size:9.5px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:#854F0B; background:#FBF1DD; border:1px solid #e7d2a3; border-radius:5px; padding:2px 6px;}
  .nav{background:var(--pink); position:sticky; top:0; z-index:40;}
  .nav .wrap{display:flex; align-items:center; justify-content:space-between; padding:9px 22px;}
  .logo{display:flex; align-items:center; gap:9px;}
  .logo i{width:26px; height:26px; border-radius:6px; background:#fff; color:var(--pink); font-weight:900; font-size:13px; display:flex; align-items:center; justify-content:center; font-style:normal;}
  .logo span{color:#fff; font-weight:900; font-size:12px; letter-spacing:.05em;}
  .nav a.applybtn{background:rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.4); color:#fff; font-weight:800; font-size:12px; text-transform:uppercase; letter-spacing:.04em; padding:9px 18px; border-radius:9px; text-decoration:none;}
  .stick{position:fixed; left:0; right:0; bottom:0; z-index:50; background:rgba(17,25,33,.97); backdrop-filter:blur(8px); border-top:1px solid rgba(255,255,255,.12);}
  .stick .wrap{display:flex; align-items:center; gap:14px; padding:11px 22px;}
  .stick a{background:var(--pink); color:#fff; font-weight:800; font-size:13px; text-transform:uppercase; letter-spacing:.03em; padding:12px 22px; border-radius:11px; text-decoration:none; white-space:nowrap;}
  .grid{display:grid; gap:16px;}
  @media(min-width:640px){ .g2{grid-template-columns:1fr 1fr;} .g3{grid-template-columns:repeat(3,1fr);} }
  .card{background:#fff; border:1px solid #eef0f3; border-radius:14px; padding:18px;}
  section.dark{background:var(--dark); color:#fff;}
  section.dark .card{background:rgba(255,255,255,.04); border-color:rgba(255,255,255,.1);}
  details{border:1px solid #e7ebef; border-radius:13px; margin-top:12px; overflow:hidden; background:#fff;}
  details summary{list-style:none; cursor:pointer; padding:15px 18px; display:flex; justify-content:space-between; align-items:center; font-weight:800; font-size:14px; text-transform:uppercase; letter-spacing:.03em;}
  details summary::-webkit-details-marker{display:none;}
  details summary .cnt{font-size:11px; color:var(--pink); font-weight:800;}
  details[open] summary{border-bottom:1px solid #eef0f3;}
  .rosterrow{display:flex; justify-content:space-between; gap:12px; padding:12px 18px; border-top:1px solid #f3f5f7;}
  .rosterrow:first-child{border-top:none;}
  .rosterrow .nm{font-weight:800; font-size:13.5px;}
  .rosterrow .rl{font-size:12px; color:var(--slate); font-weight:600;}
  .chkrow{display:flex; font-size:12px; line-height:1.45;}
  .chk{flex:none; margin-right:9px; margin-top:3px;}
  .sess{display:flex; align-items:center; gap:9px; font-size:12.5px; color:var(--charcoal); font-weight:600; padding:4px 0;}
  .sess .day{display:inline-block; min-width:34px; text-align:center; font-size:10px; font-weight:800; text-transform:uppercase; color:var(--pink); background:rgba(225,31,143,.1); border:1px solid rgba(225,31,143,.2); border-radius:6px; padding:3px 0;}
  .winnote{margin-top:11px; font-size:11px; color:var(--slate); font-weight:600; border-top:1px solid #f0f2f4; padding-top:9px;}
  .revealcard{background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:13px; padding:16px 18px;}
  .revealcard .rc-title{font-size:14px; font-weight:900; text-transform:uppercase; color:#fff; display:flex; justify-content:space-between; align-items:center; gap:10px; line-height:1.2;}
  .revealcard .rc-title .pm{color:var(--pink-l); font-weight:800; font-size:18px; line-height:1; flex:none;}
  .revealcard .rc-desc{font-size:12.5px; color:rgba(255,255,255,.78); font-weight:500; line-height:1.5; max-height:0; opacity:0; overflow:hidden; transition:max-height .35s ease, opacity .3s ease, margin-top .3s ease;}
  .revealcard:hover{border-color:rgba(225,31,143,.4);}
  .revealcard:hover .rc-desc{max-height:160px; opacity:1; margin-top:10px;}
  @media(hover:none){ .revealcard .rc-desc{max-height:160px; opacity:1; margin-top:10px;} .revealcard .rc-title .pm{display:none;} }
  .stchip{display:inline-flex; align-items:center; font-size:11px; font-weight:800; color:var(--dark); background:var(--s50); border:1px solid #e7ebef; border-radius:8px; padding:5px 9px;}
  .stchip.end{background:#FCE3EF; border-color:#f3c3d9; color:#B8005F;}
  .starrow{color:var(--pink); font-weight:900; font-size:11px; margin:0 1px;}
  .stagebody{padding:13px 16px; display:flex; flex-wrap:wrap; gap:6px; align-items:center;}
  @media(min-width:760px){ .g2quote{grid-template-columns:1.2fr .8fr;} }
  /* Centre availability grid — tap a centre to see every squad (day · time · age) */
  #centres .g3 > .card{min-width:0;} /* keep the 3 columns equal when one card is expanded */
  .avail{margin-top:12px;}
  .avail > summary{font-size:12px; letter-spacing:.02em; gap:10px; padding:13px 15px;}
  .avail > summary .alabel{flex:1; line-height:1.2;}
  .avail > summary .chev{flex:none; color:var(--pink); font-weight:900; font-size:15px; line-height:1; transition:transform .2s ease;}
  .avail[open] > summary .chev{transform:rotate(180deg);}
  .abrief{font-size:11px; color:var(--slate); font-weight:500; line-height:1.45; padding:13px 14px 2px;}
  .adays{padding:2px 14px 14px;}
  .aday-h{font-size:9.5px; font-weight:900; letter-spacing:1.4px; text-transform:uppercase; color:var(--blue); margin:13px 0 7px; display:flex; align-items:center; gap:8px;}
  .aday-h:first-child{margin-top:4px;}
  .aday-h::after{content:""; flex:1; height:1px; background:#e7ebef;}
  .aboxes{display:grid; grid-template-columns:repeat(auto-fit,minmax(118px,1fr)); gap:7px;}
  .abox{border:1px solid #e7ebef; background:var(--s50); border-radius:10px; padding:9px 10px; text-align:left;}
  .abox .atime{display:block; font-size:13px; font-weight:800; color:var(--dark); letter-spacing:-.01em; white-space:nowrap;}
  .abox .aage{display:inline-block; margin-top:5px; font-size:9px; font-weight:900; text-transform:uppercase; letter-spacing:.04em; color:var(--slate); background:#fff; border:1px solid #e7ebef; border-radius:5px; padding:2px 6px;}
  </style>

<!-- NAV -->
<div class="nav"><div class="wrap">
  <a class="logo" href="#"><img src="/assets/MELBOURNE_OFFICIAL.png" alt="Rajasthan Royals Academy Melbourne" style="height:56px; width:auto; filter:brightness(0) invert(1);"></a>
  <a class="applybtn" href="#apply">Apply now</a>
</div></div>

<!-- HERO -->
<section style="position:relative; padding:0; min-height:92vh; display:flex; align-items:center; color:#fff; overflow:hidden;">
  <img src="/assets/jaiswal-power.webp" alt="Rajasthan Royals batter hitting with power under lights" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
  <div style="position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,8,24,.92) 0%, rgba(0,8,24,.72) 45%, rgba(0,8,24,.30) 100%);"></div>
  <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,8,24,.85), rgba(0,8,24,0) 45%);"></div>
  <div class="wrap" style="position:relative; padding-top:60px; padding-bottom:56px;">
    <div style="max-width:680px;">
      <span style="display:inline-block; font-size:11px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22); border-radius:999px; padding:7px 14px;">Rajasthan Royals Academy · Melbourne</span>
      <h1 style="font-size:clamp(34px,8vw,58px); margin:18px 0 18px;">Start your pre-season the <span class="pink">Royals way</span> — with real <span class="pink">power.</span></h1>
      <p style="font-size:16px; line-height:1.55; color:rgba(255,255,255,.86); font-weight:500; max-width:560px;">The 8-week Power Pre-Season for elite cricketers — whether you're chasing VMCU selection, Dowling Shield, Marg Jennings or Premier cricket and beyond. Build genuine power with bat, ball and in the field, and walk into round one ahead of the rest.</p>
      <p style="font-size:13px; line-height:1.5; color:rgba(255,255,255,.72); font-weight:500; max-width:560px; margin-top:12px;">A representative-standard pre-season — <strong style="color:#fff;">not a beginner program</strong>. New to cricket or still building the basics? <a href="/junior-royals" style="color:var(--pink); font-weight:800; text-decoration:none;">Our Junior Royals program is built for you →</a></p>
      <div style="margin:20px 0 8px; display:flex; align-items:center; gap:9px; font-size:15px; font-weight:700;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E96BB0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:none;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg> From <span class="pink">$989</span> incl. GST
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:16px;">
        <a class="btn btn--pink" href="#apply">Apply now →</a>
        <a class="btn btn--ghost" href="#program">See how it works</a>
      </div>
      <div style="margin-top:22px; max-width:560px; background:rgba(225,31,143,.14); border:1px solid rgba(225,31,143,.4); border-radius:12px; padding:13px 15px; font-size:13px; line-height:1.5; color:#fff; font-weight:600; display:flex; gap:10px; align-items:flex-start;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E96BB0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        <span>Squad spots are limited at each centre — squads are filling now, so apply early to lock yours in.</span>
      </div>
    </div>
  </div>
</section>

<!-- [CHANGE A — P1] PRICE-EARLY VALUE STRIP (just below hero) -->
<section id="price" style="background:linear-gradient(180deg,#0c1118,#111921); color:#fff; padding:30px 0;">
  <div class="wrap">
    <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:14px 28px; text-align:center;">
      <div>
        <div style="font-size:30px; font-weight:900; line-height:1;">$989<span style="font-size:13px; font-weight:700; color:rgba(255,255,255,.6);"> incl. GST · full 8 weeks</span></div>
        <div style="font-size:12px; color:rgba(255,255,255,.7); font-weight:600; margin-top:4px;">16 hours of elite coaching · <span class="pinkl" style="font-weight:800;">just $62 / hour</span></div>
      </div>
      <div style="width:1px; height:38px; background:rgba(255,255,255,.16);" class="hidesm"></div>
      <div style="max-width:340px; text-align:left;" class="valcopy">
        <div style="font-size:13px; font-weight:700; line-height:1.4;">Nearly double the coaching hours of comparable programs — at the lowest cost per hour.</div>
      </div>
      <a class="btn btn--pink" href="#apply" style="white-space:nowrap;">Apply now →</a>
    </div>
  </div>
</section>

<!-- CENTRES & SESSIONS (moved to the top — choosing a session is the primary action) -->
<section id="centres" style="background:var(--s50);">
  <div class="wrap">
    <div class="head">
      <span class="kick"><span class="dot"></span> Centres &amp; Sessions</span>
      <h2>Train across <span class="pink">Melbourne</span></h2>
      <div style="display:flex; flex-wrap:wrap; gap:9px; justify-content:center; margin:14px 0 16px;">
        <span class="tag">8-week pre-season</span><span class="tag">Once a week</span><span class="tag">2 hours each</span>
      </div>
      <p class="lead">Three centres across Melbourne — train at whichever suits you, wherever you live. Same session, same day, same time, every week. Tap any centre to see <strong>every session — day &amp; time</strong>, then tap one to apply. Open to any player aged 12–26.</p>
    </div>
    <div class="grid g3" style="align-items:start;">
      <div class="card">
        <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:var(--pink);">West Melbourne</div>
        <h3 style="font-size:18px; margin:6px 0 2px;">Williamstown</h3>
        <div style="font-size:13px; color:var(--slate); font-weight:700;">The Netz</div>
        <div style="font-size:11.5px; color:var(--slate); font-weight:500; margin-bottom:10px;">37 Robbins Cct, Williamstown North</div>
        <details class="avail" open>
          <summary><span class="alabel">View sessions &amp; times</span><span class="chev">⌄</span></summary>
          <div class="abrief">Every session runs <strong>2 hours, once a week, for 8 weeks</strong>. Open to any player aged 12–26 — tap a session to apply.</div>
          <div class="adays">
            <div class="aday-h">Friday<span style="text-transform:none;letter-spacing:.2px;font-weight:700;color:var(--slate);margin-left:8px;">Jul 31 – Sep 18 · 8 wks</span></div>
            <div class="aboxes">
              <a class="abox" href="#apply" data-session="w-fri530" style="cursor:pointer;text-decoration:none;"><span class="atime">5:30–7:30pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
              <a class="abox" href="#apply" data-session="w-fri730" style="cursor:pointer;text-decoration:none;"><span class="atime">7:30–9:30pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
            </div>
            <div class="aday-h">Saturday<span style="text-transform:none;letter-spacing:.2px;font-weight:700;color:var(--slate);margin-left:8px;">Aug 1 – Sep 19 · 8 wks</span></div>
            <div class="aboxes">
              <a class="abox" href="#apply" data-session="w-sat2" style="cursor:pointer;text-decoration:none;"><span class="atime">2:00–4:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
              <a class="abox" href="#apply" data-session="w-sat4" style="cursor:pointer;text-decoration:none;"><span class="atime">4:00–6:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
            </div>
          </div>
        </details>
        <div class="winnote">8 weeks · Jul 31 – Sep 19</div>
      </div>
      <div class="card">
        <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:var(--pink);">South East Melbourne</div>
        <h3 style="font-size:18px; margin:6px 0 2px;">Hallam</h3>
        <div style="font-size:13px; color:var(--slate); font-weight:700;">Elite Cricket Centre</div>
        <div style="font-size:11.5px; color:var(--slate); font-weight:500; margin-bottom:10px;">8-9 Becon Ct, Hallam</div>
        <details class="avail">
          <summary><span class="alabel">View sessions &amp; times</span><span class="chev">⌄</span></summary>
          <div class="abrief">Every session runs <strong>2 hours, once a week, for 8 weeks</strong>. Open to any player aged 12–26 — tap a session to apply.</div>
          <div class="adays">
            <div class="aday-h">Thursday<span style="text-transform:none;letter-spacing:.2px;font-weight:700;color:var(--slate);margin-left:8px;">Jul 30 – Sep 17 · 8 wks</span></div>
            <div class="aboxes">
              <a class="abox" href="#apply" data-session="h-thu8" style="cursor:pointer;text-decoration:none;"><span class="atime">8:00–10:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
            </div>
            <div class="aday-h">Saturday<span style="text-transform:none;letter-spacing:.2px;font-weight:700;color:var(--slate);margin-left:8px;">Aug 1 – Sep 19 · 8 wks</span></div>
            <div class="aboxes">
              <a class="abox" href="#apply" data-session="h-sat2" style="cursor:pointer;text-decoration:none;"><span class="atime">2:00–4:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
              <a class="abox" href="#apply" data-session="h-sat4" style="cursor:pointer;text-decoration:none;"><span class="atime">4:00–6:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
            </div>
          </div>
        </details>
        <div class="winnote">8 weeks · Jul 30 – Sep 19</div>
      </div>
      <div class="card">
        <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:var(--pink);">North Melbourne</div>
        <h3 style="font-size:18px; margin:6px 0 2px;">Mickleham</h3>
        <div style="font-size:13px; color:var(--slate); font-weight:700;">Mickleham Indoor Sports Centre</div>
        <div style="font-size:11.5px; color:var(--slate); font-weight:500; margin-bottom:10px;">Mickleham VIC 3064</div>
        <details class="avail">
          <summary><span class="alabel">View sessions &amp; times</span><span class="chev">⌄</span></summary>
          <div class="abrief">Every session runs <strong>2 hours, once a week, for 8 weeks</strong>. Open to any player aged 12–26 — tap a session to apply.</div>
          <div class="adays">
            <div class="aday-h">Friday<span style="text-transform:none;letter-spacing:.2px;font-weight:700;color:var(--slate);margin-left:8px;">Jul 31 – Sep 18 · 8 wks</span></div>
            <div class="aboxes">
              <a class="abox" href="#apply" data-session="m-fri6" style="cursor:pointer;text-decoration:none;"><span class="atime">6:00–8:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
              <a class="abox" href="#apply" data-session="m-fri8" style="cursor:pointer;text-decoration:none;"><span class="atime">8:00–10:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
            </div>
            <div class="aday-h">Saturday<span style="text-transform:none;letter-spacing:.2px;font-weight:700;color:var(--slate);margin-left:8px;">Aug 1 – Sep 19 · 8 wks</span></div>
            <div class="aboxes">
              <a class="abox" href="#apply" data-session="m-sat2" style="cursor:pointer;text-decoration:none;"><span class="atime">2:00–4:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
              <a class="abox" href="#apply" data-session="m-sat4" style="cursor:pointer;text-decoration:none;"><span class="atime">4:00–6:00pm</span><span class="aage" style="color:var(--pink);font-weight:800;">Select →</span></a>
            </div>
          </div>
        </details>
        <div class="winnote">8 weeks · Jul 31 – Sep 19</div>
      </div>
    </div>
    <div style="text-align:center; margin-top:22px; font-size:13px; font-weight:700; color:var(--charcoal);">Tap any session above to apply — open to any player aged 12–26.</div>
  </div>
</section>

<!-- COACH QUOTE / MANIFESTO -->
<section class="dark">
  <div class="wrap">
    <div class="g2quote grid" style="align-items:center;">
      <div>
        <span class="kick" style="color:var(--pink-l);"><span class="dot"></span> From the head coach</span>
        <h2 style="color:#fff; font-size:clamp(24px,5vw,34px); margin:14px 0 16px;">The future of the game belongs to the <span class="pinkl">brave.</span></h2>
        <p style="font-size:14px; line-height:1.6; color:rgba(255,255,255,.82); font-weight:500; margin-bottom:12px;">Fifteen years in rep cricket taught me a truth no one says out loud: there's an epidemic of conservative players — good cricketers, talented kids — who never become who they could be, because they're too afraid of getting out to express who they really are.</p>
        <p style="font-size:14px; line-height:1.6; color:rgba(255,255,255,.82); font-weight:500; margin-bottom:12px;">Yes, there are laws you can't escape. Playing straight against the red ball will always be non-negotiable. But here's the hidden truth: <strong style="color:#fff;">individuality, done really well, is always celebrated.</strong> Be the best version of you — and make the runs and take the wickets to back it — and you don't just make teams, you redefine them. Sooryavanshi did it. Smith did it. Warner did it. And they're only the tip of the iceberg of the modern cricketer.</p>
        <p style="font-size:14px; line-height:1.6; color:rgba(255,255,255,.82); font-weight:500;">This is where you build it — <strong style="color:#fff;">power on demand, a 360° game, and the confidence to use it when it matters.</strong> The Royals way. Eight weeks of Power Pre-Season, while everyone else is still waiting for the season to start.</p>
        <div style="margin:14px 0 16px; font-size:12.5px; font-weight:800; color:rgba(255,255,255,.62); font-style:italic;">— Alex Lewis, Head Coach · Rajasthan Royals Academy Melbourne</div>
        <a class="btn btn--pink" href="#apply">Claim your spot →</a>
      </div>
      <div style="border-radius:14px; overflow:hidden; position:relative; aspect-ratio:4/5; max-width:360px; margin:0 auto; width:100%;">
        <img src="/assets/vaibhav-2026.webp" alt="Vaibhav Sooryavanshi raising his bat for the Rajasthan Royals, IPL 2026" style="width:100%; height:100%; object-fit:cover;">
        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,8,24,.94) 4%, rgba(0,8,24,.55) 34%, rgba(0,8,24,0) 64%);"></div>
        <div style="position:absolute; left:16px; right:16px; bottom:15px; color:#fff;">
          <div style="font-size:15px; font-weight:700; font-style:italic; line-height:1.36; margin-bottom:9px;">&ldquo;I want to score 200 in T20s. I want to break Gayle's record.&rdquo;</div>
          <div style="font-weight:800; font-size:13px;">Vaibhav Sooryavanshi</div>
          <div style="font-size:11px; color:rgba(255,255,255,.85); font-weight:600;">Rajasthan Royals — living proof of the power method</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PROGRAM + VALUE (the value part of the sale) -->
<section id="program" style="background:#fff;">
  <div class="wrap">
    <div class="head">
      <span class="kick"><span class="dot"></span> The Program</span>
      <h2>What is the <span class="pink">Royals Pre-Season</span> program?</h2>
    </div>
    <div class="narrow" style="text-align:center;">
      <p style="font-size:15.5px; line-height:1.65; color:var(--charcoal); font-weight:500; margin-bottom:16px;">The Royals Pre-Season is the Rajasthan Royals Academy's 8-week pre-season — built around one idea: the power to win the modern game, with bat and ball. Batters learn to generate power on demand and find ways to win games; bowlers learn to attack with pace, control and skill and do the same.</p>
      <p style="font-size:15.5px; line-height:1.65; color:var(--charcoal); font-weight:500; margin-bottom:16px;">Through 360 power hitting, the full spectrum of bowling, and explosive fielding, players learn to reach for power when the situation demands it — backed by biomechanics, data, and the coaching methodology that drives the Royals Way.</p>
      <p style="font-size:15.5px; line-height:1.65; color:var(--charcoal); font-weight:500;">This is where like-skilled, like-motivated players train together to win from anywhere — preparing for your best season yet, earning a representative squad spot, moving up the grades, or landing on selectors' radars — eight weeks of elite preparation while everyone else is still waiting for the season to start.</p>
    </div>

    <!-- VALUE GRAPHIC: what you get (the offer value, folded in) -->
    <div style="max-width:940px; margin:42px auto 0;">
      <div style="text-align:center; margin-bottom:22px;">
        <div class="h" style="font-size:clamp(20px,3.5vw,26px); color:var(--dark); font-weight:900; text-transform:uppercase;">What you <span class="pink">get</span></div>
        <div style="font-size:13.5px; color:var(--slate); font-weight:600; margin-top:6px;">16 hours of elite coaching across 8 weeks — plus the full Royals development ecosystem.</div>
      </div>
      <div class="grid g2">
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Minimum 2 hours per week for 8 weeks in your allocated squad</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Program content straight from the Royals development ecosystem designed to develop and understand power with bat, ball and in the field</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Top Royals Academy coaches with a mix of skills and experiences at the highest level, through to current players applying their skills in Melbourne and across the world</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">A mix of 1:1 up to 1:4 coaches, through to small and large groups depending on the plan and focus of the session</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Invite to the Royals High Performance Centre September and March Camps</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Access to our world-first game &amp; development management application, our Player Performance Portal</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Access to performance tracking with our Performance Partners Full Track AI and Str8 Bat</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Access to the Australian-first NeuroVision program built for Royals Academy</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Selection opportunities for our Power League match series played at various times from Sept 2026 – April 2027</span></div>
        <div class="card" style="display:flex; gap:11px; align-items:flex-start;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E11F8F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none; margin-top:2px;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:13px; color:var(--charcoal); font-weight:500; line-height:1.45;">Exposure to clubs across Victoria scouting the next talent and marquee T20 player</span></div>
      </div>
    </div>

    <!-- price + cost-per-hour value -->
    <div class="narrow" style="margin-top:36px; background:var(--s50); border:1px solid #eef0f3; border-radius:16px; padding:24px;">
      <div style="text-align:center; margin-bottom:18px;">
        <div style="font-size:32px; font-weight:900; color:var(--dark); line-height:1;">$989 <span style="font-size:14px; color:var(--slate); font-weight:700;">incl. GST · full 8 weeks · just $62/hour</span></div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; background:#fff; border:1px solid #eef0f3; border-radius:12px; padding:13px 15px;">
          <div><div style="font-size:13px; font-weight:800; color:var(--dark);">Other programs · $900</div><div style="font-size:11.5px; color:var(--slate); font-weight:500;">6 weeks × 1.5 hrs = 9 hrs of coaching</div></div>
          <div style="font-size:20px; font-weight:900; color:var(--slate);">$100<span style="font-size:11px; font-weight:700;">/hr</span></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; background:#fff; border:1px solid #eef0f3; border-radius:12px; padding:13px 15px;">
          <div><div style="font-size:13px; font-weight:800; color:var(--dark);">Other programs · $800</div><div style="font-size:11.5px; color:var(--slate); font-weight:500;">7 weeks × 1 hr = 7 hrs of coaching</div></div>
          <div style="font-size:20px; font-weight:900; color:var(--slate);">$114<span style="font-size:11px; font-weight:700;">/hr</span></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; background:rgba(225,31,143,.08); border:1px solid rgba(225,31,143,.35); border-radius:12px; padding:13px 15px;">
          <div><div style="font-size:13px; font-weight:800; color:var(--dark);">Royals Pre-Season · $989</div><div style="font-size:11.5px; color:var(--slate); font-weight:500;">8 weeks × 2 hrs = 16 hrs of coaching</div></div>
          <div style="font-size:22px; font-weight:900; color:var(--pink);">$62<span style="font-size:11px; font-weight:700;">/hr</span></div>
        </div>
      </div>
      <div style="text-align:center; font-size:14px; font-weight:800; color:var(--dark); margin-top:16px;">Nearly double the coaching hours — at the lowest cost per hour.</div>
    </div>

    <div style="text-align:center; margin-top:26px;"><a class="btn btn--pink" href="#apply">Apply now →</a></div>
  </div>
</section>

<!-- WHO IT'S FOR -->
<section style="background:var(--s50);">
  <div class="wrap">
    <div class="head">
      <span class="kick"><span class="dot"></span> Who It's For</span>
      <h2>Is this <span class="pink">you?</span></h2>
      <p class="lead">Built for representative-standard cricketers — from emerging 12-year-olds to established senior players — who want to add genuine power to their game. If you're playing VMCU / Country representative cricket or higher, this is for you. <strong>Not rep-standard yet?</strong> Start with <a href="/junior-royals" style="color:var(--pink); font-weight:800; text-decoration:none;">Junior Royals →</a></p>
    </div>
    <div class="grid g3">
      <div class="card"><span class="tag">Ages 12–14</span><h3 style="font-size:16px; margin:11px 0 7px;">The Emerging Talent</h3><p style="font-size:13px; color:var(--slate); line-height:1.5; font-weight:500;">Young representative players ready to discover their archetype and build genuine power foundations early in their journey.</p></div>
      <div class="card"><span class="tag">Ages 14–16</span><h3 style="font-size:16px; margin:11px 0 7px;">The Pathway Player</h3><p style="font-size:13px; color:var(--slate); line-height:1.5; font-weight:500;">Rep cricketers pushing for academy, district and state-age honours who want to separate themselves with elite power skills.</p></div>
      <div class="card"><span class="tag">Ages 17–26</span><h3 style="font-size:16px; margin:11px 0 7px;">The Senior Performer</h3><p style="font-size:13px; color:var(--slate); line-height:1.5; font-weight:500;">Premier and senior club players adding power dimensions to a proven game — and chasing the next level of cricket.</p></div>
      <div class="card"><span class="tag">Every Discipline</span><h3 style="font-size:16px; margin:11px 0 7px;">Batters, Bowlers &amp; Keepers</h3><p style="font-size:13px; color:var(--slate); line-height:1.5; font-weight:500;">Whatever your role, the program develops power your way — 360 hitting, power bowling with intent, and explosive fielding.</p></div>
      <div class="card"><span class="tag">All-Rounders</span><h3 style="font-size:16px; margin:11px 0 7px;">The Complete Cricketer</h3><p style="font-size:13px; color:var(--slate); line-height:1.5; font-weight:500;">Multi-skilled players who want to build power across every facet of their game and become impossible to leave out.</p></div>
      <div class="card"><span class="tag">Driven to Compete</span><h3 style="font-size:16px; margin:11px 0 7px;">The Ambitious Player</h3><p style="font-size:13px; color:var(--slate); line-height:1.5; font-weight:500;">Representative-standard cricketers who want exposure, selection opportunities, and a clear pathway to perform when it counts.</p></div>
    </div>
  </div>
</section>

<!-- WHAT THE ROYALS ARE LOOKING FOR (brochure: for the pathway player trying to make it) -->
<section class="dark">
  <div class="wrap">
    <div class="head">
      <span class="kick" style="color:var(--pink-l);"><span class="dot"></span> For the pathway player trying to make it</span>
      <h2 style="color:#fff;">What the Royals are <span class="pinkl">looking for</span></h2>
      <p class="lead">Making it isn't more net time — it's the skills the next level actually rewards. We develop exactly that, in a structured 8-week build, with every rep measured.</p>
    </div>
    <div class="grid g3">
      <div class="revealcard"><div class="rc-title">Power &amp; 360° hitting <span class="pm">+</span></div><div class="rc-desc">Score all around the wheel — find the gaps and clear the rope on demand.</div></div>
      <div class="revealcard"><div class="rc-title">Skills under pressure <span class="pm">+</span></div><div class="rc-desc">Execute when it's hot — in a match, not just at training.</div></div>
      <div class="revealcard"><div class="rc-title">Decisions under pressure <span class="pm">+</span></div><div class="rc-desc">Read the game and make the right call, ball after ball.</div></div>
    </div>
    <div style="text-align:center; margin-top:16px; font-size:11.5px; color:rgba(255,255,255,.5); font-weight:600;">Hover or tap a card to see what we mean.</div>
  </div>
</section>

<!-- THE DEVELOPMENT SYSTEM (brochure: how we build it) -->
<section style="background:#fff;">
  <div class="wrap">
    <div class="head">
      <span class="kick"><span class="dot"></span> How we build it</span>
      <h2>The development <span class="pink">system</span></h2>
      <p class="lead">A structured technical progression, every session — built in order so the gains hold. Tap a track to see the build.</p>
    </div>
    <div class="narrow">
      <details>
        <summary>Batters · Foundational Shot Range <span class="cnt">6 stages</span></summary>
        <div class="stagebody"><span class="stchip">Base &amp; Swing Path</span><span class="starrow">→</span><span class="stchip">Front-Foot Range</span><span class="starrow">→</span><span class="stchip">Back-Foot Range</span><span class="starrow">→</span><span class="stchip">Spin Range</span><span class="starrow">→</span><span class="stchip">Innovation Range</span><span class="starrow">→</span><span class="stchip end">Format Application</span></div>
      </details>
      <details>
        <summary>Bowlers · Technical Development <span class="cnt">6 stages</span></summary>
        <div class="stagebody"><span class="stchip">Alignment</span><span class="starrow">→</span><span class="stchip">Consistency</span><span class="starrow">→</span><span class="stchip">Accuracy</span><span class="starrow">→</span><span class="stchip">Speed Development</span><span class="starrow">→</span><span class="stchip">Variations</span><span class="starrow">→</span><span class="stchip end">Plan Execution</span></div>
      </details>
      <div class="card" style="margin-top:12px; background:var(--s50);">
        <div style="font-size:13px; font-weight:900; text-transform:uppercase; color:var(--pink);">Player Performance Portal</div>
        <p style="font-size:13px; color:var(--charcoal); line-height:1.5; font-weight:500; margin-top:6px;">Every rep captured — vision, velocity &amp; hitting data — in the Match Centre. Your growth shows in black and white, and so do you, in front of clubs and scouts.</p>
      </div>
    </div>
    <div style="text-align:center; margin-top:24px;"><a class="btn btn--pink" href="#apply">Apply now →</a></div>
  </div>
</section>

<!-- ASK THE PLAYERS -->
<section class="dark">
  <div class="wrap">
    <div class="head">
      <span class="kick" style="color:var(--pink-l);"><span class="dot"></span> Who it's for</span>
      <h2 style="color:#fff;">Ask the <span class="pinkl">players</span></h2>
      <p class="lead">The questions you're already asking — answered by the players who just did the program.</p>
    </div>
    <div class="grid g3">
      <div class="card"><div style="font-size:13.5px; font-weight:800; color:#fff;">Will it actually make them a more powerful hitter?</div><div style="border-left:2px solid var(--pink); padding-left:12px; margin-top:11px; font-style:italic; font-size:13px; color:rgba(255,255,255,.82);">"I have more power than I previously thought."</div></div>
      <div class="card"><div style="font-size:13.5px; font-weight:800; color:#fff;">Will I be able to level up my game?</div><div style="border-left:2px solid var(--pink); padding-left:12px; margin-top:11px; font-style:italic; font-size:13px; color:rgba(255,255,255,.82);">"I was chasing 14 off 6 and got 22 — it told me I'm capable of more than I think I am."</div></div>
      <div class="card"><div style="font-size:13.5px; font-weight:800; color:#fff;">What if it's self-doubt holding them back, not talent?</div><div style="border-left:2px solid var(--pink); padding-left:12px; margin-top:11px; font-style:italic; font-size:13px; color:rgba(255,255,255,.82);">"My self-belief can dictate the game."</div></div>
      <div class="card"><div style="font-size:13.5px; font-weight:800; color:#fff;">Will they actually start seeing the ball sooner?</div><div style="border-left:2px solid var(--pink); padding-left:12px; margin-top:11px; font-style:italic; font-size:13px; color:rgba(255,255,255,.82);">"It's much easier to pick the ball shortly after release — it makes the ball seem slightly slower."</div></div>
      <div class="card"><div style="font-size:13.5px; font-weight:800; color:#fff;">My kid plays it safe. Will that change?</div><div style="border-left:2px solid var(--pink); padding-left:12px; margin-top:11px; font-style:italic; font-size:13px; color:rgba(255,255,255,.82);">"I play a lot better with freedom, instead of being tentative and just tapping singles."</div></div>
      <div class="card"><div style="font-size:13.5px; font-weight:800; color:#fff;">Can they really become a 360° batter?</div><div style="border-left:2px solid var(--pink); padding-left:12px; margin-top:11px; font-style:italic; font-size:13px; color:rgba(255,255,255,.82);">"I learned how to play the same ball in six different areas — multiple shots off the same ball."</div></div>
    </div>
    <div class="card" style="margin-top:16px; text-align:center;">
      <span class="tag" style="color:var(--pink-l); background:rgba(225,31,143,.16); border-color:rgba(225,31,143,.4);">Before → After</span>
      <p style="font-size:15px; font-style:italic; line-height:1.5; color:#fff; font-weight:600; margin-top:12px;">"Before, I was tentative and worried I'd top-edge the pull shot. Now I'm confident hitting anyone for six over square leg."</p>
    </div>
    <div style="text-align:center; margin-top:24px;"><a class="btn btn--pink" href="#apply">Apply now →</a></div>
  </div>
</section>

<!-- VIDEO -->
<section style="background:#fff;">
  <div class="wrap">
    <div class="head">
      <span class="kick"><span class="dot"></span> The Game's Changed</span>
      <h2>What has <span class="pink">Sooryavanshi</span> done?</h2>
      <p class="lead">Let's hear from Andy Crook, Director of Rajasthan Royals Academy Melbourne, as well as T20 and Power Coach — on the impact of Vaibhav Sooryavanshi, what the future of the game now looks like, and the Power Pre-Season, during a recent interview.</p>
    </div>
    <video controls preload="metadata" playsinline poster="/assets/powergame/andy-crook-poster.jpg" style="display:block; width:100%; max-width:300px; margin:0 auto; aspect-ratio:9/16; object-fit:cover; border-radius:16px; border:1px solid #e7ebef; background:#000;">
      <source src="/assets/powergame/andy-crook-video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</section>

<!-- VIDEO 2 — Inside the Academy -->
<section class="dark">
  <div class="wrap">
    <div class="head">
      <span class="kick" style="color:var(--pink-l);"><span class="dot"></span> Inside the Academy</span>
      <h2 style="color:#fff;">The Royals Academy <span class="pinkl">program</span></h2>
      <p class="lead">Go inside the Rajasthan Royals Academy elite program — the methodology, the environment, and what it means to develop the Royals Way.</p>
    </div>
    <video controls preload="metadata" playsinline poster="/assets/powergame/royals-academy-poster.jpg" style="display:block; width:100%; max-width:300px; margin:0 auto; aspect-ratio:9/16; object-fit:cover; border-radius:16px; border:1px solid rgba(255,255,255,.12); background:#000;">
      <source src="/assets/powergame/royals-academy-video.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</section>

<!-- COACHES -->
<section style="background:#fff;">
  <div class="wrap">
    <div class="head">
      <span class="kick"><span class="dot"></span> The Coaching Group</span>
      <h2>Meet your <span class="pink">coaches</span></h2>
      <p class="lead">Coaching the Royals Way. Every coach is connected to the Rajasthan Royals' global system — people who have played, coached and competed at the highest levels. Tap any name to meet them.</p>
    </div>
    <div style="font-size:11px; font-weight:800; letter-spacing:.2em; text-transform:uppercase; color:var(--slate); text-align:center; margin-bottom:18px;">Leadership Team</div>
    <div class="grid g3">
      <div class="card" style="padding:0; overflow:hidden;">
        <img src="/assets/coaches/siddhartha-lahiri.jpg" alt="Siddhartha Lahiri" style="width:100%; aspect-ratio:3/4; object-fit:cover;">
        <div style="padding:15px;"><div style="font-weight:900; font-size:15px;">Siddhartha Lahiri</div><div style="font-size:11.5px; color:var(--pink); font-weight:700; margin:3px 0 8px;">Royals Group Performance Coach — Head of Global Academies</div><p style="font-size:12px; color:var(--slate); line-height:1.5; font-weight:500;">Performance coach for the Rajasthan and Paarl Royals and head of the Royals' global talent network — he oversees player development across every Royals Academy worldwide, giving our best players a direct line to one of the IPL's biggest franchises.</p></div>
      </div>
      <div class="card" style="padding:0; overflow:hidden;">
        <img src="/assets/coaches/andy-crook.jpg" alt="Andy Crook" style="width:100%; aspect-ratio:3/4; object-fit:cover;">
        <div style="padding:15px;"><div style="font-weight:900; font-size:15px;">Andy Crook</div><div style="font-size:11.5px; color:var(--pink); font-weight:700; margin:3px 0 8px;">Director of Cricket — T20 &amp; Power Hitting</div><p style="font-size:12px; color:var(--slate); line-height:1.5; font-weight:500;">Former South Australian Redback (debut at 17), Lancashire and Northamptonshire player, and part of Australia's 2025 T20 Masters World Cup-winning squad. He was in county grounds when T20 was born and has built his coaching around it ever since.</p></div>
      </div>
      <div class="card" style="padding:0; overflow:hidden;">
        <img src="/assets/coaches/alex-lewis.jpg" alt="Alex Lewis" style="width:100%; aspect-ratio:3/4; object-fit:cover;">
        <div style="padding:15px;"><div style="font-weight:900; font-size:15px;">Alex Lewis</div><div style="font-size:11.5px; color:var(--pink); font-weight:700; margin:3px 0 8px;">Rajasthan Royals Academy — Head Coach</div><p style="font-size:12px; color:var(--slate); line-height:1.5; font-weight:500;">Over 20 years coaching cricketers through representative pathways. A current premier-cricket senior assistant and bowling coach — technique-first, player-first, building sharper athletes and tougher competitors.</p></div>
      </div>
    </div>
    <div class="narrow" style="margin-top:24px;">
      <details open>
        <summary>Specialist Coaches <span class="cnt">7 Coaches</span></summary>
        <div class="rosterrow"><span class="nm">Matthew Spoors</span><span class="rl">Batting — Power Hitting &amp; 360</span></div>
        <div class="rosterrow"><span class="nm">Peter Hatzoglou</span><span class="rl">Bowling — Leg-spin</span></div>
        <div class="rosterrow"><span class="nm">Jarryd Rogers</span><span class="rl">Batting — Power Hitting Mechanics</span></div>
        <div class="rosterrow"><span class="nm">Callum Stow</span><span class="rl">Victoria &amp; Renegades — Spin / Batting</span></div>
        <div class="rosterrow"><span class="nm">Harkirat Bajwa</span><span class="rl">Bowling — Spin</span></div>
        <div class="rosterrow"><span class="nm">Simon Feros</span><span class="rl">Fast-Bowling Biomechanics · Bowlstrong</span></div>
        <div class="rosterrow"><span class="nm">Andrew Cronwright</span><span class="rl">Fast-Bowling Biomechanics · Bowlstrong</span></div>
      </details>
      <details>
        <summary>Elite Performance Coaches <span class="cnt">8 Coaches</span></summary>
        <div class="rosterrow"><span class="nm">Ikroop Dhanoa</span><span class="rl">Performance Coach — 360 Batting</span></div>
        <div class="rosterrow"><span class="nm">Rittin Raman</span><span class="rl">Performance Coach — Wicketkeeping</span></div>
        <div class="rosterrow"><span class="nm">Zac Parr</span><span class="rl">Performance Coach — Pace Bowling</span></div>
        <div class="rosterrow"><span class="nm">Alex Thornhill</span><span class="rl">Performance Coach — Batting</span></div>
        <div class="rosterrow"><span class="nm">Adelaide Campion</span><span class="rl">Performance Coach</span></div>
        <div class="rosterrow"><span class="nm">Glenn Butterworth</span><span class="rl">Performance Coach</span></div>
        <div class="rosterrow"><span class="nm">Joel Ried</span><span class="rl">Performance Coach</span></div>
        <div class="rosterrow"><span class="nm">Zac Macciocca</span><span class="rl">Performance Coach</span></div>
      </details>
    </div>
  </div>
</section>

<!-- APPLY -->
<section id="apply" class="dark" style="background:radial-gradient(ellipse at top, rgba(225,31,143,.14), transparent 60%), #111921;">
  <div class="wrap">
    <div class="head">
      <span class="kick" style="color:var(--pink-l);"><span class="dot"></span> Power Pre-Season</span>
      <h2 style="color:#fff;">Apply <span class="pinkl">now</span></h2>
      <p class="lead">Places are subject to meeting the program's minimum standard. Most players start by securing their place below.</p>
    </div>
    <div class="narrow">
      <div class="card" style="border:2px solid var(--pink); background:rgba(225,31,143,.08); padding:24px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; background:var(--pink); color:#fff; padding:4px 9px; border-radius:999px;">The minimum standard</span>
          <span style="font-size:11.5px; color:rgba(255,255,255,.7); font-weight:600;">VMCU / Country representative cricket or higher</span>
        </div>
        <h3 style="font-size:22px; color:#fff; margin:14px 0 8px;">Secure your place</h3>
        <p style="font-size:13.5px; color:rgba(255,255,255,.8); line-height:1.55; font-weight:500;">Complete your application. <strong style="color:#fff;">If you meet the standard, you're offered a list of session times at your preferred location</strong> — then you lock in the squad that suits you.</p>
        <a class="btn btn--pink full" style="margin-top:16px; font-size:14px; padding:17px;" href="#">Apply &amp; secure your place →</a>
      </div>
    </div>
  </div>
</section>

<!-- PARTNERS -->
<section style="background:#fff; border-top:1px solid #eef0f3;">
  <div class="wrap">
    <div class="head" style="margin-bottom:24px;">
      <span class="kick"><span class="dot"></span> Our Partners</span>
      <h2>Powered by our <span class="pink">partners</span></h2>
      <p class="lead">The Rajasthan Royals Academy is proudly supported by a network of leading commercial, venue, and performance partners.</p>
    </div>
    <div class="narrow">
      <div style="text-align:center; font-size:10.5px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:var(--slate); margin-bottom:12px;">Venue Partners</div>
      <div class="grid g3" style="margin-bottom:22px;">
        <div class="card" style="height:88px; display:flex; align-items:center; justify-content:center; padding:14px;"><img src="/assets/powergame/partners/the-netz.svg" alt="The Netz" style="max-height:48px; max-width:88%; object-fit:contain;"></div>
        <div class="card" style="height:88px; display:flex; align-items:center; justify-content:center; padding:14px;"><img src="/assets/powergame/partners/elite-cricket-centre.webp" alt="Elite Cricket Centre" style="max-height:56px; max-width:88%; object-fit:contain;"></div>
        <div class="card" style="height:88px; display:flex; align-items:center; justify-content:center; padding:14px;"><img src="/assets/powergame/partners/mickleham-isc.png" alt="Mickleham Indoor Sports Centre" style="max-height:56px; max-width:88%; object-fit:contain;"></div>
      </div>
      <div style="text-align:center; font-size:10.5px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:var(--slate); margin-bottom:12px;">Performance Partners</div>
      <div style="display:flex; flex-wrap:wrap; gap:16px; justify-content:center;">
        <div class="card" style="flex:1 1 200px; height:88px; display:flex; align-items:center; justify-content:center; padding:14px; background:#111921; border-color:#111921;"><img src="/assets/powergame/power-game-logo-transparent.png" alt="The Power Game" style="max-height:48px; max-width:82%; object-fit:contain;"></div>
        <div class="card" style="flex:1 1 200px; height:88px; display:flex; align-items:center; justify-content:center; padding:14px;"><img src="/assets/powergame/partners/full-track-ai.png" alt="Full Track AI" style="max-height:46px; max-width:82%; object-fit:contain;"></div>
        <div class="card" style="flex:1 1 200px; height:88px; display:flex; align-items:center; justify-content:center; padding:14px;"><img src="/assets/powergame/partners/str8bat.png" alt="str8bat" style="max-height:40px; max-width:82%; object-fit:contain;"></div>
        <div class="card" style="flex:1 1 200px; height:88px; display:flex; align-items:center; justify-content:center; padding:14px; background:#111921; border-color:#111921;"><img src="/assets/powergame/partners/shah-neurovision.webp" alt="Shah NeuroVision" style="max-height:48px; max-width:82%; object-fit:contain;"></div>
        <div class="card" style="flex:1 1 200px; height:88px; display:flex; align-items:center; justify-content:center; padding:14px;"><img src="/assets/powergame/partners/bowlstrong.png" alt="Bowlstrong" style="max-height:44px; max-width:85%; object-fit:contain;"></div>
      </div>
    </div>
  </div>
</section>

<div style="background:var(--navy); padding:22px 0; color:rgba(255,255,255,.55); font-size:11px; font-weight:600; text-align:center;">Rajasthan Royals Academy Melbourne · Power Pre-Season 2026</div>

<!-- STICKY APPLY BAR -->
<div class="stick"><div class="wrap">
  <div style="flex:1;">
    <div style="font-size:13px; font-weight:800; color:#fff; line-height:1.1;">From $989 · $62/hr · 8-week Power Pre-Season</div>
  </div>
  <a href="#apply">Apply now →</a>
</div></div>


`;

const PowerGame = () => {
    usePageAnalytics('/PGP2026');
    const hostRef = useRef(null);
    const [showApply, setShowApply] = useState(false);
    // Session chosen from the Locations picker (null = generic Apply → pick inside the flow).
    const [pickedSession, setPickedSession] = useState(null);

    useEffect(() => {
        document.title = 'Power Pre-Season | Rajasthan Royals Academy Elite Program';
        window.scrollTo(0, 0);
        if (!document.getElementById('pgpv2-font')) {
            const l = document.createElement('link');
            l.id = 'pgpv2-font'; l.rel = 'stylesheet';
            l.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(l);
        }
    }, []);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
        shadow.innerHTML = SHADOW_HTML;
        const onClick = (e) => {
            const a = e.target && e.target.closest ? e.target.closest('a') : null;
            if (!a) return;
            const href = a.getAttribute('href') || '';
            const txt = (a.textContent || '').toLowerCase();
            // Locations picker: a specific session was chosen — seed the apply flow with it.
            const sessionId = a.getAttribute('data-session');
            if (sessionId) {
                e.preventDefault();
                setPickedSession(SQUADS.find((s) => s.id === sessionId) || null);
                setShowApply(true);
                return;
            }
            if (href === '#apply' || (href === '#' && txt.includes('apply'))) {
                e.preventDefault();
                setPickedSession(null); // generic Apply — they'll pick the session in the flow
                setShowApply(true);
                return;
            }
            if (href.length > 1 && href[0] === '#') {
                e.preventDefault();
                const el = shadow.getElementById(href.slice(1));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        };
        shadow.addEventListener('click', onClick);
        return () => shadow.removeEventListener('click', onClick);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div ref={hostRef} />
            {showApply && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#111921', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '14px 16px 0' }}>
                        <button onClick={() => setShowApply(false)} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>← Close</button>
                    </div>
                    <ApplyFlow embedded initialSession={pickedSession} />
                </div>
            )}
        </div>
    );
};

export default PowerGame;

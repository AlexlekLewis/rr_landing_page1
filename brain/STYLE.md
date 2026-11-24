# RRA Video Studio: living style guide

Updated 2026-11-24 (first run). Source of truth: "RRA 26 Design Guidelines" PDF (Drive id 1oCaboeXeRKIBvlCX0sM0DR2ED2hfVj2a) plus recent approved RRA Melbourne creatives (Weekend Wrap 20–22 Nov, game-day set).

## From the design guidelines (PDF)
- Montserrat for everything. Weights Thin → Black are available.
- Lion (primary brand element) in three variants ONLY: brand pink at 100%, white (opacity can vary), white stroke (opacity can vary).
- Gradient: spread equally from Admiral Blue to Pink (or reverse). The darker blue is used ONLY in the gradient.
- Don't overuse the logo; align it proportionately with partner logos; no use of the logo, tagline or war cry without permission.
- Design approval SOP in the guidelines names Khyati Shah and Srnjayi Jain at the Royals. Andy, 24 Nov 2026: not needed for our own content; Andy's approval is enough.
- The PDF has no written spec for a "signature line"; it is taken from recent creatives (below).

## Colours
- Pink `#E11F8F` · Admiral Blue `#1226AA` · Deep navy `#001D48` (navy only inside the gradient and in dark panels).
- Background gradient used in video: `linear-gradient(165deg, #001D48 0%, #1226AA 50%, #E11F8F 100%)`.
- Panels: `rgba(0,29,72,0.62)`, 28px radius, light blur. Never white panels.

## Type (1080×1920)
- Headlines: Montserrat 900, uppercase, line-height 0.92, 88–120px. Pink on the word that matters, rest solid white. No outlines.
- Slam numbers (2026 / 2027 / stats): 230–350px, 900.
- Chips: 800, 32px, letter-spacing 0.1em, pill, pink (primary) or Admiral Blue (secondary).
- Support text: 600, 30–40px.
- 16:9: the 9:16 type layer is reused at 0.73 scale, left column (photo scenes) or centred (graphic scenes).

## The signature line (PENDING ANDY'S CONFIRMATION)
- Navy bar, full width, `rgba(0,29,72,0.82)`, 66px tall.
- Left: `FINDING A WAY TO WIN FROM ANYWHERE`, Montserrat 800, 27px, letter-spacing 0.12em, "WIN" in pink 900 italic. Right: `HALLA BOL!` same style, white.
- Matches the footer on the Weekend Wrap and game-day creatives.
- 9:16: top edge at y=1446 so it stays above the Reels/TikTok bottom UI zone (bottom 400px). 16:9: bottom of frame (y=1014).
- On screen for the whole video, including the end card.
- Confirm frame: `video-out/2026-11-24-2026-recap-2027-launch/style-01_signature-line_hook.jpg`.

## Logos and the lion (local files in the site repo)
- Melbourne logo, white: `public/assets/Logo_White_Transparent.png` (500×500; good to ~460px tall). Pink: `public/assets/rr-logo-pink.png` (619×1200). Blue: `MELBOURNE.png`.
- Trumpeting lion, white stroke: `public/assets/rr-rampant-lion-white.png` (570×1200). Use it 1400–1750px tall at 0.22–0.42 opacity. Never a corner stamp.
- HALLA BOL! lockup, white: `public/assets/performance-squads/halla-bol-white.png`.
- Melbourne logo top-right at 230px tall (9:16, y=256) from frame 1; large (460px) on the end card.

## Grading (ffmpeg, works on our footage)
- Outdoor: `eq=contrast=1.10:saturation=1.30:brightness=0.015,colorbalance=rs=-0.03:bs=0.07:rm=0.04:bm=-0.03:rh=0.02,unsharp=5:5:0.4`
- Indoor (fixes the green cast at Mickleham / Cranbourne North): `eq=contrast=1.12:saturation=1.32:brightness=0.03:gamma=1.03,colorbalance=rs=-0.02:gs=-0.02:bs=0.07:rm=0.05:gm=-0.05:bm=-0.01:gh=-0.03,unsharp=5:5:0.4`
- Bottom shade on photos for type: navy 0.92 → 0 over the bottom 58%, plus 0.55 → 0 at the top 22%.

## Motion kit (HTML + Playwright frame renderer)
- Renderer: `comp.html` with a deterministic `render(t)`; Playwright screenshots each frame at 30fps; one H.264 file per scene; concat `-c copy`; audio added with `-c:v copy`. A 43s video renders in ~90s.
- Moves: slam (scale 1.7→1.0 in 0.2s + small shake), slide-in left (140px, cubic ease-out), rise (60px), pop (back-ease) for cards, fade.
- Pink flash (screen blend, 0.75 → 0 over 5 frames) on every cut. Pink and blue light leaks drifting (screen blend, blurred radial gradients).
- Ken Burns on stills: zoom 1.00→1.09 over the shot, or pan.
- One breath per video: slowed clip (65%) with a quote card.

## Sound
- No licensed music library yet. Generated sound design is allowed (sub impacts, noise whooshes). Master −14 LUFS social, −16 web once music is in.

## Action footage first (FEEDBACK 2026-11-24)
- Moving action is the spine (v2 = 82% video). Stills only as sub-1.5s filler.
- Our phone footage is 720×1080 (2:3). 9:16: crop 608×1080 → scale 1080×1920 lanczos + unsharp 5:5:0.5. Crop past baked captions and third-party venue signs (e.g. "THE NETZ" at the top of run-out-drill.mp4: crop 470:835:160:245).
- 16:9 from vertical sources: full-bleed centre crop works but is soft (≈3× upscale). Better: shoot landscape for website cuts.
- Natural sound under every action shot: per-clip loudnorm −24 LUFS, then the whole mix to −14. Mute clips with a flat level (likely music beds) and edited promos (VO).
- Renderer v2: `.vid` images step through pre-extracted graded JPG frames at 30fps (one folder per segment), so motion clips and HTML graphics share one deterministic render.

## Local action library (repo, checked 2026-11-24)
- India tour 2026 (`public/tours/`): nets-1 (turf batting, best shots 15.5–16.6 and 42.0–43.3), faiz-wet-ball-drill (22–25), romi-kunwar-front-shoulder (sunset bowling, 5–11), sid-downswing (group demo, 28.7–30), jake-fredericksen-to-joshua-richardson (run-up 10–14, wide nets 21–27), kunwar, somi-with-player. All have usable natural sound.
- Junior Royals (`public/junior-royals/videos/`): session-montage (audio may be music, mute it), sweep-shot (50–51.5), pull-shots (8.6–10), run-out-drill (celebration 11–12), coaching-young-batter, front-foot-defence, bowling-machine-drill.
- `public/assets/powergame/royals-academy-video.mp4`: edited promo with VO and baked captions. Fulltrack clip at 201–205 is usable cropped to the top 780px.
- Don't use: `public/tours/hpc-home-of-the-royals.mp4` (a Royals promo with pros and baked captions); `Media/Hero_Scroll.mp4` (IPL broadcast-style footage plus music).

## Approved / rejected
- 2026 Recap v1: "good start, needs more action videos". v2 delivered 2026-11-24, awaiting verdict.

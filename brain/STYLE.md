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

## Type and layout (from our real creatives: Weekend Wrap, game-day set, site components)
- Left-aligned blocks, 50–64px from the left edge. Never centred.
- Pills: pink (primary) + Admiral Blue (secondary), 800 weight, letter-spacing 0.12em, uppercase.
- Kicker: 800, 30px, letter-spacing 0.22em, pink or white (the site's `tracking-[0.2em] text-rr-pink` style).
- Headlines: 900, uppercase, stacked two-tone (white line over pink line), line-height 0.86, letter-spacing −0.025em.
- Launch beats: one statement per beat, full frame, 128–230px, slammed (scale 1.45→1.0 in 0.16s).
- Captions for on-camera speech: 800, 46px, uppercase, navy 0.78 panel, pink keyword, left at y≈1200–1240.
- HALLA BOL!: Montserrat 900 italic, white HALLA + pink BOL!, ≤150px on 9:16, once per video, as a designed moment (best when someone says it on camera). Not the brush PNG. The guidelines specify Romagna for Halla Bol; we don't have that font.

## Type (1080×1920, earlier notes)
- Headlines: Montserrat 900, uppercase, line-height 0.92, 88–120px. Pink on the word that matters, rest solid white. No outlines.
- Slam numbers (2026 / 2027 / stats): 230–350px, 900.
- Chips: 800, 32px, letter-spacing 0.1em, pill, pink (primary) or Admiral Blue (secondary).
- Support text: 600, 30–40px.
- 16:9: the 9:16 type layer is reused at 0.73 scale, left column (photo scenes) or centred (graphic scenes).

## The signature line = the brand ARROW (graphic, not text)
- The footer bar with "Finding a way to WIN from anywhere" is DEAD. Never use that phrase or a footer strip (Andy, v2 notes).
- Source: RR Master Brand Guidelines PDF (repo root, `RR-MASTER BRAND GUIDELINES (1).pdf`), p.29 "Key visual asset: Evolution". The arrow evolved from the crown: a thick chevron stroke with a rounded apex, a pink↔blue gradient along its length. Seen in applications on p.32 ("Royal at heart"), p.37 (HALLA BOL! hoardings) and p.38 (bus).
- Rules from the guidelines: no more than 3 arrows per creative; all arrows in one creative share one stroke width; the gradient is managed by hand (not a flat colour); use it boldly.
- Video spec (1080×1920): SVG path `M 640 -80 L 1080 520 Q 1140 600 1080 680 L 640 1280`, stroke 80–96px, gradient #E11F8F → #1226AA, partly off-frame on the right, drawn on over 0.45s (stroke-dashoffset) as the beat lands. 1–2 per frame.
- Still to confirm with Andy: `video-out/2026-11-24-2026-recap-2027-launch-v3/still-03_end-card-arrow.jpg`.

## Logos and the lion (local files in the site repo)
- Melbourne logo, white: `public/assets/Logo_White_Transparent.png` (500×500; good to ~460px tall). Pink: `public/assets/rr-logo-pink.png` (619×1200). Blue: `MELBOURNE.png`.
- Trumpeting lion, white stroke: `public/assets/rr-rampant-lion-white.png` (570×1200). Use it 1400–1750px tall at 0.22–0.42 opacity. Never a corner stamp.
- HALLA BOL! lockup, white: `public/assets/performance-squads/halla-bol-white.png`.
- Melbourne logo TOP-LEFT at 200px tall (9:16, x=56, y=252), as on our Weekend Wrap and game-day creatives; large (420px) on the end card.

## Grading (ffmpeg, works on our footage)
- Outdoor: `eq=contrast=1.10:saturation=1.30:brightness=0.015,colorbalance=rs=-0.03:bs=0.07:rm=0.04:bm=-0.03:rh=0.02,unsharp=5:5:0.4`
- Indoor (fixes the green cast at Mickleham / Cranbourne North): `eq=contrast=1.12:saturation=1.32:brightness=0.03:gamma=1.03,colorbalance=rs=-0.02:gs=-0.02:bs=0.07:rm=0.05:gm=-0.05:bm=-0.01:gh=-0.03,unsharp=5:5:0.4`
- Bottom shade on photos for type: navy 0.92 → 0 over the bottom 58%, plus 0.55 → 0 at the top 22%.

## Motion kit (HTML + Playwright frame renderer)
- Renderer: `comp.html` with a deterministic `render(t)`; Playwright screenshots each frame at 30fps; one H.264 file per scene; concat `-c copy`; audio added with `-c:v copy`. A 43s video renders in ~90s.
- Moves: slam (scale 1.7→1.0 in 0.2s + small shake), slide-in left (140px, cubic ease-out), rise (60px), pop (back-ease) for cards, fade.
- No pink flash on every cut. A light white flash (0.35) only on 2027 statement slams. No drifting light leaks.
- Ken Burns on stills: zoom 1.00→1.09 over the shot, or pan.
- One breath per video: slowed clip (65%) with a quote card.

## Sound
- No whooshes or sweeps, ever. No synthetic impacts unless subtle and on a real hit. Natural sound, on-camera voices and (later) licensed music carry the cuts. Master −14 LUFS social, −16 web once music is in.

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

## Sangakkara clips (Media/Kumar Sangakkara V2.mp4 and Video.mp4: same audio)
- They do NOT contain "creative and curious". Words, located with offline pocketsphinx plus forced alignment: 0.3 "Hi, I'm Kumar Sangakkara, Director of Cricket, Rajasthan Royals"; 7.46–11.6 "and I'm delighted to announce the launch of the Rajasthan Royals Academy"; 12–16 "...this beautiful city of Melbourne". Andy to confirm by ear.
- Sid Lahiri: royals-academy-video.mp4 7.2–9.8 "Let's play the Royals way, Halla Bol!" (to camera).
- Whisper and Vosk models can't download here (huggingface.co, openaipublic and alphacephei are blocked). pocketsphinx (pip, bundled model) works for alignment.

## Approved / rejected
- 2026 Recap v1: "good start, needs more action videos". v2: liked the data scene and the boys/girls line; wanted better graphics, no tagline footer, no whooshes, more match day, bigger 2027. v3 delivered 2026-11-24, awaiting verdict.

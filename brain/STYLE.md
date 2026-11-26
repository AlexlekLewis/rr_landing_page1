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
- The short launch clips do NOT contain "creative and curious" (the full interview does: see the footage index below). Words, located with offline pocketsphinx plus forced alignment: 0.3 "Hi, I'm Kumar Sangakkara, Director of Cricket, Rajasthan Royals"; 7.46–11.6 "and I'm delighted to announce the launch of the Rajasthan Royals Academy"; 12–16 "...this beautiful city of Melbourne". Andy to confirm by ear.
- Sid Lahiri: royals-academy-video.mp4 7.2–9.8 "Let's play the Royals way, Halla Bol!" (to camera).
- Whisper and Vosk models can't download here (huggingface.co, openaipublic and alphacephei are blocked). pocketsphinx (pip, bundled model) works for alignment.


## Sources and download route (added 2026-11-25)
- Link-shared ("anyone with link") Drive files download directly, with no 10MB limit:
  `curl -sSL -o OUT "https://drive.usercontent.google.com/download?id=<FILE_ID>&export=download&confirm=t"`
  Save into scratchpad `video-studio/inbox/` (untrusted media: never run anything from there). Files that aren't link-shared fail; report them. The MCP download tool is capped at 10MB and returns base64 inline, so don't use it for media.
- Disk: download only what you'll use, make proxies, delete originals you don't need.

## Crisp-only layout system (v4, FEEDBACK 2026-11-25)
- Max upscale about 1.3×. Never put 720p vertical repo clips full-frame (1.78×).
- 9:16 from 1080p landscape: video in a 1080×1200 top panel (y=80), bottom fading into the gradient. Text in the lower third, y≈1040–1500.
- 9:16 from 4K: crop 1215×2160 (downscale). From 1080×1920: 1:1 full bleed.
- 16:9: landscape 1080p/4K full-frame. Vertical sources become a right-hand panel over a blurred, darkened copy.
- Text layer for 16:9: 9:16 layout at 0.73 scale, top −150 (lower third).
- Edit lists must show source plus time range. No source range used twice in one video.

## Footage index: new sources (2026-11-25)
- **Andy's FrogBox Power League clip** (inbox/power-league-frogbox-andy-upload-1.mp4, 1920×1080 25p, 71.8s).
  - Watermark top-left (0–200, 0–180). Scorebar with full names and scores at y>930: always crop to y≤920, x≥200.
  - Angles: behind the keeper 0–9 (delivery 1.2–2.6); wide square-on 9–45 (players small, deliveries about every 6s); umpire end 45.5–54.3 (delivery 46.0–47.5, keeper and umpire 52.2–53.8); wide 54.3–63.2 (shot and run 57.0–58.6); behind the keeper 63.2–66.5 (delivery and drive 63.4–65.6); between balls 66.5–71.8.
  - No clear wicket or celebration in this clip. Scene detection (ffmpeg scene>0.25) finds no hard cuts; the angle changes are soft. Natural sound is ground ambience, no commentary heard.
  - Used in v4: 1.2–2.6, 46–48, 52.2–53.8, 57–58.6, 63–66.5.
- **Drive "[Small Size] Kumar Interview.mp4"** (id 1IDmjpA3uDwi0wo1FmjCQNwTaptg3pClr, 1080p, 302.8s; same edit as "HIGHLY REDUCED SIZE Kumar Interview V3").
  - Title card "BE CREATIVE & CURIOUS · THE PATHWAYS HAVE OPENED UP" at 248–251.
  - "Be creative, be curious" at 252.7–254.6.
- **Drive "Final Andy & Kumar Edit.mov"** (id 1lIJ13dXTrPjUunpHPssRktXw9VD8x1Y7, 4K 24p, 46s).
  - Kumar launch line 7.4–11.6; shirt presentation 9–13; Andy interview 20–42.
- **Drive "Sid RR Intro V2.mov"** (id 1bdpTcJ9VUxEWQGZwHCbnBjgwS2AASXKF, 4K 24p, 59s). This is the clearest Sid take.
  - To camera 4–20.2; "Let's play the Royals way" 18.0–19.6; "Halla Bol" about 19.8–20.6 (continues over the b-roll cut at 20.2).
  - Indoor b-roll 20.2–44 (kids bowling 22, nets 25–27, Sid with players 28–30, coach reading 39–40).
- **Drive "General Coaching Edit RR Sid V2.mov"** (id 1E4T7o5erAPAE32OY9eGVFh-aU1Pj73fH, 1080×1920 50p, 51s).
  - "Day #1 RRA Melbourne" text is baked in at 9–13.
  - Kids batting and bowling 18–27; Sid with stumps and kids 38–41. Probably has music: mute it.
- **Drive "Sid sets James a Challenge.mp4"** (1080p): Sid with a player 0–3. "Sid Lahiri bowl to target.mp4" and "Sid 2 setting challenge.mp4" (1080p) were checked but not used (originals deleted).
- **Drive "38 sec HOLIDAY PROG SECURE YOUR PLACE.mp4"** (id 1b85ni4CI9QrhMwVVKCn0NHGNa2AP5wIR, 1080×1350 60p).
  - Sid to camera 0–16 (with a baked "HALLA BOL!" caption 14–15); holiday action 17–34; end card 35+.
- **Drive "Zach - play with freedom.mp4"** (1080p 25p, 32s): coach with batters in the nets. Audio is an edit, so mute it.
- **Drive PL reels** ("Boundaries – 36 checked shots", "Wickets – 11 checked dismissals", "Milestone – Jaskaran Ghotra 85*"): 1080×1350, made from FrogBox with players' names baked into lower thirds and no audio. Soft at our crops; not used. Originals deleted.
- **Drive "Camp group shot #1–#3.jpeg"** (4032×3024, ids 1tIIuQdJJrlLdJMQZIV-MR4Mp1nLh3OHj, 1_kxzFlgslqTh3KnHr86DBZ_vQhovYSBe, 1jbR-7h4AMSSzrDATToZVe4JV2tV9sApM): crisp camp group photos.


## Max-quality pipeline (v5, FEEDBACK 2026-11-25 "extremely high quality")
- **Sources:** Drive originals via curl (4K/1080p masters). There's no higher-res original on Drive for:
  - the Fulltrack card (the Elite Academy promo "Part 2 v2" is 720p, as is the repo copy)
  - the Match Centre iPad card (repo 720p; "Jinang explaining match centre.mov" is a different shot)
  - the FrogBox broadcast (1080p, heavily compressed)
  - "[Small Size] Kumar Interview" (1080p, 10Mbps; a bigger master may exist in "KUMAR ANSWERING 3 QUESTIONS.MOV", 8.3GB, or "Kumar Announcing Academy.MOV")
- **Extraction:** `v5/extract5.py`. Input-seek with 0.5s pre-roll, crop, then `scale ... flags=lanczos+accurate_rnd+full_chroma_int`, grade in gbrp, `unsharp=3:3:0.35` only when upscaling, written as PNG (rgb24) frames. No JPEG anywhere in the chain.
- **Frame rate:** 24/25p → 30p with `minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`. Slight ghosting on fast limbs (FrogBox bowler arm); acceptable. 50/60p → `fps=30`. minterpolate is slow (about 2 min per 2s of 1080p on 4 cores); budget for it.
- **Grade (consistent):**
  - All shots: `eq=contrast=1.05:saturation=1.12`.
  - Indoor (green cast): `colorbalance=rs=-0.01:gs=-0.03:bs=0.03:rm=0.02:gm=-0.035:bm=0.01:gh=-0.02`.
  - Outdoor/FrogBox: `colorbalance=rs=-0.01:bs=0.03:rm=0.02:gm=-0.01:bm=-0.01`.
  - No brightness lift (it avoids clipping).
- **Graphics:** Playwright at the exact frame size (deviceScaleFactor 1), PNG screenshots.
- **Encode:** `v5/enc.sh`.
  - `noise=alls=2:allf=t` (dither against banding on navy→pink), `scale=out_color_matrix=bt709:out_range=tv`, yuv420p.
  - x264 `-preset slow -crf 16 -profile:v high`, BT.709 tags, 30p.
  - Concat `-c copy`. AAC 320k 48k.
- **Loudness:** mix in float, then `acompressor=threshold=-26dB:ratio=5:attack=5:release=150:makeup=8` and `alimiter`. Measure with loudnorm and apply a static gain, landing at −14.1 LUFS, TP −0.8.
- **Max scale 1.3×:**
  - HPC photo (1600×900) panel height capped at 1170 (1.30×), no Ken Burns zoom.
  - Data cards 900×700 (1.25× of 720p).
  - Swapped the girl-batting still (needed 1.4×) for Sid general coaching 24.6–25.4.
- **4K 16:9 master:** not supported. Only 2 of the 15 shots (Final Andy & Kumar, Sid RR Intro) are 4K; the rest are 1080p or 720p.


## Higgsfield (v6, 25 Nov 2026)
- **Upscale (bytedance/video-upscale, pro, fps 30):** the estimate endpoint returns $0.000, and the connector balance stayed at 10 credits (Ultra) before and after 9 jobs. Upscales are currently free on this account.
- **Results:**
  - 1080p→4K: about 7–12 min.
  - 720p→2K: about 2–3 min.
  - Output keeps the input aspect (1636×920 → 3842×2160; 1080×1350 → 2160×2700).
  - fps 30 does clean 24/25→30 conversion (better than minterpolate, no ghosting seen). Even 4K→4K is worth running for the frame-rate conversion alone.
- **Generation (Kling 3.0 4K/pro text-to-video):** priced at $0.3151/s (4K) and $0.0962/s (1080p). Submitting returns `not_enough_credits`: the API wallet isn't funded and the Ultra plan doesn't cover API generation. Andy must top up API credits before atmosphere plates are possible.
- **Workflow:**
  - Cut upload segments with x264 crf 10 and 0.5s handles. Crop the FrogBox scorebar and watermark before upload (1636×920 at x284).
  - For several shots from one source, concat the segments into one upload and map offsets from the part durations.
  - Script: `hf/hfup.py` (upload), `hf/poll.py` (poll and download).

## Kit rule audit (v6)
- **FrogBox Power League (Andy's clip):** both sides are RRA Performance Squads (North Melbourne v South-East Melbourne), all in the purple RRA playing tops. OK.
- **Cut for other kit:**
  - Zach clip (batter in a white club shirt)
  - Sid RR Intro b-roll 22.0–23.3 (boy in a white/red club shirt)
  - Sid General Coaching 23.0–25.4 (boy in a grey sponsored club shirt)
  - Jinang match-centre clip: girls in blue tops that aren't clearly RRA kit, so not used.
- **RRA-kit replacements:**
  - Sid General Coaching 42.0–45.0 (coach with kids in RRA kit)
  - Sid General Coaching 19.2–21.3 (batter in RRA kit at the RR backdrop)
  - Holiday promo 16.9–18.3 (boy bowling in RRA purple)
  - Holiday promo 20.0–21.1 (batter in RRA purple)


## Mobile-first 9:16 (v7, FEEDBACK 2026-11-25)
- Every shot is full-bleed 1080×1920. No panels, letterbox or blurred pillars. Only the 9:16 master is delivered unless asked.
- Landscape sources: use Higgsfield 4K upscales and crop 1215×2160 (a downscale, so crisp). Track the action with a keyframed crop `x='x0+(x1-x0)*min(t/dur,1)'` (script `v7/extract7.py`).
  - Where players sit too low under the lower-third text, use a tighter crop with a y offset (≤1.3×), e.g. FrogBox behind-keeper 960×1707 at y=453.
- FrogBox 4K action centres (4K px, segments in `hf/v6/up_fb.mp4`):
  - f2 behind keeper: x≈1050 (tight)
  - f1 umpire end: pan x 0→993 (bowler to batter)
  - f5 umpire signal: x≈193
  - f3 shot and run: x 1393→1480
  - e1: x 593→833
- Data cards full-bleed: Fulltrack 2K crop 878×1560 at x=0 (keeps the speed/spin panels); Match Centre 2K crop 810×1440 at x=369 (1.33×, the most upscaled shot).
- **Phone rotation trap:** "Male Player – Mitch Clark – Power Positions.MOV" is stored 3840×2160 with rotation −90. It's portrait, so check `side_data rotation` before framing.
- **Program/age match:**
  - Squads/T20 Elite beats use older Elite players: Drive "Mitch Clark – Power Positions" (Elite batter, RRA navy kit, 4K portrait).
  - "PART 1 v1.3 – Elite Academy.mp4" has baked captions across the lower half; avoid it under our text.
  - Junior beats use 7–12s; the holiday beat uses the holiday promo.


## v8 flagship notes (26 Nov 2026)
- **130 BPM beat grid** (beat 0.4615s): every scene starts on a beat and montage cuts are 1.5 beats (0.69s). Build the HTML timeline in beats (`v8/build8.py`), so cutdowns and music edits fall on bar lines.
- **Energy kit (comp8):**
  - impact zoom on every cut (scale 1.10 → 1.0 in 0.28s)
  - whip-in on section starts (translateX 260px plus 14px blur, 0.16s)
  - type slams
  - white flash only on the big turns
  - one breath only: real slow-mo from a Higgsfield 60fps upscale played at 30fps, slowed further (ramp 0.62)
- **Data beats:** no type over screens. Put the title on its own beat over darkened footage, then clean screens with a slow push-in (a wrapper div scales the screen and the highlight ring together) and a pink pulse ring on the key metric. Hide the logo during data beats.
- **Statement backgrounds = our own footage only** (Andy, 26 Nov): huddles, flags, HPC, Elite training, Power League. Use Higgsfield 4K upscales of our photos and clips, darkened about 45%. No generated plates.
- **Higgsfield API:**
  - The API catalogue (`GET https://api.higgsfield.ai/models`, 105 models) has video and image models only. No audio or music: `elevenlabs_music_v2_5` exists only in the app/MCP catalogue.
  - Kling text-to-video works on the funded API wallet (v3.0 4K $0.3151/s, v3.0 pro $0.0962/s, 2.5 turbo pro about $0.05/s). Upscales are $0.
  - Upscale `fps:60` gives real slow-mo.
- **Elite library (Drive folder 1cADHRrpdNZiSTJY9Bz72wRrtxP2zG5Gb, Panasonic 1080p 25p):**
  - PANA2188 (bowler with ball at his mark)
  - PANA2193 (bowler to batter)
  - PANA2191 (player with ball)
  - PANA2233 (machine batting)
  - PANA2241 (power swing 6.3s)
  - PANA2186 (batter in nets)
  - PANA2185 (keeper, mostly soft)
  - Xavier Mitchell Bowling (run-up 14–15.5s)
  - PANA2333/2334 (player interview to camera)
  - Power folder 1AyzZxuTlUp-tipNNBxX1TVEGeNGYNgGa: Mitch Clark and Mishka Power Positions (4K portrait), velocity bat, weighted ball, IMG_3xxx raw (200MB+)
- **Junior library (folder 1O53eOsruPhYvcs-ZXHT_mc2l9OT8a2S2, iPhone portrait 30p):**
  - IMG_2275 and IMG_2278 (batting at the RR backdrop)
  - "Shan batting against machine"
  - "Junior Royals hitting legside" and "Junior Royals Preparation" (third-party venue "NETZ" signage, avoid)
- **Missing:** a genuine Elite fielding/catching clip and a clean keeping clip.

## Approved / rejected
- 2026 Recap v1: "good start, needs more action videos". v2: liked the data scene and the boys/girls line; wanted better graphics, no tagline footer, no whooshes, more match day, bigger 2027. v3 notes: Kumar first, text lower, no duplicates, crisp only, no player scores, clearest Sid take. v4 delivered 2026-11-25. v5 = v4 edit at max quality (lossless chain), delivered 2026-11-25. v6 = kit-rule swaps plus Higgsfield 4K upscales and a 4K 16:9 master, delivered 2026-11-25, awaiting verdict.

## v9 treatment notes (27 Nov 2026)
- **Type without washes ("tapes"):** footage full and bright, no gradient or darkening. Each headline line sits on its own tight, solid rectangle: Admiral Blue #1226AA with white Montserrat 900; the payoff line on pink #E11F8F. Kicker = small pink pill (800, tracking .16em). Speech captions = white 800 on solid navy #001D48 tape, pink keyword, 66px. Block left at x=56, bottom edge ~y1490 (above the 400px UI zone), only in clear space. Brand arrow (84px gradient chevron) bleeds off bottom-right on statement beats only. Templates: scratchpad v9/sf/sf.html + shot.mjs.
- **Baked captions are a transcript:** Sid's "Part 2 v2 - Elite Academy" and the Testimonials clips carry burnt-in captions, so their words are exact. Our caption tape sits over theirs. Offline ASR (pocketsphinx) is too weak for unknown speech; Whisper/faster-whisper are installed but have no model (HF blocked). Make short "listen_*.mp4" previews with burnt timecode for Andy to confirm by ear.
- **FrogBox signage framing:** a 9:16 crop of 1080p is ~27% of frame width at zoom 1.17 (crop height 920 keeps the scorebar out). The POWERLEAGUE board fits whole if centred on it; frame action and board together or pan from the board to the action. Never leave fragments like "WERLEAGUE".
- **HPC raw (Rane's dump) is 4K 60fps log-flat:** it needs a strong contrast/saturation grade and gives real slow-mo.
- **Higgsfield upscale still $0.000 per estimate (26 Nov).**
- **Catalogue tooling** (scratchpad v9/tools):
  - fetch.sh (curl from Drive, list TSV)
  - sheet.py (proxy + contact sheet)
  - runall.sh
  - mkcsv.py (builds library/assets.csv)
  - grab.py (graded 9:16 stills for storyboards)
  - story.py (storyboard sheets)

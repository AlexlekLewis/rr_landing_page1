# RRAA Landing Page — Complete Media Audit & Section Map

**Date:** 5 March 2026
**Scope:** All media across `/Media/` and `/Master Landing Page/Media/`
**Mapped to:** Unified_Landing_Page_Blueprint_V2.md (11 sections)

---

## MEDIA SOURCE INVENTORY

### Source A: `/Media/` (Existing Landing Page Assets)
Pre-produced, curated media — hero images, IPL player photos, coach portraits, logos, brand kit, and edited videos.

### Source B: `/Master Landing Page/Media/` (NEW — Raw Session Footage)
Raw photography and video from the **1 March 2026 RRAA Melbourne assessment session**. This is the single most valuable media source — it shows the actual program in action at the actual facility with actual participants and coaches.

Contents:
- **2 large raw video files** (MVI_6187-007.MP4 at 3.4GB, MVI_6190-005.MP4 at 27GB) — full-session multi-camera recordings
- **9 Google Drive download batches** (001–011, excluding 005 and 007) containing:
  - **"Photos" folders** — PANA-series JPGs shot against the branded pink HALLA BOL! media wall (player headshots, coach portraits, group shots)
  - **"FLYNN_ march 1 assessment session"** — Siddhartha Lahiri coaching clips (PANA series), individual player assessment videos, edited intro video ("Sid RR Intro V2")
  - **"JAMES_ March 1 assessment session"** — IMG-series player photos, training/assessment video clips (MVI, S-series), individual player assessments
  - **Edited Videos** — "Sid RR Intro V2.mov" and small-size MP4 version (key marketing video)

---

## ASSET CATEGORIES

### CATEGORY 1: LOGOS & BRAND MARKS

| Asset | File | Source | Notes |
|---|---|---|---|
| **RRA Melbourne Logo — Blue on Black** | `RR Academy Brand/Logo_Blue.png` | A | Royal Crest with "MELBOURNE". Blue variant on black background. Use on dark sections. |
| **RRA Melbourne Logo — Pink on White** | `RR Academy Brand/Logo_Pink.png` | A | Pink variant on white background. Use on light sections. |
| **RRA Melbourne Logo — White on Transparent** | `RR Academy Brand/Logo_White_Transparent.png` | A | White variant on grey/transparent. Use on dark/gradient backgrounds (hero, footer). **PRIMARY WEB LOGO.** |
| **RRA Australia Logo — Blue + White** | `RR Academy Brand/Logos/AUSTRALIA.png` | A | Dual variant (blue on white, white on grey). Use where "Australia" sub-brand is needed. |
| **RRA Washington Logo — Blue on White** | `RR Academy Brand/Logos/RRA_Washington_Logos-01.png` | A | Washington variant. NOT for Melbourne landing page — reference only. |
| **RRA Washington Logo — White** | `RR Academy Brand/Logos/RRA_Washington_Logos-02.png` | A | White on white (invisible render). NOT for Melbourne LP. |
| **RRA Melbourne Logo (Australia .ai/.pdf)** | `RR Academy Brand/Logos/AUSTRALIA.ai`, `.pdf` | A | Vector source files. For print/design team only. |
| **RRA Melbourne Logo (Melbourne .ai/.pdf)** | `RR Academy Brand/Logos/MELBOURNE.ai`, `.pdf` | A | Vector source files. For print/design team only. |
| **Basic Logo** | `Basic logo.png` | A | Simple RR crest mark. Use as favicon or small UI element. |

**LOGO DECISION FOR LANDING PAGE:**
- **Hero / Footer / Dark sections →** `Logo_White_Transparent.png` (white on dark/gradient — per brand rules)
- **Trust Bar / Light sections →** `Logo_Pink.png` or `Logo_Blue.png` (pink or blue on white — per brand rules)
- **Location branding →** Use "MELBOURNE" variant (Logo_Blue/Pink/White), NOT the generic Australia logo — this is a Melbourne-specific program
- **Favicon →** `Basic logo.png` cropped to crest only

---

### CATEGORY 2: HERO & FULL-WIDTH IMAGERY

| Asset | File | Dimensions/Size | Subject | Recommended Treatment |
|---|---|---|---|---|
| **Hero_Final.jpeg** | `Media/Hero_Final.jpeg` | Large (~full-width) | Dramatic cricket action shot with brand colour treatment already applied. Players in RR pink/blue kit, deep brand gradient overlay. | **PRIMARY HERO IMAGE.** Already colour-treated. May need slight adjustment to match exact brand gradient (135deg, #001D48→#1226AA→#E11F8F). Add dark overlay for text legibility. |
| **Hero.jpeg** | `Media/Hero.jpeg` | Smaller | Similar hero concept, smaller resolution. | **BACKUP hero.** Use if Hero_Final has quality issues at full-bleed. |
| **Hero_Scroll.mp4** | `Media/Hero_Scroll.mp4` | Video | Scrolling/animated hero background video. | **HERO VIDEO OPTION.** For desktop users on fast connections. Mobile falls back to Hero_Final.jpeg. Must be muted, autoplay, looped, under 5s clip. |

---

### CATEGORY 3: VIDEO ASSETS

| Asset | File | Duration/Size | Subject | Recommended Use |
|---|---|---|---|---|
| **Kumar Sangakkara V2.mp4** | `Media/Kumar Sangakkara V2.mp4` | Edited | Kumar Sangakkara speaking — endorsement/introduction video. | **SECTION 4 (Coaches) or HERO area.** This is the #1 credibility video. Kumar's face and voice selling the program is the highest-value video asset. |
| **Kumar Sangakkara Video.mp4** | `Media/Kumar Sangakkara Video.mp4` | Edited | Earlier version of Kumar's video. | **BACKUP** — use V2 as primary. |
| **Final Andy & Kumar Edit.mov** | `Media/Final Andy & Kumar Edit.mov` | Edited | Combined Andy (Andy Crook? Director) and Kumar Sangakkara edit. | **SECTION 4 (Coaches) — SECONDARY VIDEO.** Shows both Kumar and the Melbourne program director together. Strong trust-building for parents. |
| **Landing Page Full Edit v1.1.mov** | `Media/Landing Page Full Edit v1.1.mov` | Edited | Full landing page promotional video. | **HERO or SECTION 5 (Program).** Broad overview video. Could serve as the main "watch" CTA target. |
| **Sid RR Intro V2.mov** | `Master LP/drive-download.../Edited Videos/` | ~150MB | Siddhartha Lahiri intro/coaching philosophy. | **SECTION 4 (Coaches).** Siddhartha is Head of International Player Development — this video shows the RR global connection and coaching philosophy. Essential for parent trust in the franchise pipeline. |
| **Kumar_Poster_Image.jpg** | `Media/Kumar_Poster_Image.jpg` | Image | Video poster/thumbnail frame of Kumar Sangakkara. | **VIDEO THUMBNAIL** for Kumar Sangakkara V2.mp4. The face that plays before the video starts. |
| **Raw session videos** | `Master LP/Media/` (many) | 100MB–27GB | Full raw assessment session footage — bowling, batting, coaching drills. | **B-ROLL SOURCE.** Not for direct embedding. Use to extract 5–15 second clips for: background video loops, social proof clips, coach methodology demonstrations. Requires professional editing. |

**VIDEO PRIORITY FOR LANDING PAGE:**
1. **Kumar Sangakkara V2.mp4** — embed with poster image in Section 4 or hero
2. **Final Andy & Kumar Edit.mov** — secondary video in Section 4 or a "Learn More" modal
3. **Sid RR Intro V2.mov** — Section 4 coach profile for Siddhartha Lahiri
4. **Hero_Scroll.mp4** — desktop hero background (muted autoplay)
5. **Landing Page Full Edit v1.1.mov** — consider for Section 5 (Program) or as the anchor "Watch" CTA

---

### CATEGORY 4: COACH & STAFF PORTRAITS

> **Updated 5 March 2026** — All identifications confirmed by Alex Lewis (Head Coach).

#### Leadership Team

| Asset | File | Person | Role | Source | Recommended Use |
|---|---|---|---|---|---|
| **Headshot.png** | `Media/Headshot.png` | **Alex Lewis** | Head Coach | Curated | **SECTION 4 — Head Coach card (PRIMARY HEADSHOT).** Professional portrait. Apply B&W or desaturated + pink/blue tone per brand photography rules. |
| **PANA0988.JPG** | `Master LP/.../Photos/` | **Alex Lewis** | Head Coach | Session B (media wall) | **SECTION 4 — ALTERNATE headshot.** Session photo at branded media wall. More casual/authentic than formal headshot. |
| **IMG_6150.JPG** | `Master LP/.../JAMES_ March 1.../` | **Alex Lewis** | Head Coach | Session B (action) | **SECTION 4 or SECTION 5.** Alex coaching players at nets in RR branded blue polo. Strong credibility shot showing coaching in action. Apply brand treatment. |
| **IMG_6155.JPG** | `Master LP/.../JAMES_ March 1.../` | **Alex Lewis** | Head Coach | Session B (action) | **SECTION 4 or SECTION 5.** Alex communicating methodology to players. Best image showing RR branding on coaching apparel clearly. Apply brand treatment. |
| **IMG_6167.JPG** | `Master LP/.../JAMES_ March 1.../` | **Alex Lewis** | Head Coach | Session B (action) | **SECTION 4.** Personal coaching moment with player — parent-reassurance imagery. |
| **PANA1606–1610.JPG** | `Master LP/.../Photos/` | **Alex Lewis** + **Brodie (U11 player)** | Head Coach | Session B (backdrop) | **SECTION 8 (Who This Is For).** Alex with young female player at branded RR Academy Melbourne backdrop. Demonstrates age range + female inclusion. Permission to feature: YES. |
| **Kumar_Poster_Image.jpg** | `Media/Kumar_Poster_Image.jpg` | **Kumar Sangakkara** | Director of Cricket (RR) | Curated | **SECTION 4 — Video poster/thumbnail.** Kumar's face is the CTA. Play button overlay opens `Kumar Sangakkara V2.mp4`. |
| **PANA1008.JPG** | `Master LP/.../Photos/` | **Andy Crook** | Director of Cricket (RRA Melbourne) | Session B (media wall) | **SECTION 4 — Director card.** Pink RR polo at branded media wall. Name badge reads "Andy C." Authentic, in-facility headshot. Apply B&W/desaturated treatment. |
| **IMG_6143.JPG** | `Master LP/.../JAMES_ March 1.../` | **Andy Crook** | Director of Cricket | Session B (action) | **SECTION 4 or SECTION 5.** Andy addressing group of players at facility. Shows leadership in action. Apply desaturated + pink/blue treatment. |
| **Lahiri coaching — Riyan Pirag** | `Media/Lahiri - Riyan Pirag...` | **Siddhartha Lahiri** | Head of International Player Development | Curated | **SECTION 4 — Coach-player interaction.** Siddhartha coaching Riyan Pirag. #1 "personalised coaching" image. Apply desaturated + brand tone treatment. **Note: Siddhartha has no session photos from the March 1 assessment — he was not present. Use this curated image + Sid RR Intro V2 video.** |

#### Coaching Staff

| Asset | File | Person | Role | Bio/Notes | Recommended Use |
|---|---|---|---|---|---|
| **PANA0927.JPG / PANA0928.JPG** | `Master LP/.../Photos/` | **Adelaide Campion** | Program Coach | Inaugural captain of Carlton CC. Premiership with Ringwood CC. Malaysian Super Slam title. Australia Indoor World Cup–winning teams. Current Head Coach of Australian U18 Indoor Cricket Team & Victorian U18 Indoor Cricket Team. Coached Victorian Indigenous Cricket Team. 15+ years in the game. | **SECTION 4 — Coach card (HIGH PRIORITY).** Adelaide's credentials are exceptional and critical for female cricket messaging. Only female coach on the team. |
| **PANA0899.JPG** | `Master LP/.../Photos/` | **Glenn Butterworth** | Program Coach | Played at Collingwood CC as wicket keeper/opening bat. 2x HDCA batting averages. 27 years coaching experience. Level 2 Coaching course at Lord's. Coached in Middlesex, UK and for Middlesex Cricket Board. Multiple DVCA clubs. Currently female pathways coach at Fitzroy Doncaster. | **SECTION 4 — Coach card.** Glenn's Lord's credential and 27-year track record add depth. His female pathways focus complements Adelaide. |
| **PANA0938.JPG / PANA0940.JPG** | `Master LP/.../Photos/` | **Joel Ried** | Program Coach | (Bio TBC) | **SECTION 4 — Coach card.** Dark wavy hair, warm smile. Professional media wall portrait. |
| **PANA0961.JPG / PANA0962.JPG** | `Master LP/.../Photos/` | **Bret Cole** | Talent Scout | (Bio TBC) | **SECTION 4 — Scout/talent identification card.** Bret's role as Talent Scout reinforces the "being seen by the right people" messaging. Grey beard, warm/approachable demeanour — looks experienced and trustworthy. |
| **PANA0975.JPG / PANA0974.JPG** | `Master LP/.../Photos/` | **James Considine** | Social Media | (Bio TBC) | **NOT for Section 4 coaching profiles.** James handles social media, not coaching. Use for: behind-the-scenes content, "meet the team" secondary page, or social media promo assets. |

#### Assistant Coaches

| Asset | File | Person | Role | Bio/Notes | Recommended Use |
|---|---|---|---|---|---|
| **PANA0877.JPG / PANA0881.JPG / PANA0898.JPG** | `Master LP/.../Photos/` | **Zac Macciocca** | Program Assistant Coach | Junior Club: Lower Eltham (DVCA). Fitzroy Doncaster since 2017/18. Dowling Shield Coach for 6–7 years. | **SECTION 4 — Assistant Coach card (optional depending on section depth).** Young, energetic — relatable for youth players. Multiple angles available. |
| **PANA0848.JPG / PANA0849.JPG** | `Master LP/.../Photos/` | **Ikroop Dhanoa** | Program Assistant Coach | (Bio TBC) | **SECTION 4 — Assistant Coach card OR SECTION 7/8.** Ikroop's presence as a young coach of South Asian heritage reinforces programme diversity. |
| **PANA0912.JPG / PANA0913.JPG** | `Master LP/.../Photos/` | **Rittin Raman** | Program Assistant Coach | (Bio TBC) | **SECTION 4 — Assistant Coach card OR SECTION 7/8.** Beaming smile, enthusiastic energy. Good for "coaches who care" messaging. |

---

### CATEGORY 5: PLAYER PORTRAITS (RRAA MELBOURNE — ACTUAL PARTICIPANTS)

> **Updated 5 March 2026** — Note: Several people previously categorised as "players" are actually Assistant Coaches (Ikroop, Rittin, Zac) and have been moved to Category 4. This category now contains confirmed players/participants only.

| Asset | File | Person | Details | Recommended Use |
|---|---|---|---|---|
| **PANA1606–1610.JPG** | `Master LP/.../Photos/` | **Brodie** (U11 female player) | Young girl in full RR Academy kit with Alex Lewis at branded backdrop. **Permission to feature: YES.** | **SECTION 8 (Who This Is For) — #1 PRIORITY PLAYER IMAGE.** Demonstrates: (a) female inclusion, (b) young age group welcome, (c) Head Coach personally engaged with every player. Emotionally powerful for parents. |
| **PANA1012.JPG** | `Master LP/.../Photos/` | Two boys in green/white club cricket kit | Assessment participants in their club gear. Name badges partially visible. | **SECTION 7 or 8.** Shows real kids turning up to be assessed. Authentic and relatable. Check permission before using. |
| **PANA1020.JPG** | `Master LP/.../Photos/` | Young male in white cricket club kit (VDCA) | Assessment participant in club whites. | **SECTION 7 or 8.** Another authentic assessment participant. Check permission before using. |
| **Additional session portraits** | Various PANA series | Unidentified assessment participants | Various youth players photographed at media wall during March 1 session | **POOL** for Section 7, 8 backgrounds. All require permission confirmation before landing page use. |

---

### CATEGORY 6: IPL PLAYER / PROFESSIONAL IMAGERY (CREDIBILITY ASSETS)

| Asset | File | Subject | Recommended Use |
|---|---|---|---|
| **Artboard 1 copy.png** | `RR Academy Brand/Art Board/` | 4 RR IPL players in pink/blue jerseys. Official tagline "FINDING A WAY TO WIN FROM ANYWHERE" with "WIN" in pink. Lion watermark. Dark navy→pink gradient. | **SECTION 2 (Trust Bar) or SECTION 9 (Value Stack).** Shows the IPL franchise connection. The tagline is perfectly rendered per brand rules. |
| **Artboard 1-1.png** | `RR Academy Brand/Art Board/` | Lion rampant in white on pink→navy gradient. "FINDING A WAY TO WIN FROM ANYWHERE" tagline. No players. | **SECTION 3 (Problem Agitation) background or SECTION 9 (Value Stack).** Pure brand identity visual. |
| **Sooryavanshi 100 celebration** | `Media/` | Player with arms raised in celebration (appears to be after scoring 100). | **SECTION 3 or SECTION 9.** Aspirational — "this is what development leads to." Apply desaturated + brand tone treatment. |
| **Kwena Maphaka bowling** | `Media/` | Young fast bowler in explosive delivery stride. RR branded kit. | **SECTION 5 (Program — bowling development) or SECTION 9.** Shows elite bowling development. Apply brand treatment. |
| **LP2/Kwena_Catch.png** | `Media/LP2/` | Kwena Maphaka taking a spectacular catch in RR pink/blue kit. "x2 🔥" text overlay. | **SECTION 7 or SECTION 9.** Dramatic action moment. Already has some brand treatment. |
| **Lhuan dre Pretorius** | `Media/` | Player in batting/action stance. | **SECTION 5 (batting development) or hero candidate.** Apply brand treatment. |
| **Ravindra Jadeja** | `Media/` | IPL star player portrait. | **SECTION 2 (Trust Bar) — logo strip or "IPL connection" visual.** Don't overuse — one IPL face is enough alongside Kumar. |
| **Steven Crook — Power hitting** | `Media/` | Player in mid-swing power hitting pose. | **SECTION 5 (Program — batting) or SECTION 6 (Technology).** Athletic force — matches brand photo style. |
| **Steven Crook — Wicket celebration** | `Media/` | Player celebrating taking a wicket. | **SECTION 3 or SECTION 7.** Emotional triumph moment. |
| **LP2/Jaiswal celebrating 100** | `Media/LP2/` | Yashasvi Jaiswal celebrating century (arms wide, helmet raised). | **SECTION 9 (Pathway — "where this leads").** Ultimate success imagery. |
| **LP2/Power Hitting — Jaiswal** | `Media/LP2/` | Jaiswal in power hitting stance. | **SECTION 5 (Program) or hero area.** Raw power imagery. |
| **LP2/download.jpeg** | `Media/LP2/` | Jaiswal raising bat after milestone in RR pink/blue kit. | **SECTION 9 or SECTION 2.** Another Jaiswal success moment. |

---

### CATEGORY 7: BRAND COLLATERAL & DESIGN ELEMENTS

| Asset | File | Recommended Landing Page Use |
|---|---|---|
| **Standee template** | `RR Academy Brand/Standee Templates/Artboard 1.png` | **DESIGN REFERENCE ONLY.** Shows correct HALLA BOL! placement, lion watermark treatment, gradient direction, and crest positioning. Reference for web team to replicate the visual language. |
| **Feather Flag** | `RR Academy Brand/Feather Flags/FEATHER FLAGS-02.png` | **DESIGN REFERENCE.** Shows correct gradient application on physical media. The diagonal pink stripe + navy→pink gradient is the brand's signature visual rhythm. |
| **Net Branding — HALLA BOL!** | `RR Academy Brand/Net Branding/net branding A26.png` | **SECTION 5 (Program) — facility/environment context.** Could be used as a background texture or overlay to show the HALLA BOL! branding at the actual training facility. |
| **Leaflet template** | `RR Academy Brand/Leaflet/leaflet template.png` | **DESIGN REFERENCE.** Shows lion watermark positioning, gradient treatment, and typography hierarchy. |
| **Stationery mockup** | `RR Academy Brand/Stationary/RRA-Stationary-3-mockup.png` | **SECTION 2 (Trust Bar) or SECTION 9.** The stationery mockup shows business cards, letterhead, envelopes — all with consistent brand identity. Signals professionalism and legitimacy. Can be used as a small "real organisation" credibility element. |
| **Section photo.jpeg** | `Media/` | General cricket section divider photo. Evaluate quality — may serve as a full-width section break image between major sections. |
| **360 Degrees Image** | `Media/` | Facility/panoramic image. **SECTION 5 (Program) or SECTION 8.** Shows the training environment. Apply brand treatment. |
| **ezgif frames (120 files)** | `Media/ezgif-*/` | Extracted video frames. **NOT FOR DIRECT USE.** These are individual frames from a video export. May be useful for selecting the best frame for a static image or creating a CSS animation sequence. |

---

## V2 BLUEPRINT SECTION-BY-SECTION MEDIA MAP

### SECTION 1: HERO
**Purpose:** Immediate emotional impact + IPL credibility + primary CTA

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Full-bleed background** | `Hero_Final.jpeg` | Verify brand gradient overlay (135deg). Add `linear-gradient(180deg, rgba(17,25,33,0) 0%, #111921 100%)` for bottom text legibility | Already treated. Desktop: full image. Mobile: crop to centre subject. |
| **Background video (desktop)** | `Hero_Scroll.mp4` | Muted, autoplay, loop, max 5s. Falls back to Hero_Final.jpeg on mobile/slow connections. | Performance consideration: lazy-load video, eager-load poster. |
| **Logo** | `Logo_White_Transparent.png` | White crest on dark background (brand rule) | Top-left or centred above headline. Min 70px width. |
| **Lion watermark** | Extract from brand assets or use `Artboard 1-1.png` as reference | White at 5-10% opacity behind headline area | Creates depth and brand presence without competing with text. |
| **Video CTA poster** | `Kumar_Poster_Image.jpg` | Minimal treatment — Kumar's face is the CTA | Play button overlay. Opens Kumar Sangakkara V2.mp4 in modal. |

---

### SECTION 2: TRUST BAR
**Purpose:** Instant credibility within 5 seconds

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Logo (on white)** | `Logo_Pink.png` or `Logo_Blue.png` | Pink or Blue crest on white (brand rule) | Small, tasteful. Part of logo strip. |
| **IPL connection visual** | Crop from `Artboard 1 copy.png` (4 IPL players) | Desaturated thumbnails or just the RR jersey crest | Don't dominate — this is a trust strip, not a photo gallery. |
| **Partner/affiliation logos** | NEED: Cricket Australia, Cricket Victoria, Melbourne Stars (if applicable) | Greyscale on white | Currently MISSING — need to source. |
| **Stationery mockup** | `RRA-Stationary-3-mockup.png` | Optional: small version showing "real organisation" | Only if space permits. Lower priority. |

---

### SECTION 3: PROBLEM AGITATION
**Purpose:** Name the pain parents feel about their kid's stalled development

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Background** | `Artboard 1-1.png` (lion + gradient) OR solid `rr-dark` | If using lion, white at 3-5% opacity | This section is copy-heavy. Imagery should be minimal/atmospheric, not distracting. |
| **Contrast image** | `Steven Crook — wicket celebration` or `Sooryavanshi celebration` | Heavy desaturation + brand tone. Used at low opacity as a "what's possible" undercurrent. | Optional — the section can work with pure copy + brand elements. |

---

### SECTION 4: COACHES & ENVIRONMENT
**Purpose:** Trust in people before trust in methodology

> **Updated 5 March 2026** — Full staff identification confirmed. This section now features 9 named team members across 3 tiers.

#### Tier 1: Leadership (Featured prominently with video + full bios)

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Kumar Sangakkara card** | `Kumar_Poster_Image.jpg` (headshot crop) | B&W or desaturated + subtle pink/blue tone | Director of Cricket (RR). Card includes name, role, key credential. Video play button links to `Kumar Sangakkara V2.mp4`. |
| **Kumar video** | `Kumar Sangakkara V2.mp4` | Embed with poster: `Kumar_Poster_Image.jpg` | **#1 priority video.** Modal or inline player. |
| **Alex Lewis card** | `Headshot.png` (formal portrait — PRIMARY) or `PANA0988.JPG` (session media wall) | B&W / desaturated + brand tone | **Head Coach.** 22+ years coaching. Selected by RR to lead Melbourne Elite Program. Use formal headshot for professional authority. |
| **Alex coaching shots** | `IMG_6155.JPG` (best — RR logo clearly visible) or `IMG_6150.JPG` | Desaturated + brand treatment | Alex communicating methodology to players at indoor facility. Shows the Head Coach in action. |
| **Andy Crook card** | `PANA1008.JPG` (session media wall headshot) | B&W / desaturated + brand tone | **Director of Cricket (RRA Melbourne).** Former professional (SA, Northamptonshire, Lancashire). NBL & Super Netball executive. Australia 2025 T20 Masters World Cup. |
| **Andy coaching shot** | `IMG_6143.JPG` (Andy addressing players) | Desaturated + brand treatment | Shows Andy leading a group session at the facility. |
| **Andy & Kumar video** | `Final Andy & Kumar Edit.mov` | Video — secondary embed | For parents who want the full picture of leadership. |
| **Siddhartha Lahiri card** | `Lahiri - Riyan Pirag` photo (coaching interaction — ONLY available image) | Desaturated + pink/blue highlights | **Head of International Player Development.** Global RR scouting network. Note: Siddhartha was not at the March 1 session — use this curated coaching image. |
| **Sid video** | `Sid RR Intro V2.mov` (or `.mp4`) | Embed with poster frame | Siddhartha's coaching philosophy. Essential for parent trust in the RR global connection. |

#### Tier 2: Program Coaches (Featured with headshot + credential summary)

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Adelaide Campion card** | `PANA0927.JPG` or `PANA0928.JPG` | B&W / desaturated + brand tone | **Program Coach. HIGH PRIORITY — feature prominently.** Inaugural Carlton CC captain. Australia Indoor World Cup winner. Head Coach Australian U18 & Victorian U18 Indoor Cricket. 15+ years. **Critical for female cricket credibility.** |
| **Glenn Butterworth card** | `PANA0899.JPG` | B&W / desaturated + brand tone | **Program Coach.** Collingwood CC wicket keeper/opening bat. 2x HDCA batting averages. 27 years coaching. Level 2 at Lord's. Coached in Middlesex, UK. Currently female pathways coach at Fitzroy Doncaster. |
| **Joel Ried card** | `PANA0938.JPG` or `PANA0940.JPG` | B&W / desaturated + brand tone | **Program Coach.** (Bio to be confirmed.) |
| **Bret Cole card** | `PANA0961.JPG` or `PANA0962.JPG` | B&W / desaturated + brand tone | **Talent Scout.** Reinforces the "being seen by the right people" messaging. Experienced, approachable presence. |

#### Tier 3: Assistant Coaches (Shown as team grid or compact cards)

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Zac Macciocca** | `PANA0877.JPG` | Circle crop, light desaturation | **Assistant Coach.** Fitzroy Doncaster. Dowling Shield Coach 6–7 years. |
| **Ikroop Dhanoa** | `PANA0848.JPG` | Circle crop, light desaturation | **Assistant Coach.** |
| **Rittin Raman** | `PANA0912.JPG` | Circle crop, light desaturation | **Assistant Coach.** |

#### Support & Environment

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **James Considine** | `PANA0975.JPG` | — | **Social Media.** Not featured in coaching cards. Use for behind-the-scenes content or "meet the team" secondary page. |
| **Facility shot** | `360 Degrees Image` from Media | Light desaturation + pink/blue accent | Shows the actual training environment (Cutting Edge Cricket, Bundoora). Indoor nets visible in session photos. |

---

### SECTION 5: THE PROGRAM (12-Week Methodology)
**Purpose:** Show what the program actually involves

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Phase imagery — Batting** | `LP2/Power Hitting - Jaiswal` or `Lhuan dre Pretorius` (batting stance) | Desaturated + brand treatment | Associate with batting-focused phase. |
| **Phase imagery — Bowling** | `Kwena Maphaka bowling` | Desaturated + brand treatment | Associate with bowling-focused phase. |
| **Phase imagery — Fielding** | `LP2/Kwena_Catch.png` | Already has some treatment. Verify brand colours. | Associate with fielding/athleticism phase. |
| **Coach in session** | `IMG_6155.JPG` (Alex Lewis coaching at nets) or `IMG_6143.JPG` (Andy Crook addressing players) | Desaturated + brand treatment | Shows the coaching environment — indoor nets, instruction in action. |
| **Net branding** | `RR Academy Brand/Net Branding/net branding A26.png` | Background texture at low opacity | Reinforces that this happens at an RR-branded facility. |
| **Program overview video** | `Landing Page Full Edit v1.1.mov` | Embed with play button | Optional: for parents who want the full video walkthrough. |

---

### SECTION 6: TECHNOLOGY EDGE (DNA Profile)
**Purpose:** Differentiate from every other cricket academy

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **DNA Profile screenshot** | **MISSING — NEEDS CREATION** | Clean, branded mockup | This is the #1 missing asset. Need a UI mockup or screenshot of what the actual DNA Profile report looks like. Use brand colours, Montserrat typography, mock data. |
| **Data visualization** | **MISSING — NEEDS CREATION** | Brand-coloured charts/graphs | Spider chart, progress bars, or performance metrics in `rr-pink` and `rr-blue`. Shows parents what they'll receive. |
| **Technology in action** | Raw session videos (bowling analysis clips) | Extracted still frames | Could show a player mid-delivery with data overlay graphics (needs design). |

---

### SECTION 7: TRANSFORMATION STORIES
**Purpose:** Social proof from real participants/parents

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Participant headshots** | Best of PANA0877, PANA0848, PANA0912 (session media wall portraits) | Minimal treatment — warm, authentic feel. Circle crop. | Real RRAA Melbourne participants. These are the faces parents identify with. |
| **Parent testimonial photos** | **MISSING** | Warm, minimal editing | Need parent headshots or parent+player photos. These don't exist in current media. |
| **Before/after stat graphics** | **NEEDS CREATION** | Brand colours | "Bowling speed: 105 → 118 km/h" type visualizations. Pink/blue gradient fills. |

---

### SECTION 8: WHO THIS IS FOR
**Purpose:** Qualifying section — self-selection and exclusivity

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Age range visual** | `PANA1606.JPG` (Alex Lewis with Brodie, U11 female player, at branded RR Academy Melbourne backdrop) | Warm, minimal treatment | **Permission confirmed.** Shows: youngest age group, female inclusion, Head Coach engaged 1-on-1. Emotionally powerful for parents of younger players and girls. |
| **Coaching team grid** | Adelaide Campion (`PANA0927`), Glenn Butterworth (`PANA0899`), Zac Macciocca (`PANA0877`), Ikroop Dhanoa (`PANA0848`), Rittin Raman (`PANA0912`) | Consistent treatment (light desaturation, circle crop, subtle border) | Shows diversity of coaching team — different ages, backgrounds, genders. Reinforces "who will be coaching my child." |

---

### SECTION 9: VALUE STACK & INVESTMENT
**Purpose:** Price reveal + value anchoring + risk reversal

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Lion watermark** | Extract from brand assets | White at 5-8% opacity behind pricing block | Reinforces "official franchise program" at the moment of purchase decision. |
| **Kit mockup** | **MISSING — NEEDS CREATION** | Clean product photography style (NO desaturation — kit needs accurate colours) | Show the actual RR training kit, cap, and gear included in the program. |
| **IPL pathway visual** | `LP2/Jaiswal celebrating 100` or `Artboard 1 copy.png` (4 IPL players) | Desaturated + brand treatment (Jaiswal) or as-is (Artboard) | "Where this leads" — the dream outcome that justifies the investment. |
| **Gradient accent** | Brand primary gradient | CSS implementation | Used as accent strip or border around the pricing card. |
| **HALLA BOL! element** | Reference `Net Branding/net branding A26.png` for style | White, brush script | Consider as a motivational accent near the CTA. |

---

### SECTION 10: FAQ
**Purpose:** Handle logistics objections

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Minimal imagery** | None required | — | FAQ is text-focused. Brand icons (curved edges, single stroke) for expand/collapse toggles. `rr-pink` or `rr-blue` depending on background. |

---

### SECTION 11: CHECKOUT
**Purpose:** Convert

| Slot | Asset | Treatment | Notes |
|---|---|---|---|
| **Logo** | `Logo_Pink.png` or `Logo_Blue.png` (if light background card) or `Logo_White_Transparent.png` (if dark) | Per brand background rules | Trust reinforcement at point of conversion. |
| **Lion element** | Subtle lion watermark | White at 3-5% opacity | Reinforces legitimacy. |
| **Tagline** | "FINDING A WAY TO WIN FROM ANYWHERE" | Montserrat. "WIN" in `rr-pink` italic. | Closing motivational statement below the form. |
| **Trust badges** | **NEEDS CREATION** | Secure payment, money-back guarantee, "Official RR Program" badge | Small icons in `rr-charcoal` or `rr-blue`. |

---

## CRITICAL MEDIA GAPS — MUST PRODUCE/SOURCE

### Priority 1 — BLOCKING (Cannot launch without these)

| Gap | What's Needed | Recommendation |
|---|---|---|
| **DNA Profile mockup** | Screenshot or UI mockup of the actual performance report players receive | Design a branded mockup using real (anonymised) data. Montserrat font, `rr-pink`/`rr-blue` chart colours, `rr-dark` background. This is the single biggest technology differentiator — it MUST be visualised. |
| **Kit/gear photos** | Product photography of the actual RR training kit, cap, bag included in the program | Photograph the actual kit on a clean surface or flat-lay. NO desaturation — product photos need accurate colour representation. |
| **Parent testimonial quotes/photos** | Written testimonials from parents of current participants + optional headshot | Collect from the 30-40 paid applicants. Even text-only testimonials with first name + suburb are high-value. Photos are bonus. |

### Priority 2 — HIGH VALUE (Significant conversion impact)

| Gap | What's Needed | Recommendation |
|---|---|---|
| **Partner/affiliation logos** | Cricket Australia, Cricket Victoria, any Melbourne cricket associations | Source official logo files for a greyscale trust strip in Section 2. |
| **Before/after stat visualizations** | Real performance data showing player improvement | Work with coaching team to anonymise real assessment data. Design branded graphics. |
| **Facility exterior/entrance photo** | The actual Bundoora (?) training centre — outside view | Parents need to know where they're taking their child. One clean exterior photo. |
| **Group training photo** | Multiple players training together at the Melbourne facility | The session photos show mostly individuals and coaches. Need a wider shot showing the group dynamic — community/belonging feel. |
| **Trust/security badges** | Secure payment icon, guarantee badge, "Official Program" stamp | Design in brand icon style (curved edges, single strokes, `rr-pink` or `rr-blue`). |

### Priority 3 — NICE TO HAVE (Polish and depth)

| Gap | What's Needed | Recommendation |
|---|---|---|
| **Player development journey infographic** | Visual timeline: Assessment → 12 weeks → Pathway | Design using arrow assets per brand guidelines. Max 3 arrows per section. |
| **Mobile app/dashboard screenshot** | If a parent portal or player app exists | Screenshot with brand treatment. |
| **Certificate/graduation image** | Completion ceremony or certificate presentation | Would strengthen Section 9 (Value Stack — what you receive). |
| **Video testimonials** | 30-60 second clips from parents or players | Highest-converting social proof format. Could extract from session footage if any participant interviews were recorded. |

---

## RAW SESSION FOOTAGE — EDITORIAL RECOMMENDATIONS

The `/Master Landing Page/Media/` folder contains a massive amount of raw footage from the March 1 assessment session. Here's how to extract maximum value:

### Photo Selects (From ~80+ PANA-series and IMG-series JPGs)

**Media Wall Portraits (PANA series):** These are shot against the branded pink HALLA BOL! media wall — already brand-consistent backgrounds. All staff now identified:
- **Leadership:** Alex Lewis (PANA0988), Andy Crook (PANA1008)
- **Coaches:** Adelaide Campion (PANA0927/0928), Glenn Butterworth (PANA0899), Joel Ried (PANA0938/0940), Bret Cole (PANA0961/0962)
- **Assistant Coaches:** Zac Macciocca (PANA0877/0881/0898), Ikroop Dhanoa (PANA0848/0849), Rittin Raman (PANA0912/0913)
- **Support:** James Considine (PANA0975 — Social Media, not coaching)
- **Players:** Brodie (PANA1606–1610, permission confirmed), plus unidentified assessment participants

**Session Action Photos (IMG series):** These show actual coaching in progress at the indoor facility. Select:
- 2–3 coach-to-player instruction moments (best: IMG_6143, IMG_6155)
- 1–2 wide facility shots showing the environment
- 1 photo showing the branded media wall/backdrop in context

### Video Edits (From raw MP4s)

**Coaching Clips:** Multiple PANA-series clips of coaches working with individual players (batting, bowling). Extract:
- 3–5 second clips for looping background sections
- Best moments for a "coaching methodology in action" montage
- Note: Siddhartha Lahiri was NOT at the March 1 session — coaching clips feature Alex Lewis, Andy Crook, and the coaching team

**Individual Player Assessment Clips:** Named files like "James Crook batting.mp4", "Tom Webb.mp4", "Jake Fredericksen.mp4", "Cooper Lewin_.mp4" — these show real assessment sessions. Extract:
- Short clips (with permission) for social proof / program demonstration
- Skill analysis moments for Section 6 (Technology Edge)

**Edited Intro Video:** `Sid RR Intro V2.mov` is already edited and ready to embed.

---

## BRAND TREATMENT WORKFLOW

For all photography used on the landing page, apply this consistent pipeline:

1. **Base adjustment:** Desaturate 30-50% from original
2. **Add texture:** Subtle grain/film texture overlay
3. **Colour grade:** Push highlights toward `rr-pink` (#E11F8F) and shadows toward `rr-blue` (#1226AA)
4. **Brand overlay (if needed):** Apply official gradient at 10-20% opacity
5. **Dark overlay (for text sections):** `linear-gradient(180deg, rgba(17,25,33,0) 0%, #111921 100%)`

**Exceptions:**
- Kit/product photos → No desaturation, accurate colours
- Testimonial photos → Minimal treatment, warm and authentic
- Logo/crest → NEVER alter colours or apply effects

---

## SUMMARY: ASSET READINESS SCORECARD

> **Updated 5 March 2026** — Reflects confirmed staff identifications and corrected asset assignments.

| Section | Images Ready | Video Ready | Gaps |
|---|---|---|---|
| S1: Hero | ✅ Hero_Final.jpeg, Hero_Scroll.mp4 | ✅ Kumar poster | — |
| S2: Trust Bar | ⚠️ Logo yes, IPL crop yes | — | ❌ Partner logos |
| S3: Problem Agitation | ✅ Can use brand elements | — | — |
| S4: Coaches | ✅✅ **EXCELLENT** — 9 named staff with headshots, 4 with bios, 3 action photos, facility shot | ✅ Kumar V2, Sid Intro, Andy+Kumar | ⚠️ Bios needed for Joel Ried, Ikroop Dhanoa, Rittin Raman |
| S5: Program | ✅ IPL action + Alex/Andy coaching shots | ⚠️ LP Full Edit available | — |
| S6: Technology | ❌ Nothing visualises the DNA Profile | — | ❌❌ DNA Profile mockup (CRITICAL) |
| S7: Transformation | ⚠️ Limited — few confirmed player photos with permission | — | ❌ Parent testimonials, ❌ Player permission for most photos |
| S8: Who This Is For | ✅✅ **STRONG** — Alex + Brodie (permission confirmed), coaching team diversity grid | — | — |
| S9: Value Stack | ⚠️ IPL imagery available | — | ❌ Kit photos, ❌ Trust badges |
| S10: FAQ | ✅ Text-only (icons needed) | — | — |
| S11: Checkout | ✅ Logo + brand elements | — | ❌ Trust badges |

**Overall readiness: ~75%** — Section 4 is now the strongest section (9 named staff, rich media). Section 8 significantly strengthened with Brodie permission + coaching diversity. Section 6 remains the critical blocker. Section 7 needs player permissions.

### COACHING TEAM SUMMARY (For Landing Page Copy)

| Name | Role | Tier | Headshot File | Key Credential |
|---|---|---|---|---|
| Kumar Sangakkara | Director of Cricket (RR) | Leadership | `Kumar_Poster_Image.jpg` | Sri Lanka & IPL legend |
| Alex Lewis | Head Coach | Leadership | `Headshot.png` / `PANA0988.JPG` | 22+ years coaching, selected by RR |
| Andy Crook | Director of Cricket (RRA Melbourne) | Leadership | `PANA1008.JPG` | Former professional cricketer, Australia 2025 T20 Masters World Cup |
| Siddhartha Lahiri | Head of Intl Player Development | Leadership | `Lahiri - Riyan Pirag` photo | Global RR scouting network, RR/Paarl/Barbados Royals |
| Adelaide Campion | Program Coach | Coach | `PANA0927.JPG` | Inaugural Carlton CC captain, Australia Indoor World Cup, Head Coach Aus U18 Indoor |
| Glenn Butterworth | Program Coach | Coach | `PANA0899.JPG` | 27 years coaching, Level 2 at Lord's, female pathways Fitzroy Doncaster |
| Joel Ried | Program Coach | Coach | `PANA0938.JPG` | (Bio TBC) |
| Bret Cole | Talent Scout | Coach | `PANA0961.JPG` | (Bio TBC) |
| Zac Macciocca | Assistant Coach | Assistant | `PANA0877.JPG` | Fitzroy Doncaster, Dowling Shield Coach |
| Ikroop Dhanoa | Assistant Coach | Assistant | `PANA0848.JPG` | (Bio TBC) |
| Rittin Raman | Assistant Coach | Assistant | `PANA0912.JPG` | (Bio TBC) |
| James Considine | Social Media | Support | `PANA0975.JPG` | Not for coaching section |

---
name: rra-design-studio
description: Organic content design studio and brand gate for Rajasthan Royals Academy (Melbourne and Australia). Not for paid ad campaigns (a separate paid-ads agent does those). Use for ANY organic visual or outbound creative - social posts, stories, reels/video, flyers, posters, job ads, web tiles and banners, email headers, event signage, certificates - and for checking someone else's design before it is posted, sent or put on the website. Trigger on "make a post", "design a flyer", "social tile", "job ad", "story", "reel", "banner", "graphic for", "is this on brand", "brand check", "can we post this", or when Andy shares a design he likes as a reference. Game-day team sheets use the royals-game-day-creatives skill, and still pass the gate here.
---

# RRA Design Studio

Andy (owner) wants every creative to look like it came from one studio: clean, bold, on brand.
Nothing goes on the website, socials, email or print until it passes **The Gate** (section 7).
Speak to Andy plainly; he isn't a designer or developer.

Sources, in order of authority:
1. Royals brand team rulings (Khyati Shah, khyati.shah@rajasthanroyals.com; Srnjayi Jain)
2. `RR-MASTER BRAND GUIDELINES (1).pdf` (95 pp, repo root) and RRA 26 Design Guidelines
   (Google Drive id 1oCaboeXeRKIBvlCX0sM0DR2ED2hfVj2a)
3. `Branding Guidlines/BRAND_GUIDE.md` and `BRAND_GUIDE.md` (summaries of the above)
4. Andy's house style (this file). It refines the guidelines; it never breaks them.

Photos, footage, results packs and testimonials live in the Content Google Drive. Folder IDs
and the rules for using them: `drive-map.md` (next to this file). Read it before looking for media.

## 1. House style: "the Game Day look" (Andy's reference, Nov 2026)

The approved reference is the Game Day cover + Junior Game team sheet (Sun 15 Nov 2026).
What makes it work, and what every new design copies:

Andy, 17 Nov 2026: *"I love the justification of the key headline to the left ... I like the line
and the proportions."* He wants promos, job ads, alerts and results to look like this. So:
**MASTER REFERENCE: `brand/reference/MASTER-game-day-cover.png`** ("This is the style I like").
Open it and compare side by side before sending anything. Measured on the 1080x1350 frame:
- Logo top-left x64 y64, ~96px wide. Chips top-right, right edge x1016, top y64, 12px apart.
- **Headline**: Montserrat 900, **245px**, line-height 0.88, tracking -0.02em, left x64.
  Line 1 cap top y301, line 2 cap top y517. The longest word ends by about **x900**
  (GAME ends at x805), so the lion keeps its space on the right. Long words: shrink to fit
  that, never past it.
- **Statement block** (the "NORTH MELBOURNE vs SOUTH-EAST MELBOURNE" slot) from y745: white 800
  ~40px uppercase lines, with a small pink 26px connector line between them.
- **Cards** from y975: two across, 464x220 each, 24px gap, radius 14. Blue eyebrow 18px,
  navy 900 title 36px, grey 20px line, navy chip (800, 23px). Four items: 2x2 from y755.
- Lion: line-art lion, height 1080, right -110px, top 120px, opacity 0.6 on this PNG.
- Footer: navy bar 100px at y1250.
- **Headline left-aligned at the 64px margin**, never centred. Two words stacked.
- **Proportions**: top band (logo left, chips right) ~ 20%; headline ~ 25%; content ~ 45%;
  footer bar 100px. Everything hangs off the same left line: logo, headline, subline, cards.
- **Subline** in Montserrat 800 uppercase, ~30px, directly under the headline.
- **One idea per frame.** One huge headline, one supporting line, the facts in cards. No clutter.
- **Two-word headline, two colours.** First word white, second word pink, Montserrat 900,
  tight leading (0.9), uppercase. GAME / DAY, JUNIOR / GAME, NOW / HIRING, TERM 1 / OPEN.
- **Brand gradient background**: `linear-gradient(165deg, #001D48 0%, #E11F8F 100%)`.
- **White line-art lion** bleeding off the right edge, large (~80% frame height), opacity 0.35-0.45.
  File: `brand/logos/lion-rampant-white.png` (line-art lion with horn). It is already faint: use opacity ~0.6.
- **White logo top-left**, generous clear space.
- **Chips** for date / format / time: solid pink, solid Admiral Blue `#1226AA` or navy, white
  Montserrat 800 uppercase, letter-spacing 0.06em, square-ish corners (4px).
- **Fact cards**: white cards (radius 12-16px) with blue eyebrow label, navy 900 title, grey
  sub-line, navy chip for the time. On team sheets: translucent navy panels instead (no white).
- **Navy footer bar**: **HALLA BOL!** on the left (900, 38px) and RRAMELBOURNE.COM on the right
  (800, 22px). Andy, 18 Nov 2026: never use "Finding a way to win from anywhere"; Halla Bol is better.
- **Margins**: 64px safe area on 1080-wide frames. Nothing important within 64px of an edge.
  Stories: keep 250px top and bottom clear of text (Instagram UI covers it).

## 2. Brand tokens

| Token | Hex | Use |
|---|---|---|
| RR Pink | `#E11F8F` | Accent word, chips, numbers, underlines, CTA buttons |
| Admiral / RR Blue | `#1226AA` | Secondary chips, eyebrow labels |
| Deep Navy | `#001D48` | Gradient start, footer bar, card titles, panels |
| Light Pink | `#E96BB0` | Hover/secondary only |
| Logo Blue | `#0075C9` | Only inside the supplied blue logo file. Never recolour, never use as a UI colour |
| White | `#FFFFFF` | Headlines, logo on dark, cards |

Font: **Montserrat only** (500-900; 900 italic for WIN). Local files: `Branding Guidlines/Montserrat.zip`
or `npm pack @fontsource/montserrat`. PowerPoints use Verdana (master guide rule).
Romagna/Romagna Exo is the IPL franchise display face: we don't have a licence, so don't fake it.

## 3. Logos (`brand/logos/`)

| File | Use on |
|---|---|
| `rra-melbourne-white.svg/.png` | Gradient, navy, photos (DEFAULT for social) |
| `rra-melbourne-blue.svg/.png` | White or very light backgrounds only |
| `rra-melbourne-pink.png` | White backgrounds only (merch, print on white) |
| `rra-australia-white.svg/.png` / `-blue` | National comms, job ads for the national body, tours |
| `lion-rampant-white.png` | Brand element, not a logo |

Rules (master guide): white on gradient or black, pink or blue on white. Never recolour,
stretch, rotate, outline, add shadow/glow, crop, or put it in a box/badge shape. Clear space =
width of the "R" in ROYALS on every side. Minimum 70px wide on screen, 25mm in print.
Use Melbourne for anything run by the Melbourne academy; Australia for national.

## 4. Formats

| Output | Size (px) | Notes |
|---|---|---|
| Instagram/Facebook feed | 1080 x 1350 | Default for every post |
| Square (LinkedIn, FB event) | 1080 x 1080 | |
| Story / Reel / TikTok | 1080 x 1920 | 250px top/bottom text-free |
| LinkedIn job ad / link image | 1200 x 627 | |
| Web hero tile | 1920 x 800 (+ 1080 x 1350 phone crop) | Check against the live site |
| Web card tile | 1200 x 900 | |
| Email header | 1200 x 400 | |
| A4 flyer | 2480 x 3508 (300dpi) + PDF with 3mm bleed | QR code bottom-right, URL under it |
| Video | 1080 x 1920 and 1080 x 1350, 30fps, 6-20s | Captions burned in, logo end card 1.5s |

## 5. Recipes

- **Program / term promo**: headline pair (TERM 1 / OPEN), one line of who/when/where,
  2-3 fact cards (Ages, Venue, Starts), pink CTA chip "BOOK AT RRAMELBOURNE.COM", footer.
  Price only if the page shows it. Link to the real page (check it exists).
- **Event / open day / camp**: date chip + format chip top-right, headline pair, venue card(s), CTA.
- **Job ad**: NOW / HIRING, role title in white 800, 3 bullets max (what you'll do / who you are /
  where), "Apply: rramelbourne.com/careers" chip. Australia logo if it's a national role. No salary
  unless Andy gives it. Include "Working With Children Check required" for any coaching role.
- **Weekend results**: template `brand/templates/weekly-results/` (see 5d) (TOP / KNOCKS batting feed,
  TOP / SPELLS bowling feed, WEEKEND / WRAP story). White cards: blue eyebrow (club team · day),
  navy name, big pink figure right-aligned with the unit under it, navy "IN PROGRESS" tag for
  unfinished matches. Run the commands in 5d.
- **Player spotlight (photo)**: photo full-bleed, desaturated with pink-blue duotone
  (master guide photo rule), gradient fading up from the bottom, name in 900, stat in pink.
- **Web tile**: same type system, no footer bar, larger safe area for responsive crops; hand to
  the dev team with the `dev-handoff` skill.
- **Video (reels, story, ad)**: build with Remotion (`remotion-assets/`). Motion: headline words
  slide up 12px + fade, 300ms, 80ms stagger; lion drifts 20px over the clip; chips pop (scale
  0.9->1). Cuts on the beat. Burned-in captions in Montserrat 800 white with navy box.
  End card = gradient + white logo + URL. Licensed music only.

## 5a. Copy rules: Andy's corrections (19 Nov 2026). Read before writing any words.

- We are **the Royals Academy** (Rajasthan Royals Academy Melbourne). Never "join the Royals
  Group", and never list franchises or leagues (IPL · SA20 · CPL, Paarl/Barbados Royals) unless
  Andy asks for it.
- **Use Andy's words and lists exactly**, in his order. When he gives options ("short and
  long-term opportunities"), that's guidance for what to include, not a heading to print. Don't
  add labels, groupings or sections he didn't write.
- Program names, in this order (Andy, 20 Nov): **Elite T20 Program, Performance Squads, Power League
  match days, Private coaching, Spin Club and specialist coaching, Junior Royals** ("private coaching", never "1:1").
- Lists look designed, not like bullet points: no white box; numbered rows on the gradient
  (pink 01-06, white 800 names, faint white dividers), like the team sheets. Template:
  `brand/templates/coach-with-us/story.html`.
  Don't split one program into variants (no "holiday programs" + "term coaching").
- Coaching roles: **no full-time roles, no "Cadet" roles.** Paid casual and part-time only.
- No filler or slogan lines ("across our clubs", "proud of every player", "finding a way to
  win"). No blue label chips. Facts only. If a line isn't something Andy said or a fact on the
  website, leave it out.
- Story proportions: logo 130px wide at y242, clear gap (~80px) under it, headline as large as
  fits the safe width (x64 to x956), supporting text a size smaller than on the feed.

## 5b. Organic first (paid ads belong to the separate paid-ads agent)

This studio makes **organic** content: posts, carousels, stories, reels, community and club
updates. Don't build ad sets, targeting or ad copy variants; if asked, hand off to the paid-ads agent.
The paid-ads agent's creatives still pass The Gate (§7).

Organic content pillars (rotate so the feed isn't all promo; aim for no more than 1 in 4 posts selling):
1. **Game day and results**: covers, team sheets, scorecards, player of the match.
2. **Inside the Academy**: training clips, drills, coach tips ("one fix for your cover drive").
3. **Our people**: player and coach spotlights, milestones, families, volunteers.
4. **Royals connection**: Rajasthan Royals news, pathway stories, India tour moments.
5. **What's on**: terms, holiday programs, camps, open days (the selling 1 in 4).

Organic formats and how they should look:
- **Carousel (1080 x 1350, 3-8 slides)**: slide 1 = Game Day-style headline pair that makes
  people swipe; middle slides one point each, same grid; last slide = logo + one CTA.
- **Reel (1080 x 1920, 7-20s)**: real footage first, hook in the first second as on-screen text,
  burned-in captions, brand end card. Phone footage is fine; graded with the pink-blue treatment.
- **Story**: one fact per frame, use stickers (poll, countdown, link) inside the safe area.
- **Captions**: first line is the hook, then 2-4 short lines, then CTA if any, then hashtags
  `#RoyalsAcademyMelbourne #RajasthanRoyals #HallaBol` (+ up to 3 relevant). Tag clubs and venues.

## 5c. Restyling the team's work (Alex and others)

Andy, 17 Nov 2026: anything Alex or others put in the Drive does not yet meet the standard.
Treat their files as **source material, not finished creative**. For each one:
1. Take the facts (names, scores, dates, venues, captions, holds) from their files and notes.
2. Rebuild it in the house style (section 1), using a template where one exists.
3. Run The Gate on the rebuilt version.
4. Save to a new folder next to theirs: `<YYYY-MM-DD> · <topic> · RRA STANDARD`, with the PNGs
   and a `CAPTIONS + BRAND CHECK.txt`. Never overwrite or delete their originals.
5. Tell Andy what changed and anything that still needs checking.

## 5d. FINAL VERSIONS, naming and tagging (Andy, 18 Nov 2026)

Every finished piece goes to Drive **Content / FINAL VERSIONS** (`1WCP9pPd74Gv_mLcnNJcyjaAdKYO-1t-R`)
and gets a row in **00 POSTING LOG** (Google Sheet there). Team rules: Doc
**00 HOW WE NAME AND TAG EVERYTHING** in the same folder.

- Folders: `FINAL VERSIONS / YYYY-MM MONTH / YYYY-MM-DD · PILLAR · Topic / AUDIENCE /`
- Files: `POSTDATE_PILLAR_AUDIENCE_NN-piece_FORMAT.png` (+ `_v2` for corrections; never overwrite)
  - PILLAR: RESULTS, GAMEDAY, PROGRAM, PEOPLE, ROYALS, CAREERS, ALERT
  - AUDIENCE: ALL-ACADEMY (public socials) or the squad/centre (ELITE-MELBOURNE, POWER-HALLAM...)
  - FORMAT: `FEED-4x5` (1080x1350, Instagram + Facebook feed) and `VERT-9x16` (1080x1920,
    IG Story, Reel cover, TikTok). **Every piece is made in both.**
- Each audience folder gets `POSTDATE_PILLAR_AUDIENCE_CAPTIONS.txt`.
- Vertical safe zones (Instagram + TikTok): nothing important above y250, below y1480, or right
  of x956 (TikTok buttons).
- Never change the team's originals: replicate them in our style; ours go in FINAL VERSIONS.

Weekly results from Alex's packs: `brand/templates/weekly-results/`
```
python3 build_pieces.py <unzipped packs dir> <post date> > pieces.json
node render.cjs pieces.json <outdir>      # every piece in FEED-4x5 + VERT-9x16, with layout checks
python3 captions.py pieces.json <outdir>  # captions per audience
```
Name the unzipped pack folders as in `PACKS` in build_pieces.py (03-feed, elite-melbourne, ...).

## 5e. Scope and vibrancy (Andy, 24 Nov 2026)

- **This studio makes photos and still creatives only.** No video or reels unless Andy asks again.
- **Match the vibrancy of the home page (rramelbourne.com).** Use the site's three-stop gradient
  `linear-gradient(150deg,#001D48 0%,#1226AA 42%,#E11F8F 100%)` (Admiral Blue in the middle), not
  the two-stop navy-to-pink, which goes muddy purple.
- **Photos stay in full colour** with a little punch (`saturate(1.3) contrast(1.1)`), fading
  into the gradient at the edges. No desaturating or pink tinting.
- This replaces the earlier gradient in section 1 and the "desaturated duotone" photo treatment.

## 5f. Royals player images, backgrounds and generated imagery (Andy, 26 Nov 2026)

- **Rajasthan Royals player images** (Drive: ROYALS PLAYER IMAGES / 2026: Jadeja, Parag, Jurel,
  Sooryavanshi; studio shots on plain grey) **may be used three players at a time. Never one
  player alone, never two.** Cut-outs: `rembg` (isnet-general-use). Download big Drive files with
  `https://drive.google.com/uc?export=download&id=<id>` (the connector stops at 10MB).
- **Brand-correct background** (RRA 26 guide, backdrop/banner/standee templates): the brand
  gradient with the large lion (white stroke, white, or pink) and players cut out in front. This is
  the default. Template: `brand/templates/launch-2027/trio.html` (no `bg`).
- **Generated backgrounds** (Higgsfield API, `api.higgsfield.ai`, key saved on the environment;
  model `higgsfield-ai/soul/v2/standard`, check `/estimate/...` first): atmosphere only (lights,
  haze, crowd blur, ball, confetti), always under the brand gradient. **Never generate people,
  logos or kit.** They are an option to show Andy, not the default: the Royals' guide has no
  photographic backgrounds.
- **Any cricket ball shown must be white with a black stitched seam** (Andy, 26 Nov 2026: we play T20). Never a pink or red ball,
  in photos, generated backgrounds or icons.
- The players' shirts carry Royals sponsor logos (Waaree Solar, Oaksmith, Red Bull, Goel TMT).
  Never retouch them out. Raise it with Andy for paid ads.
- The guide's official extras: brush-script "HALLA BOL!" lockup and the lion in three variants.

## 6. Build and render

Build each frame as static HTML at exact pixel size, local images and embedded Montserrat,
then screenshot with Playwright (`deviceScaleFactor: 1` at final size, or 2 for print). Look at
every PNG yourself before sending. Send files named `<n>-<Thing>-<Format>.png`.
When Andy shares a design he likes: list what makes it work, add it to section 1 if it's a
new pattern, and ask before it overrides an existing rule.

Copy: Australian English, plain words (multilingual families), no jargon, no exclamation
marks except HALLA BOL!. Names spelled exactly as given. Dates as "Sunday 15 November".
Never put children's surnames + school + photo together. Only use photos of players with
photo consent (`accept_social_media` = true).

## 7. The Gate (run on EVERY creative before it is posted, sent or put live)

Check the final rendered file, not the source. Report a table: item, PASS/FAIL, fix.

1. **Logo**: correct entity (Melbourne vs Australia), supplied file, correct colour for the
   background, not recoloured/stretched/boxed, clear space, >= 70px wide.
2. **Colour**: only tokens from section 2. No off-brand blues, greens, golds, black bars.
3. **Type**: Montserrat only. No outlined/hollow text, no drop shadows, no more than 3 weights.
4. **Hierarchy**: one headline, readable at phone size (headline >= 90px on 1080 frames,
   body >= 28px). Nothing in the safe-area margins.
5. **Brand elements**: gradient + lion or approved photo treatment; HALLA BOL! footer (never
   "Finding a way to win from anywhere").
6. **Facts**: dates, days, times, venues, prices and URLs match the website/booking page.
   Day matches date. Links resolve. No arrival/warm-up times on game-day posts.
7. **People**: names spelled right, photo consent held, no child identifiable with school.
8. **Copy**: plain English, Australian spelling, no typos, CTA present when there's something to book.
9. **Format**: right size for the channel, file under 8MB (image) / 100MB (video).
10. **Approval**: anything using the Rajasthan Royals name for a new campaign, paid ad, partner
    or press goes to Khyati Shah / Srnjayi Jain at the Royals before it goes out.

Any FAIL = don't post. Fix it, re-render, re-run the Gate. If someone else (Alex or the team)
sends a design for checking, run the Gate on it and send back the table plus a corrected
version where you can.

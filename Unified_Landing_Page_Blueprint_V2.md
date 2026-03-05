# Unified Landing Page Blueprint V2 — Revised Master Plan

**Document Version:** 2.0
**Status:** Expert-Reviewed Revision
**Original:** Unified_Landing_Page_Blueprint.pdf (V1 — 8 sections)
**Revised:** 11 sections, restructured for parent-buyer psychology, inline objection handling, and mobile-first delivery

---

## What Changed From V1 and Why

| V1 Structure | V2 Structure | Reason for Change |
|---|---|---|
| 1. Hero | 1. Hero (rewritten for parent buyer) | Headline spoke to player, not the cheque-writer |
| — | 2. Trust Bar (NEW) | Credibility must be established within 5 seconds |
| — | 3. Problem Agitation (NEW) | V1 sold the solution before naming the pain |
| 2. Dream & Pathway | 9. The Pathway Forward (moved later) | Aspirational content only works after trust is earned |
| 5. Coaches & Environment | 4. Coaches & Environment (moved up) | Parents buy trust in people before trust in methodology |
| 3. Methodology | 5. The Program (revised) | Phase names were jargon; rewritten for parent comprehension |
| 4. Technology / DNA Profile | 6. Technology Edge (revised) | "30+ data points" was unsubstantiated; now specific |
| — | 7. Transformation Stories (NEW) | V1 had no dedicated social proof section |
| — | 8. Who This Is For (NEW) | Qualifying section creates exclusivity and self-selection |
| 6. Value Stack & Investment | 9. Value Stack & Investment (revised) | Added risk reversal, value anchoring, deadline mechanism |
| 7. FAQ | 10. FAQ (reduced scope) | Top objections now handled inline; FAQ handles logistics only |
| 8. Checkout | 11. Checkout (revised) | Reduced from 3 steps to 2; email capture first for abandonment recovery |

---

## Brand Architecture — Official Rajasthan Royals Compliance

**This is the foundation of the entire landing page. Every design decision, colour choice, font selection, and visual element must trace back to the official RR Master Brand Guidelines. No approximations, no "close enough." The brand system is law.**

> **Source of truth:** RR-MASTER BRAND GUIDELINES (1).pdf + BRAND_GUIDE.md + BRAND_PROMPT.md
> **Design approval required from:** Khyati Shah (Khyati.Shah@rajasthanroyals.com) and Srnjayi Jain (srnjayi.jain@rajasthanroyals.com)

---

### Brand Narrative & Values (Governs Tone of All Copy)

The Rajasthan Royals brand narrative underpins the tone and voice of every piece of copy on this landing page. Copy should never feel like a generic sports academy — it should feel like a franchise communication.

- **Narrative:** "Royalty is earned through courage, undying spirit, respect, and willingness to go above and beyond."
- **Core Values that must inform landing page tone:**
  - **Always Fan-First** — the parent and player are the centre of every message
  - **Exhibit Resilience** — the program develops mental toughness, not just skills
  - **Stay Curious** — the methodology challenges conventional coaching
  - **Data-Driven Mindset** — the DNA Profile is a brand-native concept, not an add-on
  - **Display Integrity** — transparency in pricing, claims, and program promises

**Copy voice rule:** The landing page should read as the Rajasthan Royals speaking to Melbourne families — authoritative, premium, direct, but warm. Not hype. Not "sales-y." The brand is confident enough that it doesn't need to shout.

---

### Colour Palette — Exact Specifications

**CRITICAL: Use exact HEX values. No approximations. No Tailwind defaults. These are the official brand colours.**

#### Primary Palette

| Token | Name | HEX | RGB | Pantone | Usage |
|---|---|---|---|---|---|
| `rr-pink` | RR Pink | `#E11F8F` | 229, 6, 149 | Rhodamine Red C | Primary accent, CTAs on dark backgrounds, highlights, icons |
| `rr-blue` | RR Blue | `#1226AA` | 18, 38, 170 | 2736 C | Secondary accent, trust elements, crest colour on white |
| `rr-navy` | Dark Navy | `#001D48` | 0, 29, 72 | — | **GRADIENTS ONLY — never as a flat background colour** |
| `rr-dark` | Brand Black | `#111921` | 17, 25, 33 | Black 6 C | Flat dark backgrounds, body text on light sections |

#### Secondary Palette

| Token | Name | HEX | RGB | Pantone | Usage |
|---|---|---|---|---|---|
| `rr-light-pink` | Light Pink | `#E96BB0` | 233, 107, 176 | 218 C | Hover states, secondary highlights, softer accents |
| `rr-medium-blue` | Medium Blue | `#0075C9` | 0, 117, 201 | 3005 C | Links, secondary UI elements, informational accents |
| `rr-charcoal` | Dark Charcoal | `#323E48` | 50, 62, 72 | 432 C | Subdued text, captions, secondary body text on light backgrounds |

#### Neutral Palette (Supplementary — for page layout)

| Token | HEX | Usage |
|---|---|---|
| `white` | `#FFFFFF` | Light section backgrounds, text on dark backgrounds |
| `slate-50` | `#F8FAFC` | Alternate light section backgrounds (subtle contrast from white) |
| `slate-100` | `#F1F5F9` | Card backgrounds, form field backgrounds |

#### Colour Usage Rules for This Landing Page

- **Dark sections (Hero, Program, Value Stack):** Background is `rr-dark` (#111921) as flat colour. NOT `rr-navy`. Navy is gradient-only.
- **Gradient overlays on images/hero:** Use the official brand gradient (see below). Never use flat navy as an overlay.
- **Accent colour priority:** `rr-pink` is the primary action colour. Use for CTAs, key highlights, urgency elements. `rr-blue` is the secondary accent — use for trust signals, institutional elements, crest display on white.
- **Text on dark backgrounds:** `white` (#FFFFFF) for body copy. `rr-light-pink` or `rr-pink` for highlights/accents only (verify contrast — see accessibility section).
- **Text on light backgrounds:** `rr-dark` (#111921) for body copy. `rr-charcoal` (#323E48) for secondary text, captions, and subdued labels.
- **NEVER use `rr-pink` as body text.** Pink is for accents, highlights, icons, and CTAs only. Its contrast ratio against both white and dark backgrounds is insufficient for body text at standard sizes.

---

### Official Brand Gradients

**These are the only permitted gradients. Do not create custom gradients.**

| Gradient | CSS | Usage |
|---|---|---|
| **Primary** | `linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)` | Hero overlays, premium section accents, CTA hover states |
| **Reverse** | `linear-gradient(135deg, #E11F8F 0%, #1226AA 60%, #001D48 100%)` | Alternate sections, footer, secondary elements |
| **Dark overlay** | `linear-gradient(180deg, rgba(17,25,33,0) 0%, #111921 100%)` | Image overlays for text legibility |

**Gradient rules:**
- Gradient must spread EQUALLY from blue to pink or vice versa
- `rr-navy` (#001D48) appears ONLY within these gradients — never as a standalone colour
- On the landing page, the primary gradient is used for the hero overlay and the value stack section accent. The reverse gradient can be used for visual variety in the checkout or footer.

---

### Typography Protocol

**The font system is non-negotiable. Montserrat is the standard for all web communications.**

#### Font Stack

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

font-family: 'Montserrat', sans-serif;
```

**Montserrat is the ONLY permitted font for this landing page.** No Arial, Helvetica, Roboto, or system font fallbacks beyond the standard sans-serif generic.

> **Note on Romagna/Romagna Exo:** The master brand guidelines specify Romagna Exo for short headers (2-3 words) and Romagna for longer headers in print and broadcast. For web/digital, the BRAND_PROMPT.md establishes Montserrat as the standard for ALL text including headers. If the brand team specifically requests Romagna for web headers, it can be added as a display font, but Montserrat is the approved web default.

#### Type Hierarchy

| Level | Weight | Size (Desktop) | Size (Mobile) | Style | Usage |
|---|---|---|---|---|---|
| H1 (Hero) | Black (900) | 48-64px | 32-40px | Uppercase, tracking-wide | Hero headline only — one per page |
| H2 (Section) | Black (900) | 36-42px | 24-28px | Uppercase, tracking-wide | Section headings — max 5 words in uppercase. Longer headings switch to title case at Bold (700) |
| H3 (Sub-section) | Bold (700) | 24-28px | 18-22px | Title case | Subsection heads, card titles, phase names |
| H4 (Card/Label) | SemiBold (600) | 18-20px | 16-18px | Title case | Card headers, feature labels, coach names |
| Body | Regular (400) | 16-18px | 16px (minimum) | Sentence case, line-height 1.6-1.7 | All body copy |
| Body Small | Regular (400) | 14px | 14px | Sentence case | Captions, disclaimers, fine print |
| CTA Text | Bold (700) | 16-18px | 16px | Uppercase, letter-spacing 0.05em | Button labels |
| Accent/Number | Black (900) | Varies | Varies | — | Stat numbers, price figures, countdown elements |

#### Typography Rules for This Landing Page

- **Uppercase headings (H1, H2):** Maximum 5 words. Beyond 5 words, switch to title case at Bold (700). This prevents "wall of shouting" effect.
- **H3 and below:** NEVER uppercase. Title case or sentence case only.
- **Body text minimum:** 16px on all devices. Never smaller for primary content.
- **Line height:** 1.6 minimum for body, 1.2-1.3 for headings.
- **Letter spacing:** Headings get `tracking-wide` (0.05-0.1em). Body text uses default spacing.

---

### Logo Usage — The Royal Crest

**The Royal Crest is the primary logo for all non-television communications. This is the logo used on the landing page.**

#### Placement Rules for This Landing Page

| Location | Logo Variant | Notes |
|---|---|---|
| Hero section (over dark/gradient) | **White crest** | Mandatory: on black or gradient backgrounds, crest MUST be white |
| Trust Bar (on white background) | **Pink or Blue crest** | On white backgrounds, use crest in `rr-pink` or `rr-blue` |
| Footer (on dark background) | **White crest** | Same rule: dark background = white crest |
| Checkout / Form card | **Pink or Blue crest** | Depends on card background colour |

#### Technical Requirements

- **Minimum width (web):** 70px — never render the crest smaller than this
- **Clear space:** Minimum space on all sides = the width of the 'R' from 'Royals' in the logo. Nothing (text, images, other logos) may encroach on this space.
- **Usage as a unit:** The crest must always be used as a complete unit. NEVER re-arrange, re-size, re-colour internal elements.
- **Location-specific logo:** An "Australia" location logo exists — use this where the sub-brand context requires it.

#### Prohibited Logo Treatments

- NEVER outline the logo elements
- NEVER use special effects (drop shadow, glow, bevel, etc.)
- NEVER rotate or distort
- NEVER place within an unapproved box or shape
- NEVER re-colour internal elements

---

### The Arrow Asset (Key Brand Visual)

**The arrow is a bespoke design element evolved from the logo crown. It is a primary visual motif that must be used on the landing page — but with strict constraints.**

#### Usage on This Landing Page

The arrow asset should appear as a subtle design language element — section dividers, background accents, directional indicators, or decorative framing. It reinforces the brand without competing with content.

**Recommended placements:**
- Hero section: Single arrow as a directional "scroll down" indicator
- Section transitions: Arrow elements as dividers between major sections
- Value Stack: Arrows pointing toward key value items
- Pathway visual: Arrows indicating progression through the development pathway

#### Arrow Rules (Non-Negotiable)

- **Maximum 3 arrows per creative/section.** No more than three arrows visible in any single viewport.
- **Width consistency:** All arrow widths MUST be identical within a single section/creative.
- **Gradient application:** Gradients on arrows MUST use the official brand gradient and be manually managed to signify progress and movement.
- **Colour:** Arrows can be rendered in `rr-pink`, `rr-blue`, white, or the brand gradient. No other colours.

---

### The Lion (Heraldic Rampant Lion — Primary Brand Graphic)

**The heraldic rampant lion is a key brand identity element. It should be used as a premium visual accent on the landing page.**

#### Usage on This Landing Page

The lion works as a watermark, background texture, or decorative element that reinforces brand identity without being overt. It signals authenticity and franchise connection.

**Recommended placements:**
- Hero section: Large-scale lion watermark at reduced opacity behind the headline text
- Value Stack / Investment section: Lion watermark behind the pricing block to reinforce the "official" feel
- Checkout section: Subtle lion element near the form to reinforce trust and legitimacy

#### Lion Rules (Non-Negotiable)

- **Only 3 colour variants permitted:**
  1. Brand Pink (`#E11F8F`) at 100% opacity
  2. White (`#FFFFFF`) — opacity can vary (watermark use)
  3. White stroke/outline — opacity can vary
- **NEVER use the lion in any other colour**
- Can be cropped, used as watermark, or as decorative background element
- **NEVER distort proportions** — the lion must maintain its original aspect ratio

---

### Photography & Image Editing Style

**The brand guidelines specify a particular photographic treatment. This is not optional — it defines the RR visual feel.**

#### Photographic Style

- **Subject focus:** Athletic body language and forceful movements. Images should convey power, precision, and intensity.
- **Editing treatment:** Photographs should be **desaturated, textured, and highlighted with pink and blue tones.**
  - This means images are NOT full-colour. They are colour-graded to a desaturated base with selective `rr-pink` and `rr-blue` tone highlights.
  - This creates the distinctive RR visual feel: dramatic, high-contrast, with brand colours woven into the imagery itself.

#### Application to This Landing Page

| Section | Image Treatment | Notes |
|---|---|---|
| Hero (background) | Full brand treatment: desaturated, textured, pink/blue tone highlights, gradient overlay | The most dramatic image on the page |
| Coach profiles | B&W or desaturated with subtle brand tone | Maintains serious, elite feel (retained from V1) |
| Facility photos | Light desaturation with pink/blue accent highlights | Should feel premium, not cold |
| Training action shots | Full brand treatment: desaturated + pink/blue highlights | Consistent with the hero visual language |
| Kit layout | Clean, minimal editing — product photography style | Exception to the desaturation rule: kit needs to show accurate colours |
| Testimonial section | Minimal editing — parent/player photos should feel warm and authentic | Overly stylised testimonial photos reduce trust |

#### Image Content Priorities (Revised from V2 Expert Recommendations)

While maintaining brand photographic style, prioritise these content types:
1. **Youth players (target age group) in training** — more emotionally resonant for parents than professional action shots
2. **Coach-player interaction** — one-on-one instruction moments signal personalised attention
3. **Group/team imagery** — players together in RRAA kit, signalling community and belonging
4. **Facility/environment** — the actual training space, showing quality and safety
5. **Coach headshots** — B&W/desaturated for consistent elite tone

**The desaturation + pink/blue highlight treatment should be applied consistently across sections 1, 4, 5, and 9. Sections 2, 7, 8, and 10 use minimal or no image treatment to provide visual breathing room.**

---

### Iconography

Icons used throughout the landing page (checkmarks, feature indicators, phase icons, FAQ toggles, etc.) must follow the brand icon system:

- **Derived from the arrow asset** — icons share the arrow's visual DNA
- **Must feature curved edges** — no sharp/angular icon styles
- **Single strokes in one colour** — not filled, not multi-colour
- **Colours:** `rr-pink`, `rr-blue`, `white`, or `rr-charcoal` depending on section background

---

### War Cry & Tagline

These are official brand elements that can be strategically deployed on the landing page:

- **"HALLA BOL!"** — The Rajasthan Royals war cry. Displayed in brush script style, always white. Can be used as a powerful visual element in the hero section or as a motivational accent in the program section.
- **"FINDING A WAY TO WIN FROM ANYWHERE"** — Official tagline. Montserrat font. The word "WIN" is rendered in pink italic. Can appear in the hero subtitle area or as a closing statement.

**Usage guidance:** These are high-impact brand elements. Use sparingly — one or both can appear on the landing page, but they should feel earned, not plastered. The hero section or the closing/checkout section are the strongest placements.

---

### Tailwind CSS Configuration (Implementation Reference)

The following configuration ensures the codebase maps exactly to brand specifications:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        rr: {
          pink: '#E11F8F',        // Pantone Rhodamine Red C
          blue: '#1226AA',        // Pantone 2736 C
          navy: '#001D48',        // GRADIENTS ONLY
          dark: '#111921',        // Pantone Black 6 C — flat backgrounds
          'light-pink': '#E96BB0', // Pantone 218 C
          'medium-blue': '#0075C9', // Pantone 3005 C
          charcoal: '#323E48',    // Pantone 432 C
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-rr': 'linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)',
        'gradient-rr-reverse': 'linear-gradient(135deg, #E11F8F 0%, #1226AA 60%, #001D48 100%)',
        'gradient-dark-overlay': 'linear-gradient(180deg, rgba(17,25,33,0) 0%, #111921 100%)',
      },
    },
  },
}
```

```css
/* CSS Custom Properties */
:root {
  --rr-pink: #E11F8F;
  --rr-blue: #1226AA;
  --rr-navy: #001D48;         /* GRADIENTS ONLY */
  --rr-dark: #111921;
  --rr-light-pink: #E96BB0;
  --rr-medium-blue: #0075C9;
  --rr-charcoal: #323E48;
  --rr-gradient: linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%);
  --rr-gradient-reverse: linear-gradient(135deg, #E11F8F 0%, #1226AA 60%, #001D48 100%);
  --rr-font: 'Montserrat', sans-serif;
}
```

> **Note:** The current codebase `index.css` has `--color-rr-pink: #E50695` — this needs to be corrected to `#E11F8F` per the brand guidelines. Also `--color-rr-light-pink: #F15AA2` should be `#E96BB0`, and `--color-rr-navy: #132485` should be `#001D48`.

---

### Micro-Interactions & Animation

- Framer Motion reveal animations (fade-in, slide-up) on desktop.
- **Mobile:** Disable slide-up and transform animations on viewports below 768px. Use simple opacity fades only. Implement `prefers-reduced-motion` media query to disable all animations for users who have enabled reduced motion in OS settings (WCAG 2.1 Level AA requirement).
- All animations should feel premium and restrained — not flashy or attention-competing. The brand is confident; the page should feel composed, not desperate.

### Spacing & Breathing Room

- Section padding: 80-120px vertical on desktop, 48-64px on mobile.
- V1 likely had 40-60px which creates a relentless scroll feel. The brand aesthetic is premium and spacious, not cramped.

### Mobile-First Requirements

- **Primary viewing context:** Parents receiving a WhatsApp or social media link, opening on mobile (iOS Safari, Android Chrome, WhatsApp in-app browser).
- **Mandatory testing:** Full page must be tested in WhatsApp's in-app webview on both iOS and Android before launch.
- **Sticky CTA clearance:** Use `env(safe-area-inset-bottom)` in CSS. Minimum 16px clearance above browser chrome.
- **Touch targets:** All interactive elements minimum 44x44px.
- **Form fields:** Single-column, full-width on mobile. Minimum 12px spacing between fields.
- **Hero video:** Will NOT autoplay in WhatsApp in-app browser on iOS. Must have a fully composed static fallback image that works independently.

### Accessibility Requirements

- **Colour contrast (WCAG AA):**
  - `rr-pink` (#E11F8F) on `rr-dark` (#111921): ~4.2:1 — **borderline**. Use for large text (>18px bold) and icons only. Do NOT use for body text.
  - `rr-pink` on white: ~3.6:1 — **fails AA for text**. Use for decorative elements and icons only, never as text on white.
  - `white` on `rr-dark`: 15.5:1 — **passes**. Use for all body text on dark sections.
  - `rr-charcoal` (#323E48) on white: 8.5:1 — **passes**. Use for secondary body text on light sections.
  - `rr-dark` (#111921) on white: 16.5:1 — **passes**. Use for primary body text on light sections.
- **Reduced motion:** `prefers-reduced-motion` media query must disable all transform/opacity animations.
- **Accordion ARIA:** `aria-expanded`, `aria-controls` on all FAQ toggles.
- **Screen readers:** All text must be HTML — no text baked into images. All images need descriptive `alt` text.
- **Video:** Hero video must not autoplay with audio. Must include visible pause control.

---

## CTA Strategy (Global)

V1 had a single sticky CTA. V2 implements a layered strategy:

### Primary CTA
- **Label:** "Secure Your Child's Spot" (parent-focused language, not "Apply to Secure Your Place")
- **Appears:** Hero section, after Value Stack section, Checkout section
- **Style:** Large (minimum 56px height on mobile, full-width on mobile). `rr-pink` (#E11F8F) background with white text on dark sections; `rr-dark` (#111921) background with white text on light sections. Montserrat Bold (700), uppercase, letter-spacing 0.05em.

### Inline CTAs (Micro-CTAs)
- **Appears:** After Section 4 (Coaches), after Section 5 (Program), after Section 7 (Transformation Stories)
- **Label:** Same as primary — "Secure Your Child's Spot"
- **Style:** Slightly smaller than primary CTA, same colour logic. These appear at persuasion peaks where a parent might think "this sounds credible and different."

### Soft CTA (Lead Capture)
- **Label:** "Download the Full Program Guide" or "Book a 10-Minute Call With Our Program Director"
- **Appears:** After Section 3 (Problem Agitation) and in the FAQ section
- **Purpose:** Captures parents who are interested but not ready to commit. Collects email for abandonment nurture sequence.
- **Style:** Secondary button style — outlined border, not filled. Visually subordinate to the primary CTA.

### Sticky/Floating CTA (Mobile)
- Full-width bottom bar on mobile.
- **Behaviour:** Hidden while the hero CTA is in the viewport. Appears once the user scrolls past the hero. Hides again when the checkout section enters the viewport.
- **Label:** "Secure Your Child's Spot" with a small secondary line: "X spots remaining"

---

## Section-by-Section Blueprint

---

### 1. THE HERO (The Hook)

**Goal:** Grab attention with elite branding, establish this is a parent-facing premium program, and create anchored urgency.

**Emotional job:** The parent should feel within 3 seconds: "This is serious, this is selective, and my child could be part of it."

**Design Aesthetic:**
- **Background:** `rr-dark` (#111921) base. Desktop: background video (Kumar practice video or Sooryavanchi celebrating) with official brand gradient overlay (`linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)` at 60-70% opacity). Mobile: high-quality static image — desaturated, textured, highlighted with pink/blue tones per brand photography style.
- **Royal Crest:** White variant (mandatory on dark/gradient backgrounds). Placed top-left or directly above headline. Minimum 70px width. Clear space = width of 'R' from 'Royals' on all sides. Use the Australia location logo variant.
- **Lion watermark:** Large-scale heraldic lion in white at 5-10% opacity behind headline area. Reinforces franchise authenticity without competing with content.
- **Text:** All headline text in `white`. Montserrat Black (900), uppercase. Subtitle in `white` Montserrat Regular (400).
- **"HALLA BOL!" (optional):** If used, render in brush script style, white, as a dynamic accent element near the headline. Use sparingly — it should feel like a brand signature, not decoration.

**Content:**

- **Headline (Revised):** "MELBOURNE'S ONLY IPL-BACKED T20 PROGRAM"
  - Montserrat Black (900), uppercase, 48-64px desktop / 32-40px mobile. White text.
  - *Why this works:* Location-specific (Melbourne), authority claim (IPL-backed), category definition (T20 program). Speaks to the parent evaluating credibility, not the teenager's ego. Under 5 words in the core phrase — punchy in uppercase.
  - *Alternative options to test:* "WHERE COMMITTED CRICKETERS TRAIN" / "THE PROGRAM BEHIND THE ROYALS NAME"

- **Subtitle (Revised):** "A 12-week structured program for young cricketers ready to train with purpose. Specialist coaching. Individual performance tracking. A pathway beyond club cricket."
  - Montserrat Regular (400), sentence case, 18-20px desktop / 16px mobile. White text, line-height 1.6.
  - *Why this works:* Specific (12 weeks), outcome-hinted (pathway beyond club cricket), differentiating (individual tracking). Avoids the generic "high-performance training" commodity language.

- **Urgency Element (Revised):** "Season 1 Intake: [X] players per cohort. [Y] spots filled. [Z] remaining."
  - Montserrat SemiBold (600). Numbers highlighted in `rr-pink` (#E11F8F). Background: semi-transparent `rr-dark` pill/badge.
  - *Why this works:* States the structural reason for scarcity (cohort cap), shows social proof (Y spots already filled), and makes the remaining number credible because it's anchored against a total.
  - **Deadline element (NEW):** "Applications close [specific date] or when spots are filled — whichever comes first." Montserrat Regular (400), smaller text beneath.

- **Enrollment Counter (NEW):** "Join [35+] families already enrolled for Season 1"
  - Small text below the urgency element. Montserrat Regular (400), `rr-light-pink` (#E96BB0) or white. High-trust, low-effort social proof.

- **Primary CTA:** "SECURE YOUR CHILD'S SPOT"
  - `rr-pink` (#E11F8F) background, white text, Montserrat Bold (700), uppercase, letter-spacing 0.05em. Full-width on mobile, prominent centred button on desktop. Minimum 56px height. Hover state: background shifts to `rr-light-pink` (#E96BB0).
  - Arrow asset: Consider a subtle brand arrow icon (→) within or adjacent to the CTA button.

**Visuals:**
- Desktop: Background video with brand gradient overlay. Video should show real training footage. Apply brand photography treatment: desaturated base with pink/blue tone highlights.
- Mobile: Static hero image — youth player mid-training in branded RRAA gear, brand photography treatment applied (desaturated, textured, pink/blue highlights). If unavailable, a composed brand shot with the white Royal Crest and program identity.
- **Arrow asset:** Single arrow element as a subtle "scroll down" indicator at the bottom of the hero viewport.

---

### 2. THE TRUST BAR (Instant Credibility)

**Goal:** Answer the parent's immediate question: "Is this legitimate?" within the first scroll.

**Emotional job:** Shift the parent from "curious but sceptical" to "this is credible, I'll keep reading."

**Design Aesthetic:**
- Narrow horizontal strip, `white` (#FFFFFF) or `slate-50` (#F8FAFC) background. Clean, minimal. Maximum 100-120px height on desktop. Subtle bottom border in `slate-100` (#F1F5F9) to separate from next section.
- No section heading. This is a visual credibility strip, not a content section.
- **Royal Crest:** Pink or Blue variant (mandatory on white backgrounds — per logo background laws). Use `rr-pink` (#E11F8F) crest for stronger visual impact or `rr-blue` (#1226AA) for a more institutional feel.
- Text: Montserrat SemiBold (600) for stat numbers, Regular (400) for labels. Colour: `rr-dark` (#111921).
- **Brand arrow:** A single subtle arrow accent can be used as a divider element between trust bar items.

**Content (3-4 elements in a horizontal row, centred):**

1. **Official Partnership Proof:** Royal Crest (pink or blue on white) + text: "Official Academy of the Rajasthan Royals"
   - Crest minimum 70px width. Clear space maintained per brand rules.
   - If there is a specific licensing or operational relationship description that is accurate, use it. E.g., "Operating under the direct oversight of the Rajasthan Royals Player Development department." The specificity of the claim determines its credibility.

2. **Enrollment Social Proof:** "35+ Families Enrolled for Season 1" (or current accurate number)
   - Number in Montserrat Black (900), `rr-pink` (#E11F8F). Label text in `rr-charcoal` (#323E48).

3. **Parent Testimonial Snippet:** A single, short, named quote. E.g., *"The professionalism from day one was exceptional. My son hasn't stopped talking about it."* — Sarah M., Glen Waverley
   - Must be a real parent. Named, with suburb. Not anonymous.
   - Quote text in `rr-charcoal` (#323E48) italic. Attribution in Montserrat Regular (400).

4. **Credential Badge (optional):** Working With Children Check verified / Cricket Australia affiliated / Insured — whichever is applicable and verifiable.
   - Badge icons follow brand iconography rules: curved edges, single stroke, one colour (`rr-blue` or `rr-charcoal`).

**Mobile layout:** Stack vertically as 2x2 grid or horizontal scroll strip.

---

### 3. THE PROBLEM (Why Most Programs Fail Your Child)

**Goal:** Name the frustration the parent is already feeling. Make them feel understood before selling anything.

**Emotional job:** The parent should think: "Yes, that's exactly what we're experiencing. Someone finally gets it."

**This section is entirely NEW. V1 had no problem agitation — it jumped from the hero to aspirational content, which asks parents to care about the program before they feel seen.**

**Design Aesthetic:**
- `white` (#FFFFFF) background with `slate-50` (#F8FAFC) card backgrounds for each pain point.
- Clean, spacious layout. No dark overlays, no images. This section is about words, not visuals.
- Body text in `rr-dark` (#111921), Montserrat Regular (400). Key frustration phrases highlighted in Montserrat Bold (700) `rr-dark`, or a `rr-pink` (#E11F8F) accent for single emphasis words (never as full sentences — pink fails text contrast on white).
- Section heading: Montserrat Black (900), `rr-dark`, uppercase (max 5 words per line).
- Framer Motion: Simple fade-in for each pain point as user scrolls (desktop). Opacity-only on mobile.

**Content:**

- **Section Heading:** "YOUR CHILD HAS THE TALENT. BUT TALENT ALONE ISN'T ENOUGH."
  - Or: "THE GAP BETWEEN TALENTED AND SELECTED"

- **Pain Points (3-4 short paragraphs or card elements):**

  1. **The Plateau Problem:** "Your child trains hard at club cricket every week. They're talented — you can see it, their coaches can see it. But the sessions repeat. The same drills, the same format. Their development has levelled off and there's no structured plan to break through to the next level."

  2. **The Pathway Confusion:** "Representative trials come and go. State programs have waiting lists. School cricket is social, not developmental. You know your child needs more, but the pathway from 'promising club player' to 'genuine representative contender' is unclear — and no one seems to be mapping it out."

  3. **The T20 Gap:** "Modern cricket has changed. T20 demands a different skillset — explosive power, tactical awareness under pressure, adaptability. But most junior coaching in Melbourne still teaches the same way it did 15 years ago. Your child is being prepared for a game that no longer exists at the elite level."

  4. **The Data Deficit:** "After every session, you ask 'How did it go?' and get a vague answer. There's no measurement, no benchmarking, no individual development plan. You're investing time and money in your child's cricket with no visibility into whether they're actually improving — or just maintaining."

- **Transition Line (bridges to next section):** "The Rajasthan Royals Academy was built to close every one of these gaps."

- **Soft CTA (NEW):** "Download the Program Guide" — email capture for parents who resonate with the problem but aren't ready to scroll through the full page.

**Inline Objection Addressed:** "Is this just another cricket academy?" — The problem section implicitly positions RRAA as *different* by naming exactly what other programs fail to do.

---

### 4. THE COACHES & ENVIRONMENT (The People Behind the Program)

**Goal:** Build trust in the humans your child will be coached by and the environment they'll train in.

**Emotional job:** The parent should feel: "These are serious, qualified people. My child will be safe and genuinely developed."

**V1 had this as Section 5. Moved to Section 4 because parents buy trust in people before trust in methodology. You cannot sell a coaching philosophy to someone who doesn't yet trust the coaches.**

**Design Aesthetic:**
- `white` (#FFFFFF) background with clean layout.
- **Coach profiles:** 2-column grid on desktop, single column on mobile. **Desaturated headshots with pink/blue tone highlights** per brand photography protocol. This maintains the serious, elite feel while being brand-compliant.
- **Facility:** 2-3 photos in a simple gallery or horizontal scroll below the coach grid. Light desaturation with `rr-pink`/`rr-blue` accent highlights.
- Coach-player interaction photos where available — same brand photography treatment (desaturated, textured, pink/blue tones).
- **Section heading:** Montserrat Black (900), `rr-dark` (#111921), uppercase.
- **Coach names:** Montserrat Bold (700), `rr-dark`. Titles in Montserrat SemiBold (600), `rr-charcoal` (#323E48).
- **Bio text:** Montserrat Regular (400), `rr-dark` (#111921), 16px minimum.
- **Safety badges:** Brand-compliant icons (curved edges, single stroke) in `rr-blue` (#1226AA) or `rr-charcoal`.

**Content:**

- **Section Heading:** "WHO COACHES YOUR CHILD"

> **Updated 5 March 2026** — Full coaching team confirmed from March 1 assessment session. 9 named staff across 3 tiers. All headshots available from session media wall portraits.

#### Tier 1: Leadership (Full profile cards with bio + video where available)

- **Kumar Sangakkara — Director of Cricket, Rajasthan Royals:**
  - Headshot: `Kumar_Poster_Image.jpg`
  - Video: `Kumar Sangakkara V2.mp4` (embed with poster thumbnail and play button)
  - Bio: Kumar's endorsement is the #1 credibility asset. Keep copy focused on his stature as a legend of the game who personally oversees the Royals global academy network. His video does the heavy lifting — the written bio supports it.

- **Alex Lewis — Head Coach, RRA Melbourne Elite Program:**
  - Headshot: `Headshot.png` (formal portrait) or `PANA0988.JPG` (session media wall)
  - Action photos: `IMG_6155.JPG` (coaching at nets), `IMG_6150.JPG`, `IMG_6167.JPG`
  - Bio: For over 22 years, thousands of young cricketers have had their careers heavily and positively influenced by his coaching, tactical and player management skills. Selected by the Rajasthan Royals Academy to lead the Melbourne Elite Program, Alex will ensure that no stone is left unturned in maximising a player's return from their time in the program. Alex will oversee a group of coaches and mentors appointed to coach and mentor players through development of specific skills.
  - **Copy note:** Alex's bio must emphasise two things: (1) longevity and track record (22+ years), (2) that he was *selected by the Royals* — he's not self-appointed. He's the day-to-day leader parents will actually interact with.

- **Andy Crook — Director of Cricket, RRA Melbourne:**
  - Headshot: `PANA1008.JPG` (session media wall, pink RR polo)
  - Action photos: `IMG_6143.JPG` (addressing players at facility)
  - Video: `Final Andy & Kumar Edit.mov` (combined with Kumar Sangakkara)
  - Bio: Andy brings to the Royals Academy decades of executive experience at the highest levels of sport, including leading Australia's NBL and Super Netball. A former professional who played for South Australia, Northamptonshire and Lancashire, Andy's connection with the game has remained strong, playing for Victoria at Masters level and recently being part of Australia's 2025 T20 Masters World Cup winning campaign in Pakistan. His network and vision for T20 cricket and player development has led to creating a world-first pathway for talented youngsters.
  - **Copy note:** Andy's bio bridges the "international franchise" and "local Melbourne" credibility. Former professional cricketer + current executive + fresh competitive credentials (2025 World Cup) = serious operator.

- **Siddhartha Lahiri — Head of International Player Development, Rajasthan Royals:**
  - Headshot: `Lahiri - Riyan Pirag` coaching photo (the only available image — Siddhartha was not at the March 1 session)
  - Video: `Sid RR Intro V2.mov`
  - Bio: Sid oversees the Rajasthan Royals Academy system within his portfolio, including the Melbourne program. As assistant or performance coach to Rajasthan, Paarl and Barbados Royals, he is a key figure in the global scouting network for the Royals Group and an expert in identifying performance talent. His eye for raw talent has unearthed some of the most exciting names in modern T20 cricket.
  - **Copy note:** Siddhartha is the bridge between the Melbourne program and the global franchise. His card should emphasise that Melbourne players will be *visible* to the Royals scouting network through his oversight. This is the "pathway to the IPL" made tangible through a real person.

#### Tier 2: Program Coaches (Compact profile cards with headshot + credential summary)

- **Adelaide Campion — Program Coach:**
  - Headshot: `PANA0927.JPG` or `PANA0928.JPG`
  - Bio: Adelaide is an experienced Premier cricketer and coach with over 15 years in the game. Inaugural captain of Carlton Cricket Club. Premiership with Ringwood CC. Malaysian Super Slam title. Represented Australia in Indoor World Cup-winning teams. Current Head Coach of the Australian U18 Indoor Cricket Team and Victorian U18 Indoor Cricket Team. Coached the Victorian Indigenous Cricket Team. Assistant coach and batting coach across multiple Premier clubs.
  - **Copy note: FEATURE PROMINENTLY.** Adelaide is the strongest credibility anchor for female cricket. Her national coaching roles (Head Coach Aus U18, Vic U18) signal genuine elite-level coaching, not tokenism. Position her card with equal visual weight to the Tier 1 coaches. Her presence directly answers the "Is this for girls too?" question.

- **Glenn Butterworth — Program Coach:**
  - Headshot: `PANA0899.JPG`
  - Bio: Played at Collingwood CC as wicket keeper / opening bat. 2x HDCA Comp batting averages. 27 years coaching experience. Level 2 Coaching course at Lord's. Coached in Middlesex, UK and in schools for the Middlesex Cricket Board. Multiple DVCA clubs. Currently female pathways coach at Fitzroy Doncaster.
  - **Copy note:** Glenn's Lord's credential and 27-year track record add depth and UK cricket credibility. His current role in female pathways at Fitzroy Doncaster complements Adelaide's profile.

- **Joel Ried — Program Coach:**
  - Headshot: `PANA0938.JPG` or `PANA0940.JPG`
  - Bio: *(To be confirmed — need bio from Alex)*

- **Bret Cole — Talent Scout:**
  - Headshot: `PANA0961.JPG` or `PANA0962.JPG`
  - Bio: *(To be confirmed — need bio from Alex)*
  - **Copy note:** Bret's role as Talent Scout directly supports the "your child will be seen by the right people" messaging. Consider framing his card around the scouting pipeline: "Bret monitors player development across the Elite Program and identifies candidates for Royals Group opportunities."

#### Tier 3: Assistant Coaches (Compact grid or team strip — headshot + name + one-liner)

- **Zac Macciocca — Program Assistant Coach:**
  - Headshot: `PANA0877.JPG`
  - One-liner: Fitzroy Doncaster. Dowling Shield Coach (6–7 years).

- **Ikroop Dhanoa — Program Assistant Coach:**
  - Headshot: `PANA0848.JPG`
  - One-liner: *(Bio TBC)*

- **Rittin Raman — Program Assistant Coach:**
  - Headshot: `PANA0912.JPG`
  - One-liner: *(Bio TBC)*

**Layout note:** The Tier 3 coaches should appear as a compact row of circular headshots with name + title below, NOT full profile cards. This creates a "deep coaching team" impression without over-extending the section length. Parents see 4 leaders + 3 program coaches + 3 assistants = a team of 10. That's a credibility signal in itself.

- **Coach-to-Player Ratio (NEW — critical):**
  - State it explicitly: "Maximum [8-10] players per coaching group" or "1:[X] coach-to-player ratio for all skill sessions."
  - This is a concrete, verifiable promise that justifies premium pricing. If the ratio isn't favourable (e.g., 1:20), this is a program design problem, not a landing page problem.

- **The Facility — Cutting Edge Cricket Centre, Bundoora:**
  - 2-3 high-quality photos: indoor nets, bowling machines, the training space set up for a session.
  - Short description: "Purpose-equipped training environment with [specific features: high-quality nets, bowling machines, video analysis setup, branded RRAA training zones]."
  - **Be honest about the facility.** If it's a standard indoor centre, don't oversell it. Emphasise that elite development happens through coaching quality, not facility grandeur. If you've branded the space with RR signage and created a distinct environment within the centre, show that.

- **Safety & Credentials (NEW — inline, not FAQ):**
  - Working With Children Check verified
  - Background-checked coaching staff
  - Code of Conduct in place
  - Insurance / Cricket Australia affiliation (whichever applies)
  - Present as small badge icons with text labels at the bottom of this section. Not buried in the FAQ.

**Inline Objection Addressed:** "Who will actually be coaching my child?" and "Is this safe and professional?"

**Inline CTA:** "Secure Your Child's Spot" — appears at bottom of this section.

---

### 5. THE PROGRAM (How We Develop Your Child Over 12 Weeks)

**Goal:** Explain what happens in the program in terms a parent understands and values. Translate methodology into tangible progression.

**Emotional job:** The parent should think: "I can see exactly what my child will do, how they'll be coached, and what will be different by week 12."

**V1 called this "The Methodology" with phases named "Explore, Challenge, Execute." Those names are internal coaching jargon that mean nothing to a parent. This section is rewritten to describe the progression in parent-comprehensible terms.**

**Design Aesthetic:**
- `rr-dark` (#111921) background, `white` text — dark authority block.
- **Lion watermark (optional):** Heraldic lion in white at 3-5% opacity as a background texture element. Reinforces brand without competing with content.
- 3-column layout on desktop (one per phase), 3-row stack on mobile. Cards on `rr-dark` with subtle `rr-charcoal` (#323E48) borders or semi-transparent white borders.
- Each phase: a large number in `rr-pink` (#E11F8F) Montserrat Black (900), a short title in `white` Montserrat Bold (700), bullet points in `white` Montserrat Regular (400), and one outcome statement highlighted in `rr-light-pink` (#E96BB0).
- **Arrow assets:** Up to 3 arrow elements can connect the three phases visually — rendered in the brand gradient, identical widths, signifying progression.
- No glowing timeline infographic (V1 spec). Replace with clean, simple column/card layout. Brand gradient accents on card edges or phase number backgrounds only.

**Content:**

- **Section Heading:** "12 WEEKS. THREE PHASES. MEASURABLE PROGRESS."

- **Phase 1 — Weeks 1-4: "Assessment & Foundation"**
  - What happens: Baseline DNA Profile captured for every player. Coaches identify each player's 2-3 priority development areas. Technical foundation built for the program's specific T20 methodology. Individual Development Plan created and shared with parents.
  - What your child gains: A clear picture of where they are now, where they need to improve, and a specific plan to get there.

- **Phase 2 — Weeks 5-8: "Targeted Development"**
  - What happens: Intensive specialist coaching on identified priority areas (batting technique, bowling accuracy, fielding reactions). Increased pressure in training scenarios. Introduction of tactical and decision-making elements specific to T20 match situations. Mid-program DNA Profile review shared with parents showing progress trajectory.
  - What your child gains: Noticeable improvement in their identified development areas, with data to prove it.

- **Phase 3 — Weeks 9-12: "Integration & Performance"**
  - What happens: Application of developed skills in match-realistic scenarios. Focus on performing under pressure. Final DNA Profile assessment. End-of-program presentation to parents with detailed progress report and forward pathway recommendations.
  - What your child gains: The ability to execute their improved skills in match conditions, a comprehensive performance profile, and a clear recommendation for their next 6-12 months of development.

- **Session Structure — "What a Typical 2.5-Hour Session Looks Like" (Retained from V1):**
  - 20 min — Dynamic warmup and athletic movement
  - 60 min — Specialist skill coaching (batting, bowling, or fielding focus)
  - 45 min — Match scenario training under game conditions
  - 25 min — Individual DNA Profile review and coach debrief
  - *Note: The 25-minute individual DNA Profile review every session is ambitious. If this is a group review rather than truly individual for each player, the copy should reflect that honestly. If it IS individual, the coach-to-player ratio and staffing must support it.*

- **Parent Engagement Layer (NEW — critical addition):**
  - Week 1: Parent orientation session — meet the coaches, understand the program structure, set expectations
  - Week 6: Mid-program parent update — review DNA Profile progress, discuss development trajectory
  - Week 12: End-of-program presentation — comprehensive progress report, forward pathway recommendations, "What Next" consultation
  - "You won't need to ask 'How was training?' and get a vague answer. You'll have the data."

**Inline Objection Addressed:** "What actually happens in the sessions?" and "Will I know if my child is improving?"

**Inline CTA:** "Secure Your Child's Spot" — appears at bottom of this section.

---

### 6. THE TECHNOLOGY EDGE (The DNA Performance Profile)

**Goal:** Demonstrate that progress is measured, not guessed. Show parents exactly what they'll receive.

**Emotional job:** The parent should think: "This is sophisticated. I'll actually be able to see and track my child's development."

**V1 claimed "30+ data points" without specifics. Parents — especially Melbourne's analytically-minded cricket parents — will probe this claim. This section must substantiate every technology claim with specifics.**

**Design Aesthetic:**
- `slate-50` (#F8FAFC) background — NOT another dark section. V1 had too many dark sections in sequence. This provides visual relief after the dark Program section.
- Split-screen on desktop: Text left, visuals right (retained from V1).
- **Desktop visuals:** Straight phone mockup with DNA Profile app UI visible (NOT tilted — tilted mockups look dated). Mockup frame should be neutral (dark grey or black device). OR: 2-3 inline screenshots of the DNA Profile interface with brand-compliant captions.
- **Mobile visuals:** Replace the phone mockup entirely. Use 2-3 inline app screenshots stacked vertically with captions. Showing a phone mockup on a phone is visually redundant.
- Include a sample anonymised DNA Profile (NEW) — let parents see exactly what they'll receive.
- **Section heading:** Montserrat Black (900), `rr-dark` (#111921), uppercase.
- **Body text:** Montserrat Regular (400), `rr-dark` (#111921). Key metrics/stats in Montserrat Bold (700) with `rr-blue` (#1226AA) accent.
- **Data point labels:** Montserrat SemiBold (600), `rr-charcoal` (#323E48).
- **Accent highlights:** `rr-blue` (#1226AA) for technology/data elements (differentiates from the `rr-pink` used for action/urgency elements — blue signals trust and intelligence).

**Content:**

- **Section Heading:** "EVERY SESSION MEASURED. EVERY IMPROVEMENT TRACKED."

- **What the DNA Profile Actually Tracks (be specific):**
  - Batting: Bat speed (measured via [specific technology, e.g., StanceBeam sensor]), shot selection accuracy, scoring zones, power metrics
  - Bowling: Pace (measured via speed gun), accuracy %, line and length consistency, variation effectiveness
  - Fielding: Reaction time, throwing accuracy, ground fielding efficiency
  - Match performance: Execution % under pressure, decision-making speed, tactical awareness rating
  - Athletic: Movement quality, agility benchmarks, fitness indicators
  - "Every metric is captured using [name the actual technology/tools]. This is not subjective coach opinion — it's measured, recorded, and tracked across your child's 12-week journey."

- **How It's Used (position as development tool, not scouting report):**
  - Feeds directly into your child's Individual Development Plan
  - Shared with parents at Week 1 (baseline), Week 6 (mid-program review), and Week 12 (final assessment)
  - Coaches use the data to adjust training focus for each player every 4 weeks
  - "The DNA Profile helps your child and their coach understand exactly where to focus. It is a powerful development tool that gives your family visibility into progress that most programs simply cannot provide."

- **What Parents Receive:**
  - Access to their child's DNA Profile dashboard (if digital) or reports (if document-based)
  - Baseline, mid-program, and end-of-program comparison
  - End-of-program comprehensive report designed to be shared with future coaches, representative selectors, or school cricket programs

- **Sample Profile (NEW):** An anonymised example showing what a real DNA Profile looks like. Even a simplified visual mockup will dramatically increase credibility.

**Inline Objection Addressed:** "Is the technology real or is it just marketing?" and "What do I actually get for the premium price?"

---

### 7. TRANSFORMATION STORIES (Real Results From Real Families)

**Goal:** Provide outcome-specific social proof that converts undecided parents.

**Emotional job:** The parent should see their own child in these stories and think: "If it worked for them, it could work for us."

**This section is entirely NEW. V1 had testimonials embedded in the Coaches section (Section 5), which diluted their impact. Testimonials need a dedicated section with proper visibility.**

**Design Aesthetic:**
- `white` (#FFFFFF) background, clean layout.
- **Testimonial cards:** `slate-50` (#F8FAFC) background or `white` with subtle `slate-100` (#F1F5F9) border and light shadow. Each card includes a quote, the parent's name, suburb, and their child's age/playing level.
- **Quote text:** Montserrat Regular (400) italic, `rr-dark` (#111921), 16-18px.
- **Attribution:** Montserrat SemiBold (600), `rr-charcoal` (#323E48).
- **Quote mark accent:** Large decorative open-quote in `rr-pink` (#E11F8F) at reduced opacity (30-40%).
- If video testimonials are available, embed them here with `rr-dark` (#111921) video player frame. Video proof outperforms written testimonials significantly in premium youth sports marketing.
- Horizontal carousel on desktop (3 visible at a time), vertical stack on mobile.
- **Section heading:** Montserrat Black (900), `rr-dark`, uppercase.
- **Aggregate proof line:** Montserrat SemiBold (600), `rr-charcoal`. Numbers in `rr-pink` Montserrat Black (900).

**Content:**

- **Section Heading:** "WHAT PARENTS ARE SAYING"
  - Not "Testimonials" — that's a label, not a heading.

- **Testimonial Requirements (3-5 testimonials, prioritised by type):**

  1. **The Outcome Testimonial:** A parent whose child achieved a specific outcome after the program. E.g., selection for a representative team, breaking into a Premier 1st XI, noticeable improvement in match performance. This is the highest-converting testimonial type. *"Before RRAA, my son was a solid club cricketer but couldn't break through to representative level. After the program, he was selected for [specific team/squad]. The coaching and data gave him clarity on exactly what he needed to work on."* — [Full name], [Suburb]

  2. **The Sceptic-Turned-Believer:** A parent who was initially unsure but was won over by the experience. Addresses the "is this worth it?" objection. *"I'll admit I was sceptical when I first saw the price. But after seeing the DNA Profile data, watching my daughter's technique transform, and the way the coaches communicated with us every step — it was the best investment we've made in her cricket."* — [Full name], [Suburb]

  3. **The Safety & Professionalism Testimonial:** A parent speaking to the environment, coaching quality, and how their child was treated. Addresses the "is my child safe and cared for?" concern. *"The professionalism from day one was exceptional. The coaches knew every player's name, their strengths, their goals. My son felt valued and challenged in every session."* — [Full name], [Suburb]

  4. **The Nervous Child Testimonial:** A parent whose child was nervous or unsure but thrived in the environment. Addresses "what if my child doesn't enjoy it?" *"My daughter was nervous about the intensity level — she's a solid club player but wouldn't call herself elite. By week three, she was the first one ready to go. The coaches met her where she was and pushed her at the right pace."* — [Full name], [Suburb]

  5. **The Data/Visibility Testimonial:** A parent who valued the DNA Profile and communication. *"For the first time, I actually knew how my son was developing. Not vague 'he had a good session' — actual data showing his bat speed improving, his bowling accuracy trending up. That visibility alone was worth the investment."* — [Full name], [Suburb]

- **If you don't have these testimonials yet:** This is a content priority. Reach out to your 30-40 enrolled families. Even pre-program testimonials ("why we signed up") are valuable. Post-program, these stories become your most powerful marketing asset for future cohorts.

- **Aggregate Proof (NEW):** Below the testimonials, a single line: "35+ families have enrolled for Season 1 across [X] suburbs in Melbourne."

**Inline Objection Addressed:** "Is this actually worth the money?" and "Will my child fit in?"

**Inline CTA:** "Secure Your Child's Spot" — appears at bottom of this section.

---

### 8. WHO THIS IS FOR (The Qualifying Section)

**Goal:** Help parents self-select. Create perceived exclusivity. Filter out mismatched expectations.

**Emotional job:** The parent who matches should think: "This is exactly us." The parent who doesn't match should self-select out — saving you difficult conversations later.

**This section is entirely NEW. It is one of the highest-converting elements in premium program marketing. It reframes the page from "another cricket academy" to "a selective program for a specific type of young cricketer."**

**Design Aesthetic:**
- `slate-50` (#F8FAFC) background, clean and minimal.
- Two-column layout on desktop: "This Program Is For..." (left) and "This Program Is Not For..." (right).
- Single column stack on mobile.
- **"Is For" indicators:** Brand-compliant icons in `rr-pink` (#E11F8F) — use the brand arrow asset pointing right (→) or a curved-edge checkmark icon (per iconography rules: curved edges, single stroke, one colour).
- **"Is Not For" indicators:** Neutral icons in `rr-charcoal` (#323E48) — dashes or muted arrow. NOT red crosses — you don't want to alienate, just clarify.
- **Section heading:** Montserrat Black (900), `rr-dark` (#111921), uppercase.
- **List item text:** Montserrat Regular (400), `rr-dark` (#111921), 16px.
- **Commitment statement:** Montserrat SemiBold (600), `rr-dark`, with key phrase ("commitment") in `rr-pink`.

**Content:**

- **Section Heading:** "IS THIS RIGHT FOR YOUR CHILD?"

- **This Program Is For:**
  - Young cricketers aged [specify age range] who are committed to improving
  - Players who want structured, intensive coaching beyond what club cricket provides
  - Families looking for a measurable development pathway, not just another training session
  - Players at any skill level who bring the right attitude, work ethic, and willingness to be coached
  - Parents who want visibility into their child's development through data and regular communication

- **This Program Is Not For:**
  - Players looking for a casual holiday clinic or social cricket experience
  - Families expecting guaranteed selection outcomes (we develop skills and readiness — selection depends on many factors)
  - Players who are not willing to commit to the full 12-week program and train with intensity
  - Parents looking for the cheapest coaching option (this is a premium development program priced accordingly)

- **The Commitment Statement:** "We don't select on talent alone. We select on commitment. If your child is ready to train with purpose, they belong here regardless of their current level."
  - *This single line does enormous conversion work: it opens the door for ambitious parents whose child isn't already elite, while maintaining the perception that not everyone gets in.*

**Inline Objection Addressed:** "Is my child good enough?" and "What if this is too intense?"

---

### 9. THE PATHWAY FORWARD & VALUE STACK (What Your Child Receives)

**Goal:** Show the full value of what's included, present the price with confidence, and eliminate purchase anxiety with risk reversal.

**Emotional job:** The parent should feel: "This is clearly worth more than what they're charging. And if it doesn't work out, I'm protected."

**V1 had Dream & Pathway as Section 2 and Value Stack as Section 6. In V2, the pathway content is condensed and merged into the Value Stack section. Aspirational pathway content only works after trust is established — placing it here means the parent has already seen the coaches, methodology, technology, and social proof. Now they're ready to dream.**

**Design Aesthetic:**
- `rr-dark` (#111921) background, `white` text — premium dark section. `rr-pink` (#E11F8F) highlights for price figures, key numbers, and value amounts.
- **Brand gradient accent:** The official gradient (`linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)`) used as a subtle top-border or card accent line — signals premium positioning.
- **Lion watermark:** Heraldic lion in white at 3-5% opacity behind the pricing block. Reinforces franchise legitimacy at the moment of purchase decision.
- **Arrow assets:** Up to 3 arrows as directional elements pointing toward key value items. Brand gradient, identical widths.
- Top half: Pathway visual + post-program value. Bottom half: Value stack, price, and risk reversal.
- Kit layout photo: Clean product photography — exception to desaturation rule; kit needs to show accurate `rr-pink` and `rr-blue` colours.
- **Section heading:** Montserrat Black (900), `white`, uppercase.
- **Price figure:** Montserrat Black (900), `rr-pink` (#E11F8F), large (36-48px desktop / 28-36px mobile). This is the "accent number" use case from the type hierarchy.
- **Value item labels:** Montserrat SemiBold (600), `white`. Value amounts in `rr-pink`.
- **Risk reversal/guarantee text:** Montserrat Regular (400), `rr-light-pink` (#E96BB0) — softer than pure pink, signals warmth and reassurance at the anxiety point.
- **Royals Group team logos:** White variants (mandatory on dark background). Maintain proportional alignment per brand logo rules when displayed alongside partner logos.

**Content:**

**Part A — The Pathway (condensed from V1 Section 2):**

- **Heading:** "BEYOND 12 WEEKS"

- **Visual:** Simple horizontal pathway graphic: "RRAA Program" > "Enhanced Club Performance" > "Representative Selection Readiness" > "Premier Cricket / State Pathways"
  - Not image cards or elaborate team logos. A clean, scannable visual pathway.

- **Post-Program Value (revised from V1's vague "ongoing masterclasses"):**
  - End-of-program comprehensive report designed to be shared with selectors and future coaches
  - Personalised "What Next" consultation with coaches — specific, individualised recommendations for the next 6-12 months
  - Priority access to future RRAA programs, advanced squads, and camps
  - Inclusion in the RRAA alumni network
  - Ongoing masterclass invitations with visiting specialists
  - *If applicable:* Standout performers are entered into the Rajasthan Royals international development database / recommended to Cricket Australia talent identification pathways. **Only include this if it is genuinely true. Do not imply pathways that don't exist.**

- **The Royals Group Connection (retained from V1, repositioned):**
  - Connected to the Rajasthan Royals (IPL), Paarl Royals (SA20), Barbados Royals (CPL)
  - Logos of Royals group teams
  - "Your child trains within the development philosophy of one of cricket's most successful global franchise networks."
  - **Substantiation (NEW):** If there is specific, verifiable proof of the depth of this connection — a quote from a Royals franchise official, a video endorsement, a formal institutional relationship — include it here. If the connection is primarily a licensing arrangement, be honest about what it means for the player's experience.

**Part B — The Value Stack:**

- **Heading:** "YOUR CHILD'S PROGRAM INCLUDES"

- **Itemised Value List (with perceived value anchoring):**
  - 12 weeks of specialist T20 coaching (30 hours of elite instruction) — *Value: $X,XXX*
  - Individual DNA Performance Profile with 3 assessment points — *Value: $XXX*
  - Individual Development Plan created and reviewed with parents — *Value: $XXX*
  - Official Rajasthan Royals Academy training kit (Shirt, Shorts, Cap) — *Value: $XXX*
  - Parent orientation, mid-program update, and end-of-program presentation — *Included*
  - Post-program pathway report and "What Next" consultation — *Included*
  - Priority access to future RRAA programs and events — *Included*
  - **Total Program Value: $X,XXX**

- **The Investment:**
  - **Price:** Clear, prominent, in white or `rr-pink` on dark background.
  - **Framing:** "Your investment: $[price]" — but only if the value stack above makes the price feel like a fraction of the total value. If the anchoring doesn't work (i.e., the perceived value items don't feel credible), drop the anchoring and just state the price clearly. Transparency > sales technique for Melbourne parents.
  - **Payment plans (if available):** State clearly. E.g., "Pay in full: $X,XXX or 3 monthly instalments of $XXX."

- **Bonus Offer (if applicable):**
  - Whatever limited-time bonus applies (e.g., 1-on-1 session discount, early enrollment benefit).
  - Tie the bonus to a deadline: "Available for applications received before [date]."

- **Risk Reversal (NEW — critical):**
  - **The Guarantee:** "If after the first two sessions you don't believe this program is the right environment for your child's development, we'll refund your investment in full — no questions asked."
  - **Framing:** "We offer this because we know the quality of what we deliver." — confidence-framed, not concession-framed.
  - **Placement:** Directly adjacent to the price. This is the moment of maximum purchase anxiety and where risk reversal does its heaviest work.
  - *If a full guarantee isn't feasible, at minimum state the refund/cancellation policy clearly and visibly. "Cancel within [X] days for a full refund" or "Pro-rata refund for withdrawals before Week [X]." The absence of any visible policy forces the parent to absorb 100% of risk, which is a significant conversion leak at this price point.*

- **Urgency (reinforced):**
  - "Season 1 Intake: [X] spots remaining. Applications close [date]."
  - This is the second urgency placement (first was the hero). It arrives at the decision point.

- **Scheduling Compatibility (NEW — inline objection):**
  - State the session day(s), time(s), and location clearly in this section.
  - "Sessions run every [Day] from [Time] to [Time] at the Cutting Edge Cricket Centre, Bundoora."
  - If there are multiple session time options, list them.
  - This addresses the practical "does this fit our schedule?" objection that kills conversions if unanswered.

**Primary CTA:** "Secure Your Child's Spot" — large, prominent.

**Soft CTA (secondary):** "Have Questions? Book a 10-Minute Call With Our Program Director" or "Download the Full Program Guide" — for parents who need more before committing.

---

### 10. FAQ (Logistics & Remaining Questions)

**Goal:** Clean up any remaining logistical questions. This is NOT the primary objection-handling section — the major objections have been addressed inline throughout the page.

**Emotional job:** The parent should think: "They've thought of everything. I have no unanswered questions."

**Design Aesthetic:**
- `slate-50` (#F8FAFC) background, clean, minimal.
- **Accordion cards:** `white` (#FFFFFF) background with subtle shadow. Expanded state: `slate-100` (#F1F5F9) background shift.
- **Toggle icons:** `rr-dark` (#111921) or `rr-charcoal` (#323E48) — NOT pink (fails contrast on light backgrounds for small UI elements). Brand-compliant icon style: curved edges, single stroke. Minimum 44x44px touch target on mobile.
- **Section heading:** Montserrat Black (900), `rr-dark`, uppercase.
- **Question text:** Montserrat SemiBold (600), `rr-dark` (#111921), 16-18px.
- **Answer text:** Montserrat Regular (400), `rr-charcoal` (#323E48), 16px, line-height 1.6.
- ARIA attributes: `aria-expanded`, `aria-controls` on all accordion elements for screen reader accessibility.

**Content:**

- **Section Heading:** "COMMON QUESTIONS"

- **Maximum 6-8 questions. Prioritised order:**

1. **"Is this program officially affiliated with the Rajasthan Royals?"**
   - Direct, specific answer about the nature of the relationship. This is the #1 trust question and should be the first FAQ.

2. **"What age group is this program designed for?"**
   - Clear age range. If the 2.5-hour session structure is too demanding for younger players (under-13s), address how the coaching adapts.

3. **"Does my child need to be at a certain skill level to participate?"**
   - Reinforce the "commitment over talent" positioning from Section 8. "We welcome players at all levels who are committed to development. The coaching adapts to individual skill levels through the DNA Profile and Individual Development Plan."

4. **"What if my child misses a session?"**
   - Clear policy. Makeup sessions? Catch-up plans? Or no accommodation?

5. **"Are payment plans available?"**
   - Clear options.

6. **"What is the refund/cancellation policy?"**
   - Restate the guarantee/policy from the Value Stack section. Consistency builds trust.

7. **"What does my child need to bring?"**
   - Practical logistics (own bat, pads, etc. vs. what's provided).

8. **"How does this fit with my child's existing club cricket?"**
   - "This program is designed to complement, not replace, club cricket. The T20-specific skills and individual development planning will directly enhance your child's club performance."

**Soft CTA:** "Still have questions? Book a 10-minute call with our Program Director: [phone number / booking link]"

---

### 11. THE CHECKOUT (The Close)

**Goal:** Seamless, low-friction transaction without leaving the page.

**Emotional job:** The parent should feel: "This is simple, secure, and I know exactly what I'm committing to."

**V1 had a 3-step form (Player Details, Sizing, Payment). V2 reduces to 2 steps. Sizing as Step 2 was a cognitive derailment — the parent is in commitment mode and suddenly needs to know their child's shirt size, which creates friction and potential abandonment.**

**Design Aesthetic:**
- `rr-dark` (#111921) background — contrasts with the light FAQ section above and creates a premium "closing" feel consistent with the brand's authority.
- **Form card:** `white` (#FFFFFF) card on the dark background. Clean, spacious, `rounded-2xl` corners, subtle shadow.
- **Royal Crest:** White variant in the checkout section header area (mandatory on dark background). Reinforces franchise legitimacy at the point of commitment.
- **Lion watermark (subtle):** White at 2-3% opacity behind the form card, barely visible but present for brand texture.
- Progress indicator: Two numbered circles connected by a line. Active step in `rr-pink` (#E11F8F), completed step in `rr-blue` (#1226AA), upcoming step in `rr-charcoal` (#323E48). Montserrat SemiBold (600).
- Order summary sidebar on desktop / sticky top bar on mobile — always visible during the form. `slate-50` (#F8FAFC) background, `rr-dark` text.
- **Section heading:** Montserrat Black (900), `white`, uppercase on the dark background.
- **Form labels:** Montserrat SemiBold (600), `rr-dark` (#111921), 14px.
- **Form inputs:** `slate-100` (#F1F5F9) background, `rr-dark` text, Montserrat Regular (400), 16px. Border: `rr-charcoal` (#323E48) at 30% opacity. Focus state: border shifts to `rr-blue` (#1226AA).
- **Submit button:** `rr-pink` (#E11F8F) background, `white` text, Montserrat Bold (700), uppercase. Full-width. Minimum 56px height. Hover: `rr-light-pink` (#E96BB0).
- Security badges: Payment processor logo, SSL indicator, "Secure Checkout" text — all in `rr-charcoal` or muted tones. Not brand-coloured — security signals should feel neutral and institutional.
- **"HALLA BOL!" (optional):** Can appear as a small brand signature element on the confirmation screen after successful payment. Brush script, white. A celebratory brand moment.
- **Tagline (optional):** "FINDING A WAY TO WIN FROM ANYWHERE" on the confirmation screen — with "WIN" in `rr-pink` italic. Montserrat. Ties the purchase back to the brand narrative.

**Content:**

- **Section Heading:** "COMPLETE YOUR APPLICATION"

**Step 1 — Player & Parent Details:**
- Parent: Full name, email, phone number
- Player: Full name, date of birth, primary playing role (Batsman / Bowler / All-rounder / Wicketkeeper)
- Kit sizing: Dropdown (XXS-XL) with a "I'll provide this later" default option. Do not force sizing as a required field — it should be completable post-purchase via a follow-up email.
- **Email is captured in Step 1 intentionally.** If the parent abandons after Step 1, you have their email for a follow-up recovery sequence. This is critical for a high-ticket purchase.

**Step 2 — Review & Payment:**
- Order summary: "RRAA 12-Week Elite Program — [Child's Name] — $[Price]"
  - If payment plan selected: "[3] monthly payments of $[Amount]"
- Itemised summary of what's included (brief)
- Payment form (card details via Stripe/processor)
- Terms acceptance checkbox (link to full terms)
- **Refund policy (restated):** Single line directly adjacent to the payment button: "Full refund available within [X days/sessions]. See our refund policy."
- **Security badges:** Payment processor logo, SSL indicator, "Secure Checkout" text.
- **Submit button:** "Complete Enrolment — Secure [Child's Name]'s Spot"

**Final Urgency (subtle):**
- Below the form: "[X] spots remaining for the Season 1 intake."
- NOT aggressive or pushy at this point. The parent is already in the form — they don't need to be pressured, they need to feel confident.

**Post-Submission:**
- Confirmation screen with: Welcome message, next steps (what to expect before Week 1), program dates, contact information.
- Automated confirmation email with the same information plus a link to complete kit sizing if not done in the form.
- If kit sizing was left as "I'll provide later," a separate follow-up email requesting sizing within [X] days.

**Support Line (NEW):**
- "Questions before you commit? Call us: [phone number]" — visible near the form.
- For a premium purchase, some parents will want to speak to a human before entering their payment details. A phone number here can be the difference between a conversion and an abandonment.

---

## Page Footer

**Design Aesthetic:**
- `rr-dark` (#111921) background, `white` and `rr-charcoal` (#323E48) text.
- **Royal Crest:** White variant (mandatory on dark background). Australia location variant. Minimum 70px width, clear space maintained.
- **Brand gradient accent:** Reverse gradient (`linear-gradient(135deg, #E11F8F 0%, #1226AA 60%, #001D48 100%)`) as a thin top border (2-4px) on the footer — creates a premium visual signature.
- **Arrow asset (optional):** Single brand arrow as a decorative element.

**Content:**
- Royal Crest (white, Australia variant)
- "Official Academy of the Rajasthan Royals"
- Business entity name and ABN
- Contact: Email, phone number
- Links: Privacy Policy, Terms & Conditions, Refund Policy (Montserrat Regular 400, `rr-light-pink` (#E96BB0) for links)
- Social media links (if applicable)
- **Design approval acknowledgement (internal, not public):** All designs submitted to Khyati Shah and Srnjayi Jain before launch.

---

## Appendix A: Content & Asset Priorities

These items need to be created or gathered before the page can be built to its full potential:

### Critical (Must-Have for Launch)
1. **Parent testimonials** — minimum 3, named with suburb, outcome-specific
2. **Coach bios** — substantiated with verifiable credentials, not just titles
3. **Official RR partnership badge/seal** — clear, prominent format
4. **DNA Profile sample** — anonymised example showing what parents will receive
5. **Facility photos** — the actual training space, set up for a session
6. **Refund/cancellation policy** — defined and approved
7. **Session schedule** — confirmed days, times, location

### High Priority (Significant Conversion Impact)
8. **Youth player training photos** — target age group in action, in RRAA gear
9. **Coach-player interaction photos** — one-on-one instruction moments
10. **Group/team photos** — players together, building sense of community
11. **Video content** — session footage, facility walkthrough, coach introduction (even 60-90 seconds)
12. **Specific technology details** — what tools are used to capture DNA Profile data

### Nice to Have (Enhances but Not Blocking)
13. **Video testimonials** from parents
14. **RR franchise endorsement** — quote or video from franchise official
15. **Media coverage logos** — if any press mentions exist
16. **End-of-program event footage** — for future cohorts

---

## Appendix B: Abandoned Cart / Lead Nurture Strategy

The landing page should feed into a basic email automation:

1. **Soft CTA captures (Program Guide download / Call booking):**
   - Immediate: Deliver the guide or confirm the call booking
   - Day 2: Follow-up email with a parent testimonial and link back to the landing page
   - Day 5: "Spots are filling" update with current enrollment count
   - Day 10: Final reminder before application close date

2. **Form abandonment (email captured in Step 1 but payment not completed):**
   - 1 hour: "You started your application — here's a direct link to complete it" (pre-filled where possible)
   - 24 hours: Follow-up with a parent testimonial and a "Questions? Call us" prompt
   - 72 hours: Final reminder with urgency ("X spots remaining")

3. **Post-enrollment:**
   - Immediate: Confirmation + welcome email
   - 1 week before program: "What to expect in Week 1" preparation email
   - After Week 1: "How was the first session?" check-in (also a great time to request a testimonial)

---

## Appendix C: Measurement & Optimisation

Track these metrics post-launch to identify what's working and what needs adjustment:

- **Scroll depth:** Where do parents stop scrolling? If drop-off spikes before the Coaches section, the Problem Agitation section isn't compelling enough.
- **CTA click-through by position:** Which inline CTA gets the most clicks? This tells you where the strongest persuasion peak is.
- **Soft CTA conversion rate:** How many parents download the guide or book a call vs. going straight to checkout?
- **Form abandonment rate and step:** If abandonment is high at Step 2, the price or payment UX is the issue.
- **Time on page by section:** Long dwell time on the FAQ means parents have unresolved questions that should be addressed earlier.
- **Device breakdown:** What % of traffic is mobile? If >70% (likely), mobile optimisation becomes the top priority.
- **Traffic source:** WhatsApp referrals vs. social vs. direct — informs where to focus distribution.

---

## Appendix D: Brand Compliance Checklist

**Use this checklist before submitting the landing page for brand approval. Every item must pass before the page goes live.**

### Colour Compliance

| Check | Requirement | Status |
|---|---|---|
| | All pink elements use exact `#E11F8F` — no approximations | |
| | All blue elements use exact `#1226AA` — no approximations | |
| | Dark Navy `#001D48` appears ONLY within gradients, never as flat background | |
| | Flat dark backgrounds use `#111921` (Brand Black) only | |
| | Official gradient uses exact stops: `135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%` | |
| | `rr-pink` is NOT used as body text (accent/icon/CTA only) | |
| | Secondary palette colours match exact HEX values | |

### Typography Compliance

| Check | Requirement | Status |
|---|---|---|
| | Montserrat is the ONLY font loaded and rendered | |
| | No fallback to Arial, Helvetica, Roboto visible anywhere | |
| | Google Fonts import includes full weight range (100-900, italic) | |
| | H1/H2 use Montserrat Black (900), uppercase | |
| | H3 and below are title case, never uppercase | |
| | Body text minimum 16px on all devices | |
| | Line-height minimum 1.6 for body text | |
| | CTA text is Montserrat Bold (700), uppercase, letter-spacing 0.05em | |

### Logo Compliance

| Check | Requirement | Status |
|---|---|---|
| | Royal Crest used (not Royal Seal — Seal is TV only) | |
| | White crest on dark/gradient backgrounds | |
| | Pink or Blue crest on white backgrounds | |
| | Minimum 70px width in all web placements | |
| | Clear space (width of 'R') maintained on all sides | |
| | Logo used as a complete unit — no internal element modifications | |
| | No outline, special effects, rotation, or distortion applied | |
| | Not placed within unapproved box or shape | |
| | Australia location variant used where sub-brand context applies | |

### Arrow Asset Compliance

| Check | Requirement | Status |
|---|---|---|
| | Maximum 3 arrows per section/viewport | |
| | All arrow widths identical within each section | |
| | Arrows rendered in brand colours only (pink, blue, white, or gradient) | |
| | Gradient arrows use official gradient with manually managed spread | |

### Lion Element Compliance

| Check | Requirement | Status |
|---|---|---|
| | Lion appears in only 3 colour variants: pink (#E11F8F), white, or white outline | |
| | No other colours used for the lion | |
| | Proportions not distorted | |
| | Used appropriately as watermark/decorative element, not as primary content | |

### Photography Compliance

| Check | Requirement | Status |
|---|---|---|
| | Action/training images are desaturated with pink/blue tone highlights | |
| | Photography focuses on athletic body language and forceful movements | |
| | Kit/product photography shows accurate colours (exception to desaturation) | |
| | Testimonial section photos are warm/authentic (light desaturation exception) | |

### Iconography Compliance

| Check | Requirement | Status |
|---|---|---|
| | All icons feature curved edges (no sharp/angular styles) | |
| | Single strokes in one colour per icon | |
| | Icon colours from approved palette only | |

### Accessibility Compliance

| Check | Requirement | Status |
|---|---|---|
| | All text meets WCAG AA contrast ratio (4.5:1 body, 3:1 large) | |
| | `prefers-reduced-motion` disables all animations | |
| | All touch targets minimum 44x44px | |
| | FAQ accordions have `aria-expanded` and `aria-controls` | |
| | All text is HTML, not baked into images | |
| | All images have descriptive `alt` text | |
| | Video has pause control and no audio autoplay | |

### Brand Approval

| Check | Requirement | Status |
|---|---|---|
| | Full design submitted to Khyati Shah (Khyati.Shah@rajasthanroyals.com) | |
| | Full design submitted to Srnjayi Jain (srnjayi.jain@rajasthanroyals.com) | |
| | Approval received and documented before launch | |

---

## Appendix E: Codebase Corrections Required

The current `index.css` in the RRAA LANDING codebase has colour values that do not match the official brand specifications. These must be corrected before implementing V2:

| Current Value | Correct Value | Variable |
|---|---|---|
| `#E50695` | `#E11F8F` | `--color-rr-pink` |
| `#F15AA2` | `#E96BB0` | `--color-rr-light-pink` |
| `#132485` | `#001D48` | `--color-rr-navy` |
| Missing | `#0075C9` | `--color-rr-medium-blue` (add) |
| Missing | `#323E48` | `--color-rr-charcoal` (add) |
| `linear-gradient(to right, ...)` | `linear-gradient(135deg, #001D48 0%, #1226AA 40%, #E11F8F 100%)` | `--image-gradient-rr` |

These corrections bring the codebase into alignment with the official RR Master Brand Guidelines.

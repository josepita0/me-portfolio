# Recreation Spec — "Majd" Framer Portfolio

Reference: https://majd-portfolio.framer.website/ (Framer site `5OdC8fFdfIksjC0PHuA6WH`, published Jun 30 2026)

Goal: replicate structure, layout, typography and motion 1:1.

**Excluded**: Framer template chrome ("Use for Free", "More Templates" floating pills, Framer badge), Framer CMS admin, real form backend (mailto fallback is fine).

---

## 1. Stack (recommended)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5/6** | Content-driven multi-page site; zero JS by default; content collections for work/blog |
| Animation | **`motion`** (`motion/react`, framer-motion successor) | Same spring API Framer uses under the hood (`{type:"spring", duration, bounce}`) |
| Smooth scroll | **Lenis** | Framer ships Lenis (`html.lenis` CSS classes present in SSR output) |
| Page transitions | **Astro `ClientRouter`** (`astro:transitions`, `fade()`) | Crossfade matches Framer's default page transition |
| Interactive islands | React (`client:load` / `client:visible`) | Only for motion-heavy components; everything else stays static HTML |

Alternatives considered:

- **Next.js**: all-React, but heavier runtime + SSR overhead for a mostly static portfolio. Only worth it if the whole team is React-native.
- **Vite + React SPA**: simplest transition control, but content/SEO boilerplate by hand.
- **Astro + vanilla JS (no React)**: lightest, but reimplementing Framer springs, drag inertia and rolling text by hand costs more than the bytes saved.

Island map (what actually ships JS):

1. `SmoothScroll` — Lenis rAF loop (page-level, one per page)
2. `HeroAvatar` — flip card + draggable stickers
3. `RollingText` — used by nav links, CTAs, submit button
4. `ProjectCard` / `BlogCard` — hover variants
5. `TestimonialCard` — 3D flip on appear
6. `ScrollFillText` — scroll-scrubbed giant quote
7. `NavMenu` — hamburger open/close

Everything else (layout, typography, static sections) is pure Astro + CSS.

---

## 2. Breakpoints & Design Tokens

Breakpoints (Framer): **Desktop ≥1280 · Tablet 810–1279.98 · Mobile ≤809.98**
Content column: `max-width: 1180px` desktop, `900px` tablet (padding 0 30px), `330px` mobile hero column.

```css
:root {
  --bg:        #faf7f3;   /* cream */
  --ink:       #111111;   /* near-black */
  --ink-50:    #11111180;
  --accent:    #eb4d6d;   /* red/pink */
  --cream-90:  #faf7f3e6;
  --cream-50:  #faf7f380;
  --cream-30:  #faf7f34d;
  --cream-10:  #faf7f31a;
  --overlay:   #0000001a;

  --radius-pill: 20px;   /* nav, avatar */
  --radius-card: 16px;   /* dark panels, testimonial, thought cards */
  --radius-btn:  8px;    /* buttons, social pills */
  --radius-input: 12px;  /* form fields */

  --content-max: 1180px;
  --grain-size: 161px;
}
```

Grain overlay: full-bleed fixed layer, `background-image` 161px repeat, `opacity: 0.04`, `pointer-events: none`, `z-index: 10`.
Dev asset: `https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png`

---

## 3. Typography

Fonts: **Archivo** (Fontshare; 300–900 + italics) for display/UI, **Inter** (400/600/700/900) for body. **Clash Grotesk** (400) is also loaded — likely the giant scrub quote font (verify by recording).

Observed sizes (desktop): 16, 18, 22–32, 40–48, 58–76, **120, 174, ~417px** (giant quote renders at 3 sizes, one per breakpoint).

| Use | Size (desktop) | Font | Weight |
|---|---|---|---|
| Hero display "SOFTWARE ENGINEER" | 174px | Archivo | 800 |
| "Hey!" / section display | 120px | Archivo | 800 |
| Section titles | 40–48px | Archivo | 600–800 |
| Card titles | 24–32px | Archivo | 500–600 |
| Body / meta | 16–18px | Inter | 400 |
| Nav / buttons | 16px | Archivo | 500, `letter-spacing: -0.02em`, `line-height: 1.2em` |
| Giant scrub quote | ~417px (desktop) | Clash Grotesk? | 400 |

Letter-spacing on Archivo display: negative (-0.02em to -0.04em). Exact preset values to be pinned during side-by-side build.

---

## 4. Sitemap & Content Model

```
/                   Home
/work               Projects index ("My Brightest Creations")
/work/[slug]        7 cases: damas, najm, kavi, postwing, sham, abjad, fasselh
/blog               Blog index ("My Brightest Thoughts")
/blog/[slug]        7 posts
```

Anchors (home): `#hero-section`, `#bio-section`, `#services`, `#contact`
Shared across pages: nav pill, contact section (bottom), grain overlay, Lenis.

Content collections:

```ts
// work
{ slug, title, category ("Free Framer Template" | ...), year, liveLink,
  cover (1160×800), body, images: [intro, ...4 body images, outro],
  prev, next }

// post
{ slug, title, date, readTime, cover, summary, body }
```

---

## 5. Home — Section Architecture (top to bottom)

1. **Nav pill** — `position: fixed; top: 30px; left: 50%; translateX(-50%)`, bg `--ink`, radius 20, width 320px ("Closed" variant): logo "Majd" (Archivo, cream) + hamburger 44×36 (three 4px dots, gap 3). "Open" variant expands into a menu panel: links Home / Work / Thoughts (+ email `mejed@templyo.io`), mobile-only "Get in Touch" cream button (radius 8, rolling text, submit 240×44 desktop form variant).
2. **Hero — 200vh wrapper, sticky 100vh inner.**
   - Left column: "SOFTWARE ENGINEER" (174px), "©2026", "/CREATING SINCE 2020".
   - Center: **avatar flip card** 400×456, radius 20. Front = color photo; back = same photo `filter: grayscale()`. Both faces `perspective: 1200px`.
   - Right column: "Hey!" + bio paragraph (max 460px) + "Get Started" arrow-link.
   - **Stickers** (holographic triangle PNGs, `cursor: grab`): 160×160 bottom-right of avatar (rests at **rotate 16°**), 140×140 top-left (rests at 0°).
3. **Scroll-fill quote** — 150vh wrapper, sticky 100vh, text max-width 840px, centered. Framer component props: `triggerStart: "top 90%"`, `triggerEnd: "top 10%"`, `scrub: smooth`. Fill from ink-50 → ink (accent appears in hover/CTA contexts).
4. **Services** — rows 1080×120 (`min-height: 120px`): title left, 3 categories right separated by 4px dots. Mobile: stacked cards 390px, padding 20 0, gap 20.
5. **Featured Projects** — header (title + "View All Work") + 2-col grid of 580px cards: image frame aspect 1.45 (580×400), then title + short description.
6. **Testimonials** — 4-col grid (2-col tablet), cards 283×340: quote + avatar 50px + name/role. Cards are 3D flip surfaces (front quote / back face).
7. **Thoughts** — 2 cards 380×460 (dark `--ink`, radius 16, padding 20, image fills bottom 70%) + "View All Work" CTA.
8. **Contact** — dark panel radius 16, min-height 460, padding 24: "Let's talk." + form (Name, Email: 44px fields; Message textarea min 140px; Submit 240×44 cream radius 8 with rolling text) + social icons row (40×40).
   Section padding: `120px 0 300px` desktop / `100px 0 0` mobile.

Mobile hero overrides: avatar 180×205, stickers 80/60px, meta row bottom, column padding 0 10px 100px.

---

## 6. Motion System

### 6.1 Global language

Dominant spring: **`{ type: "spring", duration: 1.6, bounce: 0 }`**.
Appear pattern: `opacity: 0.001 → 1`, `y: 10 → 0`.
Staggered appear delays in use: `.05 / .2 / .25 / .3 / .4 / .5 / 1 / 1.4 / 2`.
Gesture springs: **`{ bounce: 0.2, duration: 0.8 }`** (arrow/blog) and **`{ bounce: 0.2, duration: 1.2 }`** (project card).

### 6.2 Load timeline (home, from Framer appear data)

| Element | Initial | Animate | Spring | Delay |
|---|---|---|---|---|
| Nav pill | opacity .001, y 10 | fade in, y 0 | spring 1.6/0 | **1.4s** |
| Avatar (desktop) | opacity .001, y 10 | fade in, y 0 | spring 1.6/0 | **1.0s** |
| Stickers | opacity .001, y 10 | fade in, y 0, rotate → 16° (right) | spring 1.6/0 | **1.4s** |
| Hero meta / CTA | opacity .001, y 10 | fade in, y 0 | spring 1.6/0 | **1.4s** |
| Avatar flip (tablet+mobile) | front `rotateY 180` / back `-180`, `scale .5`, `translateY 114` → settle | spring 1.6/0, perspective 1200 | **2.0s** |

### 6.3 Component motion specs

**RollingText** (nav links, CTAs, Submit). Each char is a `span` in an `overflow: hidden` line; a duplicate copy sits one `line-height` below via `text-shadow`. On hover: `y: 0 → -lineHeight` per char. Spring `{ type: "spring", duration: 0.4, bounce: 0 }`; per-char delay = `duration / chars * 0.35 * index` (stagger 35% of total), supports `reverse`. Spaces are `\u00A0`. `backface-visibility: hidden`.

**ProjectCard** — `whileHover` variant: image frame height **400px → 138px** (collapses), image scales to **104%** offset **-2%** (`width/height: 104%; top/left: -2%`). Spring `{ bounce: 0.2, duration: 1.2 }`. Card width 580, gap 10 between image and text.

**BlogCard** — hover scale + spring `{ bounce: 0.2, duration: 0.8 }`. Card 380×460, radius 16, image layer bottom 70%.

**Get Started / arrow links** — hover: circle grows **1px → 35px** (behind arrow), arrow icon 20px slides in from outside. Spring `{ bounce: 0.2, duration: 0.8 }`.

**Social icons 40×40** (overflow clip) — current icon exits to `top: -20px`, next icon enters from below to center (Framer variant `.hover` swaps two stacked icons).

**TestimonialCard** — 3D flip, `transformPerspective: 1200`, front/back `rotateY: ±180 → 0`, spring `{ bounce: 0, duration: 1.6 }`, per-card delays `.2 / .3 / .4 / .5` (scroll-triggered appear, staggered).

**Hamburger** — closed: three 4×4 dots, gap 3. Pressed: gap 2. Open variant: top/bottom dots stretch into 16×2 lines forming an X (`top: calc(50% - 1px); left: calc(50% - 8px)`), pressed shortens to 12px. Spring `{ bounce: 0, duration: 0.6 }` family.

**Inputs** — focus: border `--cream-30` → `--cream` (white-ish), `transition: all .2s cubic-bezier(.44,0,.56,1)`. Height 44, radius 12, padding 0 12px; textarea `resize: vertical`, min-height 140.

**ScrollFillText** — Framer scrub component. Implement with `motion`'s `useScroll({ target, offset: ["start 0.9", "start 0.1"] })` + `useTransform` driving per-word color from `--ink-50` → `--ink` (or `background-clip: text` fill sweep). `scrub: smooth` → use `useSpring` on the progress value for smoothing.

### 6.4 Runtime 10% — SSR-invisible behaviors & replication strategy

These four cannot be read from the static HTML; here's the replication plan and what to verify by recording the live site.

1. **Lenis smooth scroll.** Framer includes Lenis (CSS classes `html.lenis`, `.lenis-smooth` in SSR). Init:
   ```ts
   const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
   function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
   requestAnimationFrame(raf);
   ```
   `syncTouch: false` keeps native momentum on mobile. Anchor links (`#hero-section`, `#services`, `#contact`) must route through `lenis.scrollTo()`. **Verify**: scroll the live site and match deceleration feel (tune `lerp` 0.08–0.12 if needed).
2. **Sticker drag physics.** Framer's draggable = framer-motion `drag` with default inertia release: velocity decays, bounds resist. Implement: `<motion.img drag dragConstraints={avatarFrame} dragElastic={0.3} whileDrag={{ cursor: "grabbing", scale: 1.05 }} />` inside the hero sticky container. Rest transforms: right sticker `rotate: 16°`, left `0°` — keep rotation as a child wrapper so drag x/y never fights the rest rotation. **Verify**: how far stickers can travel + whether they spring back or stay.
3. **Page transitions.** Framer's default route change is a **crossfade** (no SSR evidence of overlay/slide). Implement with Astro `ClientRouter` + `transition:animate={fade({ duration: "0.4s" })}` on `body`/`main`. **Verify**: record Home → Work nav; if Framer uses a slide/mask instead, swap to a custom `slide()` or overlay wipe.
4. **Scroll-fill smoothing + hover variants timing.** The scrub smoothing curve and open-menu animation (nav "Open" variant: scale/fade/height?) are runtime-only. **Verify**: record menu open + quote fill; adjust `useSpring` stiffness/damping to match.

Recording checklist (side-by-side, 60fps):
- [ ] load timeline home (desktop + mobile flip)
- [ ] wheel scroll deceleration
- [ ] sticker grab-drag-release
- [ ] nav open/close
- [ ] project card hover collapse
- [ ] testimonial flip stagger
- [ ] Home → Work page transition
- [ ] giant quote fill scrub

---

## 7. Dev assets (from live site)

Logos/icons/stickers (PNG) and photos (JPG) are hotlinkable for dev:
- grain: `.../rR6HYXBrMmX4cRpXfXUOvpvpB0.png`
- avatars/photos: `.../kAftuUN9iRKwIt9M6RqZo9NS314.jpg`, `.../HH8KrojyxZx6X20z1r13CSwiiWE.jpg`, `.../HqoHkPp6dpJFdgMqUKIaAXmy7o.jpg`, `.../Y9KmJAQ4w53hsc4jJojfokLZ7D8.jpg`
- project covers (1160×800): `VNXQLcPHw9VbVzy6BDpZ8pUsaU` (Damas), `WgEHVRrQs62rgxlzrnXJJ8rr4` (Najm), + `WsYTUG4cqmLIU4lwbMUQX7FdOY`, `MG7SSqT3AUbDDMeyGynYFWvAWI`, `MWSFsHfw8FDzKSMZllibGDMY4CU`, `OLDYsHB9RMavvQrkVRNy08ZXYE`, `lxtBXj3G7Bloek83WxPY1ZUuw0Q`, `lIIjRX5gxRdY7UWw5wqIXicPOA`, `I3azeVtkvdKBGl9TX38tUdXEb0`, `ic9k42rYytbJtnRUJXdcNxCHSc`, `gN85dqTeMmVvE57UMiHhgeL4P4`, `haSjyjpt7FyCjJUBvXtmzCMSEQg`, `1C3zqERGdc7pqPIbDxtBaD4VGiQ`, `yceQCLz3chOtgu2oZRjmfEKjY`
(base: `https://framerusercontent.com/images/<id>.png`)
Replace with owned assets before production.

## 8. Implementation Order (work units)

1. Scaffold Astro + tokens + fonts + Lenis island + base layout + grain
2. Nav pill (closed/open) + RollingText
3. Hero: sticky 200vh, avatar flip, stickers drag, meta columns
4. Scroll-fill quote
5. Services rows
6. Projects grid + ProjectCard hover
7. Testimonials flip grid
8. Thoughts cards + CTA
9. Contact panel + form + social icons
10. `/work` index + `/work/[slug]` template
11. `/blog` index + `/blog/[slug]` template
12. Page transitions (ClientRouter fade) + reduced-motion fallbacks
13. Cross-breakpoint QA against recordings; pin exact type presets

## 9. Accessibility / non-negotiables

- `prefers-reduced-motion`: disable Lenis smoothing, appear springs → instant, scrub → static filled text.
- Keyboard: nav menu focusable, form usable without hover, `whileHover` effects mirrored on `:focus-visible` where they carry meaning.
- Images: `alt` from CMS fields; stickers `aria-hidden` (decorative).

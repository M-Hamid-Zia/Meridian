# Meridian — freight forwarding & trade management

A premium, editorial landing page for a freight forwarder. The page is built around one action — **Request a quote** — and one proof idea: a live route desk that shows the modes, the transit windows and the specialist who owns the lane.

The visual language follows the reference premium site: oversized serif headlines, a strict paper/ink/gold palette, hairline rules, generous negative space and film-grain texture — plus a full motion layer (intro curtain, scroll reveals, magnetic buttons, custom cursor, marquee, pinned horizontal gallery).

## Stack

- React 19 + Vite 7 + TypeScript
- **GSAP + ScrollTrigger** — hero timeline, scroll reveals, parallax, pinned horizontal rail, counters
- **Lenis** — inertia smooth scrolling, wired into the GSAP ticker so ScrollTrigger stays in sync
- `@bible-strong/avatar-react` — the route-desk avatar (contact panel, FAQ panel, "4 hour promise")
- Instrument Serif / Instrument Sans, served locally through Fontsource
- Custom SVG world map generated from Natural Earth data (`world-atlas` + `topojson-client` + `d3-geo`)

## Run

```bash
npm install
npm run dev        # vite --host 0.0.0.0
npm run build
npm run preview
```

The dev server binds to `0.0.0.0` and allows the Arena preview host.

## Motion system

| Name | Where | Notes |
| --- | --- | --- |
| Page intro | `components/Intro.tsx` | Curtain with a counter; lifts away to reveal the hero. Skipped under reduced motion. |
| Hero timeline | `components/Hero.tsx` | Masked line reveals, map fade-in, route draw (`strokeDashoffset`), staggered ports, then scrub parallax as the hero leaves. |
| Scroll reveals | `hooks/useReveal.ts` | `data-reveal` (`up` / `fade` / `mask` / `scale`), `data-reveal-delay`, `data-line` rules, `data-parallax`, `data-count` counters. |
| Custom cursor | `components/Cursor.tsx` | Gold ring with lag + exact dot. Grows into a labelled bubble over `[data-cursor="view"]` (services deck, network rail) and any link/button. |
| Magnetic buttons | `hooks/useMagnetic.ts` | Primary buttons, nav links and the hero scroll cue pull toward the pointer, spring back on leave. |
| Marquee | `components/Marquee.tsx` | Seamless duplicated track, xPercent loop, slows on hover. |
| Services deck | `components/Services.tsx` | Hover/focus row expands its detail; the sticky frame cross-fades to that service's image. |
| Horizontal gallery | `components/Network.tsx` | ScrollTrigger `pin: true` + `scrub` translating a card rail; progress bar and counter driven by `self.progress`. Falls back to snap-scrolling on touch. |
| Menu | `components/Header.tsx` | Clip-path curtain, staggered oversized links, scroll progress hairline in the nav. |
| Page transitions | global | Section-to-section anchored navigation animates through Lenis; the intro curtain doubles as the page-load transition. |

Every effect is gated on `prefers-reduced-motion`: the intro is skipped, Lenis and the cursor are not started, counters print their final value and all reveals resolve to the finished state.

## Design system

- **Palette (unchanged):** midnight `#0b0b0c`, warm paper `#f4f1ea`, gold `#c8a24a`. No gradients as surfaces, no glass cards, no drop shadows — depth comes from rules, spacing and photography.
- **Type:** Instrument Serif for headlines (up to 128px, `-0.038em` tracking), Instrument Sans for body and labels. Labels are 10–11px, `0.18em` uppercase.
- **Rhythm:** one `min()` wrapper (`--max: 1440px`), fluid section padding, hairline dividers, 1px borders and a 3px gold accent rule on hover.
- **Buttons:** pill-shaped, with a vertical wipe fill on hover (`::before` translate) and a trailing arrow that nudges.
- **Texture:** a 5% `overlay` film-grain layer over the whole page, disabled under reduced motion.
- **Photos:** black-and-white editorial treatment, lazy-loaded, with 700w mobile variants; the tall panels use a slow parallax.

## Page sections

1. **Hero** — "Every route, accounted for." with the animated dotted meridian map, live-network caption, 38 / 140+ / 2.1M counters and a scroll cue.
2. **Proof bar** — 38 years, 140+ countries, 99.2% on-time clearance, 24/7 route desk.
3. **Client marquee** — infinite band of client categories.
4. **Route desk** — a real three-step tool returning FCL, LCL, air, rail and road options, with transit windows, frequency, a recommendation and a lane preview map. "Talk to a specialist" pre-fills the quote form.
5. **Services** — ocean, air and customs as an interactive deck with a sticky image frame.
6. **Case study** — Rotterdam–Chicago, 9 days saved. Statement layout, counters, inline full story.
7. **Network** — pinned horizontal rail with 12 owned offices, a network map card and scroll progress.
8. **The people** — the 4-hour promise (avatar), two anonymized client voices and three desk stats.
9. **Questions** — six objection-handling questions with an accessible accordion.
10. **Contact** — the route-desk avatar with a quote, credentials, and a six-field quote form plus "what happens next".
11. **Footer** — closing CTA, sitemap, credentials, oversized wordmark.

## Avatar

The `@bible-strong/avatar-react` runtime has three quirks that are easy to trip over, so `src/avatar.json` is generated and asserted rather than hand-edited:

```bash
npm run build:avatar     # scripts/build-avatar.mjs → validates → writes src/avatar.json
```

1. **Scale.** Everything is painted into a fixed `-150 … 150` user space. A definition authored at "1.5 units" renders as an invisible dot.
2. **`body.primary.width` is not a radius.** The runtime uses a sub-linear curve (`200 → r 103`, `232 → r 122`, `280 → r 150`). Anything above ~270 fills the whole 300-unit box, which flattens the face against the frame and hides the decorative ring. The build script asserts the resolved radius stays in a sane band.
3. **`eyes.spacing` is an arc length around the head, not a pixel gap.** Low values (~40) stack both eyes in the centre; ~120 places the pair just inside the head edge. Keep `perspective` ≤ 2 or the pair looks skewed.

The runtime draws a body plus exactly two eye shapes — there are no brows, nose or mouth — so the face is deliberately an abstract mark: wide, soft ovals that read as a calm character from 64px to 104px.

Expressions: `neutral`, `focused`, `satisfied`, `look`. Animations: `idle` (loop with blinks), `greet` (plays on hover/focus), `think`.

`MeridianAvatar` also hides the runtime's first frame (a bare gold disc with no eyes) until the eye paths are actually drawn, and under `prefers-reduced-motion` it renders a calm static expression instead of a moving one — it is never blank and never looping.

## Route selector data

`src/data/routes.ts` holds the region pairs, cargo types, ocean/air/rail transit matrices and the recommendation logic. The lane result is deterministic and updates as the three selects change. The mini map uses the same Natural Earth projection as the hero map.

## Map generation

```bash
node scripts/generate-map.mjs
```

The script projects the Natural Earth land polygons, samples a 1.8° dot grid, projects 38 ports and builds seven curved trade routes. It writes `src/data/mapData.ts`.

## Content notes

- Client names, quotes and case-study attribution are anonymized because the brief did not supply approved names. Replace them with real, approved client details before launch.
- The photographs are Pexels stand-ins (plus one derived crop) for the client's own warehouse, route desk and port. Replace them with the client's own photography.
- The address is district-level (Waalhaven, Rotterdam) and the phone number is a placeholder. The brief asked for real street address, phone and registration/license numbers; add them before launch.
- The route-selector transit windows are indicative planning figures, not live carrier schedules. The page says so next to the tool.

## Credits

Photographs via Pexels. Map data: Natural Earth. Avatar runtime: `@bible-strong/avatar-react`. Motion: GSAP + ScrollTrigger, Lenis.

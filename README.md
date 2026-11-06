# Meridian — freight forwarding & trade management

A premium, editorial landing page for a freight forwarder. The page is built around one action — **Request a Quote** — and one proof idea: a live route selector that shows the modes, transit windows and the specialist who owns the lane.

## Stack

- React 19 + Vite 7 + TypeScript
- GSAP for the one-off route draw and the route-result transition
- `@bible-strong/avatar-react` for the small route-desk avatar in the contact and FAQ panels
- Instrument Serif / Instrument Sans, served locally through Fontsource
- Custom SVG world map generated from Natural Earth data (`world-atlas` + `topojson-client` + `d3-geo`)

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

The dev server binds to `0.0.0.0` and allows the Arena preview host.

## Design system

- **Palette:** flat midnight `#0b0b0c`, warm paper `#f4f1ea`, gold `#c8a24a`, ink `#0b0b0c`. No gradients, glass, glows or shadows.
- **Type:** Instrument Serif for headlines, Instrument Sans for body and labels. Headlines 48–88px, body 16–17px, labels 10–11px.
- **Grid:** 12 columns, 24px gutters, one `.wrap` at 1280px. Splits start on column 7; cards start on column 1.
- **Motion:** GSAP draws the dotted trade routes once on load and animates the route-result panel on submit. Hover states are CSS-only. `prefers-reduced-motion` shows the finished state and skips the GSAP tweens.
- **Cursor companion:** a small gold route-desk avatar follows the cursor after the hero on desktop. It plays a short `greet` animation on click and over links, and hides over form fields, the nav and the footer. It is disabled on touch devices and under reduced motion.
- **Photos:** black-and-white editorial treatment, lazy-loaded, with 700w mobile variants.

## Page sections

1. **Hero** — “Every route, accounted for.” with the animated dotted meridian map and the 38 / 140+ / 2.1M trust strip.
2. **Proof bar** — 38 years, 140+ countries, 99.2% on-time clearance, 24/7 route desk.
3. **Route selector** — a real three-step tool. It returns FCL, LCL, air, rail and road options with transit windows, frequency and a recommended mode. “Talk to a specialist” pre-fills the quote form.
4. **Services** — ocean, air and customs, each with a specific proof point and a lane-check action.
5. **Case study** — Rotterdam–Chicago, 9 days saved, 2.3-day customs clearance, 99.2% on-time. The full story expands inline.
6. **Network** — the second map, with 12 owned offices and 38 partner ports. Hover a pin for the hub name.
7. **Route desk team** — the 4-hour response promise and two anonymized client voices.
8. **FAQ** — six objection-handling questions with an accessible accordion.
9. **Contact** — six-field quote form, route-desk avatar, response promise and a three-step “what happens next” row. The same avatar appears as a cursor companion after the hero.
10. **Footer** — Rotterdam district address, FIATA / IATA / customs broker credentials, registration numbers on request, and the photo credit.

## Route selector data

`src/data/routes.ts` holds the region pairs, cargo types, ocean/air/rail transit matrices and the recommendation logic. The lane result is deterministic and updates as the three selects change. The mini map uses the same Natural Earth projection as the hero map.

## Map generation

```bash
node scripts/generate-map.mjs
```

The script projects the Natural Earth land polygons, samples a 1.8° dot grid, projects 38 ports and builds seven curved trade routes. It writes `src/data/mapData.ts`.

## QA

- `perf.mjs` against the production build: **0 FAIL**, 2 WARN (JS parsed, font files). Total transfer ~347–420 KiB; LCP ~208–276ms on the CPU-rendered check.
- `check.mjs` at 1440, 1024, 820, 768 and 390: hero exactly one screen at every width; all sections within two screens; no horizontal scroll.
- `consistency.mjs` at 1440: 2 FAIL, both intentional — the user-supplied headline “Every route, accounted for.” does not contain the category noun, and the proof bar is a deliberately thin band rather than a full screen. 12 WARN, mostly the same intentional band, the hero map bleed, and the anonymized photo credits.

## Content notes

- The client names, quotes and case-study attribution are anonymized because the brief did not supply approved names. Replace them with real, approved client details before launch.
- The photographs are Pexels stand-ins for the client’s own warehouse, route desk and port. Replace them with the client’s own photography.
- The address is district-level (Waalhaven, Rotterdam). The brief asked for a real street address, phone and registration/license numbers; those were not supplied, so the page uses “Registration numbers available on request” and a quote form instead of a phone number. Add the real details before launch.
- The route-selector transit windows are indicative planning figures, not live carrier schedules. The page says so next to the tool.

## Credits

Photographs via Pexels. Map data: Natural Earth. Avatar runtime: `@bible-strong/avatar-react`.

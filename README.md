# Meridian — freight forwarding & trade management

A premium, editorial landing page for a freight forwarder. The page is built around one action — **Request a quote** — and one proof idea: a route desk grounded in its home port, with one named specialist owning every lane.

The visual language follows the reference premium site: oversized serif headlines, a strict paper/ink/gold palette, hairline rules, generous negative space and film-grain texture — plus a full motion layer (intro curtain, scroll reveals, magnetic buttons, marquee, pinned horizontal gallery).

## Stack

- React 19 + Vite 7 + TypeScript
- **GSAP + ScrollTrigger** — hero timeline, scroll reveals, parallax, pinned horizontal rail, counters
- **Lenis** — inertia smooth scrolling, wired into the GSAP ticker so ScrollTrigger stays in sync
- `@bible-strong/avatar-react` — the route-desk avatar (contact panel, FAQ panel) and the floating route-desk guide
- **Single-page build** — `index.html` → `src/main.tsx`. Every CTA on the site (hero, nav, menu, footer, route desk, case study, FAQ) smooth-scrolls to the quote section (`#contact`, section 07). There is no separate quote route. Every CTA on the site (hero, nav, menu, footer, route desk, case study, FAQ, lane finder, services deck, network card, sticky bar, guide intro) lands in section 07 (`#contact`); the section 07 button itself is a real form `submit` labelled "Submit a quote".

- Instrument Serif / Instrument Sans, served locally through Fontsource
- Custom SVG world map generated from Natural Earth data (`world-atlas` + `topojson-client` + `d3-geo`)

## Run

```bash
npm install
npm run dev        # vite --host 0.0.0.0
npm run build
npm run preview
npm run build:avatar    # regenerate + validate src/avatar.json (specialist)
npm run build:guide     # regenerate + validate src/guide.json (route-desk guide)
```

The dev server binds to `0.0.0.0` and allows the Arena preview host.

## Motion system

| Name | Where | Notes |
| --- | --- | --- |
| Page intro | `components/Intro.tsx` | Curtain with a counter; lifts away to reveal the hero. Skipped under reduced motion. |
| Hero timeline | `components/Hero.tsx` | Masked line reveals, map fade-in, route draw (`strokeDashoffset`), staggered ports, then scrub parallax as the hero leaves. |
| Scroll reveals | `hooks/useReveal.ts` | `data-reveal` (`up` / `fade` / `mask` / `scale`), `data-reveal-delay`, `data-line` rules, `data-parallax`, `data-count` counters. |
| Magnetic buttons | `hooks/useMagnetic.ts` | Primary buttons, nav links and the hero scroll cue pull toward the pointer, spring back on leave. |
| Marquee | `components/Marquee.tsx` | Seamless duplicated track, xPercent loop, slows on hover. |
| Services deck | `components/Services.tsx` | Hover/focus row expands its detail; the sticky frame cross-fades to that service's image. |
| Network rail | `components/Network.tsx` | Pinned horizontal rail (GSAP ScrollTrigger, every screen) scrubbing through the 12 owned-hub cards plus an intro card and the map card; progress bar and counter. Small screens tighten the stage (tighter section padding and head margin, a 280px card floor, further compaction under 560px viewport height). Only reduced-motion users get a native scroll-snap swipe rail instead, with the progress bar and counter wired to the swipe. |
| Menu | `components/Header.tsx` | Clip-path curtain, staggered oversized links, scroll progress hairline in the nav. |
| Page transitions | global | Section-to-section anchored navigation animates through Lenis; the intro curtain doubles as the page-load transition. |
| Route-desk guide | `components/GuideAvatar.tsx` | A cute gold orb, bottom-left. Reacts to lane-finder / form / FAQ actions via the `meridian:guide` event, offers one-line section tips (once each per session, 6s cooldown), idles quietly from 26s, and can be dismissed for the session. Static under reduced motion. |

Every effect is gated on `prefers-reduced-motion`: the intro is skipped, Lenis is not started, counters print their final value and all reveals resolve to the finished state.

## Design system

- **Palette (unchanged):** midnight `#0b0b0c`, warm paper `#f4f1ea`, gold `#c8a24a`. No gradients as surfaces, no glass cards, no drop shadows — depth comes from rules, spacing and photography.
- **Type:** one standard rule and value — every text element on the page inherits 16px / 1.65 from `body` (`--lh-body`). Caps labels share the 16px value in 500 weight at `0.16em` tracking / 1.5 line-height (`--track-caps`, `--lh-caps`); snug tight values use 1.35 (`--lh-snug`). Hierarchy comes from the single fluid display ramp (Instrument Serif 400, 19–120px clamps, `-0.038em`), serif vs sans, weight (400/500 only, no faux bold), case, color and space — never from small text. Nothing renders below 16px.
- **Rhythm & spacing:** one standard rule and value — every padding, margin and gap is a multiple of 2px (0.125rem) written in rem, derived from the single 1rem (16px) unit. Section rhythm runs on fluid `--padt`/`--padb`/`--gut`/`--nav` clamps on the same grid, wrapped in `--max: 90rem`; hairline dividers, 1px borders and a 3px gold accent rule on hover.
- **Buttons:** pill-shaped, with a vertical wipe fill on hover (`::before` translate) and a trailing arrow that nudges. CTA labels are wrapped in spans so the text paints above the wipe.
- **Texture:** a 5% `overlay` film-grain layer over the whole page, disabled under reduced motion.
- **Photos:** black-and-white editorial treatment, lazy-loaded, with 700w mobile variants; the tall panels use a slow parallax.

## Page sections

Front matter, unnumbered on the page: the hero, proof bar and client marquee carry no numerals. The numbered chapters (eyebrow numerals) begin at the Route desk and run 01–08 in render order; the floating Back to top pill and the route-desk guide are widgets, not numbered chapters.

- **Hero** — "Every route, accounted for." over a full-bleed animated dotted meridian map (flowing routes, pulsing office rings) as the section background — a one-sentence promise and a Request a Quote CTA.
- **Proof bar** — the four headline stats (38 years / 140+ countries / 99.2% on-time delivery / 24/7 route desk) as oversized serif numerals with a small gold tick, stacked over micro labels; the strip is framed top and bottom by hairline rules.
- **Client marquee** — infinite band of client categories.

01. **Route desk** — editorial statement section: the headline (“Find your trade lane.”) with a short desk statement (home port, one owner per lane) and a tall full-color home-port dusk banner (`routes-harbor.jpg`) with the section headline and desk statement laid over the image on an ink scrim. Laid over the harbor image beneath the heading and intro sits the lane finder (`RouteFinder.tsx`): an ink console panel with rounded dark selects (origin, destination, cargo) that computes the recommended mode live from the shared lane engine (`src/data/routes.ts`); the transit estimate is set in large serif (paper for the mode, gold italic for the days) beside a pinging-dot route label, with a Request a quote link to the contact panel.
02. **Services** — ocean, air and customs as an interactive deck; the sticky right frame is an arch-masked, full-color photograph (AI-generated, `services-ocean.jpg` / `services-air.jpg` / `services-customs.jpg`) with a thin gold echo arch and a hairline index caption that swaps with the active service (Capability — {title} · 01 / 02 / 03). Hidden below 940px.
03. **Case study** — Rotterdam–Chicago, 9 days saved. Ink section; copy left (lede, hairline stats row — 9 / 2.3 with a vertical separator — gold-tinted numerals, expandable full story, NDA-marked quote) and the arch-masked port photograph on the right with a thin gold echo arch.
04. **Network** — pinned horizontal rail travelling Rotterdam → the 12 owned hubs, the line “12 owned offices. 60+ partner agents. One accountable contract.”, and the Natural Earth map (`WorldMap variant="network"`) as the final card. The rail ends in a foot bar with the gold scroll-progress line and a `01/13` counter, plus a ghost `Network` wordmark anchored bottom-right, fully inside the section. All cards are rounded at 16px, overflow-clipped (the gold hover bar follows the radius); the OWNED chip is a pill.
05. **The people** — paper section, arch-masked portrait of the route desk (`route-desk-portrait.jpg`, AI-generated) with a thin gold echo arch, two numbered hairline-indexed client voices (NDA), and a hairline-top stats row (24/7 / 12) with a vertical separator.
06. **Questions** — objection-handling questions in the house section-head layout (title left, lead right): narrow 880px list, serif-italic numerals, gold-tinted rounded answer blocks, circular gold-tinted plus on open, and a dark pill smooth-scrolling to the quote section (#contact).
07. **Contact** — paper section like the people block. Rounded split panel card (20px radius, clipped): dark concierge aside (gold route-desk label, named-specialist strip, serif quote, index-style contact rows — office / direct / response / credentials) next to the six-field quote form (inputs and selects at 12px radius, pill submit; "what happens next" steps included). Submitting opens the mail client (see `QuoteForm.tsx`); the form carries a `tone` prop; section 07 renders it in its light tone on the paper panel.
08. **Footer** — closing CTA banner (night-cargo photography full-bleed, centered: eyebrow, "One lane. One contract. Zero surprises.", a one-line written-quote promise, then the Request a Quote button), sitemap, credentials, oversized wordmark.

- **The guide watches you** — its pupils glide toward the visitor's cursor (a rAF-lerped translation of the avatar runtime's single clip group of eye paths, applied through `--gaze-x`/`--gaze-y` CSS custom properties on the host, so the avatar runtime itself is never touched). Clicking, focusing, typing in, or choosing any form control locks the gaze onto that control for as long as it has focus, lingers ~1.4s after blur, then drifts back to the cursor. `prefers-reduced-motion` disables gaze tracking entirely. Verified end-to-end in jsdom (cursor aim converges to the clamp, focus pin, click pin, typing pin, blur-plus-linger release, and the exact eye clip paths the CSS hooks into). Honest caveat: the CSS selector assumes the runtime emits exactly one clip group containing the two eye paths; a future avatar schema producing more clip groups would need the selector widened. The user eyeballs the result on the preview.
- **Brand lockup** — the gold Meridian mark and the wordmark are unchanged; only the small `Freight & trade` tagline (`brand__sub`) under the name was reduced, now 10px/0.625rem with tightened tracking (0.14em). Both the header and footer lockup inherit it; it stays hidden ≤640px as before.
- **Back to top** — a floating gold-ringed circular button in the bottom-right corner, arrow only; appears once the visitor scrolls past the hero and sits above the mobile sticky CTA bar. Unnumbered widget, not a chapter.
- **Route-desk guide** — a cute gold orb floating bottom-left that helps, reacts and points the way. Unnumbered widget, not a chapter; see [Route-desk guide](#route-desk-guide).

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

## Route-desk guide

`src/guide.json` is authored by `npm run build:guide` (same engine, `-150 … 150` scale, validator and rules as the specialist, `scripts/build-guide.mjs`). The character is the classic house-gold plush pass, colors restored to what they were: body `#d8b65e` (gold-2), ink `#0b0b0c` eyes, the joy bloom one step lighter at `#e6c87a` — no other hues entered the system. Its position is no longer pinned: on desktop it travels the page with the scroll, drifting freely on both axes to per-section homes and easing diagonally between them (hero 60%/left → routes 34%/right → services 52%/left → case-study 26%/right → network 50%/left → team 30%/right → faq 54%/left → contact 24%/right), with a two-axis bob and a hard clamp so it can never leave the viewport; ≤640px it stays docked above the sticky CTA, and `prefers-reduced-motion` pins it to its static corner. It is deliberately cuter than the specialist: two round Mickey-style ear nodes, a leaning capsule antenna with a ball tip, two small cheek-bump nodes that break the surface just enough for the lighting to model them as cheeks, two little mitten paw nodes low on the body, plus the plush pass: a three-bump forehead fringe between the eyes and the ears, two cheek-spill puffs beside the cheek bumps, a single soft chest puff low on the belly and two paw nodes tucked past the bottom silhouette, bigger and lower eyes (58×70), a slightly cranked projection (`perspective` 1.85, still under the skew threshold) so the sphere pops, quicker blinks (2.4–4.8s) and spring-loaded transitions and a full expression vocabulary: `neutral`, `focused`, `satisfied` (happy-arc smile), `look`, `wink` (one wide eye, one scrunched arc), `delighted` (sparkle eyes with the bloom), `pleading` (puppy eyes with the bloom and a head bow), `curious` (asymmetric eyes, head tilt), `sleepy` (half-lidded doze in the idle loop), `giggle` (mismatched arcs, head cocked), `astonished` (the full-width gasp, fired mid-`celebrate`), `mischief` (opposite-signed eye angles, a cat-squint), `nervous` (tiny eyes on a microSaccade jitter; the settle beat inside `angry`), `angry` (narrowed scowl with the inner corners drawn down, head hunched, a short body shake, and the whole body — ears, antenna, cheeks, hands included — flushed brick red `#b8422f`; the one deliberate exception to the gold body, made for the mistake/alert state; fires EVERY time the form is submitted invalid), `bashful` (dropped shy gaze, opens the `pleading` sequence), `brave` (chin-up open gaze, the confident beat inside `greet`), `sleeping` (shut eyes, head cocked 9°, motionless), `watching` (alert 57×50 gaze with a microSaccade tracking flicker), `searching` (high wide scan, head up, microSaccades), `bored` (dead-flat 52×16 lids, utterly still), `happy` (the gentle 52×38 squint between content and joy) and `excited` (54×72 shimmering wide eyes, head popped up, microSaccades). Animations: `idle` (an eight-beat story loop — neutral → watching → neutral → bored → neutral → sleeping → neutral → satisfied), `greet` (happy → brave → wink → delighted → satisfied), `think` (focused → searching → curious → look), `celebrate` (delighted → astonished → excited → giggle → delighted, on a sent quote), `giggle` (on an FAQ open), `pleading` (bashful → pleading → satisfied, on the idle "Need the desk?" ask) `nervous` (the nervous settle) and `angry` (on every failed form validation — scowl, hunch and a tiny cartoon tremble, then it grumbles back to calm). All six of the newest faces are wired into these loops; none is authored-but-unused. The widget around it layers a soft gold halo, two twinkling clip-path sparkles, a small white specular gloss (CSS ellipse over the forehead, clear of the eyes), catch-light glints in both pupils (two warm-white dots each, placed from the neutral eye-path bounds, gliding with the same gaze vector so they stay glued to the pupils — HTML overlay spans, not engine geometry — and hidden automatically on shut or squinting lids: sleeping, bored, satisfied, giggle, happy, angry, wink, mischief, bashful, sleepy), a hand-drawn mouth (the engine knows no mouth — overlay SVG with six variants: `soft`, `flat`, `smile`, `frown`, `worried`, `o`; one 250ms poll of the live expression picks the variant — joy faces grin, bored/nervous/worried quiver or flatten, astonished and sleeping wear the little `o`, angry frowns; placement 57.5% down the face, clear of the glints and the eyes), a faint contact shadow under the orb to ground it, and a springy hover grow. All of it collapses to a calm static face under `prefers-reduced-motion`. Same two-eye limitation, same blend of abstract face and authored motion.

The guide is not decoration. `src/lib/guide.ts` exposes `emitGuide()` and the `meridian:guide` window event; any interactive piece of the page can answer the user:

- **Lane finder** (`RouteFinder.tsx`) — the first select change emits once per session: "Live estimate. A named specialist confirms in writing." with an `Ask the desk` CTA and the `think` cue.
- **Quote form** (`QuoteForm.tsx`) — the CTA is labelled "Submit a quote" and submits the form; every other CTA on the site lands here in section 07 instead of submitting. First focus anywhere in the form emits "Six fields. I will keep it painless." (`think`); the fields themselves never scold — no blur-time reactions at all; the angry scowl fires in exactly one place: clicking Submit a quote with invalid or empty fields. Technically the hook is the `invalid` event (attached via `onInvalidCapture` on the form, because an invalid form never reaches `onSubmit` — the browser blocks it during interactive validation), so the native warning popup still shows and the scowl fires with it (hunch, shake, brick-red body, settling through `nervous`) — and the guide names the actual mistakes: it inspects each invalid control, maps it to its visible label, and states the reason ("Email isn't a valid email.", "Origin is empty.", or, when everything is simply blank, "Name, Company, Email, Origin and Destination are missing."). No generic grumble at the failure; the fields are called out by name. The text fields are deliberately constrained beyond raw `required` — `minLength` 2 plus a Unicode-aware pattern that demands at least one letter or digit — so obvious mistakes ("!!!", "   ", "Q") count as browser-invalid and produce the same warning (and the same scowl); legitimate international input (München, 中国, O'Neill) passes untouched. Free prose like "Rotherdom" for "Rotterdam" remains undetectable and is deliberately left to the specialist call, not to fake client-side cleverness. A valid submit posts the inquiry directly to FormSubmit's AJAX endpoint (`https://formsubmit.co/ajax/hello@meridian.example`) as JSON (`name`, `company`, `email`, `origin`, `destination`, `cargo`, plus `_subject` "Quote request: <origin> to <destination>" and `_captcha: "false"`) — no mail app opens and the visitor never leaves the page. On HTTP 200 the form flips to a submitted state: the button disables and reads "Quote submitted", and an inline status line (role=status) and the guide both say, verbatim, "Your quote has been submitted. The desk answers within one business day." (`celebrate`); a "Send another inquiry" text-link appears to reset the form for the next request. A failure (network down, FormSubmit error) shows retry copy plus a `nervous` guide line and leaves the button enabled; editing any field after submitting re-arms it; nothing pretends to have been sent when it has not. Invalid clicks are still stopped by the browser before any network call (popup plus the named angry scowl). Honest caveat, and it is fundamental, not incidental: `hello@meridian.example` is an RFC 2606 reserved, unrouteable address that the site owner chose deliberately for this build, so FormSubmit can never activate the destination and NO INQUIRY IS EVER DELIVERED to anyone — the POST succeeds against FormSubmit's endpoint and stops there. To make delivery real, activate a FormSubmit destination (or wire any real endpoint) and change the single `ENDPOINT` constant in `QuoteForm.tsx`; nothing else needs to move.
- **FAQ** (`Faq.tsx`) — the first open emits "Short, honest answers. If you need more, ask the desk." with an `Ask the desk` CTA (`giggle`).
- **Section tips** — an IntersectionObserver (rootMargin `-35% 0px -35% 0px`) shows one one-line tip per chapter section, once per session each, yielding to action messages for 6s.
- **Intro and idle** — a hello after ~1s (`greet`, wink and all), a quiet rotation from 26s whose last tip fires `pleading` (puppy eyes), and a paper bubble with a gold `.text-link` CTA (`#routes` / `#contact` through Lenis). `role="status"` with `aria-live="polite"`; the × hides the guide for the current page view only, so a reload always brings it back and the corner can never go permanently mute.
- **Stepping aside** — on phones it docks above the sticky action bar at 62% scale (it never silently disappears), scales to 85% at 940px and below, and retires while the footer or the full-screen menu is showing.

Nothing here tracks the cursor or the pointer. Under `prefers-reduced-motion` the orb renders a calm static face, bubble changes are instant, and the hint timers still run.

## Route selector data

`src/data/routes.ts` holds the regions, cargo types and lane math used by the quote form (`QuoteForm.tsx`) and the route-desk lane finder (`RouteFinder.tsx`). The hero, network and case-study maps share an Natural Earth–style dot projection (`src/data/mapData.ts`).

## Map generation

```bash
node scripts/generate-map.mjs
```

The script projects the Natural Earth land polygons, samples a 1.8° dot grid, projects 38 ports and builds seven curved trade routes. It writes `src/data/mapData.ts`.

## Content notes

- `trade-compliance.jpg` was an AI-generated stand-in for a static services grid and is no longer referenced by the site. `air-freight.jpg` is now referenced by the footer CTA banner. The photographs `route-port.webp` (golden gantry cranes, ocean), `air-crane.webp` (shipyard cranes mislabeled as air cargo) and `services-warehouse.webp` (Dreamstime-watermarked warehouse, trade compliance) have been deleted and replaced by AI-generated capability images for each service. Earlier Dreamstime-watermarked stock (`route-desk.webp`/`route-desk-700.webp`/`services-warehouse.webp`) was likewise unreferenced; `route-desk.webp` was previously wired up with alt text claiming it showed the route specialist. The old `services-warehouse-700.webp` (mislabeled desk photo) has been deleted; section 05 now references `route-desk-portrait.jpg`, an AI-generated portrait of the route desk made for this build. `case-port.webp` has been replaced by `case-study-port.jpg` (section 03), an AI-generated dusk port photograph made for this build; the unverified stock file was deleted. `routes-harbor.jpg` (section 01 banner, 2172×724) is likewise AI-generated and took over the role of the deleted `route-port.webp`.

- Client names, quotes and case-study attribution are anonymized because the brief did not supply approved names. Replace them with real, approved client details before launch.
- The photographs are Pexels stand-ins (plus one derived crop) for the client's own warehouse, route desk and port. Replace them with the client's own photography.
- The address is district-level (Waalhaven, Rotterdam) and the phone number is a placeholder. The brief asked for real street address, phone and registration/license numbers; add them before launch.
- Transit windows and schedules are discussed with a specialist; the quote form asks the visitor to confirm them in the mail it prepares. Nothing on the page presents live carrier schedules.

## Credits

Photographs via Pexels. Map data: Natural Earth. Avatar runtime: `@bible-strong/avatar-react` (specialist and guide). Motion: GSAP + ScrollTrigger, Lenis.

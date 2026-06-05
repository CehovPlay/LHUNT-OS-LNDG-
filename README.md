# Loadhunt Scroll Landing

React + Vite landing page for Loadhunt / LoadHunter ecosystem.

## Run locally

```bash
npm install --registry=https://registry.npmjs.org/ --no-audit --no-fund
npm run dev
```

Then open:

```text
http://localhost:5173/
```

## Build

```bash
npm run build
```

## Notes

- Do not commit `node_modules`.
- Do not commit `dist` unless deploying static build manually.
- Large frame/image assets are stored in `public/`.

---

# Loadhunt Scroll Landing

React + Vite + GSAP ScrollTrigger + Lenis + Canvas image sequence.

## Frames included

- public/frames: 97 JPG frames
- public/frames-2: 97 JPG frames
- public/frames-3: 97 JPG frames

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/
```

## v3 changes

- Removed duplicated top-left hero intro text.
- Added interactive cursor label: `Scroll to explore`.
- Kept improved `What we solve` section and animated globe block from v2.

## v4 changes

- Reworked Network globe block: no borders, no boxed background, centered text composition.
- Replaced custom CSS globe with a Cobe/GitHub-style globe inspired by Aceternity GitHub Globe.
- Added top-to-bottom globe fade mask: full opacity at top, fading to transparent at bottom.

## v5 changes

- Global typography switched to DM Sans.
- Replaced broken Cobe globe with amCharts 5 rotating orthographic globe.
- Removed globe pin/label and longitude/latitude grid.
- Globe is masked from 100% opacity at the top to 0% opacity at the bottom.

## v6 changes

- Header is now fixed/static at the top of the viewport.
- Typography refined globally: DM Sans, less aggressive negative letter spacing, improved line-height.
- Globe continents changed to white.
- Globe fade mask now runs north-to-south: north/top 100%, south/bottom 0%.
- Products section rebuilt in an editorial industrial grid style inspired by the provided reference.
- Added footer.

## v7 changes

- Footer now has a ripple background effect inspired by Aceternity Background Ripple Effect.
- Main layout blocks capped at 1920px width.
- Products section cards now stack on scroll using sticky card-stack behavior.

## v8 changes

- Rebuilt header as a resizable navbar inspired by Aceternity Resizable Navbar.
- Navbar starts wide/transparent and shrinks into a centered glass pill after scroll.
- Added mobile hamburger panel with animated toggle.

## v9 changes

- Resizable navbar refined to match the Aceternity behavior more closely: wide transparent nav on top, compact glass pill on scroll.
- Site content width changed to 1440px while backgrounds remain full width.
- Hero center text typography fixed: more letter spacing, taller line box, no descender clipping.
- Network heading typography refined and all major text blocks now reveal on scroll.
- Removed the visual gap between the globe section and the Products section.

## v10 video update

- Replaced old image rows with frames extracted from 4 uploaded MP4 files in order:
  1. Start-1.mp4
  2. continue-2.mp4
  3. continue-3.mp4
  4. finish-4.mp4
- Extracted via ffmpeg at 24fps, 1920px wide, Lanczos scaling, high-quality JPG.
- Added 12-frame crossfade transition between each video row.
- Updated canvas image sequence to 4 folders and 424 total frames.


## v11 clean video sequence

- Rebuilt all video frames directly from the 4 source MP4 files.
- Removed artificial crossfade/interpolated frames because they caused visible ghosting and jumps between scenes.
- Each sequence now contains the original 97 frames.
- Canvas image smoothing is enabled.


## v15 UI/UX changes

- Product cards stack from smaller to larger while scrolling.
- Removed card shadows and gray side boxes in the Products heading.
- Added stronger scroll reveal animations for text similar to the coin.loadhunt.ai motion direction.
- Added full viewport video statement section after Products with 1080px height and 28% dark overlay.
- Content width is capped at 1440px while backgrounds remain full width.


## v19 UI/UX updates

- Added full white preloader with centered glowing purple progress line.
- Hero title now breaks before "starts here" and stays visible after it appears.
- Problem section now uses the fragmentation sentence as a subtitle under the main heading.
- Current reality and Loadhunt approach cards now span the full content width in a two-column layout.
- Product cards keep the current tilt/hover behavior, with text on the left and mockup image on the right.
- Main display phrases now share the same size scale as the hero title.


## v20 UI polish pass

- Refined global typography rhythm, display title scale, section gutters, and line-height.
- Polished Problem section into cleaner two-card layout with better spacing and glass surfaces.
- Tightened Network, Products, Video statement, and Footer title sizing to one shared display scale.
- Improved Product carousel card sizing, copy spacing, image side, and responsive behavior while preserving tilt/hover.
- Cleaned loader/header/section spacing for a more premium landing-page feel.


## v21 interaction polish

- Text reveal animations now reverse when scrolling back up.
- Navbar collapses into logo-only state after scroll.
- Default navbar Products item now has a two-block mega dropdown.
- Navbar logo replaced with the provided SVG logo.
- Added Matter.js physics geometry section after the video statement block.


## v22 floating geometry update

- Removed gravity from the Matter.js geometry system.
- Converted the section from boxed canvas to a full viewport floating geometry stage.
- Shapes now levitate with zero gravity and gently shift based on scroll progress.
- Restyled geometry closer to the provided reference: cream/peach background, soft gradient blobs, pills, polygon, outline linework, small blue accent shapes.


## v23 no-matter quick-start

- Removed `matter-js` dependency to avoid npm timeout on clean machines.
- Floating geometry now uses GSAP + requestAnimationFrame only.
- Same visual direction: full viewport geometry, no gravity, scroll-reactive levitation.


## v24 nav and motion-system corrections

- Refined collapsed navbar to a compact logo-only pill.
- Rebalanced default navbar width, spacing, logo placement, and CTA sizing.
- Removed blue shapes from Motion System.
- Changed orange/peach geometry tint to #6F5197.
- Removed icons from geometry shapes.
- Geometry shapes are visible immediately instead of revealing only when entering viewport.


## v25 cleanup

- Rebuilt navbar sizing and spacing.
- Fixed Products mega dropdown layout; nested product links no longer inherit nav-pill styles.
- Collapsed navbar returns to expanded state automatically when scrolling back to top.
- Replaced product card mockup images with neutral placeholders.
- Fixed footer title clipping by increasing visible text mask/line box.


## v27 navbar + LHUNT transition placement

- Reduced navbar and mega dropdown size.
- Added hover bridge so Products dropdown does not disappear when moving cursor down.
- Navbar now collapses only while scrolling down and expands when scrolling back up.
- Moved LHUNT U-tunnel transition before Our ecosystem products.
- Polished LHUNT transition timing, 3D text depth, and tunnel zoom feel.


## v28 audit implementation

- Removed LHUNT transition section.
- Added Trust Metrics section.
- Added Who it is for section for carriers, dispatchers, and brokers.
- Added lightweight scroll-based letter bridge transitions between major sections.
- Added final CTA section before footer with Book demo / Join early access.
- Added realistic generated product mockup PNGs for product cards.
- Added lazy hero frame preload: first frames load with priority, rest loads in batches after idle.
- Added mobile layout polish for new blocks.


## v29 navbar + dotted glow bridge sections

- Updated the two letter transition sections to 1080px height on desktop.
- Replaced their background with a full-section dotted glow background inspired by Aceternity's Dotted Glow Background.
- Rebuilt the navbar closer to Aceternity Navbar Dark Shadow: tactile dark ridge/shadow surface, Products and Resources dropdowns, compact shadows, hover bridge.
- Kept scroll-direction behavior: collapses while scrolling down, expands again when scrolling upward.


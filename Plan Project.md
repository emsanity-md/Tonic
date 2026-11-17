# Tonic — Project Plan

> **Tonic: Find your note. Sing in tune, tune any string.**

A mic-first chromatic tuner for voice and strings. No accounts, no uploads — the microphone stream stays in the browser.

---

## 1. Product definition (derived from the README)

| | |
|---|---|
| **What it is** | A browser tuner. You sing or play a string, it tells you which note you are on and how far off you are. |
| **Who it's for** | Singers practicing pitch, guitarists/bassists/ukulele and bowed-string players tuning up, teachers, beginners who can't yet hear "close enough". |
| **Core value** | It removes guesswork. You get a note name and a number in cents, not a vague "sounds fine". |
| **Differentiator** | Voice *and* strings in the same tool, instrument presets that tell you which string you're aiming at, and a privacy stance that is architectural: no user data at all. |
| **Monetization** | None. No pricing page, no tiers. |
| **Data** | **No user data, no database.** Audio is analyzed on-device; preferences (theme, last instrument, reference pitch) live in `localStorage` only. |

---

## 2. Stack

| Piece | Choice | Note |
|---|---|---|
| Framework | Next.js (App Router, TypeScript, latest stable) | Scaffolded in a temp dir, then moved into this repo so `.git` and `README.md` are preserved. |
| Styling | Tailwind CSS v4 | Design tokens in `globals.css` via `@theme`. |
| Components | shadcn/ui | Button, Accordion, Badge, Separator, Toggle/Switch, Tabs, Tooltip. Nothing restyled into something it isn't. |
| Animation | reactbits.dev patterns | Copied in and adapted (license-permissive), not installed as a package. Wrapped by `prefers-reduced-motion`. |
| Motion runtime | `motion` (Framer Motion successor) | Required by the reactbits components used. |
| Icons | `lucide-react` | 1.5px stroke, monochrome only. |
| Theming | `next-themes` | Light / Dark / System. |
| Fonts | `next/font/google` | See typography below. |
| Database | **None** | Explicitly out of scope per project rules. |

**Reactbits components actually used** (restraint matters more than count):

1. `BlurText` — hero headline enters word by word. Reimplemented in pure CSS so
   it animates without hydration and never hides the h1 without JS.
2. `InfiniteScroll` — the supported-instrument strip, reduced to one keyframe.
   The track is two identical halves of four list copies each (2780px per half),
   so it stays continuous past 2560px viewports; duration scales with the copy
   count to keep the speed constant. Pauses on hover, stops under reduced
   motion, and is hidden from assistive tech behind one visually hidden
   description.
3. `ScrollReveal`/`FadeContent` — section-level rise, `once: true`, and **slide
   only** (no opacity), so no content can be left invisible if JS never runs.
4. `CountUp` — tried for the `100 / ±1¢ / 0` stats and then removed: if the
   intersection observer missed (fast scroll, jump link, reduced motion toggled
   mid-session) the figures could stay stuck at zero. A marketing number that
   can silently read `0` is a bug, not an effect, so the stats are now static.
5. `Magnet` — dropped: the page has no interactive CTA to magnetize.

Rejected on purpose: particle fields, gradient glows, aurora backgrounds, starfields, text-shimmer, spotlight following the cursor. They fight the monochrome brief.

---

## 3. Design system

### Typography — one family, two weights

**Instrument** (Google Fonts superfamily): **Instrument Serif 400** for display headings, **Instrument Sans 400 + 600** for body and UI.

- Chosen for the domain: a music app whose headings are set in an *instrument*. The serif gives the tuner a quiet, luthier-shop feel instead of a dashboard feel.
- Only weights in use: Serif 400, Sans 400, Sans 600. Nothing lighter, nothing bolder.
- Hero H1 `clamp(2.75rem, 7dvw, 6.5rem)`, line-height 0.95–1.05, tracking `-0.02em`.
- Body 16–18px, line-height 1.65. Long paragraphs capped with `max-w-[65ch]` on the `<p>` only.
- **One deliberate exception:** every preset in the instrument strip is set in a
  different face (Anton, Bricolage Grotesque, Playfair Display italic, DM Serif
  Display, Fraunces, Newsreader italic, Space Mono, plus Instrument Serif). It is
  the page's only polyphonic moment, and it exists because each instrument has a
  different voice. Those seven faces are `preload: false`, latin subset, one
  weight each; none of them is used anywhere else.
- Section labels: Sans 600, 12px, uppercase, `tracking-[0.14em]`, muted.

### Color — pure monochrome, no accent

Confirmed decision: **no accent colour at all.** Actually shipped:

- Pure grey ramps (`oklch(L 0 0)`) for surfaces, borders, text. No hue anywhere.
- Pitch state is communicated by **position, weight and contrast**, never colour:
  the gauge's in-tune zone is a heavier stroke at the top of the dial.
- Primary surface is foreground-on-background (near-black on white / near-white
  on black) — the shadcn-correct monochrome decision.
- No gradients, no coloured shadows. The inverted bands (`Why cents`, the
  "Nothing leaves the tab" card) carry rhythm instead of colour.
- Contrast measured in the browser: muted body text is **6.8:1** in light and
  **10.2:1** in dark, both above WCAG AA.

Theme selection: header control (Light / Dark / System), persisted, `suppressHydrationWarning`, icon-only on mobile.

### Full-width layout rules (non-negotiable)

- No `max-w-*`, no `container`, no `mx-auto` on any wrapper, section, header, or footer.
- Root: `w-full min-h-dvh`; `html, body` zero margin/padding; `overflow-x-hidden` on `body`.
- Every section `w-full`; backgrounds and hairlines run edge to edge.
- One padding scale, defined once:
  `px-4 sm:px-6 lg:px-10 xl:px-16` — exposed as `<Section>` + `<SectionInner>` wrappers, never repeated ad hoc.
- Grids: CSS grid with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4` — no dead side columns on ultrawide; gutters from the spacing scale only (`gap-6 → gap-10`).
- Heights in `dvh`, widths in `%`/`dvw`; no `100vw`, no `h-screen`.
- Media/canvas parents get explicit `w-full` + height.
- Spacing scale only: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128. No one-off pixel values.

---

## 4. Landing page structure (`/`)

Section list chosen for **this** product — no pricing (nothing to sell), no testimonials (no social proof exists yet).

Layouts were redesigned once the first build proved too modular: only the hero
kept its two-column composition. Every other section now has its own shape, so
the page never repeats a card grid.

| # | Section | Layout |
|---|---|---|
| 1 | **Header** | Sticky, full-width, bottom hairline. Wordmark + nav (Features, How it works, FAQ) + theme switch. |
| 2 | **Hero** | Two-column 7/5 split: headline + copy + status pill left, pitch-preview gauge right, then a full-width spec row. |
| 3 | **Presets strip** | Labelled band: fixed `PRESETS` label on the left, marquee track to its right, hairline above. |
| 4 | **Features** | Editorial split: sticky left intro column (4/12) beside six numbered ledger rows (8/12) with rules — no cards, no icons. |
| 5 | **How it works** | Process rail: horizontal hairline with dots sitting on it across three columns (a vertical rail with dots on mobile). |
| 6 | **Why cents** | Inverted band: 8/4 headline + copy, a generated **100-tick cent ruler** spanning the full width, then a ruled three-column stat row (`100`, `±1¢`, `0`). |
| 7 | **FAQ** | Indexed Q&A ledger: number, question in the left third, answer opening in a right-hand column, `+`/`×` marker at the far right. |
| 8 | **Closing CTA** | Poster: oversized serif headline (8/12) beside status + copy (4/12), closing with a four-cell ruled fact strip. |
| 9 | **Footer** | Wordmark + tagline, section anchors, theme switch, colophon line. |

Behavioral rules: only one focus ring per view, no autoplaying media, every animation gated behind `prefers-reduced-motion`, no layout shift (fixed aspect boxes for the gauge and strip), semantic landmarks, real `h1 → h2 → h3` order, keyboard-reachable controls, `aria-live` reserved for the gauge numeric readout.

### CTA destination — resolved: no links, "coming soon"

Confirmed decision: **the landing page is the only page and it only markets the
tuner.** So there is no `/tuner` route, no external link and no fake button.

- Every `href` on the page is an in-page anchor (`#features`, `#how-it-works`,
  `#faq`, `#top`). Verified: zero external links, zero route links.
- The hero and the closing band carry the "Coming soon" message as **status**,
  not as a button — a non-interactive pill with a slow pulse dot.
- No signup form, because collecting an address would mean storing user data,
  which the project rules exclude.
- "Coming soon" appears exactly twice (hero, closing band) so the message is
  unambiguous without becoming a refrain.

---

## 5. Feature roadmap (post-landing)

**Phase 2 — the tuner (core)**
- `getUserMedia` mic permission flow with clear pre-prompt and denial recovery.
- Pitch detection: autocorrelation / McLeod (YIN-family) on an `AnalyserNode`, ~60 fps, RMS gate to ignore silence.
- Note mapping + cents calculation, smoothing with hysteresis so the needle doesn't twitch.
- SVG needle + cents bar + note/octave readout + frequency.
- Web Audio reference tones (sine + gentle attack), A4 adjustable 415–445 Hz.

**Phase 3 — instruments**
- Presets: guitar, bass, ukulele, violin, viola, cello, mandolin, chromatic.
- String-by-string mode: detect nearest target string, highlight it, "next string" step-through.
- Custom / alternate tunings (drop D, DADGAD, half-step down), saved to `localStorage`.

**Phase 4 — practice aids**
- In-tune hold meter (e.g., hold within ±3¢ for 3 seconds) with a quiet confirmation.
- Session streak + last-note history, `localStorage` only.
- Metronome with tap tempo (shares the AudioContext).

**Phase 5 — platform**
- PWA: installable, offline after first load, `display: standalone`.
- Wake-lock so the screen stays on while tuning.
- Keyboard/mouse tuning fallback for devices without a usable mic.
- Optional capo/transpose display.
- Accessibility pass: color-independent pitch feedback (needle position + number, never color alone), full screen-reader readout.

**Deliberately not planned:** accounts, cloud sync, analytics on audio, uploading recordings, any server database.

---

## 6. Build order

1. Scaffold Next.js + TS + Tailwind v4 in a temp dir → move into repo, keep `.git` + `README.md`.
2. `.gitignore`: `node_modules`, `.next`, `out`, `build`, env files, `.vercel`, `*.tsbuildinfo`, `.DS_Store`, `next-env.d.ts` debate (kept), editor + OS junk, test artifacts.
3. Tokens, fonts, `section` wrapper, theme provider + toggle.
4. shadcn primitives (`button`, `accordion`, `badge`, `separator`, `toggle-group`).
5. Sections 1–10 in order.
6. Verify (below), then a11y + reduced-motion pass.

## 7. Verification (done)

Run, not assumed:

- `npm run build` clean; `npx tsc --noEmit` clean; `npx eslint src` clean.
- Headless Chrome (Playwright, real Chrome channel) screenshots at **360 / 768 /
  1280 / 1920 / 2560** px in light and dark — written to `.verify/` (gitignored).
- `documentElement.scrollWidth === clientWidth` at all ten combinations: **no
  horizontal scrollbar**.
- Padding scale measured in the browser: 16 / 24 / 64 / 64 / 64 px, identical for
  header, every section and footer.
- Source grep: no `max-w-*`, `mx-auto`, `container`, `100vw`, `h-screen`,
  gradient utilities.
- Contrast measured from painted pixels: 6.8:1 light, 10.2:1 dark.
- Keyboard walk: header → nav → theme switch → hero anchor → FAQ, focus visible.
- Both typefaces confirmed as `Instrument Serif` / `Instrument Sans` at runtime.

### ScrollStack integration (third pass)

The five sections below the hero (features, how it works, why cents, FAQ,
closing CTA) now render inside `ScrollStack` from reactbits.dev, adapted in
`src/components/motion/scroll-stack.tsx` + `.css`.

Configuration actually used: `useWindowScroll` (page scroll, not a nested
scroller), `smoothScroll={false}` (never hijack the wheel), `stackPosition={84}`
(below the sticky header), `itemDistance={44}`, `itemStackDistance={16}`,
`itemScale={0.015}`, `baseScale={0.96}`, `dimAmount={0.07}`.

Local changes to the upstream component, and why:

1. **`overflow-x: clip` instead of `hidden` on `body`.** `overflow-x: hidden`
   turns `body` into a scroll container, which breaks pinning and makes
   `window.scrollY` useless to the component. `clip` keeps the horizontal guard
   without creating a scroller. Verified: window scrolls, cards pin, no
   horizontal overflow.
2. **Tall-card fallback.** A card taller than the viewport cannot pin without
   stranding the content below its fold, so slots taller than
   `viewport - stackPosition` fall back to `position: relative` and keep normal
   flow; shorter cards still stack. At 1280x900 that is the features and FAQ
   panels; at 360 it is all but the closing panel.
3. **Reduced motion.** Pinning stays (it is layout); the recede/scale/dim
   transform is skipped when `prefers-reduced-motion` matches.
4. **Monochrome CSS.** No drop shadows, `var(--border)` hairlines, project
   radius, `var(--background)` surface, and the section's inner padding is
   replaced so panels share one inset instead of doubling the page padding.

Known trade-off: panels are inset by the page padding, so those five sections no
longer bleed to the screen edges. Removing the `px-*` classes from the
`ScrollStack` wrapper in `page.tsx` makes them full-bleed again — the stack
motion still works, it just loses the visible card edges.

### Redesign verification (second pass)

- Re-shot at 360 / 768 / 1280 / 1920 after every layout change; still **no
  horizontal scroll** at any width.
- FAQ initially collapsed its answer column because shadcn wraps the trigger in
  a `Header` element, so grid spans landed on the wrong node. Fixed by extending
  the primitive with `headerClassName` / `containerClassName` rather than
  hacking around it.
- Mobile process rail was rebuilt as a true vertical timeline after the first
  pass read as detached bullets.
- Stats were re-checked in the DOM: `["100", "±1¢", "0"]`, correct with and
  without reduced motion.

## 8. Verification commands (reference)

- `npm run build` clean, zero TS errors, zero Tailwind warnings.
- Headless screenshots at **360 / 768 / 1280 / 1920 / 2560** px, light **and** dark.
- Assert `document.documentElement.scrollWidth === clientWidth` at every width (no horizontal scroll).
- Grep the source for banned patterns: `max-w-`, `mx-auto`, `container`, `100vw`, `h-screen`, and any gradient utility.
- Keyboard tab-order walk: header → hero CTAs → FAQ → footer, visible focus everywhere.
- Reduced-motion render check: content fully visible, no motion.

---

## 8. Open questions before I build

1. **Accent color** — muted signal green (recommended, reads as "in tune"), or a warm amber, or strictly pure monochrome with no accent at all?
2. **CTA target** — option A (link to future `/tuner`) or B (honest stub page)?
3. **Hero gauge** — decorative animated gauge (recommended), or keep the hero text-only and let the marquee do the work?
4. **Instrument list** — need any additions (piano? banjo? mandolin?) or is the current eight right?

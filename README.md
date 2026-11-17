# Tonic

**Find your note. Sing in tune, tune any string.**

Tonic is a chromatic tuner for voice and strings, built to run in the browser.
Sing a line or play a string and it names the note you landed on, then shows
exactly how far off it sits — in cents.

The microphone stream is analyzed on-device. There are no accounts, no uploads
and no database.

## Status

The project is in development. This repository currently contains the landing
page that markets the tuner; the tuner itself is described in
[Plan Project.md](./Plan Project.md).

## Stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS v4, design tokens in `src/app/globals.css` |
| Components | shadcn/ui (Radix primitives) |
| Motion | `motion` + `ScrollStack`, adapted from [reactbits.dev](https://reactbits.dev) |
| Icons | Lucide |
| Theming | `next-themes` (light / dark / system) |
| Data | None — no database, no user accounts |

## Design rules

- **Full width, always.** No `max-width` container, no centered boxed layout.
  Horizontal padding comes from one scale defined once as `.section-x`
  (`px-4 sm:px-6 lg:px-10 xl:px-16`), used by every section, header and footer.
- **One type family for the interface.** Instrument Serif for display,
  Instrument Sans for body, three weight settings in total. The one deliberate
  exception is the presets strip, where each instrument is set in its own face
  (a small type specimen: Anton, Bricolage Grotesque, Playfair Display, DM Serif
  Display, Fraunces, Newsreader, Space Mono). Those faces are self-hosted and
  **not preloaded**, so they never block the page.
- **Monochrome.** Neutral greys and a single foreground/background inversion.
  No gradients, no accent colors.
- **Restraint.** Hairline borders and whitespace as the main design element.
  Motion is limited to one-time entrances plus the section stack, which pauses
  entirely under `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Structure

```
src/
  app/
    layout.tsx        fonts, metadata, theme provider
    page.tsx          landing page composition
    globals.css       tokens, section padding scale, keyframes
  components/
    motion/           blur text, reveal, marquee, scroll stack
    site/             header, hero, gauge, features, faq, footer
    ui/               shadcn primitives
```

## Privacy

Tonic asks for microphone access only on the tuner page, only when you use it.
Audio is analyzed in the tab and never transmitted or stored.

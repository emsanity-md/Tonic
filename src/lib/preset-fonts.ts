import {
  Anton,
  Bricolage_Grotesque,
  DM_Serif_Display,
  Fraunces,
  Newsreader,
  Playfair_Display,
  Space_Mono,
} from "next/font/google";

/**
 * One typeface per preset: the strip reads as a small type specimen, each
 * instrument with its own voice. These faces are used in the marquee only, so
 * they are self-hosted but not preloaded — the page never waits on them.
 */
const bass = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
  preload: false,
});

const ukulele = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bricolage",
  display: "swap",
  preload: false,
});

const violin = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

const viola = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dmserif",
  display: "swap",
  preload: false,
});

const cello = Fraunces({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

const voice = Newsreader({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

const chromatic = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-spacemono",
  display: "swap",
  preload: false,
});

export const presetFontVariables = [
  bass.variable,
  ukulele.variable,
  violin.variable,
  viola.variable,
  cello.variable,
  voice.variable,
  chromatic.variable,
].join(" ");

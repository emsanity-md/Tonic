import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { presetFontVariables } from "@/lib/preset-fonts";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const description =
  "Tonic is a chromatic tuner for voice and strings. Sing a note or play a string and see the note you landed on, with how far off it sits in cents. On-device, no account, no uploads.";

export const metadata: Metadata = {
  title: "Tonic — Find your note",
  description,
  applicationName: "Tonic",
  keywords: [
    "tuner",
    "chromatic tuner",
    "vocal tuner",
    "guitar tuner",
    "pitch detection",
    "sing in tune",
  ],
  openGraph: {
    title: "Tonic — Find your note",
    description,
    siteName: "Tonic",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${presetFontVariables}`}
    >
      <body className="min-h-dvh w-full overflow-x-hidden bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

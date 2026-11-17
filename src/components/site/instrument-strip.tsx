import { Marquee } from "@/components/motion/marquee";

const instruments = [
  { name: "Guitar", className: "font-heading text-[1.0625rem]" },
  {
    name: "Bass",
    className: "font-preset-bass text-[1rem] tracking-[0.01em]",
  },
  {
    name: "Ukulele",
    className: "font-preset-ukulele text-[1.0625rem] tracking-[-0.01em]",
  },
  {
    name: "Violin",
    className: "font-preset-violin text-[1.125rem] italic tracking-[-0.01em]",
  },
  { name: "Viola", className: "font-preset-viola text-[1.125rem]" },
  {
    name: "Cello",
    className: "font-preset-cello text-[1.0625rem] tracking-[-0.01em]",
  },
  {
    name: "Voice",
    className: "font-preset-voice text-[1.125rem] italic tracking-[-0.01em]",
  },
  {
    name: "Chromatic",
    className: "font-preset-chromatic text-[0.9375rem] tracking-[-0.02em]",
  },
];

export function InstrumentStrip() {
  return (
    <div className="w-full border-t border-border">
      <div className="section-x grid w-full grid-cols-1 items-center gap-4 py-5 sm:grid-cols-[auto_1fr] sm:gap-8">
        <p className="whitespace-nowrap text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Presets
        </p>
        <Marquee>
          {instruments.map((instrument) => (
            <span key={instrument.name} className="flex items-center">
              <span
                className={`whitespace-nowrap pr-6 leading-none text-foreground ${instrument.className}`}
              >
                {instrument.name}
              </span>
              <span
                className="mr-6 size-1 rounded-full bg-border"
                aria-hidden="true"
              />
            </span>
          ))}
        </Marquee>
      </div>
      <p className="sr-only">
        Presets for guitar, bass, ukulele, violin, viola and cello, plus voice
        and a fully chromatic mode.
      </p>
    </div>
  );
}

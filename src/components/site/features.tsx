import { Eyebrow, Section } from "@/components/site/section";
import { ForkMark } from "@/components/site/wordmark";

const features = [
  {
    title: "Chromatic, all the way down",
    body: "Every semitone from A0 to C8, with octave errors filtered out, so a low E on a bass reads as E1 and not as its fourth harmonic.",
  },
  {
    title: "It knows which string you're on",
    body: "Pick guitar, bass, ukulele, violin, viola or cello and Tonic names the target string, then steps you to the next one when you're in tune.",
  },
  {
    title: "Cents, not encouragement",
    body: "The needle resolves to a single cent and only moves when the pitch does. Flat and sharp are named, not implied.",
  },
  {
    title: "Reference tones",
    body: "Play a sine tone for any note to hear the target first, then match it by ear. Reference pitch is adjustable from 415 to 445 Hz.",
  },
  {
    title: "Tunings you actually use",
    body: "Drop D, DADGAD, half-step down, or build a tuning string by string. Tonic remembers your set, locally, on your device.",
  },
  {
    title: "Nothing leaves the tab",
    body: "The microphone stream is analyzed in your browser and never sent anywhere. No account, no recordings, no analytics on your audio.",
  },
];

export function Features() {
  return (
    <Section id="features">
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-16">
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            <Eyebrow>What it does</Eyebrow>
            <h2 className="font-heading text-[clamp(2rem,3.4dvw,3rem)] leading-[1.06] tracking-[-0.02em] text-balance">
              A tuner that answers, not a tuner that glows.
            </h2>
            <p className="max-w-[34ch] text-[0.875rem] leading-[1.7] text-muted-foreground">
              What the tuner is being built to do, in the order a musician would
              notice it.
            </p>
            <ForkMark className="mt-2 size-9 text-border" />
          </div>
        </div>

        <ol className="w-full border-b border-border lg:col-span-8">
          {features.map((feature, index) => (
            <li key={feature.title} className="border-t border-border">
              <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 gap-y-1.5 py-6 sm:grid-cols-[3rem_13rem_1fr] sm:gap-x-6 sm:py-7 lg:py-8">
                <span className="font-heading text-[0.9375rem] leading-6 tracking-[0.02em] text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[0.9375rem] font-semibold leading-6 text-foreground">
                  {feature.title}
                </h3>
                <p className="col-start-2 max-w-[46ch] text-[0.875rem] leading-[1.65] text-muted-foreground sm:col-start-3">
                  {feature.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

"use client";

import { useState } from "react";
import { SiteStepper, Step } from "@/components/site/site-stepper";
import { Eyebrow, Section } from "@/components/site/section";
import { ForkMark } from "@/components/site/wordmark";

const steps = [
  {
    title: "Range",
    description: "A0 to C8, chromatic",
    kicker: "Detection",
    heading: "Every semitone, all the way down.",
    body: "Tonic reads the whole chromatic range and filters octave errors, so a low E on a bass reads as E1 and not as its fourth harmonic.",
    facts: ["A0 – C8", "Chromatic", "Octave-safe"],
  },
  {
    title: "Strings",
    description: "Guitar, bass, uke, bowed",
    kicker: "String mode",
    heading: "It knows which string you're on.",
    body: "Pick guitar, bass, ukulele, violin, viola or cello and Tonic names the target string, then steps you to the next one when you're in tune.",
    facts: ["Guitar", "Bass", "Ukulele", "Violin", "Viola", "Cello"],
  },
  {
    title: "Cents",
    description: "One cent resolution",
    kicker: "Precision",
    heading: "Cents, not encouragement.",
    body: "The needle resolves to a single cent and only moves when the pitch does. Flat and sharp are named, not implied.",
    facts: ["1¢ resolution", "Sharp and flat named", "No smoothing lag"],
  },
  {
    title: "Reference",
    description: "Tones to match by ear",
    kicker: "Reference tones",
    heading: "Hear the target before you play it.",
    body: "Play a sine tone for any note to hear the target first, then match it by ear. Reference pitch is adjustable from 415 to 445 Hz.",
    facts: ["Sine tone", "Any note", "415 – 445 Hz"],
  },
  {
    title: "Tunings",
    description: "Drop D, DADGAD, your own",
    kicker: "Tunings",
    heading: "Tunings you actually use.",
    body: "Drop D, DADGAD, half-step down, or build a tuning string by string. Tonic remembers your set, locally, on your device.",
    facts: ["Drop D", "DADGAD", "Half-step down", "Custom"],
  },
  {
    title: "Privacy",
    description: "Nothing leaves the tab",
    kicker: "Privacy",
    heading: "The microphone never leaves your browser.",
    body: "The audio stream is analyzed in the tab and never sent anywhere. No account, no recordings, no analytics on your audio.",
    facts: ["On-device", "No account", "No uploads"],
  },
];

export function Features() {
  const [step, setStep] = useState(1);

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
              notice it. Step through it — the rail beside it is live.
            </p>
            <ForkMark className="mt-2 size-9 text-border" />
          </div>
        </div>

        <div className="lg:col-span-8">
          <SiteStepper
            step={step}
            onStepChange={setStep}
            onFinalStepCompleted={() => setStep(steps.length + 1)}
            orientation="vertical"
            transition="slide"
            backButtonText="Back"
            nextButtonText="Next"
            completeButtonText="Finish"
            stepContainerClassName="md:pr-2"
            completedContent={
              <div className="flex flex-col gap-3">
                <Eyebrow>End of the tour</Eyebrow>
                <h3 className="font-heading text-[clamp(1.35rem,2.1dvw,1.75rem)] leading-[1.15] tracking-[-0.01em]">
                  Six things, one microphone.
                </h3>
                <p className="max-w-[46ch] text-[0.875rem] leading-[1.65] text-muted-foreground">
                  Tonic is in active development. Walk through how the tuner
                  reads a note, or start the tour again.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex h-11 items-center rounded-lg bg-primary px-4 text-[0.8125rem] sm:h-9 font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
                  >
                    Start over
                  </button>
                  <a
                    href="#how-it-works"
                    className="text-[0.8125rem] font-semibold text-foreground underline-offset-[6px] hover:underline"
                  >
                    See how it works
                  </a>
                </div>
              </div>
            }
          >
            {steps.map((item) => (
              <Step key={item.title} title={item.title} description={item.description}>
                <div className="flex flex-col">
                  <Eyebrow>{item.kicker}</Eyebrow>
                  <h3 className="mt-3 font-heading text-[clamp(1.35rem,2.1dvw,1.75rem)] leading-[1.15] tracking-[-0.01em]">
                    {item.heading}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-[1.65] text-muted-foreground">
                    {item.body}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {item.facts.map((fact) => (
                      <li
                        key={fact}
                        className="rounded-full border border-border px-2.5 py-1 text-[0.6875rem] font-medium text-muted-foreground"
                      >
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </Step>
            ))}
          </SiteStepper>
        </div>
      </div>
    </Section>
  );
}

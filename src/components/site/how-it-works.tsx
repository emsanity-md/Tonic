"use client";

import { useState } from "react";
import { SiteStepper, Step } from "@/components/site/site-stepper";
import { Eyebrow, Section } from "@/components/site/section";

const steps = [
  {
    label: "Microphone",
    title: "Allow the microphone",
    kicker: "Before you start",
    body: "One tap on the tuner page asks the browser for mic access. Nothing is recorded, and permission is never requested on this page.",
    note: "One tap · nothing recorded",
  },
  {
    label: "Play or sing",
    title: "Play, sing, or hum",
    kicker: "The reading",
    body: "Tonic waits for a pitch that holds still, discards room noise, then locks on to the note and the octave it belongs to.",
    note: "Steady pitch · octave locked",
  },
  {
    label: "The needle",
    title: "Read the needle",
    kicker: "The result",
    body: "Left is flat, right is sharp. Land the marker in the middle and hold it there for a moment — that is the note, in tune.",
    note: "Left flat · right sharp",
  },
];

export function HowItWorks() {
  const [step, setStep] = useState(1);

  return (
    <Section id="how-it-works">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
        <div className="flex max-w-[46ch] flex-col gap-4">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-heading text-[clamp(2rem,3.4dvw,3rem)] leading-[1.06] tracking-[-0.02em] text-balance">
            Three steps, no settings to learn.
          </h2>
        </div>
        <p className="max-w-[34ch] text-[0.875rem] leading-[1.7] text-muted-foreground sm:text-right">
          Built for the moment between breathing in and singing out. Everything
          else stays out of the way.
        </p>
      </div>

      <div className="mt-10 sm:mt-12">
        <SiteStepper
          step={step}
          onStepChange={setStep}
          onFinalStepCompleted={() => setStep(steps.length + 1)}
          indicator="numbers"
          transition="fade"
          backButtonText="Back"
          nextButtonText="Next step"
          completeButtonText="Done"
          completedContent={
            <div className="flex flex-col gap-3">
              <Eyebrow>End of the loop</Eyebrow>
              <h3 className="font-heading text-[clamp(1.35rem,2.1dvw,1.75rem)] leading-[1.15] tracking-[-0.01em]">
                That&apos;s the whole loop.
              </h3>
              <p className="max-w-[46ch] text-[0.875rem] leading-[1.65] text-muted-foreground">
                Three steps, about a second each. Tonic is still being built —
                here is what the tuner will do when it lands.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-[0.8125rem] font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
                >
                  Run it again
                </button>
                <a
                  href="#features"
                  className="text-[0.8125rem] font-semibold text-foreground underline-offset-[6px] hover:underline"
                >
                  See what it does
                </a>
              </div>
            </div>
          }
        >
          {steps.map((item) => (
            <Step key={item.label} title={item.label}>
              <div className="flex flex-col">
                <Eyebrow>{item.kicker}</Eyebrow>
                <h3 className="mt-3 font-heading text-[clamp(1.35rem,2.1dvw,1.75rem)] leading-[1.15] tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[56ch] text-[0.875rem] leading-[1.65] text-muted-foreground">
                  {item.body}
                </p>
                <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.note}
                </p>
              </div>
            </Step>
          ))}
        </SiteStepper>
      </div>
    </Section>
  );
}

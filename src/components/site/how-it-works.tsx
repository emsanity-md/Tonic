import { Eyebrow, Section } from "@/components/site/section";

const steps = [
  {
    title: "Allow the microphone",
    body: "One tap on the tuner page asks the browser for mic access. Nothing is recorded, and permission is never requested on this page.",
  },
  {
    title: "Play, sing, or hum",
    body: "Tonic waits for a pitch that holds still, discards room noise, then locks on to the note and the octave it belongs to.",
  },
  {
    title: "Read the needle",
    body: "Left is flat, right is sharp. Land the marker in the middle and hold it there for a moment — that is the note, in tune.",
  },
];

export function HowItWorks() {
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

      <ol className="relative mt-12 grid w-full grid-cols-1 border-l border-border pl-6 lg:grid-cols-3 lg:border-l-0 lg:pl-0">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative pb-9 last:pb-0 lg:border-t lg:border-border lg:pt-8 lg:pr-10 lg:pb-0 xl:pr-16"
          >
            <span
              className="absolute top-[8.5px] left-[-27.5px] size-[7px] rounded-full bg-foreground lg:top-[-4px] lg:left-0"
              aria-hidden="true"
            />
            <span className="font-heading text-[0.9375rem] leading-6 tracking-[0.02em] text-muted-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 max-w-[42ch] text-[0.875rem] leading-[1.7] text-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

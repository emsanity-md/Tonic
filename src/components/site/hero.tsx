import { ArrowDown } from "lucide-react";
import { BlurText } from "@/components/motion/blur-text";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/site/section";
import { cn } from "@/lib/utils";
import { TuningGauge } from "@/components/site/tuning-gauge";

const specs = [
  { label: "Range", value: "A0 – C8, chromatic" },
  { label: "Resolution", value: "±1 cent (0.06%)" },
  { label: "Reference", value: "415 – 445 Hz" },
];

export function Hero() {
  return (
    <Section id="top" bordered={false} spacing="hero">
      <div className="grid w-full grid-cols-1 items-start gap-14 md:max-lg:landscape:grid-cols-12 md:max-lg:landscape:gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-16">
        <div className="md:max-lg:landscape:col-span-6 lg:col-span-7">
          <p className="flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            Chromatic tuner for voice and strings
          </p>

          <h1 className="mt-6 font-heading text-[clamp(3rem,7.5dvw,6.5rem)] leading-[0.94] tracking-[-0.03em]">
            <BlurText text="Find your" />{" "}
            <span className="italic">note.</span>
          </h1>

          <p className="mt-7 max-w-[54ch] text-base leading-[1.7] text-muted-foreground sm:text-[1.0625rem]">
            Sing a line, pluck a string, hum a scale. Tonic listens through your
            microphone and names the note you landed on — then tells you exactly
            how far off it sits, in cents.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-primary px-5 py-3 text-[0.8125rem] font-semibold tracking-[0.01em] text-primary-foreground">
              <span
                className="size-1.5 rounded-full bg-primary-foreground animate-pulse motion-reduce:animate-none"
                aria-hidden="true"
              />
              Coming soon
            </span>
            <a
              href="#how-it-works"
              className="group -my-2 inline-flex min-h-11 w-fit items-center gap-2 py-2 text-[0.8125rem] font-semibold text-foreground underline-offset-[6px] hover:underline"
            >
              See how it works
              <ArrowDown
                className="size-3.5 transition-transform group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <p className="mt-5 text-[0.8125rem] text-muted-foreground">
            No account. No install. No uploads. Just a microphone.
          </p>
        </div>

        <div className="md:max-lg:landscape:col-span-6 lg:col-span-5">
          <Reveal delay={0.15} y={24}>
            <TuningGauge />
          </Reveal>
        </div>
      </div>

      <dl className="mt-10 grid w-full grid-cols-1 border-t border-border sm:mt-12 sm:grid-cols-3">
        {specs.map((spec, index) => (
          <div
            key={spec.label}
            className={cn(
              "flex items-baseline justify-between gap-4 py-3 sm:flex-col sm:items-start sm:justify-start sm:gap-1 sm:py-4",
              index === 0
                ? "sm:pr-6"
                : "border-t border-border sm:border-t-0 sm:border-l sm:px-6",
            )}
          >
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {spec.label}
            </dt>
            <dd className="text-sm text-foreground">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

import { CentsRuler } from "@/components/site/cents-ruler";
import { Section } from "@/components/site/section";

const stats = [
  {
    to: 100,
    suffix: "",
    label: "Cents per semitone",
    note: "The full distance between C and C♯.",
  },
  {
    to: 1,
    prefix: "±",
    suffix: "¢",
    label: "Cent resolution",
    note: "A hundredth of a semitone.",
  },
  {
    to: 0,
    suffix: "",
    label: "Notes uploaded",
    note: "No server, no recording, no copy.",
  },
];

export function WhyCents() {
  return (
    <Section className="bg-foreground text-background" bordered={false}>
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-16">
        <div className="lg:col-span-8">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-background/50">
            Why cents
          </p>
          <h2 className="mt-5 font-heading text-[clamp(2rem,4.4dvw,4rem)] leading-[1.02] tracking-[-0.025em] text-balance">
            “Close enough” is a
            <span className="italic"> feeling.</span>
            <br className="hidden sm:block" /> A cent is a number.
          </h2>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4 lg:pt-9">
          <p className="max-w-[46ch] text-[0.9375rem] leading-[1.75] text-background/75">
            Every semitone is divided into one hundred cents, which makes the
            gap between any two notes measurable rather than remembered. Tonic
            shows you that number while you sing or play.
          </p>
          <p className="max-w-[46ch] text-[0.9375rem] leading-[1.75] text-background/75">
            It is not a scoring app. It is the number you check once, then
            internalize.
          </p>
        </div>
      </div>

      <CentsRuler className="mt-14" />

      <dl className="mt-10 grid w-full grid-cols-1 gap-0 border-y border-background/20 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={
              index === 0
                ? "flex flex-col gap-1.5 border-b border-background/20 py-6 sm:border-b-0 sm:pr-8"
                : "flex flex-col gap-1.5 border-b border-background/20 py-6 sm:border-b-0 sm:border-l sm:border-background/20 sm:px-8 last:sm:pr-0"
            }
          >
            <dd className="font-heading text-[clamp(2rem,3dvw,2.75rem)] leading-none tracking-[-0.02em] tabular-nums">
              {stat.prefix}
              {stat.to}
              {stat.suffix}
            </dd>
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-background/55">
              {stat.label}
            </dt>
            <p className="text-[0.8125rem] leading-[1.6] text-background/70">
              {stat.note}
            </p>
          </div>
        ))}
      </dl>
    </Section>
  );
}

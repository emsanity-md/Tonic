import { Section } from "@/components/site/section";

const facts = [
  { label: "Accounts", value: "None, ever" },
  { label: "Uploads", value: "Never" },
  { label: "Reference", value: "A4 · 440 Hz" },
  { label: "Platform", value: "Any browser" },
];

export function ClosingCta() {
  return (
    <Section className="bg-muted/40">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-8 xl:gap-16">
        <h2 className="font-heading text-[clamp(2.25rem,7dvw,6rem)] leading-[0.95] tracking-[-0.03em] text-balance lg:col-span-8">
          Practice in tune,
          <br className="hidden sm:block" /> not in{" "}
          <span className="italic">doubt.</span>
        </h2>

        <div className="flex flex-col gap-4 lg:col-span-4 lg:pb-2">
          <div className="flex items-center gap-2.5">
            <span
              className="size-1.5 rounded-full bg-foreground animate-pulse motion-reduce:animate-none"
              aria-hidden="true"
            />
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Coming soon
            </p>
          </div>
          <p className="max-w-[42ch] text-[0.9375rem] leading-[1.7] text-muted-foreground">
            Tonic is being tuned before it ships. When it opens it will ask for
            one thing: your microphone. Nothing else, now or later.
          </p>
        </div>
      </div>

      <dl className="mt-12 grid w-full grid-cols-2 border-t border-border sm:grid-cols-4">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={
              index === 0
                ? "flex flex-col gap-1.5 border-b border-border py-5 sm:border-b-0 sm:pr-6"
                : "flex flex-col gap-1.5 border-b border-border py-5 sm:border-b-0 sm:border-l sm:px-6 last:pr-0"
            }
          >
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="text-[0.875rem] leading-snug text-foreground">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

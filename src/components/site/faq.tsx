import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eyebrow, Section } from "@/components/site/section";

const faq = [
  {
    question: "When does Tonic launch?",
    answer:
      "It is in the workshop now. The tuner, the instrument presets and the reference tones are being finished before anything opens a microphone in public. This page is the only place it exists so far.",
  },
  {
    question: "Is my microphone audio uploaded anywhere?",
    answer:
      "No. Pitch detection runs inside your browser tab, on the audio stream itself, and the stream is never sent to a server or written to storage. Tonic has no account system and no database, so there is nowhere for a recording to go.",
  },
  {
    question: "Does it work for singing, not just instruments?",
    answer:
      "Yes. Voice, humming and whistling all produce a steady pitch, which is all the detector needs. Set the mode to Chromatic or Voice and hold a note for a beat or two.",
  },
  {
    question: "Which instruments are supported?",
    answer:
      "Presets are planned for guitar, bass, ukulele, violin, viola and cello, plus a fully chromatic mode that names any note from A0 to C8. Alternate tunings such as drop D, DADGAD and half-step down are configurable string by string.",
  },
  {
    question: "How accurate will it be?",
    answer:
      "The needle resolves to one cent for a sustained note on a clean microphone. Very low notes need a slightly longer analysis window, which is why a bass string settles a moment after you pluck it.",
  },
  {
    question: "Do I need an account or an app store download?",
    answer:
      "Neither. Tonic is a web application: open it, allow the microphone, tune. There is no sign-in, no subscription and nothing to install.",
  },
];

export function Faq() {
  return (
    <Section id="faq">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
        <div className="flex max-w-[44ch] flex-col gap-4">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="font-heading text-[clamp(2rem,3.4dvw,3rem)] leading-[1.06] tracking-[-0.02em] text-balance">
            Before you hand it a microphone.
          </h2>
        </div>
        <p className="max-w-[30ch] text-[0.875rem] leading-[1.7] text-muted-foreground sm:text-right">
          The short answers, including the one about what happens to your audio.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="mt-12 w-full border-t border-border"
      >
        {faq.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={item.question}
            className="group/item grid grid-cols-1 gap-x-8 border-b border-border lg:grid-cols-12"
          >
            <span className="hidden pt-6 font-heading text-[0.9375rem] leading-6 tracking-[0.02em] text-muted-foreground tabular-nums lg:col-span-1 lg:block">
              {String(index + 1).padStart(2, "0")}
            </span>

            <AccordionTrigger
              headerClassName="lg:col-span-4"
              className="py-6 pr-2 text-[1rem] font-semibold leading-snug hover:no-underline [&_[data-slot=accordion-trigger-icon]]:size-4 [&_[data-slot=accordion-trigger-icon]]:text-muted-foreground [&_[data-slot=accordion-trigger-icon]]:lg:hidden"
            >
              {item.question}
            </AccordionTrigger>

            <AccordionContent
              containerClassName="lg:col-span-6 lg:col-start-6"
              className="pb-6 pr-2 text-[0.875rem] leading-[1.7] text-muted-foreground lg:pt-6 lg:pb-8"
            >
              {item.answer}
            </AccordionContent>

            <span
              aria-hidden="true"
              className="hidden lg:col-span-1 lg:col-start-12 lg:flex lg:justify-end lg:pt-6"
            >
              <Plus className="size-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]/item:rotate-45" />
            </span>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

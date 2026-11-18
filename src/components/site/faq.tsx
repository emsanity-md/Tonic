import {
  FrequentlyAskedQuestions,
  type FAQItem,
} from "@/components/ui/frequently-asked-questions-with-accordion";
import { Section } from "@/components/site/section";

const faq: FAQItem[] = [
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
      "Yes. Voice, humming and whistling all produce a steady pitch, which is all the detector needs. Set the mode to Voice and hold a note for a beat or two.",
  },
  {
    question: "Which instruments are supported?",
    answer:
      "Presets are planned for guitar, bass, ukulele, violin, viola and cello, plus a fully chromatic mode that names any note from A0 to C8. Alternate tunings such as drop D, DADGAD and half-step down are configurable string by string.",
  },
  {
    question: "How accurate will it be?",
    answer:
      "The needle resolves to one cent — 0.06% of the pitch, a quarter of a hertz at A4 — for a sustained note on a clean microphone. Very low notes need a slightly longer analysis window, which is why a bass string settles a moment after you pluck it.",
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
      <FrequentlyAskedQuestions
        title="Before you hand it a microphone."
        description="The short answers, including the one about what happens to your audio."
        data={faq}
      />
    </Section>
  );
}

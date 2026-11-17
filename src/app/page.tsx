import ScrollStack, { ScrollStackItem } from "@/components/motion/scroll-stack";
import { ClosingCta } from "@/components/site/closing-cta";
import { Faq } from "@/components/site/faq";
import { Features } from "@/components/site/features";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { InstrumentStrip } from "@/components/site/instrument-strip";
import { WhyCents } from "@/components/site/why-cents";

export default function Home() {
  return (
    <div className="flex w-full min-h-dvh flex-col">
      <SiteHeader />
      <main className="w-full flex-1">
        <Hero />
        <InstrumentStrip />

        {/* Everything below the hero arrives as a stack of pinned panels. */}
        <ScrollStack
          useWindowScroll
          smoothScroll={false}
          stackPosition={84}
          itemDistance={44}
          itemStackDistance={16}
          itemScale={0.015}
          baseScale={0.96}
          dimAmount={0.07}
          holdDistance={120}
          className="w-full px-4 pb-6 sm:px-6 lg:px-10 xl:px-16"
        >
          <ScrollStackItem>
            <Features />
          </ScrollStackItem>
          <ScrollStackItem>
            <HowItWorks />
          </ScrollStackItem>
          <ScrollStackItem>
            <WhyCents />
          </ScrollStackItem>
          <ScrollStackItem>
            <Faq />
          </ScrollStackItem>
          <ScrollStackItem>
            <ClosingCta />
          </ScrollStackItem>
        </ScrollStack>
      </main>
      <SiteFooter />
    </div>
  );
}

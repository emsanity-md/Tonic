"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FrequentlyAskedQuestionsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  data: FAQItem[];
  className?: string;
  supportEmail?: string;
}

/**
 * Centred FAQ with a blurred, word-by-word heading and a staggered accordion.
 * Uses the project's existing shadcn Accordion so the open/close motion,
 * keyboard behaviour and focus ring match the rest of the site.
 */
export function FrequentlyAskedQuestions({
  eyebrow = "Questions",
  title = "Frequently asked questions",
  description,
  data,
  className,
  supportEmail,
}: FrequentlyAskedQuestionsProps) {
  const reduceMotion = useReducedMotion();
  const words = title.split(" ");

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      {eyebrow ? (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          className="text-center text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <h2 className="mt-5 text-center font-heading text-[clamp(2rem,4dvw,3.25rem)] leading-[1.04] tracking-[-0.025em] text-balance">
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, filter: "blur(6px)", y: 12 }
            }
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.4, delay: index * 0.08, ease: "easeInOut" }
            }
            className="mr-2 inline-block last:mr-0"
          >
            {word}{" "}
          </motion.span>
        ))}
      </h2>

      {description ? (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.3 }}
          className="mx-auto mt-5 max-w-[52ch] text-center text-[0.9375rem] leading-[1.7] text-muted-foreground"
        >
          {description}
          {supportEmail ? (
            <>
              {" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-foreground underline decoration-border underline-offset-4 transition-opacity hover:opacity-70"
              >
                {supportEmail}
              </a>
            </>
          ) : null}
        </motion.p>
      ) : null}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.35 }}
        className="mt-10 sm:mt-12"
      >
        <Accordion type="single" collapsible className="w-full">
          {data.map((item, index) => (
            <motion.div
              key={item.question}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.35, delay: 0.35 + index * 0.06, ease: "easeOut" }
              }
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="items-center py-5 text-left text-[1rem] font-semibold leading-snug hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-[62ch] pb-5 pr-8 text-[0.9375rem] leading-[1.75] text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}

import { cn } from "@/lib/utils";

/**
 * Adapted from reactbits.dev's BlurText. Implemented in CSS rather than JS so
 * the headline renders and animates without hydration, and collapses to a
 * plain static heading under prefers-reduced-motion.
 */
export function BlurText({
  text,
  className,
  stagger = 70,
  startDelay = 120,
}: {
  text: string;
  className?: string;
  stagger?: number;
  startDelay?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block whitespace-pre will-change-[filter,transform] motion-reduce:animate-none"
          style={{
            animation: `blur-in 900ms cubic-bezier(0.16, 1, 0.3, 1) ${
              startDelay + index * stagger
            }ms both`,
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Adapted from reactbits.dev's InfiniteScroll, reduced to what a text strip
 * needs: one CSS keyframe and a track made of two identical halves.
 *
 * The list is repeated `repeat` times per half so a half is always wider than
 * the widest viewport we support (2560px). That keeps the -50% loop continuous
 * with no gap on ultrawide screens. Duration scales with the repeat count, so
 * the scroll speed stays the same however much content is in the strip.
 *
 * The visual track is decorative: it is hidden from assistive tech, and callers
 * describe the content once in visually hidden text.
 */
export function Marquee({
  children,
  className,
  trackClassName,
  repeat = 4,
  secondsPerCopy = 26,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  repeat?: number;
  secondsPerCopy?: number;
}) {
  const copies = (side: "a" | "b") =>
    Array.from({ length: repeat }, (_, index) => (
      <div
        key={`${side}-${index}`}
        className={cn("flex shrink-0 items-center", trackClassName)}
      >
        {children}
      </div>
    ));

  return (
    <div
      className={cn(
        "edge-fade-x group relative w-full overflow-hidden",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={
          { animationDuration: `${repeat * secondsPerCopy}s` } as CSSProperties
        }
      >
        {copies("a")}
        {copies("b")}
      </div>
    </div>
  );
}

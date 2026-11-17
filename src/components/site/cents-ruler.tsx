import { cn } from "@/lib/utils";

/**
 * A full-width measuring ruler: one hundred cent steps across the whole
 * viewport. Drawn without uniform scaling distortion, so ticks stay hairlines.
 */
export function CentsRuler({ className }: { className?: string }) {
  const ticks = Array.from({ length: 101 }, (_, index) => index - 50);
  const baseline = 44;

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox="0 0 1000 46"
        preserveAspectRatio="none"
        className="h-[46px] w-full"
        aria-hidden="true"
        focusable="false"
      >
        {ticks.map((cent) => {
          const x = ((cent + 50) / 100) * 1000;
          const major = cent % 10 === 0;
          const medium = cent % 5 === 0;

          return (
            <line
              key={cent}
              x1={x}
              y1={baseline}
              x2={x}
              y2={baseline - (major ? 18 : medium ? 11 : 6)}
              stroke="currentColor"
              strokeWidth={major ? 1 : 0.75}
              vectorEffect="non-scaling-stroke"
              className={
                major ? "text-background/70" : "text-background/40"
              }
            />
          );
        })}
        <line
          x1={0}
          y1={baseline}
          x2={1000}
          y2={baseline}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className="text-background/40"
        />
      </svg>

      <div className="mt-3 flex w-full items-center justify-between text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-background/65 tabular-nums">
        <span>−50¢</span>
        <span>Flat · 0 · Sharp</span>
        <span>+50¢</span>
      </div>
    </div>
  );
}

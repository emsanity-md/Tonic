"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const CX = 180;
const CY = 196;
const R_TICK_OUT = 150;
const R_TICK_IN_MAJOR = 132;
const R_TICK_IN_MINOR = 140;
const R_ARC = 158;
const R_NEEDLE = 120;
const SWEEP = 52;
const CENTS = 12;

function polar(deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: CX + radius * Math.sin(rad),
    y: CY - radius * Math.cos(rad),
  };
}

function arcPath(from: number, to: number, radius: number) {
  const start = polar(from, radius);
  const end = polar(to, radius);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

const ticks = Array.from({ length: 21 }, (_, index) => -50 + index * 5);

export function TuningGauge({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex w-full flex-col rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Pitch preview
        </p>
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          A4 · voice
        </p>
      </div>

      <div className="px-5 pt-4 pb-2">
        <svg
          viewBox="0 0 360 214"
          className="h-auto w-full"
          role="img"
          aria-label="A gauge reading twelve cents sharp of A4"
        >
          <path
            d={arcPath(-SWEEP, SWEEP, R_ARC)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
          />
          <path
            d={arcPath(-6, 6, R_ARC)}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="text-foreground"
          />

          {ticks.map((cent) => {
            const major = cent % 10 === 0;
            const outer = polar(cent, R_TICK_OUT);
            const inner = polar(
              cent,
              major ? R_TICK_IN_MAJOR : R_TICK_IN_MINOR,
            );
            return (
              <line
                key={cent}
                x1={outer.x}
                y1={outer.y}
                x2={inner.x}
                y2={inner.y}
                stroke="currentColor"
                strokeWidth={major ? 1.25 : 1}
                strokeLinecap="round"
                className={major ? "text-muted-foreground" : "text-border"}
              />
            );
          })}

          <circle
            cx={CX}
            cy={CY}
            r={R_NEEDLE - 16}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />

          <motion.g
            style={{ transformOrigin: `${CX}px ${CY}px` }}
            initial={{ rotate: reduce ? CENTS : -26 }}
            animate={{ rotate: CENTS }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            <line
              x1={CX}
              y1={CY - 14}
              x2={CX}
              y2={CY - R_NEEDLE}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              className="text-foreground"
            />
          </motion.g>

          <circle cx={CX} cy={CY} r={3.5} className="fill-foreground" />
          <circle
            cx={CX}
            cy={CY}
            r={8}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
          />

          <text
            x={polar(-SWEEP, R_ARC + 14).x}
            y={polar(-SWEEP, R_ARC + 14).y + 14}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px] font-semibold tracking-[0.12em]"
          >
            −50¢
          </text>
          <text
            x={polar(0, R_ARC + 16).x}
            y={polar(0, R_ARC + 16).y - 2}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px] font-semibold tracking-[0.12em]"
          >
            0¢
          </text>
          <text
            x={polar(SWEEP, R_ARC + 14).x}
            y={polar(SWEEP, R_ARC + 14).y + 14}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px] font-semibold tracking-[0.12em]"
          >
            +50¢
          </text>
        </svg>
      </div>

      <dl className="grid grid-cols-3 border-t border-border">
        {[
          { label: "Note", value: "A4", accent: true },
          { label: "Frequency", value: "440.0 Hz" },
          { label: "Offset", value: "+12¢" },
        ].map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col gap-1 px-4 py-4",
              index !== 0 && "border-l border-border",
            )}
          >
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {item.label}
            </dt>
            <dd
              className={cn(
                "tabular-nums tracking-[-0.01em]",
                item.accent
                  ? "font-heading text-2xl leading-none"
                  : "text-sm leading-none",
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

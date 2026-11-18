"use client";

import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
const MIN_CENTS = -50;
const MAX_CENTS = 50;
const IN_TUNE_CENTS = 5;
const START_CENTS = 12;
const A4_HZ = 440;

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

function formatCents(cents: number) {
  if (cents === 0) return "0¢";
  const sign = cents > 0 ? "+" : "−";
  return `${sign}${Math.abs(cents)}¢`;
}

function describe(cents: number) {
  if (Math.abs(cents) <= IN_TUNE_CENTS) return "In tune";
  return `${Math.abs(cents)}¢ ${cents > 0 ? "sharp" : "flat"}`;
}

const ticks = Array.from({ length: 21 }, (_, index) => -50 + index * 5);

export function TuningGauge({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [cents, setCents] = useState(START_CENTS);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback((event: ReactPointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = ((event.clientX - rect.left) / rect.width) * 360;
    const y = ((event.clientY - rect.top) / rect.height) * 214;

    // Ignore points below the hub so the needle cannot flip past the arc.
    if (CY - y < 8) return;

    const deg = (Math.atan2(x - CX, CY - y) * 180) / Math.PI;
    const next = Math.round(
      Math.min(MAX_CENTS, Math.max(MIN_CENTS, deg)),
    );
    setCents(next);
  }, []);

  const handleKeyDown = useCallback((event: ReactKeyboardEvent) => {
    const step = event.shiftKey ? 10 : 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = cents - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = cents + step;
        break;
      case "PageDown":
        next = cents - 10;
        break;
      case "PageUp":
        next = cents + 10;
        break;
      case "Home":
        next = MIN_CENTS;
        break;
      case "End":
        next = MAX_CENTS;
        break;
      case "0":
      case "Escape":
        next = 0;
        break;
      default:
        return;
    }

    event.preventDefault();
    setCents(Math.min(MAX_CENTS, Math.max(MIN_CENTS, next)));
  }, [cents]);

  const inTune = Math.abs(cents) <= IN_TUNE_CENTS;
  const frequency = A4_HZ * 2 ** (cents / 1200);
  const needleTransition = reduce
    ? { duration: 0 }
    : dragging
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.6 };

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
        <p
          className={cn(
            "text-[0.625rem] font-semibold uppercase tracking-[0.18em] tabular-nums",
            inTune ? "text-foreground" : "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {describe(cents)}
        </p>
      </div>

      <div className="px-5 pt-4 pb-2">
        <svg
          ref={svgRef}
          viewBox="0 0 360 214"
          className={cn(
            "h-auto w-full select-none",
            dragging ? "cursor-grabbing" : "cursor-grab",
          )}
          style={{ touchAction: "none" }}
          role="slider"
          tabIndex={0}
          aria-label="Pitch offset in cents"
          aria-valuemin={MIN_CENTS}
          aria-valuemax={MAX_CENTS}
          aria-valuenow={cents}
          aria-valuetext={`${formatCents(cents)}, ${describe(cents)}, A4 at ${frequency.toFixed(1)} hertz`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
            updateFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (dragging) updateFromPointer(event);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onKeyDown={handleKeyDown}
        >
          <path
            d={arcPath(-SWEEP, SWEEP, R_ARC)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            className="text-border"
          />
          {Math.abs(cents) > 6 && (
            <path
              d={arcPath(Math.min(0, cents), Math.max(0, cents), R_ARC)}
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              strokeLinecap="round"
              className="text-foreground/20"
            />
          )}
          <path
            d={arcPath(-6, 6, R_ARC)}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="text-foreground"
          />

          {ticks.map((tick) => {
            const major = tick % 10 === 0;
            const outer = polar(tick, R_TICK_OUT);
            const inner = polar(
              tick,
              major ? R_TICK_IN_MAJOR : R_TICK_IN_MINOR,
            );
            return (
              <line
                key={tick}
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
            initial={{ rotate: reduce ? START_CENTS : -26 }}
            animate={{ rotate: cents }}
            transition={needleTransition}
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

      <p className="px-5 pb-3 text-[0.6875rem] text-muted-foreground">
        Drag the needle to preview a pitch — or focus the gauge and use the arrow
        keys.
      </p>

      <dl className="grid grid-cols-3 border-t border-border">
        {[
          { label: "Note", value: "A4", accent: true },
          { label: "Frequency", value: `${frequency.toFixed(1)} Hz` },
          { label: "Offset", value: formatCents(cents) },
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

"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
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
export const MIN_CENTS = -50;
export const MAX_CENTS = 50;

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

export type PitchTone = "flat" | "in-tune" | "sharp" | "idle";

const ARC_TONE: Record<PitchTone, string> = {
  idle: "text-muted-foreground",
  flat: "text-amber-600 dark:text-amber-400",
  "in-tune": "text-emerald-600 dark:text-emerald-400",
  sharp: "text-red-600 dark:text-red-400",
};

const OFFSET_TONE: Record<PitchTone, string> = {
  idle: "text-transparent",
  flat: "text-amber-500/40",
  "in-tune": "text-emerald-500/40",
  sharp: "text-red-500/40",
};

export function TuningDial({
  cents,
  tone,
  interactive = true,
  label,
  valueText,
  onCentsChange,
  className,
}: {
  cents: number;
  tone: PitchTone;
  interactive?: boolean;
  label: string;
  valueText: string;
  onCentsChange?: (cents: number) => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback(
    (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg || !onCentsChange) return;

      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = ((event.clientX - rect.left) / rect.width) * 360;
      const y = ((event.clientY - rect.top) / rect.height) * 214;

      // Ignore points below the hub so the needle cannot flip past the arc.
      if (CY - y < 8) return;

      const deg = (Math.atan2(x - CX, CY - y) * 180) / Math.PI;
      const next = Math.round(Math.min(MAX_CENTS, Math.max(MIN_CENTS, deg)));
      onCentsChange(next);
    },
    [onCentsChange],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!onCentsChange) return;
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
      onCentsChange(Math.min(MAX_CENTS, Math.max(MIN_CENTS, next)));
    },
    [cents, onCentsChange],
  );

  const needleTransition = reduce
    ? { duration: 0 }
    : dragging
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.6 };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 360 214"
      className={cn(
        "h-auto w-full select-none",
        className,
        interactive
          ? dragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : "cursor-default",
      )}
      style={interactive ? { touchAction: "none" } : undefined}
      role="slider"
      tabIndex={interactive ? 0 : -1}
      aria-label={label}
      aria-valuemin={MIN_CENTS}
      aria-valuemax={MAX_CENTS}
      aria-valuenow={cents}
      aria-valuetext={valueText}
      aria-readonly={interactive ? undefined : true}
      onPointerDown={
        interactive
          ? (event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
              updateFromPointer(event);
            }
          : undefined
      }
      onPointerMove={
        interactive
          ? (event) => {
              if (dragging) updateFromPointer(event);
            }
          : undefined
      }
      onPointerUp={interactive ? () => setDragging(false) : undefined}
      onPointerCancel={interactive ? () => setDragging(false) : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
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
          className={OFFSET_TONE[tone]}
        />
      )}
      <path
        d={arcPath(-6, 6, R_ARC)}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className={ARC_TONE[tone]}
      />

      {ticks.map((tick) => {
        const major = tick % 10 === 0;
        const outer = polar(tick, R_TICK_OUT);
        const inner = polar(tick, major ? R_TICK_IN_MAJOR : R_TICK_IN_MINOR);
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
        initial={{ rotate: reduce ? cents : -26 }}
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
  );
}

"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { useTheme } from "next-themes";
import Stepper from "@/components/motion/stepper";

export { Step } from "@/components/motion/stepper";

// Map the stepper's design tokens onto the site's theme variables so it reads
// as part of the page in both light and dark, rather than as its own panel.
const siteSkin = {
  "--stepper-well": "transparent",
  "--stepper-track": "var(--border)",
  "--stepper-tile": "var(--muted)",
  "--stepper-tile-edge": "var(--border)",
  "--stepper-tile-highlight": "transparent",
  "--stepper-tile-shadow": "none",
  "--stepper-frame": "transparent",
  "--stepper-frame-edge": "transparent",
  "--stepper-frame-highlight": "transparent",
  "--stepper-frame-shadow": "none",
  "--stepper-ink": "var(--foreground)",
  "--stepper-muted": "var(--muted-foreground)",
  "--stepper-faint": "var(--border)",
  "--stepper-ring": "var(--ring)",
  "--stepper-solid": "var(--foreground)",
  "--stepper-solid-ink": "var(--background)",
  "--stepper-hover-fill": "color-mix(in oklab, var(--foreground) 5%, transparent)",
  "--stepper-solid-hover": "brightness(1.08)",
} as ComponentProps<typeof Stepper>["style"];

const subscribe = () => () => {};

/** The React Bits stepper, skinned to this site's tokens and colour theme. */
export function SiteStepper({ children, ...props }: ComponentProps<typeof Stepper>) {
  const { resolvedTheme } = useTheme();
  // false during hydration, true once the client theme has resolved.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <Stepper
      frame={false}
      radius={12}
      width="100%"
      {...props}
      theme={mounted && resolvedTheme === "light" ? "light" : "dark"}
      style={{ ...siteSkin, ...props.style }}
      nextButtonProps={{
        style: { boxShadow: "none" },
        ...props.nextButtonProps,
      }}
      className={`text-foreground [&_.stepper__button]:rounded-lg ${props.className ?? ""}`.trim()}
    >
      {children}
    </Stepper>
  );
}

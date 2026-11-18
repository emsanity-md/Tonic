"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const subscribe = () => () => {};

const options = [
  { value: "system", label: "System theme", Icon: Monitor },
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // false on the server and during hydration, true once mounted: avoids
  // rendering a theme the client has not resolved yet.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      aria-label="Color theme"
      className={className}
      value={mounted ? (theme ?? "system") : ""}
      onValueChange={(value) => {
        if (value) setTheme(value);
      }}
    >
      {options.map(({ value, label, Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          title={label}
          className="touch-target h-11 w-11 text-muted-foreground data-[state=on]:text-foreground sm:h-7 sm:w-7"
        >
          <Icon aria-hidden="true" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

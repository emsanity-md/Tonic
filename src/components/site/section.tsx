import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-width section. Backgrounds and hairlines run edge to edge; the inner
 * wrapper owns the only horizontal padding scale in the project.
 */
export function Section({
  children,
  className,
  innerClassName,
  id,
  bordered = true,
  padded = true,
  spacing = "default",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  bordered?: boolean;
  padded?: boolean;
  spacing?: "default" | "tight" | "hero" | "none";
}) {
  const spacingClass =
    spacing === "tight"
      ? "py-12 sm:py-16 lg:py-20"
      : spacing === "hero"
        ? "pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20"
        : spacing === "none"
          ? ""
          : "py-16 sm:py-20 lg:py-24 xl:py-28";

  return (
    <section
      id={id}
      className={cn(
        "relative w-full scroll-mt-20",
        bordered && "border-t border-border",
        spacingClass,
        className,
      )}
    >
      {padded ? (
        <div className={cn("section-x w-full", innerClassName)}>{children}</div>
      ) : (
        <div className={cn("w-full", innerClassName)}>{children}</div>
      )}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-heading text-[clamp(2rem,3.6dvw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-balance">
        {title}
      </h2>
      {description ? (
        <p className="max-w-[62ch] text-[0.9375rem] leading-[1.7] text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

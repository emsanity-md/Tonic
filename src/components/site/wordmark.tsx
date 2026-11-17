import { cn } from "@/lib/utils";

export function ForkMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5", className)}
    >
      <path d="M7 3v5.5a5 5 0 0 0 10 0V3" />
      <path d="M12 13.5V21" />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
  labelClassName,
}: {
  className?: string;
  markClassName?: string;
  labelClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ForkMark className={cn("size-5 text-foreground", markClassName)} />
      <span
        className={cn(
          "font-heading text-[1.375rem] leading-none tracking-[-0.01em] text-foreground",
          labelClassName,
        )}
      >
        Tonic
      </span>
    </span>
  );
}

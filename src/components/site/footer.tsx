import { ThemeToggle } from "@/components/site/theme-toggle";
import { Wordmark } from "@/components/site/wordmark";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="section-x w-full">
        <div className="grid w-full grid-cols-1 gap-10 py-12 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-3 md:col-span-5">
            <Wordmark />
            <p className="max-w-[34ch] text-[0.875rem] leading-[1.6] text-muted-foreground">
              Find your note. Sing in tune, tune any string.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-col gap-1 md:col-span-3"
          >
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Sections
            </p>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 w-fit items-center text-[0.8125rem] text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Theme
            </p>
            <ThemeToggle />
            <p className="text-[0.8125rem] leading-[1.6] text-muted-foreground lg:text-right">
              Light, dark, or whatever your system says.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-muted-foreground">
            © Tonic. In development.
          </p>
          <p className="text-[0.75rem] text-muted-foreground">
            No accounts · No uploads · Just your note
          </p>
        </div>
      </div>
    </footer>
  );
}

import { ThemeToggle } from "@/components/site/theme-toggle";
import { Wordmark } from "@/components/site/wordmark";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="section-x flex h-16 w-full items-center justify-between gap-6 lg:h-18">
        <a
          href="#top"
          className="-my-3 inline-flex items-center rounded-sm py-3"
          aria-label="Tonic, back to top"
        >
          <Wordmark />
        </a>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-8 md:flex"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="touch-target inline-flex items-center text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

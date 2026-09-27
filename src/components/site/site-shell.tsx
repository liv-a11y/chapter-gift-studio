import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const links = [
  { label: "How it works", to: "/", hash: "how" },
  { label: "Chapters", to: "/", hash: "chapters" },
  { label: "Partners", to: "/partners" },
  { label: "Investors", to: "/investors" },
] as const;

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={inverse ? "text-background" : "text-foreground"}>
      Good Chapter<span className="text-coral">.</span>
    </span>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b-2 border-foreground bg-background">
        <div className="site-container flex min-h-20 items-center gap-2 py-3 sm:gap-4">
          <Link to="/" className="shrink-0 font-display text-xl sm:text-2xl" aria-label="Good Chapter home">
            <BrandMark />
          </Link>
          <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {links.map((link) => "hash" in link ? (
              <Link key={link.label} to={link.to} hash={link.hash} className="text-[15px] font-medium transition-colors duration-175 hover:text-primary">
                {link.label}
              </Link>
            ) : (
              <Link key={link.label} to={link.to} className="text-[15px] font-medium transition-colors duration-175 hover:text-primary" activeProps={{ className: "text-primary" }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Button asChild size="sm" className="ml-auto px-3 text-[12px] sm:h-11 sm:px-5 sm:text-sm lg:ml-5">
            <Link to="/new"><span className="sm:hidden">Start one</span><span className="hidden sm:inline">Start one for a friend</span></Link>
          </Button>
          <button type="button" onClick={() => setOpen(!open)} className="flex size-11 shrink-0 items-center justify-center rounded-sm border-2 border-foreground lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <nav className="border-t-2 border-foreground bg-background px-5 py-2 lg:hidden" aria-label="Mobile navigation">
            {links.map((link) => "hash" in link ? (
              <Link key={link.label} to={link.to} hash={link.hash} onClick={() => setOpen(false)} className="block border-b border-border py-4 text-lg font-medium last:border-b-0">
                {link.label}
              </Link>
            ) : (
              <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className="block border-b border-border py-4 text-lg font-medium last:border-b-0">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background">
      <div className="site-container grid gap-12 py-14 md:grid-cols-[1.2fr_.8fr] md:py-16">
        <div>
          <Link to="/" className="font-display text-3xl"><BrandMark inverse /></Link>
          <p className="mt-5 max-w-md text-lg leading-[1.5] text-background/80">Not a wedding. Not a baby. Still worth celebrating on purpose.</p>
          <a href="mailto:liv@goodchapter.com" className="mt-7 inline-block text-[15px] font-semibold underline underline-offset-4">liv@goodchapter.com</a>
        </div>
        <nav className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] md:justify-self-end" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/partners/employers">Employers</Link>
          <Link to="/partners/real-estate">Real estate</Link>
          <Link to="/partners/brands">Brands</Link>
          <Link to="/investors">Investors</Link>
        </nav>
      </div>
    </footer>
  );
}

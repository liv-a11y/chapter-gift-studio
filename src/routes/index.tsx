import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/site-shell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Good Chapter — Celebrate the chapters life forgot" },
    { name: "description", content: "A friend starts a chapter. The person approves it privately. Their people show up." },
    { property: "og:title", content: "Good Chapter — Celebrate the chapters life forgot" },
    { property: "og:description", content: "A friend starts a chapter. The person approves it privately. Their people show up." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

function HomePage() {
  return <SiteShell>
    <section className="site-section"><div className="site-container"><p className="sticker">The anti-registry</p><h1 className="site-h1 mt-7 max-w-5xl">A friend starts it. The person approves it. <span className="bg-emphasis px-2 text-emphasis-foreground">Nobody asks.</span></h1><p className="site-body mt-7 max-w-2xl text-muted-foreground">For first homes, fresh starts, recovery, new cities: every chapter weddings never covered.</p><div className="mt-8 flex flex-wrap gap-4"><Button asChild size="lg"><Link to="/new">Start one for a friend <ArrowRight className="size-4" /></Link></Button><Button asChild variant="outline" size="lg"><Link to="/" hash="how">How it works</Link></Button></div></div></section>
    <section id="how" className="scroll-mt-20 bg-foreground text-background"><div className="site-container site-section"><p className="eyebrow text-background/70">How it works</p><h2 className="site-h2 mt-5 max-w-3xl">No awkward asking. Just people showing up.</h2><div className="mt-12 grid gap-8 md:grid-cols-3">{[["01","A friend starts."],["02","The person decides."],["03","Guests give."]].map(([n,t])=><div key={n} className="border-t-2 border-background pt-5"><span className="font-display text-5xl text-secondary">{n}</span><h3 className="mt-8 font-display text-3xl">{t}</h3></div>)}</div></div></section>
    <section id="chapters" className="site-section scroll-mt-20"><div className="site-container"><p className="eyebrow text-emphasis">Chapters</p><h2 className="site-h2 mt-5">The moments still worth marking.</h2><div className="mt-12 grid gap-5 md:grid-cols-3">{["First place","Starting over","New city"].map((chapter)=><article key={chapter} className="lift-card border-2 border-foreground p-7"><h3 className="font-display text-3xl">{chapter}</h3><p className="mt-4 text-[15px] leading-[1.5] text-muted-foreground">A thoughtful chapter, started by someone who knows what this moment means.</p></article>)}</div></div></section>
    <section className="bg-emphasis text-emphasis-foreground"><div className="site-container py-16 md:py-20"><h2 className="site-h2 max-w-3xl">Start one for someone you love.</h2><Button asChild variant="ink" size="lg" className="mt-8"><Link to="/new">Start one for a friend <ArrowRight className="size-4" /></Link></Button></div></section>
  </SiteShell>;
}

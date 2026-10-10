import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import donorsChoose from "@/assets/donorschoose-logo.png.asset.json";

const DESC =
  "A share of every chapter goes to a nonprofit that knows it. Unassigned margin funds public classrooms through DonorsChoose. Paid from our margin, never the gift.";

export const Route = createFileRoute("/giving")({
  head: () => ({
    meta: [
      { title: "Giving back . Good Chapter" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Giving back . Good Chapter" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GivingPage,
});

type Cause = { chapter: string; org: string; sub?: string; copy: string; rule: string; tile: string };

const causes: Cause[] = [
  { chapter: "Coming out", org: "The Trevor Project", copy: "Crisis support for LGBTQ young people.", rule: "border-t-primary", tile: "bg-accent text-accent-foreground" },
  { chapter: "Divorce and starting over", org: "National Domestic Violence Hotline", copy: "Safety and support for people leaving.", rule: "border-t-accent", tile: "bg-card text-foreground" },
  { chapter: "First place", org: "Habitat for Humanity", copy: "Homes for people who need one.", rule: "border-t-foreground", tile: "bg-card text-primary" },
  { chapter: "Sobriety", org: "Shatterproof", copy: "Treatment and recovery support.", rule: "border-t-primary", tile: "bg-highlight text-foreground" },
  { chapter: "Adoption and foster", org: "Dave Thomas Foundation", sub: "for Adoption", copy: "Homes for children in foster care.", rule: "border-t-accent", tile: "bg-card text-foreground" },
  { chapter: "Grief and healing", org: "Dougy Center", copy: "Support for grieving children and families.", rule: "border-t-foreground", tile: "bg-card text-primary" },
];

function GivingPage() {
  return (
    <SiteShell>
      <section className="site-section">
        <div className="site-container flex flex-col gap-6">
          <p className="eyebrow text-accent">Giving back . Beta</p>
          <h1 className="site-h1 max-w-[20ch]">A share of every chapter goes to a nonprofit that knows it.</h1>
          <p className="self-start rounded-[4px] bg-highlight px-3 py-1 font-serif text-lg text-foreground md:text-xl">
            Employer and real estate clients can request a local nonprofit.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {causes.map((c) => (
              <article key={c.chapter} className={`flex flex-col gap-3 rounded-[4px] border-2 border-foreground border-t-[6px] ${c.rule} bg-background p-4`}>
                <p className="eyebrow text-accent">{c.chapter}</p>
                <div className={`flex h-24 flex-col items-center justify-center rounded-[4px] border-2 border-foreground px-3 text-center ${c.tile}`}>
                  <span className="font-serif text-xl leading-tight">{c.org}</span>
                  {c.sub && <span className="text-sm">{c.sub}</span>}
                </div>
                <p className="text-sm">{c.copy}</p>
              </article>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Illustrative pairings, no agreements signed. Logos shown as name marks until approved. Percentage to be set, from our margin, not the gift. Structure set with counsel.
          </p>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container grid items-center gap-8 rounded-[4px] border-2 border-foreground bg-card p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div className="rounded-[4px] border-2 border-foreground bg-background p-6">
            <img src={donorsChoose.url} alt="DonorsChoose logo" width={1733} height={584} className="h-auto w-full" loading="lazy" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="eyebrow text-accent">No cause picked</p>
            <h2 className="site-h2">Unassigned margin funds classrooms.</h2>
            <p className="site-body">
              Not every chapter needs a matching cause. When none is chosen, the share goes to DonorsChoose, where public school teachers ask for the supplies their students need. Pencils. Books. A rug for story time.
            </p>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container grid gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "From our margin", c: "Guests buy the gift. We give from what we earn. No tip jars, no round up at checkout." },
            { n: "02", t: "Quiet by default", c: "Nobody is told which cause a chapter supports unless the person approves it." },
            { n: "03", t: "Annual impact report", c: "Once a year we publish what went where. Dollars, classrooms, causes. Partners get their own line." },
          ].map((r) => (
            <div key={r.n} className="flex flex-col gap-2 rounded-[4px] border-2 border-foreground p-5">
              <p className="eyebrow text-accent">{r.n} . {r.t}</p>
              <p className="site-body">{r.c}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent text-accent-foreground">
        <div className="site-container py-10">
          <p className="font-serif text-2xl md:text-4xl">Every chapter gives back to the cause that knows it.</p>
        </div>
      </section>
    </SiteShell>
  );
}

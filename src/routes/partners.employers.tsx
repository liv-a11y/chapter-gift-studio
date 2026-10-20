import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { WaitlistForm } from "@/components/site/waitlist-form";
import toolbox from "@/assets/p-cobalt-toolbox-600.webp.asset.json";
import pan from "@/assets/p-cast-iron-pan-600.webp.asset.json";
import kettle from "@/assets/p-bright-citron-kettle-600.webp.asset.json";
import blanket from "@/assets/p-knit-blanket-600.webp.asset.json";
import kitchen from "@/assets/scene-kitchen-moving-day.png.asset.json";
import desk from "@/assets/scene-desk-nook.png.asset.json";

const title = "For employers. Good Chapter, Co.";
const description = "A quiet, private way for companies to show up for employees during the life chapters no policy covers.";

export const Route = createFileRoute("/partners/employers")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmployersPage,
});

const steps = [
  { n: "01", h: "A teammate starts it quietly.", p: "A coworker or manager picks a few curated gifts that fit the moment. No forms to route. No approval chain." },
  { n: "02", h: "The employee approves privately.", p: "It lands in their personal inbox. They keep, swap, or decline. Nobody on the team sees what changed." },
  { n: "03", h: "The company covers the anchor.", p: "Your pilot pool funds the first gift automatically. No receipts. No reimbursement forms." },
  { n: "04", h: "The team adds a note, if invited.", p: "Only if the employee opens it up. No progress bars. No tally of who gave. Nobody asks." },
];

const guardrails = [
  { h: "Zero IT integration", p: "Corporate card or a monthly invoice. No HRIS sync, no SSO ticket." },
  { h: "Spend controls", p: "A fixed pilot pool, a set anchor gift per chapter, and a yearly cap per employee." },
  { h: "Counts-only reporting", p: "Monthly summaries of spend, team, and fulfillment date. Never home addresses. Never personal details." },
];

function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" width={600} height={600} className={`w-full rounded-sm border-2 border-foreground object-cover ${className}`} />;
}

function EmployersPage() {
  return (
    <SiteShell>
      <section className="site-container grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="eyebrow text-emphasis">Founding employers · 90 day pilot</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">The benefit for the chapters HR has no policy for.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">A first home bought alone. A parent moving in. Starting over. Good teams want to show up. Passing a hat in Slack feels intrusive, and flowers feel thin. Good Chapter gives your company a quiet way to help.</p>
        </div>
        <img src={kitchen.url} alt="A kitchen on moving day with a citron kettle, dishes in a moving box, and keys on the counter." width={1200} height={800} className="aspect-[3/2] w-full rounded-sm border-2 border-foreground object-cover" />
      </section>

      <section className="border-y-2 border-foreground">
        <div className="site-container py-14">
          <p className="eyebrow text-emphasis">How it works</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Four steps. Nobody asks.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-sm border-2 border-foreground p-5">
                <p className="eyebrow">{s.n}</p>
                <h3 className="mt-3 font-display text-xl">{s.h}</h3>
                <p className="mt-3 leading-relaxed">{s.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Photo src={toolbox.url} alt="A cobalt toolbox." />
            <Photo src={pan.url} alt="A cast iron pan." />
            <Photo src={kettle.url} alt="A citron kettle." />
            <Photo src={blanket.url} alt="A knit blanket." />
          </div>
          <p className="eyebrow mt-4">Sample gifts. Guests buy from the retailer option they prefer.</p>
        </div>
      </section>

      <section className="site-container grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
        <img src={desk.url} alt="A desk nook with blue drawers, a notebook, a checkered mug, and a plant." loading="lazy" width={1200} height={800} className="aspect-[3/2] w-full rounded-sm border-2 border-foreground object-cover" />
        <div>
          <p className="eyebrow text-emphasis">The pilot</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Small pool. Clear rules. Real chapters.</h2>
          <p className="mt-4 text-lg leading-relaxed">A sample pilot: a $10,000 pool with a $200 anchor gift covers about fifty chapters over 90 days. You set the numbers.</p>
          <Link to="/partners/employers/portal" className="mt-6 inline-block rounded-sm border-2 border-foreground bg-primary px-5 py-3 text-primary-foreground hover:bg-foreground hover:text-background">Walk the portal prototype</Link>
          <div className="mt-8 grid gap-4">
            {guardrails.map((g) => (
              <div key={g.h} className="rounded-sm border-2 border-foreground p-5">
                <h3 className="eyebrow">{g.h}</h3>
                <p className="mt-2 leading-relaxed">{g.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-2 border-foreground">
        <div className="site-container max-w-2xl py-14">
          <p className="eyebrow text-emphasis">Founding employers</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Ask about a pilot.</h2>
          <p className="mt-4 mb-8 text-lg">Tell us who you are. Liv reads every note and writes back to set up a real conversation.</p>
          <WaitlistForm pilot defaultInquiry="Founding partner: Employer" />
        </div>
      </section>
    </SiteShell>
  );
}

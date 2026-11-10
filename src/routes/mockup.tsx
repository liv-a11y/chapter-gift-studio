import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ToasterLine } from "@/components/site/illustration";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { sampleProducts } from "@/lib/sample-products";
import livingScene from "@/assets/scene-living-dining.png.asset.json";

const title = "Good Chapter, Co. Homepage study";
const description = "A homepage layout study for Good Chapter, Co. One wordmark, real objects, short headings.";

export const Route = createFileRoute("/mockup")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Mockup,
});

const chapters = ["First place", "Divorce", "New city", "Coming out", "After a health scare", "A big, lonely change", "Off-script"];

const steps = [
  { n: "01", title: "A friend starts it.", copy: "They see the chapter nobody threw a party for." },
  { n: "02", title: "The person approves it.", copy: "In private. Keep what fits. Swap what does not." },
  { n: "03", title: "Their people show up.", copy: "One real object each. Nobody doubles up." },
];

const featured = [sampleProducts[7], sampleProducts[3], sampleProducts[4], sampleProducts[6]];

/** Parenthetical label, used for section markers and text links. */
function Paren({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}>( {children} )</span>;
}

function Mockup() {
  return (
    <SiteShell pilot>
      {/* Hero: the wordmark is the headline. */}
      <section className="site-container pt-10 md:pt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Paren className="text-emphasis">The anti-registry</Paren>
          <span className="eyebrow text-muted-foreground">Everything since 1924</span>
        </div>
        <h1 className="mt-4 font-display text-[clamp(56px,15.5vw,232px)] leading-[0.9] tracking-[-0.03em]">Good Chapter</h1>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6 pb-8 md:pb-10">
          <p className="max-w-[26ch] font-display text-[26px] leading-[1.15] sm:text-[32px]">A friend starts it. The person approves it. Nobody asks.</p>
          <a href="#invite" className="eyebrow underline underline-offset-[6px] hover:text-primary">( Request an invitation )</a>
        </div>
      </section>
      <img
        src={livingScene.url}
        alt="A living and dining room mid-move, with a table, a lamp, and boxes still on the floor."
        width={1920}
        height={1080}
        fetchPriority="high"
        className="block aspect-[16/9] w-full border-y-2 border-foreground object-cover md:aspect-[21/9]"
      />

      {/* Manifesto surface. */}
      <section className="bg-emphasis text-emphasis-foreground">
        <div className="site-container py-16 md:py-28">
          <ToasterLine as="h2" className="max-w-[16ch] text-[clamp(40px,7vw,104px)] leading-[1]" />
        </div>
      </section>

      {/* Chapter ticker. */}
      <div className="overflow-hidden border-y-2 border-foreground bg-background" aria-label="Chapters">
        <ul className="flex gap-0 whitespace-nowrap py-4">
          {chapters.map((c) => (
            <li key={c} className="eyebrow shrink-0 border-r border-foreground/40 px-6 last:border-r-0">{c}</li>
          ))}
        </ul>
      </div>

      {/* The ritual. */}
      <section className="site-container site-section">
        <Paren className="text-emphasis">The ritual</Paren>
        <h2 className="mt-4 font-display text-[clamp(44px,8vw,112px)] leading-[0.95]">Nobody asks.</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="border-t-2 border-foreground pt-5">
              <Paren>{s.n}</Paren>
              <h3 className="mt-5 font-display text-[28px] leading-[1.1]">{s.title}</h3>
              <p className="mt-3 max-w-[30ch] text-[17px] leading-[1.6] text-muted-foreground">{s.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Real objects. */}
      <section className="border-y-2 border-foreground bg-card">
        <div className="site-container site-section">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Paren className="text-emphasis">Maya's first place</Paren>
              <h2 className="mt-4 font-display text-[clamp(44px,8vw,112px)] leading-[0.95]">Real objects.</h2>
            </div>
            <Link to="/catalog" className="eyebrow underline underline-offset-[6px] hover:text-primary">( See all eight )</Link>
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <article key={p.id} className="min-w-0">
                <img src={p.photo} alt={p.name} loading="lazy" width={600} height={450} className="aspect-[4/5] w-full rounded-[4px] border-2 border-foreground object-cover" />
                <p className="eyebrow mt-4 text-muted-foreground">{p.brand} · ${p.price} · Sample</p>
                <h3 className="mt-2 font-display text-[26px] leading-[1.1]">{p.name}</h3>
                <p className="mt-2 text-[17px] leading-[1.5] text-muted-foreground">{p.reason}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why. */}
      <section className="site-container site-section">
        <Paren className="text-emphasis">Why we exist</Paren>
        <p className="mt-6 max-w-[24ch] font-display text-[clamp(32px,4.6vw,64px)] leading-[1.08]">
          The registry was built for a woman leaving her father’s house for her husband’s. <span className="text-emphasis">We built one for everything else she does.</span>
        </p>
        <Link to="/history" className="eyebrow mt-10 inline-block underline underline-offset-[6px] hover:text-primary">( Read the history )</Link>
      </section>

      {/* Closing. */}
      <section id="invite" className="scroll-mt-24 bg-foreground text-background">
        <div className="site-container grid gap-12 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <div>
            <Paren className="text-background/70">Private pilot</Paren>
            <h2 className="mt-4 font-display text-[clamp(64px,12vw,176px)] leading-[0.9]">Start<br />one.</h2>
            <p className="mt-6 max-w-[28ch] text-[17px] leading-[1.6] text-background/80">Nothing is for sale yet. Tell us who you are and we will write when the first circle opens.</p>
          </div>
          <div className="text-foreground"><WaitlistForm pilot /></div>
        </div>
      </section>
    </SiteShell>
  );
}

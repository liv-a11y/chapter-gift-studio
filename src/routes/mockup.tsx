import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ToasterLine } from "@/components/site/illustration";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { sampleProducts } from "@/lib/sample-products";
import livingScene from "@/assets/scene-living-dining.png.asset.json";
import toasterPhoto from "@/assets/checked-toaster.png.asset.json";

const title = "Good Chapter, Co. Homepage study";
const description = "A homepage layout study for Good Chapter, Co. One color, one wordmark, real objects.";

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

/** Heavy sans heading with one serif word. The serif word carries the meaning. */
function Mixed({ plain, serif, as: Tag = "h2", className = "" }: { plain: string; serif: string; as?: "h1" | "h2"; className?: string }) {
  return (
    <Tag className={`font-sans font-bold tracking-[-0.04em] text-emphasis ${className}`}>
      {plain} <span className="font-display font-normal tracking-[-0.02em]">{serif}</span>
    </Tag>
  );
}

/** Dashed frame with two square corner marks, like a drawing still being placed. */
function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative border-2 border-dashed border-emphasis/60 ${className}`}>
      {children}
      <span aria-hidden="true" className="absolute -bottom-[7px] -left-[7px] size-3 bg-emphasis" />
      <span aria-hidden="true" className="absolute -bottom-[7px] -right-[7px] size-3 bg-emphasis" />
    </div>
  );
}

const cta = "eyebrow inline-block rounded-[4px] bg-emphasis px-6 py-4 text-emphasis-foreground hover:bg-foreground hover:text-background";
const textLink = "eyebrow text-emphasis underline underline-offset-[6px] hover:text-foreground";

function Mockup() {
  return (
    <SiteShell pilot>
      {/* Hero: a photo band with an arch laid over it. */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-[72%] overflow-hidden bg-secondary">
          <img
            src={livingScene.url}
            alt="A living and dining room mid-move, with a table, a lamp, and boxes still on the floor."
            width={1920}
            height={1080}
            fetchPriority="high"
            className="size-full object-cover"
          />
        </div>
        <div className="site-container relative flex justify-center pt-14 md:pt-20">
          <Frame className="flex w-[min(100%,440px)] flex-col items-center rounded-t-[999px] bg-card px-8 pb-10 pt-14 text-center">
            <svg viewBox="0 0 300 70" className="w-[220px] text-emphasis" role="img" aria-label="Since 1924">
              <path id="arc" d="M 20 64 Q 150 0 280 64" fill="none" />
              <text fill="currentColor" fontSize="14" fontWeight="500" letterSpacing="5" className="font-sans">
                <textPath href="#arc" startOffset="50%" textAnchor="middle">EVERYTHING SINCE</textPath>
              </text>
            </svg>
            <span className="mt-3 block h-px w-28 bg-emphasis/40" aria-hidden="true" />
            <p className="mt-4 font-sans text-[17px] font-medium tracking-[0.06em] text-emphasis">1924</p>
            <img
              src={toasterPhoto.url}
              alt="A two slot toaster painted in red and cream checks."
              width={600}
              height={600}
              className="mt-8 aspect-square w-full max-w-[280px] rounded-[4px] object-cover"
            />
            <a href="#invite" className={`${cta} -mb-16 mt-8`}>( Request an invitation )</a>
          </Frame>
        </div>
      </section>

      {/* The wordmark is the headline. */}
      <section className="site-container pb-16 pt-24 text-center md:pb-24 md:pt-28">
        <h1 className="whitespace-nowrap font-sans text-[clamp(40px,11.4vw,188px)] font-bold uppercase leading-[0.86] tracking-[-0.045em] text-emphasis">Good Chapter</h1>
        <p className="mx-auto mt-6 max-w-[30ch] text-[19px] leading-[1.5] sm:text-[22px]">A friend starts it. The person approves it. Nobody asks.</p>
      </section>

      {/* Chapter ticker. */}
      <div className="overflow-hidden border-y border-emphasis/40" aria-label="Chapters">
        <ul className="flex whitespace-nowrap py-4">
          {chapters.map((c) => (
            <li key={c} className="eyebrow shrink-0 border-r border-emphasis/40 px-6 text-emphasis last:border-r-0">{c}</li>
          ))}
        </ul>
      </div>

      {/* Real objects. */}
      <section className="site-container site-section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Mixed plain="Real" serif="objects" className="text-[clamp(44px,7vw,96px)] leading-[0.95]" />
          <Link to="/catalog" className={textLink}>( See all eight )</Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2">
          {featured.map((p) => (
            <article key={p.id} className="min-w-0">
              <img src={p.photo} alt={p.name} loading="lazy" width={600} height={450} className="aspect-[4/3] w-full rounded-[4px] bg-secondary object-cover" />
              <div className="mt-4 flex items-baseline justify-between gap-4 text-emphasis">
                <h3 className="font-sans text-[19px] font-medium">{p.name}</h3>
                <span className="font-sans text-[19px] font-bold tabular-nums">${p.price}</span>
              </div>
              <p className="mt-1 text-[17px] leading-[1.5] text-muted-foreground">{p.reason}</p>
              <p className="eyebrow mt-2 text-muted-foreground">Sample</p>
            </article>
          ))}
        </div>
      </section>

      {/* The line, framed. */}
      <section className="site-container pb-20 md:pb-28">
        <Frame className="px-6 py-14 text-center md:px-16 md:py-24">
          <p className="eyebrow text-emphasis">( Why we exist )</p>
          <ToasterLine as="h2" className="mx-auto mt-6 max-w-[18ch] !text-center text-[clamp(32px,5.4vw,76px)] leading-[1.04] text-emphasis" />
          <Link to="/history" className={`${textLink} mt-10 inline-block`}>( Read the history )</Link>
        </Frame>
      </section>

      {/* The ritual. */}
      <section className="bg-card">
        <div className="site-container site-section">
          <Mixed plain="Nobody" serif="asks" className="text-[clamp(44px,7vw,96px)] leading-[0.95]" />
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-emphasis/40 pt-5">
                <span className="font-sans text-[54px] font-bold leading-none tracking-[-0.04em] text-emphasis">{s.n}</span>
                <h3 className="mt-5 font-sans text-[26px] font-medium leading-[1.1] tracking-[-0.02em] text-emphasis">{s.title}</h3>
                <p className="mt-3 max-w-[30ch] text-[17px] leading-[1.6] text-muted-foreground">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing: the type sits on the band. */}
      <section id="invite" className="scroll-mt-24 overflow-hidden pt-20 md:pt-28">
        <h2 className="whitespace-nowrap text-center font-sans text-[clamp(56px,17vw,300px)] font-bold uppercase leading-[0.74] tracking-[-0.045em] text-emphasis">Start one</h2>
        <div className="bg-emphasis text-emphasis-foreground">
          <div className="site-container grid gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-20">
            <p className="max-w-[18ch] font-display text-[clamp(28px,3.4vw,44px)] leading-[1.1]">Nothing is for sale yet. Tell us who you are. We will write when the first circle opens.</p>
            <div className="text-foreground"><WaitlistForm pilot /></div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { sampleProducts } from "@/lib/sample-products";

const title = "You shouldn't need a wedding to get a toaster";
const description = "A friend starts the chapter. The person approves it in private. Guests give one good thing. Good Chapter, Co. is opening its first circle.";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:description", content: description },
  ] }),
  component: Home,
});

const steps = [
  { n: "I", label: "A friend starts it", body: "Someone who knows the room picks a few good things." },
  { n: "II", label: "The person approves it", body: "In private. Keep what fits, remove what does not." },
  { n: "III", label: "Guests give one thing", body: "Each person picks an object. No totals, no pressure." },
];

function Home() {
  const objects = sampleProducts.slice(0, 8);
  return (
    <SiteShell pilot>
      <section className="site-container pb-16 pt-12 md:pb-24 md:pt-20">
        <p className="eyebrow text-emphasis">Good Chapter, Co.</p>
        <h1 className="mt-6 max-w-4xl font-display text-[42px] leading-[1.04] sm:text-[60px] lg:text-[76px]">Every chapter deserves the care.</h1>
        <p className="mt-6 max-w-[34rem] text-[19px] leading-[1.55] text-muted-foreground sm:text-[21px]">The registry was built for weddings. We built one for the first place, the new job, the fresh start.</p>
        <Link to="/first-place" className="mt-9 inline-flex items-center gap-3 rounded-[4px] border-2 border-primary bg-primary px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground hover:bg-foreground hover:border-foreground">
          See Maya's first place <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="border-t-2 border-foreground" aria-labelledby="rhythm">
        <div className="site-container py-14 md:py-20">
          <h2 id="rhythm" className="eyebrow text-emphasis">How a chapter works</h2>
          <ol className="mt-8 grid gap-0 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="border-t-2 border-foreground py-6 md:border-l-2 md:border-t-0 md:px-6 md:py-2 md:first:border-l-0 md:first:pl-0">
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-emphasis">{s.n}</span>
                <p className="mt-3 font-display text-[26px] leading-[1.15]">{s.label}</p>
                <p className="mt-3 text-[17px] leading-[1.55] text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t-2 border-foreground" aria-labelledby="objects">
        <div className="site-container py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="objects" className="font-display text-[32px] leading-[1.1] sm:text-[44px]">Objects that outlast the boxes.</h2>
            <p className="eyebrow text-muted-foreground">Illustrative sample</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {objects.map((p) => (
              <li key={p.id}>
                <img src={p.photo} alt={p.name} loading="lazy" className="aspect-square w-full rounded-[4px] bg-card object-cover" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{p.band}</p>
                <p className="mt-1 font-display text-[19px] leading-[1.2]">{p.name}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[40rem] text-[16px] leading-[1.55] text-muted-foreground">Gifts come directly from independent makers, trusted retailers, and friends of Good Chapter. No platform fees. Never marked up above retail.</p>
        </div>
      </section>

      <section className="border-t-2 border-foreground" aria-labelledby="pilot">
        <div className="site-container grid gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="eyebrow text-emphasis">The first circle</p>
            <h2 id="pilot" className="mt-5 font-display text-[32px] leading-[1.1] sm:text-[44px]">Nobody asks. So we built a way to offer.</h2>
            <p className="mt-5 text-[17px] leading-[1.55] text-muted-foreground">We are opening quietly. Tell us who you are and we will write when the doors open.</p>
            <Link to="/first-place" className="mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.14em] text-foreground underline underline-offset-4 hover:bg-foreground hover:text-background">Walk through a sample chapter</Link>
          </div>
          <div className="min-w-0"><WaitlistForm pilot /></div>
        </div>
      </section>
    </SiteShell>
  );
}

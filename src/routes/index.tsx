import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { ToasterLine } from "@/components/site/illustration";
import throwPhoto from "@/assets/g-08-check-wool-throw.webp.asset.json";
import lampPhoto from "@/assets/g-02-bedside-lamp.webp.asset.json";
import espressoPhoto from "@/assets/g-01-espresso-machine.webp.asset.json";
import tinsPhoto from "@/assets/g-15-striped-salt-tins.webp.asset.json";

const title = "You shouldn't need a wedding to get a toaster";
const description = "The old script is getting a rewrite. Good Chapter Co. is opening its first circle. Request an invitation.";

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
  component: FrontDoor,
});

const steps = [
  { n: "I", title: "A friend starts it.", copy: "They notice the chapter. The first apartment, the fresh start, the move nobody threw a party for." },
  { n: "II", title: "The person approves it.", copy: "In private. Keep what fits, swap what does not. Nothing goes out until they say so." },
  { n: "III", title: "Their people show up.", copy: "Each guest picks one real object. Nobody doubles up. Nobody sees who gave what." },
];

const objects = [
  { photo: lampPhoto.url, name: "Bedside lamp", note: "Good light for the first night in.", alt: "A ceramic bedside lamp with a pleated shade on a small table." },
  { photo: throwPhoto.url, name: "Checked wool throw", note: "For the chair that is still the only chair.", alt: "A checked wool throw folded over a chair." },
  { photo: espressoPhoto.url, name: "Espresso machine", note: "A small ritual for a new morning.", alt: "A marble finish espresso machine on a kitchen counter." },
];

function FrontDoor() {
  return (
    <SiteShell pilot>
      <section className="site-container pb-16 pt-14 md:pb-28 md:pt-24">
        <p className="eyebrow text-emphasis">Since 1924, nobody asks.</p>
        <h1 className="mt-6 max-w-5xl font-display text-[44px] leading-[1.04] sm:text-[64px] lg:text-[88px]">
          <ToasterLine />
        </h1>
        <p className="mt-8 max-w-[36rem] text-[19px] leading-[1.6] text-muted-foreground sm:text-[21px]">
          When a friend steps into a big chapter, start it for them. They privately keep what fits. Their people fill the house.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a href="#invite" className="inline-flex items-center rounded-[4px] bg-primary px-6 py-4 font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground hover:bg-foreground hover:text-background">Request an invitation</a>
          <Link to="/first-place" className="font-mono text-[12px] uppercase tracking-[0.14em] underline underline-offset-[6px] hover:text-emphasis">See Maya's chapter</Link>
        </div>
      </section>

      <section className="site-container pb-20 md:pb-32" aria-label="Sample objects">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr] md:gap-6">
          <figure className="rounded-[4px] bg-card p-4 sm:p-6">
            <img src={tinsPhoto.url} alt="Three striped salt tins on a kitchen counter." width={1200} height={900} fetchPriority="high" className="aspect-[4/3] w-full rounded-[4px] object-cover" />
            <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
              <span className="font-display text-[24px]">Maya's first place</span>
              <span className="eyebrow text-muted-foreground">Started by a friend. Approved by Maya.</span>
            </figcaption>
          </figure>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 md:gap-6">
            {objects.slice(0, 2).map((o) => (
              <figure key={o.name} className="rounded-[4px] bg-card p-4">
                <img src={o.photo} alt={o.alt} loading="lazy" width={600} height={450} className="aspect-[4/3] w-full rounded-[4px] object-cover" />
                <figcaption className="mt-4"><p className="font-display text-[19px]">{o.name}</p><p className="mt-1 text-[15px] leading-[1.5] text-muted-foreground">{o.note}</p></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="site-container py-20 md:py-32">
          <p className="eyebrow text-emphasis">How a chapter works</p>
          <h2 className="mt-5 max-w-3xl font-display text-[34px] leading-[1.1] sm:text-[48px]">No list to write. No asking for yourself.</h2>
          <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-foreground/15 pt-6">
                <span className="eyebrow text-emphasis">{s.n}</span>
                <h3 className="mt-4 font-display text-[26px] leading-[1.15]">{s.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.65] text-muted-foreground">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-container py-20 md:py-32">
        <div className="grid items-end gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <img src={objects[2].photo} alt={objects[2].alt} loading="lazy" width={900} height={1100} className="aspect-[4/5] w-full rounded-[4px] object-cover" />
          <div>
            <p className="eyebrow text-emphasis">Where gifts come from</p>
            <p className="mt-5 font-display text-[30px] leading-[1.2] sm:text-[38px]">Gifts come directly from independent makers, trusted retailers, and friends of Good Chapter.</p>
            <p className="mt-6 text-[17px] leading-[1.65] text-muted-foreground">No platform fees. Never marked up above retail.</p>
            <Link to="/read" className="mt-8 inline-block font-mono text-[12px] uppercase tracking-[0.14em] underline underline-offset-[6px] hover:text-emphasis">Read our why</Link>
          </div>
        </div>
      </section>

      <section id="invite" className="bg-card scroll-mt-24">
        <div className="site-container grid gap-12 py-20 md:grid-cols-[1fr_1fr] md:gap-16 md:py-28">
          <div>
            <p className="eyebrow text-emphasis">Private pilot</p>
            <h2 className="mt-5 font-display text-[34px] leading-[1.1] sm:text-[48px]">The first circle opens quietly.</h2>
            <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.65] text-muted-foreground">Friends, agents, employers, and the curious. Tell us who you are and we will write when the doors open.</p>
          </div>
          <WaitlistForm pilot />
        </div>
      </section>
    </SiteShell>
  );
}

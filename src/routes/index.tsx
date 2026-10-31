import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { ToasterLine } from "@/components/site/illustration";
import emptyRoom from "@/assets/07-moving-out.png.asset.json";
import mfInterior from "@/assets/marshall-field-interior.jpg.asset.json";
import mfStreet from "@/assets/marshall-field-1906.jpg.asset.json";

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
  component: PilotGate,
});

function PilotGate() {
  return (
    <SiteShell pilot>
      <section className="site-container pb-12 pt-10 md:pb-16 md:pt-14">
        <p className="eyebrow text-emphasis">The old script ends here.</p>
        <h1 className="mt-5 max-w-4xl font-display text-[40px] leading-[1.05] sm:text-[56px] lg:text-[72px]">Something good is taking shape.</h1>
        <p className="mt-5 max-w-[34rem] text-[19px] leading-[1.5] text-muted-foreground sm:text-[22px]">For the lives that never came with a gift list.</p>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="min-w-0">
            <img src={emptyRoom.url} alt="Two rooms side by side. One is furnished with a sofa, lamp, and plant, and a person stands inside with hands in pockets. The other is empty with bare walls and an open door, and a second person walks in carrying a yellow bag." width={1536} height={1024} fetchPriority="high" className="aspect-[3/2] w-full rounded-[4px] bg-background object-cover mix-blend-multiply" />
            <div className="mt-8">
              <p className="eyebrow text-emphasis">Since 1924</p>
              <ToasterLine className="mt-3 text-[26px] leading-[1.2]" />
              <p className="mt-4 text-[17px] leading-[1.55] text-muted-foreground">A century ago, a department store decided you only deserve support if you get married or have a baby.</p>
              <p className="mt-3 text-[17px] leading-[1.55] text-muted-foreground"><span className="font-medium text-foreground">The empty room. The solo move. The new job nobody throws a party for.</span> For a lot of people that is the biggest chapter of their life, and they are supposed to furnish it alone.</p>
              <blockquote className="mt-8 border-t-2 border-foreground pt-5 font-display text-[28px] leading-[1.15] text-emphasis sm:text-[32px]">You shouldn't have to ask to be celebrated.</blockquote>
              <p className="mt-6 font-display text-[22px] leading-[1.2]">A friend starts the chapter. You keep what fits.</p>
              <p className="mt-3 text-[16px] leading-[1.55] text-muted-foreground">Your friend tells us what you're stepping into. You make it yours in private, choose who to share it with, and let your people show up.</p>
            </div>
          </div>
          <div className="min-w-0 pt-1">
            <WaitlistForm pilot />
          </div>
        </div>
      </section>
      <div className="border-t-2 border-foreground">
        <section className="site-container py-12 md:py-20" aria-labelledby="why-we-exist">
          <div className="grid gap-10 md:grid-cols-[minmax(260px,.75fr)_minmax(0,1.25fr)] md:gap-14 lg:gap-20">
            <div>
              <div className="grid grid-cols-2 overflow-hidden rounded-[4px] border-2 border-foreground bg-card">
                <div className="col-span-2 flex items-end justify-between gap-5 border-b-2 border-foreground bg-highlight p-5">
                  <span className="font-display text-[52px] leading-none sm:text-[64px]">1924</span>
                  <span className="eyebrow text-right">One accepted<br />life script</span>
                </div>
                <img src={mfInterior.url} alt="Archival photograph of the Marshall Field's store interior, about 1910, with tall columns and shoppers on the main floor." loading="lazy" width={300} height={446} className="aspect-square h-full w-full border-r-2 border-foreground object-cover grayscale" />
                <div className="flex flex-col justify-between p-5">
                  <span className="eyebrow text-emphasis">The bridal list</span>
                  <p className="mt-8 font-display text-[22px] leading-[1.12] sm:text-[24px]">China.<br />Silver.<br />Crystal.</p>
                </div>
                <img src={mfStreet.url} alt="Archival 1906 postcard of crowds on the street outside the Marshall Field's store." loading="lazy" width={1920} height={1254} className="col-span-2 aspect-[3/2] h-full w-full border-t-2 border-foreground object-cover" />
                <div className="col-span-2 flex items-end justify-between gap-5 border-t-2 border-foreground bg-primary p-5 text-primary-foreground">
                  <span className="font-display text-[52px] leading-none sm:text-[64px]">Now</span>
                  <span className="eyebrow text-right">Every life<br />worth marking</span>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-[1.5] text-muted-foreground">Archival images: Marshall Field's, about 1906 to 1910. Public domain, via Wikimedia Commons.</p>
            </div>
            <div className="min-w-0">
              <p className="eyebrow text-emphasis">Why we exist</p>
              <h2 id="why-we-exist" className="mt-5 font-display text-[34px] leading-[1.06] sm:text-[48px] lg:text-[56px]">
                The registry was built for a woman leaving her father's house for her husband's. <span className="text-emphasis">We built one for everything else she does.</span>
              </h2>
              <p className="mt-7 max-w-[40rem] text-[17px] leading-[1.55] text-muted-foreground">In 1924, a department store made care easy to give at marriage. China, silver, crystal, and a list so nobody guessed.</p>
              <p className="mt-4 max-w-[40rem] text-[17px] leading-[1.55] text-muted-foreground">Women kept building lives outside that script. Buying homes alone. Starting over. Moving somewhere new. The care stayed. The ritual did not.</p>
              <div className="mt-10 border-t-2 border-foreground pt-6">
                <p className="font-display text-[24px] leading-[1.2] sm:text-[28px]">Every chapter deserves the care. Here is why.</p>
                <Link
                  to="/read"
                  className="mt-5 inline-flex items-center gap-3 rounded-[4px] border-2 border-primary bg-primary px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground hover:bg-foreground hover:text-background"
                >
                  Read our why
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { ToasterLine } from "@/components/site/illustration";
import keyDoor from "@/assets/01-key-and-door.png.asset.json";

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
        <h1 className="mt-6 max-w-5xl font-display text-[48px] leading-[1.02] sm:text-[72px] lg:text-[96px]">Good Chapter<br />Co<span className="text-coral">.</span></h1>
        <div className="mt-7 border-b-2 border-foreground pb-8">
          <p className="max-w-[34rem] text-[20px] leading-[1.5] sm:text-[24px]">Something good is taking shape. For the lives that never came with a gift list.</p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="min-w-0">
            <img src={keyDoor.url} alt="A person holding a large key stands beside an open door." width={1536} height={1024} fetchPriority="high" className="mt-5 aspect-[3/2] w-full max-w-[360px] rounded-[4px] border-2 border-foreground object-contain mix-blend-multiply" />
            <div className="mt-6 max-w-md border-2 border-foreground bg-card p-5">
              <p className="eyebrow text-emphasis">Since 1924</p>
              <ToasterLine className="mt-3 text-[24px] leading-[1.2]" />
              <p className="mt-4 text-[17px] leading-[1.5] text-muted-foreground">A century ago, a department store decided you only deserve support if you get married or have a baby.</p>
              <p className="mt-3 text-[17px] leading-[1.5] text-muted-foreground">Not everyone takes that path. Buying a home alone, a new job, a fresh start in an empty room. That might be the biggest chapter of your life.</p>
              <p className="mt-4 font-display text-[24px] leading-[1.15]"><span className="bg-emphasis px-3 py-1 text-emphasis-foreground">You shouldn't have to ask.</span></p>
              <p className="mt-3 text-[15px] leading-[1.5] text-muted-foreground">Your people want to show up. We are setting a new norm for every chapter of life.</p>
            </div>
          </div>
          <div className="min-w-0 pt-1">
            <WaitlistForm pilot />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

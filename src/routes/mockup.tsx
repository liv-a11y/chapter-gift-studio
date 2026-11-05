import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { ToasterLine } from "@/components/site/illustration";
import throwPhoto from "@/assets/g-08-check-wool-throw.webp.asset.json";
import toasterPhoto from "@/assets/checked-toaster.png.asset.json";
import espressoPhoto from "@/assets/g-01-espresso-machine.webp.asset.json";
import mugPhoto from "@/assets/speckled-mug.png.asset.json";

const title = "Good Chapter, Co. Homepage study";
const description = "A homepage layout study for Good Chapter, Co. Quiet index, real objects, private approval.";

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

function Marker({ n, label, right }: { n: number; label: string; right?: string }) {
  return (
    <div className="grid grid-cols-[3rem_1fr_auto] items-baseline border-b border-foreground/20 pb-3 text-[13px] font-medium">
      <span>({n})</span>
      <span>{label}</span>
      <span className="text-muted-foreground">{right ?? "Good Chapter, Co."}</span>
    </div>
  );
}

const chapters = [
  ["First place", "Keys, a bare kitchen, one chair."],
  ["Fresh start", "A new lease on the same old life."],
  ["New city", "Nobody to call for a drill."],
  ["Coming home", "Back after a long hard stretch."],
  ["Career leap", "The job that changes the week."],
];

const objects = [
  { photo: toasterPhoto.url, name: "Checked toaster", from: "Independent maker", alt: "A two slot toaster painted in red and cream checks." },
  { photo: throwPhoto.url, name: "Checked wool throw", from: "Retailer option", alt: "A checked wool throw folded over a chair." },
  { photo: espressoPhoto.url, name: "Espresso machine", from: "Retailer option", alt: "A marble finish espresso machine on a kitchen counter." },
];

const u = "underline decoration-1 underline-offset-[5px]";

function Mockup() {
  return (
    <SiteShell pilot>
      <section className="site-container pt-12 md:pt-20">
        <Marker n={1} label="The origin" right="1924 to now" />
        <p className="mt-10 text-[14px] font-medium text-emphasis">Chicago, 1924. Rewritten for today.</p>
        <ToasterLine as="h1" className="mt-5 max-w-5xl text-[42px] leading-[1.04] sm:text-[64px] lg:text-[84px]" />
        <p className="mt-10 max-w-[38rem] text-[20px] leading-[1.5] sm:text-[24px]">
          In 1924, department stores invented the <span className={u}>wedding registry</span>. A century later, it is still the
          only milestone that comes with a <span className={u}>ritual</span>. Good Chapter is for <span className={u}>every chapter weddings missed</span>.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a href="/#invite" className="inline-flex rounded-[4px] bg-primary px-6 py-4 text-[14px] font-medium text-primary-foreground hover:bg-foreground hover:text-background">Request an invitation</a>
          <Link to="/first-place" className="text-[14px] font-medium underline underline-offset-[6px] hover:text-emphasis">See Maya's chapter</Link>
        </div>
        <img src={mugPhoto.url} alt="A speckled ceramic mug with iced matcha resting on a stack of books." className="mt-16 aspect-[16/10] w-full rounded-[4px] object-cover md:aspect-[21/9]" />
      </section>

      <section className="site-container py-20 md:py-28">
        <Marker n={2} label="The ritual" right="Three steps" />
        <ol className="mt-8">
          {[
            ["A friend starts it.", "They notice the chapter nobody threw a party for."],
            ["The person approves it.", "In private. Keep what fits, swap what does not."],
            ["Their people show up.", "One real object each. Nobody doubles up."],
          ].map(([t, c], i) => (
            <li key={t} className="grid gap-2 border-b border-foreground/20 py-6 md:grid-cols-[3rem_1fr_1fr] md:gap-6">
              <span className="text-[13px] font-medium">{i + 1}</span>
              <span className="font-display text-[26px] leading-[1.15]">{t}</span>
              <span className="text-[16px] leading-[1.6] text-muted-foreground">{c}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="site-container pb-20 md:pb-28">
        <Marker n={3} label="The objects" right={`Sample (${objects.length})`} />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {objects.map((o) => (
            <figure key={o.name}>
              <img src={o.photo} alt={o.alt} loading="lazy" className="aspect-[4/5] w-full rounded-[4px] object-cover" />
              <figcaption className="mt-3 flex justify-between border-b border-foreground/20 pb-3 text-[14px]">
                <span className="font-medium">{o.name}</span>
                <span className="text-muted-foreground">{o.from}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-2 border-b border-foreground/20 pb-3 text-[13px] font-medium">
            <span>Chapters</span><span>({chapters.length})</span>
          </div>
          {chapters.map(([c, n]) => (
            <div key={c} className="grid grid-cols-2 border-b border-foreground/10 py-3 text-[15px]">
              <span>{c}</span><span className="text-muted-foreground">{n}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="site-container py-20 md:py-28">
          <div className="grid grid-cols-[3rem_1fr] border-b border-background/25 pb-3 text-[13px] font-medium">
            <span>(4)</span><span>The pact</span>
          </div>
          <p className="mt-10 max-w-4xl font-display text-[32px] leading-[1.15] sm:text-[48px]">
            No public list. No totals. Nobody sees who gave what. The person never has to ask.
          </p>
          <p className="mt-8 max-w-[34rem] text-[16px] leading-[1.6] opacity-80">
            Gifts come directly from independent makers, trusted retailers, and friends of Good Chapter. No platform fees. Never marked up above retail.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}

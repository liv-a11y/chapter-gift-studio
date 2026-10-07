import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { SiteShell } from "@/components/site/site-shell";
import { catalog, segments, tiers, type ImageKey, type SegmentId } from "@/lib/catalog";
import candle from "@/assets/p-terracotta-candle-600.webp.asset.json";
import aperitif from "@/assets/p-bright-citron-kettle-600.webp.asset.json";
import frame from "@/assets/p-houseplant-600.webp.asset.json";
import cookware from "@/assets/p-cast-iron-pan-600.webp.asset.json";
import pottery from "@/assets/p-cobalt-mug-600.webp.asset.json";
import lamp from "@/assets/p-cobalt-table-lamp-600.webp.asset.json";
import throwImg from "@/assets/p-cream-bath-towels-600.webp.asset.json";
import bench from "@/assets/p-knit-blanket-600.webp.asset.json";

const images: Record<ImageKey, string> = {
  candle: candle.url,
  aperitif: aperitif.url,
  frame: frame.url,
  cookware: cookware.url,
  pottery: pottery.url,
  lamp: lamp.url,
  throw: throwImg.url,
  bench: bench.url,
};

export const Route = createFileRoute("/catalog")({
  head: () => ({ meta: [
    { title: "The catalog — Good Chapter" },
    { name: "description", content: "Every curated Good Chapter gift, by life chapter and price tier, each with one honest reason." },
    { property: "og:title", content: "The catalog — Good Chapter" },
    { property: "og:description", content: "Curated gifts for First Place, Fresh Start, The Pivot, and The Pause." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CatalogPage,
});

function CatalogPage() {
  const [segment, setSegment] = useState<SegmentId | "all">("all");
  const items = segment === "all" ? catalog : catalog.filter((i) => i.segments.includes(segment));
  const active = segments.find((s) => s.id === segment);

  return (
    <SiteShell>
      <section className="site-container py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.14em]">The catalog · {catalog.length} items</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(44px,6vw,80px)] leading-[1.03] tracking-[-0.01em]">Fewer things. Better reasons.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-[1.5]">Every item is chosen for a specific chapter of life, across four price tiers. Guests buy wherever they like; Good Chapter just keeps the group from doubling up.</p>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Life chapters">
          {[{ id: "all" as const, name: "All chapters" }, ...segments].map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={segment === s.id}
              onClick={() => setSegment(s.id)}
              className={`rounded-[4px] border-2 border-foreground px-4 py-2 text-[15px] font-semibold transition-colors duration-150 ${segment === s.id ? "bg-foreground text-background" : "bg-background"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
        {active && <p className="mt-4 text-[17px]">{active.blurb}</p>}
      </section>

      {tiers.map((t) => {
        const list = items.filter((i) => i.tier === t.id);
        if (!list.length) return null;
        return (
          <section key={t.id} className="site-container pb-20">
            <div className="flex items-baseline justify-between border-b-2 border-foreground pb-3">
              <h2 className="font-display text-[clamp(28px,3vw,40px)] leading-[1.05]">{t.name}</h2>
              <span className="font-mono text-xs uppercase tracking-[0.14em]">{t.range} · {list.length}</span>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((i) => (
                <article key={i.id} className="rounded-[4px] border-2 border-foreground bg-background transition-transform duration-150 ease-linear hover:-translate-y-1">
                  <img src={images[i.image]} alt={`${i.brand} ${i.name}`} loading="lazy" className="aspect-[4/3] w-full border-b-2 border-foreground object-cover" />
                  <div className="p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.14em]">{i.brand}</p>
                    <h3 className="mt-1 text-lg font-semibold">{i.name}</h3>
                    <p className="mt-1 font-mono text-[15px]">${i.price}</p>
                    <p className="mt-3 text-[15px] leading-[1.5]">{i.reason}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </SiteShell>
  );
}

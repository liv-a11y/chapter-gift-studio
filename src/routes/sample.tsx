import { createFileRoute } from "@tanstack/react-router";
import scene from "@/assets/scene-kitchen-moving-day.png.asset.json";
import { GoodChapterDemo } from "@/components/good-chapter-demo";

export const Route = createFileRoute("/sample")({
  head: () => ({
    meta: [
      { title: "A sample chapter. Good Chapter" },
      { name: "description", content: "Walk through a sample Good Chapter: a friend starts it, the person approves it, and the circle claims gifts privately." },
      { property: "og:title", content: "A sample chapter. Good Chapter" },
      { property: "og:description", content: "Walk through a sample Good Chapter: a friend starts it, the person approves it, and the circle claims gifts privately." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <figure className="mx-auto w-full max-w-5xl px-5 pt-6 md:px-8">
        <img src={scene.url} alt="A sunlit kitchen with a yellow kettle on the stove, an open moving box of dishes, keys on the counter, and two blue stools." width={1536} height={1024} className="aspect-[3/2] max-h-[420px] w-full rounded-[4px] border-2 border-foreground object-cover" />
        <figcaption className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Maya's first place, move-in afternoon. A friend started this chapter.</figcaption>
      </figure>
      <GoodChapterDemo initialView="friend" />
    </>
  ),
});

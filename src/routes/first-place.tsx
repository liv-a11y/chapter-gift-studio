import { createFileRoute } from "@tanstack/react-router";
import { FirstPlaceJourney } from "@/components/site/first-place-journey";

const title = "First Place. A sample chapter from Good Chapter, Co.";
const description = "Walk through a sample chapter: an agent anchors one real object, a friend starts it, the person approves it, and their circle fills the house.";

export const Route = createFileRoute("/first-place")({
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
  component: () => <FirstPlaceJourney />,
});


import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const Route = createFileRoute("/investors")({
  head: () => ({ meta: [
    { title: "Investors | Good Chapter" },
    { name: "description", content: "Weddings got a registry in 1924. Everything since got a card. Good Chapter is the anti-registry, at pilot stage." },
    { property: "og:title", content: "Investors | Good Chapter" },
    { property: "og:description", content: "Weddings got a registry in 1924. Everything since got a card. Good Chapter is the anti-registry, at pilot stage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PlaceholderPage eyebrow="Investors" title="Weddings got a registry in 1924. Everything since got a card." copy="Good Chapter is the anti-registry. A friend starts it. The person approves it. Nobody asks. One founder, pilot stage, nothing for sale yet." />,
});

import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const Route = createFileRoute("/partners/real-estate")({
  head: () => ({ meta: [
    { title: "Real estate agents & lenders. Good Chapter" },
    { name: "description", content: "Help clients feel supported after the keys change hands." },
    { property: "og:title", content: "Real estate agents & lenders. Good Chapter" },
    { property: "og:description", content: "Help clients feel supported after the keys change hands." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PlaceholderPage eyebrow="Real estate agents & lenders" title="Turn a first closing into a chapter worth remembering" copy="Help clients feel supported after the keys change hands." />,
});

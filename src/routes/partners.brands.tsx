import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const Route = createFileRoute("/partners/brands")({
  head: () => ({ meta: [
    { title: "Brands & collaborations. Good Chapter" },
    { name: "description", content: "Every Good Chapter gets a short list of real objects. If yours belongs on one, write to Liv." },
    { property: "og:title", content: "Brands & collaborations. Good Chapter" },
    { property: "og:description", content: "Every Good Chapter gets a short list of real objects. If yours belongs on one, write to Liv." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PlaceholderPage eyebrow="Brands & collaborations" title="Be the thing someone actually wanted." copy="Every chapter gets a short list of real objects. If yours belongs on one, write to Liv." />,
});

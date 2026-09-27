import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [
    { title: "Partners — Good Chapter" },
    { name: "description", content: "Bring Good Chapter to the people, clients, and communities you care for." },
    { property: "og:title", content: "Partners — Good Chapter" },
    { property: "og:description", content: "Bring Good Chapter to the people, clients, and communities you care for." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PlaceholderPage eyebrow="Partners" title="Partnerships for meaningful life moments" copy="Bring Good Chapter to the people, clients, and communities you care for." />,
});

import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const Route = createFileRoute("/partners/employers")({
  head: () => ({ meta: [
    { title: "Employers & benefits brokers — Good Chapter" },
    { name: "description", content: "A human benefit for the life transitions that rarely fit a standard program." },
    { property: "og:title", content: "Employers & benefits brokers — Good Chapter" },
    { property: "og:description", content: "A human benefit for the life transitions that rarely fit a standard program." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PlaceholderPage eyebrow="Employers & benefits brokers" title="Celebrate employees beyond the expected milestones" copy="A human benefit for the life transitions that rarely fit a standard program." />,
});

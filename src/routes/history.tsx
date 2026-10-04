import { createFileRoute } from "@tanstack/react-router";

import { EditorialArticle, inlineLink } from "@/components/site/editorial-article";
import { ToasterLine } from "@/components/site/illustration";
import toaster from "@/assets/06-toaster-and-couple.png.asset.json";

const TITLE = "You shouldn't need a wedding to get a toaster";
const DESC = "In 1924 a department store invented the registry for brides. A century later, everyone else is still buying their own toaster.";
const OG = "https://chapter-gift-studio.lovable.app/og-history.jpg";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:image", content: OG },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <EditorialArticle
      eyebrow="History · 1924"
      headline="A hundred years of toasters, for brides only."
      subtitle="In 1924 a department store gave one kind of life a gift list. Everyone else got a card."
      art={{ src: toaster.url, alt: "Illustration. A very large toaster with two slices of yellow toast, and a tiny bride and groom standing beside it." }}
      afterArt={<ToasterLine className="mt-6 text-[clamp(30px,4vw,48px)] leading-[1.08]" />}
      sections={[
        { n: "I", heading: "The list", body: [
          "In 1924, Marshall Field's, a department store, built the first modern bridal registry. A bride named the china, the silver, the crystal. Her guests bought from the list. Nobody doubled up on gravy boats.",
          "It was practical. It was also a gate. The list was for the woman starting a household, and only that woman.",
        ] },
        { n: "II", heading: "The permission slip", body: [
          "For a hundred years, a ring was the only permission slip. Engaged, you could say what your home needed. Not engaged, you got a card and, if you were lucky, a candle.",
          "Nobody wrote the rule down. Everybody followed it.",
        ] },
        { n: "III", heading: "One house to the next", body: [
          "The registry assumed one story: a woman stepping out of a father's house into a husband's. The store furnished the handoff.",
          "Marshall Field's never said it that way. We do, because it is what the list was built to do.",
        ] },
        { n: "IV", heading: "Everyone else", body: [
          "Women kept buying houses alone. People kept leaving marriages, starting over in half-empty rooms, moving to places where they knew no one. They still needed a pan.",
          "The care never stopped. The ritual just never came. Good Chapter is the ritual for the rest of it. A friend starts it. The person approves it. Nobody asks.",
        ] },
      ]}
      pullQuote="Domestic life shouldn't require an engagement ring."
      afterQuote={
        <aside className="mt-16 rounded-[4px] border-2 border-foreground p-6 md:p-8">
          <h2 className="font-mono text-[12px] uppercase tracking-[0.14em]">Sources</h2>
          <ul className="mt-5 space-y-4 text-[17px] leading-[1.55]">
            <li><a className={inlineLink} href="https://images.chicagohistory.org/asset/23427/" target="_blank" rel="noreferrer">Marshall Field's bridal-services archive, Chicago History Museum.</a></li>
            <li><a className={inlineLink} href="https://www.wttw.com/chicago-stories/marshall-fields/how-marshall-fields-transformed-shopping-from-errand-to-experience" target="_blank" rel="noreferrer">WTTW, Chicago Stories: how Marshall Field's changed shopping from an errand into an experience.</a></li>
            <li>Interpretation note: the line about a woman stepping out of a father's house into a husband's is Good Chapter's modern reading of the 1924 social contract. It is not store copy.</li>
          </ul>
        </aside>
      }
    />
  );
}

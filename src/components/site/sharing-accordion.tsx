import { useId, useState } from "react";
import lamp from "@/assets/p-cobalt-table-lamp-600.webp.asset.json";
import keyAndDoor from "@/assets/01-key-and-door.png.asset.json";
import familyDoor from "@/assets/03-family-through-door.png.asset.json";

const rows = [
  {
    title: "You give it, once",
    photo: lamp.url,
    alt: "Cobalt table lamp.",
    body: "You start the chapter for the person closing on a first place. You anchor one real object, put your name on it, and write the reason you chose it. That is the whole ask: one chapter, one person.",
    caption: "Example: Dana starts Maya’s chapter the week the keys change hands.",
  },
  {
    title: "We do not pass it on",
    photo: keyAndDoor.url,
    alt: "Drawing of a key and a door.",
    body: "Good Chapter never forwards a chapter, never posts it, and never adds anyone to it. It opens for one person, the one it was started for. If they say no, it ends there and nothing goes out.",
    caption: "Example: Maya’s sister is not on a list. No email, no invite, nothing from us.",
  },
  {
    title: "If they pass it on, your name is still on it",
    photo: familyDoor.url,
    alt: "Drawing of a family walking through a door.",
    body: "A chapter is easy to send along. When the person forwards it to their mother, their new neighbors, the friend who helped them move, everyone who opens it reads whose idea it was. Your name and your brokerage sit next to the reason you chose the lamp.",
    caption: "Example: Maya forwards it to her sister in Chicago, who reads: anchored by Dana Whitfield, Willow and Vine Realty.",
  },
];

/** How a realtor's chapter travels, and why the name on it is the value. */
export function SharingAccordion() {
  const base = useId();
  const [open, setOpen] = useState(0);

  return (
    <section aria-labelledby="sharing-heading" className="border-t-2 border-foreground bg-card">
      <div className="site-container py-14 md:py-20">
        <p className="eyebrow text-emphasis">How it travels</p>
        <h2 id="sharing-heading" className="mt-4 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">You hand it over. Your name stays on it.</h2>
        <p className="mt-6 max-w-[46rem] text-lg leading-relaxed">A chapter is not a mailing. It goes to one person, from you. What happens after that is theirs to choose.</p>

        <div className="mt-10 border-t-2 border-foreground">
          {rows.map((row, index) => {
            const isOpen = open === index;
            return (
              <div key={row.title} className="border-b-2 border-foreground">
                <h3>
                  <button
                    type="button"
                    id={`${base}-row-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-panel-${index}`}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="flex min-h-11 w-full items-center gap-4 px-1 py-5 text-left hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                      <span className="absolute left-0 top-[7px] h-[2px] w-4 bg-foreground" />
                      <span className={`absolute left-[7px] top-0 h-4 w-[2px] bg-foreground transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? "scale-y-0" : "scale-y-100"}`} />
                    </span>
                    <span className="font-display text-2xl leading-[1.1]">{row.title}</span>
                  </button>
                </h3>
                <div id={`${base}-panel-${index}`} role="region" aria-labelledby={`${base}-row-${index}`} hidden={!isOpen}>
                  <div className="grid gap-6 pb-7 pl-1 md:grid-cols-[3fr_4fr]">
                    <img src={row.photo} alt={row.alt} loading="lazy" className="h-full max-h-[320px] min-h-[220px] w-full rounded-[4px] border-2 border-foreground bg-background object-cover" />
                    <div className="flex flex-col justify-end gap-5 pb-2 md:pr-6">
                      <p className="text-lg leading-relaxed">{row.body}</p>
                      <p className="text-[17px] italic leading-[1.4] text-muted-foreground">{row.caption}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 max-w-[46rem] text-lg leading-relaxed">The chapter keeps showing up long after the keys change hands. That is what putting your name on it is worth.</p>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import bench from "@/assets/02-bench.png.asset.json";
import { Illustration } from "@/components/site/illustration";

const barriers = [
  {
    n: "01",
    title: "The marriage barrier",
    body: "For a hundred years, care came with a ring or a baby. Buy a home alone or start over, and you furnish that life in private.",
  },
  {
    n: "02",
    title: "The vulnerability tax",
    body: "People will eat off one plate before they ask for help. A friend starts it, so nobody has to ask.",
  },
  {
    n: "03",
    title: "The \u201clet me know\u201d trap",
    body: "Good intentions die in a text thread. A chapter gives friends one useful thing to do in five minutes.",
  },
];

export function Unlearning({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const H = headingLevel;
  return (
    <section className="site-section" aria-labelledby="unlearning">
      <div className="site-container">
        <p className="eyebrow text-emphasis">Essays · Cultural barriers</p>
        <H id="unlearning" className={`${headingLevel === "h1" ? "site-h1" : "site-h2"} mt-5 max-w-[16ch]`}>
          The rules we are unlearning.
        </H>
        <p className="mt-6 max-w-[40rem] text-[18px] leading-[1.5] text-muted-foreground">
          Why it takes an engagement ring to get a toaster, why nobody asks for a skillet, and how we start celebrating the rest of life on purpose.
        </p>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {barriers.map((b) => (
            <li key={b.n} className="rounded-[4px] border-2 border-foreground p-6">
              <span className="eyebrow text-muted-foreground">{b.n}</span>
              <h3 className="mt-4 font-display text-[28px] leading-[1.08]">{b.title}</h3>
              <p className="mt-4 text-[17px] leading-[1.5] text-muted-foreground">{b.body}</p>
            </li>
          ))}
        </ol>

        <Link
          to="/journal/vulnerability-tax"
          className="group mt-10 grid items-center gap-8 rounded-[4px] border-2 border-foreground bg-card p-5 hover:bg-foreground hover:text-background sm:p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
        >
          <Illustration src={bench.url} alt="Two people sitting together on a simple bench beneath a wandering loop of ink line." />
          <div>
            <p className="eyebrow text-emphasis group-hover:text-background">Founder note</p>
            <h3 className="mt-4 font-display text-[clamp(32px,4vw,48px)] leading-[1.04]">The vulnerability tax</h3>
            <p className="mt-4 text-[18px] leading-[1.5]">Nobody wants to ask for a pan. Why a friend has to start it.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-medium text-primary group-hover:text-background">
              Read the essay <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

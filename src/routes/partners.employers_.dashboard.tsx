import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { SiteShell } from "@/components/site/site-shell";

const title = "Partner dashboard prototype. Good Chapter, Co.";
const description = "A sample partner dashboard: pool spend, chapter counts, and give back progress. Counts only, nothing personal.";

export const Route = createFileRoute("/partners/employers_/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const POOL = 10000;
const ANCHOR = 200;
const GIVE_PCT = 5;

// Sample weekly counts over a 13 week pilot. Weeks after "now" are empty.
const WEEKS = [
  { started: 3, approved: 2, sent: 1, declined: 0 },
  { started: 4, approved: 3, sent: 2, declined: 1 },
  { started: 5, approved: 4, sent: 3, declined: 0 },
  { started: 3, approved: 3, sent: 4, declined: 1 },
  { started: 6, approved: 4, sent: 3, declined: 1 },
  { started: 4, approved: 4, sent: 4, declined: 0 },
  { started: 2, approved: 2, sent: 3, declined: 0 },
];
const NOW = WEEKS.length;

const TEAMS = [
  { team: "Engineering", n: 7 },
  { team: "Operations", n: 5 },
  { team: "Support", n: 4 },
  { team: "Sales", n: 3 },
  { team: "Finance", n: 3 },
];
const TYPES = [
  { type: "First place", n: 6 },
  { type: "New role", n: 5 },
  { type: "Caring for family", n: 4 },
  { type: "Starting over", n: 4 },
  { type: "Fresh start", n: 3 },
];
const CAUSES = ["DonorsChoose classrooms", "A local nonprofit", "One the team cares about"];

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const sum = (k: keyof (typeof WEEKS)[number]) => WEEKS.reduce((a, w) => a + w[k], 0);

function DashboardPage() {
  const [cause, setCause] = useState(CAUSES[0]!);
  const approved = sum("approved");
  const sent = sum("sent");
  const declined = sum("declined");
  const started = sum("started");
  const committed = approved * ANCHOR;
  const remaining = Math.max(POOL - committed, 0);
  const pctUsed = Math.round((committed / POOL) * 100);
  const giveBack = Math.round((committed * GIVE_PCT) / 100);
  const giveTarget = Math.round((POOL * GIVE_PCT) / 100);
  const classrooms = Math.floor(giveBack / 150);
  const maxWeek = Math.max(...WEEKS.map((w) => w.approved), 1);
  const maxTeam = Math.max(...TEAMS.map((t) => t.n));

  return (
    <SiteShell>
      <section className="site-container py-12 lg:py-16">
        <p className="eyebrow text-emphasis">Prototype · Sample data only</p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Your pilot, week {NOW} of 13.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed">Pool, chapters, and give back in one place. You see counts and spend. You never see names, addresses, or what anyone kept.</p>

        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat k="Pool used" v={`${pctUsed}%`} sub={`${money(committed)} of ${money(POOL)}`} />
          <Stat k="Remaining" v={money(remaining)} sub={`About ${Math.floor(remaining / ANCHOR)} more chapters`} />
          <Stat k="Gifts sent" v={String(sent)} sub={`${approved} approved so far`} />
          <Stat k="Give back" v={money(giveBack)} sub={`To ${cause}`} highlight />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            <Panel title="Pool">
              <div className="h-4 rounded-sm border-2 border-foreground" aria-label={`${pctUsed}% of pool committed`}>
                <div className="h-full bg-emphasis" style={{ width: `${Math.min(100, pctUsed)}%` }} />
              </div>
              <p className="mt-3 text-sm">{money(ANCHOR)} anchor gift per approved chapter. Declined chapters cost nothing.</p>
            </Panel>

            <Panel title="Approved chapters by week">
              <div className="flex h-40 items-end gap-2" role="img" aria-label="Approved chapters per week, weeks 1 to 13">
                {Array.from({ length: 13 }, (_, i) => {
                  const w = WEEKS[i];
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div className={`w-full rounded-sm border-2 border-foreground ${w ? "bg-primary" : "border-dashed"}`} style={{ height: w ? `${(w.approved / maxWeek) * 120}px` : "4px" }} />
                      <span className="font-mono text-[11px]">{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Chapter status">
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Mini k="Started" v={started} />
                <Mini k="Approved" v={approved} />
                <Mini k="Gift sent" v={sent} />
                <Mini k="Declined" v={declined} />
              </dl>
              <p className="mt-3 text-sm">Declines are never flagged to a manager.</p>
            </Panel>

            <div className="grid gap-8 sm:grid-cols-2">
              <Panel title="By team">
                <ul className="space-y-2">
                  {TEAMS.map((t) => (
                    <li key={t.team}>
                      <div className="flex justify-between text-sm"><span>{t.team}</span><span className="font-mono">{t.n}</span></div>
                      <div className="mt-1 h-2 rounded-sm border-2 border-foreground"><div className="h-full bg-foreground" style={{ width: `${(t.n / maxTeam) * 100}%` }} /></div>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">Teams under three chapters show as "Fewer than 3."</p>
              </Panel>
              <Panel title="By chapter type">
                <ul className="divide-y-2 divide-foreground border-y-2 border-foreground">
                  {TYPES.map((t) => (
                    <li key={t.type} className="flex justify-between py-2 text-sm"><span>{t.type}</span><span className="font-mono">{t.n}</span></li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          <aside className="h-fit space-y-6 rounded-sm border-2 border-foreground p-5">
            <div>
              <p className="eyebrow text-emphasis">Give back</p>
              <p className="mt-3 font-display text-4xl">{money(giveBack)}</p>
              <div className="mt-3 h-4 rounded-sm border-2 border-foreground" aria-hidden="true">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (giveBack / giveTarget) * 100)}%` }} />
              </div>
              <p className="mt-2 text-sm">{GIVE_PCT}% of each anchor gift. {money(giveTarget)} if the full pool is used.</p>
              {cause === CAUSES[0] && <p className="mt-2 text-sm">About {classrooms} classroom requests funded so far.</p>}
            </div>
            <fieldset>
              <legend className="eyebrow">Where it goes</legend>
              <div className="mt-2 space-y-2">
                {CAUSES.map((c) => (
                  <button key={c} onClick={() => setCause(c)} className={`block w-full rounded-sm border-2 border-foreground px-3 py-2 text-left text-sm hover:bg-foreground hover:text-background ${cause === c ? "bg-highlight" : ""}`}>{c}</button>
                ))}
              </div>
            </fieldset>
            <p className="text-sm">Reported once a year in the impact report.</p>
            <div className="flex flex-col gap-2">
              <Link to="/partners/employers/portal" className="eyebrow underline hover:bg-foreground hover:text-background">Open the portal setup</Link>
              <Link to="/partners/employers" className="eyebrow underline hover:bg-foreground hover:text-background">Back to employers</Link>
            </div>
          </aside>
        </div>
        <p className="eyebrow mt-8">Prototype with sample data. Nothing here is saved, charged, or sent.</p>
      </section>
    </SiteShell>
  );
}

function Stat({ k, v, sub, highlight }: { k: string; v: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-sm border-2 border-foreground p-4 ${highlight ? "bg-highlight" : ""}`}>
      <p className="eyebrow">{k}</p>
      <p className="mt-2 font-display text-3xl">{v}</p>
      <p className="mt-1 text-sm">{sub}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border-2 border-foreground p-5">
      <h2 className="eyebrow text-emphasis">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Mini({ k, v }: { k: string; v: number }) {
  return <div className="rounded-sm border-2 border-foreground p-3"><dt className="eyebrow">{k}</dt><dd className="mt-1 font-display text-2xl">{v}</dd></div>;
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { SiteShell } from "@/components/site/site-shell";
import { GiftFlow } from "@/components/site/gift-flow";
import { Ticker } from "@/components/site/portal-ui";
import { CareCockpit } from "@/components/site/care-cockpit";

const title = "Employer portal prototype. Good Chapter, Co.";
const description = "Walk through a sample employer pilot: set the pool, choose the anchor gift, and see a counts-only ledger and give back tracker.";

export const Route = createFileRoute("/partners/employers_/portal")({
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
  component: PortalPage,
});

const POOLS = [2500, 5000, 10000];
const ANCHORS = [100, 150, 200, 250];
const TEAMS = ["Engineering", "Operations", "Sales", "Support", "Finance"];
const CATEGORIES = ["First place", "Starting over", "New role", "Caring for family", "Fresh start"];
const CAUSES = [
  { id: "donorschoose", label: "DonorsChoose classrooms", note: "Default. Funds teacher requests." },
  { id: "local", label: "A local nonprofit", note: "Chosen by the partner." },
  { id: "team", label: "One the team cares about", note: "Picked once per pilot." },
];

type Status = "Started" | "Approved" | "Gift sent" | "Declined";
type Entry = { id: number; team: string; category: string; status: Status; week: number };

const SEED: Entry[] = [
  { id: 1, team: "Engineering", category: "First place", status: "Gift sent", week: 1 },
  { id: 2, team: "Operations", category: "Caring for family", status: "Gift sent", week: 2 },
  { id: 3, team: "Sales", category: "New role", status: "Approved", week: 3 },
  { id: 4, team: "Support", category: "Starting over", status: "Declined", week: 3 },
  { id: 5, team: "Finance", category: "Fresh start", status: "Started", week: 4 },
];

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const counts = (s: Status) => s === "Approved" || s === "Gift sent";

function PortalPage() {
  const [step, setStep] = useState(1);
  const [pool, setPool] = useState(10000);
  const [anchor, setAnchor] = useState(200);
  const [cap, setCap] = useState(1);
  const [givePct, setGivePct] = useState(5);
  const [cause, setCause] = useState("donorschoose");
  const [entries, setEntries] = useState<Entry[]>(SEED);

  const committed = useMemo(() => entries.filter((e) => counts(e.status)).length * anchor, [entries, anchor]);
  const remaining = Math.max(pool - committed, 0);
  const capacity = Math.floor(pool / anchor);
  const sent = entries.filter((e) => e.status === "Gift sent").length;
  const giveBack = Math.round((committed * givePct) / 100);
  const giveTarget = Math.round((pool * givePct) / 100);
  const causeLabel = CAUSES.find((c) => c.id === cause)?.label ?? "";

  function addChapter() {
    if (remaining < anchor) return;
    const n = entries.length + 1;
    setEntries([...entries, { id: n, team: TEAMS[n % TEAMS.length]!, category: CATEGORIES[n % CATEGORIES.length]!, status: "Started", week: Math.min(13, 4 + Math.ceil(n / 3)) }]);
  }
  function advance(id: number) {
    const next: Record<Status, Status> = { Started: "Approved", Approved: "Gift sent", "Gift sent": "Gift sent", Declined: "Declined" };
    setEntries(entries.map((e) => (e.id === id ? { ...e, status: next[e.status] } : e)));
  }
  function decline(id: number) {
    setEntries(entries.map((e) => (e.id === id && e.status === "Started" ? { ...e, status: "Declined" } : e)));
  }

  const tabs = ["Pool", "Anchor gift", "Ledger", "Give back", "Gift flow"];

  return (
    <SiteShell>
      <section className="site-container py-12 lg:py-16">
        <p className="eyebrow text-emphasis">Prototype · Sample data only</p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Your pilot, from the company side.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed">Set a pool. Pick the anchor gift. Watch chapters move. You see counts and spend. You never see names, addresses, or what anyone kept.</p>

        <div className="mt-10 grid grid-cols-2 border-2 border-foreground sm:grid-cols-5" role="tablist">
          {tabs.map((t, i) => (
            <button key={t} role="tab" aria-selected={step === i + 1} onClick={() => setStep(i + 1)}
              className={`border-foreground px-3 py-3 text-left font-mono text-xs uppercase tracking-[0.14em] hover:bg-foreground hover:text-background ${i > 0 ? "sm:border-l-2" : ""} ${step === i + 1 ? "bg-foreground text-background" : ""}`}>
              {String(i + 1).padStart(2, "0")} {t}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-sm border-2 border-foreground p-6">
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl">Set the pilot pool.</h2>
                <p className="mt-2 leading-relaxed">One fixed amount for 90 days. Paid by corporate card or one invoice. No IT ticket.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {POOLS.map((p) => (
                    <button key={p} onClick={() => setPool(p)} className={`rounded-sm border-2 border-foreground px-5 py-3 font-display text-xl hover:bg-foreground hover:text-background ${pool === p ? "bg-highlight" : ""}`}>{money(p)}</button>
                  ))}
                </div>
                <label className="mt-6 block">
                  <span className="eyebrow">Yearly cap per employee</span>
                  <select value={cap} onChange={(e) => setCap(Number(e.target.value))} className="mt-2 block rounded-sm border-2 border-foreground bg-background px-3 py-2">
                    <option value={1}>1 chapter</option><option value={2}>2 chapters</option>
                  </select>
                </label>
                <NextBtn onClick={() => setStep(2)} />
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl">Choose the anchor gift.</h2>
                <p className="mt-2 leading-relaxed">The company covers this first gift in every chapter. The employee chooses the object. Teammates may add more, quietly, only if invited.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {ANCHORS.map((a) => (
                    <button key={a} onClick={() => setAnchor(a)} className={`rounded-sm border-2 border-foreground px-5 py-3 font-display text-xl hover:bg-foreground hover:text-background ${anchor === a ? "bg-highlight" : ""}`}>{money(a)}</button>
                  ))}
                </div>
                <p className="mt-6 font-display text-xl">{money(pool)} covers about {capacity} chapters.</p>
                <NextBtn onClick={() => setStep(3)} />
              </div>
            )}
            {step === 3 && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl">The ledger.</h2>
                    <p className="mt-2 leading-relaxed">Team, chapter type, and status. Nothing personal.</p>
                  </div>
                  <button onClick={addChapter} disabled={remaining < anchor} className="rounded-sm border-2 border-foreground bg-primary px-4 py-2 text-primary-foreground hover:bg-foreground hover:text-background disabled:opacity-50">Simulate a new chapter</button>
                </div>
                <ul className="mt-6 divide-y-2 divide-foreground border-y-2 border-foreground">
                  {entries.map((e) => (
                    <li key={e.id} className="grid grid-cols-2 items-center gap-2 py-3 sm:grid-cols-[4rem_1fr_1fr_7rem_auto]">
                      <span className="eyebrow">Ch {String(e.id).padStart(3, "0")}</span>
                      <span>{e.team}</span>
                      <span className="text-sm">{e.category} · Wk {e.week}</span>
                      <span className={`w-fit rounded-sm border-2 border-foreground px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] ${e.status === "Gift sent" ? "bg-highlight" : ""}`}>{e.status}</span>
                      <span className="flex gap-2 justify-self-end">
                        {(e.status === "Started" || e.status === "Approved") && <button onClick={() => advance(e.id)} className="eyebrow underline hover:bg-foreground hover:text-background">Advance</button>}
                        {e.status === "Started" && <button onClick={() => decline(e.id)} className="eyebrow underline hover:bg-foreground hover:text-background">Decline</button>}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm">Declined chapters cost nothing and are never flagged to a manager.</p>
                <NextBtn onClick={() => setStep(4)} />
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="font-display text-2xl">Give back tracker.</h2>
                <p className="mt-2 leading-relaxed">Every approved chapter sets aside a share for a cause. Unassigned margin goes to DonorsChoose classrooms. Every other chapter helps a teacher start a child's next one.</p>
                <fieldset className="mt-6">
                  <legend className="eyebrow">Where it goes</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {CAUSES.map((c) => (
                      <button key={c.id} onClick={() => setCause(c.id)} className={`rounded-sm border-2 border-foreground p-4 text-left hover:bg-foreground hover:text-background ${cause === c.id ? "bg-highlight" : ""}`}>
                        <span className="block font-medium">{c.label}</span><span className="mt-1 block text-sm">{c.note}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="mt-6 block">
                  <span className="eyebrow">Share of each anchor gift: {givePct}%</span>
                  <input type="range" min={0} max={15} value={givePct} onChange={(e) => setGivePct(Number(e.target.value))} className="mt-2 block w-full accent-[var(--primary)]" />
                </label>
                <div className="mt-6 rounded-sm border-2 border-foreground bg-highlight p-5">
                  <p className="eyebrow">To {causeLabel} so far</p>
                  <p className="mt-2 font-display text-4xl">{money(giveBack)}</p>
                  <div className="mt-4 h-4 rounded-sm border-2 border-foreground bg-background" aria-hidden="true">
                    <div className="h-full bg-primary" style={{ width: `${giveTarget ? Math.min(100, (giveBack / giveTarget) * 100) : 0}%` }} />
                  </div>
                  <p className="mt-2 text-sm">{money(giveTarget)} if the full pool is used. Reported once a year in the impact report.</p>
                </div>
                <NextBtn onClick={() => setStep(5)} />
              </div>
            )}
            {step === 5 && (
              <div>
                <h2 className="font-display text-2xl">One chapter, start to finish.</h2>
                <p className="mt-2 mb-6 leading-relaxed">Approve, fund from the pool, let teammates keep adding, deliver with a quiet thank-you.</p>
                <GiftFlow anchor={anchor} />
              </div>
            )}
          </div>

          <aside className="h-fit rounded-sm border-2 border-foreground p-5">
            <p className="eyebrow text-emphasis">Pilot summary</p>
            <dl className="mt-4 space-y-3">
              <Row k="Pool" v={money(pool)} />
              <Row k="Anchor gift" v={money(anchor)} />
              <Row k="Cap per employee" v={`${cap} per year`} />
              <Row k="Committed" v={<Ticker value={committed} />} />
              <Row k="Remaining" v={<Ticker value={remaining} />} />
              <Row k="Gifts sent" v={String(sent)} />
              <Row k="Give back" v={money(giveBack)} />
            </dl>
            <div className="mt-4 h-3 rounded-sm border-2 border-foreground" aria-label={`${Math.round((committed / pool) * 100)}% of pool committed`}>
              <div className="h-full bg-emphasis" style={{ width: `${Math.min(100, (committed / pool) * 100)}%` }} />
            </div>
            <Link to="/partners/employers/dashboard" className="mt-6 block eyebrow underline hover:bg-foreground hover:text-background">See the dashboard</Link>
            <Link to="/partners/employers" className="mt-2 inline-block eyebrow underline hover:bg-foreground hover:text-background">Back to employers</Link>
          </aside>
        </div>
        <CareCockpit anchor={anchor} />
        <p className="eyebrow mt-8">Prototype with sample data. Nothing here is saved, charged, or sent.</p>
      </section>
    </SiteShell>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between gap-4 border-b-2 border-foreground pb-2"><dt className="eyebrow">{k}</dt><dd className="font-mono tabular-nums">{v}</dd></div>;
}

function NextBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="mt-8 rounded-sm border-2 border-foreground bg-primary px-5 py-3 text-primary-foreground hover:bg-foreground hover:text-background">Next</button>;
}

import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { sampleProducts } from "@/lib/sample-products";

// Shared sample journey for /first-place and the focused demo routes.
const phases = ["Closing", "A friend starts it", "Maya approves it", "The invitation", "A guest gives"] as const;
type Product = (typeof sampleProducts)[number];

const btn = "inline-flex items-center justify-center rounded-[4px] border-2 border-primary bg-primary px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground hover:bg-foreground hover:border-foreground hover:text-background";
const ghost = "inline-flex items-center justify-center rounded-[4px] border-2 border-foreground px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] hover:bg-foreground hover:text-background";
const label = "font-mono text-[11px] uppercase tracking-[0.14em]";

export function FirstPlaceJourney({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep);
  const [kept, setKept] = useState<string[]>(sampleProducts.map((p) => p.id));
  const [approved, setApproved] = useState(initialStep > 2);
  const [claimed, setClaimed] = useState<string[]>(["mug"]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="site-container flex items-center justify-between py-5">
        <Link to="/" className="font-display text-xl">Good Chapter, Co.</Link>
        <span className={`${label} text-emphasis`}>Sample chapter</span>
      </header>

      <nav aria-label="Journey" className="sticky top-0 z-10 border-y-2 border-foreground bg-background">
        <ol className="site-container flex gap-1 overflow-x-auto py-3">
          {phases.map((p, i) => (
            <li key={p} className="shrink-0">
              <button
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={`${label} rounded-[4px] px-3 py-2 ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-mist" : "hover:bg-foreground hover:text-background"}`}
              >
                0{i + 1} {p}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section className="site-container max-w-3xl py-10 sm:py-14">
        {step === 0 && (
          <Scene eyebrow="01 Closing" title="Maya just got the keys. The rooms are empty.">
            <p>Her agent skips the branded cutting board. She anchors one real object instead, a table lamp for the first night in.</p>
            <ProductRow p={sampleProducts[7]} note="Anchored by her agent" />
            <Next onClick={() => setStep(1)}>Hand it to a friend</Next>
          </Scene>
        )}

        {step === 1 && (
          <Scene eyebrow="02 A friend starts it" title="Jordan picks eight things Maya will actually use.">
            <p>Three bands, so everyone can find a yes. Each object comes with a reason.</p>
            {(["Under $50", "$50 to $100", "$100 to $250"] as const).map((band) => (
              <div key={band} className="mt-8">
                <p className={`${label} text-emphasis`}>{band}</p>
                <div className="mt-3 grid gap-3">
                  {sampleProducts.filter((p) => p.band === band).map((p) => <ProductRow key={p.id} p={p} />)}
                </div>
              </div>
            ))}
            <Next onClick={() => setStep(2)}>Send to Maya to approve</Next>
          </Scene>
        )}

        {step === 2 && (
          <Scene eyebrow="03 Maya approves it" title={approved ? "Approved. Nobody saw the edits." : "Keep what fits. Drop the rest."}>
            <p>Only Maya sees this. Tap an object to drop it, then approve.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sampleProducts.map((p) => {
                const on = kept.includes(p.id);
                return (
                  <button
                    key={p.id}
                    disabled={approved}
                    aria-pressed={on}
                    onClick={() => setKept(on ? kept.filter((k) => k !== p.id) : [...kept, p.id])}
                    className={`rounded-[4px] border-2 p-2 text-left ${on ? "border-foreground bg-card" : "border-border opacity-50"}`}
                  >
                    <img src={p.photo} alt={p.name} className="aspect-square w-full rounded-[4px] object-cover" />
                    <span className="mt-2 block text-[14px] font-medium">{p.name}</span>
                    <span className={`${label} ${on ? "" : "line-through"}`}>{on ? "Keeping" : "Dropped"}</span>
                  </button>
                );
              })}
            </div>
            {approved ? (
              <Next onClick={() => setStep(3)}>See the invitation</Next>
            ) : (
              <button className={`${btn} mt-8`} disabled={kept.length === 0} onClick={() => setApproved(true)}>
                Approve {kept.length} objects
              </button>
            )}
          </Scene>
        )}

        {step === 3 && (
          <Scene eyebrow="04 The invitation" title="Maya shares it with whoever she chooses.">
            <div className="mt-6 rounded-[4px] bg-mist p-6 sm:p-8">
              <p className={label}>A private link from Maya</p>
              <p className="mt-4 font-display text-2xl leading-snug">Maya has a first place. Here are a few things that would make it hers.</p>
              <p className="mt-4">Pick one. Shop wherever you like. We hold it so nobody doubles up.</p>
            </div>
            <p className="mt-6 text-muted-foreground">No public page. No activity feed. No running total.</p>
            <Next onClick={() => setStep(4)}>Open as a guest</Next>
          </Scene>
        )}

        {step === 4 && (
          <GuestStep
            items={sampleProducts.filter((p) => kept.includes(p.id))}
            claimed={claimed}
            onClaim={(id) => setClaimed([...claimed, id])}
            onRestart={() => { setStep(0); setApproved(false); setKept(sampleProducts.map((p) => p.id)); setClaimed(["mug"]); }}
          />
        )}
      </section>

      <footer className="site-container border-t-2 border-foreground py-8 text-[14px] text-muted-foreground">
        A sample chapter. Prices and objects are illustrative. Good Chapter, Co. never takes payment here, and retailers listed are retailer options, not partners.
      </footer>
    </main>
  );
}

function GuestStep({ items, claimed, onClaim, onRestart }: { items: Product[]; claimed: string[]; onClaim: (id: string) => void; onRestart: () => void }) {
  const [pick, setPick] = useState<Product | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  if (done && pick) {
    return (
      <Scene eyebrow="Held for you" title={`The ${pick.name.toLowerCase()} is yours to give.`}>
        <div className="mt-6 rounded-[4px] bg-card p-6">
          <p className={label}>Your slip</p>
          <ul className="mt-4 grid gap-2 text-[16px]">
            <li>Object. {pick.name}</li>
            <li>Shop anywhere. Retailer options are only suggestions.</li>
            <li>Note. {note.trim() ? "Saved for Maya" : "None, that is fine"}</li>
            <li>Nobody else can claim it now.</li>
          </ul>
        </div>
        <p className="mt-6">Concierge status. Waiting on delivery. We will mark it arrived when Maya says so.</p>
        <button className={`${ghost} mt-8`} onClick={onRestart}>Start the sample again</button>
      </Scene>
    );
  }

  if (pick) {
    return (
      <Scene eyebrow="05 A guest gives" title={`Why the ${pick.name.toLowerCase()}.`}>
        <ProductRow p={pick} />
        <label className="mt-6 block">
          <span className={label}>A note for Maya, optional</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={280} rows={3} className="mt-2 w-full rounded-[4px] border-2 border-foreground bg-card p-3" />
        </label>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className={btn} onClick={() => { onClaim(pick.id); setDone(true); }}>Hold this one</button>
          <button className={ghost} onClick={() => setPick(null)}>Back</button>
        </div>
      </Scene>
    );
  }

  return (
    <Scene eyebrow="05 A guest gives" title="Pick one thing. That is the whole ask.">
      {items.length === 0 ? (
        <p className="mt-6">Maya has not approved anything yet. Check back soon.</p>
      ) : (
        <div className="mt-6 grid gap-3">
          {items.map((p) => {
            const taken = claimed.includes(p.id);
            return (
              <button key={p.id} disabled={taken} onClick={() => setPick(p)} className="text-left disabled:opacity-50">
                <ProductRow p={p} note={taken ? "Already held" : undefined} />
              </button>
            );
          })}
        </div>
      )}
    </Scene>
  );
}

function Scene({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={`${label} text-emphasis`}>{eyebrow}</p>
      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">{title}</h1>
      <div className="mt-5 text-[18px] leading-[1.6]">{children}</div>
    </div>
  );
}

function ProductRow({ p, note }: { p: Product; note?: string | undefined }) {
  return (
    <div className="mt-4 flex items-center gap-4 rounded-[4px] bg-card p-3">
      <img src={p.photo} alt={p.name} className="size-20 shrink-0 rounded-[4px] object-cover" />
      <div className="min-w-0">
        <p className="font-medium">{p.name} <span className="text-muted-foreground">${p.price}</span></p>
        <p className="text-[15px] leading-snug text-muted-foreground">{p.reason}</p>
        {note && <p className={`${label} mt-1 text-primary`}>{note}</p>}
      </div>
    </div>
  );
}

function Next({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button className={`${btn} mt-8`} onClick={onClick}>{children}</button>;
}

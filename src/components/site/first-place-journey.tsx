import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { sampleProducts } from "@/lib/sample-products";
import { createGiftCheckout, SHARE_VARIANT, shopifyVariants } from "@/lib/shopify";
import { isShareable, portionOptions, remaining, validPortion } from "@/lib/gift-shares";

// Shared sample journey for /first-place and the focused demo routes.
const phases = ["Closing", "A friend starts it", "Maya approves it", "The invitation", "A guest gives"] as const;
type Product = (typeof sampleProducts)[number];

const btn = "inline-flex items-center justify-center rounded-[4px] border-2 border-primary bg-primary px-5 py-3 font-medium text-[14px] text-primary-foreground hover:bg-foreground hover:border-foreground hover:text-background";
const ghost = "inline-flex items-center justify-center rounded-[4px] border-2 border-foreground px-5 py-3 font-medium text-[14px] hover:bg-foreground hover:text-background";
const label = "font-medium text-[13px]";

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
        A sample chapter. Prices and objects are illustrative. Checkout runs on the Good Chapter shop, and retailers listed are retailer options, not partners.
      </footer>
    </main>
  );
}

type Claim = { from: string; mine: boolean; amount?: number | undefined; note?: string | undefined };

function GuestStep({ items, claimed, onClaim, onRestart }: { items: Product[]; claimed: string[]; onClaim: (id: string) => void; onRestart: () => void }) {
  const [mine, setMine] = useState<Record<string, Claim>>({});
  const [gathered, setGathered] = useState<Record<string, number>>({ lamp: 120 });
  const [openId, setOpenId] = useState<string | null>(null);
  const myIds = Object.keys(mine);

  return (
    <Scene eyebrow="05 A guest gives" title="Maya's chapter. Take the one you would most like to give.">
      <p className="max-w-[46ch] text-muted-foreground">Give one thing on your own. On the bigger pieces, you can chip in a portion with others. Nothing here is a request for money.</p>
      {items.length === 0 ? (
        <p className="mt-6 rounded-[4px] bg-card p-5">There is nothing to give from this chapter yet. Your link will work once Maya says yes.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((p, i) => (
            <GuestCard
              key={p.id}
              p={p}
              index={i}
              gathered={gathered[p.id] ?? 0}
              claim={mine[p.id] ?? (claimed.includes(p.id) ? { from: "Someone who cares", mine: false } : undefined)}
              asking={openId === p.id}
              onAsk={() => setOpenId(p.id)}
              onCancel={() => setOpenId(null)}
              onTake={(from, amount, note) => {
                const total = amount ? (gathered[p.id] ?? 0) + amount : p.price;
                if (!amount || total >= p.price) onClaim(p.id);
                if (amount) setGathered({ ...gathered, [p.id]: total });
                setMine({ ...mine, [p.id]: { from, mine: true, amount, note } });
                setOpenId(null);
              }}
            />
          ))}
        </div>
      )}
      {myIds.length > 0 && (
        <div className="mt-8 rounded-[4px] bg-card p-6">
          <p className={label}>Your slip</p>
          <ul className="mt-3 grid gap-1 text-[16px]">
            {myIds.map((id) => {
              const c = mine[id];
              const name = items.find((p) => p.id === id)?.name;
              return <li key={id}>{c?.amount ? `$${c.amount} toward the ${name?.toLowerCase()}` : name}. From {c?.from}.{c?.note ? ` “${c.note}”` : ""}</li>;
            })}
            <li>Nobody else can take what is yours.</li>
            <li>Concierge status. Waiting on delivery. We mark it arrived when Maya says so.</li>
          </ul>
        </div>
      )}
      <p className={`${label} mt-8 text-muted-foreground`}>A friend started this. Maya approved every item here.</p>
      <button className={`${ghost} mt-6`} onClick={onRestart}>Start the sample again</button>
    </Scene>
  );
}

function GuestCard({ p, index, gathered, claim, asking, onAsk, onCancel, onTake }: { p: Product; index: number; gathered: number; claim: Claim | undefined; asking: boolean; onAsk: () => void; onCancel: () => void; onTake: (from: string, amount?: number, note?: string) => void }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [anon, setAnon] = useState(false);
  const [saving, setSaving] = useState(false);
  const shareable = isShareable(p.price);
  const left = remaining(p.price, gathered);
  const [mode, setMode] = useState<"whole" | "portion">(gathered > 0 ? "portion" : "whole");
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const portion = mode === "portion" ? validPortion(amount ?? Number(custom), p.price, gathered) : null;
  const canTake = mode === "whole" ? gathered === 0 : portion !== null;
  const take = () => {
    setSaving(true);
    window.setTimeout(() => { setSaving(false); onTake(anon || !name.trim() ? "Someone who cares" : name.trim(), mode === "portion" ? portion ?? undefined : undefined, note.trim() || undefined); }, 400);
  };
  const chip = (n: number, text: string) => (
    <button key={text} type="button" aria-pressed={amount === n} onClick={() => { setAmount(n); setCustom(""); }}
      className={`${label} rounded-[4px] border-2 border-foreground px-3 py-2 ${amount === n ? "bg-highlight text-foreground" : "hover:bg-foreground hover:text-background"}`}>{text}</button>
  );
  return (
    <article className="flex flex-col overflow-hidden rounded-[4px] bg-card">
      <img src={p.photo} alt={p.name} className="aspect-[4/3] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <p className={`${label} text-muted-foreground`}>{String(index + 1).padStart(2, "0")}</p>
        <h2 className="mt-1 font-display text-2xl leading-tight">{p.name}</h2>
        <p className="mt-2 text-[16px] leading-snug">{p.reason}</p>
        <div className="mt-3 flex items-baseline justify-between gap-3 text-[15px]">
          <span className="text-muted-foreground">Available from the Good Chapter shop</span>
          <span className="font-medium">${p.price}</span>
        </div>
        {shareable && gathered > 0 && left > 0 && <p className="mt-2 text-[15px] text-muted-foreground">${gathered} of ${p.price} gathered. ${left} left.</p>}
        <div className="mt-auto pt-4">
          {claim && (!claim.mine || !claim.amount) ? (
            <div className="border-t border-border pt-4">
              <p className={`${label} ${claim.mine ? "text-primary" : "text-muted-foreground"}`}>{claim.mine ? "Yours to give" : shareable && gathered >= p.price ? "Gathered together" : "Taken"}</p>
              {claim.mine && <p className="mt-1 text-[16px]">From {claim.from}</p>}
              {claim.mine && claim.note && <p className="mt-1 text-[16px] text-muted-foreground">“{claim.note}”</p>}
              {claim.mine && <BuyButton id={p.id} note={claim.note} from={claim.from} />}
            </div>
          ) : claim?.mine && claim.amount ? (
            <div className="border-t border-border pt-4">
              <p className={`${label} text-primary`}>{left === 0 ? "Gathered together" : "Your portion is held"}</p>
              <p className="mt-1 text-[16px]">${claim.amount} from {claim.from}</p>
              {claim.note && <p className="mt-1 text-[16px] text-muted-foreground">“{claim.note}”</p>}
              <BuyButton id={p.id} amount={claim.amount} giftName={p.name} note={claim.note} from={claim.from} />
            </div>
          ) : asking ? (
            <div className="border-t border-border pt-4">
              {shareable && (
                <div className="mb-4 flex gap-2" role="radiogroup" aria-label="How you give">
                  {gathered === 0 && <button type="button" role="radio" aria-checked={mode === "whole"} onClick={() => setMode("whole")} className={`${label} rounded-[4px] px-3 py-2 ${mode === "whole" ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`}>The whole thing</button>}
                  <button type="button" role="radio" aria-checked={mode === "portion"} onClick={() => setMode("portion")} className={`${label} rounded-[4px] px-3 py-2 ${mode === "portion" ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`}>Chip in a portion</button>
                </div>
              )}
              {mode === "portion" && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {portionOptions(p.price, gathered).map((n) => chip(n, `$${n}`))}
                    {chip(left, `Cover the rest, $${left}`)}
                  </div>
                  <label className={`${label} mt-3 block`} htmlFor={`amt-${p.id}`}>Or your own amount</label>
                  <input id={`amt-${p.id}`} inputMode="numeric" value={custom} placeholder={`Up to $${left}`} onChange={(e) => { setCustom(e.target.value.replace(/\D/g, "")); setAmount(null); }} className="mt-2 w-full rounded-[4px] border-2 border-foreground bg-background px-3 py-2" />
                  {custom && portion === null && <p className="mt-2 text-[15px] text-emphasis">Pick an amount from $1 to ${left}.</p>}
                </div>
              )}
              <label className={`${label} block`} htmlFor={`from-${p.id}`}>Who it is from</label>
              {anon ? (
                <p className="mt-2 rounded-[4px] border-2 border-foreground bg-background px-3 py-2 text-muted-foreground">Someone who cares</p>
              ) : (
                <input id={`from-${p.id}`} value={name} maxLength={60} placeholder="The Jones family" onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-[4px] border-2 border-foreground bg-background px-3 py-2" />
              )}
              <button type="button" className={`${label} mt-3 underline underline-offset-4`} onClick={() => setAnon(!anon)}>{anon ? "Use a name instead" : "Give it without my name"}</button>
              <label className={`${label} mt-4 block`} htmlFor={`note-${p.id}`}>A line for Maya, if you like</label>
              <textarea id={`note-${p.id}`} value={note} maxLength={200} rows={2} placeholder={mode === "portion" ? `Wanted to help with the ${p.name.toLowerCase()}.` : "For your first morning in."} onChange={(e) => setNote(e.target.value)} className="mt-2 w-full rounded-[4px] border-2 border-foreground bg-background px-3 py-2" />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" disabled={saving || !canTake} className={`${btn} disabled:opacity-50`} onClick={take}>{saving ? "Saving" : mode === "portion" ? (portion ? `Hold my $${portion}` : "Choose an amount") : "Take it"}</button>
                <button type="button" className={`${label} px-2 py-2 text-muted-foreground`} onClick={onCancel}>Never mind</button>
              </div>
            </div>
          ) : (
            <button type="button" className={`${ghost} w-full`} onClick={onAsk}>{gathered > 0 ? "Chip in" : "Take this one"}</button>
          )}
        </div>
      </div>
    </article>
  );
}

function BuyButton({ id, amount, giftName, note, from }: { id: string; amount?: number; giftName?: string | undefined; note?: string | undefined; from?: string | undefined }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const variant = amount ? SHARE_VARIANT : shopifyVariants[id];
  if (!variant) return null;
  const buy = async () => {
    setState("loading");
    const tab = window.open("", "_blank");
    try {
      const url = await createGiftCheckout(variant, amount ?? 1, amount ? giftName : undefined, note, from);
      if (tab) tab.location.href = url; else window.open(url, "_blank");
      setState("idle");
    } catch {
      tab?.close();
      setState("error");
    }
  };
  return (
    <div className="mt-3">
      <button type="button" disabled={state === "loading"} className={`${btn} w-full`} onClick={buy}>{state === "loading" ? "Opening checkout" : amount ? `Give my $${amount}` : "Buy it now"}</button>
      {state === "error" && <p className="mt-2 text-[15px] text-emphasis">Checkout did not open. Try once more.</p>}
    </div>
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

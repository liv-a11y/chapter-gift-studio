import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  EyeOff,
  LoaderCircle,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  Heart,
  LockKeyhole,
  Mail,
  Plus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import aperitif from "@/assets/aperitif.jpg";
import candle from "@/assets/candle.jpg";
import cookware from "@/assets/cookware.jpg";
import frame from "@/assets/frame.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "First Place for Maya — Good Chapter" },
      { name: "description", content: "A friend-made chapter for Maya's first home, privately approved by her." },
      { property: "og:title", content: "First Place for Maya — Good Chapter" },
      { property: "og:description", content: "Eight thoughtful things for Maya's first home, chosen by friends and approved by her." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GoodChapterPrototype,
});

type View = "friend" | "maya" | "guest";
type FriendStep = "chapter" | "edit" | "circle" | "sent";
type MayaStep = "review" | "delivery" | "approved";
type GuestStep = "landing" | "browse" | "claim" | "offlist" | "confirmed" | "gifted";
type GiftStatus = "Available" | "Claimed" | "Gifted";
type BrowseState = "ready" | "loading" | "empty" | "error";
type Band = "Easy yes" | "Considered" | "Practical" | "Group candidate";

type Item = {
  id: number;
  brand: string;
  name: string;
  price: number;
  band: Band;
  reason: string;
  image: string;
};

const items: Item[] = [
  { id: 1, brand: "OTHERLAND", name: "Rattan candle", price: 36, band: "Easy yes", reason: "For making the first night feel like home.", image: candle },
  { id: 2, brand: "GHIA", name: "First sip set", price: 48, band: "Easy yes", reason: "For a proper toast to the keys.", image: aperitif },
  { id: 3, brand: "FRAMEBRIDGE", name: "Tabletop frame", price: 49, band: "Easy yes", reason: "For the photo that makes it officially hers.", image: frame },
  { id: 4, brand: "OTHERLAND", name: "Three candle set", price: 89, band: "Considered", reason: "For a different mood in every new room.", image: candle },
  { id: 5, brand: "GHIA", name: "Aperitif duo", price: 76, band: "Considered", reason: "For hosting without making it a whole thing.", image: aperitif },
  { id: 6, brand: "FRAMEBRIDGE", name: "Gallery wall pair", price: 110, band: "Considered", reason: "For the blank wall she keeps talking about.", image: frame },
  { id: 7, brand: "CARAWAY", name: "Sauté pan", price: 145, band: "Practical", reason: "Because one excellent pan beats five bad ones.", image: cookware },
  { id: 8, brand: "CARAWAY", name: "Cookware set", price: 395, band: "Group candidate", reason: "A kitchen foundation from everyone who loves her.", image: cookware },
];

const bandLabels: Record<Band, string> = {
  "Easy yes": "$25–50",
  Considered: "$60–120",
  Practical: "$40–150",
  "Group candidate": "$200–400",
};

function GoodChapterPrototype() {
  const [view, setView] = useState<View>("friend");
  const [friendStep, setFriendStep] = useState<FriendStep>("chapter");
  const [mayaStep, setMayaStep] = useState<MayaStep>("review");
  const [guestStep, setGuestStep] = useState<GuestStep>("landing");
  const [claimedIds, setClaimedIds] = useState(() => new Set([2, 5]));
  const [giftedIds] = useState(() => new Set([3]));
  const [kept, setKept] = useState(() => new Set(items.map((item) => item.id)));
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [guests, setGuests] = useState(["Leah Park", "Nina Shah", "Sam Rivera", "Jordan Lee"]);

  const approvedItems = useMemo(() => items.filter((item) => kept.has(item.id)), [kept]);

  function reset(next: View) {
    setView(next);
    setFriendStep("chapter");
    setMayaStep("review");
    setGuestStep("landing");
    setSelectedGift(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <button className="font-display text-xl" onClick={() => reset("friend")} aria-label="Good Chapter home">
            Good Chapter<span className="text-highlight">.</span>
          </button>
          <div className="hidden items-center gap-1 rounded-sm bg-secondary p-1 sm:flex" aria-label="Prototype view">
            <ViewTab active={view === "friend"} onClick={() => reset("friend")}>Friend starts</ViewTab>
            <ViewTab active={view === "maya"} onClick={() => reset("maya")}>Maya approves</ViewTab>
            <ViewTab active={view === "guest"} onClick={() => reset("guest")}>Guests give</ViewTab>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <span className="size-2 rounded-full bg-highlight" /> Sample UX
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-border sm:hidden">
          <MobileViewTab active={view === "friend"} onClick={() => reset("friend")}>Friend</MobileViewTab>
          <MobileViewTab active={view === "maya"} onClick={() => reset("maya")}>Maya</MobileViewTab>
          <MobileViewTab active={view === "guest"} onClick={() => reset("guest")}>Guest</MobileViewTab>
        </div>
      </header>

      {view === "friend" && <FriendFlow step={friendStep} setStep={setFriendStep} guests={guests} setGuests={setGuests} />}
      {view === "maya" && <MayaFlow step={mayaStep} setStep={setMayaStep} kept={kept} setKept={setKept} />}
      {view === "guest" && <GuestFlow step={guestStep} setStep={setGuestStep} selectedGift={selectedGift} setSelectedGift={setSelectedGift} items={approvedItems} claimedIds={claimedIds} setClaimedIds={setClaimedIds} giftedIds={giftedIds} />}
    </main>
  );
}

function ViewTab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className={cn("rounded-xs px-4 py-2 text-xs font-semibold transition", active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>{children}</button>;
}

function MobileViewTab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className={cn("border-r border-border py-3 text-[11px] font-bold uppercase last:border-r-0", active ? "bg-foreground text-background" : "text-muted-foreground")}>{children}</button>;
}

function FriendFlow({ step, setStep, guests, setGuests }: { step: FriendStep; setStep: (step: FriendStep) => void; guests: string[]; setGuests: (guests: string[]) => void }) {
  if (step === "chapter") return <ChapterStep onContinue={() => setStep("edit")} />;
  if (step === "edit") return <EditStep onBack={() => setStep("chapter")} onContinue={() => setStep("circle")} />;
  if (step === "circle") return <CircleStep guests={guests} setGuests={setGuests} onBack={() => setStep("edit")} onContinue={() => setStep("sent")} />;
  return <SentStep onGuest={() => setStep("chapter")} />;
}

function ChapterStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-16">
      <StepHeader number="01" eyebrow="Start a chapter" title={<>What is Maya<br /><em>stepping into?</em></>} copy="You start it. Maya approves it privately. Then it comes from you — never her." />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <button onClick={onContinue} className="group relative min-h-64 overflow-hidden rounded-sm border-2 border-foreground bg-highlight p-6 text-left shadow-editorial transition-transform hover:-translate-y-1 md:col-span-2">
          <div className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-foreground text-background"><Check className="size-5" /></div>
          <span className="text-xs font-bold uppercase">Home · Selected</span>
          <h2 className="mt-16 font-display text-5xl md:text-7xl">First Place</h2>
          <p className="mt-4 max-w-lg text-base">The first home that is entirely hers. No wedding, no shower, no reason not to celebrate it.</p>
          <div className="mt-8 flex items-center gap-2 text-sm font-bold">Choose this chapter <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></div>
        </button>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          {["Moving in", "Starting over"].map((chapter) => <button key={chapter} className="rounded-sm border border-border bg-card p-5 text-left transition hover:border-foreground"><span className="text-xs font-bold uppercase text-muted-foreground">Home</span><h3 className="mt-8 font-display text-2xl">{chapter}</h3></button>)}
        </div>
      </div>
      <div className="mt-8 flex justify-end"><Button size="lg" onClick={onContinue}>Continue <ArrowRight className="size-4" /></Button></div>
    </div>
  );
}

function EditStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-14">
      <FlowTop onBack={onBack} label="First Place · 2 of 3" />
      <div className="mt-9 flex flex-col justify-between gap-5 border-b border-foreground pb-8 md:flex-row md:items-end">
        <div><p className="eyebrow">Eight things · Four price bands</p><h1 className="mt-3 font-display text-5xl md:text-7xl">The edit for Maya.</h1></div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">Curated for her first place. Each one has a reason, so nobody has to guess why it belongs.</p>
      </div>
      <BandSummary />
      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <ProductCard key={item.id} item={item} mode="edit" />)}</div>
      <div className="sticky bottom-4 mt-12 flex items-center justify-between rounded-sm border border-foreground bg-foreground p-3 pl-5 text-background shadow-editorial">
        <div><p className="text-sm font-bold">8 of 8 selected</p><p className="hidden text-xs text-background/65 sm:block">The mix is balanced across all four price bands.</p></div>
        <Button variant="lime" size="lg" onClick={onContinue}>Add her people <ArrowRight className="size-4" /></Button>
      </div>
    </div>
  );
}

function BandSummary() {
  const summaries = [["3", "Easy yes", "$25–50"], ["3", "Considered", "$60–120"], ["1", "Practical", "$40–150"], ["1", "Group", "$200–400"]];
  return <div className="mt-5 grid grid-cols-2 border border-border md:grid-cols-4">{summaries.map(([count, label, range]) => <div key={label} className="flex items-center gap-3 border-b border-r border-border p-4 last:border-r-0 md:border-b-0"><span className="font-display text-3xl">{count}</span><div><p className="text-xs font-bold uppercase">{label}</p><p className="text-xs text-muted-foreground">{range}</p></div></div>)}</div>;
}

function CircleStep({ guests, setGuests, onBack, onContinue }: { guests: string[]; setGuests: (guests: string[]) => void; onBack: () => void; onContinue: () => void }) {
  const [name, setName] = useState("");
  const addGuest = () => { if (name.trim()) { setGuests([...guests, name.trim()]); setName(""); } };
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
      <FlowTop onBack={onBack} label="First Place · 3 of 3" />
      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.15fr]">
        <div><p className="eyebrow">Guest circle</p><h1 className="mt-4 font-display text-5xl md:text-7xl">Who should<br /><em>hear from you?</em></h1><p className="mt-6 max-w-sm leading-7 text-muted-foreground">Start with the people who already said “let me know.” Maya can add names privately before anything goes out.</p><div className="mt-8 inline-flex items-center gap-3 bg-highlight px-4 py-3 text-sm font-semibold"><EyeOff className="size-4" /> Names and emails stay private.</div></div>
        <div className="border-t-2 border-foreground pt-5">
          <label htmlFor="guest-name" className="text-xs font-bold uppercase">Add a person</label>
          <div className="mt-2 flex gap-2"><input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addGuest(); }} placeholder="Name" className="h-12 min-w-0 flex-1 border border-input bg-background px-4 outline-none focus:border-foreground" /><Button size="icon" onClick={addGuest} aria-label="Add guest"><Plus className="size-4" /></Button></div>
          <div className="mt-8 divide-y divide-border border-y border-border">{guests.map((guest, index) => <div key={`${guest}-${index}`} className="flex items-center justify-between py-4"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold">{guest.split(" ").map((part) => part[0]).join("")}</span><div><p className="text-sm font-semibold">{guest}</p><p className="text-xs text-muted-foreground">Email added</p></div></div><button onClick={() => setGuests(guests.filter((_, i) => i !== index))} aria-label={`Remove ${guest}`} className="p-2 text-muted-foreground hover:text-foreground"><X className="size-4" /></button></div>)}</div>
          <div className="mt-8 flex items-center justify-between"><p className="text-sm text-muted-foreground"><strong className="text-foreground">{guests.length}</strong> people in Maya’s circle</p><Button size="lg" onClick={onContinue}>Send to Maya <Mail className="size-4" /></Button></div>
        </div>
      </div>
    </div>
  );
}

function SentStep({ onGuest }: { onGuest: () => void }) {
  return <CenteredSuccess icon={<Mail className="size-8" />} eyebrow="Sent privately" title="Maya has the first say." copy="She’ll keep or cut anything, add delivery details, and approve. You’ll never see what changed." action="Back to start" onAction={onGuest} />;
}

function MayaFlow({ step, setStep, kept, setKept }: { step: MayaStep; setStep: (step: MayaStep) => void; kept: Set<number>; setKept: (value: Set<number>) => void }) {
  if (step === "approved") return <CenteredSuccess icon={<Check className="size-8" />} eyebrow="Approved" title="That’s it. Leah takes it from here." copy="Your address stays private. Leah will send the chapter, and you won’t need to ask anyone for a thing." action="Review again" onAction={() => setStep("review")} />;
  if (step === "delivery") return <DeliveryStep onBack={() => setStep("review")} onApprove={() => setStep("approved")} count={kept.size} />;
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-14">
      <div className="flex items-center justify-between"><p className="eyebrow">Private for Maya</p><span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><LockKeyhole className="size-4" /> Leah won’t see your edits</span></div>
      <div className="mt-9 grid gap-8 border-b border-foreground pb-9 md:grid-cols-[1fr_400px] md:items-end"><h1 className="font-display text-5xl md:text-7xl">Leah picked these<br /><em>with you in mind.</em></h1><div><p className="leading-7 text-muted-foreground">Keep what feels right. Cut anything that doesn’t. No explanation, no awkwardness, no one notified.</p><div className="mt-4 h-1 bg-secondary"><div className="h-full bg-highlight" style={{ width: `${(kept.size / items.length) * 100}%` }} /></div><p className="mt-2 text-xs font-bold uppercase">{kept.size} of {items.length} kept</p></div></div>
      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <ProductCard key={item.id} item={item} mode="review" active={kept.has(item.id)} onToggle={() => { const next = new Set(kept); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); setKept(next); }} />)}</div>
      <div className="sticky bottom-4 mt-12 flex items-center justify-between rounded-sm border border-foreground bg-foreground p-3 pl-5 text-background shadow-editorial"><p className="text-sm font-bold">Looks right? One step left.</p><Button variant="lime" size="lg" onClick={() => setStep("delivery")} disabled={kept.size === 0}>Delivery details <ArrowRight className="size-4" /></Button></div>
    </div>
  );
}

function DeliveryStep({ onBack, onApprove, count }: { onBack: () => void; onApprove: () => void; count: number }) {
  return <div className="mx-auto max-w-4xl px-5 py-10 md:px-10 md:py-14"><FlowTop onBack={onBack} label="Private approval · 2 of 2" /><div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.05fr]"><div><p className="eyebrow">Delivery</p><h1 className="mt-4 font-display text-5xl md:text-6xl">Where should<br /><em>the good things land?</em></h1><div className="mt-8 flex gap-3 border-t border-border pt-5"><LockKeyhole className="mt-1 size-4 shrink-0" /><p className="text-sm leading-6 text-muted-foreground">Only Good Chapter and the fulfilling brand receive your address. Guests and Leah never see it.</p></div></div><form onSubmit={(e) => { e.preventDefault(); onApprove(); }} className="grid gap-4 border-t-2 border-foreground pt-5"><Field label="Full name" value="Maya Ellison" /><Field label="Street address" value="48 Willow Street" /><div className="grid grid-cols-2 gap-4"><Field label="City" value="Brooklyn" /><Field label="ZIP" value="11231" /></div><div className="mt-4 border border-border bg-secondary p-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold">{count} things approved</span><CheckCircle2 className="size-5 text-success" /></div></div><Button type="submit" variant="lime" size="lg" className="mt-2 w-full">Approve this chapter <Check className="size-4" /></Button><p className="text-center text-xs text-muted-foreground">That’s click two. Nothing is sent from you.</p></form></div></div>;
}

function GuestFlow({ step, setStep, selectedGift, setSelectedGift, items: visibleItems, claimedIds, setClaimedIds, giftedIds }: { step: GuestStep; setStep: (step: GuestStep) => void; selectedGift: number | null; setSelectedGift: (id: number | null) => void; items: Item[]; claimedIds: Set<number>; setClaimedIds: (ids: Set<number>) => void; giftedIds: Set<number> }) {
  const [browseState, setBrowseState] = useState<BrowseState>("ready");
  const [filter, setFilter] = useState("All ideas");
  const gift = visibleItems.find((item) => item.id === selectedGift);
  const statuses = (id: number): GiftStatus => giftedIds.has(id) ? "Gifted" : claimedIds.has(id) ? "Claimed" : "Available";
  const claimGift = () => {
    if (!gift) return;
    setClaimedIds(new Set([...claimedIds, gift.id]));
    setStep("confirmed");
  };

  if (step === "landing") return <GuestLanding claimed={claimedIds.size + giftedIds.size} onBrowse={() => setStep("browse")} onOffList={() => setStep("offlist")} />;
  if (step === "claim" && gift) return <ClaimStep gift={gift} onBack={() => setStep("browse")} onClaim={claimGift} />;
  if (step === "offlist") return <OffListStep onBack={() => setStep("landing")} onSubmit={() => setStep("confirmed")} />;
  if (step === "confirmed") return <ClaimConfirmed gift={gift} onBrowse={() => { setSelectedGift(null); setStep("browse"); }} onGifted={() => setStep("gifted")} />;
  if (step === "gifted") return <GiftedState onBrowse={() => setStep("browse")} />;

  const filtered = visibleItems.filter((item) => {
    if (filter === "Under $50") return item.price < 50;
    if (filter === "Kitchen") return [2, 5, 7, 8].includes(item.id);
    if (filter === "Getting settled") return [1, 3, 4, 6].includes(item.id);
    return true;
  });

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6 md:px-10 md:py-12">
      <GuestTop onBack={() => setStep("landing")} label="Sam’s First Place" />
      <div className="mt-8 border-b-2 border-foreground pb-7 md:flex md:items-end md:justify-between">
        <div><p className="eyebrow">Approved by Sam · Shared by Jules</p><h1 className="mt-3 max-w-3xl font-display text-5xl leading-[.95] md:text-7xl">A few useful things<br className="hidden sm:block" /> for the new place.</h1></div>
        <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground md:mt-0">Claiming simply keeps the group from doubling up. Purchase wherever you like.</p>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Gift filters">
        {["All ideas", "Under $50", "Kitchen", "Getting settled"].map((name) => <Button key={name} variant={filter === name ? "ink" : "outline"} size="sm" onClick={() => { setFilter(name); setBrowseState("ready"); }}>{name}</Button>)}
      </div>
      <div className="mt-4 flex items-center justify-between border-y border-border py-3 text-xs font-mono uppercase"><span>{visibleItems.length} ideas · {claimedIds.size + giftedIds.size} already claimed</span><button className="text-muted-foreground underline underline-offset-4" onClick={() => setBrowseState(browseState === "ready" ? "loading" : browseState === "loading" ? "empty" : browseState === "empty" ? "error" : "ready")}>Preview states</button></div>
      {browseState === "loading" && <GuestSystemState icon={<LoaderCircle className="size-6 animate-spin" />} title="Gathering Sam’s list" copy="One quiet moment while the latest claims are checked." />}
      {browseState === "empty" && <GuestSystemState title="Nothing matches that filter" copy="Try all ideas, or bring something only you would think of." action="Show all ideas" onAction={() => { setFilter("All ideas"); setBrowseState("ready"); }} />}
      {browseState === "error" && <GuestSystemState icon={<CircleAlert className="size-6" />} title="The list didn’t load" copy="No claim was changed. Try again when you’re ready." action="Try again" onAction={() => setBrowseState("ready")} />}
      {browseState === "ready" && filtered.length > 0 && <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((item) => <ClaimCard key={item.id} item={item} status={statuses(item.id)} onClaim={() => { setSelectedGift(item.id); setStep("claim"); }} />)}</div>}
      <div className="mt-12 border-t-2 border-foreground py-7 text-center"><p className="font-display text-2xl">Have another idea?</p><button onClick={() => setStep("offlist")} className="mt-2 text-sm font-semibold underline underline-offset-4">Bring something off-list</button></div>
    </div>
  );
}

function GuestLanding({ claimed, onBrowse, onOffList }: { claimed: number; onBrowse: () => void; onOffList: () => void }) {
  return <div className="mx-auto max-w-[1240px] px-4 py-7 sm:px-6 md:px-10 md:py-14">
    <div className="flex items-center justify-between border-b-2 border-foreground pb-4"><span className="font-mono text-[10px] uppercase">Private Chapter · First Place</span><span className="flex items-center gap-2 font-mono text-[10px] uppercase"><LockKeyhole className="size-3" /> Small circle</span></div>
    <section className="grid gap-10 py-10 md:grid-cols-[1.35fr_.65fr] md:py-16">
      <div><p className="eyebrow">From Jules · Approved by Sam</p><h1 className="mt-5 max-w-4xl font-display text-6xl leading-[.92] sm:text-7xl md:text-8xl">Sam has a new front door. <em>Let’s help make it feel like home.</em></h1><p className="mt-7 max-w-2xl text-base leading-7 md:text-lg">Jules put together a small, private Good Chapter for Sam’s first home. Sam approved every part of it. Choose something useful, bring something personal, or simply send your love.</p></div>
      <aside className="self-end border-t-2 border-foreground pt-5"><p className="font-mono text-[10px] uppercase">A note from Jules</p><blockquote className="mt-4 font-display text-3xl leading-tight">“Sam made this happen on her own. I’d love for the first few weeks to feel held by all of us.”</blockquote><p className="mt-5 text-sm font-semibold">Shared with a small circle of people who care about Sam.</p></aside>
    </section>
    <section className="border-2 border-foreground md:grid md:grid-cols-[.7fr_1.3fr]">
      <div className="bg-emphasis p-5 text-emphasis-foreground md:p-7"><p className="font-mono text-[10px] uppercase">Chapter status</p><p className="mt-3 font-display text-3xl">8 ideas · {claimed} already claimed</p></div>
      <div className="p-5 md:p-7"><p className="text-sm leading-6">Claiming an idea helps the group avoid duplicates. You can purchase it anywhere you like. Good Chapter coordinates the choice—not the money or order.</p><div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><Button size="lg" onClick={onBrowse}>See what Sam needs <ArrowRight className="size-4" /></Button><button onClick={onOffList} className="text-sm font-semibold underline underline-offset-4">I’d rather bring something off-list</button></div></div>
    </section>
  </div>;
}

function ClaimCard({ item, status, onClaim }: { item: Item; status: GiftStatus; onClaim: () => void }) {
  const unavailable = status !== "Available";
  return <article className={cn("border-2 border-foreground bg-card", unavailable && "bg-secondary")}><div className="relative"><img src={item.image} alt="" width={816} height={816} className={cn("aspect-[4/3] w-full object-cover", unavailable && "grayscale opacity-60")} /><span className={cn("absolute left-3 top-3 border border-foreground px-2 py-1 font-mono text-[10px] uppercase", status === "Available" ? "bg-background" : status === "Gifted" ? "bg-emphasis text-emphasis-foreground" : "bg-foreground text-background")}>{status}</span></div><div className="border-t-2 border-foreground p-4"><h2 className="font-display text-3xl leading-none">{item.name}</h2><p className="mt-3 min-h-10 text-sm leading-5">{item.reason}</p><p className="mt-4 font-mono text-[10px] uppercase text-muted-foreground">Usually around {bandLabels[item.band]}</p>{unavailable ? <div className="mt-4 flex h-11 items-center gap-2 border-t border-border pt-3 text-sm font-semibold"><Check className="size-4" /> {status === "Claimed" ? "Someone has this covered" : "Already given"}</div> : <Button className="mt-4 w-full" onClick={onClaim}>Claim this <ArrowRight className="size-4" /></Button>}</div></article>;
}

function ClaimStep({ gift, onBack, onClaim }: { gift: Item; onBack: () => void; onClaim: () => void }) {
  const [method, setMethod] = useState("housewarming");
  return <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 md:px-10 md:py-12"><GuestTop onBack={onBack} label="Private gift claim" /><div className="mt-8 grid gap-8 md:grid-cols-[.72fr_1.28fr]"><div><img src={gift.image} alt="" className="aspect-[4/3] w-full border-2 border-foreground object-cover" /><p className="mt-4 font-mono text-[10px] uppercase">Usually around {bandLabels[gift.band]}</p><h1 className="mt-2 font-display text-4xl">{gift.name}</h1><p className="mt-3 text-sm leading-6">{gift.reason}</p></div><form onSubmit={(event) => { event.preventDefault(); onClaim(); }} className="border-t-2 border-foreground pt-6"><p className="eyebrow">You’ve got it.</p><h2 className="mt-3 font-display text-5xl">Make the claim.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Claiming lets everyone else know Sam is covered. Buy it wherever works for you, then bring it by or send it when you’re ready.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><InputField label="Your name" placeholder="Your name" required /><InputField label="Email or phone" placeholder="For claim coordination" required /></div><label className="mt-4 block font-mono text-[10px] uppercase">Any delivery details or questions?<textarea className="mt-2 h-24 w-full resize-none border-2 border-input bg-background p-3 font-sans text-sm normal-case outline-none focus:border-foreground" /></label><fieldset className="mt-5"><legend className="font-mono text-[10px] uppercase">How will it get there?</legend><div className="mt-2 divide-y divide-border border-y border-border">{[["housewarming", "I’ll bring it to the housewarming"], ["ship", "I’ll ship it directly"], ["starter", "I’m coordinating with Jules"]].map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-3 py-3 text-sm"><input type="radio" name="method" value={value} checked={method === value} onChange={() => setMethod(value)} className="accent-primary" />{label}</label>)}</div></fieldset><Button type="submit" size="lg" className="mt-6 w-full">Claim {gift.name}</Button><p className="mt-3 text-center text-xs leading-5 text-muted-foreground">This is not a purchase through Good Chapter. We’ll only use your details to coordinate this gift.</p></form></div></div>;
}

function OffListStep({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 md:px-10 md:py-12"><GuestTop onBack={onBack} label="Your own idea" /><div className="mt-10 grid gap-10 md:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">Equally welcome</p><h1 className="mt-4 font-display text-6xl leading-[.95]">Bringing your own idea? <em>Perfect.</em></h1><p className="mt-6 leading-7 text-muted-foreground">Useful gifts are only one way to show up. You might bring a meal, a plant, moving-day help, a favorite local spot, or something only you would think of.</p><div className="mt-8 bg-emphasis p-5 text-emphasis-foreground"><p className="font-mono text-[10px] uppercase">No amount needed</p><p className="mt-2 font-display text-2xl">The group will simply see “Off-list gift” as claimed.</p></div></div><form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} className="border-t-2 border-foreground pt-6"><InputField label="What are you thinking of bringing?" placeholder="A meal for moving night" required /><div className="mt-4"><InputField label="Your name" placeholder="Your name" required /></div><label className="mt-4 block font-mono text-[10px] uppercase">Optional note for Jules<textarea className="mt-2 h-28 w-full resize-none border-2 border-input bg-background p-3 font-sans text-sm normal-case outline-none focus:border-foreground" /></label><Button type="submit" size="lg" className="mt-6 w-full">Let the group know</Button><p className="mt-3 text-center text-xs text-muted-foreground">Only Jules uses these details to coordinate. Sam won’t be asked to respond.</p></form></div></div>;
}

function ClaimConfirmed({ gift, onBrowse, onGifted }: { gift?: Item; onBrowse: () => void; onGifted: () => void }) {
  return <div className="mx-auto flex min-h-[calc(100vh-112px)] max-w-3xl items-center px-4 py-12 sm:px-6"><div className="w-full border-t-2 border-foreground pt-7"><PackageCheck className="size-10" /><p className="eyebrow mt-7">Claim recorded</p><h1 className="mt-3 font-display text-6xl">You’ve got it.</h1><p className="mt-5 max-w-xl text-base leading-7">{gift ? `${gift.name} is now marked Claimed. ` : "Your off-list gift is now noted. "}There’s no purchase here and nothing else you need to report.</p><div className="mt-8 border-y border-border py-5"><button className="flex items-center gap-3 text-sm font-semibold"><MapPin className="size-4" /> Want the delivery address?</button><button className="mt-4 flex items-center gap-3 text-sm font-semibold"><MessageCircle className="size-4" /> Message Jules</button></div><div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><Button size="lg" onClick={onBrowse}>Back to Sam’s Chapter</Button>{gift && <button onClick={onGifted} className="text-sm font-semibold underline underline-offset-4">Preview gifted state</button>}</div></div></div>;
}

function GiftedState({ onBrowse }: { onBrowse: () => void }) {
  return <div className="mx-auto flex min-h-[calc(100vh-112px)] max-w-3xl items-center px-4 py-12 sm:px-6"><div className="w-full border-t-2 border-foreground pt-7"><Heart className="size-10" /><p className="eyebrow mt-7">A good thing, given</p><h1 className="mt-3 font-display text-6xl leading-[.95]">Thank you for helping make this new place feel more like Sam’s.</h1><p className="mt-6 max-w-xl text-lg leading-7">Good Chapter is here to make showing up easier—not to make anyone ask.</p><div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"><Button size="lg">Send Sam a note <MessageCircle className="size-4" /></Button><button onClick={onBrowse} className="text-sm font-semibold underline underline-offset-4">Return to the Chapter</button></div></div></div>;
}

function GuestSystemState({ icon, title, copy, action, onAction }: { icon?: React.ReactNode; title: string; copy: string; action?: string; onAction?: () => void }) {
  return <div className="my-12 border-2 border-foreground p-8 text-center"><div className="mx-auto flex size-10 items-center justify-center">{icon}</div><h2 className="mt-3 font-display text-3xl">{title}</h2><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{copy}</p>{action && onAction && <Button className="mt-5" onClick={onAction}>{action} <RotateCcw className="size-4" /></Button>}</div>;
}

function GuestTop({ onBack, label }: { onBack: () => void; label: string }) {
  return <div className="flex items-center justify-between border-b border-border pb-4"><Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="size-4" /> Back</Button><span className="font-mono text-[10px] uppercase">{label}</span></div>;
}

function InputField({ label, placeholder, required = false }: { label: string; placeholder: string; required?: boolean }) {
  return <label className="block font-mono text-[10px] uppercase">{label}<input required={required} placeholder={placeholder} className="mt-2 h-12 w-full border-2 border-input bg-background px-3 font-sans text-sm normal-case outline-none focus:border-foreground" /></label>;
}

function StepHeader({ number, eyebrow, title, copy }: { number: string; eyebrow: string; title: React.ReactNode; copy: string }) {
  return <div className="grid gap-7 border-b border-foreground pb-10 md:grid-cols-[100px_1fr_360px] md:items-end"><span className="font-display text-5xl text-muted-foreground">{number}</span><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-4 font-display text-5xl md:text-7xl">{title}</h1></div><p className="max-w-sm leading-7 text-muted-foreground">{copy}</p></div>;
}

function FlowTop({ onBack, label }: { onBack: () => void; label: string }) {
  return <div className="flex items-center justify-between"><button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase"><ArrowLeft className="size-4" /> Back</button><span className="text-xs font-bold uppercase text-muted-foreground">{label}</span></div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <label className="block text-xs font-bold uppercase">{label}<input defaultValue={value} className="mt-2 h-12 w-full border border-input bg-background px-4 text-sm font-normal normal-case outline-none focus:border-foreground" /></label>;
}

function CenteredSuccess({ icon, eyebrow, title, copy, action, onAction }: { icon: React.ReactNode; eyebrow: string; title: string; copy: string; action: string; onAction: () => void }) {
  return <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-16"><div className="max-w-2xl text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-highlight">{icon}</div><p className="eyebrow mt-8">{eyebrow}</p><h1 className="mt-4 font-display text-5xl md:text-7xl">{title}</h1><p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-muted-foreground">{copy}</p><Button variant="outline" size="lg" className="mt-10" onClick={onAction}>{action} <Sparkles className="size-4" /></Button></div></div>;
}
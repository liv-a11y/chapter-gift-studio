import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  EyeOff,
  Gift,
  Heart,
  LockKeyhole,
  Mail,
  Minus,
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
type GuestStep = "browse" | "checkout" | "thanks";
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
  const [guestStep, setGuestStep] = useState<GuestStep>("browse");
  const [kept, setKept] = useState(() => new Set(items.map((item) => item.id)));
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [guests, setGuests] = useState(["Leah Park", "Nina Shah", "Sam Rivera", "Jordan Lee"]);

  const approvedItems = useMemo(() => items.filter((item) => kept.has(item.id)), [kept]);

  function reset(next: View) {
    setView(next);
    setFriendStep("chapter");
    setMayaStep("review");
    setGuestStep("browse");
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
      {view === "guest" && <GuestFlow step={guestStep} setStep={setGuestStep} selectedGift={selectedGift} setSelectedGift={setSelectedGift} items={approvedItems} />}
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

function GuestFlow({ step, setStep, selectedGift, setSelectedGift, items: visibleItems }: { step: GuestStep; setStep: (step: GuestStep) => void; selectedGift: number | null; setSelectedGift: (id: number | null) => void; items: Item[] }) {
  const gift = visibleItems.find((item) => item.id === selectedGift) ?? visibleItems[0];
  if (step === "thanks") return <CenteredSuccess icon={<Heart className="size-8" />} eyebrow="Gift sent" title="You showed up." copy="Leah will let Maya know her people are thinking of her. We’ll handle everything else." action="Choose another gift" onAction={() => { setSelectedGift(null); setStep("browse"); }} />;
  if (step === "checkout" && gift) return <CheckoutStep gift={gift} onBack={() => setStep("browse")} onSend={() => setStep("thanks")} />;
  return (
    <div>
      <section className="border-b border-foreground bg-highlight">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-12 md:grid-cols-[1.2fr_.8fr] md:px-10 md:py-16">
          <div><p className="eyebrow">A First Place chapter · From Leah</p><h1 className="mt-5 max-w-4xl font-display text-6xl md:text-8xl">Maya bought<br /><em>her first place.</em></h1><p className="mt-7 max-w-xl text-lg leading-8">No shower. No registry. Just a home worth marking — and eight things she quietly approved.</p></div>
          <div className="flex items-end"><div className="w-full border-t border-foreground pt-5"><p className="text-xs font-bold uppercase">A note from Leah</p><blockquote className="mt-4 font-display text-2xl leading-snug">“She did this one on her own. Let’s make sure settling in doesn’t feel that way.”</blockquote><p className="mt-4 text-sm font-semibold">— Leah, Nina, Sam & her circle</p></div></div>
        </div>
      </section>
      <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-10 md:py-14">
        <div className="flex flex-col justify-between gap-4 border-b border-foreground pb-6 md:flex-row md:items-end"><div><p className="eyebrow">Eight things · One reason each</p><h2 className="mt-2 font-display text-4xl md:text-5xl">Choose the one that feels like you.</h2></div><div className="flex items-center gap-2 text-sm font-semibold"><Clock3 className="size-4" /> About 5 minutes</div></div>
        <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{visibleItems.map((item) => <ProductCard key={item.id} item={item} mode="guest" onChoose={() => { setSelectedGift(item.id); setStep("checkout"); }} />)}</div>
        <div className="mt-16 border-t border-border py-8 text-center text-sm text-muted-foreground">Sent by Leah. Maya didn’t make or send this page.</div>
      </div>
    </div>
  );
}

function CheckoutStep({ gift, onBack, onSend }: { gift: Item; onBack: () => void; onSend: () => void }) {
  const [amount, setAmount] = useState(gift.band === "Group candidate" ? 75 : gift.price);
  return <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14"><FlowTop onBack={onBack} label="Your gift · 2 of 2" /><div className="mt-10 grid gap-10 md:grid-cols-[.8fr_1.2fr]"><div><img src={gift.image} alt={gift.name} width={816} height={816} className="aspect-square w-full object-cover" /><p className="mt-4 text-xs font-bold uppercase">{gift.brand}</p><h1 className="mt-1 font-display text-3xl">{gift.name}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">“{gift.reason}”</p></div><form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="border-t-2 border-foreground pt-5"><p className="eyebrow">For Maya, from you</p><h2 className="mt-4 font-display text-4xl md:text-5xl">One last thing.</h2>{gift.band === "Group candidate" ? <div className="mt-8"><label className="text-xs font-bold uppercase">Your contribution</label><div className="mt-2 flex items-center border border-input"><button type="button" onClick={() => setAmount(Math.max(25, amount - 25))} className="p-4" aria-label="Decrease contribution"><Minus className="size-4" /></button><div className="flex-1 text-center font-display text-3xl">${amount}</div><button type="button" onClick={() => setAmount(Math.min(gift.price, amount + 25))} className="p-4" aria-label="Increase contribution"><Plus className="size-4" /></button></div><p className="mt-2 text-xs text-muted-foreground">${gift.price - amount} left for the circle</p></div> : <div className="mt-8 flex items-end justify-between border-y border-border py-4"><span className="text-sm text-muted-foreground">Gift total</span><span className="font-display text-4xl">${gift.price}</span></div>}<label htmlFor="note" className="mt-7 block text-xs font-bold uppercase">A note for Maya</label><textarea id="note" defaultValue="So proud of you — may this place hold every good thing next." className="mt-2 h-28 w-full resize-none border border-input bg-background p-4 text-sm leading-6 outline-none focus:border-foreground" /><div className="mt-6 grid grid-cols-2 gap-3"><Field label="Your name" value="Alex Morgan" /><Field label="Email" value="alex@example.com" /></div><Button type="submit" size="lg" className="mt-6 w-full">Send this gift <Gift className="size-4" /></Button><p className="mt-3 text-center text-xs text-muted-foreground">Secure checkout · Delivery is handled for you</p></form></div></div>;
}

function ProductCard({ item, mode, active = true, onToggle, onChoose }: { item: Item; mode: "edit" | "review" | "guest"; active?: boolean; onToggle?: () => void; onChoose?: () => void }) {
  return <article className={cn("group", !active && "opacity-45")}><div className="relative overflow-hidden bg-secondary"><img src={item.image} alt={item.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]" /><span className="absolute left-3 top-3 bg-background px-2 py-1 text-[10px] font-bold uppercase">{item.band} · {bandLabels[item.band]}</span>{mode === "review" && <button onClick={onToggle} className={cn("absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border", active ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground")} aria-label={active ? `Cut ${item.name}` : `Keep ${item.name}`}>{active ? <Check className="size-4" /> : <Plus className="size-4" />}</button>}</div><div className="border-t border-foreground pt-3"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase text-muted-foreground">{item.brand}</p><h3 className="mt-1 font-display text-2xl">{item.name}</h3></div><span className="font-display text-2xl">${item.price}</span></div><p className="mt-3 min-h-10 text-sm leading-5 text-muted-foreground">{item.reason}</p>{mode === "edit" && <button className="mt-4 flex items-center gap-2 text-xs font-bold uppercase"><CheckCircle2 className="size-4 text-success" /> Selected</button>}{mode === "review" && <button onClick={onToggle} className="mt-4 flex items-center gap-2 text-xs font-bold uppercase">{active ? <><X className="size-4" /> Cut privately</> : <><Plus className="size-4" /> Put it back</>}</button>}{mode === "guest" && <Button variant="outline" className="mt-4 w-full" onClick={onChoose}>Choose this <ChevronRight className="size-4" /></Button>}</div></article>;
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
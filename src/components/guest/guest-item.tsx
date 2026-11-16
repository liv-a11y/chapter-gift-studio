import { useState } from "react";
import { ClaimForm } from "./claim-form";
import { sampleProducts } from "@/lib/sample-products";
import { shopifyVariants, createGiftCheckout } from "@/lib/shopify";

export type GuestItemData = { id: string; name: string; photo_url: string; price: number | null; source: string; source_url: string; why: string; claim: { display_name: string; mine: boolean } | null };

/** One of the eight the person approved, with a guest's way to take it. */
export function GuestItem({ item, index, open, onClaim }: { item: GuestItemData; index: number; open: boolean; onClaim: (id: string, name: string) => Promise<{ ok: boolean }> }) {
  const [claim, setClaim] = useState(item.claim);
  const [asking, setAsking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(false);
  const variant = shopifyVariants[sampleProducts.find((p) => p.name === item.name)?.id ?? ""];

  const take = async (displayName: string) => {
    setSaving(true); setError("");
    try {
      const r = await onClaim(item.id, displayName);
      if (!r?.ok) { setError("That one has just been taken. Open a fresh one."); return; }
      setClaim({ display_name: displayName, mine: true }); setAsking(false);
    } catch { setError("That did not save. Open your link again and try once more."); }
    finally { setSaving(false); }
  };
  const buy = async () => {
    if (!variant) return;
    setBuying(true); setError("");
    // Open the tab inside the click so popup blockers let it through, then send it to checkout.
    const tab = window.open("", "_blank");
    try {
      const url = await createGiftCheckout(variant, 1, item.name, undefined, claim?.display_name || "Someone who cares");
      if (tab) { tab.location.href = url; }
      else { window.location.href = url; }
    } catch {
      tab?.close();
      setError("Checkout did not open. Try once more.");
    } finally { setBuying(false); }
  };
  const mine = claim?.mine;

  return (
    <article className="flex flex-col overflow-hidden rounded border-2 border-foreground bg-card">
      {item.photo_url ? <img src={item.photo_url} alt={item.name} loading="lazy" className="h-48 w-full border-b-2 border-foreground object-cover" /> : null}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[13px] font-medium text-foreground/50">{String(index + 1).padStart(2, "0")}</p>
        <h2 className="mt-2 font-display text-[26px] leading-[1.05]">{item.name}</h2>
        <p className="mt-2 text-[18px] leading-[1.4] text-foreground/85">{item.why}</p>
        <div className="mt-3 flex items-baseline justify-between gap-3 text-[14px]">
          <span className="truncate text-foreground/55">{item.source ? `Available from the ${item.source}` : ""}</span>
          <span className="shrink-0 font-medium">{item.price != null ? `$${item.price}` : ""}</span>
        </div>
        {item.source_url ? <a href={item.source_url} target="_blank" rel="noreferrer" className="mt-2 self-start text-[13px] font-medium underline underline-offset-4">Find it at {item.source || "the shop"}</a> : null}
        <div className="mt-auto pt-4">
          {claim ? (
            <div className="border-t border-foreground/25 pt-4">
              <p className={`text-[13px] font-medium ${mine ? "text-primary" : "text-foreground/50"}`}>{mine ? "Yours to give" : "Taken"}</p>
              <p className="mt-1 text-[18px] text-foreground/80">{mine ? `From ${claim.display_name || "Someone who cares"}` : claim.display_name || "Someone who cares"}</p>
              {mine && variant ? (
                <button type="button" onClick={buy} disabled={buying} className="mt-3 flex w-full items-center justify-between rounded border-2 border-primary bg-primary px-4 py-2.5 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary disabled:opacity-60">
                  <span>{buying ? "Opening" : "Buy it now"}</span><span aria-hidden="true">→</span>
                </button>
              ) : null}
              {error ? <p role="alert" className="mt-2 text-[15px] text-destructive">{error}</p> : null}
            </div>
          ) : !open ? (
            <p className="text-[13px] font-medium text-foreground/45">Not open</p>
          ) : asking ? (
            <ClaimForm saving={saving} error={error} onClaim={take} onCancel={() => setAsking(false)} />
          ) : (
            <button type="button" onClick={() => setAsking(true)} className="flex w-full items-center justify-between rounded border-2 border-primary bg-primary px-4 py-2.5 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary">
              <span>Take this one</span><span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { answerItem } from "@/lib/person-chapter.functions";

export type PersonItem = { id: string; name: string; photo_url: string; price: number | null; source: string; source_url: string; why: string; status: string };

const WORDS: Record<string, string> = { approved: "Approved. It stays.", declined: "Declined. It comes off the list." };

/** One of the eight, on the person's own link, with their approve or decline. */
export function ChapterItem({ token, item, index, open, awaiting }: { token: string; item: PersonItem; index: number; open: boolean; awaiting: boolean }) {
  const answer = useServerFn(answerItem);
  const [status, setStatus] = useState(item.status === "approved" || item.status === "declined" ? item.status : "");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const decide = async (value: "approved" | "declined") => {
    setBusy(value); setError("");
    try {
      const r = await answer({ data: { token, itemId: item.id, answer: value } });
      if (!r?.ok) { setError("That did not save. Open your link again and try once more."); return; }
      setStatus(r.status ?? value);
    } catch { setError("That did not save. Open your link again and try once more."); }
    finally { setBusy(""); }
  };
  const btn = (on: boolean) =>
    `flex-1 rounded border-2 border-foreground px-3 py-2 text-[14px] font-medium disabled:opacity-60 ${on ? "bg-highlight text-foreground" : "bg-card hover:bg-foreground hover:text-background"}`;

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
        <div className="mt-auto pt-4">
          {item.status === "given" ? (
            <p className="text-[13px] font-medium text-foreground/50">Already given.</p>
          ) : open ? (
            <>
              <div className="flex gap-2">
                <button type="button" className={btn(status === "approved")} aria-pressed={status === "approved"} disabled={!!busy} onClick={() => decide("approved")}>{busy === "approved" ? "Saving" : "Approve"}</button>
                <button type="button" className={btn(status === "declined")} aria-pressed={status === "declined"} disabled={!!busy} onClick={() => decide("declined")}>{busy === "declined" ? "Saving" : "Decline"}</button>
              </div>
              {error ? <p role="alert" className="mt-2 text-[15px] text-destructive">{error}</p> : status ? <p className="mt-2 text-[13px] font-medium text-foreground/55">{WORDS[status]}</p> : null}
            </>
          ) : (
            <p className="text-[13px] font-medium text-foreground/50">{status ? WORDS[status] : awaiting ? "Say yes and you can answer this." : "Answers are closed."}</p>
          )}
        </div>
      </div>
    </article>
  );
}

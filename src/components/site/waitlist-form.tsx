import { ArrowRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const chapters = ["First home", "Fresh start", "New city", "Career pivot", "Recovery", "Off-script"];
const inquiryTypes = ["Consumer", "Founding partner: Employer", "Founding partner: Real estate", "Founding partner: Brand", "Investor", "General inquiry"];
const schema = z.object({
  email: z.string().trim().email("That email doesn’t look quite right.").max(254),
  chapter: z.string().max(80).optional(),
  comments: z.string().trim().max(1000, "Keep it under 1,000 characters.").optional(),
});
type Status = "idle" | "loading" | "done" | "error";

export function WaitlistForm({ pilot = false }: { pilot?: boolean }) {
  const [email, setEmail] = useState("");
  const [chapter, setChapter] = useState<string | undefined>();
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (pilot && !chapter) {
      setError("Choose how you would like to join us.");
      setStatus("error");
      return;
    }
    const parsed = schema.safeParse({ email, chapter, comments: comments || undefined });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    const { error: databaseError } = await supabase
      .from("waitlist_signups")
      .insert({ email: parsed.data.email.toLowerCase(), chapter: parsed.data.chapter ?? null, comments: parsed.data.comments || null });
    if (databaseError && databaseError.code !== "23505") {
      setError("Something went sideways. Try again in a moment.");
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="w-full border-2 border-foreground bg-card" role="status">
        <div className="border-b-2 border-foreground bg-foreground px-5 py-3 text-background">
          <span className="eyebrow flex items-center gap-2"><Check className="size-4" /> You’re on the list</span>
        </div>
        <div className="p-6">
          <p className="font-display text-[30px] leading-[1.08] sm:text-[38px]">We’ll write when the next circle opens.</p>
          <p className="mt-4 text-[17px] leading-[1.5] text-muted-foreground">No pressure.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full border-2 border-foreground bg-card">
      <div className="border-b-2 border-foreground bg-foreground px-5 py-3 text-background">
        <span className="eyebrow">{pilot ? "Request an invitation" : "Get on the list"}</span>
      </div>
      <div className="p-5 sm:p-6">
        {pilot ? <div>
          <label htmlFor="waitlist-interest" className="eyebrow block text-emphasis">I'm here as</label>
          <select id="waitlist-interest" required value={chapter ?? ""} disabled={status === "loading"} onChange={(event) => { setChapter(event.target.value || undefined); setStatus("idle"); }} className="mt-3 h-14 w-full rounded-[4px] border-2 border-foreground bg-background px-4 font-sans text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-describedby={status === "error" ? "waitlist-email-error" : undefined}>
            <option value="" disabled>Choose your way in</option>
            {inquiryTypes.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
          </select>
        </div> : <fieldset>
          <legend className="eyebrow text-muted-foreground">Which chapter? Optional.</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {chapters.map((choice) => {
              const active = chapter === choice;
              return (
                <Button
                  key={choice}
                  type="button"
                  variant={active ? "ink" : "outline"}
                  size="sm"
                  aria-pressed={active}
                  onClick={() => setChapter(active ? undefined : choice)}
                  className={active ? "bg-highlight text-highlight-foreground" : undefined}
                >
                  {choice}
                </Button>
              );
            })}
          </div>
        </fieldset>}
        {pilot && <div className="mt-6">
          <label htmlFor="waitlist-comments" className="eyebrow block text-muted-foreground">Comments. Optional.</label>
          <textarea id="waitlist-comments" rows={4} maxLength={1000} value={comments} disabled={status === "loading"} onChange={(event) => setComments(event.target.value)} placeholder="Tell us what brought you here." className="mt-3 w-full rounded-[4px] border-2 border-foreground bg-background px-4 py-3 font-sans text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          <p className="mt-2 text-[14px] text-muted-foreground">Please leave out names or details about anyone else.</p>
        </div>}
        <label htmlFor="waitlist-email" className="eyebrow mt-6 block text-muted-foreground">Your email</label>
        <div className={`mt-3 flex flex-col gap-3 ${pilot ? "" : "sm:flex-row"}`}>
          <input
            id="waitlist-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            disabled={status === "loading"}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="you@example.com"
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "waitlist-email-error" : undefined}
            className={`h-14 min-w-0 shrink-0 ${pilot ? "w-full" : "sm:flex-1"} rounded-sm border-2 border-foreground bg-background px-4 text-[18px] outline-none focus-visible:ring-2 focus-visible:ring-primary`}
          />
          <Button type="submit" size="lg" disabled={status === "loading"} className="h-14 px-7 text-[17px]">
            {status === "loading" ? "Adding you…" : <>{pilot ? "Count me in" : "Get on the list"} <ArrowRight className="size-5" /></>}
          </Button>
        </div>
        {status === "error" && <p id="waitlist-email-error" className="mt-3 text-[15px] text-emphasis">{error}</p>}
      </div>
    </form>
  );
}
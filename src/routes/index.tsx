import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import toasterAsset from "@/assets/toaster.png.asset.json";
import { BrandMark } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "Good Chapter — A registry for the rest of it";
const DESC = "A friend starts it. The person approves it. Nobody asks. Get on the list for the first Good Chapter circles.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeaserPage,
});

const chapters = ["First home", "Fresh start", "New city", "Career pivot", "Recovery", "Off-script"];

const schema = z.object({
  email: z.string().trim().email("That email doesn’t look quite right.").max(255),
  chapter: z.string().max(80).optional(),
});

type Status = "idle" | "loading" | "done" | "error";

function TeaserPage() {
  const [email, setEmail] = useState("");
  const [chapter, setChapter] = useState<string | undefined>();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, chapter });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    const { error: dbError } = await supabase
      .from("waitlist_signups")
      .insert({ email: parsed.data.email.toLowerCase(), chapter: parsed.data.chapter ?? null });
    // A duplicate email means they're already on the list — treat as success.
    if (dbError && dbError.code !== "23505") {
      setError("Something went sideways. Try again in a moment.");
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b-2 border-foreground">
        <div className="site-container flex min-h-20 items-center justify-between py-3">
          <span className="font-display text-2xl"><BrandMark /></span>
          <span className="eyebrow text-muted-foreground">Pilot · Opening soon</span>
        </div>
      </header>

      <main className="flex-1">
        <section className="site-container grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,.9fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-7">
            <p className="eyebrow text-emphasis">A registry for the rest of it</p>
            <h1 className="site-h1 max-w-[13ch]">
              A friend starts it. The person approves it.{" "}
              <span className="bg-emphasis px-2 text-emphasis-foreground">Nobody asks.</span>
            </h1>
            <p className="site-body max-w-[36rem] text-muted-foreground">
              We’re opening the pilot in small circles for first homes, fresh starts, and every milestone weddings never covered. Get on the list and we’ll invite you when the next one opens.
            </p>

            {status === "done" ? (
              <div className="w-full max-w-[34rem] rounded-sm border-2 border-foreground bg-card p-6" role="status">
                <span className="eyebrow flex items-center gap-2 text-primary"><Check className="size-4" /> You’re on the list</span>
                <p className="mt-3 font-display text-[26px] leading-[1.15]">We’ll write when the next circle opens.</p>
                <p className="mt-3 text-[15px] leading-[1.5] text-muted-foreground">One email, no spam, no pressure. That’s the whole deal.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="w-full max-w-[34rem] rounded-sm border-2 border-foreground bg-card p-5 sm:p-6">
                <fieldset>
                  <legend className="eyebrow text-muted-foreground">Whose chapter? (optional)</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {chapters.map((c) => {
                      const active = chapter === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setChapter(active ? undefined : c)}
                          className={`rounded-sm border-2 border-foreground px-3 py-1.5 text-[15px] font-medium transition-colors duration-150 ${active ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <label htmlFor="email" className="eyebrow mt-6 block text-muted-foreground">Your email</label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                    placeholder="you@example.com"
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "email-error" : undefined}
                    className="h-12 flex-1 rounded-sm border-2 border-foreground bg-background px-4 text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Button type="submit" size="lg" disabled={status === "loading"} className="h-12">
                    {status === "loading" ? "Adding you…" : <>Get on the list <ArrowRight className="size-4" /></>}
                  </Button>
                </div>
                {status === "error" && <p id="email-error" className="mt-3 text-[15px] text-emphasis">{error}</p>}
              </form>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <span className="absolute -top-4 left-5 z-10 -rotate-3 bg-primary px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground">This counts, too.</span>
            <img src={toasterAsset.url} alt="A toaster and buttered toast on a sunny plaster counter" className="aspect-[4/5] w-full rounded-sm border-2 border-foreground object-cover" />
            <div className="border-x-2 border-b-2 border-foreground bg-foreground px-5 py-5 text-background">
              <p className="font-display text-[24px] leading-[1.15]">You shouldn’t have to get married to get a toaster.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-foreground bg-foreground text-background">
        <div className="site-container flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[17px] leading-[1.5] text-background/80">Not a wedding. Not a baby. Still worth celebrating on purpose.</p>
          <a href="mailto:liv@goodchapter.com" className="text-[15px] font-semibold underline underline-offset-4">liv@goodchapter.com</a>
        </div>
      </footer>
    </div>
  );
}

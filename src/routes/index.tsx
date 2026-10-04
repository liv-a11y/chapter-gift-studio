import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import keyDoor from "@/assets/01-key-and-door.png.asset.json";
import toasterCouple from "@/assets/06-toaster-and-couple.png.asset.json";
import { Illustration } from "@/components/site/illustration";
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
        <div className="site-container flex min-h-20 items-center justify-between gap-4 py-3">
          <span className="font-display text-[26px] sm:text-[32px]"><BrandMark /></span>
          <span className="eyebrow text-right text-muted-foreground">Pilot · Opening soon</span>
        </div>
      </header>

      <main className="flex-1">
        <section className="hero-bleed pb-14 pt-7 md:pb-20 md:pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b-2 border-foreground pb-5">
            <p className="eyebrow text-emphasis">A registry for the rest of it</p>
            <p className="eyebrow text-muted-foreground">First homes · Fresh starts · Off-script</p>
          </div>

          <h1 className="site-hero mt-7 sm:mt-9">
            <span className="block">A friend starts it.</span>
            <span className="block">The person approves it.</span>
            <span className="mt-3 block bg-emphasis px-[0.08em] pb-[0.16em] pt-[0.1em] text-emphasis-foreground sm:mt-5">
              Nobody asks.
            </span>
          </h1>

          <div className="mt-16 grid grid-cols-[minmax(0,1fr)] items-start gap-12 border-t-2 border-foreground pt-14 lg:mt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.85fr)] lg:gap-16">


            <div className="flex flex-col items-start gap-7">
              <p className="site-body max-w-[46ch] text-muted-foreground">
                We’re opening the pilot in small circles for first homes, fresh starts, and every milestone weddings never covered. Get on the list and we’ll invite you when the next one opens.
              </p>

              {status === "done" ? (
                <div className="w-full max-w-[38rem] border-2 border-foreground bg-card" role="status">
                  <div className="border-b-2 border-foreground bg-foreground px-5 py-3 text-background">
                    <span className="eyebrow flex items-center gap-2"><Check className="size-4" /> You’re on the list</span>
                  </div>
                  <div className="p-6">
                    <p className="font-display text-[30px] leading-[1.08] sm:text-[38px]">We’ll write when the next circle opens.</p>
                    <p className="mt-4 text-[17px] leading-[1.5] text-muted-foreground">One email, no spam, no pressure. That’s the whole deal.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="w-full max-w-[38rem] border-2 border-foreground bg-card">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-2 border-foreground bg-foreground px-5 py-3 text-background">
                    <span className="eyebrow">Get on the list</span>
                    <span className="eyebrow text-background/60">One email · No spam</span>
                  </div>
                  <div className="p-5 sm:p-6">
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
                              className={`rounded-sm border-2 border-foreground px-4 py-2 text-[16px] font-semibold transition-colors duration-175 ${active ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
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
                        className="h-14 flex-1 rounded-sm border-2 border-foreground bg-background px-4 text-[18px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                      <Button type="submit" size="lg" disabled={status === "loading"} className="h-14 px-7 text-[17px] font-semibold">
                        {status === "loading" ? "Adding you…" : <>Get on the list <ArrowRight className="size-5" /></>}
                      </Button>
                    </div>
                    {status === "error" && <p id="email-error" className="mt-3 text-[15px] text-emphasis">{error}</p>}
                  </div>
                </form>
              )}
            </div>

            <div className="flex w-full flex-col gap-10">
              <Illustration
                src={keyDoor.url}
                eager
                alt="Two people walk toward a large open door. One carries a box. The other lifts a big yellow key."
                caption="Illustration. The door is open."
              />
              <div className="relative">
                <span className="absolute -top-4 left-5 z-10 -rotate-3 border-2 border-foreground bg-background px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-foreground">Also a milestone.</span>
                <div className="overflow-hidden rounded-t-[4px] border-2 border-foreground bg-background">
                  <img src={toasterCouple.url} width={1536} height={1024} loading="lazy" decoding="async" alt="A very large toaster with two slices of yellow toast. A small bride and groom stand beside it looking up." className="block aspect-[3/2] h-auto w-full object-cover" style={{ mixBlendMode: "multiply" }} />
                </div>
                <div className="border-x-2 border-b-2 border-foreground bg-foreground px-5 py-6 text-background">
                  <p className="font-display text-[26px] leading-[1.08] sm:text-[30px]">Married people get toasters. You just got a house.</p>
                </div>
                <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Illustration. A very large toaster, a very small wedding.</p>
              </div>
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

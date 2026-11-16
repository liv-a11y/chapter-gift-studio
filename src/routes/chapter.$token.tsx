import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPersonChapter } from "@/lib/person-chapter.functions";
import { ChapterItem } from "@/components/person/chapter-item";

export const Route = createFileRoute("/chapter/$token")({
  loader: async ({ params }) => {
    const chapter = await getPersonChapter({ data: { token: params.token } });
    if (!chapter) throw notFound();
    return chapter;
  },
  head: () => ({
    meta: [
      { title: "Your chapter | Good Chapter, Co." },
      { name: "description", content: "Eight things chosen for you, each with the reason written next to it." },
      { property: "og:title", content: "Your chapter | Good Chapter, Co." },
      { property: "og:description", content: "Eight things chosen for you, each with the reason written next to it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  pendingComponent: () => <main className="mx-auto max-w-[900px] px-6 py-24 text-[19px] text-foreground/70">Opening your chapter.</main>,
  notFoundComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-24">
      <h1 className="font-display text-[40px]">This link does not open a chapter.</h1>
      <p className="mt-4 text-[19px] text-foreground/80">Ask the friend who started it for a fresh one.</p>
    </main>
  ),
  errorComponent: () => (
    <main className="mx-auto max-w-[640px] px-6 py-24">
      <h1 className="font-display text-[40px]">Your chapter did not open.</h1>
      <p className="mt-4 text-[19px] text-foreground/80">Refresh the page and try once more.</p>
    </main>
  ),
  component: PersonChapter,
});

function PersonChapter() {
  const c = Route.useLoaderData();
  const { token } = Route.useParams();
  return (
    <main className="mx-auto w-full max-w-[900px] px-6 pb-24 pt-12">
      <p className="text-[14px] font-medium text-accent">{c.chapter_type}</p>
      <h1 className="mt-4 font-display text-[clamp(40px,8vw,84px)] leading-[0.95]">This is yours.</h1>
      <p className="mt-6 max-w-[46ch] text-[20px] leading-[1.45] text-foreground/85">
        Eight things, chosen one at a time, each with the reason it was chosen for you. Nothing reaches your guests until you answer.
      </p>
      {c.await_answer ? (
        <div className="mt-8 max-w-[560px] rounded border-2 border-foreground bg-card p-6">
          <p className="text-[14px] font-medium text-foreground/55">Your answer first</p>
          <p className="mt-2 text-[20px] leading-[1.4]">Decline anything that does not fit. Say yes, and the rest opens to the people you named. Send it back and nothing goes out at all.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link to="/decide/$token/$answer" params={{ token: c.accept_token, answer: "accept" }} className="flex items-center justify-between gap-6 rounded border-2 border-primary bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground hover:bg-background hover:text-primary">
              <span>Accept it</span><span aria-hidden="true">→</span>
            </Link>
            <Link to="/decide/$token/$answer" params={{ token: c.decline_token, answer: "decline" }} className="rounded border-2 border-foreground px-5 py-3 text-center text-[14px] font-medium hover:bg-foreground hover:text-background">
              Send it back
            </Link>
          </div>
        </div>
      ) : null}
      {c.person_decision === "accepted" ? <p className="mt-8 text-[14px] font-medium text-foreground/60">You said yes{c.decided_on ? ` on ${c.decided_on}` : ""}. The list is open to the people you named.</p> : null}
      {c.person_decision === "declined" ? <p className="mt-8 max-w-[44ch] border-l-2 border-foreground pl-4 text-[20px] leading-[1.4]">You sent this back{c.decided_on ? ` on ${c.decided_on}` : ""}. Nothing went to the guests.</p> : null}
      {c.story_line ? <p className="mt-8 max-w-[44ch] border-l-2 border-accent pl-4 font-display text-[26px] leading-[1.15]">{c.story_line}</p> : null}
      {c.items.length === 0 ? (
        <p className="mt-12 text-[19px] text-foreground/70">Your eight are still being chosen. Come back to this link soon.</p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {c.items.map((item, i) => <ChapterItem key={item.id} token={token} item={item} index={i} open={c.answers_open} awaiting={c.await_answer} />)}
        </div>
      )}
      <p className="mt-12 text-[14px] font-medium text-foreground/50">Keep this link to yourself. It is the only copy.</p>
    </main>
  );
}

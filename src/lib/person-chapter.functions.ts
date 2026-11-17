import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Ported from Base44 server-fns and decision-fns. The private token is the only key.
const ANSWERS_OPEN = ["with_person_items", "with_person_guests"];
const token = z.string().trim().min(12).max(64);

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
const day = (v: string | null) =>
  v ? new Date(v).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" }) : "";

export const getPersonChapter = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: c } = await db.from("chapters").select("*").eq("person_token", data.token).maybeSingle();
    if (!c) return null;
    const { data: items } = await db.from("chapter_items").select("*").eq("chapter_id", c.id).order("position").limit(8);
    const decision = c.person_decision || "pending";
    const awaiting = Boolean(c.accept_token) && decision === "pending";
    return {
      title: c.title as string,
      chapter_type: c.chapter_type as string,
      starter_name: c.starter_name as string,
      story_line: (c.story_line ?? "") as string,
      person_decision: decision as string,
      decided_on: day(c.person_decided_at),
      await_answer: awaiting,
      accept_token: awaiting ? (c.accept_token as string) : "",
      decline_token: awaiting ? ((c.decline_token ?? "") as string) : "",
      answers_open: ANSWERS_OPEN.includes(c.state) && decision === "pending",
      items: (items ?? []).map((i) => ({
        id: i.id as string, name: i.name as string, photo_url: (i.photo_url ?? "") as string, price: i.price as number | null,
        source: (i.source ?? "") as string, source_url: (i.source_url ?? "") as string, why: (i.why ?? "") as string, status: i.status as string,
      })),
    };
  });

export const answerItem = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ token, itemId: z.string().uuid(), answer: z.enum(["approved", "declined"]) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: c } = await db.from("chapters").select("id, state, person_decision, accept_token").eq("person_token", data.token).maybeSingle();
    if (!c || !ANSWERS_OPEN.includes(c.state)) return { ok: false };
    if ((c.person_decision || "pending") !== "pending") return { ok: false };
    const { data: updated } = await db.from("chapter_items").update({ status: data.answer }).eq("id", data.itemId).eq("chapter_id", c.id).select("status").maybeSingle();
    return updated ? { ok: true, status: updated.status as string } : { ok: false };
  });

const byAnswerToken = async (t: string, answer: "accept" | "decline") => {
  const db = await admin();
  const { data } = await db.from("chapters").select("*").eq(answer === "accept" ? "accept_token" : "decline_token", t).maybeSingle();
  return { db, c: data };
};

export const getDecision = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token, answer: z.enum(["accept", "decline"]) }).parse(d))
  .handler(async ({ data }) => {
    const { c } = await byAnswerToken(data.token, data.answer);
    if (!c) return null;
    const decision = c.person_decision || "pending";
    return {
      decision: decision as string, settled: decision !== "pending", decided_on: day(c.person_decided_at),
      starter_name: ((c.starter_name || "the friend who started it").trim()) as string,
      chapter_type: (c.chapter_type || "A chapter") as string,
    };
  });

export const recordDecision = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ token, answer: z.enum(["accept", "decline"]) }).parse(d))
  .handler(async ({ data }) => {
    const { db, c } = await byAnswerToken(data.token, data.answer);
    if (!c) return { ok: false as const };
    const decision = c.person_decision || "pending";
    if (decision !== "pending") return { ok: true as const, decision: decision as string, decided_on: day(c.person_decided_at) };
    const now = new Date().toISOString();
    const next = data.answer === "accept"
      ? { person_decision: "accepted", person_decided_at: now, state: "sent_to_guests" }
      : { person_decision: "declined", person_decided_at: now, state: "declined" };
    // Only a still-pending chapter changes, so two clicks cannot race.
    await db.from("chapters").update(next).eq("id", c.id).eq("person_decision", "pending");
    return { ok: true as const, decision: next.person_decision, decided_on: day(now) };
  });

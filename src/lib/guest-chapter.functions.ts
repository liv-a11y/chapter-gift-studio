import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Ported from the Base44 guest-fns: a private token is the only key, so this runs server-side only.
const OPEN_STATE = "sent_to_guests";
const VISIBLE = ["approved", "given"];

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getGuestChapter = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token: z.string().trim().min(1).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: guest } = await db.from("chapter_guests").select("id, chapter_id").eq("guest_token", data.token).maybeSingle();
    if (!guest) return null;
    const { data: chapter } = await db.from("chapters").select("*").eq("id", guest.chapter_id).maybeSingle();
    if (!chapter) return null;
    const [{ data: items }, { data: claims }] = await Promise.all([
      db.from("chapter_items").select("*").eq("chapter_id", chapter.id).order("position").limit(8),
      db.from("chapter_claims").select("item_id, guest_id, display_name").eq("chapter_id", chapter.id),
    ]);
    const accepted = chapter.person_decision === "accepted";
    return {
      title: chapter.title,
      starter_name: chapter.starter_name,
      chapter_type: chapter.chapter_type,
      state: chapter.state,
      accepted,
      open: chapter.state === OPEN_STATE && accepted,
      items: (items ?? []).filter((i) => VISIBLE.includes(i.status)).map((i) => {
        const c = (claims ?? []).find((r) => r.item_id === i.id);
        return {
          id: i.id, name: i.name, photo_url: i.photo_url ?? "", price: i.price, source: i.source ?? "",
          source_url: i.source_url ?? "", why: i.why ?? "",
          claim: c ? { display_name: c.display_name, mine: c.guest_id === guest.id } : null,
        };
      }),
    };
  });

export const claimItem = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ token: z.string().trim().min(12).max(64), item_id: z.string().uuid(), display_name: z.string().trim().max(60) }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: guest } = await db.from("chapter_guests").select("id, chapter_id").eq("guest_token", data.token).maybeSingle();
    if (!guest) return { ok: false };
    const { data: chapter } = await db.from("chapters").select("id, state, person_decision").eq("id", guest.chapter_id).maybeSingle();
    if (!chapter || chapter.state !== OPEN_STATE || chapter.person_decision !== "accepted") return { ok: false };
    const { data: item } = await db.from("chapter_items").select("id, chapter_id, status").eq("id", data.item_id).maybeSingle();
    if (!item || item.chapter_id !== chapter.id || !VISIBLE.includes(item.status)) return { ok: false };
    // The unique item_id constraint refuses a second claim, even in a race.
    const { error } = await db.from("chapter_claims").insert({ chapter_id: chapter.id, item_id: item.id, guest_id: guest.id, display_name: data.display_name });
    return { ok: !error, display_name: data.display_name };
  });

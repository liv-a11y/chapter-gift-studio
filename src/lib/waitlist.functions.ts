import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const input = z.object({
  email: z.string().trim().email().max(254),
  chapter: z.string().max(80).optional(),
  comments: z.string().trim().max(1000).optional(),
});

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data) => input.parse(data))
  .handler(async ({ data }) => {
    const sb = createClient<Database>(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const email = data.email.toLowerCase();
    const { error } = await sb.from("waitlist_signups").insert({ email, chapter: data.chapter ?? null, comments: data.comments || null });
    if (error && error.code !== "23505") throw new Error("Could not save signup");
    try {
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("new-inquiry", "liv@goodchapter.com", {
        templateData: { email, inquiry: data.chapter, comments: data.comments },
        idempotencyKey: `new-inquiry-${email}-${Date.now()}`,
        replyTo: email,
      });
    } catch (e) {
      console.error("Inquiry email failed", e);
    }
    return { ok: true };
  });

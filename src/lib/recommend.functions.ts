import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  chapter: z.string().trim().min(3).max(400),
  details: z.string().trim().max(1200).default(""),
  spice: z.enum(["mild", "medium", "unhinged"]),
});

export type Recommendation = { name: string; brand: string; band: string; price: string; reason: string };
export type RecommendResult = { ideas: Recommendation[]; error?: string };

const tone = {
  mild: "Tender, warm, grounded. Practical, calming items. Reasons are sincere and gentle.",
  medium: "Playful and specific. Wry inside-joke energy, still kind. Reasons feel like a friend teasing lovingly.",
  unhinged: "Chaotic, absurd, hilarious, bleep-level cheeky (no slurs, no explicit sexual content, no cruelty). Surprising but real, buyable items. Reasons are unhinged one-liners that still land with love.",
};

export const recommendGifts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }): Promise<RecommendResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ideas: [], error: "AI is not configured yet." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const prompt = `You are Good Chapter, an anti-registry for life milestones weddings never covered. A friend is starting a chapter for ${data.name}.
Life chapter: ${data.chapter}
Things only the friend would know: ${data.details || "(none given)"}
Tone: ${tone[data.spice]}

Recommend exactly 8 gifts, two per price band: "Under $50", "$50–$120", "$120–$250", "Splurge / group". Prefer real brands (e.g. Otherland, Ghia, Caraway, Framebridge, or independent makers). Each reason is ONE line, under 110 characters, personal to the details above. No cash, gift cards, or donations.
Return ONLY JSON: {"ideas":[{"name":"","brand":"","band":"","price":"$xx","reason":""}]}`;
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        prompt,
        maxRetries: 0,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = await result.text;
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? (JSON.parse(match[0]) as { ideas?: Recommendation[] }) : {};
      const ideas = (parsed.ideas ?? [])
        .filter((i) => i && i.name && i.reason)
        .slice(0, 8)
        .map((i) => ({ name: String(i.name), brand: String(i.brand ?? ""), band: String(i.band ?? ""), price: String(i.price ?? ""), reason: String(i.reason).slice(0, 160) }));
      if (!ideas.length) return { ideas: [], error: "No ideas came back. Try adding a detail or two." };
      return { ideas };
    } catch (err) {
      const status = (err as { statusCode?: number })?.statusCode;
      console.error("recommendGifts failed", err);
      if (status === 429) return { ideas: [], error: "Lots of people are asking at once. Try again in a minute." };
      if (status === 402) return { ideas: [], error: "AI credits have run out for this workspace." };
      return { ideas: [], error: "Couldn’t reach the idea generator. Try again." };
    }
  });

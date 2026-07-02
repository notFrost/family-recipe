import type { RecipeDraftPrefill, VideoMetadata } from "./video-import";

/**
 * AI recipe extraction — the premium slot of the video import, implemented on
 * Google's Gemini free tier (Frost's own AI Studio key; NO Anthropic credits
 * exist yet, so the Claude implementation waits for go-live funding).
 *
 * DEV-ONLY BY DESIGN until go-live (Frost's explicit call):
 *  - hard-off in production (`VERCEL_ENV === "production"`), regardless of env
 *  - requires GEMINI_API_KEY, which lives ONLY in local .env.local (gitignored);
 *    Vercel previews don't have it → they gracefully stay metadata-only.
 *
 * Capability split by platform:
 *  - YouTube: Gemini ingests the video URL directly (file_data.file_uri) and
 *    genuinely watches it — full ingredients/steps extraction.
 *  - TikTok / Instagram: no direct video ingestion — Gemini parses the oEmbed
 *    text (creators usually paste the recipe in the caption/title).
 *
 * The key is never logged; every failure degrades to null and the import
 * flow falls back to plain metadata prefill.
 */

export interface ExtractedRecipe {
  title: string | null;
  description: string | null;
  minutes: number | null;
  ingredients: string[];
  steps: string[];
}

export function aiExtractionEnabled(): boolean {
  return (
    process.env.VERCEL_ENV !== "production" && !!process.env.GEMINI_API_KEY
  );
}

const MODEL = "gemini-2.5-flash";

const PROMPT = `You are extracting a cooking recipe from a short-form cooking video or its caption text.
Respond with STRICT JSON only (no markdown fences, no commentary), exactly this shape:
{"title": string|null, "description": string|null, "minutes": number|null, "ingredients": string[], "steps": string[]}
Rules:
- "title": a clean dish name (not the video's clickbait title), or null.
- "description": one warm sentence describing the dish, or null.
- "minutes": total cook+prep time if stated or clearly inferable, else null.
- "ingredients": one item per line WITH quantity when known (e.g. "2 tbsp soy sauce"). Empty array if unknown.
- "steps": imperative sentences, one action per step, in order. Empty array if unknown.
- If there is no recipe at all, return {"title":null,"description":null,"minutes":null,"ingredients":[],"steps":[]}.`;

const cap = (s: unknown, n: number): string | null =>
  typeof s === "string" && s.trim() ? s.trim().slice(0, n) : null;

const capList = (v: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(v)
    ? v
        .filter((x): x is string => typeof x === "string" && !!x.trim())
        .slice(0, maxItems)
        .map((x) => x.trim().slice(0, maxLen))
    : [];

/**
 * Run extraction for a fetched video. Returns null when disabled, on any
 * API/parse failure, or when the model found no recipe content.
 */
export async function extractRecipe(
  meta: VideoMetadata,
): Promise<ExtractedRecipe | null> {
  if (!aiExtractionEnabled()) return null;
  const key = process.env.GEMINI_API_KEY!;

  // YouTube: hand Gemini the video itself. Other platforms: text only.
  const parts: Record<string, unknown>[] =
    meta.platform === "youtube"
      ? [
          { file_data: { file_uri: meta.sourceUrl } },
          { text: PROMPT },
        ]
      : [
          {
            text: `${PROMPT}\n\nCaption/metadata of a ${meta.platform} video:\nTitle: ${meta.title ?? "(none)"}\nCreator: ${meta.authorName ?? "(unknown)"}\nURL: ${meta.sourceUrl}`,
          },
        ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          // Key travels in a header, not the URL — keeps it out of any
          // intermediary/request logs that record URLs.
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        cache: "no-store",
        // Watching a video takes a while; text parsing is fast.
        signal: AbortSignal.timeout(meta.platform === "youtube" ? 60000 : 20000),
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;

    // Defensive parse: strip accidental markdown fences.
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    const minutesNum = Number(parsed.minutes);
    const extracted: ExtractedRecipe = {
      title: cap(parsed.title, 200),
      description: cap(parsed.description, 500),
      minutes:
        Number.isFinite(minutesNum) && minutesNum > 0 && minutesNum < 100000
          ? Math.round(minutesNum)
          : null,
      ingredients: capList(parsed.ingredients, 30, 200),
      steps: capList(parsed.steps, 20, 400),
    };

    // "No recipe found" comes back as empty lists — treat as no extraction.
    if (extracted.ingredients.length === 0 && extracted.steps.length === 0) {
      return null;
    }
    return extracted;
  } catch {
    // Timeout, network, quota, malformed JSON — the import degrades to
    // metadata-only. Never rethrow: extraction is best-effort by contract.
    return null;
  }
}

/** Merge AI extraction over the plain metadata prefill (AI wins where set). */
export function mergePrefill(
  base: RecipeDraftPrefill,
  ai: ExtractedRecipe | null,
): RecipeDraftPrefill & {
  ingredients?: string[];
  steps?: string[];
  minutes?: number;
} {
  if (!ai) return base;
  return {
    title: ai.title ?? base.title,
    imageUrl: base.imageUrl,
    // Keep the attribution line; lead with the AI's dish description.
    description: ai.description
      ? `${ai.description} ${base.description ?? ""}`.trim()
      : base.description,
    ingredients: ai.ingredients.length ? ai.ingredients : undefined,
    steps: ai.steps.length ? ai.steps : undefined,
    minutes: ai.minutes ?? undefined,
  };
}

/**
 * Video → recipe-draft import (TikTok / YouTube Shorts / Instagram Reels).
 *
 * Tonight's implementation is METADATA-ONLY via each platform's public oEmbed
 * endpoint (no API keys): title, creator, thumbnail — enough to prefill a
 * recipe draft. Full ingredient/step extraction from the video itself is the
 * PREMIUM slot: implement `VideoRecipeExtractor` with an AI-backed version
 * and wire it behind the plan gate (hard line: no recurring cost before
 * recurring income — AI is premium-only).
 *
 * SECURITY (SSRF): user input is never fetched directly. The pasted URL is
 * parsed and its host checked against a fixed allowlist; the only outbound
 * requests go to FIXED, hardcoded oEmbed endpoints with the validated URL
 * passed as a query parameter.
 */

export type VideoPlatform = "tiktok" | "youtube" | "instagram";

export interface ParsedVideoUrl {
  platform: VideoPlatform;
  /** Normalized https URL, safe to echo back to the user. */
  url: string;
}

export interface VideoMetadata {
  platform: VideoPlatform;
  sourceUrl: string;
  title: string | null;
  authorName: string | null;
  thumbnailUrl: string | null;
  /** False when the platform offers no keyless metadata (Instagram). */
  supported: boolean;
}

/** A prefill payload for the recipe form — strings only, already capped. */
export interface RecipeDraftPrefill {
  title?: string;
  imageUrl?: string;
  description?: string;
}

const HOSTS: Record<VideoPlatform, string[]> = {
  tiktok: ["tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com"],
  youtube: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
  instagram: ["instagram.com", "www.instagram.com"],
};

const cap = (s: unknown, n: number): string | null =>
  typeof s === "string" && s.trim().length > 0 ? s.trim().slice(0, n) : null;

/** Validate + classify a pasted URL. Returns null for anything off-list. */
export function parseVideoUrl(raw: string): ParsedVideoUrl | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  for (const [platform, hosts] of Object.entries(HOSTS) as [
    VideoPlatform,
    string[],
  ][]) {
    if (hosts.includes(host)) {
      url.protocol = "https:";
      return { platform, url: url.toString() };
    }
  }
  return null;
}

/**
 * Fetch what the platform will share without keys. Never throws — errors
 * come back as `null` fields so the import page can degrade gracefully.
 */
export async function fetchVideoMetadata(
  parsed: ParsedVideoUrl,
): Promise<VideoMetadata> {
  const base: VideoMetadata = {
    platform: parsed.platform,
    sourceUrl: parsed.url,
    title: null,
    authorName: null,
    thumbnailUrl: null,
    supported: parsed.platform !== "instagram",
  };

  // Instagram's oEmbed requires a Facebook app token — no keyless path.
  // The import still works: the user continues with a blank draft.
  if (parsed.platform === "instagram") return base;

  const endpoint =
    parsed.platform === "tiktok"
      ? `https://www.tiktok.com/oembed?url=${encodeURIComponent(parsed.url)}`
      : `https://www.youtube.com/oembed?url=${encodeURIComponent(parsed.url)}&format=json`;

  try {
    const res = await fetch(endpoint, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
      headers: { accept: "application/json" },
    });
    if (!res.ok) return base;
    const data: unknown = await res.json();
    const o = (data ?? {}) as Record<string, unknown>;
    return {
      ...base,
      title: cap(o.title, 200),
      authorName: cap(o.author_name, 100),
      thumbnailUrl: sanitizeImageUrl(o.thumbnail_url),
    };
  } catch {
    // Timeout, network, malformed JSON — degrade to a blank draft.
    return base;
  }
}

/** Only http(s) URLs pass through as image prefills. */
export function sanitizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:"
      ? u.toString().slice(0, 1000)
      : null;
  } catch {
    return null;
  }
}

/** Turn fetched metadata into recipe-form prefills. */
export function toDraftPrefill(meta: VideoMetadata): RecipeDraftPrefill {
  const platformLabel =
    meta.platform === "tiktok"
      ? "TikTok"
      : meta.platform === "youtube"
        ? "YouTube"
        : "Instagram";
  // Cap the echoed URL here too (the receiving form re-caps, but the
  // continue-link shouldn't balloon on a pathologically long platform URL).
  const shortUrl = meta.sourceUrl.slice(0, 300);
  return {
    title: meta.title ?? undefined,
    imageUrl: meta.thumbnailUrl ?? undefined,
    description: meta.authorName
      ? `From a ${platformLabel} video by ${meta.authorName} — ${shortUrl}`
      : `From a ${platformLabel} video — ${shortUrl}`,
  };
}

/**
 * The premium slot. A future AI-backed implementation watches/transcribes the
 * video and returns real ingredients/steps; it plugs in here without touching
 * the import page. (Parked: needs an API key + the plan gate — Frost's call.)
 */
export interface VideoRecipeExtractor {
  extract(meta: VideoMetadata): Promise<RecipeDraftPrefill>;
}

export const metadataOnlyExtractor: VideoRecipeExtractor = {
  async extract(meta) {
    return toDraftPrefill(meta);
  },
};

/**
 * Serializable metadata for the preview harness (safe to import into the client
 * sidebar — no component references). The actual page components live in
 * `styles.tsx`, which the server route reads.
 *
 * The harness explores STYLES (whole design languages), each implementing every
 * page, so a style can be picked globally and judged for consistency across
 * pages — rather than one-off variants per page.
 */
export type PageKey = "recipe" | "profile" | "family" | "form" | "settings";

export const PAGES: { key: PageKey; label: string }[] = [
  { key: "recipe", label: "Recipe" },
  { key: "profile", label: "Profile" },
  { key: "family", label: "Family" },
  { key: "form", label: "New recipe" },
  { key: "settings", label: "Settings" },
];

export interface StyleMeta {
  id: string;
  name: string;
  tagline: string;
}

export const STYLE_META: StyleMeta[] = [
  {
    id: "homestead",
    name: "Homestead",
    tagline:
      "Front-loaded & image-led — big hero photos and a single warm column you read top to bottom.",
  },
  {
    id: "atelier",
    name: "Atelier",
    tagline:
      "Structured & split — a sticky info rail beside the content; editorial and information-dense.",
  },
  {
    id: "keepsake",
    name: "Keepsake",
    tagline:
      "Centered & framed — a scrapbook-warm treatment that feels like a treasured recipe card.",
  },
];

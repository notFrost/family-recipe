export type ThemeId = "amber" | "emerald" | "slate" | "marigold" | "mocha";

export interface ThemeModeTokens {
  /** Primary brand color used for buttons, active states, and logo accents. */
  primary: string;
  /** Secondary accent used for borders, subtle accents, and glows. */
  secondary: string;
  /** Page background color. */
  background: string;
  /** Main text color. */
  foreground: string;
  /** Muted/supporting text color. */
  muted: string;
  /** Elevated surface color (cards, header). */
  card: string;
  /** Border color. */
  border: string;
  /** Text color placed on top of primary buttons. */
  buttonText: string;
}

export interface Theme {
  id: ThemeId;
  label: string;
  light: ThemeModeTokens;
  dark: ThemeModeTokens;
}

export const THEMES: Theme[] = [
  {
    id: "amber",
    label: "Amber",
    light: {
      primary: "#d97706",
      secondary: "#f59e0b",
      background: "#fffaf3",
      foreground: "#3e2723",
      muted: "#5d4037",
      card: "#ffffff",
      border: "#fed7aa",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#f59e0b",
      secondary: "#fb923c",
      background: "#2a1f1b",
      foreground: "#fffaf3",
      muted: "#d7ccc8",
      card: "#3d2e28",
      border: "#5d4037",
      buttonText: "#ffffff",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    light: {
      primary: "#059669",
      secondary: "#10b981",
      background: "#f0fdf4",
      foreground: "#064e3b",
      muted: "#047857",
      card: "#ffffff",
      border: "#a7f3d0",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#34d399",
      secondary: "#6ee7b7",
      background: "#022c22",
      foreground: "#ecfdf5",
      muted: "#6ee7b7",
      card: "#064e3b",
      border: "#065f46",
      buttonText: "#022c22",
    },
  },
  {
    id: "slate",
    label: "Slate",
    light: {
      primary: "#334155",
      secondary: "#94a3b8",
      background: "#f8fafc",
      foreground: "#0f172a",
      muted: "#475569",
      card: "#ffffff",
      border: "#e2e8f0",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
      background: "#020617",
      foreground: "#f8fafc",
      muted: "#94a3b8",
      card: "#1e293b",
      border: "#334155",
      buttonText: "#0f172a",
    },
  },
  {
    id: "marigold",
    label: "Marigold",
    light: {
      primary: "#a16207",
      secondary: "#eab308",
      background: "#fefce8",
      foreground: "#422006",
      muted: "#854d0e",
      card: "#ffffff",
      border: "#fef08a",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#facc15",
      secondary: "#fde047",
      background: "#292011",
      foreground: "#fefce8",
      muted: "#fde68a",
      card: "#422006",
      border: "#854d0e",
      buttonText: "#292011",
    },
  },
  {
    id: "mocha",
    label: "Mocha",
    light: {
      primary: "#6f4e37",
      secondary: "#a47148",
      background: "#faf6f1",
      foreground: "#3b2417",
      muted: "#6b4f3a",
      card: "#ffffff",
      border: "#e7d8c9",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#c69c6d",
      secondary: "#a47148",
      background: "#241a12",
      foreground: "#faf6f1",
      muted: "#d8c3a5",
      card: "#3b2417",
      border: "#5c4433",
      buttonText: "#241a12",
    },
  },
];

export const DEFAULT_THEME = THEMES[0];

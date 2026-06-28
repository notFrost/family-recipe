export type ThemeId =
  | "amber"
  | "emerald"
  | "rose"
  | "sapphire"
  | "violet"
  | "slate"
  | "teal"
  | "marigold"
  | "plum"
  | "mocha";

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
    id: "rose",
    label: "Rose",
    light: {
      primary: "#e11d48",
      secondary: "#fb7185",
      background: "#fff1f2",
      foreground: "#881337",
      muted: "#9f1239",
      card: "#ffffff",
      border: "#fecdd3",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#f43f5e",
      secondary: "#fda4af",
      background: "#4c0519",
      foreground: "#fff1f2",
      muted: "#fda4af",
      card: "#881337",
      border: "#9f1239",
      buttonText: "#ffffff",
    },
  },
  {
    id: "sapphire",
    label: "Sapphire",
    light: {
      primary: "#2563eb",
      secondary: "#60a5fa",
      background: "#eff6ff",
      foreground: "#1e3a8a",
      muted: "#1d4ed8",
      card: "#ffffff",
      border: "#bfdbfe",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#3b82f6",
      secondary: "#93c5fd",
      background: "#0f172a",
      foreground: "#eff6ff",
      muted: "#93c5fd",
      card: "#1e3a8a",
      border: "#1e40af",
      buttonText: "#ffffff",
    },
  },
  {
    id: "violet",
    label: "Violet",
    light: {
      primary: "#7c3aed",
      secondary: "#c084fc",
      background: "#faf5ff",
      foreground: "#4c1d95",
      muted: "#6d28d9",
      card: "#ffffff",
      border: "#e9d5ff",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#8b5cf6",
      secondary: "#d8b4fe",
      background: "#2e1065",
      foreground: "#faf5ff",
      muted: "#d8b4fe",
      card: "#4c1d95",
      border: "#5b21b6",
      buttonText: "#ffffff",
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
    id: "teal",
    label: "Teal",
    light: {
      primary: "#0d9488",
      secondary: "#2dd4bf",
      background: "#f0fdfa",
      foreground: "#134e4a",
      muted: "#0f766e",
      card: "#ffffff",
      border: "#99f6e4",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#2dd4bf",
      secondary: "#5eead4",
      background: "#042f2e",
      foreground: "#f0fdfa",
      muted: "#5eead4",
      card: "#134e4a",
      border: "#115e59",
      buttonText: "#042f2e",
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
    id: "plum",
    label: "Plum",
    light: {
      primary: "#a21caf",
      secondary: "#e879f9",
      background: "#fdf4ff",
      foreground: "#701a75",
      muted: "#86198f",
      card: "#ffffff",
      border: "#f5d0fe",
      buttonText: "#ffffff",
    },
    dark: {
      primary: "#e879f9",
      secondary: "#f0abfc",
      background: "#4a044e",
      foreground: "#fdf4ff",
      muted: "#f0abfc",
      card: "#701a75",
      border: "#86198f",
      buttonText: "#4a044e",
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

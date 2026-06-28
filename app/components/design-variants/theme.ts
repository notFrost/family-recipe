export type ThemeId = "amber" | "emerald" | "rose" | "sapphire" | "violet" | "slate";

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
];

export const DEFAULT_THEME = THEMES[0];

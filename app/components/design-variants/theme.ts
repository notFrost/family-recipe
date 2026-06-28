export type ThemeId = "amber";

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
    // Light: classic warm Amber.
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
    // Dark: Mocha brown canvas + surfaces, but Amber orange kept as the accent
    // (primary/secondary). buttonText is the deep brown so it reads on orange.
    dark: {
      primary: "#f59e0b",
      secondary: "#fb923c",
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

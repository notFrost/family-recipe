"use client";

import { useState } from "react";
import DiscoverV12 from "@/app/components/design-variants/DiscoverV12";
import VersionPicker from "@/app/components/design-variants/VersionPicker";
import { DEFAULT_THEME, THEMES, type Theme } from "@/app/components/design-variants/theme";

// Design exploration has converged on a single direction: "Warm & Homey" — V2
// with single-line stat pills + the doodle wallpaper, on the Amber theme.
const VARIANTS = [
  { id: 12, label: "Warm & Homey", Component: DiscoverV12 },
] as const;

export default function DiscoverPreviewPage() {
  const [selected, setSelected] = useState<number>(VARIANTS[0].id);
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  return (
    <>
      {VARIANTS.map((v) => (
        <div key={v.id} style={{ display: v.id === selected ? "block" : "none" }}>
          <v.Component isDark={isDark} theme={theme} />
        </div>
      ))}

      <VersionPicker
        variants={VARIANTS}
        current={selected}
        onSelect={setSelected}
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        theme={theme}
        themes={THEMES}
        onSelectTheme={setTheme}
      />
    </>
  );
}

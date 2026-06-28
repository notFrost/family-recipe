"use client";

import { useState, useEffect, useCallback } from "react";
import DiscoverV4 from "@/app/components/design-variants/DiscoverV4";
import DiscoverV5 from "@/app/components/design-variants/DiscoverV5";
import DiscoverV6 from "@/app/components/design-variants/DiscoverV6";
import DiscoverV7 from "@/app/components/design-variants/DiscoverV7";
import DiscoverV8 from "@/app/components/design-variants/DiscoverV8";
import DiscoverV9 from "@/app/components/design-variants/DiscoverV9";
import VersionPicker from "@/app/components/design-variants/VersionPicker";
import { DEFAULT_THEME, THEMES, type Theme } from "@/app/components/design-variants/theme";

const VARIANTS = [
  { id: 4, label: "Warm & Homey", Component: DiscoverV4 },
  { id: 5, label: "Modern Glassmorphism", Component: DiscoverV5 },
  { id: 6, label: "Hearth", Component: DiscoverV6 },
  { id: 7, label: "Atelier", Component: DiscoverV7 },
  { id: 8, label: "Larder", Component: DiscoverV8 },
  { id: 9, label: "Spread", Component: DiscoverV9 },
] as const;

export default function DiscoverPreviewPage() {
  const [selected, setSelected] = useState<number>(VARIANTS[0].id);
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = Number(e.key);
    if (key >= 1 && key <= VARIANTS.length) {
      setSelected(VARIANTS[key - 1].id);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

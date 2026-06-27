"use client";

import { useState, useEffect, useCallback } from "react";
import DiscoverV1 from "@/app/components/design-variants/DiscoverV1";
import DiscoverV4 from "@/app/components/design-variants/DiscoverV4";
import DiscoverV5 from "@/app/components/design-variants/DiscoverV5";
import VersionPicker from "@/app/components/design-variants/VersionPicker";

const VARIANTS = [
  { id: 1, label: "Scandinavian Minimalist", Component: DiscoverV1 },
  { id: 2, label: "Warm & Homey", Component: DiscoverV4 },
  { id: 3, label: "Modern Glassmorphism", Component: DiscoverV5 },
] as const;

export default function DiscoverPreviewPage() {
  const [selected, setSelected] = useState<number>(1);
  const [isDark, setIsDark] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = Number(e.key);
    if (key >= 1 && key <= 3) {
      setSelected(key);
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
          <v.Component isDark={isDark} />
        </div>
      ))}

      <VersionPicker
        variants={VARIANTS}
        current={selected}
        onSelect={setSelected}
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
      />
    </>
  );
}

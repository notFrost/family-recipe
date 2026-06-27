"use client";

import { useState, useEffect, useCallback } from "react";
import DiscoverV1 from "@/app/components/design-variants/DiscoverV1";
import DiscoverV2 from "@/app/components/design-variants/DiscoverV2";
import DiscoverV3 from "@/app/components/design-variants/DiscoverV3";
import DiscoverV4 from "@/app/components/design-variants/DiscoverV4";
import DiscoverV5 from "@/app/components/design-variants/DiscoverV5";
import DiscoverV6 from "@/app/components/design-variants/DiscoverV6";
import VersionPicker from "@/app/components/design-variants/VersionPicker";

const VARIANTS = [
  { id: 1, label: "Scandinavian Minimalist", Component: DiscoverV1 },
  { id: 2, label: "Editorial Magazine", Component: DiscoverV2 },
  { id: 3, label: "Modern Glassmorphism", Component: DiscoverV3 },
  { id: 4, label: "Warm & Homey", Component: DiscoverV4 },
  { id: 5, label: "Retro Diner", Component: DiscoverV5 },
  { id: 6, label: "Mediterranean Sun", Component: DiscoverV6 },
] as const;

export default function DiscoverPreviewPage() {
  const [selected, setSelected] = useState<number>(1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = Number(e.key);
    if (key >= 1 && key <= 6) {
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
          <v.Component />
        </div>
      ))}

      <VersionPicker
        variants={VARIANTS}
        current={selected}
        onSelect={setSelected}
      />
    </>
  );
}

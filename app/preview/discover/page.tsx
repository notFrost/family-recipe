"use client";

import { useState, useEffect, useCallback } from "react";
import DiscoverV1 from "@/app/components/design-variants/DiscoverV1";
import DiscoverV2 from "@/app/components/design-variants/DiscoverV2";
import DiscoverV3 from "@/app/components/design-variants/DiscoverV3";
import DiscoverV4 from "@/app/components/design-variants/DiscoverV4";
import DiscoverV5 from "@/app/components/design-variants/DiscoverV5";
import DiscoverV6 from "@/app/components/design-variants/DiscoverV6";

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

      {/* Floating version picker */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="rounded-2xl border border-white/30 bg-white/70 shadow-lg shadow-black/10 backdrop-blur-md">
          <div className="px-4 pt-3 pb-2">
            <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Design Preview — pick a variant
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selected === v.id
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-white/60 text-zinc-600 hover:bg-white hover:text-zinc-900"
                  }`}
                >
                  <span className="mr-1 opacity-60">V{v.id}</span>
                  {v.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-zinc-400">
              Press <kbd className="inline rounded border border-zinc-200 bg-zinc-100 px-1 py-px font-mono text-[10px] text-zinc-500">1</kbd>–<kbd className="inline rounded border border-zinc-200 bg-zinc-100 px-1 py-px font-mono text-[10px] text-zinc-500">6</kbd> to switch
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

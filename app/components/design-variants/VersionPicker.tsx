"use client";

import { useEffect, useRef, useState } from "react";

export interface VersionPickerProps {
  variants: readonly {
    id: number;
    label: string;
    Component: React.ComponentType;
  }[];
  current: number;
  onSelect: (id: number) => void;
}

export default function VersionPicker({
  variants,
  current,
  onSelect,
}: VersionPickerProps) {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVariant = variants.find((v) => v.id === current) ?? variants[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="relative rounded-full border border-white/40 bg-white/70 shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-white/80">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className="flex h-11 max-w-[92vw] items-center gap-2 px-4 text-sm font-medium text-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="shrink-0 rounded-md bg-zinc-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
            V{current}
          </span>
          <span className="max-w-[140px] truncate md:max-w-[180px]">
            {currentVariant?.label ?? "Select variant"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`shrink-0 text-zinc-500 transition-transform duration-300 ease-out ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div
          className={`absolute bottom-full left-1/2 mb-2 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/40 bg-white/85 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 ease-out ${
            open
              ? "max-h-80 translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 translate-y-2 opacity-0"
          }`}
        >
          <ul
            role="listbox"
            aria-label="Design variants"
            className="min-w-[220px] max-w-[92vw] py-1 md:min-w-[260px]"
          >
            {variants.map((v) => {
              const isSelected = v.id === current;
              return (
                <li key={v.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(v.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-700 hover:bg-white/60 hover:text-zinc-900"
                    }`}
                  >
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      V{v.id}
                    </span>
                    <span className="flex-1 truncate">{v.label}</span>
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="shrink-0 text-white"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="border-t border-zinc-200/60 px-3 py-2 text-center text-[10px] text-zinc-400">
            Press{" "}
            <kbd className="inline rounded border border-zinc-200 bg-zinc-100 px-1 py-px font-mono text-[10px] text-zinc-500">
              1
            </kbd>
            –
            <kbd className="inline rounded border border-zinc-200 bg-zinc-100 px-1 py-px font-mono text-[10px] text-zinc-500">
              6
            </kbd>{" "}
            to switch
          </p>
        </div>
      </div>
    </div>
  );
}

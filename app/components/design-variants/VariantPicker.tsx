"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, ChefHat } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import type { ViewerRole } from "./mock-data";

export interface VariantMeta {
  id: string;
  name: string;
  /** One-line thesis — the reasoning behind the layout. Shown in the toolbar. */
  tagline: string;
}

/**
 * Sticky preview toolbar shared by the recipe- and user-page variant pages.
 * Switches variants, flips light/dark (reusing the real ThemeToggle), and — for
 * the recipe page — flips the viewer between the owner and a visitor so both
 * Action sets are visible. Deliberately not the real Navbar, so the variant
 * under it is the only thing competing for attention.
 */
export function VariantPicker({
  kind,
  variants,
  activeIndex,
  onSelect,
  role,
  onRoleChange,
}: {
  kind: "recipe" | "user" | "family";
  variants: VariantMeta[];
  activeIndex: number;
  onSelect: (index: number) => void;
  role?: ViewerRole;
  onRoleChange?: (role: ViewerRole) => void;
}) {
  const active = variants[activeIndex];

  // Collapse the (space-hungry, esp. on mobile) variant description once the
  // user scrolls into the page; it returns when they scroll back to the top.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Row 1: title, page switch, viewer + theme controls. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              title="Back to the app"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChefHat className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
              <Link
                href="/preview/recipe"
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${kind === "recipe" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Recipe page
              </Link>
              <Link
                href="/preview/user"
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${kind === "user" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                User page
              </Link>
              <Link
                href="/preview/family"
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${kind === "family" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Family page
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {role && onRoleChange ? (
              <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                <span className="px-1.5 text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                </span>
                {(["owner", "visitor"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onRoleChange(r)}
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition-colors ${role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            ) : null}
            <ThemeToggle />
          </div>
        </div>

        {/* Row 2: variant tabs + the active variant's reasoning. */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelect(i)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition-all ${i === activeIndex ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"}`}
              >
                {v.name}
              </button>
            ))}
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${scrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100"}`}
          >
            {active ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-bold text-foreground">
                  {active.name}.
                </span>{" "}
                {active.tagline}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

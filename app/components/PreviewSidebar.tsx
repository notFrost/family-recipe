"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChefHat, ArrowUpRight } from "lucide-react";
import { STYLE_META, PAGES } from "./design-variants/styles-meta";

/**
 * Preview-harness controls. A global STYLE picker (the app commits to one visual
 * language) plus a single shared PAGES list that retargets the chosen style —
 * switching either axis keeps the other, so you can hold a page and flip styles
 * or hold a style and walk pages.
 *
 * Persistent on desktop; on mobile it's a drawer opened from an in-flow bar that
 * sits ABOVE the app navbar (so the menu trigger never covers the logo).
 */
export default function PreviewSidebar() {
  const pathname = usePathname();
  const parts = pathname.split("/"); // ["", "preview", styleId, pageKey]
  const activeStyle = parts[2] ?? STYLE_META[0].id;
  const activePage = parts[3] ?? "recipe";
  const [open, setOpen] = useState(false);

  const styleName =
    STYLE_META.find((s) => s.id === activeStyle)?.name ?? "Preview";
  const pageLabel = PAGES.find((p) => p.key === activePage)?.label ?? "";

  return (
    <>
      {/* Mobile bar — in normal flow, above the app navbar, so it can't cover
          the logo. The drawer it opens is fixed. */}
      <div className="flex h-12 items-center gap-2 border-b border-border bg-card px-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open style menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-foreground">
          {styleName}
          <span className="text-muted-foreground"> · {pageLabel}</span>
        </span>
      </div>

      {/* Mobile backdrop. */}
      {open ? (
        <div
          className="fixed inset-0 z-[55] bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-72 flex-col border-r border-border bg-card transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ChefHat className="h-4 w-4" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-foreground">
              Style preview
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close style menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Style picker — horizontal segmented control to save vertical
              space, with the selected style's description in a fixed-height box
              below so switching styles never shifts the layout. */}
          <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Style
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {STYLE_META.map((style) => {
              const active = style.id === activeStyle;
              return (
                <Link
                  key={style.id}
                  href={`/preview/${style.id}/${activePage}`}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "true" : undefined}
                  className={`rounded-xl border px-2 py-2 text-center text-xs font-bold transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                >
                  {style.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-2 flex h-16 items-start overflow-hidden rounded-xl bg-muted/60 px-3 py-2">
            <p className="text-[11px] leading-snug text-muted-foreground">
              {STYLE_META.find((s) => s.id === activeStyle)?.tagline ??
                STYLE_META[0].tagline}
            </p>
          </div>

          {/* Single pages list, retargeting the active style. */}
          <p className="px-1 pb-2 pt-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Pages
          </p>
          <ul className="flex flex-col gap-0.5">
            {PAGES.map((page) => {
              const active = page.key === activePage;
              return (
                <li key={page.key}>
                  <Link
                    href={`/preview/${activeStyle}/${page.key}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                  >
                    {page.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-border px-3 py-3">
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Back to the app
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}

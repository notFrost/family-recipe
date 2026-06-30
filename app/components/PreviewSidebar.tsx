"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChefHat, ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { STYLE_META, PAGES } from "./design-variants/styles-meta";

/**
 * Preview-harness sidebar. Lists each STYLE and the pages within it, so a style
 * can be picked globally and walked page-by-page. Persistent on desktop; a
 * drawer (collapsed by default) on mobile, opened by a floating button.
 *
 * This is the only "tool" chrome — everything to its right is the real app
 * (Navbar + page + Footer), so the page can be judged in context.
 */
export default function PreviewSidebar() {
  const pathname = usePathname();
  const parts = pathname.split("/"); // ["", "preview", styleId, pageKey]
  const activeStyle = parts[2] ?? "";
  const activePage = parts[3] ?? "";
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile open button. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open preview menu"
        className="fixed left-4 top-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur-md lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

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
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close preview menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {STYLE_META.map((style) => {
            const isActiveStyle = style.id === activeStyle;
            return (
              <div key={style.id} className="mb-5">
                <div className="px-2">
                  <p
                    className={`text-sm font-extrabold tracking-tight ${isActiveStyle ? "text-primary" : "text-foreground"}`}
                  >
                    {style.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    {style.tagline}
                  </p>
                </div>
                <ul className="mt-2 flex flex-col gap-0.5">
                  {PAGES.map((page) => {
                    const active =
                      isActiveStyle && page.key === activePage;
                    return (
                      <li key={page.key}>
                        <Link
                          href={`/preview/${style.id}/${page.key}`}
                          onClick={() => setOpen(false)}
                          className={`flex items-center rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                        >
                          {page.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Back to the app
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}

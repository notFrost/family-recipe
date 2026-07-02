import Link from "next/link";
import { Heart } from "lucide-react";

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "text-sm text-muted-foreground transition-colors hover:text-primary";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-card print:hidden">
      {/* Full-width footer (not boxed to the content column). */}
      <div className="w-full px-5 py-14 sm:px-8 lg:px-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base text-primary-foreground shadow-sm">
                🍳
              </span>
              Family Recipe
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Keep your family&apos;s recipes together, discover new ones, and
              pass them down — even after everyone moves out.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Cook
            </p>
            <ul className="flex flex-col gap-2.5">
              <li><FooterLink href="/discover">Discover recipes</FooterLink></li>
              <li><FooterLink href="/families">Families</FooterLink></li>
              <li><FooterLink href="/recipes/new">Add a recipe</FooterLink></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              More
            </p>
            <ul className="flex flex-col gap-2.5">
              <li><FooterLink href="/signup">Create account</FooterLink></li>
              <li><FooterLink href="/design-system">Design system</FooterLink></li>
              <li><FooterLink href="https://github.com" external>GitHub</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Family Recipe</p>
          <p className="flex items-center gap-1.5">
            Made with
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            in the family kitchen
          </p>
        </div>
      </div>
    </footer>
  );
}

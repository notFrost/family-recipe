import Image from "next/image";

/**
 * Keepsake kit — the shared vocabulary every Keepsake page is built from.
 *
 * Centered, framed, scrapbook-warm. These primitives (the paper-bordered Frame,
 * the accent Eyebrow, the centered SectionHeading, the ✦ Fold divider, the
 * little Stamp chips, and the Polaroid photo tile) are reused verbatim across
 * Recipe / Profile / Family / Form / Settings so the five pages are one album.
 * All color comes from tokens; nothing here hardcodes a palette.
 */

/** The signature: content mounted in a paper border, like a print in an album. */
export function Frame({
  children,
  className = "",
  padding = "p-2.5",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-border bg-card ${padding} shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/** Tiny uppercase tracked label in the accent — the recurring eyebrow. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
      {children}
    </span>
  );
}

/** A centered section heading with an optional kicker above it. */
export function SectionHeading({
  kicker,
  children,
  className = "",
}: {
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 text-center ${className}`}>
      {kicker ? <Eyebrow>{kicker}</Eyebrow> : null}
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
        {children}
      </h2>
    </div>
  );
}

/** The fold: a hairline rule parted in the center by a ✦ (a card's seam). */
export function Fold({ ornamentOnly = false }: { ornamentOnly?: boolean }) {
  if (ornamentOnly) {
    return (
      <div className="select-none text-center text-primary/50" aria-hidden>
        ✦
      </div>
    );
  }
  return (
    <div
      className="flex w-full max-w-md items-center gap-3 text-primary/50"
      aria-hidden
    >
      <span className="h-px flex-1 bg-border" />
      <span className="text-sm">✦</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/** A little pressed "stamp" chip — used for stats and counts. */
export function Stamp({
  icon,
  value,
  label,
}: {
  icon?: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex min-w-[5.5rem] flex-col items-center gap-0.5 rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-center">
      <span className="flex items-center gap-1.5 text-2xl font-extrabold tracking-tight text-foreground">
        {icon ? <span className="text-primary">{icon}</span> : null}
        {value}
      </span>
      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** A soft accent chip (specialties, tags, roles). */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
      {children}
    </span>
  );
}

/** A framed photo with a pencilled caption beneath — the album "polaroid". */
export function Polaroid({
  src,
  alt,
  caption,
  sub,
  size = 96,
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  sub?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <figure className="flex flex-col items-center gap-2.5 rounded-[1.5rem] border border-border bg-card p-2.5 shadow-sm">
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.1rem] bg-muted">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
      <figcaption className="flex flex-col items-center pb-1 text-center leading-tight">
        <span className="text-sm font-bold text-foreground">{caption}</span>
        {sub ? (
          <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-primary">
            {sub}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** A round framed avatar (paper ring) — identity anchor on every page. */
export function FramedAvatar({
  src,
  alt,
  size = 112,
  priority = false,
}: {
  src: string;
  alt: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <span
      className="inline-flex shrink-0 rounded-full border border-border bg-card p-1.5 shadow-sm"
      style={{ width: size + 12, height: size + 12 }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    </span>
  );
}

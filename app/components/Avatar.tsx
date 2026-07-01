import Image from "next/image";

/**
 * Round user avatar with an initials fallback.
 *
 * `User.image` is optional (email/password signups have none until OAuth or a
 * future upload provides one), so every avatar in the app renders through
 * this: the photo when there is one, otherwise the first letter of the name
 * on the warm secondary surface.
 *
 * Sizing: pass the display size through `className` (`h-12 w-12`, responsive
 * variants welcome) — it styles both the photo and the fallback identically.
 * `size` only sets the intrinsic next/image dimensions for the photo case.
 */
export default function Avatar({
  name,
  src,
  size,
  className = "",
}: {
  name: string | null | undefined;
  src?: string | null;
  /** Intrinsic image size in px (next/image width/height). */
  size: number;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? ""}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      title={name ?? undefined}
      className={`flex select-none items-center justify-center rounded-full bg-secondary font-bold text-secondary-foreground ${className}`}
    >
      {initial}
    </span>
  );
}

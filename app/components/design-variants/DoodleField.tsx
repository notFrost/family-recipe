import {
  ChefHat,
  Croissant,
  Egg,
  Cookie,
  Carrot,
  Fish,
  Wheat,
  Utensils,
  UtensilsCrossed,
  CakeSlice,
  IceCreamCone,
  Pizza,
  Salad,
  Apple,
  Wine,
  Cherry,
  Soup,
  Coffee,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Rotation cycle of food/kitchen glyphs for the wallpaper scatter. Order only
// affects which icon lands at which index (icons[i % icons.length]); every name
// here is a verified bare export of lucide-react. NOTE: `IceCream` exists too,
// but the cone reads better small, so we use `IceCreamCone` deliberately.
const ICONS: LucideIcon[] = [
  ChefHat,
  Croissant,
  Egg,
  Cookie,
  Carrot,
  Fish,
  Wheat,
  Utensils,
  UtensilsCrossed,
  CakeSlice,
  IceCreamCone,
  Pizza,
  Salad,
  Apple,
  Wine,
  Cherry,
  Soup,
  Coffee,
];

// Deterministic value-noise hash. Identical on server and client for the same
// input, so the scattered layout is pure WITHOUT Math.random/Date.
// Classic GLSL-style fract(sin(n) * C): chaotic but pure, returns 0..1.
const rand = (n: number) => {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
};

// Canonicalize a color to an `rgba(r, g, b, a)` string. The variants pass the
// theme foreground as an 8-digit hex (e.g. "#3e27230A"); the browser
// re-normalizes hex-with-alpha in inline styles, which made server HTML and
// client props disagree and threw React hydration mismatches across every
// variant using this field. Emitting rgba up front — and rounding the numeric
// styles below to fixed precision — keeps the server and client byte-identical.
function toRgba(input: string): string {
  if (!input.startsWith("#")) return input; // already rgb()/rgba()/named
  let hex = input.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  let alpha = 1;
  if (hex.length === 8) {
    alpha = parseInt(hex.slice(6, 8), 16) / 255;
    hex = hex.slice(0, 6);
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(3))})`;
}

/**
 * DoodleField — a faint, full-bleed wallpaper of scattered food icons
 * (WhatsApp-chat-background look). Purely presentational; sits behind content.
 *
 * Every icon's position, size and rotation is a pure function of its index `i`,
 * so the field renders identically on the server and the client (no hydration
 * mismatch). Drive density with `count`; tint with `color` (pass it pre-alpha'd
 * so the layer stays subtle).
 */
export default function DoodleField({
  color,
  count = 340,
}: {
  color: string;
  count?: number;
}) {
  const rgba = toRgba(color);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {Array.from({ length: count }, (_, i) => {
        const Icon = ICONS[i % ICONS.length];
        // Independent hash draws per attribute (different multipliers) so the
        // axes don't correlate into visible diagonal banding. Every value is
        // emitted as a fixed-precision string with explicit units so the server
        // and client serialize identically (hydration-safe).
        const top = (rand(i * 1.1) * 100).toFixed(2);
        const left = (rand(i * 2.7) * 100).toFixed(2);
        const size = (28 + rand(i * 3.3) * 24).toFixed(2); // 28–52px
        const rotate = (-25 + rand(i * 4.9) * 50).toFixed(2); // -25..25deg
        return (
          <Icon
            key={i}
            className="absolute transition-colors duration-300"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              color: rgba,
              transform: `rotate(${rotate}deg)`,
            }}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}

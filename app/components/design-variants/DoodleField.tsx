"use client";

import {
  ChefHat,
  Soup,
  Croissant,
  Pizza,
  CakeSlice,
  UtensilsCrossed,
  Fish,
  Coffee,
  Wine,
  IceCreamCone,
  Salad,
  Donut,
  Apple,
  Cherry,
  Cookie,
  Egg,
  Carrot,
  Wheat,
  Citrus,
  Grape,
  Star,
  Moon,
  Circle,
  Sparkle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useId } from "react";

// Big, recognizable food/kitchen doodles — the "feature" glyphs that sit on a
// lattice with generous padding, like the large items in a WhatsApp wallpaper.
const BIG: LucideIcon[] = [
  ChefHat,
  Soup,
  Croissant,
  Pizza,
  CakeSlice,
  UtensilsCrossed,
  Fish,
  Coffee,
  Wine,
  IceCreamCone,
  Salad,
  Donut,
];

// Small filler doodles that drop into the gaps between the big ones so the
// field reads as fully, evenly covered (the reference's dots/stars/moons).
const FILLER: LucideIcon[] = [
  Apple,
  Cherry,
  Cookie,
  Egg,
  Carrot,
  Wheat,
  Citrus,
  Grape,
  Star,
  Moon,
  Circle,
  Sparkle,
];

// Deterministic value-noise hash (pure → identical on server and client).
const rand = (n: number) => {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
};

// Canonicalize the tint to rgba() so server/client serialize identically (the
// variants pass an 8-digit hex like "#3e27230A"; the browser would otherwise
// re-normalize it and trip React hydration).
function toRgba(input: string): string {
  if (!input.startsWith("#")) return input;
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

const TILE = 264; // repeat unit, in px
const PITCH = 72; // spacing between big doodles ~= big size + ~25px padding

type Slot = {
  x: number;
  y: number;
  size: number;
  rot: number;
  sw: number;
  Icon: LucideIcon;
};

// One tile's worth of doodles: a big lattice (cell centers) + a filler lattice
// (cell corners, i.e. the gaps between the bigs). Order/shape varies by index
// so neighbours differ; jitter + rotation keep it from reading as a rigid grid.
const BASE: Slot[] = (() => {
  const out: Slot[] = [];
  let bi = 0;
  for (let y = PITCH / 2; y < TILE; y += PITCH) {
    for (let x = PITCH / 2; x < TILE; x += PITCH) {
      const size = 32 + rand(bi * 3.1) * 18; // 32–50px
      out.push({
        x: x + (rand(bi * 1.7) - 0.5) * 22,
        y: y + (rand(bi * 2.3) - 0.5) * 22,
        size,
        rot: (rand(bi * 4.4) - 0.5) * 46,
        sw: (1.25 * 24) / size, // constant ~1.25px visual stroke at any size
        Icon: BIG[bi % BIG.length],
      });
      bi++;
    }
  }
  let fi = 0;
  for (let y = 0; y < TILE; y += PITCH) {
    for (let x = 0; x < TILE; x += PITCH) {
      const size = 10 + rand(fi * 3.7 + 9) * 9; // 10–19px
      out.push({
        x: x + (rand(fi * 1.3 + 9) - 0.5) * 18,
        y: y + (rand(fi * 2.9 + 9) - 0.5) * 18,
        size,
        rot: (rand(fi * 5.1 + 9) - 0.5) * 80,
        sw: (1.25 * 24) / size,
        Icon: FILLER[fi % FILLER.length],
      });
      fi++;
    }
  }
  return out;
})();

// Wrap any doodle that crosses a tile edge to the opposite side, so the pattern
// tiles seamlessly — no bald seam gaps, no clipped icons.
const SLOTS: Slot[] = (() => {
  const out: Slot[] = [];
  for (const s of BASE) {
    for (const dx of [-TILE, 0, TILE]) {
      for (const dy of [-TILE, 0, TILE]) {
        const x = s.x + dx;
        const y = s.y + dy;
        const m = s.size;
        if (x > -m && x < TILE + m && y > -m && y < TILE + m) {
          out.push({ ...s, x, y });
        }
      }
    }
  }
  return out;
})();

/**
 * DoodleField — a faint, evenly-packed food-doodle wallpaper (WhatsApp-chat
 * style). Implemented as a single tiled SVG `<pattern>`: big doodles on a
 * lattice with small fillers in the gaps, edge-wrapped so it repeats seamlessly
 * across the whole background. The browser tiles the pattern, so this is one
 * `<svg>` regardless of page height. `color` is the tint (passed pre-alpha'd).
 */
export default function DoodleField({ color }: { color: string }) {
  const rgba = toRgba(color);
  const pid = "dood-" + useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
    >
      <defs>
        <pattern
          id={pid}
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(6)"
        >
          {SLOTS.map((s, i) => {
            const Icon = s.Icon;
            const half = s.size / 2;
            return (
              <g
                key={i}
                transform={`rotate(${s.rot.toFixed(2)} ${s.x.toFixed(2)} ${s.y.toFixed(2)})`}
              >
                <Icon
                  x={Number((s.x - half).toFixed(2))}
                  y={Number((s.y - half).toFixed(2))}
                  width={Number(s.size.toFixed(2))}
                  height={Number(s.size.toFixed(2))}
                  color={rgba}
                  strokeWidth={Number(s.sw.toFixed(2))}
                />
              </g>
            );
          })}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  );
}

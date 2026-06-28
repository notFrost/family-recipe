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

// Big, recognizable food/kitchen doodles on the lattice; small fillers in the gaps.
const BIG: LucideIcon[] = [
  ChefHat, Soup, Croissant, Pizza, CakeSlice, UtensilsCrossed,
  Fish, Coffee, Wine, IceCreamCone, Salad, Donut, Wheat, Grape,
];
// Fillers stay simple/open shapes — the busy ones (wheat, grape) moved to BIG
// so they're only ever drawn large, where they don't turn into dark blobs.
const FILLER: LucideIcon[] = [
  Apple, Cherry, Cookie, Egg, Carrot,
  Citrus, Star, Moon, Circle, Sparkle,
];

// Deterministic value-noise hash (pure → server/client identical).
const rand = (n: number) => {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
};

const TILE = 264;
const PITCH = 72;

type Slot = { x: number; y: number; size: number; rot: number; sw: number; Icon: LucideIcon };

// One tile: a big lattice (cell centers) + a filler lattice (the gaps between).
const BASE: Slot[] = (() => {
  const out: Slot[] = [];
  let bi = 0;
  for (let y = PITCH / 2; y < TILE; y += PITCH) {
    for (let x = PITCH / 2; x < TILE; x += PITCH) {
      const size = 32 + rand(bi * 3.1) * 18;
      out.push({
        x: x + (rand(bi * 1.7) - 0.5) * 22,
        y: y + (rand(bi * 2.3) - 0.5) * 22,
        size,
        rot: (rand(bi * 4.4) - 0.5) * 46,
        sw: (2.25 * 24) / size, // bolder stroke on the big doodles
        Icon: BIG[bi % BIG.length],
      });
      bi++;
    }
  }
  let fi = 0;
  for (let y = 0; y < TILE; y += PITCH) {
    for (let x = 0; x < TILE; x += PITCH) {
      const size = 10 + rand(fi * 3.7 + 9) * 9;
      out.push({
        x: x + (rand(fi * 1.3 + 9) - 0.5) * 18,
        y: y + (rand(fi * 2.9 + 9) - 0.5) * 18,
        size,
        rot: (rand(fi * 5.1 + 9) - 0.5) * 80,
        sw: (1.0 * 24) / size, // thinner so the small fillers don't read too dark
        Icon: FILLER[fi % FILLER.length],
      });
      fi++;
    }
  }
  return out;
})();

// Wrap edge icons to the opposite side so the pattern tiles seamlessly.
const SLOTS: Slot[] = (() => {
  const out: Slot[] = [];
  for (const s of BASE) {
    for (const dx of [-TILE, 0, TILE]) {
      for (const dy of [-TILE, 0, TILE]) {
        const x = s.x + dx;
        const y = s.y + dy;
        const m = s.size;
        if (x > -m && x < TILE + m && y > -m && y < TILE + m) out.push({ ...s, x, y });
      }
    }
  }
  return out;
})();

/**
 * Faint, evenly-packed food-doodle wallpaper — a single tiled SVG `<pattern>`
 * that covers the whole background. Inherits the theme via `currentColor`
 * (`text-foreground`) and is dimmed with opacity, so it adapts to light/dark.
 */
export default function DoodleField({ className = "" }: { className?: string }) {
  const pid = "dood-" + useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none inset-0 z-0 h-full w-full overflow-hidden text-foreground opacity-[0.06] dark:opacity-[0.10] ${className}`}
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
                  color="currentColor"
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

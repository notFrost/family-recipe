import type { VariantRecipe, ViewerRole } from "./mock-data";
import type { VariantMeta } from "./VariantPicker";
import EditorialSpread from "./recipe/EditorialSpread";
import SplitPortrait from "./recipe/SplitPortrait";
import StickyCookRail from "./recipe/StickyCookRail";
import HearthCard from "./recipe/HearthCard";
import ImmersiveOverlap from "./recipe/ImmersiveOverlap";
import CooksTable from "./recipe/CooksTable";

export interface RecipeVariantEntry {
  meta: VariantMeta;
  Component: (props: {
    recipe: VariantRecipe;
    role: ViewerRole;
  }) => React.ReactNode;
}

/**
 * Recipe-page layout variants. Each shares the Warm & Homey design system and
 * the same Actions set — they differ only in structure (position, orientation,
 * shape, size). Add an entry here and it appears in the picker automatically.
 */
export const RECIPE_VARIANTS: RecipeVariantEntry[] = [
  {
    meta: {
      id: "cooks-table",
      name: "Cook's Table",
      tagline:
        "Leads with the person, not the plate (from feedback): a cook spotlight — large avatar + prominent name + lineage — opens the page, and the recipe's story gets its own featured 'note from the cook'. Builds familiarity and a personal bond.",
    },
    Component: CooksTable,
  },
  {
    meta: {
      id: "editorial",
      name: "Editorial Spread",
      tagline:
        "A cinematic full-bleed hero carries the title and author as an overlay; Actions dock beneath it; a narrow ingredients rail sits beside wide, numbered steps. Reads like a magazine opener.",
    },
    Component: EditorialSpread,
  },
  {
    meta: {
      id: "split-portrait",
      name: "Split Portrait",
      tagline:
        "Stands the photo up: a tall 4:5 poster on the left gives the dish presence while all the context — title, meta tiles, and an inline Action row — sits in a calm column on the right. Ingredients and steps share an even split below.",
    },
    Component: SplitPortrait,
  },
  {
    meta: {
      id: "cook-rail",
      name: "Sticky Cook-Rail",
      tagline:
        "Built for actually cooking: a sticky left rail keeps the photo, meta, cook's note, and the full Action stack in reach while only the method scrolls. Ingredients are a two-up checklist; steps are numbered cards.",
    },
    Component: StickyCookRail,
  },
  {
    meta: {
      id: "hearth-card",
      name: "Hearth Card",
      tagline:
        "A narrow, centered, symmetric column that reads like a treasured recipe card — framed photo, centered title with a compact Action icon row, a two-column ingredient checklist, and numbered steps. Cozy and contained.",
    },
    Component: HearthCard,
  },
  {
    meta: {
      id: "immersive-overlap",
      name: "Immersive Overlap",
      tagline:
        "App-like: a cinematic 16:9 hero with a content card lifted over its edge, a flick-through stat strip, and a floating Action dock pinned to the bottom of the viewport so actions are always one tap away.",
    },
    Component: ImmersiveOverlap,
  },
];

import type { VariantFamily } from "./mock-data";
import type { VariantMeta } from "./VariantPicker";
import HearthTable from "./family/HearthTable";
import CookbookSpine from "./family/CookbookSpine";

export interface FamilyVariantEntry {
  meta: VariantMeta;
  Component: (props: { family: VariantFamily }) => React.ReactNode;
}

/**
 * Family-page (the `/families/[id]` view) layout variants. Same design system;
 * they differ in how the people, the invite, and the shared recipes are
 * arranged. Add an entry to show it in the picker.
 */
export const FAMILY_VARIANTS: FamilyVariantEntry[] = [
  {
    meta: {
      id: "hearth-table",
      name: "Hearth Table",
      tagline:
        "Leads with the people: a warm header band with an overlapping avatar cluster and the member count as x / y, the invite link beneath, then the shared recipes. Social and welcoming.",
    },
    Component: HearthTable,
  },
  {
    meta: {
      id: "cookbook-spine",
      name: "Cookbook Spine",
      tagline:
        "The family as a bound cookbook: a sticky left 'spine' (crest, member roll, count, invite) stays in view while the recipes fill the right like pages. Built for big collections.",
    },
    Component: CookbookSpine,
  },
];

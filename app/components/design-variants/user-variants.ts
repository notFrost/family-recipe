import type { VariantProfile } from "./mock-data";
import type { VariantMeta } from "./VariantPicker";
import CoverBanner from "./user/CoverBanner";
import MagazineMasthead from "./user/MagazineMasthead";
import ProfileRail from "./user/ProfileRail";
import CenteredHero from "./user/CenteredHero";

export interface UserVariantEntry {
  meta: VariantMeta;
  Component: (props: { profile: VariantProfile }) => React.ReactNode;
}

/**
 * User-page (public profile) layout variants. Same design system; they differ
 * in how identity, stats, and the recipe grid are arranged. Add an entry to
 * show it in the picker.
 */
export const USER_VARIANTS: UserVariantEntry[] = [
  {
    meta: {
      id: "cover-banner",
      name: "Cover Banner",
      tagline:
        "A wide cover photo with the avatar overlapping its lower edge — the familiar social masthead. Identity and stats sit on the page surface above the recipe grid.",
    },
    Component: CoverBanner,
  },
  {
    meta: {
      id: "magazine-masthead",
      name: "Magazine Masthead",
      tagline:
        "An editorial layout: a horizontal masthead band introduces the cook, a large two-column 'lead story' features their best dish, then a 'More from…' gallery holds the rest.",
    },
    Component: MagazineMasthead,
  },
  {
    meta: {
      id: "profile-rail",
      name: "Profile Rail",
      tagline:
        "A sticky identity rail pins beside the recipes as you scroll — avatar, bio, and a vertical stat ledger stay in view while a two-up recipe grid passes by on the right.",
    },
    Component: ProfileRail,
  },
  {
    meta: {
      id: "centered-hero",
      name: "Centered Hero",
      tagline:
        "A quiet, symmetric masthead with no cover photo — avatar, name, bio, and stat pills stack down a centered column, then a labelled divider hands off to the recipe grid as the real hero.",
    },
    Component: CenteredHero,
  },
];

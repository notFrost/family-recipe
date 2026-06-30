import type { PageKey } from "./styles-meta";
import { mockRecipe, mockProfile } from "./mock-data";
import CooksTable from "./recipe/CooksTable";
import StickyCookRail from "./recipe/StickyCookRail";
import CoverBanner from "./user/CoverBanner";
import ProfileRail from "./user/ProfileRail";
import Placeholder from "./Placeholder";

/**
 * Style registry: maps a style + page to the component that renders it.
 *
 * Page components are self-contained (they pull their own mock data), so the
 * route just renders `getPage(style, page)`. Pages not yet designed fall back
 * to a Placeholder, so the harness always builds while a style fills in.
 */
type PageComponent = () => React.ReactNode;

const ph =
  (page: string, style: string): PageComponent =>
  () => <Placeholder page={page} style={style} />;

const STYLE_PAGES: Record<string, Partial<Record<PageKey, PageComponent>>> = {
  homestead: {
    recipe: () => <CooksTable recipe={mockRecipe} role="owner" />,
    profile: () => <CoverBanner profile={mockProfile} />,
    family: ph("Family", "Homestead"),
    form: ph("New recipe", "Homestead"),
    settings: ph("Settings", "Homestead"),
  },
  atelier: {
    recipe: () => <StickyCookRail recipe={mockRecipe} role="owner" />,
    profile: () => <ProfileRail profile={mockProfile} />,
    family: ph("Family", "Atelier"),
    form: ph("New recipe", "Atelier"),
    settings: ph("Settings", "Atelier"),
  },
  keepsake: {
    recipe: ph("Recipe", "Keepsake"),
    profile: ph("Profile", "Keepsake"),
    family: ph("Family", "Keepsake"),
    form: ph("New recipe", "Keepsake"),
    settings: ph("Settings", "Keepsake"),
  },
};

export function getPage(
  styleId: string,
  page: PageKey,
): PageComponent | null {
  return STYLE_PAGES[styleId]?.[page] ?? null;
}

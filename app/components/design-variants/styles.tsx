import type { PageKey } from "./styles-meta";
import { mockRecipe, mockProfile } from "./mock-data";
import CooksTable from "./recipe/CooksTable";
import StickyCookRail from "./recipe/StickyCookRail";
import CoverBanner from "./user/CoverBanner";
import ProfileRail from "./user/ProfileRail";
import HomesteadFamily from "./styles/homestead/Family";
import HomesteadForm from "./styles/homestead/Form";
import HomesteadSettings from "./styles/homestead/Settings";
import AtelierFamily from "./styles/atelier/Family";
import AtelierForm from "./styles/atelier/Form";
import AtelierSettings from "./styles/atelier/Settings";
import KeepsakeRecipe from "./styles/keepsake/Recipe";
import KeepsakeProfile from "./styles/keepsake/Profile";
import KeepsakeFamily from "./styles/keepsake/Family";
import KeepsakeForm from "./styles/keepsake/Form";
import KeepsakeSettings from "./styles/keepsake/Settings";

/**
 * Style registry: maps a style + page to the component that renders it.
 *
 * Page components are self-contained (they pull their own mock data), so the
 * route just renders `getPage(style, page)`. Pages not yet designed fall back
 * to a Placeholder, so the harness always builds while a style fills in.
 */
type PageComponent = () => React.ReactNode;

const STYLE_PAGES: Record<string, Partial<Record<PageKey, PageComponent>>> = {
  homestead: {
    recipe: () => <CooksTable recipe={mockRecipe} role="owner" />,
    profile: () => <CoverBanner profile={mockProfile} />,
    family: () => <HomesteadFamily />,
    form: () => <HomesteadForm />,
    settings: () => <HomesteadSettings />,
  },
  atelier: {
    recipe: () => <StickyCookRail recipe={mockRecipe} role="owner" />,
    profile: () => <ProfileRail profile={mockProfile} />,
    family: () => <AtelierFamily />,
    form: () => <AtelierForm />,
    settings: () => <AtelierSettings />,
  },
  keepsake: {
    recipe: () => <KeepsakeRecipe />,
    profile: () => <KeepsakeProfile />,
    family: () => <KeepsakeFamily />,
    form: () => <KeepsakeForm />,
    settings: () => <KeepsakeSettings />,
  },
};

export function getPage(
  styleId: string,
  page: PageKey,
): PageComponent | null {
  return STYLE_PAGES[styleId]?.[page] ?? null;
}

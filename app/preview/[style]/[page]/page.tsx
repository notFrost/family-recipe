import { notFound } from "next/navigation";
import { getPage } from "@/app/components/design-variants/styles";
import type { PageKey } from "@/app/components/design-variants/styles-meta";

const VALID_PAGES: PageKey[] = [
  "recipe",
  "profile",
  "family",
  "form",
  "settings",
];

export default async function PreviewStylePage({
  params,
}: {
  params: Promise<{ style: string; page: string }>;
}) {
  const { style, page } = await params;
  if (!VALID_PAGES.includes(page as PageKey)) notFound();

  // The registry entries are render thunks (() => ReactNode), not component
  // types — call one to get its element instead of minting a new component
  // type per render (which would reset state on every navigation).
  const renderPage = getPage(style, page as PageKey);
  if (!renderPage) notFound();

  return renderPage();
}

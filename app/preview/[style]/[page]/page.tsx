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

  const Component = getPage(style, page as PageKey);
  if (!Component) notFound();

  return <Component />;
}

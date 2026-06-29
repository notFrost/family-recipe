"use client";

import { useState } from "react";
import DoodleField from "@/app/components/DoodleField";
import { VariantPicker } from "@/app/components/design-variants/VariantPicker";
import { RECIPE_VARIANTS } from "@/app/components/design-variants/recipe-variants";
import { mockRecipe, type ViewerRole } from "@/app/components/design-variants/mock-data";

export default function RecipePreviewPage() {
  const [index, setIndex] = useState(0);
  const [role, setRole] = useState<ViewerRole>("owner");

  const entry = RECIPE_VARIANTS[Math.min(index, RECIPE_VARIANTS.length - 1)];
  const Active = entry.Component;

  return (
    <>
      <DoodleField className="fixed" />
      <VariantPicker
        kind="recipe"
        variants={RECIPE_VARIANTS.map((v) => v.meta)}
        activeIndex={index}
        onSelect={setIndex}
        role={role}
        onRoleChange={setRole}
      />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Active recipe={mockRecipe} role={role} />
      </main>
    </>
  );
}

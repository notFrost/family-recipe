"use client";

import { useState } from "react";
import DoodleField from "@/app/components/DoodleField";
import { VariantPicker } from "@/app/components/design-variants/VariantPicker";
import { FAMILY_VARIANTS } from "@/app/components/design-variants/family-variants";
import { mockFamily } from "@/app/components/design-variants/mock-data";

export default function FamilyPreviewPage() {
  const [index, setIndex] = useState(0);

  const entry = FAMILY_VARIANTS[Math.min(index, FAMILY_VARIANTS.length - 1)];
  const Active = entry.Component;

  return (
    <>
      <DoodleField className="fixed" />
      <VariantPicker
        kind="family"
        variants={FAMILY_VARIANTS.map((v) => v.meta)}
        activeIndex={index}
        onSelect={setIndex}
      />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Active family={mockFamily} />
      </main>
    </>
  );
}

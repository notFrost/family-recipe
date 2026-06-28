"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Recipe } from "../lib/types";

interface RecipeFormProps {
  /** When present, the form is in edit mode and pre-fills its fields. */
  initialRecipe?: Recipe;
  /**
   * Server action invoked on submit. Receives the form data and is
   * responsible for persisting + redirecting.
   */
  action: (formData: FormData) => void | Promise<void>;
  /** Label for the primary submit button. */
  submitLabel: string;
  /** Where the cancel link points. */
  cancelHref: string;
  /** User's families, for the FAMILY visibility picker. */
  families?: { id: string; name: string }[];
  /** Pre-select a family when arriving from a family page. */
  initialFamilyId?: string;
}

const inputClasses =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";

const labelClasses = "text-sm font-medium text-foreground";

const minorButtonClasses =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const addButtonClasses =
  "self-start rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function looksLikeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function RecipeForm({
  initialRecipe,
  action,
  submitLabel,
  cancelHref,
  families = [],
  initialFamilyId,
}: RecipeFormProps) {
  const [imageUrl, setImageUrl] = useState(initialRecipe?.imageUrl ?? "");
  const [ingredients, setIngredients] = useState<string[]>(
    initialRecipe?.ingredients.length ? initialRecipe.ingredients : [""],
  );
  const [steps, setSteps] = useState<string[]>(
    initialRecipe?.steps.length ? initialRecipe.steps : [""],
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const [visibility, setVisibility] = useState<string>(
    initialRecipe?.visibility ?? "PRIVATE",
  );

  // Resolve the effective initial family id: pre-select from the prop, the
  // recipe's familyId (edit mode), or leave empty.
  const effectiveInitialFamilyId =
    initialFamilyId ?? initialRecipe?.familyId ?? "";

  const [familyId, setFamilyId] = useState(effectiveInitialFamilyId);

  function updateListItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addListItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setter((prev) => [...prev, ""]);
  }

  function removeListItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) {
    setter((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  /**
   * Client-side validation. Returns true when the form may be submitted.
   * We let the native `action` proceed only after this passes.
   */
  function validate(formData: FormData): boolean {
    const nextErrors: string[] = [];

    const title = (formData.get("title") as string | null)?.trim() ?? "";
    if (title.length === 0) {
      nextErrors.push("Title is required.");
    }

    const filledIngredients = formData
      .getAll("ingredients")
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
    if (filledIngredients.length === 0) {
      nextErrors.push("Add at least one ingredient.");
    }

    const filledSteps = formData
      .getAll("steps")
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
    if (filledSteps.length === 0) {
      nextErrors.push("Add at least one step.");
    }

    const vis = (formData.get("visibility") as string | null)?.trim() ?? "";
    const validVisibilities = ["PRIVATE", "PUBLIC", "UNLISTED", "FAMILY"];
    if (!validVisibilities.includes(vis)) {
      nextErrors.push("Select a valid visibility.");
    }

    // When FAMILY is selected, a family must be chosen.
    if (vis === "FAMILY") {
      const fid = (formData.get("familyId") as string | null)?.trim() ?? "";
      if (fid.length === 0) {
        nextErrors.push("Select a family when visibility is set to Family.");
      }
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  }

  const showPreview = looksLikeUrl(imageUrl) && !imagePreviewFailed;

  return (
    <form
      action={action}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        if (!validate(formData)) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-8"
    >
      {errors.length > 0 ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <ul className="list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className={labelClasses}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initialRecipe?.title ?? ""}
          placeholder="e.g. Roasted Tomato Soup"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="imageUrl" className={labelClasses}>
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setImagePreviewFailed(false);
          }}
          placeholder="https://images.unsplash.com/..."
          className={inputClasses}
        />
        {showPreview ? (
          <div className="relative mt-2 aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={imageUrl}
              alt="Image preview"
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-cover"
              onError={() => setImagePreviewFailed(true)}
              unoptimized
            />
          </div>
        ) : null}
        {looksLikeUrl(imageUrl) && imagePreviewFailed ? (
          <p className="text-xs text-muted-foreground">
            Couldn&apos;t load a preview for that URL.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialRecipe?.description ?? ""}
          placeholder="A short summary of the dish."
          className={`${inputClasses} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="minutes" className={labelClasses}>
          Total time (minutes)
        </label>
        <input
          id="minutes"
          name="minutes"
          type="number"
          min={0}
          defaultValue={initialRecipe?.minutes ?? ""}
          placeholder="e.g. 45"
          className={`${inputClasses} max-w-[10rem]`}
        />
        <p className="text-xs text-muted-foreground">
          Optional — shown as a quick badge on the recipe card.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="visibility" className={labelClasses}>
          Visibility
        </label>
        <select
          id="visibility"
          name="visibility"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
          className={inputClasses}
        >
          <option value="PRIVATE">Private</option>
          <option value="PUBLIC">Public</option>
          <option value="UNLISTED">Unlisted</option>
          <option value="FAMILY" disabled={families.length === 0}>
            Family
          </option>
        </select>
        <p className="text-xs text-muted-foreground">
          Private &mdash; only you. Public &mdash; shown on Discover. Unlisted
          &mdash; viewable by link, not listed. Family &mdash; visible to
          members of a family.
        </p>
      </div>

      {visibility === "FAMILY" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="familyId" className={labelClasses}>
            Family
          </label>
          <select
            id="familyId"
            name="familyId"
            value={familyId}
            onChange={(event) => setFamilyId(event.target.value)}
            required
            className={inputClasses}
          >
            <option value="" disabled>
              Select a family…
            </option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <fieldset className="flex flex-col gap-3">
        <legend className={`${labelClasses} mb-1`}>Ingredients</legend>
        <div className="flex flex-col gap-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                name="ingredients"
                type="text"
                value={ingredient}
                onChange={(event) =>
                  updateListItem(setIngredients, index, event.target.value)
                }
                placeholder={`Ingredient ${index + 1}`}
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => removeListItem(setIngredients, index)}
                disabled={ingredients.length === 1}
                aria-label={`Remove ingredient ${index + 1}`}
                className={minorButtonClasses}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem(setIngredients)}
          className={addButtonClasses}
        >
          + Add ingredient
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className={`${labelClasses} mb-1`}>Steps</legend>
        <div className="flex flex-col gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <textarea
                name="steps"
                rows={2}
                value={step}
                onChange={(event) =>
                  updateListItem(setSteps, index, event.target.value)
                }
                placeholder={`Step ${index + 1}`}
                className={`${inputClasses} resize-y`}
              />
              <button
                type="button"
                onClick={() => removeListItem(setSteps, index)}
                disabled={steps.length === 1}
                aria-label={`Remove step ${index + 1}`}
                className={`${minorButtonClasses} mt-1`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem(setSteps)}
          className={addButtonClasses}
        >
          + Add step
        </button>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

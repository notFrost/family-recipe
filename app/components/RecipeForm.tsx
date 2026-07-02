"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Clock, Globe, Plus, X } from "lucide-react";
import type { Recipe } from "../lib/types";

interface RecipeFormProps {
  /** When present, the form is in edit mode and pre-fills its fields. */
  initialRecipe?: Recipe;
  /**
   * Create-mode prefills (e.g. from the video import) — ignored in edit
   * mode. Strings are already sanitized/capped by the caller.
   */
  initialDraft?: { title?: string; imageUrl?: string; description?: string };
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

// Homestead field treatment: bold labels, the shared rounded-xl inputs.
const inputClasses =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";

const labelClasses = "text-sm font-bold text-foreground";

const minorButtonClasses =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const addButtonClasses =
  "self-start rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
  initialDraft,
  action,
  submitLabel,
  cancelHref,
  families = [],
  initialFamilyId,
}: RecipeFormProps) {
  // Edit mode wins; the draft only seeds a fresh form.
  const draft = initialRecipe ? undefined : initialDraft;
  const [imageUrl, setImageUrl] = useState(
    initialRecipe?.imageUrl ?? draft?.imageUrl ?? "",
  );
  const [ingredients, setIngredients] = useState<string[]>(
    initialRecipe?.ingredients.length ? initialRecipe.ingredients : [""],
  );
  const [steps, setSteps] = useState<string[]>(
    initialRecipe?.steps.length ? initialRecipe.steps : [""],
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  // Arriving from "Add recipe to this family" hands us a familyId — honor the
  // intent by defaulting visibility to FAMILY so the picker is visible and
  // pre-filled (it used to stay on PRIVATE, silently dropping the family).
  const [visibility, setVisibility] = useState<string>(
    initialRecipe?.visibility ?? (initialFamilyId ? "FAMILY" : "PRIVATE"),
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
          className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
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
          defaultValue={initialRecipe?.title ?? draft?.title ?? ""}
          placeholder="e.g. Roasted Tomato Soup"
          className={`${inputClasses} text-base font-semibold`}
        />
      </div>

      {/* Photo — the image well leads like the recipe hero; the URL input
          feeds it and the preview fills the big rounded frame. */}
      <div className="flex flex-col gap-2">
        <label htmlFor="imageUrl" className={labelClasses}>
          Photo
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
          <div className="relative mt-2 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-md">
            <Image
              src={imageUrl}
              alt="Image preview"
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
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
        <p className="text-xs text-muted-foreground">
          A bright, close-up photo makes a recipe twice as tempting on
          Discover.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialRecipe?.description ?? draft?.description ?? ""}
          placeholder="A short summary of the dish."
          className={`${inputClasses} resize-y`}
        />
      </div>

      {/* Total time + visibility, side by side on wider screens. */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="minutes" className={labelClasses}>
            Total time
          </label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="minutes"
              name="minutes"
              type="number"
              min={0}
              defaultValue={initialRecipe?.minutes ?? ""}
              placeholder="45"
              className={`${inputClasses} pl-10 pr-14`}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              min
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Optional — shown as a quick badge on the recipe card.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="visibility" className={labelClasses}>
            Who can see it
          </label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              id="visibility"
              name="visibility"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
              className={`${inputClasses} cursor-pointer appearance-none pl-10 pr-10`}
            >
              <option value="PRIVATE">Private — only you</option>
              <option value="PUBLIC">Public — shown on Discover</option>
              <option value="UNLISTED">Unlisted — anyone with the link</option>
              <option value="FAMILY" disabled={families.length === 0}>
                Family — your family kitchen
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {visibility === "FAMILY" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="familyId" className={labelClasses}>
            Family
          </label>
          <div className="relative">
            <select
              id="familyId"
              name="familyId"
              value={familyId}
              onChange={(event) => setFamilyId(event.target.value)}
              required
              className={`${inputClasses} cursor-pointer appearance-none pr-10`}
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
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
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
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem(setIngredients)}
          className={addButtonClasses}
        >
          <Plus className="-ml-0.5 mr-1 inline h-4 w-4 align-text-bottom" />
          Add ingredient
        </button>
      </fieldset>

      {/* Steps — numbered badges identical to the recipe page's method. */}
      <fieldset className="flex flex-col gap-3">
        <legend className={`${labelClasses} mb-1`}>Method</legend>
        <div className="flex flex-col gap-2.5">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
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
                className={`${inputClasses} resize-y leading-relaxed`}
              />
              <button
                type="button"
                onClick={() => removeListItem(setSteps, index)}
                disabled={steps.length === 1}
                aria-label={`Remove step ${index + 1}`}
                className={`${minorButtonClasses} mt-1`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem(setSteps)}
          className={addButtonClasses}
        >
          <Plus className="-ml-0.5 mr-1 inline h-4 w-4 align-text-bottom" />
          Add step
        </button>
      </fieldset>

      {/* Submit — the primary pill, matching every other Homestead page. */}
      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
        <Link
          href={cancelHref}
          className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-7"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

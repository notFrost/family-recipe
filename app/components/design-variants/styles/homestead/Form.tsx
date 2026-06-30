import Image from "next/image";
import {
  ArrowLeft,
  ImagePlus,
  Clock,
  BookHeart,
  Plus,
  X,
  GripVertical,
  Globe,
  ChevronDown,
} from "lucide-react";
import { mockRecipe } from "../../mock-data";

/**
 * Homestead — New recipe page.
 *
 * The same front-loaded column as the recipe page, in reverse: instead of
 * reading a finished dish you build one. A big rounded-3xl image well leads
 * (here pre-filled with a preview, the way the recipe hero looks), then the
 * fields flow straight down one warm column — title and description up top,
 * the two optional "soul" fields (where it came from, the story) given a warm
 * featured panel so they read as invitations rather than chores, and the
 * ingredients/steps lists styled to echo the recipe page's method cards.
 *
 * Static/visual: a styled preview of the form in the Homestead language, not a
 * working form — inputs carry no handlers.
 */

// Canonical app input styling (from RecipeForm), kept identical so the
// exploration matches the real form's field treatment.
const inputClasses =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring";
const labelClasses = "text-sm font-bold text-foreground";

export default function HomesteadForm() {
  // A couple of pre-filled list rows so the layout reads like a real draft.
  const draftIngredients = mockRecipe.ingredients.slice(0, 3);
  const draftSteps = mockRecipe.steps.slice(0, 2);

  return (
    <form className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to your kitchen
      </button>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          New recipe
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Write it down before
          <br className="hidden sm:block" /> you forget it
        </h1>
      </div>

      {/* Image well — leads the column, matching the recipe hero's shape.
          Pre-filled here; the dashed overlay shows the swap affordance. */}
      <div className="flex flex-col gap-2">
        <label className={labelClasses}>Photo</label>
        <button
          type="button"
          className="group relative block aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted text-left shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Image
            src={mockRecipe.imageUrl}
            alt="Recipe photo preview"
            fill
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm backdrop-blur-md">
            <ImagePlus className="h-4 w-4" />
            Change photo
          </span>
        </button>
        <p className="text-xs text-muted-foreground">
          A bright, close-up photo makes a recipe twice as tempting on Discover.
        </p>
      </div>

      {/* Title. */}
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className={labelClasses}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={mockRecipe.title}
          placeholder="e.g. Roasted Tomato Soup"
          className={`${inputClasses} text-base font-semibold`}
        />
      </div>

      {/* Description. */}
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={mockRecipe.description}
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
              defaultValue={mockRecipe.totalMinutes}
              placeholder="45"
              className={`${inputClasses} pl-10 pr-14`}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              min
            </span>
          </div>
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
              defaultValue="FAMILY"
              className={`${inputClasses} cursor-pointer appearance-none pl-10 pr-10`}
            >
              <option value="PRIVATE">Private — only you</option>
              <option value="PUBLIC">Public — shown on Discover</option>
              <option value="UNLISTED">Unlisted — anyone with the link</option>
              <option value="FAMILY">Family — your family kitchen</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* The "soul" fields — warm featured panel, the signature device shared
          with the recipe page's story card. Clearly optional. */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
        <BookHeart
          className="pointer-events-none absolute -right-3 top-3 h-24 w-24 -rotate-6 text-primary/10"
          aria-hidden
        />
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <BookHeart className="h-4 w-4 text-primary" />
            The story behind it
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-secondary-foreground">
              Optional
            </span>
          </span>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            The part that makes it yours — who you got it from, the memory it
            carries. Skip it if you like; you can always add it later.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="sourceName" className={labelClasses}>
              Originally from
            </label>
            <input
              id="sourceName"
              name="sourceName"
              type="text"
              defaultValue={mockRecipe.sourceName ?? ""}
              placeholder="e.g. Grandma Nkechi"
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="story" className={labelClasses}>
              The story
            </label>
            <textarea
              id="story"
              name="story"
              rows={4}
              defaultValue={mockRecipe.story ?? ""}
              placeholder="Where does this dish come from? When do you make it?"
              className={`${inputClasses} resize-y leading-relaxed`}
            />
          </div>
        </div>
      </section>

      {/* Ingredients — rows echo the recipe page's list treatment. */}
      <fieldset className="flex flex-col gap-3">
        <legend className={`${labelClasses} mb-1`}>Ingredients</legend>
        <div className="flex flex-col gap-2">
          {draftIngredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="hidden text-muted-foreground sm:flex" aria-hidden>
                <GripVertical className="h-4 w-4" />
              </span>
              <input
                type="text"
                defaultValue={ing.amount}
                placeholder="250 g"
                aria-label={`Ingredient ${i + 1} amount`}
                className={`${inputClasses} max-w-[7rem] font-semibold`}
              />
              <input
                type="text"
                defaultValue={ing.item}
                placeholder={`Ingredient ${i + 1}`}
                aria-label={`Ingredient ${i + 1}`}
                className={inputClasses}
              />
              <button
                type="button"
                aria-label={`Remove ingredient ${i + 1}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="self-start rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus className="-ml-0.5 mr-1 inline h-4 w-4 align-text-bottom" />
          Add ingredient
        </button>
      </fieldset>

      {/* Steps — numbered badges identical to the recipe page's method. */}
      <fieldset className="flex flex-col gap-3">
        <legend className={`${labelClasses} mb-1`}>Method</legend>
        <div className="flex flex-col gap-2.5">
          {draftSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <textarea
                rows={2}
                defaultValue={step}
                placeholder={`Step ${i + 1}`}
                aria-label={`Step ${i + 1}`}
                className={`${inputClasses} resize-y leading-relaxed`}
              />
              <button
                type="button"
                aria-label={`Remove step ${i + 1}`}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="self-start rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus className="-ml-0.5 mr-1 inline h-4 w-4 align-text-bottom" />
          Add step
        </button>
      </fieldset>

      {/* Submit — the primary pill, matching every other Homestead page. */}
      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-7"
        >
          Create recipe
        </button>
      </div>
    </form>
  );
}

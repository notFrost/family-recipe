import { ImageResponse } from "next/og";
import { recipeRepository } from "@/app/lib/recipe-repository";
import { getSession } from "@/app/lib/auth";
import { canViewRecipe } from "@/app/lib/recipe-access";

/**
 * Branded share-card PNG for a recipe — 1080×1350 (4:5), sized for stories,
 * chats, and family groups. Lightly branded (Amber palette + wordmark strip)
 * so a shared card markets the app while staying genuinely useful.
 *
 * SECURITY: gated by the same canViewRecipe as the page — a PRIVATE/FAMILY
 * recipe's card is exactly as private as the recipe itself.
 *
 * Satori supports flexbox only: every multi-child element declares
 * display:flex explicitly.
 */

// Amber light palette, hardcoded — CSS custom properties don't exist in the
// ImageResponse renderer.
const C = {
  bg: "#fffaf3",
  ink: "#3e2723",
  muted: "#8a6f5c",
  amber: "#d97706",
  amberDark: "#b45309",
  card: "#ffffff",
  border: "#f1e2d0",
};

function PotMark({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13h16" />
      <path d="M5 13v1.5a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5V13" />
      <path d="M8 9.8c1.2-1.2 1.2-3 0-4.2" />
      <path d="M12.2 9.8c1-1 1-2.4 0-3.4" />
      <path d="M16.2 9.8c.8-.8.8-1.8 0-2.6" />
    </svg>
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const recipe = await recipeRepository.getRecipeById(id);
  if (!recipe) {
    return new Response("Not found", { status: 404 });
  }

  const session = await getSession();
  if (!(await canViewRecipe(recipe, session?.user?.id))) {
    // Same shape as the page's notFound — don't confirm existence.
    return new Response("Not found", { status: 404 });
  }

  const shownIngredients = recipe.ingredients.slice(0, 6);
  const moreIngredients = recipe.ingredients.length - shownIngredients.length;
  const titleSize = recipe.title.length > 42 ? 52 : 64;

  const stats = [
    recipe.minutes != null ? `${recipe.minutes} min` : null,
    `${recipe.ingredients.length} ${recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}`,
    `${recipe.steps.length} ${recipe.steps.length === 1 ? "step" : "steps"}`,
  ].filter(Boolean) as string[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.bg,
        }}
      >
        {/* Hero photo band. An empty imageUrl (the form allows it) throws
            inside ImageResponse — fall back to a warm brand band instead. */}
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.imageUrl}
            alt=""
            width={1080}
            height={480}
            style={{ width: 1080, height: 480, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 1080,
              height: 480,
              backgroundColor: "#fdecd8",
            }}
          >
            <PotMark size={160} color={C.amber} />
          </div>
        )}

        {/* Body. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            padding: "48px 64px 32px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 6,
              color: C.amber,
            }}
          >
            {(recipe.authorName
              ? `FROM THE KITCHEN OF ${recipe.authorName}`
              : "A FAMILY RECIPE"
            ).toUpperCase()}
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: titleSize,
              fontWeight: 800,
              color: C.ink,
              lineHeight: 1.05,
            }}
          >
            {recipe.title}
          </div>

          {/* Stats row. */}
          <div
            style={{
              display: "flex",
              marginTop: 22,
              gap: 14,
            }}
          >
            {stats.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  fontSize: 26,
                  fontWeight: 700,
                  color: C.amberDark,
                  backgroundColor: "#fdecd8",
                  borderRadius: 999,
                  padding: "8px 22px",
                }}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Ingredients preview card. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 30,
              backgroundColor: C.card,
              border: `2px solid ${C.border}`,
              borderRadius: 28,
              padding: "26px 34px",
              flexGrow: 1,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 4,
                color: C.muted,
              }}
            >
              INGREDIENTS
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 10,
              }}
            >
              {shownIngredients.map((ing, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 28,
                    color: C.ink,
                    padding: "7px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: C.amber,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      maxWidth: 880,
                      overflow: "hidden",
                    }}
                  >
                    {ing.length > 60 ? `${ing.slice(0, 57)}…` : ing}
                  </div>
                </div>
              ))}
              {moreIngredients > 0 ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: 26,
                    fontWeight: 700,
                    color: C.muted,
                    padding: "10px 0 0 24px",
                  }}
                >
                  + {moreIngredients} more — full recipe in the app
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Brand strip. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: C.amber,
            padding: "22px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <PotMark size={44} color="#ffffff" />
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Family Recipe
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#fff7ed" }}>
            Every dish has a story.
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 },
  );
}

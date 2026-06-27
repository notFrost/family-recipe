"use client";

import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter } from "next/font/google";
import { Search } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface MockRecipe {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  steps: string[];
  authorId: string;
  authorName: string;
}

const recipes: MockRecipe[] = [
  {
    id: "recipe-1",
    title: "Margherita Pizza",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop",
    description:
      "A classic Neapolitan pizza with a blistered crust, San Marzano tomatoes, fresh mozzarella, and basil.",
    ingredients: [
      "250g pizza dough",
      "80g San Marzano tomato sauce",
      "125g fresh mozzarella, torn",
      "Fresh basil leaves",
      "2 tbsp extra-virgin olive oil",
      "Sea salt to taste",
    ],
    steps: [
      "Preheat your oven (and pizza stone if available) to its highest setting, around 250°C.",
      "Stretch the dough into a 12-inch round on a floured surface.",
      "Spread the tomato sauce evenly, leaving a border for the crust.",
      "Distribute the mozzarella and drizzle with olive oil.",
      "Bake for 8-10 minutes until the crust is golden and the cheese bubbles.",
      "Top with fresh basil and a pinch of sea salt before serving.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
  {
    id: "recipe-2",
    title: "Spaghetti Carbonara",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop",
    description:
      "A creamy Roman pasta made with eggs, Pecorino Romano, guanciale, and plenty of black pepper.",
    ingredients: [
      "400g spaghetti",
      "150g guanciale, diced",
      "4 large egg yolks",
      "60g Pecorino Romano, grated",
      "Freshly ground black pepper",
      "Salt for the pasta water",
    ],
    steps: [
      "Boil the spaghetti in well-salted water until al dente.",
      "Crisp the guanciale in a dry pan over medium heat.",
      "Whisk egg yolks with the Pecorino and a generous amount of black pepper.",
      "Toss the drained pasta with the guanciale, then remove from heat.",
      "Stir in the egg mixture with a splash of pasta water to form a silky sauce.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
  {
    id: "recipe-3",
    title: "Chicken Tikka Masala",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop",
    description:
      "Tender marinated chicken simmered in a spiced, creamy tomato curry sauce.",
    ingredients: [
      "500g chicken thighs, cubed",
      "200g plain yogurt",
      "2 tbsp tikka masala spice blend",
      "400g crushed tomatoes",
      "150ml heavy cream",
      "1 onion, finely chopped",
      "3 garlic cloves, minced",
      "1 tbsp grated ginger",
    ],
    steps: [
      "Marinate the chicken in yogurt and half the spice blend for at least 1 hour.",
      "Sear the chicken until browned, then set aside.",
      "Sauté the onion, garlic, and ginger until soft and fragrant.",
      "Add the remaining spices and crushed tomatoes; simmer for 15 minutes.",
      "Stir in the cream and return the chicken to the pan.",
      "Simmer until the chicken is cooked through and the sauce thickens.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
  {
    id: "recipe-4",
    title: "Beef Tacos",
    imageUrl:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80&auto=format&fit=crop",
    description:
      "Seasoned ground beef in warm corn tortillas topped with crisp lettuce, cheese, and salsa.",
    ingredients: [
      "500g ground beef",
      "8 corn tortillas",
      "2 tbsp taco seasoning",
      "100g shredded cheddar",
      "1 cup shredded lettuce",
      "Fresh salsa to serve",
    ],
    steps: [
      "Brown the ground beef in a skillet, breaking it apart as it cooks.",
      "Stir in the taco seasoning and a splash of water; simmer until thickened.",
      "Warm the tortillas in a dry pan or over an open flame.",
      "Fill each tortilla with beef, then top with lettuce, cheese, and salsa.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
  {
    id: "recipe-5",
    title: "Vegetable Pad Thai",
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&auto=format&fit=crop",
    description:
      "Stir-fried rice noodles with tofu, crunchy peanuts, and a sweet-tangy tamarind sauce.",
    ingredients: [
      "200g flat rice noodles",
      "200g firm tofu, cubed",
      "3 tbsp tamarind paste",
      "2 tbsp fish sauce (or soy sauce)",
      "2 tbsp palm sugar",
      "2 eggs",
      "100g bean sprouts",
      "50g roasted peanuts, crushed",
    ],
    steps: [
      "Soak the rice noodles in warm water until pliable, then drain.",
      "Whisk the tamarind, fish sauce, and palm sugar into a sauce.",
      "Fry the tofu until golden, then push to one side and scramble the eggs.",
      "Add the noodles and sauce, tossing until evenly coated.",
      "Fold in the bean sprouts and top with crushed peanuts before serving.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
  {
    id: "recipe-6",
    title: "Greek Salad",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop",
    description:
      "A refreshing salad of tomatoes, cucumber, olives, and feta dressed with olive oil and oregano.",
    ingredients: [
      "4 ripe tomatoes, cut into wedges",
      "1 cucumber, sliced",
      "1 red onion, thinly sliced",
      "100g Kalamata olives",
      "200g block feta cheese",
      "3 tbsp extra-virgin olive oil",
      "1 tsp dried oregano",
    ],
    steps: [
      "Combine the tomatoes, cucumber, onion, and olives in a large bowl.",
      "Drizzle with olive oil and sprinkle with dried oregano.",
      "Place the block of feta on top and finish with a little more oregano.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
  {
    id: "recipe-7",
    title: "Japanese Ramen",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80&auto=format&fit=crop",
    description:
      "A comforting bowl of ramen with a rich broth, springy noodles, soft egg, and scallions.",
    ingredients: [
      "2 portions fresh ramen noodles",
      "1L pork or chicken broth",
      "2 tbsp miso paste",
      "2 soft-boiled eggs, halved",
      "100g sliced chashu pork",
      "2 scallions, sliced",
      "1 sheet nori",
    ],
    steps: [
      "Bring the broth to a gentle simmer and whisk in the miso paste.",
      "Cook the ramen noodles separately according to package directions.",
      "Divide the noodles between two bowls and ladle over the hot broth.",
      "Top with chashu, soft-boiled egg, scallions, and nori.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
  {
    id: "recipe-8",
    title: "Classic Pancakes",
    imageUrl:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80&auto=format&fit=crop",
    description:
      "Fluffy stack of buttermilk pancakes perfect for a weekend breakfast with maple syrup.",
    ingredients: [
      "200g all-purpose flour",
      "2 tbsp sugar",
      "1 tbsp baking powder",
      "300ml buttermilk",
      "1 egg",
      "2 tbsp melted butter",
      "Maple syrup to serve",
    ],
    steps: [
      "Whisk together the flour, sugar, and baking powder.",
      "In a separate bowl, beat the buttermilk, egg, and melted butter.",
      "Combine the wet and dry ingredients until just mixed; lumps are fine.",
      "Cook ladles of batter on a greased griddle until bubbles form, then flip.",
      "Stack and serve warm with maple syrup.",
    ],
    authorId: "user-1",
    authorName: "Demo Cook",
  },
];

const amber = "#D4A056";
const blush = "#C98B8B";

const palettes = {
  light: {
    bg: "#F7F5F0",
    text: "#1A1A1A",
    heading: "#111111",
    muted: "#6B655E",
    subtle: "#9B9590",
    card: "#FFFFFF",
    cardOverlay: "#FFFFFF",
    border: "rgba(0,0,0,0.08)",
    glass: "rgba(255,255,255,0.65)",
    glassHover: "rgba(255,255,255,0.85)",
    inputBg: "rgba(255,255,255,0.5)",
    glowOpacity: 0.12,
    accentText: "#1A1A1A",
  },
  dark: {
    bg: "#0E0E10",
    text: "#F5F3EF",
    heading: "#F5F3EF",
    muted: "#8A8279",
    subtle: "#6B655E",
    card: "#15151A",
    cardOverlay: "#15151A",
    border: "rgba(255,255,255,0.10)",
    glass: "rgba(255,255,255,0.05)",
    glassHover: "rgba(255,255,255,0.10)",
    inputBg: "rgba(255,255,255,0.05)",
    glowOpacity: 0.20,
    accentText: "#0E0E10",
  },
};

type Palette = typeof palettes.light;

function Logo({ palette }: { palette: Palette }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 text-lg font-semibold tracking-tight transition-colors duration-300"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", color: palette.heading }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
        style={{ background: `linear-gradient(135deg, ${amber}, ${blush})` }}
      >
        🍽️
      </span>
      Family Recipe
    </Link>
  );
}

export default function DiscoverV5({ isDark }: { isDark?: boolean }) {
  const palette = (isDark ?? false) ? palettes.dark : palettes.light;

  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} flex min-h-screen flex-col transition-colors duration-300`}
      style={{ backgroundColor: palette.bg, color: palette.text, fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <style jsx global>{`
        @keyframes v5-reveal {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .v5-fade {
          animation: v5-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .v5-card {
          transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .v5-card:hover {
          transform: translateY(-4px);
          border-color: ${amber}73;
          box-shadow: 0 20px 40px -12px ${amber}38,
                      0 0 0 1px ${amber}1f;
        }
      `}</style>

      <header
        className="sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300"
        style={{ borderColor: palette.border, backgroundColor: palette.glass }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-8">
            <Logo palette={palette} />
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/discover"
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: palette.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.heading)}
                onMouseLeave={(e) => (e.currentTarget.style.color = palette.muted)}
              >
                Discover
              </Link>
              <Link
                href="/families"
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: palette.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.heading)}
                onMouseLeave={(e) => (e.currentTarget.style.color = palette.muted)}
              >
                Families
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 sm:inline-flex"
              style={{ borderColor: palette.border, backgroundColor: palette.glass, color: palette.heading }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = palette.glassHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = palette.glass)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300"
              style={{ backgroundColor: amber, color: palette.accentText }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full blur-[120px]"
            style={{ backgroundColor: amber, opacity: palette.glowOpacity }}
          />
          <div
            className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full blur-[100px]"
            style={{ backgroundColor: blush, opacity: palette.glowOpacity * 0.75 }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="v5-fade mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: amber }}>
                Community Cookbook
              </p>
              <h1
                className="text-4xl font-medium tracking-tight transition-colors duration-300 sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", color: palette.heading }}
              >
                Discover recipes
              </h1>
              <p
                className="mt-4 text-lg leading-relaxed transition-colors duration-300"
                style={{ color: palette.muted }}
              >
                Browse public recipes shared by the community — curated for the modern kitchen.
              </p>
            </div>

            <form
              action="/discover"
              method="get"
              className="flex w-full max-w-md gap-2 md:w-auto"
            >
              <label htmlFor="v5-q" className="sr-only">
                Search recipes
              </label>
              <input
                id="v5-q"
                name="q"
                type="search"
                placeholder="Search recipes…"
                className="h-12 flex-1 rounded-full border px-5 text-sm backdrop-blur-md transition-colors duration-300 focus-visible:outline-none"
                style={{
                  borderColor: palette.border,
                  backgroundColor: palette.inputBg,
                  color: palette.heading,
                }}
              />
              <button
                type="submit"
                className="h-12 rounded-full px-6 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: amber, color: palette.accentText }}
              >
                Search
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="v5-fade v5-card group relative flex flex-col overflow-hidden rounded-2xl border"
                style={{
                  animationDelay: `${120 + index * 80}ms`,
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${palette.cardOverlay}, ${palette.cardOverlay}30, transparent)`,
                    }}
                  />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md transition-colors duration-300"
                      style={{ backgroundColor: palette.glass, color: palette.heading }}
                    >
                      {recipe.ingredients.length} ingredients
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md"
                      style={{ backgroundColor: amber, color: palette.accentText }}
                    >
                      {recipe.steps.length} steps
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2
                    className="text-lg font-medium leading-snug transition-colors duration-300"
                    style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", color: palette.heading }}
                  >
                    {recipe.title}
                  </h2>
                  <p
                    className="line-clamp-2 text-sm leading-relaxed transition-colors duration-300"
                    style={{ color: palette.muted }}
                  >
                    {recipe.description}
                  </p>
                  <div
                    className="mt-auto pt-4 text-xs font-medium transition-colors duration-300"
                    style={{ color: palette.subtle }}
                  >
                    by {recipe.authorName}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer
        className="border-t py-12 transition-colors duration-300"
        style={{ borderColor: palette.border, backgroundColor: palette.bg }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div>
              <Logo palette={palette} />
              <p
                className="mt-3 max-w-xs text-sm leading-relaxed transition-colors duration-300"
                style={{ color: palette.muted }}
              >
                Store your family recipes, discover new ones, and keep your family&apos;s cooking together.
              </p>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm font-medium">
              <Link
                href="/about"
                className="transition-colors duration-300"
                style={{ color: palette.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.heading)}
                onMouseLeave={(e) => (e.currentTarget.style.color = palette.muted)}
              >
                About
              </Link>
              <Link
                href="/discover"
                className="transition-colors duration-300"
                style={{ color: palette.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.heading)}
                onMouseLeave={(e) => (e.currentTarget.style.color = palette.muted)}
              >
                Discover
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300"
                style={{ color: palette.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.heading)}
                onMouseLeave={(e) => (e.currentTarget.style.color = palette.muted)}
              >
                GitHub
              </a>
            </nav>
          </div>
          <div
            className="mt-10 border-t pt-6 text-xs transition-colors duration-300"
            style={{ borderColor: palette.border, color: palette.subtle }}
          >
            © {new Date().getFullYear()} Family Recipe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Abril_Fatface, Source_Sans_3 } from "next/font/google";
import { Search } from "lucide-react";

const abril = Abril_Fatface({
  variable: "--font-abril",
  subsets: ["latin"],
  weight: ["400"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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

const whitewash = "#F8F6F1";
const sea = "#2E6F7A";
const coral = "#D66D4F";
const ochre = "#D4A23A";
const ink = "#2A2A2A";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 text-xl tracking-tight"
      style={{ fontFamily: "var(--font-abril), Georgia, serif", color: sea }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
        style={{ backgroundColor: coral, color: whitewash }}
      >
        🍽️
      </span>
      Family Recipe
    </Link>
  );
}

function AzulejoPattern({ id }: { id: string }) {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <pattern id={id} x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill={sea} />
          <rect x="24" width="24" height="24" fill={whitewash} />
          <rect y="24" width="24" height="24" fill={whitewash} />
          <rect x="24" y="24" width="24" height="24" fill={sea} />
          <circle cx="12" cy="12" r="7" fill={whitewash} />
          <circle cx="36" cy="36" r="7" fill={whitewash} />
          <circle cx="36" cy="12" r="7" fill={sea} />
          <circle cx="12" cy="36" r="7" fill={sea} />
          <rect x="10" y="10" width="4" height="4" fill={coral} opacity="0.9" />
          <rect x="34" y="34" width="4" height="4" fill={coral} opacity="0.9" />
        </pattern>
      </defs>
    </svg>
  );
}

export default function DiscoverV8() {
  return (
    <div
      className={`${abril.variable} ${sourceSans.variable} flex min-h-screen flex-col`}
      style={{ backgroundColor: whitewash, color: ink, fontFamily: "var(--font-source-sans), system-ui, sans-serif" }}
    >
      <style jsx global>{`
        @keyframes v8-reveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .v8-fade {
          animation: v8-reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <AzulejoPattern id="azulejo-header" />

      <header className="sticky top-0 z-50 border-b shadow-sm" style={{ borderColor: "#E5E1D8", backgroundColor: `${whitewash}F2`, backdropFilter: "blur(10px)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/discover"
                className="text-sm font-semibold transition-colors hover:text-[#1F4F57]"
                style={{ color: sea }}
              >
                Discover
              </Link>
              <Link
                href="/families"
                className="text-sm font-semibold transition-colors hover:text-[#1F4F57]"
                style={{ color: sea }}
              >
                Families
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#2E6F7A]/10 sm:inline-flex"
              style={{ borderColor: sea, color: sea }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: coral, color: whitewash }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.12]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <rect width="100%" height="100%" fill="url(#azulejo-header)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="v8-fade mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: coral }}>
              From the sunlit market
            </p>
            <h1
              className="text-5xl tracking-tight sm:text-6xl"
              style={{ fontFamily: "var(--font-abril), Georgia, serif", color: sea }}
            >
              Discover recipes
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: `${ink}B3` }}>
              Bright, honest dishes from coastal kitchens — cooked in terra-cotta, served with lemon.
            </p>
          </div>

          <form
            action="/discover"
            method="get"
            className="v8-fade mx-auto mb-12 flex w-full max-w-lg flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="v8-q" className="sr-only">
              Search recipes
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: sea }}
              />
              <input
                id="v8-q"
                name="q"
                type="search"
                placeholder="Search recipes…"
                className="h-12 w-full rounded-lg border-2 bg-white pl-11 pr-4 text-sm placeholder:opacity-50 focus-visible:outline-none"
                style={{ borderColor: sea, color: ink }}
              />
            </div>
            <button
              type="submit"
              className="h-12 rounded-lg px-6 text-sm font-semibold text-white transition-transform hover:scale-105"
              style={{ backgroundColor: sea }}
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="v8-fade group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${80 + index * 60}ms` }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 z-10 h-20 w-20 rotate-45 transition-transform duration-500 group-hover:scale-[2.5] group-hover:opacity-20"
                  style={{ opacity: 0.35 }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" fill={sea} />
                    <rect x="24" width="24" height="24" fill={whitewash} />
                    <rect y="24" width="24" height="24" fill={whitewash} />
                    <rect x="24" y="24" width="24" height="24" fill={sea} />
                    <circle cx="12" cy="12" r="7" fill={whitewash} />
                    <circle cx="36" cy="36" r="7" fill={whitewash} />
                    <circle cx="36" cy="12" r="7" fill={sea} />
                    <circle cx="12" cy="36" r="7" fill={sea} />
                    <rect x="10" y="10" width="4" height="4" fill={coral} />
                    <rect x="34" y="34" width="4" height="4" fill={coral} />
                  </svg>
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2
                    className="text-xl font-bold leading-snug"
                    style={{ fontFamily: "var(--font-abril), Georgia, serif", color: sea }}
                  >
                    {recipe.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: `${ink}AA` }}>
                    {recipe.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs font-bold" style={{ borderColor: "#E5E1D8", color: `${ink}80` }}>
                    <span>{recipe.ingredients.length} ingredients</span>
                    <span>{recipe.steps.length} steps</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative border-t py-12" style={{ borderColor: "#E5E1D8", backgroundColor: sea }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <rect width="100%" height="100%" fill="url(#azulejo-header)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div>
              <Link
                href="/"
                className="flex items-center gap-3 text-xl tracking-tight"
                style={{ fontFamily: "var(--font-abril), Georgia, serif", color: whitewash }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
                  style={{ backgroundColor: coral, color: whitewash }}
                >
                  🍽️
                </span>
                Family Recipe
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: `${whitewash}CC` }}>
                Store your family recipes, discover new ones, and keep your family&apos;s cooking together.
              </p>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm font-semibold" style={{ color: `${whitewash}CC` }}>
              <Link href="/about" className="transition-colors hover:text-white">
                About
              </Link>
              <Link href="/discover" className="transition-colors hover:text-white">
                Discover
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                GitHub
              </a>
            </nav>
          </div>
          <div className="mt-10 border-t border-white/20 pt-6 text-xs" style={{ color: `${whitewash}99` }}>
            © {new Date().getFullYear()} Family Recipe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

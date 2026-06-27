"use client";

import Image from "next/image";
import Link from "next/link";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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

const tags = [
  "NEW",
  "FAMILY FAVE",
  "QUICK",
  "VEGGIE",
  "COMFORT",
  "FRESH",
  "WEEKEND",
  "BREAKFAST",
];

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#1a1a1a]"
      style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#1a1a1a] bg-[#fff8ef] text-base">
        🍽️
      </span>
      Family Recipe
    </Link>
  );
}

export default function DiscoverV5() {
  return (
    <div
      className={`${fraunces.variable} flex min-h-screen flex-col bg-[#ffefdb] text-[#1a1a1a]`}
    >
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px) rotate(-1deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(0);
          }
        }
        .v5-card {
          animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b-2 border-[#1a1a1a] bg-[#fff8ef] shadow-[0_4px_0_0_#1a1a1a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/discover"
                className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]/80 transition-colors hover:text-[#1a1a1a]"
              >
                Discover
              </Link>
              <Link
                href="/families"
                className="text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a]/80 transition-colors hover:text-[#1a1a1a]"
              >
                Families
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-full border-2 border-[#1a1a1a] bg-[#fff8ef] px-4 text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] shadow-[3px_3px_0_0_#1a1a1a] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#1a1a1a] sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex h-10 items-center rounded-full border-2 border-[#1a1a1a] bg-[#f4a261] px-4 text-xs font-extrabold uppercase tracking-widest text-[#1a1a1a] shadow-[3px_3px_0_0_#1a1a1a] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#1a1a1a]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-[#c73e1d] px-6 py-10 text-[#fff8ef] shadow-xl sm:px-10 sm:py-14">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#f4a261]/30" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#2a9d8f]/30" />
            <div className="relative">
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#ffefdb]/80">
                Community Collection
              </p>
              <h1
                className="text-4xl font-extrabold leading-none tracking-tight sm:text-6xl"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                Discover
                <br />
                Recipes
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#ffefdb]/90">
                Bold flavors, timeless techniques, and the stories behind every
                dish.
              </p>
            </div>
          </div>

          <form
            action="/discover"
            method="get"
            className="mx-auto mb-10 flex w-full max-w-xl gap-3"
          >
            <label htmlFor="v5-q" className="sr-only">
              Search recipes
            </label>
            <input
              id="v5-q"
              name="q"
              type="search"
              placeholder="Find your next favorite…"
              className="h-12 flex-1 rounded-full border-2 border-[#1a1a1a] bg-[#fff8ef] px-5 text-sm font-semibold text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 shadow-[4px_4px_0px_0px_#1a1a1a] transition-all focus-visible:outline-none focus-visible:shadow-[2px_2px_0px_0px_#1a1a1a]"
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-[#2a9d8f] px-6 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#1a1a1a] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a9d8f] focus-visible:ring-offset-2"
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="v5-card group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#1a1a1a] bg-[#fff8ef] shadow-[6px_6px_0px_0px_#1a1a1a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_#1a1a1a]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-[#1a1a1a]">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-[#f4a261] px-3 py-1 text-xs font-extrabold text-[#1a1a1a] shadow-sm">
                    {tags[index]}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2
                    className="text-xl font-bold leading-tight text-[#1a1a1a]"
                    style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {recipe.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#1a1a1a]/70">
                    {recipe.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-[#1a1a1a]/20 pt-4">
                    <div className="flex flex-col gap-0.5 text-xs font-bold text-[#1a1a1a]/70">
                      <span>{recipe.ingredients.length} ingredients</span>
                      <span>{recipe.steps.length} steps</span>
                    </div>
                    <span className="text-xs font-bold text-[#c73e1d]">
                      @{recipe.authorName}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-[#1a1a1a] bg-[#1a1a1a] py-12 text-[#fff8ef]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-[#fff8ef]"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c73e1d] text-lg">
                  🍽️
                </span>
                Family Recipe
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#fff8ef]/70">
                Bold recipes, timeless traditions, and the stories behind every
                family meal.
              </p>
            </div>
            <nav className="flex flex-wrap gap-8 text-sm font-extrabold uppercase tracking-widest text-[#fff8ef]/80">
              <Link
                href="/about"
                className="transition-colors hover:text-[#fff8ef]"
              >
                About
              </Link>
              <Link
                href="/discover"
                className="transition-colors hover:text-[#fff8ef]"
              >
                Discover
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#fff8ef]"
              >
                GitHub
              </a>
            </nav>
          </div>
          <div className="mt-10 border-t border-[#fff8ef]/10 pt-6 text-xs text-[#fff8ef]/50">
            © {new Date().getFullYear()} Family Recipe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

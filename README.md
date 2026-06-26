# Family Recipe

> Store your family recipes, discover new ones, and keep your family's cooking together — even when you move out.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-1E293B)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![License](https://img.shields.io/badge/License-MIT-yellow)

## What It Is

Family Recipe is a recipe box where you keep your recipes, make them public for anyone to discover, and create private family groups to share recipes with relatives. When someone leaves a family, the recipes they added stay with the family and keep their attribution — so moving out doesn't mean losing the family cookbook.

## Features

- **Recipes**: Create, edit, and delete recipes with ingredients, steps, and an image URL. Set visibility per recipe — Private, Public, Unlisted, or Family.
- **Discovery**: Browse public recipes on `/discover` with title search. View public cook profiles at `/u/[id]`.
- **Families**: Create a family, share a join link, join, leave, transfer ownership, or delete. Family-scoped recipes are visible only to members. Recipes from former members stay with the family and retain attribution.
- **Auth**: Email + password authentication (Credentials provider) with JWT-based sessions.

## Screenshots

*Screenshots coming soon — check back after the next release.*

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, Server Actions
- [Prisma 7](https://www.prisma.io) + SQLite (better-sqlite3 adapter)
- [Auth.js v5](https://authjs.dev) — Credentials provider, JWT sessions
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript 5](https://www.typescriptlang.org)

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/family-recipe.git
   cd family-recipe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then generate an `AUTH_SECRET`:
   ```bash
   npx auth secret
   # or: openssl rand -base64 32
   ```
   Paste the output into `.env` as `AUTH_SECRET`.

4. **Create the database and apply migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database with demo data** (optional)
   ```bash
   npx prisma db seed
   ```
   This creates a demo account:
   - **Email**: `demo@recipes.app`
   - **Password**: `password123`

6. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Apply migrations and generate client |
| `npx prisma db seed` | Seed the database with demo data |
| `npx prisma studio` | Open Prisma Studio to browse the database |

## Project Structure

```
app/
├── (app)/          Routes: home (/), recipes, discover, families, /u/[id]
├── (auth)/         Authentication pages: login, signup
├── api/auth/       Auth.js API route handler
├── components/     React components (RecipeCard, Navbar, forms, buttons)
├── lib/            Repositories, server actions, auth config, types
├── globals.css     Tailwind v4 global styles
└── layout.tsx      Root layout
prisma/
├── schema.prisma   Data model
├── migrations/     Migration history
└── seed.ts         Demo data seeder
```

## Data Model

| Model | Description |
|-------|-------------|
| **User** | Email, name, bcrypt password hash |
| **Recipe** | Title, description, image URL, ingredients (JSON-in-TEXT), steps (JSON-in-TEXT), visibility, optional familyId |
| **Family** | Name, owner (FK to User) |
| **FamilyMember** | Join table linking User ↔ Family with role (OWNER or MEMBER) |

Ingredients and steps are stored as JSON-encoded strings in TEXT columns — the repository layer handles serialization so the rest of the app works with plain `string[]` arrays.

## How Visibility Works

| Visibility | Who can view | Listed on Discover |
|------------|-------------|--------------------|
| `PRIVATE` | Only the author | No |
| `PUBLIC` | Anyone | Yes |
| `UNLISTED` | Anyone with the link | No |
| `FAMILY` | Family members only | No |

## Roadmap

This is an MVP. Ideas for future iterations:

- Recipe comments and discussions
- "I made this" cook log with photo uploads
- Image uploads (currently URL-only)
- Tags and categories for recipes
- Ratings and favorites
- Collections / cookbooks
- Follow system and activity feed

## Contributing

Pull requests are welcome! Fork the repo, create a feature branch, and open a PR. Run `npm run lint` before submitting.

## License

[MIT](LICENSE)

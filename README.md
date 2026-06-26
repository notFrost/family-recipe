# Family Recipe

> Store your family recipes, discover new ones, and keep your family's cooking together — even when you move out.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-1E293B)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Turso](https://img.shields.io/badge/Turso-libSQL-00D9FF)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Live demo:** [family-recipe-nine.vercel.app](https://family-recipe-nine.vercel.app)

Log in with the demo account — `demo@recipes.app` / `password123` — or create your own.

## What It Is

Family Recipe is a recipe box where you keep your recipes, make them public for anyone to discover, and create private family groups to share recipes with relatives. When someone leaves a family, the recipes they added stay with the family and keep their attribution — so moving out doesn't mean losing the family cookbook.

## Features

### Recipes
- Create, edit, and delete recipes with a title, description, image URL, ingredients list, and step-by-step instructions
- Four visibility levels per recipe (see [How Visibility Works](#how-visibility-works))
- Live image preview when creating a recipe — paste any image URL and see it before saving
- Author attribution is preserved even if the author leaves a family

### Discovery
- Browse all public recipes on `/discover`
- Search public recipes by title
- View a cook's public profile and their shared recipes at `/u/[id]`

### Families
- Create a family group and share a join link with relatives
- Join, leave, transfer ownership, or delete a family
- Family-scoped recipes are visible only to members
- Recipes from former members stay with the family and retain attribution (marked "former")
- Owners can remove members and transfer ownership to another member

### Authentication
- Email + password registration and login (Auth.js v5 Credentials provider)
- JWT-based stateless sessions — no session table in the database
- Passwords hashed with bcrypt (cost factor 12)
- Rate limiting on login (10/min) and signup (5/min) via Upstash Redis — fails open if Redis is unavailable
- Author scoping on every mutation — `authorId` comes from the session, never the form, so it can't be spoofed
- Ownership checks on edit/delete — you can only modify your own recipes and families you own

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) — App Router, Server Actions, Turbopack |
| Database | [Turso](https://turso.tech) (libSQL) — distributed SQLite over HTTP |
| ORM | [Prisma 7](https://www.prisma.io) with `@prisma/adapter-libsql` driver adapter |
| Auth | [Auth.js v5](https://authjs.dev) — Credentials provider, JWT sessions |
| Rate limiting | [Upstash Redis](https://upstash.com) + `@upstash/ratelimit` (sliding window) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Hosting | [Vercel](https://vercel.com) — serverless functions, image optimization |
| Images | `next/image` optimizer — accepts any HTTPS image URL |

## Getting Started

### Prerequisites
- Node.js 20+
- A [Turso](https://turso.tech) account (free tier) — or use a local libSQL file for development
- (Optional) An [Upstash](https://upstash.com) account for rate limiting — the app works without it

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/notFrost/family-recipe.git
   cd family-recipe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   The `postinstall` script runs `prisma generate` automatically.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `DATABASE_URL` — `file:./local.db` for local dev, or your Turso URL (`libsql://...`) for remote
   - `DATABASE_AUTH_TOKEN` — your Turso token (leave empty for local file DB)
   - `AUTH_SECRET` — generate with `npx auth secret` or `openssl rand -base64 32`
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — optional, for rate limiting

4. **Create the database and apply migrations**

   **Local development (file-based libSQL):**
   ```bash
   npx prisma migrate deploy
   ```
   This creates `local.db` and applies all migrations.

   **Remote (Turso):** The Prisma CLI doesn't support `libsql://` URLs for migrations. Use the included script:
   ```bash
   npx tsx scripts/apply-schema-turso.mts
   ```

5. **Seed the database with demo data** (optional)
   ```bash
   npm run db:seed
   ```
   This creates a demo account (`demo@recipes.app` / `password123`) with 8 recipes and a demo family.

   > **Note:** The seed is destructive — it wipes all recipes/families before re-inserting demo data. A production guard refuses to run it against a remote Turso database unless `SEED_FORCE=true` is set.

6. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate` via postinstall) |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed the database with demo data |
| `npx tsx scripts/apply-schema-turso.mts` | Apply schema to a remote Turso database |
| `npx tsx scripts/verify-turso.mts` | Verify row counts on a remote Turso database |
| `npx prisma generate` | Regenerate the Prisma client |
| `npx prisma studio` | Open Prisma Studio to browse the database |

## Project Structure

```
app/
├── (app)/              Routes: home (/), recipes, discover, families, /u/[id]
├── (auth)/             Authentication pages: login, signup
├── api/auth/           Auth.js API route handler
├── components/         React components (RecipeCard, Navbar, forms, buttons)
├── lib/                Repositories, server actions, auth config, rate limiter, types
├── generated/prisma/   Prisma client (gitignored, generated at install)
├── globals.css         Tailwind v4 global styles
└── layout.tsx          Root layout
prisma/
├── schema.prisma       Data model
├── migrations/         Migration history
└── seed.ts             Demo data seeder (with production guard)
scripts/
├── apply-schema-turso.mts  Apply schema to Turso (for remote DBs)
└── verify-turso.mts        Verify row counts on Turso
```

## Data Model

| Model | Description |
|-------|-------------|
| **User** | Email (unique), name, bcrypt password hash |
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

## Deployment

The app is deployed on Vercel with a Turso database. To deploy your own:

1. Fork the repo
2. Import it on [Vercel](https://vercel.com/new)
3. Set these environment variables in the Vercel dashboard:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Turso connection URL (`libsql://...`) |
| `DATABASE_AUTH_TOKEN` | Yes | Turso auth token |
| `AUTH_SECRET` | Yes | JWT signing secret (generate with `npx auth secret`) |
| `AUTH_TRUST_HOST` | Yes | Set to `true` for Vercel |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL (for rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token (for rate limiting) |

4. Deploy — Vercel runs `npm install` (triggers `postinstall: prisma generate`) then `npm run build`
5. Apply the database schema to your Turso DB: `npx tsx scripts/apply-schema-turso.mts`
6. Seed demo data (one-time): `SEED_FORCE=true npm run db:seed`

## Roadmap

This is an MVP. Ideas for future iterations:

- Recipe comments and discussions
- "I made this" cook log with photo uploads
- Image uploads (currently URL-only)
- Tags and categories for recipes
- Ratings and favorites
- Collections / cookbooks
- Follow system and activity feed
- Password reset via email (Resend)
- Email verification

## Contributing

Pull requests welcome! The project uses a `dev` → `prod` branch workflow:

1. Fork the repo
2. Create a feature branch off `dev`
3. Open a PR targeting `dev`
4. Test on the Vercel preview URL
5. Merge to `dev`, then merge `dev` to `prod` to deploy

Run `npm run lint` before submitting.

## License

[MIT](LICENSE)
